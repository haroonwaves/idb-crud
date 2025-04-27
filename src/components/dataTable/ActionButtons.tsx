import { CopyIcon, Download, Plus, RefreshCcw, Trash, Upload } from 'lucide-react';

export function ActionButtons() {
	return (
		<div className="flex h-9 items-center justify-center gap-4 rounded-md border px-3 py-1 shadow-2xl">
			<div className="flex gap-4">
				<RefreshCcw className="size-4" />
				<Download className="size-4" />
				<Upload className="size-4" />
			</div>
			<div className="h-6 w-[1px] bg-gray-200" />
			<div className="flex gap-4">
				<Plus className="size-4" />
				<Trash className="size-4" />
				<CopyIcon className="size-4" />
			</div>
		</div>
	);
}
