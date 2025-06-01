import { loadTable } from '@/src/databases/actions';
import { state } from '@/src/state/state';
import { batch, untracked } from '@preact/signals';

function resetDataTableStates() {
	batch(() => {
		state.dataTable.columns.value = []; // reset columns
		state.dataTable.rows.value = []; // reset rows
		state.dataTable.selectedRows.value = []; // reset selected rows
		state.dataTable.totalRows.value = 0; // reset total rows
		state.dataTable.isLoading.value = false; // reset is loading
		state.dataTable.query.sort.value = []; // reset sort
		state.dataTable.query.filter.value = []; // reset filter
		state.dataTable.query.pagination.value = { pageIndex: 0, pageSize: 15 }; // reset pagination
	});
}

state.database.type.subscribe((type) => {
	if (type) {
		state.database.table.value = '';
		untracked(() => resetDataTableStates());
	}
});

state.database.selected.subscribe((selected) => {
	if (selected) untracked(() => resetDataTableStates());
});

state.database.table.subscribe((table) => {
	if (table) {
		untracked(() => resetDataTableStates());
		void loadTable();
	}
});

state.dataTable.query.sort.subscribe((sort) => {
	if (sort.length > 0) void loadTable(false);
});

state.dataTable.query.filter.subscribe((filter) => {
	state.dataTable.query.pagination.value = untracked(() => ({
		pageIndex: 0,
		pageSize: state.dataTable.query.pagination.value.pageSize,
	}));
	if (filter) void loadTable();
});

state.dataTable.query.pagination.subscribe(() => {
	void loadTable(false);
});
