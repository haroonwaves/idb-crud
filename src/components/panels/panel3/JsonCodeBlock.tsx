import { useMemo } from 'preact/hooks';

interface JsonCodeBlockProps {
	json: string;
	editable?: boolean;
	onChange?: (val: string) => void;
}

function renderValueToken(valText: string) {
	const trimmed = valText.trim();
	const hasTrailingComma = trimmed.endsWith(',');
	const core = hasTrailingComma ? trimmed.slice(0, -1) : trimmed;

	let colorClass = 'text-gray-800';
	if (core.startsWith('"')) {
		colorClass = 'text-amber-800';
	} else if (core === 'true' || core === 'false' || core === 'null') {
		colorClass = 'font-medium text-indigo-600';
	} else if (!Number.isNaN(Number(core)) && core.length > 0) {
		colorClass = 'text-purple-600';
	}

	return (
		<>
			<span className={colorClass}>{core}</span>
			{hasTrailingComma && <span className="text-gray-500">,</span>}
		</>
	);
}

function parseJsonKeyValue(trimmed: string): { keyStr: string; valRest: string } | null {
	if (!trimmed.startsWith('"')) return null;

	let isEscaped = false;
	let endQuoteIdx = -1;

	for (let i = 1; i < trimmed.length; i++) {
		const char = trimmed[i];
		if (isEscaped) {
			isEscaped = false;
		} else if (char === '\\') {
			isEscaped = true;
		} else if (char === '"') {
			endQuoteIdx = i;
			break;
		}
	}

	if (endQuoteIdx === -1) return null;

	const afterKey = trimmed.slice(endQuoteIdx + 1).trimStart();
	if (!afterKey.startsWith(':')) return null;

	return {
		keyStr: trimmed.slice(0, endQuoteIdx + 1),
		valRest: afterKey.slice(1).trimStart(),
	};
}

function highlightJsonLine(line: string): preact.VNode {
	const trimmed = line.trimStart();
	const indentLen = line.length - trimmed.length;
	const indent = line.slice(0, indentLen);

	// Check if this line is a "key": value pair
	const parsedKeyVal = parseJsonKeyValue(trimmed);
	if (parsedKeyVal) {
		return (
			<>
				<span>{indent}</span>
				<span className="font-medium text-sky-700">{parsedKeyVal.keyStr}</span>
				<span className="text-gray-500">: </span>
				{renderValueToken(parsedKeyVal.valRest)}
			</>
		);
	}

	return (
		<>
			<span>{indent}</span>
			{renderValueToken(trimmed)}
		</>
	);
}

export function JsonCodeBlock({ json, editable = false, onChange }: Readonly<JsonCodeBlockProps>) {
	const lines = useMemo(() => json.split('\n'), [json]);

	if (editable) {
		return (
			<textarea
				rows={Math.min(20, Math.max(8, lines.length + 1))}
				value={json}
				onChange={(e) => onChange?.((e.target as HTMLTextAreaElement).value)}
				className="w-full rounded-lg border border-gray-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
			/>
		);
	}

	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200/90 bg-gray-50/60 p-3 font-mono text-[11px] leading-relaxed select-text">
			<table className="w-full border-collapse">
				<tbody>
					{lines.map((line, idx) => (
						<tr key={idx} className="hover:bg-gray-100/40">
							<td className="w-8 select-none pr-3 text-right font-mono text-gray-300">
								{idx + 1}
							</td>
							<td className="pl-2 whitespace-pre text-gray-800 font-mono">
								{highlightJsonLine(line)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
