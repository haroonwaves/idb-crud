import { signals } from '@/src/state/signals';

type TableProps = {
	table: string;
	dbName: string;
};

export function Table({ table, dbName }: TableProps) {
	const selectedTable = signals.selectedTable.value;
	const selectedDatabase = signals.selectedDatabase.value;
	const isSelected = selectedTable === table && selectedDatabase === dbName;

	return (
		<button
			className={`hover:bg-accent w-full cursor-pointer overflow-hidden rounded-md p-2 text-left text-ellipsis whitespace-nowrap ${
				isSelected ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''
			}`}
			key={table}
			onClick={() => {
				signals.selectedDatabase.value = dbName;
				signals.selectedTable.value = table;
			}}
		>
			{table}
		</button>
	);
}
