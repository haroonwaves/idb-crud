import { signal } from '@preact/signals';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';

export type DbType = 'indexedDb' | 'storage';

const database = {
	type: signal<DbType>(),
	selected: signal(''),
	table: signal(''),
};

const dataTable = {
	rows: signal<object[]>([]),
	selectedRows: signal<object[]>([]),
	columns: signal<string[]>([]),

	totalRows: signal(0),
	isLoading: signal(false),

	query: {
		sort: signal<SortingState>([]),
		filter: signal<ColumnFiltersState>([]),
		pagination: signal<PaginationState>({ pageIndex: 0, pageSize: 15 }),
	},
};

const errors = signal<Array<{ message: string; details: string }>>([]);

export const state = {
	database,
	dataTable,
	errors,
};
