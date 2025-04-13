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

export async function getCount() {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;
  const query = appState.query.value.filter;

  return dexieDatabase.select(dbName).table(tableName).where(query).count();
}

export function getIndexedColumns() {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  const selectedTable = dexieDatabase.select(dbName).table(tableName);
  const primaryKey = selectedTable.primaryKey ?? [];
  const secondaryKeys = selectedTable.secondaryKeys ?? [];

  return {
    primaryKeys: Array.isArray(primaryKey)
      ? [...primaryKey].flat().filter(Boolean)
      : [primaryKey].filter(Boolean),
    secondaryKeys: secondaryKeys.flat().filter(Boolean),
  };
}
