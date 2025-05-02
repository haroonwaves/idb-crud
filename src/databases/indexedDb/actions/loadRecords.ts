import { dexieDb } from '@/src/databases/indexedDb/dexie';
import { state } from '@/src/state/state';
import { ColumnFilter, ColumnSort } from '@tanstack/react-table';
import Dexie from 'dexie';

function isFieldIndexed(table: Dexie.Table, field: string): boolean {
	const schema = table.schema;
	return (
		schema.indexes.some((index) => {
			const keyPath = index.keyPath;
			if (Array.isArray(keyPath)) return keyPath.includes(field);
			return keyPath === field;
		}) || schema.primKey.keyPath === field
	);
}

function applyMemoryFilter(
	collection: Dexie.Collection,
	filter: ColumnFilter | undefined
): Dexie.Collection {
	if (!filter || !filter.value) return collection;

	const filterValue = filter.value as string;
	if (!filterValue) return collection;

	return collection.filter((item) => {
		const fieldValue = item[filter.id];
		if (fieldValue === null || fieldValue === undefined) return false;
		return String(fieldValue).toLowerCase().includes(filterValue.toLowerCase());
	});
}

function createIndexedCollection(
	table: Dexie.Table,
	sort: ColumnSort,
	filter: ColumnFilter | undefined
): Dexie.Collection {
	let collection = sort.desc ? table.orderBy(sort.id).reverse() : table.orderBy(sort.id);
	collection = applyMemoryFilter(collection, filter);
	return collection;
}

function handleNumericFilter(table: Dexie.Table, filterField: string, filterValue: string) {
	const numericValue = Number.parseFloat(filterValue);
	return Number.isNaN(numericValue)
		? table.toCollection()
		: table.where(filterField).anyOf([numericValue, filterValue]); // This is a hack to get the correct value
}

function createOptimizedCollection(
	table: Dexie.Table,
	sort: ColumnSort | undefined,
	filter: ColumnFilter | undefined
): {
	collection: Dexie.Collection;
	needsMemorySort: boolean;
	needsMemoryFilter: boolean;
} {
	const sortField = sort?.id;
	const filterField = filter?.id;
	const filterValue = filter?.value as string;

	// Track what operations need to be done in memory
	const needsMemorySort = sortField ? !isFieldIndexed(table, sortField) : false;
	const needsMemoryFilter = filterField ? !isFieldIndexed(table, filterField) : false;

	let collection: Dexie.Collection;

	// Case 1: Both sort and filter are indexed
	if (sortField && filterField && !needsMemorySort && !needsMemoryFilter) {
		collection = createIndexedCollection(table, sort, filter);
	} else if (sortField && !needsMemorySort) {
		// Case 2: Only sort is indexed
		collection = sort.desc ? table.orderBy(sortField).reverse() : table.orderBy(sortField);
	} else if (filterField && !needsMemoryFilter && filterValue) {
		// Case 3: Only filter is indexed
		const isNumeric = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(filterValue);
		collection = isNumeric
			? handleNumericFilter(table, filterField, filterValue)
			: table.where(filterField).startsWith(filterValue);
	} else {
		// Case 4: Neither is indexed
		collection = table.toCollection();
	}

	return { collection, needsMemorySort, needsMemoryFilter };
}

export async function loadRecords(countUpdater: (totalCount: number) => void) {
	const selectedDatabase = state.database.selected.value;
	const db = dexieDb.select(selectedDatabase);

	if (!db) return [];

	const table = db.table(state.database.table.value);
	const sort = state.dataTable.query.sort.value[0];
	const filter = state.dataTable.query.filter.value[0];
	const { pageIndex, pageSize } = state.dataTable.query.pagination.value;

	const { collection, needsMemorySort, needsMemoryFilter } = createOptimizedCollection(
		table,
		sort,
		filter
	);

	let processedCollection = needsMemoryFilter
		? applyMemoryFilter(collection, filter).clone()
		: collection.clone();

	const collectionForCount = needsMemoryFilter
		? applyMemoryFilter(collection, filter).clone()
		: collection.clone(); // This is a hack to clone the collection, because the collection.clone on the processedCollection isn't working properly

	collectionForCount
		.count()
		.then(countUpdater)
		.catch((error) => {
			throw error;
		});

	if (needsMemorySort && sort) {
		let items: object[];

		if (sort.desc) processedCollection = processedCollection.reverse();
		items = await processedCollection.sortBy(sort.id);

		const start = pageIndex * pageSize;
		const end = Math.min(items.length, start + pageSize);

		return items.slice(start, end);
	}

	const rows = (await processedCollection
		.offset(pageIndex * pageSize)
		.limit(pageSize)
		.toArray()) as object[];

	return rows;
}
