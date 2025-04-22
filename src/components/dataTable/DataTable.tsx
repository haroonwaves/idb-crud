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
} from '@/src/components/ui/Table';
import React from 'preact/compat';
import { Input } from '@/src/components/ui/Input';
import { Pagination } from '@/src/components/dataTable/Pagination';
import { ColumnToggle } from '@/src/components/dataTable/ColumnToggle';
import { state } from '@/src/state/state';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	totalRows: number;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	totalRows,
}: Readonly<DataTableProps<TData, TValue>>) {
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

	const sorting = state.dataTable.query.sort.value;
	const columnFilters = state.dataTable.query.filter.value;
	const pagination = state.dataTable.query.pagination.value;
	const rowSelection = state.dataTable.selectedRows.value;

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
		state.dataTable.selectedRows.value = value;
	}

	const table = useReactTable({
		data,
		columns,

		manualSorting: true,
		manualFiltering: true,
		manualPagination: true,

		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
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

	return (
		<>
			<div className="flex items-center pb-4">
				<Input
					placeholder="Filter threadId..."
					value={(table.getColumn('threadId')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('threadId')?.setFilterValue((event.target as HTMLInputElement).value)
					}
					className="max-w-sm"
				/>
				<ColumnToggle table={table} />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<Pagination table={table} />
		</>
	);
}
