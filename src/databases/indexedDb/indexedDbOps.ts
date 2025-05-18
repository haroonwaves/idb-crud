import { loadRecords } from '@/src/databases/indexedDb/loadRecords';
import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { state } from '@/src/state/state';
import { IndexableType } from 'dexie';
import { getStreamWriter } from '@/src/databases/helpers';

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
	const table = dexieDb.select(dbName)?.table(tableName);

	if (!table) return null;

	const { writer, encoder } = await getStreamWriter(`${dbName}_${tableName}.json`);

	let isFirst = true;

	await table.each((record) => {
		const prefix = isFirst ? '' : ',\n';

		const jsonIndented = JSON.stringify(record, null, 2)
			.split('\n')
			.map((line) => `  ${line}`) // indent each line of the object
			.join('\n');

		void writer.write(encoder.encode(prefix + jsonIndented));
		isFirst = false;
	});

	await writer.write(encoder.encode('\n]'));
	await writer.close();

	return true;
}

async function importRecords(jsonData: any[]) {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	await selectedTable.bulkAdd(jsonData);
}

const indexedDbOps = {
	createRecord,
	loadRecords,
	updateRecord,
	deleteRecords,
	exportRecords,
	importRecords,
};

export default indexedDbOps;
