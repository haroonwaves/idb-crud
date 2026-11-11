import { Info } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { useState } from 'preact/hooks';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog';

export function Panel1Footer() {
	const [infoOpen, setInfoOpen] = useState(false);
	const version = process.env.APP_VERSION || '3.0.0';

	return (
		<>
			<div className="flex h-11 shrink-0 items-center justify-between bg-white px-4 mb-3 select-none">
				<Tooltip content="About IDB CRUD">
					<Info
						className="size-3.5 cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
						strokeWidth={1.75}
						onClick={() => setInfoOpen(true)}
					/>
				</Tooltip>

				<span className="font-mono text-[11px] text-gray-400">v{version}</span>
			</div>

			<Dialog open={infoOpen} onOpenChange={setInfoOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>About IDB CRUD Database Manager</DialogTitle>
						<DialogDescription>
							Manage IndexedDB, LocalStorage, and SessionStorage with an intuitive interface.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 py-2 text-sm text-gray-600">
						<p>Version: v{version}</p>
						<div className="flex gap-4 pt-2">
							<a
								href="https://chromewebstore.google.com/detail/idb-crud-database-manager/olbigpjodejcmmdkafnhaphdblimjogg"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline"
							>
								Chrome Web Store
							</a>
							<a
								href="https://github.com/haroonwaves/idb-crud"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline"
							>
								GitHub Repository
							</a>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
