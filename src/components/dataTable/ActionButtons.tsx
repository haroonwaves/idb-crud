import { Tooltip } from '@/src/components/ui/Tooltip';
import { exportRecords, importRecords, loadTable } from '@/src/databases/actions';
import { Download as Import, RefreshCcw, Upload as Export } from 'lucide-react';
import { useRef } from 'preact/hooks';

export function ActionButtons() {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await importRecords(file);
			await loadTable();
		}

		target.value = '';
	};

	return (
		<div className="flex h-9 items-center justify-center gap-4 rounded-md border px-3 py-1 shadow-2xl">
			<div className="flex gap-4">
				<Tooltip content="Refresh table">
					<RefreshCcw
						className="hover:text-primary size-4 cursor-pointer"
						onClick={() => loadTable()}
					/>
				</Tooltip>
				<Tooltip content="Export table (JSON)">
					<Export
						className="hover:text-primary size-4 cursor-pointer"
						onClick={() => exportRecords()}
					/>
				</Tooltip>
				<Tooltip content="Import table (JSON)">
					<Import
						className="hover:text-primary size-4 cursor-pointer"
						onClick={() => fileInputRef.current?.click()}
					/>
				</Tooltip>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					className="hidden"
					onChange={(event) => {
						void handleFileSelect(event);
					}}
				/>
			</div>
		</div>
	);
}
