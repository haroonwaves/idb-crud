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

const indexedDbActions = {
	createRecord,
	loadRecords,
	updateRecord,
	deleteRecords,
};

export default indexedDbActions;
