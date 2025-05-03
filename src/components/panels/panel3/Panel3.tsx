import { ActionButtons } from '@/src/components/panels/panel3/ActionButtons';
import { updateRecord } from '@/src/databases/actions';
import { state } from '@/src/state/state';
import { JsonViewer } from '@/src/components/panels/panel3/JsonViewer';
import { ErrorFooter } from '@/src/components/panels/ErrorFooter';

export function Panel3() {
	const selectedRows = state.dataTable.selectedRows.value;
	const selectedTable = state.database.table.value;

	return (
		<div className="flex h-full flex-col select-none">
			{selectedTable && (
				<div className="sticky top-0 z-10">
					<ActionButtons selectedRows={selectedRows} />
				</div>
			)}
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
			<div className="absolute bottom-4 z-10 w-[calc(100%-1rem)]">
				<ErrorFooter />
			</div>
		</div>
	);
}
