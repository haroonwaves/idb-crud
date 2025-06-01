import { Input } from '@/src/components/ui/Input';
import { ColumnDef, Table } from '@tanstack/react-table';
import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/Select';
import { useSignalEffect } from '@preact/signals';
import { state } from '@/src/state/state';

export function FilterBy<TData, TValue>({
	table,
	columns,
	onFilterChange,
}: Readonly<{
	table: Table<TData>;
	columns: ColumnDef<TData, TValue>[];
	onFilterChange: (filter: string) => void;
}>) {
	const [selectedColumn, setSelectedColumn] = useState<string>('');
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const [filterValue, setFilterValue] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);
	const debounceTimeout = useRef<number>();

	const debouncedOnChange = useCallback(
		(value: string) => {
			if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

			setFilterValue(value);

			debounceTimeout.current = window.setTimeout(() => {
				table.getColumn(selectedColumn)?.setFilterValue(value);
				onFilterChange(value);
			}, 600);
		},
		[selectedColumn, onFilterChange, table]
	);

	useEffect(() => {
		return () => {
			if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		};
	}, []);

	useEffect(() => {
		if (selectedColumn) inputRef.current?.focus();
	}, [selectedColumn, inputRef]);

	useSignalEffect(() => {
		const selectedTable = state.database.table.value; // This subscribes to the table signal and triggers a re-render when the table changes
		const selectedDatabase = state.database.selected.value; // This subscribes to the selected database signal and triggers a re-render
		if (selectedTable || selectedDatabase) {
			setSelectedColumn('');
			setFilterValue('');
		}
	});

	return (
		<div className="group relative w-[300px]">
			<Input
				ref={inputRef}
				placeholder={`Filter by ${selectedColumn}...`}
				value={filterValue}
				onChange={(event) => {
					debouncedOnChange((event.target as HTMLInputElement).value);
				}}
				onFocus={() => {
					if (selectedColumn === '') setIsSelectOpen(true);
					else setIsInputFocused(true);
				}}
				onBlur={() => setIsInputFocused(false)}
				className={`pl-24 ${isInputFocused ? 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]' : ''}`}
			/>
			<div className="w- absolute top-0 left-0 h-full">
				<Select
					value={selectedColumn}
					open={isSelectOpen}
					onOpenChange={setIsSelectOpen}
					onValueChange={(value: string) => {
						table.getColumn(selectedColumn)?.setFilterValue(''); // Clear the filter when changing columns
						setFilterValue('');
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
