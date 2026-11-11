import { state } from '@/state/state';
import indexedDbOps from '@/databases/indexedDb/indexedDbOps';
import { dexieDb } from '@/databases/indexedDb/dexie';
import { InteractionProps } from 'react-json-view';
import { extractColumns, getStreamWriter, getTableKeyInfo } from '@/databases/helpers';
import oboe from 'oboe';
import { storageOps } from '@/databases/storage/storageOps';
import { parseValueForDisplay, safeJsonStringify } from '@/lib/utils';

function setError(message: string, error: Error) {
	state.errors.value = [
		...state.errors.value,
		{
			message,
			details: error instanceof Error ? error.message : 'Unknown error',
		},
	];
}

export async function createRecord(newRecord: object) {
	const selectedDbType = state.database.type.value;

	try {
		if (selectedDbType === 'storage') storageOps.createRecord(newRecord);
		if (selectedDbType === 'indexedDb') await indexedDbOps.createRecord(newRecord);
	} catch (error) {
		setError('Error creating record', error as Error);
		throw error;
	}

	await loadTable();
}

export async function loadTable(loadCounts: boolean = true) {
	const selectedDbType = state.database.type.value;
	const selectedTable = state.database.table.value;

	if (!selectedDbType || !selectedTable) {
		state.dataTable.isLoading.value = false;
		return;
	}

	let rows: object[] = [];

	const countUpdater = loadCounts
		? (totalCount: number) => (state.dataTable.totalRows.value = totalCount)
		: null;

	state.dataTable.isLoading.value = true;

	try {
		if (selectedDbType === 'storage') rows = storageOps.loadRecords(countUpdater);
		if (selectedDbType === 'indexedDb') rows = await indexedDbOps.loadRecords(countUpdater);
	} catch (error) {
		setError('Error loading table', error as Error);
		console.warn('Error loading table:', error);
	} finally {
		state.dataTable.isLoading.value = false;
	}

	state.dataTable.columns.value = extractColumns(rows);
	state.dataTable.rows.value = rows;
}

export async function updateRecord({ existing_src, updated_src, namespace }: InteractionProps) {
	let existingRow: object | null = null;
	let updatedRow: object | null = null;

	const nameSpace = namespace[0];

	if (nameSpace) {
		const existing = existing_src[nameSpace as keyof typeof existing_src];
		const updated = updated_src[nameSpace as keyof typeof updated_src];
		if (existing) existingRow = existing;
		if (updated) updatedRow = updated;
	}

	if (!existingRow || !updatedRow) return;

	await updateRecordDirect(existingRow, updatedRow);
}

export async function updateRecordDirect(existingRow: object, updatedRow: object) {
	const selectedDbType = state.database.type.value;

	try {
		if (selectedDbType === 'storage') storageOps.updateRecord(existingRow, updatedRow);
		if (selectedDbType === 'indexedDb') await indexedDbOps.updateRecord(existingRow, updatedRow);
		await loadTable();
	} catch (error) {
		setError('Error updating record', error as Error);
		throw error;
	}
}

export async function copySelectedRows() {
	const selectedRows = state.dataTable.selectedRows.value;
	if (selectedRows.length === 0) return;
	const formatted = selectedRows.map((row) => parseValueForDisplay(row));
	await navigator.clipboard.writeText(safeJsonStringify(formatted, 2));
}

function duplicateStorageRow(row: object) {
	const r = row as { key?: unknown; value?: unknown };
	if (r.key !== undefined) {
		const keyStr = typeof r.key === 'string' ? r.key : safeJsonStringify(r.key, 0);
		const newKey = `${keyStr}_copy_${Date.now().toString(36)}`;
		storageOps.createRecord({ key: newKey, value: r.value });
	}
}

async function duplicateIndexedDbRow(row: object) {
	let clone: Record<string, unknown>;
	try {
		clone = structuredClone(row) as Record<string, unknown>;
	} catch {
		clone = JSON.parse(safeJsonStringify(row));
	}
	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const table = dexieDb.select(dbName)?.table(tableName);
	if (!table) return;

	const { keyField, hasOutOfLineKeys } = getTableKeyInfo(table);
	if (hasOutOfLineKeys) {
		delete clone.__primaryKey__;
		await table.add(clone);
		return;
	}

	if (!keyField) return;
	const primKey = table.schema.primKey as any;
	if (primKey?.autoIncrement) {
		delete clone[keyField];
	} else if (typeof clone[keyField] === 'string') {
		clone[keyField] = `${String(clone[keyField])}_copy`;
	} else if (typeof clone[keyField] === 'number') {
		clone[keyField] = Number(clone[keyField]) + 1;
	}
	await table.add(clone);
}

