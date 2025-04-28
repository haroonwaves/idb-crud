import { CopyIcon, Plus, Trash } from 'lucide-react';
import { createRecord, deleteSelectedRows } from '@/src/databases/actions';
import { state } from '@/src/state/state';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/src/components/ui/dialog';
import { useEffect, useState } from 'preact/hooks';
import { JsonViewer } from '@/src/components/panels/panel3/JsonViewer';
import { Button } from '@/src/components/ui/Button';

async function copySelectedRows() {
	const selectedRows = state.dataTable.selectedRows.value;
	await navigator.clipboard.writeText(JSON.stringify(selectedRows, null, 2));
}

function getPlaceholderRow() {
	const columns = state.dataTable.columns.value;
	const placeholderRow: Record<string, undefined> = {};

	columns.forEach((column) => {
		placeholderRow[column] = undefined;
	});

	return placeholderRow;
}

export function ActionButtons({ selectedRows }: Readonly<{ selectedRows: object[] }>) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [placeholderRow, setPlaceholderRow] = useState<object>({});

	useEffect(() => {
		if (isDialogOpen) setPlaceholderRow(getPlaceholderRow());
	}, [isDialogOpen]);

	return (
		<>
			<div className="absolute right-[50%]">
				<div className="flex h-9 items-center justify-center gap-4 rounded-md border px-3 py-1">
					<Plus
						className={`size-4 ${selectedRows.length === 0 ? 'cursor-pointer' : 'opacity-50'}`}
						onClick={() => selectedRows.length === 0 && setIsDialogOpen(true)}
					/>
					<Trash
						className={`size-4 ${selectedRows.length === 0 ? 'opacity-50' : 'cursor-pointer'}`}
						onClick={() => selectedRows.length > 0 && void deleteSelectedRows()}
					/>
					<CopyIcon
						className={`size-4 ${selectedRows.length === 0 ? 'opacity-50' : 'cursor-pointer'}`}
						onClick={() => selectedRows.length > 0 && void copySelectedRows()}
					/>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Record</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<JsonViewer
							title={'new_row'}
							value={placeholderRow}
							onEdit={({ updated_src }) => setPlaceholderRow(updated_src)}
							onAdd={({ updated_src }) => setPlaceholderRow(updated_src)}
						/>
					</div>
					<DialogFooter>
						<Button
							className="cursor-pointer"
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								void createRecord(placeholderRow).then(() => {
									setIsDialogOpen(false);
								});
							}}
							className="cursor-pointer"
						>
							Add
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
