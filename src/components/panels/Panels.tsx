import { Panel1 } from '@/components/panels/panel1/Panel1';
import { Panel2 } from '@/components/panels/panel2/Panel2';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { Panel1Footer } from '@/components/panels/panel1/Footer';

export function Panels() {
	return (
		<ResizablePanelGroup direction="horizontal" className="h-full w-full bg-white text-gray-900">
			{/* Left Panel / Sidebar */}
			<ResizablePanel defaultSize={18} minSize={14} maxSize={26}>
				<div className="flex h-full flex-col justify-between bg-white">
					<div className="min-h-0 flex-1 overflow-hidden">
						<Panel1 />
					</div>
					<Panel1Footer />
				</div>
			</ResizablePanel>

			<ResizableHandle className="relative w-[1px] cursor-col-resize bg-gray-200/90 transition-colors hover:bg-blue-500 after:absolute after:inset-y-0 after:-left-1.5 after:-right-1.5 after:z-10" />

			{/* Main Content Area: Unified topbar spanning across, with separate Table box & Inspector box */}
			<ResizablePanel defaultSize={82} minSize={74}>
				<Panel2 />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
