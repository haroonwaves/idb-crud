import Dexie from "dexie";

import { DexieBuilder } from "./dexie-builder";

export async function connect() {
  const databaseNames = await Dexie.getDatabaseNames();

  const databases = {};

  for (const name of databaseNames) {
    databases[name] = new DexieBuilder(new Dexie(name));
  }

  return databases;
}

export async function getPagedData(database, tableName, page, pageSize) {
  const selectedTable = database.table(tableName);
  const primaryKey = selectedTable.primaryKey;

  const result = await selectedTable
    .orderBy(primaryKey, "desc")
    .offset(page)
    .limit(pageSize)
    .toArray();

  return result;
}
