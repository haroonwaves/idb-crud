import { loadTable } from '@/src/databases/actions';
import { Download, RefreshCcw, Upload } from 'lucide-react';

export function ActionButtons() {
	return (
		<div className="flex h-9 items-center justify-center gap-4 rounded-md border px-3 py-1 shadow-2xl">
			<div className="flex gap-4">
				<RefreshCcw className="size-4 cursor-pointer" onClick={() => loadTable()} />
				<Download className="size-4 cursor-pointer" />
				<Upload className="size-4 cursor-pointer" />
			</div>
		</div>
	);
}
