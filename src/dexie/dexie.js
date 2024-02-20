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

export async function getPagedData(
  dbName,
  tableName,
  query,
  page,
  pageSize = 20
) {
  const offset = page * pageSize;
  const selectedTable = dexieDatabase[dbName].table(tableName);
  const primaryKey = selectedTable.primaryKey;

  const result = await selectedTable
    .orderBy(primaryKey, "desc")
    .offset(offset)
    .limit(pageSize)
    .where(query)
    .toArray();

  return result;
}

export async function getCount(dbName, tableName, query) {
  return dexieDatabase[dbName].table(tableName).where(query).count();
}

export async function replace(existingValues, newValues, dbName, tableName) {
  const selectedTable = dexieDatabase[dbName].table(tableName);
  const primaryKey = selectedTable.primaryKey;

  for (const oldValue of existingValues) {
    const primaryKeyValue = oldValue[primaryKey];
    await selectedTable.where({ [primaryKey]: primaryKeyValue }).delete();
  }

  await selectedTable.insert(newValues);
}

export async function deleteData(dbName, tableName, values) {
  const selectedTable = dexieDatabase[dbName].table(tableName);
  const primaryKey = selectedTable.primaryKey;

  const promises = [];

  for (const value of values) {
    const promise = selectedTable
      .where({ [primaryKey]: value[primaryKey] })
      .delete();
    promises.push(promise);
  }

  await Promise.all(promises);
}
