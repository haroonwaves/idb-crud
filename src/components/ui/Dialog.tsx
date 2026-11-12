import * as React from 'preact/compat';
import { createContext } from 'preact';
import { useContext, useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { Slot } from '@radix-ui/react-slot';
import { XIcon } from 'lucide-react';
import { cn, getShadowRoot } from '@/lib/utils';

interface DialogContextType {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

function useDialog() {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error('Dialog components must be used within a Dialog');
	}
	return context;
}

interface DialogProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

function Dialog({
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	children,
}: Readonly<DialogProps>) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;

	const setOpen = useCallback(
		(newOpen: boolean) => {
			if (!isControlled) {
				setUncontrolledOpen(newOpen);
			}
			onOpenChange?.(newOpen);
		},
		[isControlled, onOpenChange]
	);

	return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

type ButtonClickEvent = Parameters<NonNullable<React.ComponentProps<'button'>['onClick']>>[0];
type DialogTriggerProps = React.ComponentProps<'button'> & { asChild?: boolean };

function DialogTrigger({
	asChild,
	children,
	onClick,
	...props
}: Readonly<DialogTriggerProps>) {
	const { setOpen } = useDialog();

	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			type={asChild ? undefined : 'button'}
			onClick={(e: ButtonClickEvent) => {
				onClick?.(e);
				if (!e.defaultPrevented) {
					setOpen(true);
				}
			}}
			{...props}
		>
			{children}
		</Comp>
	);
}

type DialogCloseProps = React.ComponentProps<'button'> & { asChild?: boolean };

function DialogClose({
	asChild,
	children,
	onClick,
	...props
}: Readonly<DialogCloseProps>) {
	const { setOpen } = useDialog();

	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			type={asChild ? undefined : 'button'}
			onClick={(e: ButtonClickEvent) => {
				onClick?.(e);
				if (!e.defaultPrevented) {
					setOpen(false);
				}
			}}
			{...props}
		>
			{children}
		</Comp>
	);
}

const getDialogContainer = () => {
	const shadowRoot = getShadowRoot();
	return (
		shadowRoot?.querySelector('#idb-crud-app') ||
		shadowRoot?.getElementById('idb-crud-content-root') ||
		shadowRoot?.host ||
		document.body
	);
};

function DialogPortal({ children }: Readonly<{ children: React.ReactNode }>) {
	const { open } = useDialog();
	if (!open) return null;

	const container = getDialogContainer();
	if (!container) return null;

	return createPortal(children, container);
}

function DialogOverlay({ className, style, onClick, ...props }: Readonly<React.ComponentProps<'div'>>) {
	const { setOpen } = useDialog();

	return (
		<div
			role="button"
			tabIndex={-1}
			data-slot="dialog-overlay"
			className={cn(
				'fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-150',
				className
			)}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 9999990,
				...(style as object),
			}}
			onClick={(e) => {
				onClick?.(e);
				if (!e.defaultPrevented) {
					setOpen(false);
				}
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					setOpen(false);
				}
			}}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	style,
	...props
}: Readonly<React.ComponentProps<'div'>>) {
	const { open, setOpen } = useDialog();
	const contentRef = useRef<HTMLDivElement>(null);

	// Close on Escape key
	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				setOpen(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown, true);
		return () => window.removeEventListener('keydown', handleKeyDown, true);
	}, [open, setOpen]);

	if (!open) return null;

	return (
		<DialogPortal>
			<DialogOverlay />
			<div
				ref={contentRef}
				data-slot="dialog-content"
				role="dialog"
				aria-modal="true"
				className={cn(
					'fixed inset-0 m-auto flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl outline-none! max-w-lg overflow-y-auto',
					className
				)}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					margin: 'auto',
					width: 'calc(100% - 2rem)',
					height: 'fit-content',
					maxHeight: 'calc(100vh - 4rem)',
					zIndex: 10000000,
					...(style as object),
				}}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				{...props}
			>
				{children}
				<button
					type="button"
					onClick={() => setOpen(false)}
					className="absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none"
					aria-label="Close"
				>
					<XIcon className="size-4 text-gray-500 hover:text-gray-900" />
					<span className="sr-only">Close</span>
				</button>
			</div>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: Readonly<React.ComponentProps<'div'>>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: Readonly<React.ComponentProps<'div'>>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: Readonly<React.ComponentProps<'h2'>>) {
	return (
		<h2
			data-slot="dialog-title"
			className={cn('text-lg leading-none font-semibold text-gray-900', className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: Readonly<React.ComponentProps<'p'>>) {
	return (
		<p
			data-slot="dialog-description"
			className={cn('text-sm text-gray-500', className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
