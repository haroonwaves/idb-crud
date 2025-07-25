import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface ColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function ColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: Readonly<ColumnHeaderProps<TData, TValue>>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild triggerId={`column-${column.id}`}>
					<Button variant="ghost" size="sm" className="data-[state=open]:bg-accent -ml-3 h-8">
						<span>{title}</span>
						{(() => {
							const sortDirection = column.getIsSorted();
							if (sortDirection === 'desc') return <ArrowDown />;
							else if (sortDirection === 'asc') return <ArrowUp />;
							else return <ChevronsUpDown />;
						})()}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent triggerId={`column-${column.id}`}>
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUp className="text-muted-foreground/70 h-3.5 w-3.5" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDown className="text-muted-foreground/70 h-3.5 w-3.5" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOff className="text-muted-foreground/70 h-3.5 w-3.5" />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
