import { ActionButtons } from '@/src/components/panels/panel3/ActionButtons';
import { updateRecord } from '@/src/databases/actions';
import { state } from '@/src/state/state';
import { JsonViewer } from '@/src/components/panels/panel3/JsonViewer';

export function Panel3() {
	const selectedRows = state.dataTable.selectedRows.value;

	return (
		<>
			<div className="sticky top-0 z-10">
				<ActionButtons selectedRows={selectedRows} />
			</div>
			{selectedRows.length > 0 ? (
				<JsonViewer
					title={'selected_rows'}
					value={selectedRows}
					onEdit={(props) => void updateRecord(props)}
				/>
			) : (
				<p className="text-muted-foreground flex h-full items-center justify-center text-center text-sm">
					Select row(s) to view
				</p>
			)}
		</>
	);
}
