import { loadTable } from '@/src/databases/actions';
import { state } from '@/src/state/state';

function resetDataTableStates() {
	state.dataTable.columns.value = []; // reset columns
	state.dataTable.rows.value = []; // reset rows
	state.dataTable.selectedRows.value = []; // reset selected rows
	state.dataTable.totalRows.value = 0; // reset total rows
	state.dataTable.isLoading.value = false; // reset is loading
	state.dataTable.query.sort.value = []; // reset sort
	state.dataTable.query.filter.value = []; // reset filter
	state.dataTable.query.pagination.value = { pageIndex: 0, pageSize: 10 }; // reset pagination
}

state.database.selected.subscribe((selected) => {
	if (selected) {
		resetDataTableStates();
		void loadTable();
	}
});

state.database.table.subscribe((table) => {
	if (table) {
		resetDataTableStates();
		void loadTable();
	}
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
