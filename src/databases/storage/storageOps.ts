import { getStreamWriter } from '@/src/databases/helpers';
import { state } from '@/src/state/state';

const getStorage = () => {
	const selectedStorage = state.database.selected.value;
	const storage = selectedStorage === 'Local storage' ? localStorage : sessionStorage;
	return storage;
};

const checkForKeyValue = (data: object) => 'key' in data && 'value' in data;

function createRecord(newRow: object) {
	if (!checkForKeyValue(newRow)) throw new Error('key and value are required for localStorage');

	getStorage().setItem(String(newRow.key), JSON.stringify(newRow.value));
}

function getAllRows() {
	let rows: object[] = [];

	for (const [key, value] of Object.entries(getStorage())) {
		let parsedValue = '';

		try {
			parsedValue = JSON.parse(value as string);
		} catch {
			parsedValue = value;
		}

		rows.push({ key, value: parsedValue });
	}

	return rows;
}

function loadRecords(countUpdater: ((totalCount: number) => void) | null) {
	let rows: object[] = getAllRows();

	const sort = state.dataTable.query.sort.value[0];
	const filter = state.dataTable.query.filter.value[0];
	const { pageIndex, pageSize } = state.dataTable.query.pagination.value;

	if (filter?.id && filter?.value) {
		rows = rows.filter((row) => {
			const rowValue = JSON.stringify(row[filter.id as keyof typeof row]);
			const filterValue = filter.value as string;
			return rowValue.toLowerCase().includes(filterValue.toLowerCase());
		});
	}

	if (sort?.id) {
		rows = rows.sort((a, b) => {
			const rowValueA = JSON.stringify(a[sort.id as keyof typeof a]);
			const rowValueB = JSON.stringify(b[sort.id as keyof typeof b]);

			if (sort.desc) return rowValueB.localeCompare(rowValueA);
			return rowValueA.localeCompare(rowValueB);
		});
	}

	countUpdater?.(rows.length);

	const start = pageIndex * pageSize;
	const end = Math.min(rows.length, start + pageSize);

	return rows.slice(start, end);
}

function updateRecord(existingRow: object, updatedRow: object) {
	if (!checkForKeyValue(updatedRow))
		throw new Error(`key and value are required for ${getStorage().name}`);
	if (!checkForKeyValue(existingRow))
		throw new Error(`key and value are required for ${getStorage().name}`);

	getStorage().removeItem(String(existingRow.key));
	getStorage().setItem(String(updatedRow.key), JSON.stringify(updatedRow.value));
}

function deleteRecords() {
	const selectedRows = state.dataTable.selectedRows.value;
	for (const row of selectedRows) {
		if ('key' in row) getStorage().removeItem(String(row.key));
	}
}

async function exportRecords() {
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;

	const rows = getAllRows();
	const { writer, encoder } = await getStreamWriter(`${dbName}_${tableName}.json`);

	let isFirst = true;

	for (const row of rows) {
		const prefix = isFirst ? '' : ',\n';

		const jsonIndented = JSON.stringify(row, null, 2)
			.split('\n')
			.map((line) => `  ${line}`) // indent each line of the object
			.join('\n');

		void writer.write(encoder.encode(prefix + jsonIndented));
		isFirst = false;
	}

	await writer.write(encoder.encode('\n]'));
	await writer.close();
}

function importRecords(jsonData: any[]) {
	for (const row of jsonData) {
		if (typeof row !== 'object')
			throw new Error('row must be an object, use the idb-crud exported json file');
		if (!checkForKeyValue(row as object))
			throw new Error(`key and value are required for ${getStorage().name}`);

		getStorage().setItem(String(row.key), JSON.stringify(row.value));
	}
}

export const storageOps = {
	createRecord,
	loadRecords,
	updateRecord,
	deleteRecords,
	exportRecords,
	importRecords,
};
