import { useCallback, useEffect, useState } from 'preact/hooks';
import dexieDatabase from './dexie/dexie.js';
import Drawer from './components/drawer.jsx';
import ToastContainer from './components/Common/toast-container.jsx';
import chromeStorage from './PersistentStorage/ChromeStorage/store.js';
import appState from './AppState/appSate.js';

export const App = () => {
	const [openDrawer, setOpenDrawer] = useState(false);
	const [connected, setConnected] = useState(false);

	const connectToDatabase = useCallback(async () => {
		setConnected(false);
		await dexieDatabase.connect();
		setConnected(true);
	}, []);

	const refreshDatabase = useCallback(() => {
		connectToDatabase();
		appState.selectedDatabase.value = '';
		appState.selectedTable.value = '';
	}, [connectToDatabase]);

	const closeDrawer = useCallback(() => {
		appState.selectedTable.value = '';
		setOpenDrawer(false);
	}, []);

	chrome.runtime.onMessage.addListener((request) => {
		if (request.action === 'icon_clicked') {
			if (openDrawer) {
				closeDrawer();
			} else {
				setOpenDrawer(true);
			}
		}
	});

	useEffect(() => {
		chromeStorage.registerUser();
		connectToDatabase();
	}, [connectToDatabase]);

	return (
		<>
			<div id="idb-crud-app">
				<ToastContainer />
				<Drawer
					connected={connected}
					isOpen={openDrawer}
					refreshDatabase={refreshDatabase}
					closeDrawer={closeDrawer}
				/>
			</div>
		</>
	);
};
