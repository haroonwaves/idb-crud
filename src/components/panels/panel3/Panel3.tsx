import { state } from '@/state/state';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { X, Copy, Check, Edit3 } from 'lucide-react';
import { setRowSelectionRef } from '@/components/dataTable/DataTable';
import { JsonCodeBlock } from '@/components/panels/panel3/JsonCodeBlock';
import { updateRecordDirect } from '@/databases/actions';
import { Button } from '@/components/ui/Button';
import { parseValueForDisplay, safeJsonStringify } from '@/lib/utils';

export { parseValueForDisplay };

function handleClose() {
	setRowSelectionRef.current?.({});
}

export function Panel3() {
	const selectedRows = state.dataTable.selectedRows.value;
	const selectedTable = state.database.table.value;

	const [jsonCopied, setJsonCopied] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedJson, setEditedJson] = useState('');
	const [editError, setEditError] = useState('');

	const primaryRecord = selectedRows[0] as Record<string, unknown> | undefined;

	useEffect(() => {
		if (primaryRecord) {
			setEditedJson(safeJsonStringify(parseValueForDisplay(primaryRecord), 2));
			setIsEditing(false);
			setEditError('');
		}
	}, [primaryRecord]);

	const displayRows = useMemo(() => {
		return selectedRows.map((row) => parseValueForDisplay(row));
	}, [selectedRows]);

	const handleCopyAllJson = async () => {
		const textToCopy = safeJsonStringify(displayRows, 2);
		await navigator.clipboard.writeText(textToCopy);
		setJsonCopied(true);
		setTimeout(() => setJsonCopied(false), 1200);
	};

	const handleSaveEdit = async () => {
		if (!primaryRecord) return;
		try {
			const parsed: unknown = JSON.parse(editedJson);
			if (typeof parsed !== 'object' || parsed === null) {
				throw new TypeError('Record must be a JSON object');
			}
			await updateRecordDirect(primaryRecord, parsed);
			setIsEditing(false);
			setEditError('');
		} catch (error: unknown) {
			setEditError(error instanceof Error ? error.message : 'Invalid JSON format');
		}
	};

	if (!selectedTable || selectedRows.length === 0 || !primaryRecord) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-6 text-center select-none">
				<p className="text-xs text-gray-400">Select a record to view details</p>
			</div>
		);
	}

	const rawJsonDisplay = safeJsonStringify(
		displayRows.length === 1 ? [displayRows[0]] : displayRows,
		2
	);

	return (
		<div className="flex h-full flex-col overflow-hidden bg-white select-none">
			{/* Panel Header */}
			<div className="flex h-11 shrink-0 items-center justify-between border-b border-gray-100 px-4 bg-white">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-semibold tracking-tight text-gray-900">Selected Record</h3>
					<span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-gray-500">
						JSON
					</span>
				</div>
				<button
					type="button"
					onClick={handleClose}
					className="flex size-6 cursor-pointer items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
					title="Close panel"
				>
					<X className="size-4" />
				</button>
			</div>

			{/* Raw JSON Section */}
			<div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
				<JsonCodeBlock
					json={isEditing ? editedJson : rawJsonDisplay}
					editable={isEditing}
					onChange={setEditedJson}
				/>

				{editError && <p className="text-xs text-red-500">{editError}</p>}

				<div className="flex items-center gap-2 pt-1">
					{isEditing ? (
						<>
							<Button
								size="sm"
								variant="outline"
								className="h-7 cursor-pointer text-xs"
								onClick={() => {
									setIsEditing(false);
									setEditedJson(safeJsonStringify(parseValueForDisplay(primaryRecord), 2));
									setEditError('');
								}}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								className="h-7 cursor-pointer bg-blue-600 text-xs text-white hover:bg-blue-700"
								onClick={() => void handleSaveEdit()}
							>
								Save Record
							</Button>
						</>
					) : (
						<>
							<button
								type="button"
								onClick={() => void handleCopyAllJson()}
								className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50"
							>
								{jsonCopied ? (
									<>
										<Check className="size-3.5 text-emerald-600" />
										<span className="text-emerald-600">Copied</span>
									</>
								) : (
									<>
										<Copy className="size-3.5 text-gray-600" />
										<span>Copy JSON</span>
									</>
								)}
							</button>

							<button
								type="button"
								onClick={() => setIsEditing(true)}
								className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50"
							>
								<Edit3 className="size-3.5 text-gray-600" />
								<span>Edit</span>
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
