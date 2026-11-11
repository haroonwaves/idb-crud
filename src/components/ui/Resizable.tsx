import * as React from 'preact/compat';
import { GripVerticalIcon } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

function ResizablePanelGroup({
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
	return (
		<ResizablePrimitive.PanelGroup
			data-slot="resizable-panel-group"
			className={cn(
				'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
				className as string
			)}
			{...props}
		/>
	);
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
	return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

interface ResizableHandleProps extends Omit<React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle>, 'children'> {
	withHandle?: boolean;
	children?: React.ReactNode;
}

function ResizableHandle({
	withHandle,
	className,
	children,
	...props
}: Readonly<ResizableHandleProps>) {
	return (
		<ResizablePrimitive.PanelResizeHandle
			data-slot="resizable-handle"
			className={cn(
				'relative flex items-center justify-center focus-visible:outline-hidden',
				className as string
			)}
			{...props}
		>
			{children}
			{withHandle && !children && (
				<div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
					<GripVerticalIcon className="size-2.5" />
				</div>
			)}
		</ResizablePrimitive.PanelResizeHandle>
	);
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
