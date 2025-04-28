import ReactJsonViewer, { InteractionProps } from 'react-json-view';

export function JsonViewer({
	title,
	value,
	onEdit,
	onAdd,
}: Readonly<{
	title: string;
	value: object[] | object;
	onEdit: (props: InteractionProps) => void;
	onAdd?: (props: InteractionProps) => void;
}>) {
	return (
		<ReactJsonViewer
			theme="rjv-default"
			style={{ fontFamily: 'monospace' }}
			name={title}
			displayObjectSize
			collapsed={1}
			quotesOnKeys={false}
			enableClipboard={false}
			displayDataTypes={true}
			collapseStringsAfterLength={100}
			groupArraysAfterLength={50}
			src={value}
			onEdit={onEdit}
			onAdd={onAdd}
		/>
	);
}
