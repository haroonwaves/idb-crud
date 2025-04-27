import { state } from '@/src/state/state';
import { useSignalEffect } from '@preact/signals';
import { useState } from 'preact/hooks';
import JsonViewer from 'react-json-view';

export function Panel3() {
	const [selectedRows, setSelectedRows] = useState<object[]>([]);

	useSignalEffect(() => {
		const selectedRows = state.dataTable.selectedRows.value;
		const tableData = state.dataTable.rows.value;
		const selectedRowsData = Object.keys(selectedRows)
			.map((row) => tableData[Number(row)])
			.filter((row) => row !== undefined);
		setSelectedRows(selectedRowsData);
	});

	return selectedRows.length > 0 ? (
		<JsonViewer
			theme="rjv-default"
			name={'selected_rows'}
			defaultValue={'placeholder'}
			displayObjectSize
			collapsed={1}
			quotesOnKeys={false}
			enableClipboard={false}
			displayDataTypes={true}
			collapseStringsAfterLength={100}
			groupArraysAfterLength={50}
			src={selectedRows}
			onEdit={() => {}}
		/>
	) : (
		<p className="text-muted-foreground flex h-full items-center justify-center text-center text-sm">
			Select row(s) to view
		</p>
	);
}
