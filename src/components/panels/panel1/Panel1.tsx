import { Database } from '@/components/panels/panel1/Database';
import { ActionIconsContainer } from '@/components/ui/ActionIconsContainer';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select';
import { Tooltip } from '@/components/ui/Tooltip';
import { dexieDb } from '@/databases/indexedDb/dexie';
import { DbType, state } from '@/state/state';
import { RefreshCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'preact/hooks';

const dbTypes: { label: string; value: DbType }[] = [
	{
		label: 'IndexedDB',
		value: 'indexedDb',
	},
	{
		label: 'Storages',
		value: 'storage',
	},
];

export function Panel1() {
	const selectedDbType = state.database.type.value;

	const [isConnected, setIsConnected] = useState(false);
	const [dbNames, setDbNames] = useState<string[]>([]);

	const renderContent = () => {
		if (!isConnected) {
			return <div className="text-muted-foreground text-center text-sm">Connecting...</div>;
		}
		if (dbNames.length > 0) {
			return (
				<div className="flex flex-col">
					{dbNames.map((dbName) => (
						<Database key={dbName} dbName={dbName} selectedDbType={selectedDbType} />
					))}
				</div>
			);
		}
		return (
			<p className="text-muted-foreground text-center text-sm">
				{selectedDbType ? 'No databases found' : ''}
			</p>
		);
	};

	const getDbNames = useCallback(async () => {
		setIsConnected(false);
		setDbNames([]);
		state.database.table.value = '';
		state.database.selected.value = '';

		if (selectedDbType === 'storage') setDbNames(['Local storage', 'Session storage']);
		if (selectedDbType === 'indexedDb') {
			await dexieDb.connect();
			const dbNames = dexieDb.dbNames();
			setDbNames(dbNames);
		}

		setIsConnected(true);
	}, [selectedDbType]);

	useEffect(() => {
		void getDbNames();
	}, [getDbNames]);

	return (
		<div className="flex-1 select-none">
			<div className="sticky top-0 z-10 flex w-full gap-2 bg-white py-3">
				<div className="min-w-0 flex-1">
					<Select
						value={selectedDbType}
						onValueChange={(value: DbType) => (state.database.type.value = value)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a db" />
							<SelectContent>
								{dbTypes.map((dbType) => (
									<SelectItem key={dbType.value} value={dbType.value}>
										{dbType.label}
									</SelectItem>
								))}
							</SelectContent>
						</SelectTrigger>
					</Select>
				</div>
				<ActionIconsContainer>
					<Tooltip content="Refresh databases">
						<RefreshCcw
							className="hover:text-primary size-4 cursor-pointer"
							onClick={() => void getDbNames()}
						/>
					</Tooltip>
				</ActionIconsContainer>
			</div>
			{renderContent()}
		</div>
	);
}
