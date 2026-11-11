import { useRef, useState, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { cn, getShadowRoot } from '@/lib/utils';

interface TooltipProps {
	content: string;
	children: preact.ComponentChildren;
	sideOffset?: number;
	side?: 'top' | 'bottom' | 'left' | 'right';
	delayDuration?: number;
	className?: string;
}

const getTooltipContainer = () => {
	return getShadowRoot() || document.body;
};

export function Tooltip({
	content,
	children,
	sideOffset = 6,
	side = 'bottom',
	delayDuration = 450,
	className,
}: Readonly<TooltipProps>) {
	const triggerRef = useRef<HTMLSpanElement | null>(null);
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const delayTimeout = useRef<number | null>(null);

	// Position the tooltip relative to the trigger
	useEffect(() => {
		if (visible && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			let top = 0;
			let left = 0;

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

		return () => setPosition({ top: 0, left: 0 });
	}, [visible, sideOffset, side]);

	// Transform based on side
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

	const handleMouseEnter = () => {
		if (delayTimeout.current) clearTimeout(delayTimeout.current);
		delayTimeout.current = window.setTimeout(() => setVisible(true), delayDuration);
	};

	const handleMouseLeave = () => {
		if (delayTimeout.current) clearTimeout(delayTimeout.current);
		setVisible(false);
	};

	useEffect(() => {
		return () => {
			if (delayTimeout.current) clearTimeout(delayTimeout.current);
		};
	}, []);

	const tooltipEl =
		visible && !(position.top === 0 && position.left === 0)
			? createPortal(
					<div
						className={cn(
							'pointer-events-none fixed scale-100 rounded-md bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-100 shadow-md transition-opacity duration-150 select-none'
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
					getTooltipContainer()
				)
			: null;

	return (
		<span
			ref={triggerRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleMouseEnter}
			onBlur={handleMouseLeave}
			className={cn('inline-flex shrink-0 items-center justify-center', className)}
		>
			{children}
			{tooltipEl}
		</span>
	);
}
