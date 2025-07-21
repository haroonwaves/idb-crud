import { Panel1 } from '@/components/panels/panel1/Panel1';
import { ErrorFooter } from '@/components/panels/ErrorFooter';
import { Panel2 } from '@/components/panels/panel2/Panel2';
import { Panel3 } from '@/components/panels/panel3/Panel3';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { Panel1Footer } from '@/components/panels/panel1/Footer';

export function Panels() {
	return (
		<ResizablePanelGroup direction="horizontal" className="h-full rounded-lg">
			{/* Left Panel */}
			<ResizablePanel defaultSize={12} minSize={10} maxSize={15}>
				<div className="flex h-full flex-col overflow-y-auto px-3">
					<Panel1 />
					<Panel1Footer />
				</div>
			</ResizablePanel>

			<ResizableHandle className="w-0.5 cursor-e-resize bg-gray-100" />

			{/* Middle Panel */}
			<ResizablePanel defaultSize={70} minSize={50}>
				<div className="relative h-full p-3">
					<Panel2 />
					<ErrorFooter />
				</div>
			</ResizablePanel>

			<ResizableHandle className="w-0.5 cursor-e-resize bg-gray-100" />

			{/* Right Panel */}
			<ResizablePanel defaultSize={18} minSize={15}>
				<div className="h-full overflow-auto bg-gray-50/40 p-3">
					<Panel3 />
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
