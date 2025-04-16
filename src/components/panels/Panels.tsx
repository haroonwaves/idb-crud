import { Panel1 } from '@/src/components/panels/panel1/Panel1';
import { Panel2 } from '@/src/components/panels/panel2/Panel2';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/src/components/ui/Resizable';

export function Panels() {
	return (
		<ResizablePanelGroup direction="horizontal" className="rounded-lg border">
			<ResizablePanel defaultSize={12} minSize={10} maxSize={15}>
				<div className="h-full overflow-y-auto p-2">
					<Panel1 />
				</div>
			</ResizablePanel>
			<ResizableHandle className="bg-gray-200" />
			<ResizablePanel defaultSize={90}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={75} minSize={50} maxSize={90}>
						<div className="h-full overflow-y-auto p-2">
							<Panel2 />
						</div>
					</ResizablePanel>
					<ResizableHandle className="bg-gray-200" />
					<ResizablePanel defaultSize={25}>
						<div className="flex h-full items-center justify-center p-6">
							<span className="font-semibold">Three</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
