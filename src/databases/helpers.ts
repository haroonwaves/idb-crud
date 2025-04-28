import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { state } from '@/src/state/state';

/* Helper function to extract the columns from the rows */
export function extractColumns(rows: object[]) {
	const uniqueColumns = new Set<string>(state.dataTable.columns.value);

	if (rows.length === 0) {
		const selectedTable = state.database.table.value;
		const selectedDb = state.database.selected.value;

		const table = dexieDb.select(selectedDb)?.table(selectedTable);

		if (table) {
			const primaryKeys = table.schema.primKey.keyPath; // can be array
			const indexKeys = table.schema.indexes.map((index) => index.keyPath); // can be array

			[primaryKeys, ...indexKeys].flat().forEach((key) => {
				if (key) uniqueColumns.add(key);
			});
		}
	} else {
		rows.forEach((row: object) => {
			Object.keys(row).forEach((key) => {
				uniqueColumns.add(key);
			});
		});
	}

	return [...uniqueColumns];
}
