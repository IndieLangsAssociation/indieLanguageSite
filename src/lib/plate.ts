/**
 * Every logo sits in a plate outlined in one of the two accents, chosen from the
 * slug so it never changes between builds. Two colours, not six — the board needs
 * rhythm, not confetti.
 */
export function plateAccent(slug: string): 'flare' | 'signal' {
	// FNV-1a rather than a naive polynomial hash — it spreads short slugs more
	// evenly, which is all this needs to do.
	let hash = 0x811c9dc5;
	for (let i = 0; i < slug.length; i++) {
		hash ^= slug.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193) >>> 0;
	}
	return (hash >>> 2) & 1 ? 'signal' : 'flare';
}

/** Shown in the plate when a language has no logo. */
export function initialOf(name: string): string {
	const first = [...name].find((char) => /[\p{L}\p{N}]/u.test(char));
	return (first ?? name[0] ?? '?').toUpperCase();
}
