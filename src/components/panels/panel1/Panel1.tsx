import { Database } from '@/src/components/panels/panel1/Database';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/components/ui/Select';
import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { state } from '@/src/state/state';
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

function getDbNames() {
	if (state.database.type.value === 'indexedDb') return dexieDb.dbNames();
	if (state.database.type.value === 'localStorage') return ['localstorage'];
	if (state.database.type.value === 'sessionStorage') return ['sessionstorage'];
	return [];
}

export function Panel1() {
	const [isConnected, setIsConnected] = useState(false);
	const selectedDb = state.database.type.value;

	useEffect(() => {
		void dexieDb.connect().then(() => setIsConnected(true));
	}, []);

	if (!isConnected) {
		return <div className="text-muted-foreground text-center text-sm">Connecting...</div>;
	}

	const dbNames = getDbNames();

	return (
		<div className="select-none">
			<Select
				value={selectedDb}
				onValueChange={(value: string) => (state.database.type.value = value)}
			>
				<SelectTrigger className="mb-2 w-full">
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
			{dbNames.length > 0 ? (
				<div className="flex flex-col">
					{dbNames.map((dbName) => (
						<Database key={dbName} dbName={dbName} />
					))}
				</div>
			) : (
				<p className="text-muted-foreground text-center text-sm">
					{selectedDb ? 'No databases found' : ''}
				</p>
			)}
		</div>
	);
}
