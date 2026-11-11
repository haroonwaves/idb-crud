import { Database } from '@/components/panels/panel1/Database';
import { dexieDb } from '@/databases/indexedDb/dexie';
import { loadTable } from '@/databases/actions';
import { state } from '@/state/state';
import {
	Database as DbIcon,
	Search,
	HardDrive,
	Clock,
	RotateCw,
	ChevronDown,
	Check as CheckIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { Tooltip } from '@/components/ui/Tooltip';
import { batch } from '@preact/signals';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

type StorageCategory = 'indexedDb' | 'Local storage' | 'Session storage';

function getStorageCategory(
	dbType: string | undefined,
	selectedDatabase: string
): StorageCategory {
	if (dbType !== 'storage') return 'indexedDb';
	return selectedDatabase === 'Session storage' ? 'Session storage' : 'Local storage';
}

function getStorageMeta(category: StorageCategory) {
	if (category === 'Local storage') {
		return { label: 'Local Storage', Icon: HardDrive };
	}
	if (category === 'Session storage') {
		return { label: 'Session Storage', Icon: Clock };
	}
	return { label: 'IndexedDB', Icon: DbIcon };
}

export function Panel1() {
	const selectedDbType = state.database.type.value;
	const selectedDatabase = state.database.selected.value;

	const [isConnected, setIsConnected] = useState(false);
	const [dbNames, setDbNames] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	const selectedStorageCategory = getStorageCategory(selectedDbType, selectedDatabase);
	const { label: currentStorageLabel, Icon: CurrentIcon } =
		getStorageMeta(selectedStorageCategory);

	const loadDatabases = useCallback(async () => {
		try {
			setIsConnected(false);
			await dexieDb.connect();
			const names = dexieDb.dbNames();
			setDbNames(names);
			setIsConnected(true);
		} catch (error) {
			console.warn('Failed to load databases:', error);
			setIsConnected(true);
		}
	}, []);

	useEffect(() => {
		void loadDatabases();
	}, [loadDatabases]);

	const handleSelectStorageCategory = (category: StorageCategory) => {
		if (category === 'indexedDb') {
			batch(() => {
				state.database.type.value = 'indexedDb';
				state.database.selected.value = '';
				state.database.table.value = '';
			});
			void loadDatabases();
		} else {
			batch(() => {
				state.database.type.value = 'storage';
				state.database.selected.value = category;
				state.database.table.value = window.location.origin;
			});
		}
	};

	const handleRefresh = async () => {
		if (selectedStorageCategory !== 'indexedDb') {
			await loadTable();
		} else {
			await loadDatabases();
			if (state.database.table.value) {
				await loadTable();
			}
		}
	};

	const searchPlaceholder =
		selectedStorageCategory === 'indexedDb' ? 'Search databases...' : 'Search storage...';
	const refreshTooltip =
		selectedStorageCategory === 'indexedDb' ? 'Refresh databases' : 'Refresh storage';

	const renderIndexedDbTree = () => {
		if (!isConnected) {
			return <div className="py-4 text-center text-xs text-gray-400">Loading databases...</div>;
		}
		if (dbNames.length === 0) {
			return <div className="py-4 text-center text-xs text-gray-400">No databases found</div>;
		}
		return (
			<>
				{dbNames.map((dbName) => (
					<Database
						key={dbName}
						dbName={dbName}
						selectedDbType="indexedDb"
						filterQuery={searchQuery}
					/>
				))}
			</>
		);
	};

	return (
		<div className="flex h-full flex-col select-none">
			{/* Header: Storage Selector Dropdown */}
			<div className="flex h-13 shrink-0 items-center px-3">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="group flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100/70"
						>
							<div className="flex min-w-0 items-center gap-2">
								<CurrentIcon className="size-4 shrink-0 text-gray-800" strokeWidth={2} />
								<span className="truncate text-sm font-semibold tracking-tight text-gray-900">
									{currentStorageLabel}
								</span>
							</div>
							<ChevronDown className="size-4 shrink-0 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-52" align="start">
						<DropdownMenuItem
							onClick={() => handleSelectStorageCategory('indexedDb')}
							className={`flex cursor-pointer items-center justify-between gap-2 px-2.5 py-2 ${
								selectedStorageCategory === 'indexedDb'
									? 'bg-blue-50/70 font-medium text-blue-600'
									: 'text-gray-700'
							}`}
						>
							<div className="flex items-center gap-2">
								<DbIcon className="size-4 shrink-0" strokeWidth={1.75} />
								<span>IndexedDB</span>
							</div>
							{selectedStorageCategory === 'indexedDb' && (
								<CheckIcon className="size-3.5 text-blue-600" />
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSelectStorageCategory('Local storage')}
							className={`flex cursor-pointer items-center justify-between gap-2 px-2.5 py-2 ${
								selectedStorageCategory === 'Local storage'
									? 'bg-blue-50/70 font-medium text-blue-600'
									: 'text-gray-700'
							}`}
						>
							<div className="flex items-center gap-2">
								<HardDrive className="size-4 shrink-0" strokeWidth={1.75} />
								<span>Local Storage</span>
							</div>
							{selectedStorageCategory === 'Local storage' && (
								<CheckIcon className="size-3.5 text-blue-600" />
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSelectStorageCategory('Session storage')}
							className={`flex cursor-pointer items-center justify-between gap-2 px-2.5 py-2 ${
								selectedStorageCategory === 'Session storage'
									? 'bg-blue-50/70 font-medium text-blue-600'
									: 'text-gray-700'
							}`}
						>
							<div className="flex items-center gap-2">
								<Clock className="size-4 shrink-0" strokeWidth={1.75} />
								<span>Session Storage</span>
							</div>
							{selectedStorageCategory === 'Session storage' && (
								<CheckIcon className="size-3.5 text-blue-600" />
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Search Row + Refresh Button */}
			<div className="flex items-center gap-1.5 px-4 pb-2">
				<div className="relative flex flex-1 items-center">
					<Search className="absolute left-2.5 size-3.5 text-gray-400" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => {
							const val = (e.target as HTMLInputElement).value;
							setSearchQuery(val);
							if (selectedStorageCategory !== 'indexedDb') {
								state.dataTable.searchTerm.value = val;
							}
						}}
						placeholder={searchPlaceholder}
						className="w-full rounded-md border border-gray-200 bg-gray-50/60 py-1.5 pr-3 pl-8 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition-colors hover:bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20"
					/>
				</div>
				<Tooltip content={refreshTooltip}>
					<button
						type="button"
						onClick={() => void handleRefresh()}
						className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-2xs transition-colors hover:bg-gray-50 hover:text-gray-800"
					>
						<RotateCw className="size-3.5" />
					</button>
				</Tooltip>
			</div>

			{/* Navigation Tree */}
			<div className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2 text-xs">
				{selectedStorageCategory === 'indexedDb' ? (
					renderIndexedDbTree()
				) : (
					/* Local Storage or Session Storage view */
					<div className="space-y-0.5">
						<button
							type="button"
							onClick={() => {
								batch(() => {
									state.database.type.value = 'storage';
									state.database.selected.value = selectedStorageCategory;
									state.database.table.value = window.location.origin;
								});
								void loadTable();
							}}
							className={`group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-md py-1.5 pr-3 pl-2 text-xs transition-colors ${
								selectedDbType === 'storage' &&
								selectedDatabase === selectedStorageCategory &&
								state.database.table.value === window.location.origin
									? 'bg-blue-50/90 font-medium text-blue-600'
									: 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
							}`}
						>
							<div className="flex min-w-0 items-center gap-2">
								<CurrentIcon
									className={`size-3.5 shrink-0 ${
										selectedDbType === 'storage' &&
										selectedDatabase === selectedStorageCategory &&
										state.database.table.value === window.location.origin
											? 'text-blue-600'
											: 'text-gray-500'
									}`}
									strokeWidth={1.75}
								/>
								<span className="truncate text-left">{window.location.origin}</span>
							</div>
							{selectedDbType === 'storage' &&
								selectedDatabase === selectedStorageCategory &&
								state.database.table.value === window.location.origin && (
									<span className="absolute inset-y-0 right-0 w-[2.5px] bg-blue-600" />
								)}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
