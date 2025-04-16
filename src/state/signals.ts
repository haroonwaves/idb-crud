import { signal } from '@preact/signals';

const selectedDatabase = signal('');
const selectedTable = signal('');

export const signals = {
	selectedDatabase,
	selectedTable,
};
