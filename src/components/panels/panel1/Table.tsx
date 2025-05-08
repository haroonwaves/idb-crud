import { state } from '@/src/state/state';
import { batch } from '@preact/signals';

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
			className={`hover:bg-accent/60 w-full cursor-pointer overflow-hidden rounded-md p-2 text-left text-ellipsis whitespace-nowrap ${
				isSelected ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''
			}`}
			key={table}
			onClick={() => {
				batch(() => {
					state.database.selected.value = dbName;
					state.database.table.value = table;
				});
			}}
		>
			{table}
		</button>
	);
}
