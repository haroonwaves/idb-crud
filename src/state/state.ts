import { signal } from '@preact/signals';
import {
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
} from '@tanstack/react-table';

const database = {
	type: signal(''),
	selected: signal(''),
	table: signal(''),
};

const dataTable = {
	rows: signal<object[]>([]),
	columns: signal<string[]>([]),

	totalRows: signal(0),
	selectedRows: signal<RowSelectionState>({}),

	isLoading: signal(false),

	query: {
		sort: signal<SortingState>([]),
		filter: signal<ColumnFiltersState>([]),
		pagination: signal<PaginationState>({ pageIndex: 0, pageSize: 10 }),
	},
};

export const state = {
	database,
	dataTable,
};
