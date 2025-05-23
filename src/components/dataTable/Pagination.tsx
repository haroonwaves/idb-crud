import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/src/components/ui/Button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/Select';
import { Tooltip } from '@/src/components/ui/Tooltip';

interface PaginationProps<TData> {
	table: Table<TData>;
}

export function Pagination<TData>({ table }: Readonly<PaginationProps<TData>>) {
	const rowCount = Math.max(0, table.getRowCount());
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const pageCount = Math.max(0, table.getPageCount());

	return (
		<div className="flex items-center justify-between pt-2">
			<p className="text-muted-foreground flex-1 text-sm">
				{selectedCount} of {rowCount} row(s) selected
			</p>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value: string) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<p className="flex items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of {pageCount}
				</p>
				<div className="flex items-center space-x-2">
					<Tooltip content="Go to first page" sideOffset={10}>
						<Button
							variant="outline"
							className="hidden h-8 w-8 cursor-pointer p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft />
						</Button>
					</Tooltip>
					<Tooltip content="Go to prev page" sideOffset={10}>
						<Button
							variant="outline"
							className="h-8 w-8 cursor-pointer p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
					</Tooltip>
					<Tooltip content="Go to next page" sideOffset={10}>
						<Button
							variant="outline"
							className="h-8 w-8 cursor-pointer p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
					</Tooltip>
					<Tooltip content="Go to last page" sideOffset={10}>
						<Button
							variant="outline"
							className="hidden h-8 w-8 cursor-pointer p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
