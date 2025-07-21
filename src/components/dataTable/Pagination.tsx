import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
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

function NavigationButton({
	icon,
	action,
	isDisabled,
	tooltip,
}: Readonly<{
	icon: React.ReactNode;
	action: () => void;
	isDisabled: boolean;
	tooltip: string;
}>) {
	return (
		<Tooltip side="top" content={tooltip} sideOffset={10}>
			<Button
				variant="outline"
				className="h-9 w-9 cursor-pointer p-0"
				onClick={action}
				disabled={isDisabled}
			>
				<span className="sr-only">{tooltip}</span>
				{icon}
			</Button>
		</Tooltip>
	);
}

export function Pagination<TData>({ table }: Readonly<PaginationProps<TData>>) {
	const rowCount = Math.max(0, table.getRowCount());
	const pageCount = Math.max(0, table.getPageCount());

	return (
		<div className="flex items-center justify-between pt-4">
			<p className="flex-1 text-sm">Total rows: {rowCount}</p>
			<div className="flex items-center space-x-2">
				<div className="flex items-center space-x-2">
					<p className="text-sm whitespace-nowrap">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value: string) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top" align="center">
							{[10, 15, 20, 30, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<p className="flex items-center justify-center text-sm whitespace-nowrap">
					Page {table.getState().pagination.pageIndex + 1} of {pageCount}
				</p>
				<div className="flex items-center space-x-2">
					<NavigationButton
						icon={<ChevronsLeft />}
						action={() => table.setPageIndex(0)}
						isDisabled={!table.getCanPreviousPage()}
						tooltip="Go to first page"
					/>
					<NavigationButton
						icon={<ChevronLeft />}
						action={() => table.previousPage()}
						isDisabled={!table.getCanPreviousPage()}
						tooltip="Go to prev page"
					/>
					<NavigationButton
						icon={<ChevronRight />}
						action={() => table.nextPage()}
						isDisabled={!table.getCanNextPage()}
						tooltip="Go to next page"
					/>
					<NavigationButton
						icon={<ChevronsRight />}
						action={() => table.setPageIndex(table.getPageCount() - 1)}
						isDisabled={!table.getCanNextPage()}
						tooltip="Go to last page"
					/>
				</div>
			</div>
		</div>
	);
}
