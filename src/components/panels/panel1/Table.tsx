import { state } from '@/state/state';
import { batch } from '@preact/signals';
import { FileText } from 'lucide-react';

type TableProps = {
	table: string;
	dbName: string;
};

export function Table({ table, dbName }: Readonly<TableProps>) {
	const selectedDatabase = state.database.selected.value;
	const selectedTable = state.database.table.value;

	const isSelected = selectedTable === table && selectedDatabase === dbName;

	return (
		<button
			type="button"
			className={`group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-md py-1.5 pr-3 pl-2 text-xs transition-colors ${
				isSelected
					? 'bg-blue-50/90 font-medium text-blue-600'
					: 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
			}`}
			key={table}
			onClick={() => {
				batch(() => {
					state.database.type.value = 'indexedDb';
					state.database.selected.value = dbName;
					state.database.table.value = table;
				});
			}}
		>
			<div className="flex min-w-0 items-center gap-2">
				<FileText
					className={`size-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
					strokeWidth={1.75}
				/>
				<span className="truncate text-left">{table}</span>
			</div>
			{isSelected && (
				<span className="absolute inset-y-0 right-0 w-[2.5px] bg-blue-600" />
			)}
		</button>
	);
}
