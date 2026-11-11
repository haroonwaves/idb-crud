import { state } from '@/state/state';
import { DataTable } from '@/components/dataTable/DataTable';
import { useMemo } from 'preact/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnHeader } from '@/components/dataTable/ColumnHeader';
import { Checkbox } from '@/components/ui/Checkbox';
import { Database } from 'lucide-react';
import { ErrorFooter } from '@/components/panels/ErrorFooter';
import { safeJsonStringify } from '@/lib/utils';

const selectCheckboxColumn = {
	id: 'select',
	header: ({ table }: { table: any }) => (
		<div className="flex items-center justify-center">
			<Checkbox
				checked={
					table.getRowModel().rows.length > 0 &&
					(table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate'))
				}
				disabled={table.getRowModel().rows.length === 0}
				onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="border-gray-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 disabled:opacity-40"
			/>
		</div>
	),
	cell: ({ row }: { row: any }) => (
		<div
			className="flex items-center justify-center"
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="border-gray-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
			/>
		</div>
	),
	enableSorting: false,
	enableHiding: false,
	size: 40,
};

function renderStringOrPrimitive(value: unknown) {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (
			(trimmed.startsWith('{') && trimmed.endsWith('}')) ||
			(trimmed.startsWith('[') && trimmed.endsWith(']'))
		) {
			try {
				const parsed = JSON.parse(trimmed);
				const jsonStr = safeJsonStringify(parsed);
				return (
					<span
						className="inline-block max-w-full truncate rounded bg-gray-100/90 px-1.5 py-0.5 font-mono text-[11px] text-gray-700"
						title={jsonStr}
					>
						{jsonStr}
					</span>
				);
			} catch {
				// not valid JSON, display as normal string
			}
		}
	}

	const displayStr = typeof value === 'string' ? value : String(value as number | boolean | bigint);
	return <span className="truncate text-xs text-gray-800">{displayStr}</span>;
}

function renderCellContent(value: unknown) {
	if (value === null) {
		return (
			<span className="font-mono text-xs font-medium text-indigo-600 select-none">
				null
			</span>
		);
	}

	if (value === undefined || value === '') {
		return <span className="text-gray-400 select-none">—</span>;
	}

	if (value instanceof Date) {
		return (
			<span className="truncate font-mono text-xs text-gray-800" title={value.toISOString()}>
				{value.toISOString()}
			</span>
		);
	}

	if (typeof value === 'object') {
		const jsonStr = safeJsonStringify(value);
		return (
			<span
				className="inline-block max-w-full truncate rounded bg-gray-100/90 px-1.5 py-0.5 font-mono text-[11px] text-gray-700"
				title={jsonStr}
			>
				{jsonStr}
			</span>
		);
	}

	if (typeof value === 'boolean') {
		return (
			<span
				className={`font-mono text-xs font-medium ${value ? 'text-emerald-600' : 'text-rose-600'}`}
			>
				{String(value)}
			</span>
		);
	}

	return renderStringOrPrimitive(value);
}

function constructColumns(columns: string[]) {
	const validColumns = columns.filter(
		(colName) => Boolean(colName && colName.trim() && colName !== 'select')
	);
	if (validColumns.length === 0) {
		return [];
	}

	const columnDefs: ColumnDef<any>[] = validColumns.map((columnName) => {
		const title = columnName === '__primaryKey__' ? 'Primary Key' : columnName;
		return {
			id: columnName,
			accessorKey: columnName,
			header: ({ column }) => <ColumnHeader column={column} title={title} />,
			cell: ({ row }) => renderCellContent(row.getValue(columnName)),
		};
	});

	columnDefs.unshift(selectCheckboxColumn);

	return columnDefs;
}

export function Panel2() {
	const selectedDatabase = state.database.selected.value;
	const selectedTable = state.database.table.value;

	const rows = state.dataTable.rows.value;
	const totalRows = state.dataTable.totalRows.value;
	const columns = state.dataTable.columns.value;

	const computedColumns = useMemo(() => {
		return constructColumns(columns);
	}, [columns]);

	if (!selectedDatabase || !selectedTable) {
		return (
			<div className="flex h-full flex-col min-w-0 bg-white">
				<div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center select-none">
					<div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200/90 bg-white text-gray-400 shadow-2xs">
						<Database className="size-7 text-gray-400" strokeWidth={1.5} />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-gray-800">No table selected</h3>
						<p className="mt-1 max-w-xs text-xs text-gray-400">
							Select a database and table from the sidebar to inspect records and schemas.
						</p>
					</div>
				</div>
				<ErrorFooter />
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col min-w-0 bg-white">
			<div className="flex-1 min-h-0 overflow-hidden">
				<DataTable columns={computedColumns} data={rows} totalRows={totalRows} />
			</div>
			<ErrorFooter />
		</div>
	);
}
