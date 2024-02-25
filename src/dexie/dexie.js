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
  pageSize = 20,
  sortBy = undefined,
  sortDirection = "desc"
) {
  const offset = page * pageSize;
  const selectedTable = dexieDatabase[dbName].table(tableName);
  const primaryKey = selectedTable.primaryKey;

  const result = await selectedTable
    .orderBy(sortBy ?? primaryKey, sortDirection)
    .where(query)
    .offset(offset)
    .limit(pageSize)
    .toArray();

  return result;
}

export async function getCount(dbName, tableName, query) {
  return dexieDatabase[dbName].table(tableName).where(query).count();
}

export function getIndexedColumns(dbName, tableName) {
  const selectedTable = dexieDatabase[dbName].table(tableName);

  return {
    primaryKey: selectedTable.primaryKey,
    secondaryKeys: selectedTable.secondaryKeys,
  };
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
