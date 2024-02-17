export class DexieBuilder {
  // Private variables
  #dexieInstance;
  #selectedTable;
  #collection;

  constructor(dexieInstance) {
    this.#dexieInstance = dexieInstance;
  }

  table(tableName) {
    this.#selectedTable = this.#dexieInstance.table(tableName);
    this.#collection = this.#selectedTable.toCollection();
    this.primaryKey = this.#selectedTable.schema.primKey.keyPath;
    this.secondaryKeys = this.#selectedTable.schema.indexes.map(
      (index) => index.keyPath
    );

    return this;
  }

  where(queryObject) {
    const keysOfQuery = Object.keys(queryObject);
    this.whereCondition = queryObject;

    if (this.primaryKey) {
      this.#collection = this.#selectedTable.where(queryObject);
    } else {
      // Non-indexed query
      this.#collection = this.#selectedTable.filter((item) =>
        keysOfQuery.every((key) => item[key] === queryObject[key])
      );
    }

    return this;
  }

  async insert(data) {
    return await (Array.isArray(data)
      ? this.#selectedTable.bulkPut(data)
      : this.#selectedTable.put(data));
  }

  async toArray(...columnNames) {
    let results = await this.#collection.toArray();

    if (columnNames.length > 0) {
      results = results.map((item) => {
        const selected = {};
        for (const columnName of columnNames)
          selected[columnName] = item[columnName];
        return selected;
      });
    }
    return results;
  }

  async update(updatedFields) {
    const primaryKeyFromUpdatedFields = Object.keys(updatedFields).some(
      (key) => this.primaryKey === key
    );

    if (primaryKeyFromUpdatedFields) {
      const [oldValue] = await this.toArray();
      const newValue = { ...oldValue, ...updatedFields };
      await this.delete();
      await this.insert(newValue);
      return 1;
    }

    return await this.#collection.modify(updatedFields);
  }

  async delete() {
    return await this.#collection.delete();
  }

  limit(count) {
    this.#collection = this.#collection.limit(count);
    return this;
  }

  offset(count) {
    this.#collection = this.#collection.offset(count);
    return this;
  }

  orderBy(fieldName, direction = "asc") {
    this.#collection =
      direction === "asc"
        ? this.#selectedTable.orderBy(fieldName)
        : this.#selectedTable.orderBy(fieldName).reverse();
    return this;
  }

  equalTo(fieldName, value) {
    this.#collection = this.#collection.and(
      (item) => item[fieldName] === value
    );
    return this;
  }

  lessThan(fieldName, value) {
    this.#collection = this.#collection.and((item) => item[fieldName] < value);
    return this;
  }

  greaterThan(fieldName, value) {
    this.#collection = this.#collection.and((item) => item[fieldName] > value);
    return this;
  }

  count() {
    return this.#collection.count();
  }

  drop() {
    this.#selectedTable.clear();
  }

  isOpen() {
    return this.#dexieInstance.isOpen();
  }

  open() {
    return this.#dexieInstance.open();
  }

  allTables() {
    return this.#dexieInstance.tables;
  }
}
