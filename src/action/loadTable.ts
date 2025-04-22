import { loadFromIndexedDb } from '@/src/databases/indexedDb/query';
import { state } from '@/src/state/state';

export async function loadTable() {
	const selectedDbType = state.database.type.value;

	if (selectedDbType === 'indexedDb') {
		const result = await loadFromIndexedDb();
		state.dataTable.rows.value = result?.rows ?? [];
		state.dataTable.totalRows.value = result?.total ?? 0;
	}
}
