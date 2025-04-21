import React, { createRef, useEffect } from 'preact/compat';
import { X } from 'lucide-react';

function createOverlay() {
	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black overlay
	overlay.style.zIndex = '9999';
	overlay.id = 'idb-crud-overlay';

	document.body.append(overlay);
	document.body.classList.add('idb-crud-drawer-open');
}

function removeOverlay() {
	const overlay = document.getElementById('idb-crud-overlay');
	if (overlay?.parentNode) overlay.parentNode.removeChild(overlay); // eslint-disable-line unicorn/prefer-dom-node-remove

	document.body.classList.remove('idb-crud-drawer-open');
}

export function Drawer({
	children,
	open,
	onClose,
}: Readonly<{
	children: React.ReactNode;
	open: boolean;
	onClose: () => void;
}>) {
	const idbCrudDrawerRef = createRef();

	useEffect(() => {
		// eslint-disable-next-line sonarjs/no-selector-parameter
		if (open) {
			idbCrudDrawerRef.current.focus();
			setTimeout(() => {
				createOverlay();
			}, 200);
		} else {
			idbCrudDrawerRef.current.blur();
			setTimeout(() => {
				removeOverlay();
			}, 200);
		}
	}, [open]);

	return (
		<div
			ref={idbCrudDrawerRef}
			className={`fixed top-0 right-0 h-full ${
				open ? 'w-[95%]' : 'w-0'
			} transform bg-white shadow-lg transition-all duration-500 ease-in-out`}
		>
			<button
				onClick={onClose}
				className={`absolute top-2 -left-8 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ${
					open ? 'opacity-100' : 'opacity-0'
				}`}
			>
				<X size={20} />
			</button>
			{children}
		</div>
	);
}
