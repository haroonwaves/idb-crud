import { loadTable } from '@/src/action/loadTable';
import { state } from '@/src/state/state';

state.database.table.subscribe((table) => {
	if (table) void loadTable();
});

state.dataTable.query.sort.subscribe((sort) => {
	if (sort) void loadTable();
});

state.dataTable.query.filter.subscribe((filter) => {
	if (filter) void loadTable();
});

state.dataTable.query.pagination.subscribe((pagination) => {
	if (pagination) void loadTable();
});
