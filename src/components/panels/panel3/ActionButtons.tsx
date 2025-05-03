import { Check, CopyIcon, Plus, Trash } from 'lucide-react';
import { createRecord, deleteSelectedRows } from '@/src/databases/actions';
import { state } from '@/src/state/state';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/src/components/ui/Dialog';
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
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [placeholderRow, setPlaceholderRow] = useState<object>({});
	const [showCopied, setShowCopied] = useState(false);

	useEffect(() => {
		if (isCreateDialogOpen) setPlaceholderRow(getPlaceholderRow());
	}, [isCreateDialogOpen]);

	const handleCopy = async () => {
		if (selectedRows.length > 0) {
			await copySelectedRows();
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 1000);
		}
	};

	return (
		<>
			<div className="absolute flex w-full items-center justify-center bg-white">
				<div className="flex h-9 items-center justify-center gap-4 rounded-md border px-3 py-1">
					<Plus
						className={`size-4 ${selectedRows.length === 0 ? 'cursor-pointer' : 'opacity-50'}`}
						onClick={() => selectedRows.length === 0 && setIsCreateDialogOpen(true)}
					/>
					<Trash
						className={`size-4 ${selectedRows.length === 0 ? 'opacity-50' : 'cursor-pointer'}`}
						onClick={() => selectedRows.length > 0 && setIsDeleteDialogOpen(true)}
					/>
					<div className="relative">
						{showCopied ? (
							<Check className="animate-scale-in size-4 text-green-500" />
						) : (
							<CopyIcon
								className={`size-4 ${selectedRows.length === 0 ? 'opacity-50' : 'cursor-pointer'}`}
								onClick={handleCopy}
							/>
						)}
					</div>
				</div>
			</div>

			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
							onClick={() => setIsCreateDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								void createRecord(placeholderRow).then(() => {
									setIsCreateDialogOpen(false);
								});
							}}
							className="cursor-pointer"
						>
							Add
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action will permanently delete the selected record(s) from table
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							className="cursor-pointer"
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								void deleteSelectedRows().then(() => {
									setIsDeleteDialogOpen(false);
								});
							}}
							className="cursor-pointer"
							variant="destructive"
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
