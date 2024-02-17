import Dexie from "dexie";

import { DexieBuilder } from "./dexie-builder";

const dexieDatabaseMethods = {
  dbNames: () => Object.keys(dexieDatabase),
  connect: async () => {
    const databaseNames = await Dexie.getDatabaseNames();

    for (const name of databaseNames) {
      dexieDatabase[name] = new DexieBuilder(new Dexie(name));
    }
  },
};

const dexieDatabase = Object.create(dexieDatabaseMethods);

export default dexieDatabase;

export async function getPagedData(dbName, tableName, page, pageSize = 20) {
  const selectedTable = dexieDatabase[dbName].table(tableName);
  const primaryKey = selectedTable.primaryKey;

  const result = await selectedTable
    .orderBy(primaryKey, "desc")
    .offset(page)
    .limit(pageSize)
    .toArray();

  return result;
}

export async function getCount(dbName, tableName) {
  return dexieDatabase[dbName].table(tableName).count();
}
