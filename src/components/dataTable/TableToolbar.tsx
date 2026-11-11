import { state } from '@/state/state';
import {
	ListFilter,
	Plus,
	RotateCw,
	Download,
	Upload,
	Search,
} from 'lucide-react';
import { ColumnToggle } from '@/components/dataTable/ColumnToggle';
import { Table as TanstackTable } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'preact/hooks';
import { exportRecords, importRecords, loadTable, createRecord } from '@/databases/actions';
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
import { Tooltip } from '@/components/ui/Tooltip';

interface TableToolbarProps<TData> {
	table: TanstackTable<TData>;
	isFilterOpen?: boolean;
	onToggleFilter?: () => void;
}

export function TableToolbar<TData>({
	table,
	isFilterOpen = false,
	onToggleFilter,
}: Readonly<TableToolbarProps<TData>>) {
	const selectedTable = state.database.table.value;
	const columns = state.dataTable.columns.value;

	const toolbarRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isCompact, setIsCompact] = useState(false);

	// Create dialog state
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [newRecordJson, setNewRecordJson] = useState('{\n  \n}');
	const [createError, setCreateError] = useState('');

	// Responsive observer for container width
	useEffect(() => {
		if (!toolbarRef.current) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setIsCompact(entry.contentRect.width < 620);
			}
		});
		observer.observe(toolbarRef.current);
		return () => observer.disconnect();
	}, []);

	// Reset create template when opening dialog
	useEffect(() => {
		if (isCreateOpen) {
			const template: Record<string, unknown> = {};
			columns.forEach((col) => {
				if (col !== '__primaryKey__') {
					template[col] = '';
				}
			});
			setNewRecordJson(JSON.stringify(template, null, 2));
			setCreateError('');
		}
	}, [isCreateOpen, columns]);

	const handleAddRecord = async () => {
		try {
			const parsed: unknown = JSON.parse(newRecordJson);
			if (typeof parsed !== 'object' || parsed === null) {
				throw new TypeError('Record must be a JSON object');
			}
			await createRecord(parsed);
			setIsCreateOpen(false);
		} catch (error: unknown) {
			setCreateError(error instanceof Error ? error.message : 'Invalid JSON format');
		}
	};

	const handleFileSelect = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await importRecords(file);
			await loadTable();
		}
		target.value = '';
	};

	const hasActiveFilter = state.dataTable.query.filter.value.length > 0;

	return (
		<div ref={toolbarRef} className="@container bg-white select-none">
			{/* Main Toolbar Row: Search on Left, Action Buttons immediately next to it */}
			<div className="flex h-13 shrink-0 items-center gap-3.5 px-4 min-w-0">
				{/* Left section: Search records input */}
				<div className="relative w-56 shrink-0">
					<Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						value={state.dataTable.searchTerm.value}
						onChange={(e) => {
							state.dataTable.searchTerm.value = (e.target as HTMLInputElement).value;
						}}
						placeholder="Search records..."
						className="h-8 w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-2.5 pl-8 text-xs text-gray-800 shadow-2xs placeholder:text-gray-400 outline-none transition-all hover:bg-gray-50/50 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20"
					/>
				</div>

				{/* Right section: Responsive Action Buttons (placed near search, flowing to the right) */}
				<div className="flex shrink-0 items-center gap-2">
					{/* Filter Button */}
					<Tooltip content="Filter records" side="bottom">
						<button
							type="button"
							onClick={() => onToggleFilter?.()}
							className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-xs font-medium shadow-2xs transition-colors shrink-0 ${
								isCompact ? 'size-8 px-0' : 'px-2.5'
							} ${
								hasActiveFilter || isFilterOpen
									? 'border-blue-500 bg-blue-50/80 text-blue-600'
									: 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
							}`}
						>
							<ListFilter className="size-3.5" />
							{!isCompact && <span>Filter</span>}
						</button>
					</Tooltip>

					{/* Add Button */}
					<Tooltip content="Create new record" side="bottom">
						<button
							type="button"
							onClick={() => setIsCreateOpen(true)}
							className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 shrink-0 ${
								isCompact ? 'size-8 px-0' : 'px-2.5'
							}`}
						>
							<Plus className="size-3.5 text-gray-600" />
							{!isCompact && <span>Add</span>}
						</button>
					</Tooltip>

					{/* Refresh Button */}
					<Tooltip content="Refresh table" side="bottom">
						<button
							type="button"
							onClick={() => {
								setRowSelectionRef.current?.({});
								void loadTable();
							}}
							className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 shrink-0 ${
								isCompact ? 'size-8 px-0' : 'px-2.5'
							}`}
						>
							<RotateCw className="size-3.5 text-gray-600" />
							{!isCompact && <span>Refresh</span>}
						</button>
					</Tooltip>

					{/* Import Button */}
					<Tooltip content="Import JSON file" side="bottom">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 shrink-0 ${
								isCompact ? 'size-8 px-0' : 'px-2.5'
							}`}
						>
							<Upload className="size-3.5 text-gray-600" />
							{!isCompact && <span>Import</span>}
						</button>
					</Tooltip>
					<input
						ref={fileInputRef}
						type="file"
						accept=".json"
						className="hidden"
						onChange={(event) => void handleFileSelect(event)}
					/>

					{/* Export Button */}
					<Tooltip content="Export JSON file" side="bottom">
						<button
							type="button"
							onClick={() => void exportRecords()}
							className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 shrink-0 ${
								isCompact ? 'size-8 px-0' : 'px-2.5'
							}`}
						>
							<Download className="size-3.5 text-gray-600" />
							{!isCompact && <span>Export</span>}
						</button>
					</Tooltip>

					{/* Columns Toggle */}
					<ColumnToggle table={table} isCompact={isCompact} />
				</div>
			</div>

			{/* Create Record Dialog */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Create New Record</DialogTitle>
						<DialogDescription>
							Enter the record JSON to add to {selectedTable}. Nested objects and arrays are supported.
						</DialogDescription>
					</DialogHeader>

					<div className="py-2">
						<textarea
							rows={10}
							value={newRecordJson}
							onChange={(e) => setNewRecordJson((e.target as HTMLTextAreaElement).value)}
							className="w-full rounded-lg border border-gray-200 bg-gray-50/70 p-3 font-mono text-xs leading-relaxed text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
							placeholder='{ "key": "value", "nested": { "a": 1 } }'
						/>
						{createError && <p className="mt-1 text-xs text-red-500">{createError}</p>}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							className="cursor-pointer"
							onClick={() => setIsCreateOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
							onClick={() => void handleAddRecord()}
						>
							Add Record
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
