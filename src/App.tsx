import { Drawer } from '@/src/components/ui/Drawer';
import { useState } from 'preact/hooks';

export function App() {
	const [openDrawer, setOpenDrawer] = useState(false);

	chrome.runtime.onMessage.addListener((request) => {
		if (request.action === 'icon_clicked') {
			if (openDrawer) setOpenDrawer(false);
			else setOpenDrawer(true);
		}
	});

	return (
		<div id="idb-crud-app">
			<Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
				<div className="h-full w-full">Hello</div>
			</Drawer>
		</div>
	);
}
