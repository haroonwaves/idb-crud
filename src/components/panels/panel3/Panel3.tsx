import { ActionButtons } from '@/components/panels/panel3/ActionButtons';
import { updateRecord } from '@/databases/actions';
import { state } from '@/state/state';
import { JsonViewer } from '@/components/panels/panel3/JsonViewer';

export function Panel3() {
	const selectedRows = state.dataTable.selectedRows.value;
	const selectedTable = state.database.table.value;

	return (
		<div className="flex h-full flex-col select-none">
			{selectedTable && <ActionButtons selectedRows={selectedRows} />}
			<div className="flex-1 overflow-y-auto">
				{selectedRows.length > 0 ? (
					<JsonViewer
						title={'selected_records'}
						value={selectedRows}
						onEdit={(props) => void updateRecord(props)}
					/>
				) : (
					<p className="text-muted-foreground flex h-full items-center justify-center text-center text-sm">
						Select record(s) to view
					</p>
				)}
			</div>
		</div>
	);
}
