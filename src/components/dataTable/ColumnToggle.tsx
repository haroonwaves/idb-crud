import { Table } from '@tanstack/react-table';
import { Columns3 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Tooltip } from '@/components/ui/Tooltip';
import { state } from '@/state/state';

interface ColumnToggleProps<TData> {
	table: Table<TData>;
	isCompact?: boolean;
}

export function ColumnToggle<TData>({ table, isCompact = false }: Readonly<ColumnToggleProps<TData>>) {
	// Subscribe directly to columns and columnVisibility signals
	const visibility = state.dataTable.columnVisibility.value;
	const columns = state.dataTable.columns.value;
	const activeColumns = columns.filter((col) => Boolean(col && col.trim() && col !== 'select'));

	return (
		<DropdownMenu>
			<Tooltip content="Toggle columns" sideOffset={8}>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 shrink-0 ${
							isCompact ? 'size-8 px-0' : 'px-2.5'
						}`}
					>
						<Columns3 className="size-3.5 text-gray-600" />
						{!isCompact && <span>Columns</span>}
					</button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent className="w-[180px]">
				<DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{activeColumns.map((colName) => {
					const isVisible = visibility[colName] !== false;
					const displayName = colName === '__primaryKey__' ? 'Primary Key' : colName;
					return (
						<DropdownMenuCheckboxItem
							key={colName}
							className="cursor-pointer text-xs capitalize"
							checked={isVisible}
							onCheckedChange={(val: boolean) => {
								const nextVisibility = {
									...state.dataTable.columnVisibility.value,
									[colName]: !!val,
								};
								state.dataTable.columnVisibility.value = nextVisibility;
								table.setColumnVisibility(nextVisibility);
							}}
						>
							{displayName}
						</DropdownMenuCheckboxItem>
					);
				})}
				{activeColumns.length === 0 && (
					<div className="px-2 py-1.5 text-xs text-gray-400 select-none">No columns</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
