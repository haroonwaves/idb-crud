import { Check, CopyIcon, Trash } from 'lucide-react';
import { deleteSelectedRows } from '@/databases/actions';
import { state } from '@/state/state';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/Dialog';
import { useState } from 'preact/hooks';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { setRowSelectionRef } from '@/components/dataTable/DataTable';
import { ActionIconsContainer } from '@/components/ui/ActionIconsContainer';

async function copySelectedRows() {
	const selectedRows = state.dataTable.selectedRows.value;
	await navigator.clipboard.writeText(JSON.stringify(selectedRows, null, 2));
}

export function ActionButtons({ selectedRows }: Readonly<{ selectedRows: object[] }>) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [showCopied, setShowCopied] = useState(false);

	const handleCopy = async () => {
		if (selectedRows.length > 0) {
			await copySelectedRows();
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 1000);
		}
	};

	return (
		<div className="pb-4">
			<ActionIconsContainer>
				<Tooltip content="Delete selected record(s)">
					<Trash
						className={`size-4 ${selectedRows.length === 0 ? 'opacity-50' : 'hover:text-primary cursor-pointer'}`}
						onClick={() => selectedRows.length > 0 && setIsDeleteDialogOpen(true)}
					/>
				</Tooltip>
				<div className="relative">
					{showCopied ? (
						<Check className="animate-scale-in size-4 text-green-500" />
					) : (
						<Tooltip content="Copy selected record(s)">
							<CopyIcon
								className={`size-4 ${selectedRows.length === 0 ? 'opacity-50' : 'hover:text-primary cursor-pointer'}`}
								onClick={handleCopy}
							/>
						</Tooltip>
					)}
				</div>
			</ActionIconsContainer>

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
									setRowSelectionRef.current?.({});
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
		</div>
	);
}
