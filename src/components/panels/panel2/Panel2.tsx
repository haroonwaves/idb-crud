import { signals } from '@/src/state/signals';

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

	return <div className="p-2">Panel2</div>;
}
