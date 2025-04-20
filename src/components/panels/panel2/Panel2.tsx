import { signals } from '@/src/state/signals';
import { DataTable } from '@/src/components/dataTable/DataTable';
import { columns, payments } from '@/src/components/dataTable/data';

export function Panel2() {
	const selectedDatabase = signals.selectedDatabase.value;
	const selectedTabel = signals.selectedTable.value;

	if (!selectedDatabase || !selectedTabel) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<p className="font-semibold">Select a table to start</p>
			</div>
		);
	}

	return (
		<div className="p-4">
			<DataTable columns={columns} data={payments} />
		</div>
	);
}
