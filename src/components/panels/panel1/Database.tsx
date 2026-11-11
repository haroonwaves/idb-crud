import { Table } from '@/components/panels/panel1/Table';
import { dexieDb } from '@/databases/indexedDb/dexie';
import { ChevronRight, ChevronDown, Database as DbIcon, Folder, FolderOpen } from 'lucide-react';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { DbType, state } from '@/state/state';

type DatabaseProps = {
	dbName: string;
	selectedDbType: DbType | undefined;
	filterQuery?: string;
};

async function getIndexedDbTables(dbName: string) {
	try {
		const db = dexieDb.select(dbName);
		if (!db) return [];

		if (!db.isOpen()) await db?.open();
		return db.tables.map((table) => table.name);
	} catch (error) {
		console.warn(`Failed to open IndexedDB ${dbName}:`, error);
		return [];
	}
}

export function Database({ dbName, selectedDbType, filterQuery = '' }: Readonly<DatabaseProps>) {
	const isDbSelected = state.database.selected.value === dbName;
	const [open, setOpen] = useState<boolean>(isDbSelected || true);
	const [tables, setTables] = useState<string[]>([]);
	const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ databases: true });

	const getTables = useCallback(async () => {
		try {
			let tables: string[] = [];

			if (selectedDbType === 'storage') tables = [window.location.origin];
			if (selectedDbType === 'indexedDb') tables = await getIndexedDbTables(dbName);

			setTables(tables);
		} catch (error) {
			console.warn(`Failed to get tables for ${dbName}:`, error);
		}
	}, [dbName, selectedDbType]);

	useEffect(() => {
		void getTables();
	}, [getTables]);

	useEffect(() => {
		if (isDbSelected) setOpen(true);
	}, [isDbSelected]);

	const toggleFolder = (folderName: string) => {
		setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
	};

	// Filter tables if filterQuery is present
	const filteredTables = filterQuery
		? tables.filter((t) => t.toLowerCase().includes(filterQuery.toLowerCase()))
		: tables;

	if (
		filterQuery &&
		!dbName.toLowerCase().includes(filterQuery.toLowerCase()) &&
		filteredTables.length === 0
	) {
		return null;
	}

	return (
		<div className="mb-0.5">
			<button
				type="button"
				className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-100/70"
				onClick={() => setOpen(!open)}
			>
				<span className="text-gray-400">
					{open ? (
						<ChevronDown className="size-3.5 shrink-0" strokeWidth={1.75} />
					) : (
						<ChevronRight className="size-3.5 shrink-0" strokeWidth={1.75} />
					)}
				</span>
				<DbIcon className="size-3.5 shrink-0 text-gray-500" strokeWidth={1.75} />
				<span className="truncate font-medium text-gray-800">{dbName}</span>
			</button>

			{open && (
				<div className="ml-3.5 space-y-0.5 border-l border-gray-100 pl-2">
					{filteredTables.length > 0 ? (
						filteredTables.map((table) => {
							// Check if this table looks like a grouped folder (e.g. databases/logs or just table)
							if (table.includes('/')) {
								const parts = table.split('/');
								const folder = parts[0] || 'folder';
								const isFolderOpen = openFolders[folder] ?? true;

								return (
									<div key={table} className="space-y-0.5">
										<button
											type="button"
											onClick={() => toggleFolder(folder)}
											className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100/70"
										>
											<span className="text-gray-400">
												{isFolderOpen ? (
													<ChevronDown className="size-3 shrink-0" strokeWidth={1.75} />
												) : (
													<ChevronRight className="size-3 shrink-0" strokeWidth={1.75} />
												)}
											</span>
											{isFolderOpen ? (
												<FolderOpen className="size-3.5 text-gray-400" strokeWidth={1.75} />
											) : (
												<Folder className="size-3.5 text-gray-400" strokeWidth={1.75} />
											)}
											<span className="truncate">{folder}</span>
										</button>
										{isFolderOpen && (
											<div className="ml-4 border-l border-gray-100 pl-1.5">
												<Table table={table} dbName={dbName} />
											</div>
										)}
									</div>
								);
							}

							return <Table key={table} table={table} dbName={dbName} />;
						})
					) : (
						<div className="px-2 py-1 text-[11px] text-gray-400">No tables</div>
					)}
				</div>
			)}
		</div>
	);
}
