import dexieDatabase from "../../../../dexie/dexie";

export function getKeyType(dbName, tableName, key) {
  const tableSchema = dexieDatabase.select(dbName).table(tableName).schema();
  const primaryKey = tableSchema.primKey.keyPath;
  const isPrimaryKey = isKeyMatch(primaryKey, key);

  if (isPrimaryKey) {
    const isCompound = Array.isArray(primaryKey) && primaryKey.length > 1;
    const isMulti = tableSchema.primKey.multi;

    return isCompound
      ? "Compound Key"
      : isMulti
      ? "Multi Entry Key"
      : "Primary Key";
  }

  const secondaryIndexes = tableSchema.indexes;
  const secondaryKey = secondaryIndexes.find((index) =>
    isKeyMatch(index.keyPath, key)
  );

  if (secondaryKey) {
    const isCompound =
      Array.isArray(secondaryKey.keyPath) && secondaryKey.keyPath.length > 1;
    const isMulti = secondaryKey.multi;
    return isCompound
      ? "Compound Key"
      : isMulti
      ? "Multi-entry Key"
      : "Secondary Key";
  }

  return;
}

function isKeyMatch(keyPath, key) {
  if (Array.isArray(keyPath)) {
    return keyPath.some((part) => part === key);
  }
  return keyPath === key;
}
