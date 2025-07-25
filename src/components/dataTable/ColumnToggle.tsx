import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Tooltip } from '@/components/ui/Tooltip';

interface ColumnToggleProps<TData> {
	table: Table<TData>;
}

export function ColumnToggle<TData>({ table }: Readonly<ColumnToggleProps<TData>>) {
	return (
		<DropdownMenu>
			<Tooltip content="Toggle columns" sideOffset={10}>
				<DropdownMenuTrigger asChild triggerId={`column-toggle`}>
					<Button variant="outline" size="sm" className="hidden h-9 cursor-pointer lg:flex">
						<Settings2 />
						Columns
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent className="w-[150px]" triggerId={`column-toggle`}>
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
