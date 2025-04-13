import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/src/components/ui/resizable';

export function Panels() {
	return (
		<ResizablePanelGroup direction="horizontal" className="rounded-lg border">
			<ResizablePanel defaultSize={10} minSize={10} maxSize={15}>
				<div className="flex h-full items-center justify-center p-6">
					<span className="font-semibold">One</span>
				</div>
			</ResizablePanel>
			<ResizableHandle className="bg-gray-200" />
			<ResizablePanel defaultSize={90}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={75} minSize={50} maxSize={90}>
						<div className="flex h-full items-center justify-center p-6">
							<span className="font-semibold">Two</span>
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