export async function duplicateSelectedRows() {
	const selectedDbType = state.database.type.value;
	const selectedRows = state.dataTable.selectedRows.value;
	if (selectedRows.length === 0) return;

	try {
		for (const row of selectedRows) {
			if (selectedDbType === 'storage') {
				duplicateStorageRow(row);
			} else if (selectedDbType === 'indexedDb') {
				await duplicateIndexedDbRow(row);
			}
		}
		await loadTable();
	} catch (error) {
		setError('Error duplicating record', error as Error);
		throw error;
	}
}

export async function exportSelectedRows() {
	const selectedRows = state.dataTable.selectedRows.value;
	if (selectedRows.length === 0) {
		await exportRecords();
		return;
	}

	const dbName = state.database.selected.value;
	const tableName = state.database.table.value;
	const { writer, encoder } = await getStreamWriter(`${dbName}_${tableName}_selected.json`);

	let isFirst = true;
	for (const row of selectedRows) {
		const prefix = isFirst ? '' : ',\n';
		const jsonIndented = JSON.stringify(row, null, 2)
			.split('\n')
			.map((line) => `  ${line}`)
			.join('\n');
		void writer.write(encoder.encode(prefix + jsonIndented));
		isFirst = false;
	}
	await writer.write(encoder.encode('\n]'));
	await writer.close();
}

export async function deleteSelectedRows() {
	const selectedDbType = state.database.type.value;

	try {
		if (selectedDbType === 'storage') storageOps.deleteRecords();
		if (selectedDbType === 'indexedDb') await indexedDbOps.deleteRecords();
		await loadTable();
	} catch (error) {
		setError('Error deleting records', error as Error);
		throw error;
	}
}

export async function exportRecords() {
	const selectedDbType = state.database.type.value;

	state.dataTable.isLoading.value = true;

	try {
		if (selectedDbType === 'storage') await storageOps.exportRecords();
		if (selectedDbType === 'indexedDb') await indexedDbOps.exportRecords();
	} catch (error) {
		setError('Error exporting records', error as Error);
		throw error;
	} finally {
		state.dataTable.isLoading.value = false;
	}
}

export async function importRecords(file: File) {
	const selectedDbType = state.database.type.value;
	state.dataTable.isLoading.value = true;

	async function importBatch(batch: any[], cb?: () => void) {
		if (selectedDbType === 'storage') {
			storageOps.importRecords(batch);
			cb?.();
		}
		if (selectedDbType === 'indexedDb') {
			await indexedDbOps.importRecords(batch);
			cb?.();
		}
	}

	try {
		let batch: any[] = [];
		const BATCH_SIZE = 10_000;

		await new Promise<void>((resolve, reject) => {
			const fileUrl = URL.createObjectURL(file);

			oboe({
				url: fileUrl,
				headers: { 'Content-Type': 'application/json' },
			})
				.node('!.*', (record) => {
					batch.push(record);

					if (batch.length >= BATCH_SIZE) {
						const currentBatch = [...batch];
						batch = [];

						void importBatch(currentBatch);
					}
					return oboe.drop;
				})
				.done(() => {
					if (batch.length > 0) {
						void importBatch(batch, () => {
							URL.revokeObjectURL(fileUrl);
							resolve();
						});
					} else {
						URL.revokeObjectURL(fileUrl);
						resolve();
					}
				})
				.fail((error) => {
					URL.revokeObjectURL(fileUrl);
					const errorMessage = error.thrown
						? error.thrown.message || 'Unknown parsing error'
						: String(error as Error);
					reject(new Error(`Failed to parse JSON: ${errorMessage}`));
				});
		});

		await loadTable();
	} catch (error) {
		setError('Error importing records', error as Error);
		throw error;
	} finally {
		state.dataTable.isLoading.value = false;
	}
}
