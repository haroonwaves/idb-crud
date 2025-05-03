import { signal } from '@preact/signals';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';

const database = {
	type: signal(''),
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
		pagination: signal<PaginationState>({ pageIndex: 0, pageSize: 10 }),
	},
};

const errors = signal<Array<{ message: string; details?: string }>>([]);

export const state = {
	database,
	dataTable,
	errors,
};
