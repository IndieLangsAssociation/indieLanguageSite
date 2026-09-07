// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {}
}

declare module '*.md?raw' {
	const content: string;
	export default content;
}

export {};
