import { setRowSelectionRef } from '@/src/components/dataTable/DataTable';
import { Tooltip } from '@/src/components/ui/Tooltip';
import { exportRecords, importRecords, loadTable } from '@/src/databases/actions';
import { Download as Import, RefreshCcw, Upload as Export, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/src/components/ui/Dialog';
import { Button } from '@/src/components/ui/Button';
import { JsonViewer } from '@/src/components/panels/panel3/JsonViewer';
import { createRecord } from '@/src/databases/actions';
import { state } from '@/src/state/state';
import { ActionIconsContainer } from '@/src/components/ui/ActionIconsContainer';

function getPlaceholderRow() {
	const columns = state.dataTable.columns.value;
	const placeholderRow: Record<string, undefined> = {};

	columns.forEach((column) => {
		placeholderRow[column] = undefined;
	});

	return placeholderRow;
}

export function ActionButtons() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [placeholderRow, setPlaceholderRow] = useState<object>({});

	useEffect(() => {
		if (isCreateDialogOpen) setPlaceholderRow(getPlaceholderRow());
	}, [isCreateDialogOpen]);

	const handleFileSelect = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await importRecords(file);
			await loadTable();
		}

		target.value = '';
	};

	return (
		<ActionIconsContainer>
			<div className="flex gap-4">
				<Tooltip content="Create new record">
					<Plus
						className={`hover:text-primary size-4 cursor-pointer`}
						onClick={() => setIsCreateDialogOpen(true)}
					/>
				</Tooltip>
				<Tooltip content="Refresh table">
					<RefreshCcw
						className="hover:text-primary size-4 cursor-pointer"
						onClick={() => {
							setRowSelectionRef.current?.({});
							void loadTable();
						}}
					/>
				</Tooltip>
				<Tooltip content="Import table (JSON)">
					<Import
						className="hover:text-primary size-4 cursor-pointer"
						onClick={() => fileInputRef.current?.click()}
					/>
				</Tooltip>
				<Tooltip content="Export table (JSON)">
					<Export
						className="hover:text-primary size-4 cursor-pointer"
						onClick={() => exportRecords()}
					/>
				</Tooltip>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					className="hidden"
					onChange={(event) => {
						void handleFileSelect(event);
					}}
				/>
			</div>

			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Record</DialogTitle>
						<DialogDescription>Create a new record to the database table.</DialogDescription>
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
		</ActionIconsContainer>
	);
}
