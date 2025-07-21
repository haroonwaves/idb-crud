import { Panels } from '@/components/panels/Panels';
import { Drawer } from '@/components/ui/Drawer';
import '@/state/subscribers';

export function App() {
	return (
		<div id="idb-crud-app">
			<Drawer>
				<Panels />
			</Drawer>
		</div>
	);
}
