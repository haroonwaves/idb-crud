import { Database } from '@/src/components/panels/panel1/Database';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/Select';
import { Tooltip } from '@/src/components/ui/Tooltip';
import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { state } from '@/src/state/state';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';

const dbTypes = [
	{
		label: 'IndexedDB',
		value: 'indexedDb',
	},
	{
		label: 'LocalStorage',
		value: 'localStorage',
	},
	{
		label: 'SessionStorage',
		value: 'sessionStorage',
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
						<Database key={dbName} dbName={dbName} />
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

	async function getDbNames() {
		setIsConnected(false);
		setDbNames([]);

		if (selectedDbType === 'indexedDb') {
			await dexieDb.connect();
			const dbNames = dexieDb.dbNames();
			setDbNames(dbNames);
		}
		if (selectedDbType === 'localStorage') {
			setDbNames(['localstorage']);
		}
		if (selectedDbType === 'sessionStorage') {
			setDbNames(['sessionstorage']);
		}

		setIsConnected(true);
	}

	useEffect(() => {
		void getDbNames();
	}, [selectedDbType]);

	return (
		<div className="select-none">
			<div className="mb-2 flex items-center gap-2">
				<Select
					value={selectedDbType}
					onValueChange={(value: string) => (state.database.type.value = value)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a database" />
						<SelectContent>
							{dbTypes.map((dbType) => (
								<SelectItem key={dbType.value} value={dbType.value}>
									{dbType.label}
								</SelectItem>
							))}
						</SelectContent>
					</SelectTrigger>
				</Select>
				<Tooltip content="Refresh databases">
					<RefreshCcw
						className="hover:text-primary size-4 cursor-pointer"
						onClick={() => void getDbNames()}
					/>
				</Tooltip>
			</div>
			{renderContent()}
		</div>
	);
}
