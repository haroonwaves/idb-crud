import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select';
import { Tooltip } from '@/components/ui/Tooltip';

interface PaginationProps<TData> {
	table: Table<TData>;
}

export function Pagination<TData>({ table }: Readonly<PaginationProps<TData>>) {
	const rowCount = Math.max(0, table.getRowCount());
	const pageCount = Math.max(1, table.getPageCount());
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const currentPage = table.getState().pagination.pageIndex + 1;

	return (
		<div className="flex h-11 shrink-0 items-center justify-between border-t border-gray-100 bg-white px-4 text-xs text-gray-600 select-none">
			{/* Left side: Row count and selected count */}
			<div className="flex items-center gap-2">
				<span>{rowCount} rows</span>
				{selectedCount > 0 && (
					<span className="font-medium text-blue-600">{selectedCount} selected</span>
				)}
			</div>

			{/* Right side: Page size, page index, and nav buttons (exact matching height h-6) */}
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-1.5">
					<span className="text-gray-500 whitespace-nowrap">Rows per page</span>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value: string) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger size="xs" className="h-6 w-[54px] rounded-md border-gray-200 bg-white shadow-2xs">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top" align="center">
							{[10, 15, 20, 30, 50, 100].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`} className="cursor-pointer text-xs">
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="text-gray-600 whitespace-nowrap">
					Page {currentPage} of {pageCount}
				</div>

				<div className="flex items-center gap-1">
					<Tooltip content="First page" side="top">
						<button
							type="button"
							className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-2xs transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-35"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronsLeft className="size-3" />
						</button>
					</Tooltip>

					<Tooltip content="Previous page" side="top">
						<button
							type="button"
							className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-2xs transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-35"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="size-3" />
						</button>
					</Tooltip>

					<Tooltip content="Next page" side="top">
						<button
							type="button"
							className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-2xs transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-35"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRight className="size-3" />
						</button>
					</Tooltip>

					<Tooltip content="Last page" side="top">
						<button
							type="button"
							className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-2xs transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-35"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<ChevronsRight className="size-3" />
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
