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
import React, { useEffect } from 'preact/compat';
import { Pagination } from '@/src/components/dataTable/Pagination';
import { ColumnToggle } from '@/src/components/dataTable/ColumnToggle';
import { state } from '@/src/state/state';
import { FilterBy } from '@/src/components/dataTable/FilterBy';
import { ActionButtons } from '@/src/components/dataTable/ActionButtons';
import { Loader } from '@/src/components/ui/Loader';

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
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

	const sorting = state.dataTable.query.sort.value;
	const columnFilters = state.dataTable.query.filter.value;
	const pagination = state.dataTable.query.pagination.value;

	const isLoading = state.dataTable.isLoading.value;

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

	useEffect(() => {
		const selectedRows = Object.keys(rowSelection)
			.map((key: string) => data[Number(key)])
			.filter((row) => row != undefined);
		state.dataTable.selectedRows.value = selectedRows;
	}, [rowSelection, data]);

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
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between pb-4">
				<FilterBy table={table} columns={columns.slice(1)} />
				<ActionButtons />
				<ColumnToggle table={table} />
			</div>
			<div className="flex-1 overflow-auto">
				<div className="relative rounded-md border">
					{isLoading && <Loader />}
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
			</div>

			<Pagination table={table} />
		</div>
	);
}
