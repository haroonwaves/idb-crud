import { Input } from '@/src/components/ui/Input';
import { ColumnDef, Table } from '@tanstack/react-table';
import { useState } from 'preact/hooks';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/Select';

export function FilterBy<TData, TValue>({
	table,
	columns,
}: Readonly<{ table: Table<TData>; columns: ColumnDef<TData, TValue>[] }>) {
	const [selectedColumn, setSelectedColumn] = useState<string>('');
	const [isInputFocused, setIsInputFocused] = useState(false);

	return (
		<div className="group relative">
			<Input
				placeholder={`Filter by ${selectedColumn}...`}
				value={(table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ''}
				onChange={(event) =>
					table.getColumn(selectedColumn)?.setFilterValue((event.target as HTMLInputElement).value)
				}
				onFocus={() => setIsInputFocused(true)}
				onBlur={() => setIsInputFocused(false)}
				className={`pl-24 ${isInputFocused ? 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]' : ''}`}
			/>
			<div className="w- absolute top-0 left-0 h-full">
				<Select
					value={selectedColumn}
					onValueChange={(value: string) => {
						table.getColumn(selectedColumn)?.setFilterValue(''); // Clear the filter when changing columns
						setSelectedColumn(value);
					}}
				>
					<SelectTrigger
						className={`bg-muted/50 hover:bg-muted h-full w-[90px] rounded-r-none border-r px-2 text-ellipsis! whitespace-nowrap ${
							isInputFocused ? 'border-ring ring-ring/50 ring-[3px]' : ''
						}`}
					>
						<SelectValue placeholder="Filter by" />
					</SelectTrigger>
					<SelectContent>
						{columns.map((column) => (
							<SelectItem key={column.id} value={column.id}>
								{column.id}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
