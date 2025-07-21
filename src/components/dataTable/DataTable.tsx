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
import React, { createRef, Dispatch, SetStateAction, useEffect } from 'preact/compat';
import { Pagination } from '@/components/dataTable/Pagination';
import { ColumnToggle } from '@/components/dataTable/ColumnToggle';
import { state } from '@/state/state';
import { FilterBy } from '@/components/dataTable/FilterBy';
import { ActionButtons } from '@/components/dataTable/ActionButtons';
import { Loader } from '@/components/ui/Loader';
import { useSignalEffect } from '@preact/signals';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	totalRows: number;
}

export const setRowSelectionRef = createRef<Dispatch<SetStateAction<RowSelectionState>>>();

export function DataTable<TData, TValue>({
	columns,
	data,
	totalRows,
}: Readonly<DataTableProps<TData, TValue>>) {
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

	setRowSelectionRef.current = setRowSelection;

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

	useSignalEffect(() => {
		const selectedTable = state.database.table.value; // This subscribes to the table signal and triggers a re-render when the table changes
		const selectedDatabase = state.database.selected.value; // This subscribes to the selected database signal and triggers a re-render
		if (selectedTable || selectedDatabase) {
			setColumnVisibility({});
			setRowSelection({});
		}
	});

	useEffect(() => {
		setRowSelection({});
	}, [sorting, pagination]);

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
			<div className="flex items-center justify-between pb-4 select-none">
				<FilterBy
					table={table}
					columns={columns.slice(1)}
					onFilterChange={() => {
						setRowSelection({});
					}}
				/>
				<div className="ml-2 flex items-center gap-2">
					<ActionButtons />
					<ColumnToggle table={table} />
				</div>
			</div>

			<div className="overflow-y-auto rounded-md border">
				<div className="relative">
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
											<TableCell key={cell.id} className="max-w-40 truncate">
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
