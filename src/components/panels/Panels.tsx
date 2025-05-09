import { Panel1 } from '@/src/components/panels/panel1/Panel1';
import { Panel2 } from '@/src/components/panels/panel2/Panel2';
import { Panel3 } from '@/src/components/panels/panel3/Panel3';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/src/components/ui/Resizable';

export function Panels() {
	return (
		<ResizablePanelGroup direction="horizontal" className="rounded-lg">
			<ResizablePanel defaultSize={12} minSize={10} maxSize={15}>
				<div className="h-full overflow-y-auto px-2 py-3">
					<Panel1 />
				</div>
			</ResizablePanel>
			<ResizableHandle className="cursor-e-resize bg-gray-200" />
			<ResizablePanel defaultSize={90}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={75} minSize={10} maxSize={90}>
						<div className="h-full overflow-y-auto p-3">
							<Panel2 />
						</div>
					</ResizablePanel>
					<ResizableHandle className="cursor-n-resize bg-gray-200" />
					<ResizablePanel defaultSize={25}>
						<div className="relative h-full overflow-y-auto bg-gray-50/40 p-3">
							<Panel3 />
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
