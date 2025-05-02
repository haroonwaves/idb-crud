import React, { createRef, useEffect, useState } from 'preact/compat';
import { X } from 'lucide-react';

type RootPositions = {
	position: string;
	overflow: string;
	height: string;
	width: string;
};

function createOverlay() {
	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.right = '0';
	overlay.style.bottom = '0';
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
	overlay.style.zIndex = '99999999';
	overlay.id = 'idb-crud-overlay';

	document.body.append(overlay);

	const position = document.body.style.position;
	const overflow = document.body.style.overflow;
	const height = document.body.style.height;
	const width = document.body.style.width;

	document.body.style.position = 'fixed';
	document.body.style.overflow = 'hidden';
	document.body.style.height = '100vh';
	document.body.style.width = '100vw';

	document.body.classList.add('idb-crud-drawer-open');

	return {
		position,
		overflow,
		height,
		width,
	};
}

function removeOverlay(rootPositions: RootPositions) {
	const overlay = document.getElementById('idb-crud-overlay');
	if (overlay?.parentNode) overlay.parentNode.removeChild(overlay); // eslint-disable-line unicorn/prefer-dom-node-remove

	document.body.classList.remove('idb-crud-drawer-open');

	document.body.style.position = rootPositions.position;
	document.body.style.overflow = rootPositions.overflow;
	document.body.style.height = rootPositions.height;
	document.body.style.width = rootPositions.width;
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

	const [rootPositions, setRootPositions] = useState<RootPositions | null>(null);

	useEffect(() => {
		// eslint-disable-next-line sonarjs/no-selector-parameter
		if (open) {
			idbCrudDrawerRef.current.focus();
			setTimeout(() => {
				const rootPositions = createOverlay();
				setRootPositions(rootPositions);
			}, 200);
		} else {
			idbCrudDrawerRef.current.blur();
			setTimeout(() => {
				if (rootPositions) removeOverlay(rootPositions);
			}, 200);
		}
	}, [open]);

	return (
		<div
			ref={idbCrudDrawerRef}
			tabIndex={-1} // focusable
			className={`fixed top-0 right-0 h-full outline-none! ${
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
