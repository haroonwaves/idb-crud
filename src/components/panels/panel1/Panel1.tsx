import { Database } from '@/src/components/panels/panel1/Database';
import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';

export function Panel1() {
	const [open, setOpen] = useState(true);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		void dexieDb.connect().then(() => setIsConnected(true));
	}, []);

	if (!isConnected) return <div className="text-muted-foreground ml-6 text-sm">Connecting...</div>;

	const dbNames = dexieDb.dbNames();

	return (
		<div className="select-none">
			<button
				className={`flex w-full items-center ${open ? 'text-gray-400' : ''}`}
				onClick={() => setOpen(!open)}
			>
				<div className="mr-1 h-5 w-5 transition-transform duration-200">
					<ChevronRight
						className={`h-5 w-5 ${open ? 'rotate-90' : ''}`}
						fill="currentColor"
						stroke={null}
					/>
				</div>
				<span className="font-medium">IndexedDB</span>
			</button>
			{open &&
				(dbNames.length > 0 ? (
					<div className="ml-4 flex flex-col">
						{dbNames.map((dbName) => (
							<Database key={dbName} dbName={dbName} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground ml-6 text-sm">No databases found</p>
				))}
		</div>
	);
}
