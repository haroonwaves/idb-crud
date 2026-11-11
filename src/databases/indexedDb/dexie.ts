import Dexie from 'dexie';

const dexieInstances: Record<string, Dexie> = {};

export const dexieDb = {
	dbNames: () => Object.keys(dexieInstances),
	connect: async () => {
		try {
			const databaseNames = await Dexie.getDatabaseNames();
			for (const name of databaseNames) {
				if (!name) continue;
				if (!dexieInstances[name]) {
					dexieInstances[name] = new Dexie(name);
				}
			}
		} catch (error) {
			console.warn('Failed to get database names:', error);
		}
	},
	select: (dbName: string) => {
		if (dbName in dexieInstances) return dexieInstances[dbName];
		if (dbName) {
			dexieInstances[dbName] = new Dexie(dbName);
			return dexieInstances[dbName];
		}
	},
};
