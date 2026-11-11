import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	PaginationState,
	RowSelectionState,
	SortingState,
	Updater,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/Table';
import React, { createRef, Dispatch, SetStateAction, useEffect, useMemo } from 'preact/compat';
import { Pagination } from '@/components/dataTable/Pagination';
import { state } from '@/state/state';
import { TableToolbar } from '@/components/dataTable/TableToolbar';
import { FloatingActionBar } from '@/components/dataTable/FloatingActionBar';
import { Loader } from '@/components/ui/Loader';
import { useSignalEffect } from '@preact/signals';
import { Panel3 } from '@/components/panels/panel3/Panel3';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { TableFilterBar } from '@/components/dataTable/TableFilterBar';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	totalRows: number;
}

function valueToString(val: unknown): string {
	if (typeof val === 'string') return val;
	if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'bigint') return String(val);
	if (val === null) return 'null';
	if (val instanceof Date) return val.toISOString();
	if (typeof val === 'object') {
		try {
			return JSON.stringify(val);
		} catch {
			return '';
		}
	}
	return '';
}

export const setRowSelectionRef = createRef<Dispatch<SetStateAction<RowSelectionState>>>();

export function DataTable<TData, TValue>({
	columns,
	data,
	totalRows,
}: Readonly<DataTableProps<TData, TValue>>) {
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [isFilterOpen, setIsFilterOpen] = React.useState(false);

	setRowSelectionRef.current = setRowSelection;

	const sorting = state.dataTable.query.sort.value;
	const columnFilters = state.dataTable.query.filter.value;
	const pagination = state.dataTable.query.pagination.value;
	const columnVisibility = state.dataTable.columnVisibility.value;
	const isLoading = state.dataTable.isLoading.value;
	const searchTerm = state.dataTable.searchTerm.value.toLowerCase().trim();

	function handleColumnVisibility(updaterOrValue: Updater<VisibilityState>) {
		const value =
			typeof updaterOrValue === 'function'
				? updaterOrValue(state.dataTable.columnVisibility.value)
				: updaterOrValue;
		state.dataTable.columnVisibility.value = value;
	}

	function handleSorting(updaterOrValue: Updater<SortingState>) {
		const value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
		state.dataTable.query.sort.value = value;
	}

	function handleColumnFilters(updaterOrValue: Updater<ColumnFiltersState>) {
		const value =
			typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;
		state.dataTable.query.filter.value = value;
	}

	function handlePagination(updaterOrValue: Updater<PaginationState>) {
		const value =
			typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
		state.dataTable.query.pagination.value = value;
	}

	function handleRowSelection(updaterOrValue: Updater<RowSelectionState>) {
		const value =
			typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
		setRowSelection(value);
	}

	// Filter data by searchTerm if present (including nested objects)
	const filteredData = useMemo(() => {
		if (!searchTerm) return data;
		return data.filter((row: TData) => {
			const record = row as Record<string, unknown>;
			return Object.values(record).some((val) => {
				const str = valueToString(val);
				return str.toLowerCase().includes(searchTerm);
			});
		});
	}, [data, searchTerm]);

	useEffect(() => {
		const selectedRows = Object.keys(rowSelection)
			.map((key: string) => filteredData[Number(key)])
			.filter((row) => row != undefined);
		state.dataTable.selectedRows.value = selectedRows;
	}, [rowSelection, filteredData]);

	useSignalEffect(() => {
		const selectedTable = state.database.table.value;
		const selectedDatabase = state.database.selected.value;
		if (selectedTable || selectedDatabase) {
			setRowSelection({});
		}
	});

	useEffect(() => {
		setRowSelection({});
	}, [sorting, pagination]);

	const table = useReactTable({
		data: filteredData,
		columns,
		manualSorting: true,
		manualFiltering: true,
		manualPagination: true,
		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: handleColumnVisibility,
		onRowSelectionChange: handleRowSelection,
		onSortingChange: handleSorting,
		onColumnFiltersChange: handleColumnFilters,
		onPaginationChange: handlePagination,
		rowCount: totalRows,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			pagination,
			rowSelection,
		},
	});

	const selectedRowCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;
	const hasRows = (table.getRowModel().rows?.length ?? 0) > 0;

	return (
		<div className="relative flex h-full flex-col min-w-0 bg-white">
			{/* Top Header Toolbar: Spans full width across table and inspector (no divider) */}
			<TableToolbar
				table={table}
				isFilterOpen={isFilterOpen}
				onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
			/>

			{/* Content Area with the two separate rounded bordered boxes */}
			<div className="flex-1 min-h-0 px-4 pt-1.5 pb-3 min-w-0">
				<ResizablePanelGroup direction="horizontal" className="h-full w-full">
					{/* Center Pane: Table Area */}
					<ResizablePanel defaultSize={68} minSize={35} className="min-w-0">
						<div className="flex h-full flex-col min-w-0">
							{/* Filter Bar placed ABOVE the table box, within table area */}
							{isFilterOpen && (
								<div className="pb-2.5 shrink-0">
									<TableFilterBar
										table={table}
										columns={state.dataTable.columns.value.filter(
											(col) => Boolean(col && col.trim() && col !== 'select')
										)}
										onClose={() => setIsFilterOpen(false)}
									/>
								</div>
							)}

							{/* Table Box */}
							<div className="relative flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-2xs">
								{/* Table Content Area */}
								<div className="relative min-h-0 flex-1 overflow-auto flex flex-col">
									{isLoading && <Loader />}
									<Table
										className={`w-full border-collapse text-left ${
											hasRows ? '' : 'h-full flex-1'
										}`}
									>
										{columns.length > 0 && (
											<TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white">
												{table.getHeaderGroups().map((headerGroup) => (
													<TableRow key={headerGroup.id} className="h-11 border-b border-gray-100">
														{headerGroup.headers.map((header) => {
															return (
																<TableHead
																	key={header.id}
																	className="h-11 px-4 py-2 text-xs font-semibold text-gray-700 select-none bg-white"
																>
																	{header.isPlaceholder
																		? null
																		: flexRender(header.column.columnDef.header, header.getContext())}
																</TableHead>
															);
														})}
													</TableRow>
												))}
											</TableHeader>
										)}
									<TableBody className={hasRows ? undefined : 'h-full flex-1'}>
										{hasRows ? (
											table.getRowModel().rows.map((row) => {
												const isSelected = row.getIsSelected();
												return (
													<TableRow
														key={row.id}
														data-state={isSelected && 'selected'}
														onClick={() => row.toggleSelected()}
														className={`cursor-pointer transition-colors ${
															isSelected
																? '!border-l-[3px] !border-l-blue-600 bg-[#f0f4ff]/80 hover:bg-[#ebf1ff]'
																: 'border-b !border-l-[3px] border-gray-100 !border-l-transparent hover:bg-gray-50/70'
														}`}
													>
														{row.getVisibleCells().map((cell) => (
															<TableCell key={cell.id} className="max-w-xs px-4 py-3 text-xs truncate">
																{flexRender(cell.column.columnDef.cell, cell.getContext())}
															</TableCell>
														))}
													</TableRow>
												);
											})
										) : (
											<TableRow className="h-full hover:bg-transparent">
												<TableCell
													colSpan={Math.max(columns.length, 1)}
													className="h-full text-center text-xs text-gray-400 align-middle"
												>
													No records found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>

							{/* Floating Bottom Action Bar */}
							<FloatingActionBar selectedCount={selectedRowCount} />

							{/* Bottom Pagination: Belongs to table, stays strictly inside/below the table area */}
							<Pagination table={table} />
						</div>
					</div>
					</ResizablePanel>

					{/* Resizable Divider Handle between Table Box and Inspector Box */}
					<ResizableHandle className="w-2.5 mx-0.5 cursor-col-resize flex items-center justify-center transition-colors hover:bg-blue-100/50 rounded-full group">
						<div className="w-1 h-6 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors" />
					</ResizableHandle>

					{/* Right Pane: Selected Record Inspector Box */}
					<ResizablePanel defaultSize={32} minSize={20} maxSize={50} className="min-w-0">
						<div className="flex h-full flex-col rounded-xl border border-gray-200/90 bg-white shadow-2xs overflow-hidden">
							<Panel3 />
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
