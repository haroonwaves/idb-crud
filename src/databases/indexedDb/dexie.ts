import Dexie from 'dexie';

const dexieInstances: Record<string, Dexie> = {};

export const dexieDb = {
	dbNames: () => Object.keys(dexieInstances),
	connect: async () => {
		const databaseNames = await Dexie.getDatabaseNames();
		for (const name of databaseNames) dexieInstances[name] = new Dexie(name);
	},
	select: (dbName: string) => {
		if (dbName in dexieInstances) return dexieInstances[dbName];
		throw new Error(`Database ${dbName} not found`);
	},
};
