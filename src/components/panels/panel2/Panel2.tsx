import { state } from '@/src/state/state';
import { DataTable } from '@/src/components/dataTable/DataTable';
import { computed } from '@preact/signals';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnHeader } from '@/src/components/dataTable/ColumnHeader';
import { Checkbox } from '@/src/components/ui/Checkbox';

const selectCheckboxColumn = {
	id: 'select',
	header: ({ table }: { table: any }) => (
		<Checkbox
			checked={
				table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
			}
			onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
			aria-label="Select all"
		/>
	),
	cell: ({ row }: { row: any }) => (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
			aria-label="Select row"
		/>
	),
	enableSorting: false,
	enableHiding: false,
};

function constructColumns(columns: string[]) {
	const columnDefs: ColumnDef<any>[] = columns.map((columnName) => {
		return {
			id: columnName,
			accessorKey: columnName,
			header: ({ column }) => <ColumnHeader column={column} title={columnName} />,
			cell: ({ row }) => {
				const value = row.getValue(columnName);
				if (typeof value === 'object' || typeof value === 'function') return JSON.stringify(value);
				return String(value as any);
			},
		};
	});

	columnDefs.unshift(selectCheckboxColumn);

	return columnDefs;
}

export function Panel2() {
	const selectedDatabase = state.database.selected.value;
	const selectedTabel = state.database.table.value;

	const rows = state.dataTable.rows.value;
	const totalRows = state.dataTable.totalRows.value;

	const computedColumns = computed(() => {
		return constructColumns(state.dataTable.columns.value);
	});

	if (!selectedDatabase || !selectedTabel) {
		return (
			<p className="text-muted-foreground flex h-full items-center justify-center text-center text-sm">
				Select a table to view
			</p>
		);
	}

	return <DataTable columns={computedColumns.value} data={rows} totalRows={totalRows} />;
}
