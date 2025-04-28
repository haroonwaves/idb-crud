import { state } from '@/src/state/state';
import indexedDbActions from '@/src/databases/indexedDb/actions/actions';
import { InteractionProps } from 'react-json-view';
import { extractColumns } from '@/src/databases/helpers';

export async function createRecord(newRecord: object) {
	const selectedDbType = state.database.type.value;

	if (selectedDbType === 'indexedDb') await indexedDbActions.createRecord(newRecord);
	await loadTable();
}

export async function loadTable() {
	const selectedDbType = state.database.type.value;

	let result: { rows: object[]; total: number } = { rows: [], total: 0 };

	if (selectedDbType === 'indexedDb') result = await indexedDbActions.loadRecords();

	state.dataTable.columns.value = extractColumns(result.rows);
	state.dataTable.rows.value = result.rows;
	state.dataTable.totalRows.value = result.total;
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

	if (selectedDbType === 'indexedDb') {
		await indexedDbActions.updateRecord(existingRow, updatedRow);
	}
	await loadTable();
}

export async function deleteSelectedRows() {
	const selectedDbType = state.database.type.value;

	if (selectedDbType === 'indexedDb') await indexedDbActions.deleteRecords();
	await loadTable();
}
