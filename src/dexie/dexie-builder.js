export class DexieBuilder {
  // Private variables
  #dexieInstance;
  #selectedTable;
  #collection;

  #sortOptions = null; // for manual sorting if the orderBy fieldName is not indexed

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
    let results = [];

    if (this.#sortOptions === null) {
      results = await this.#collection.toArray();
    } else {
      results = await this.#manualSort();

      this.#sortOptions = null;
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
    if (this.#sortOptions === null) {
      this.#collection = this.#collection.limit(count);
    } else {
      this.#sortOptions.limit = count;
    }

    return this;
  }

  offset(index) {
    if (this.#sortOptions === null) {
      this.#collection = this.#collection.offset(index);
    } else {
      this.#sortOptions.offset = index;
    }
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
      this.#sortOptions = { fieldName, direction };
    }

    return this;
  }

  #manualSort = async () => {
    let sortedData =
      this.#sortOptions.direction === "asc"
        ? await this.#collection.sortBy(this.#sortOptions.fieldName)
        : await this.#collection.reverse().sortBy(this.#sortOptions.fieldName);

    if (this.#sortOptions.offset !== undefined) {
      sortedData = sortedData.slice(this.#sortOptions.offset);
    }

    if (this.#sortOptions.limit !== undefined) {
      sortedData = sortedData.slice(0, this.#sortOptions.limit);
    }

    return sortedData;
  };

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
