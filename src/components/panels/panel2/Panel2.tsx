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

function constructColumns(tableData: object[]) {
	const uniqueColumns = new Set<string>();

	tableData.forEach((row: object) => {
		Object.keys(row).forEach((key) => {
			uniqueColumns.add(key);
		});
	});

	const columns = [...uniqueColumns];

	const columnDefs: ColumnDef<any>[] = columns.map((columnName) => {
		return {
			id: columnName,
			accessorKey: columnName,
			header: ({ column }) => <ColumnHeader column={column} title={columnName} />,
		};
	});

	columnDefs.unshift(selectCheckboxColumn);

	return columnDefs;
}

export function Panel2() {
	const selectedDatabase = state.database.selected.value;
	const selectedTabel = state.database.table.selected.value;

	const totalRows = state.database.table.data.total.value;

	const computedData = computed(() => {
		const tableData = state.database.table.data.rows.value;
		const columns = constructColumns(tableData as object[]);

		return { columns, rows: tableData };
	});

	const columns = computedData.value.columns;
	const rows = computedData.value.rows;

	if (!selectedDatabase || !selectedTabel) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<p className="font-semibold">Select a table to start</p>
			</div>
		);
	}

	return (
		<div className="p-4">
			<DataTable columns={columns} data={rows} totalRows={totalRows} />
		</div>
	);
}
