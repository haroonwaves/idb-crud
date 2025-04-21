import { state } from '@/src/state/state';
import { dexieDb } from '@/src/databases/indexedDb/dexie';
import Dexie from 'dexie';

async function queryTable(db: Dexie) {
	const table = db.table(state.database.table.selected.value);
	const sort = state.database.table.query.sort.value;
	const filter = state.database.table.query.filter.value;
	const { pageIndex, pageSize } = state.database.table.query.pagination.value;

	let query = table.toCollection();

	if (sort.length > 0) {
		const sortField = sort[0]?.id;
		const sortDirection = sort[0]?.desc ? 'desc' : 'asc';

		if (sortField) {
			query = table.orderBy(sortField);
			if (sortDirection === 'desc') query = query.reverse();
		}
	}

	if (filter.length > 0) {
		for (const filterItem of filter) {
			const value = filterItem.value as string;
			if (value) {
				query = query.filter((item) => {
					const fieldValue = String(item[filterItem.id]);
					return fieldValue.toLowerCase().includes(value.toLowerCase());
				});
			}
		}
	}

	const total = await query.count();

	query = query.offset(pageIndex * pageSize).limit(pageSize);

	const rows = await query.toArray();

	return { rows, total };
}

async function loadTableData() {
	const selectedDatabase = state.database.selected.value;
	if (!selectedDatabase) return;

	const db = dexieDb.select(selectedDatabase);
	if (!db) return;

	const { rows, total } = await queryTable(db);

	state.database.table.data.rows.value = rows ?? [];
	state.database.table.data.total.value = total ?? 0;
}

state.database.table.selected.subscribe((table) => {
	if (table) void loadTableData();
});

state.database.table.query.sort.subscribe((sort) => {
	if (sort) void loadTableData();
});

state.database.table.query.filter.subscribe((filter) => {
	if (filter) void loadTableData();
});

state.database.table.query.pagination.subscribe((pagination) => {
	if (pagination) void loadTableData();
});
