import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useRef } from 'preact/hooks';

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

const loadingClass = `opacity-50 animate-pulse`;

export function Pagination<TData>({ table }: Readonly<PaginationProps<TData>>) {
	const rowCount = table.getRowCount();
	const lastValidCount = useRef(Math.max(0, rowCount));
	const isCountLoading = rowCount === -1;
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;

	useEffect(() => {
		if (rowCount >= 0) {
			lastValidCount.current = rowCount;
		}
	}, [rowCount]);

	const displayCount = isCountLoading ? lastValidCount.current : Math.max(0, rowCount);
	const currentPageCount = Math.max(0, table.getPageCount());
	const displayPageCount = isCountLoading
		? Math.max(0, Math.ceil(lastValidCount.current / table.getState().pagination.pageSize))
		: currentPageCount;

	return (
		<div className="flex items-center justify-between pt-2">
			<div className={`text-muted-foreground flex-1 text-sm ${isCountLoading ? loadingClass : ''}`}>
				{selectedCount} of {displayCount} row(s) selected
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className={`text-sm font-medium ${isCountLoading ? loadingClass : ''}`}>
						Rows per page
					</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value: string) => {
							table.setPageSize(Number(value));
						}}
						disabled={isCountLoading}
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
				<div
					className={`flex items-center justify-center text-sm font-medium ${isCountLoading ? loadingClass : ''}`}
				>
					Page {table.getState().pagination.pageIndex + 1} of {displayPageCount}
				</div>
				<div className="flex items-center space-x-2">
					<Tooltip content="Go to first page" sideOffset={10}>
						<Button
							variant="outline"
							className="hidden h-8 w-8 cursor-pointer p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage() || isCountLoading}
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
							disabled={!table.getCanPreviousPage() || isCountLoading}
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
							disabled={!table.getCanNextPage() || isCountLoading}
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
							disabled={!table.getCanNextPage() || isCountLoading}
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
