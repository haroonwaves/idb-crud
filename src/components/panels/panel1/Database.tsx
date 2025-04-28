import { Table } from '@/src/components/panels/panel1/Table';
import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';

type DatabaseProps = {
	dbName: string;
};

export function Database({ dbName }: Readonly<DatabaseProps>) {
	const [open, setOpen] = useState(false);
	const [tables, setTables] = useState<string[]>([]);

	async function openDatabase() {
		const db = dexieDb.select(dbName);
		if (!db) return;

		if (!db.isOpen()) await db?.open();
		setTables(db.tables.map((table) => table.name));
	}

	useEffect(() => {
		void openDatabase();
	}, [dbName]);

	return (
		<>
			<button
				className={`hover:bg-accent/60 flex w-full items-center rounded-md p-1 ${
					open ? 'opacity-50' : ''
				}`}
				onClick={() => setOpen(!open)}
			>
				<div className="mr-1 h-5 w-5 transition-transform duration-200">
					<ChevronRight
						className={`h-5 w-5 ${open ? 'rotate-90' : ''}`}
						fill="currentColor"
						stroke={null}
					/>
				</div>
				<span className="overflow-hidden text-ellipsis whitespace-nowrap">{dbName}</span>
			</button>
			{open && (
				<div className="ml-6 flex flex-col">
					{tables.map((table) => (
						<Table key={table} table={table} dbName={dbName} />
					))}
				</div>
			)}
		</>
	);
}
