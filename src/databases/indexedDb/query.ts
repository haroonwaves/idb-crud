import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { state } from '@/src/state/state';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import Dexie from 'dexie';

function handleSort(table: Dexie.Table, sort: SortingState) {
	const sortField = sort[0]?.id;
	const sortDirection = sort[0]?.desc ? 'desc' : 'asc';

	let query = table.toCollection();

	if (sortField) {
		query = table.orderBy(sortField);
		if (sortDirection === 'desc') query = query.reverse();
	}

	return query;
}

function handleFilter(query: Dexie.Collection, filter: ColumnFiltersState) {
	for (const filterItem of filter) {
		const value = filterItem.value as string;
		if (value) {
			query = query.filter((item) => {
				const fieldValue = String(item[filterItem.id]);
				return fieldValue.toLowerCase().includes(value.toLowerCase());
			});
		}
	}

	return query;
}

export async function loadFromIndexedDb() {
	const selectedDatabase = state.database.selected.value;
	if (!selectedDatabase) return;

	const db = dexieDb.select(selectedDatabase);
	if (!db) return;

	const table = db.table(state.database.table.value);
	const sort = state.dataTable.query.sort.value;
	const filter = state.dataTable.query.filter.value;
	const { pageIndex, pageSize } = state.dataTable.query.pagination.value;

	let query = table.toCollection();

	if (sort.length > 0) query = handleSort(table, sort);
	if (filter.length > 0) query = handleFilter(query, filter);

	const total = await query.count();

	query = query.offset(pageIndex * pageSize).limit(pageSize);

	const rows = await query.toArray();

	return { rows, total };
}
