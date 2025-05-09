import { state } from '@/src/state/state';
import indexedDbActions from '@/src/databases/indexedDb/actions/actions';
import { InteractionProps } from 'react-json-view';
import { extractColumns } from '@/src/databases/helpers';
import oboe from 'oboe';

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
		if (selectedDbType === 'indexedDb') await indexedDbActions.createRecord(newRecord);
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
		if (selectedDbType === 'indexedDb') rows = await indexedDbActions.loadRecords(countUpdater);
	} catch (error) {
		setError('Error loading table', error as Error);
		throw error;
	}

	state.dataTable.columns.value = extractColumns(rows);
	state.dataTable.rows.value = rows;

	state.dataTable.isLoading.value = false;
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
		if (selectedDbType === 'indexedDb') {
			await indexedDbActions.updateRecord(existingRow, updatedRow);
		}
	} catch (error) {
		setError('Error updating record', error as Error);
		throw error;
	}

	await loadTable();
}

export async function deleteSelectedRows() {
	const selectedDbType = state.database.type.value;

	try {
		if (selectedDbType === 'indexedDb') await indexedDbActions.deleteRecords();
	} catch (error) {
		setError('Error deleting records', error as Error);
		throw error;
	}

	await loadTable();
}

export async function exportRecords() {
	const selectedDbType = state.database.type.value;

	state.dataTable.isLoading.value = true;

	try {
		if (selectedDbType === 'indexedDb') await indexedDbActions.exportRecords();
	} catch (error) {
		setError('Error exporting records', error as Error);
		throw error;
	}

	state.dataTable.isLoading.value = false;
}

export async function importRecords(file: File) {
	const selectedDbType = state.database.type.value;
	state.dataTable.isLoading.value = true;

	try {
		if (selectedDbType === 'indexedDb') {
			let batch: any[] = [];
			const BATCH_SIZE = 10_000;
			let totalProcessed = 0;

			await new Promise<void>((resolve, reject) => {
				// Convert File to URL for oboe
				const fileUrl = URL.createObjectURL(file);

				oboe({
					url: fileUrl,
					headers: { 'Content-Type': 'application/json' },
				})
					.node('!.*', (record) => {
						try {
							batch.push(record);
							totalProcessed++;

							if (batch.length >= BATCH_SIZE) {
								// We need to create a new batch to avoid race conditions
								const currentBatch = [...batch];
								batch = [];

								// Process batch in background
								indexedDbActions
									.importRecords(currentBatch)
									.then(() => {
										state.dataTable.totalRows.value = totalProcessed;
									})
									.catch((error) => {
										reject(new Error(`Failed to import batch: ${error.message}`));
									});
							}

							// Return oboe.drop to free up memory
							return oboe.drop;
						} catch (error) {
							reject(
								new Error(
									`Failed to process record: ${error instanceof Error ? error.message : String(error)}`
								)
							);
							return oboe.drop;
						}
					})
					.done(() => {
						// Process final batch if any
						if (batch.length > 0) {
							indexedDbActions
								.importRecords(batch)
								.then(() => {
									state.dataTable.totalRows.value = totalProcessed;
									URL.revokeObjectURL(fileUrl);
									resolve();
								})
								.catch((error) => {
									URL.revokeObjectURL(fileUrl);
									reject(new Error(`Failed to import final batch: ${error.message}`));
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
		}
	} catch (error) {
		setError('Error importing records', error as Error);
		throw error;
	} finally {
		state.dataTable.isLoading.value = false;
	}
}
