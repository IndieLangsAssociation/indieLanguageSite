import type { StreamParser } from '@codemirror/language';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { c } from '@codemirror/legacy-modes/mode/clike';
import { python } from '@codemirror/legacy-modes/mode/python';
import type { Highlight } from '$lib/content/types';

/**
 * X3, ported from the CodeMirror 5 mode the old site loaded as a global script
 * (public/x3Mode.js). CM6's StreamParser takes the same {startState, token}
 * shape, so this is close to the original.
 */
const x3Keywords = [
	'reg', 'reg_len', 'goto', 'if', 'else', 'end', 'while', 'def',
	'fncend', 'call', '##', 'log', 'prt', 'wait', 'flush', 'exit', 'cls',
	'inp', 'add', 'sub', 'mul', 'div', 'mod', 'sqrt', 'fastmath',
	'w_file', 'r_file', 'a_file', 'del_file',
	'create_dir', 'delete_dir', 'search_file'
];
const x3Types = ['int', 'string', 'float', 'bool', 'double'];
const x3Builtins = ['$var', '$pi', '$x', '$y', '$z'];

const asAlternation = (words: string[]) =>
	words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

const x3Keyword = new RegExp(`^(${asAlternation(x3Keywords)})\\b`, 'i');
const x3Type = new RegExp(`^(${asAlternation(x3Types)})\\b`, 'i');
const x3Builtin = new RegExp(`^(${asAlternation(x3Builtins)})`, 'i');

export const x3: StreamParser<Record<string, never>> = {
	name: 'x3',
	startState: () => ({}),
	token(stream) {
		if (stream.eatSpace()) return null;
		if (stream.match(/#.*$/)) return 'comment';
		if (stream.match(/"(?:[^\\"]|\\.)*"?/)) return 'string';
		if (stream.match(/^\d+(\.\d+)?/)) return 'number';
		if (stream.match(x3Keyword)) return 'keyword';
		if (stream.match(x3Type)) return 'type';
		if (stream.match(x3Builtin)) return 'variableName.special';
		if (stream.match(/[+\-*/%=<>&|!]+/)) return 'operator';
		stream.next();
		return null;
	}
};

/**
 * W#. Zig-flavoured, but type annotations are optional, so the interesting part
 * of a line is often the names rather than the types.
 */
const wsKeywords = new Set([
	'const', 'var', 'fn', 'return', 'if', 'else', 'while', 'for', 'break', 'continue',
	'catch', 'try', 'defer', 'struct', 'enum', 'union', 'pub', 'and', 'or', 'not'
]);
const wsTypes = new Set([
	'i8', 'i16', 'i32', 'i64', 'u8', 'u16', 'u32', 'u64', 'f32', 'f64',
	'bool', 'void', 'str', 'Number', 'Integer'
]);
const wsAtoms = new Set(['true', 'false', 'null', 'undefined']);

export const wsharp: StreamParser<Record<string, never>> = {
	name: 'wsharp',
	startState: () => ({}),
	token(stream) {
		if (stream.eatSpace()) return null;
		if (stream.match('//')) {
			stream.skipToEnd();
			return 'comment';
		}
		if (stream.match(/^"(?:[^\\"]|\\.)*"?/)) return 'string';
		if (stream.match(/^\d+(\.\d+)?/)) return 'number';
		// Builtins are spelled @import, @sizeOf and so on.
		if (stream.match(/^@[A-Za-z_]\w*/)) return 'builtin';
		// `!{NotFound, IoFailed}str` and `?T` are types, not operators.
		if (stream.match(/^[!?](?=[A-Za-z_{])/)) return 'typeName';

		const word = stream.match(/^[A-Za-z_]\w*/);
		if (word && typeof word !== 'boolean') {
			const value = word[0];
			if (wsKeywords.has(value)) return 'keyword';
			if (wsTypes.has(value)) return 'typeName';
			if (wsAtoms.has(value)) return 'atom';
			// A name immediately followed by `(` is being called.
			return stream.peek() === '(' ? 'variableName' : null;
		}

		if (stream.match(/^[+\-*/%=<>&|!?.:]+/)) return 'operator';
		stream.next();
		return null;
	}
};

export const MODES: Record<Highlight, StreamParser<never> | null> = {
	wsharp: wsharp as StreamParser<never>,
	plain: null,
	x3: x3 as StreamParser<never>,
	ruby: ruby as StreamParser<never>,
	clike: c as StreamParser<never>,
	python: python as StreamParser<never>
};

export function modeFor(highlight: Highlight | undefined): StreamParser<never> | null {
	return highlight ? (MODES[highlight] ?? null) : null;
}
