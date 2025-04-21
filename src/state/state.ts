import { signal } from '@preact/signals';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';

const database = {
	selected: signal(''),
	table: {
		selected: signal(''),
		query: {
			sort: signal<SortingState>([]),
			filter: signal<ColumnFiltersState>([]),
			pagination: signal<PaginationState>({ pageIndex: 0, pageSize: 10 }),
		},
		data: {
			total: signal(0),
			rows: signal<any[]>([]),
			selected: signal<any[]>([]),
		},
	},
};

export const state = {
	database,
};
