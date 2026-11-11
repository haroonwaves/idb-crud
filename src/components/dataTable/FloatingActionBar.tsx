import { useState } from 'preact/hooks';
import { Trash2, Download, Copy, Check } from 'lucide-react';
import { deleteSelectedRows, exportSelectedRows, copySelectedRows } from '@/databases/actions';
import { setRowSelectionRef } from '@/components/dataTable/DataTable';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

export function FloatingActionBar({ selectedCount }: Readonly<{ selectedCount: number }>) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	if (selectedCount === 0) return null;

	const handleCopy = async () => {
		await copySelectedRows();
		setCopied(true);
		setTimeout(() => setCopied(false), 1200);
	};

	return (
		<>
			<div className="absolute bottom-13 left-1/2 z-20 -translate-x-1/2 select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
				<div className="flex items-center gap-1 rounded-xl border border-gray-200/90 bg-white/95 px-2.5 py-1.5 shadow-lg backdrop-blur">
					{/* Delete Button */}
					<button
						type="button"
						onClick={() => setIsDeleteDialogOpen(true)}
						className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
					>
						<Trash2 className="size-3.5 text-red-500" strokeWidth={1.8} />
						<span>Delete</span>
					</button>

					<div className="mx-1 h-3.5 w-[1px] bg-gray-200" />

					{/* Export Button */}
					<button
						type="button"
						onClick={() => void exportSelectedRows()}
						className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
					>
						<Download className="size-3.5 text-gray-600" strokeWidth={1.8} />
						<span>Export</span>
					</button>

					<div className="mx-1 h-3.5 w-[1px] bg-gray-200" />

					{/* Copy Button */}
					<button
						type="button"
						onClick={() => void handleCopy()}
						className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
					>
						{copied ? (
							<>
								<Check className="size-3.5 text-emerald-600" strokeWidth={2} />
								<span className="text-emerald-600">Copied</span>
							</>
						) : (
							<>
								<Copy className="size-3.5 text-gray-600" strokeWidth={1.8} />
								<span>Copy</span>
							</>
						)}
					</button>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action will permanently delete {selectedCount}{' '}
							{selectedCount === 1 ? 'record' : 'records'} from the table.
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
									setRowSelectionRef.current?.({});
								});
							}}
							className="cursor-pointer bg-red-600 hover:bg-red-700"
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
