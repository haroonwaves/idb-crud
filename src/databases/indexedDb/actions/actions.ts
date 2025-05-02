import { loadRecords } from '@/src/databases/indexedDb/actions/loadRecords';
import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { state } from '@/src/state/state';
import { IndexableType } from 'dexie';

async function createRecord(newRow: object) {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	await selectedTable.add(newRow);
}

async function updateRecord(existingRow: object, updatedRow: object) {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	const primaryKey = Array.isArray(selectedTable.schema.primKey.keyPath)
		? (selectedTable.schema.primKey.keyPath[0] as string)
		: (selectedTable.schema.primKey.keyPath as string);

	const primaryValue = existingRow[primaryKey as keyof typeof existingRow];
	await selectedTable.delete(primaryValue);

	await selectedTable.add(updatedRow);
}

async function deleteRecords() {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	const primaryKey = Array.isArray(selectedTable.schema.primKey.keyPath)
		? (selectedTable.schema.primKey.keyPath[0] as string)
		: (selectedTable.schema.primKey.keyPath as string);

	const selectedRows = state.dataTable.selectedRows.value;

	const primaryValues: IndexableType[] = [];
	for (const row of selectedRows) primaryValues.push(row[primaryKey as keyof typeof row]);

	await selectedTable.bulkDelete(primaryValues);
}

async function exportRecords() {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return null;

	const allRecords: any[] = [];

	// Use cursor to efficiently iterate through records
	await selectedTable.each((record) => allRecords.push(record));

	// Create a blob with the JSON data
	const jsonString = JSON.stringify(allRecords, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });

	// Create download link
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${dbName}_${tableName}_${new Date().toISOString()}.json`;
	document.body.append(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);

	return allRecords;
}

async function importRecords(jsonData: any[]) {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	const CHUNK_SIZE = 50000;

	for (let i = 0; i < jsonData.length; i += CHUNK_SIZE) {
		const chunk = jsonData.slice(i, i + CHUNK_SIZE);
		await selectedTable.bulkAdd(chunk);
	}
}

const indexedDbActions = {
	createRecord,
	loadRecords,
	updateRecord,
	deleteRecords,
	exportRecords,
	importRecords,
};

export default indexedDbActions;
