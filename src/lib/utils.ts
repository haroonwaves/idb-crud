import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

let shadowRootInstance: ShadowRoot | null = null;

export function setShadowRoot(root: ShadowRoot) {
	shadowRootInstance = root;
}

export function getShadowRoot(): ShadowRoot | null {
	if (shadowRootInstance) return shadowRootInstance;
	return document.getElementsByTagName('idb-crud')[0]?.shadowRoot || null;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function formatBinaryOrSpecial(val: unknown): string | null {
	if (typeof Blob !== 'undefined' && val instanceof Blob) {
		const typeSuffix = val.type ? `, type: ${val.type}` : '';
		return `[Blob: ${val.size} bytes${typeSuffix}]`;
	}

	if (typeof ArrayBuffer !== 'undefined') {
		if (val instanceof ArrayBuffer) return `[ArrayBuffer: ${val.byteLength} bytes]`;
		if (ArrayBuffer.isView(val)) return `[${val.constructor.name}: ${val.byteLength} bytes]`;
	}

	return null;
}

function parseJsonIfString(val: string): unknown {
	const trimmed = val.trim();
	if (
		(trimmed.startsWith('{') && trimmed.endsWith('}')) ||
		(trimmed.startsWith('[') && trimmed.endsWith(']'))
	) {
		try {
			return parseValueForDisplay(JSON.parse(trimmed));
		} catch {
			return val;
		}
	}
	return val;
}

export function parseValueForDisplay(val: unknown, seen = new WeakSet()): unknown {
	if (typeof val === 'string') return parseJsonIfString(val);
	if (typeof val === 'bigint') return val.toString();
	if (val instanceof Date) return val.toISOString();
	if (val instanceof RegExp) return val.toString();

	const special = formatBinaryOrSpecial(val);
	if (special !== null) return special;

	if (Array.isArray(val)) {
		if (seen.has(val)) return '[Circular]';
		seen.add(val);
		return val.map((item) => parseValueForDisplay(item, seen));
	}

	if (val !== null && typeof val === 'object') {
		if (seen.has(val)) return '[Circular]';
		seen.add(val);
		const res: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(val)) {
			res[k] = parseValueForDisplay(v, seen);
		}
		return res;
	}

	return val;
}

export function safeJsonStringify(val: unknown, indent: number = 2): string {
	try {
		return JSON.stringify(
			val,
			(_key, value) => {
				if (typeof value === 'bigint') return value.toString();
				if (value instanceof Date) return value.toISOString();
				return value;
			},
			indent
		);
	} catch {
		return String(val);
	}
}
