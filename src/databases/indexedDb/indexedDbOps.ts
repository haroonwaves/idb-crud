import { loadRecords } from '@/databases/indexedDb/loadRecords';
import { dexieDb } from '@/databases/indexedDb/dexie';
import { state } from '@/state/state';
import { IndexableType } from 'dexie';
import { getStreamWriter, getTableKeyInfo } from '@/databases/helpers';

async function createRecord(newRow: object) {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	const { keyField } = getTableKeyInfo(selectedTable);

	if (keyField === '__primaryKey__') {
		const { __primaryKey__, ...rest } = newRow as any;
		newRow = rest;
		await selectedTable.add(newRow, __primaryKey__ as IndexableType);
	} else {
		await selectedTable.add(newRow);
	}
}

async function updateRecord(existingRow: object, updatedRow: object) {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	const { keyField, hasOutOfLineKeys } = getTableKeyInfo(selectedTable);
	const primaryValue = existingRow[keyField as keyof typeof existingRow];

	await selectedTable.delete(primaryValue);

	if (hasOutOfLineKeys) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { __primaryKey__, ...rest } = updatedRow as any;
		updatedRow = rest;
		await selectedTable.add(updatedRow, primaryValue);
	} else {
		await selectedTable.add(updatedRow);
	}
}

async function deleteRecords() {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const selectedTable = dexieDb.select(dbName)?.table(tableName);

	if (!selectedTable) return;

	const { keyField } = getTableKeyInfo(selectedTable);

	const selectedRows = state.dataTable.selectedRows.value;

	const primaryValues: IndexableType[] = [];
	for (const row of selectedRows) primaryValues.push(row[keyField as keyof typeof row]);

	await selectedTable.bulkDelete(primaryValues);
}

async function exportRecords() {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const table = dexieDb.select(dbName)?.table(tableName);

	if (!table) return null;

	const { writer, encoder } = await getStreamWriter(`${dbName}_${tableName}.json`);

	let isFirst = true;

	const { hasOutOfLineKeys } = getTableKeyInfo(table);

	await table.each((record, cursor) => {
		const prefix = isFirst ? '' : ',\n';

		if (hasOutOfLineKeys) record['__primaryKey__'] = cursor.primaryKey;

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

	const { hasOutOfLineKeys } = getTableKeyInfo(selectedTable);

	if (hasOutOfLineKeys) {
		const keys: any[] = [];
		const items = jsonData.map((item) => {
			const { __primaryKey__, ...rest } = item;
			keys.push(__primaryKey__);
			return rest;
		});

		await selectedTable.bulkAdd(items, keys);
	} else {
		await selectedTable.bulkAdd(jsonData);
	}
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
