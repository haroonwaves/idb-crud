export class DexieBuilder {
  // Private variables
  #dexieInstance;
  #selectedTable;
  #collection;

  #sortField = null; // for manual sorting if the orderBy fieldName is not indexed
  #sortDirection = "asc"; // for manual sorting if orderBy fieldName is not indexed

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

  where(queryObject = {}) {
    const keysOfQuery = Object.keys(queryObject);

    if (keysOfQuery.length === 0) return this;

    const areKeysIndexed = Object.keys(queryObject).every(
      (key) => this.primaryKey === key || this.secondaryKeys.includes(key)
    );

    if (areKeysIndexed) {
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

    if (this.#sortField) {
      results.sort((a, b) => {
        if (this.#sortDirection === "asc") {
          return a[this.#sortField] > b[this.#sortField] ? 1 : -1;
        } else {
          return a[this.#sortField] < b[this.#sortField] ? 1 : -1;
        }
      });

      this.#sortField = null;
      this.#sortDirection = "asc";
    }

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
    const isFieldIndexed =
      this.primaryKey === fieldName || this.secondaryKeys.includes(fieldName);

    if (isFieldIndexed) {
      this.#collection =
        direction === "asc"
          ? this.#selectedTable.orderBy(fieldName)
          : this.#selectedTable.orderBy(fieldName).reverse();
    } else {
      // For Manual sorting
      this.#sortField = fieldName;
      this.#sortDirection = direction;
    }

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
