import { state } from '@/state/state';
import indexedDbOps from '@/databases/indexedDb/indexedDbOps';
import { InteractionProps } from 'react-json-view';
import { extractColumns } from '@/databases/helpers';
import oboe from 'oboe';
import { storageOps } from '@/databases/storage/storageOps';

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
		throw error;
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
