import Dexie from "dexie";

export async function connect() {
  const databaseNames = await Dexie.getDatabaseNames();

  const databases = {};

  for (const name of databaseNames) {
    databases[name] = new Dexie(name);
  }

  return databases;
}

export async function get(db, selectedTable) {
  const data = await db.table(selectedTable).toArray();

  return data;
}
