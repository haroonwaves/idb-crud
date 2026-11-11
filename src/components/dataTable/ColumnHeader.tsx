import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

function renderSortIcon(sortDirection: false | 'asc' | 'desc') {
	if (sortDirection === 'desc') {
		return <ArrowDown className="size-3.5 text-blue-600" />;
	}
	if (sortDirection === 'asc') {
		return <ArrowUp className="size-3.5 text-blue-600" />;
	}
	return <ChevronsUpDown className="size-3.5" />;
}

export function ColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: Readonly<ColumnHeaderProps<TData, TValue>>) {
	if (!column.getCanSort()) {
		return <div className={cn('text-xs font-semibold text-gray-700', className)}>{title}</div>;
	}

	const sortDirection = column.getIsSorted();

	return (
		<button
			type="button"
			className={cn(
				'group flex w-full cursor-pointer items-center justify-between gap-1.5 text-xs font-semibold text-gray-700 transition-colors select-none hover:text-gray-950',
				className
			)}
			onClick={() => column.toggleSorting(sortDirection === 'asc')}
		>
			<span className="truncate">{title}</span>
			<span className="shrink-0 text-gray-400 group-hover:text-gray-700">
				{renderSortIcon(sortDirection)}
			</span>
		</button>
	);
}
