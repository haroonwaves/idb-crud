import { loadTable } from '@/databases/actions';
import { state } from '@/state/state';
import { batch, untracked } from '@preact/signals';

let isResetting = false;

function resetDataTableStates() {
	isResetting = true;
	batch(() => {
		state.dataTable.columns.value = []; // reset columns
		state.dataTable.rows.value = []; // reset rows
		state.dataTable.selectedRows.value = []; // reset selected rows
		state.dataTable.totalRows.value = 0; // reset total rows
		state.dataTable.isLoading.value = false; // reset is loading
		state.dataTable.searchTerm.value = ''; // reset search term
		state.dataTable.columnVisibility.value = {}; // reset column visibility
		state.dataTable.query.sort.value = []; // reset sort
		state.dataTable.query.filter.value = []; // reset filter
		state.dataTable.query.pagination.value = { pageIndex: 0, pageSize: 15 }; // reset pagination
	});
	isResetting = false;
}

let prevType = state.database.type.peek();
let prevSelected = state.database.selected.peek();
let prevTable = state.database.table.peek();

state.database.type.subscribe((type) => {
	if (prevType && type && prevType !== type) {
		if (type === 'indexedDb') {
			state.database.table.value = '';
		}
		untracked(() => resetDataTableStates());
	}
	prevType = type;
});

state.database.selected.subscribe((selected) => {
	if (isResetting) return;
	const dbType = state.database.type.peek();
	const table = state.database.table.peek();

	if (prevSelected !== selected) {
		untracked(() => resetDataTableStates());
		if (dbType === 'storage' && table && selected && prevTable === table) {
			void loadTable();
		}
	}
	prevSelected = selected;
});

state.database.table.subscribe((table) => {
	if (prevTable !== table && table) {
		untracked(() => resetDataTableStates());
		void loadTable();
	}
	prevTable = table;
});

state.dataTable.query.sort.subscribe((sort) => {
	if (isResetting) return;
	const selectedTable = state.database.table.peek();
	if (selectedTable && sort.length > 0) void loadTable(false);
});

state.dataTable.query.filter.subscribe((filter) => {
	if (isResetting) return;
	const selectedTable = state.database.table.peek();
	if (!selectedTable) return;
	state.dataTable.query.pagination.value = untracked(() => ({
		pageIndex: 0,
		pageSize: state.dataTable.query.pagination.value.pageSize,
	}));
	if (filter) void loadTable();
});

state.dataTable.query.pagination.subscribe(() => {
	if (isResetting) return;
	const selectedTable = state.database.table.peek();
	if (selectedTable) void loadTable(false);
});
