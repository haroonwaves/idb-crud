import Dexie from "dexie";

import { DexieBuilder } from "./dexie-builder";
import appState from "../AppState/appSate";

const dexieInstances = {};

const dexieDatabase = {
  dbNames: () => Object.keys(dexieInstances),
  connect: async () => {
    const databaseNames = await Dexie.getDatabaseNames();

    for (const name of databaseNames) {
      dexieInstances[name] = new Dexie(name);
    }
  },
  select: (dbName) => {
    if (dbName in dexieInstances) {
      return new DexieBuilder(dexieInstances[dbName]);
    }

    throw new Error(`Database ${dbName} not found`);
  },
};

export default dexieDatabase;

export async function getPagedData(
  query,
  page,
  pageSize = 20,
  sortBy = undefined,
  sortDirection = "desc"
) {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  const offset = page * pageSize;
  const selectedTable = dexieDatabase.select(dbName).table(tableName);
  const primaryKey = selectedTable.primaryKey;

  const result = await selectedTable
    .orderBy(
      sortBy ?? (Array.isArray(primaryKey) ? primaryKey[0] : primaryKey),
      sortDirection
    )
    .where(query)
    .offset(offset)
    .limit(pageSize)
    .toArray();

  return result;
}

export async function getCount(query) {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  return dexieDatabase.select(dbName).table(tableName).where(query).count();
}

export function getIndexedColumns() {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  const selectedTable = dexieDatabase.select(dbName).table(tableName);

  return {
    primaryKey: selectedTable.primaryKey,
    secondaryKeys: selectedTable.secondaryKeys,
  };
}

export async function replace(existingValues, newValues) {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  const selectedTable = dexieDatabase.select(dbName).table(tableName);
  const primaryKey = Array.isArray(selectedTable.primaryKey)
    ? selectedTable.primaryKey[0]
    : selectedTable.primaryKey;

  for (const oldValue of existingValues) {
    const key = primaryKey || Object.keys(oldValue)[0];
    const value = oldValue[key];
    await selectedTable.where({ [key]: value }).delete();
  }

  await selectedTable.insert(newValues);
}

export async function deleteData(values) {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  const selectedTable = dexieDatabase.select(dbName).table(tableName);
  const primaryKey = Array.isArray(selectedTable.primaryKey)
    ? selectedTable.primaryKey[0]
    : selectedTable.primaryKey;

  const promises = [];

  for (const value of values) {
    const key = primaryKey || Object.keys(value)[0];
    const promise = selectedTable.where({ [key]: value[key] }).delete();
    promises.push(promise);
  }

  await Promise.all(promises);
}
