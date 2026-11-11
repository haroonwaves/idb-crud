import { Table } from '@tanstack/react-table';
import { ChevronDown, X, Check as CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface TableFilterBarProps<TData> {
	table: Table<TData>;
	columns: string[];
	onClose: () => void;
}

function getColumnTitle(col: string) {
	if (col === '__primaryKey__') return 'Primary Key';
	return col;
}

export function TableFilterBar<TData>({
	table,
	columns,
	onClose,
}: Readonly<TableFilterBarProps<TData>>) {
	const [filterColumn, setFilterColumn] = useState('');
	const [filterVal, setFilterVal] = useState('');

	// Sync initial state if an active filter already exists
	useEffect(() => {
		const activeFilters = table.getState().columnFilters;
		const firstFilter = activeFilters[0];
		if (firstFilter) {
			setFilterColumn(firstFilter.id);
			setFilterVal((firstFilter.value as string) ?? '');
		}
	}, [table]);

	const handleApply = () => {
		if (filterColumn) {
			table.getColumn(filterColumn)?.setFilterValue(filterVal);
		}
	};

	const handleClear = () => {
		setFilterColumn('');
		setFilterVal('');
		table.resetColumnFilters();
	};

	const hasColumnError = filterVal.trim().length > 0 && !filterColumn;
	const selectedColumnLabel = filterColumn
		? getColumnTitle(filterColumn)
		: 'Select column...';

	return (
		<div className="flex shrink-0 flex-wrap items-center gap-2 text-xs animate-in fade-in slide-in-from-top-1">
			<span className="shrink-0 font-medium text-gray-600">Filter column:</span>

			{/* Column selector styled like Panel 1 storage/database dropdown */}
			<div className="relative flex shrink-0 items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className={`group flex h-8 w-[150px] cursor-pointer items-center justify-between rounded-lg border bg-white px-2.5 text-xs shadow-2xs transition-colors outline-none ${
								hasColumnError
									? 'border-red-400 hover:border-red-500'
									: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
							}`}
						>
							<span
								className={`truncate text-left ${
									filterColumn ? 'font-medium text-gray-800' : 'text-gray-400'
								}`}
							>
								{selectedColumnLabel}
							</span>
							<ChevronDown className="size-3.5 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[180px] max-h-60 overflow-y-auto p-1" align="start">
						{columns.length === 0 ? (
							<div className="px-2 py-1.5 text-xs text-gray-400 select-none">
								No columns available
							</div>
						) : (
							columns.map((col) => {
								const isSelected = filterColumn === col;
								const displayName = getColumnTitle(col);
								return (
									<DropdownMenuItem
										key={col}
										onClick={() => setFilterColumn(isSelected ? '' : col)}
										className={`flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
											isSelected
												? 'bg-blue-50/80 font-medium text-blue-600'
												: 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
										}`}
									>
										<span className="truncate">{displayName}</span>
										{isSelected && (
											<CheckIcon className="size-3.5 text-blue-600 shrink-0" />
										)}
									</DropdownMenuItem>
								);
							})
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Filter value input with error border when typing without column selected */}
			<input
				type="text"
				placeholder="Filter value..."
				value={filterVal}
				title={hasColumnError ? 'Please select a column first' : undefined}
				onChange={(e) => setFilterVal((e.target as HTMLInputElement).value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleApply();
					}
				}}
				className={`h-8 min-w-[120px] flex-1 rounded-lg border bg-white px-3 text-xs text-gray-800 shadow-2xs outline-none transition-all placeholder:text-gray-400 ${
					hasColumnError
						? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
						: 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
				}`}
			/>

			{/* Apply button */}
			<button
				type="button"
				onClick={handleApply}
				disabled={hasColumnError || !filterColumn}
				className={`flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg px-3.5 text-xs font-medium shadow-2xs transition-colors ${
					hasColumnError || !filterColumn
						? 'bg-blue-600/50 text-white/80 cursor-not-allowed'
						: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
				}`}
			>
				Apply
			</button>

			{/* Clear button */}
			<button
				type="button"
				onClick={handleClear}
				className="flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg px-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
			>
				Clear
			</button>

			{/* Close button */}
			<button
				type="button"
				onClick={onClose}
				className="ml-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-200/60 hover:text-gray-700"
			>
				<X className="size-3.5" />
			</button>
		</div>
	);
}
