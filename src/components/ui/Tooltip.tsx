import { useRef, useState, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { cn } from '@/src/lib/utils';

interface TooltipProps {
	content: string;
	children: preact.ComponentChildren;
	sideOffset?: number;
	side?: 'top' | 'bottom' | 'left' | 'right';
}

const getShadowRoot = () => {
	return document.getElementById('idb-crud-content-root')?.shadowRoot || document.body;
};

export function Tooltip({
	content,
	children,
	sideOffset = 15,
	side = 'bottom',
}: Readonly<TooltipProps>) {
	const triggerRef = useRef<HTMLElement | null>(null);
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const delayTimeout = useRef<number | null>(null);

	// Position the tooltip relative to the trigger
	useEffect(() => {
		if (visible && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			let top = 0,
				left = 0;
			switch (side) {
				case 'bottom': {
					top = rect.bottom + window.scrollY + sideOffset;
					left = rect.left + window.scrollX + rect.width / 2;
					break;
				}
				case 'left': {
					top = rect.top + window.scrollY + rect.height / 2;
					left = rect.left + window.scrollX - sideOffset;
					break;
				}
				case 'right': {
					top = rect.top + window.scrollY + rect.height / 2;
					left = rect.right + window.scrollX + sideOffset;
					break;
				}
				default: {
					top = rect.top + window.scrollY - sideOffset;
					left = rect.left + window.scrollX + rect.width / 2;
				}
			}
			setPosition({ top, left });
		}
	}, [visible, sideOffset, side]);

	// Tooltip content element
	let transform = '';
	switch (side) {
		case 'top': {
			transform = 'translate(-50%, -100%)';
			break;
		}
		case 'bottom': {
			transform = 'translate(-50%, 0)';
			break;
		}
		case 'left': {
			transform = 'translate(-100%, -50%)';
			break;
		}
		case 'right': {
			transform = 'translate(0, -50%)';
			break;
		}
		default: {
			transform = 'translate(-50%, -100%)';
		}
	}

	const tooltipEl =
		visible && !(position.top === 0 && position.left === 0)
			? createPortal(
					<div
						className={cn(
							'bg-primary text-primary-foreground pointer-events-none fixed z-[1000000000] scale-100 rounded-md px-3 py-1.5 text-xs text-balance opacity-100 shadow-lg transition-all duration-150'
						)}
						style={{
							top: position.top,
							left: position.left,
							transform,
							zIndex: 10000000000000000,
						}}
						data-slot="tooltip-content"
					>
						{content}
					</div>,
					getShadowRoot()
				)
			: null;

	// Clone child to attach ref and event handlers
	const child = (Array.isArray(children) ? children[0] : children) as HTMLElement;
	const childProps = {
		ref: (el: HTMLElement) => {
			triggerRef.current = el;
			if (typeof (child as any).ref === 'function') (child as any).ref(el);
		},
		onMouseEnter: () => {
			if (delayTimeout.current) clearTimeout(delayTimeout.current);
			delayTimeout.current = window.setTimeout(() => setVisible(true), 800);
		},
		onFocus: () => {
			if (delayTimeout.current) clearTimeout(delayTimeout.current);
			delayTimeout.current = window.setTimeout(() => setVisible(true), 800);
		},
		onMouseLeave: () => {
			if (delayTimeout.current) clearTimeout(delayTimeout.current);
			setVisible(false);
		},
		onBlur: () => {
			if (delayTimeout.current) clearTimeout(delayTimeout.current);
			setVisible(false);
		},
		tabIndex: (child as any)?.props?.tabIndex ?? 0,
		style: { ...(child as any)?.props?.style, outline: 'none' },
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (delayTimeout.current) clearTimeout(delayTimeout.current);
		};
	}, []);

	return (
		<>
			{children && typeof child === 'object'
				? { ...child, props: { ...(child as any).props, ...childProps } }
				: children}
			{tooltipEl}
		</>
	);
}
