import React, { createRef, useEffect, useState } from 'preact/compat';
import { ChevronsRight } from 'lucide-react';

type DocStyles = {
	position: string;
	overflow: string;
	height: string;
	width: string;
	fontSize: string;
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

	const position = document.documentElement.style.position;
	const overflow = document.documentElement.style.overflow;
	const height = document.documentElement.style.height;
	const width = document.documentElement.style.width;
	const fontSize = document.documentElement.style.fontSize;

	document.documentElement.style.position = 'fixed';
	document.documentElement.style.overflow = 'hidden';
	document.documentElement.style.height = '100vh';
	document.documentElement.style.width = '100vw';
	document.documentElement.style.fontSize = 'unset';

	return {
		position,
		overflow,
		height,
		width,
		fontSize,
	};
}

function removeOverlay(docStyles: DocStyles) {
	const overlay = document.getElementById('idb-crud-overlay');
	if (overlay?.parentNode) overlay.parentNode.removeChild(overlay); // eslint-disable-line unicorn/prefer-dom-node-remove

	document.documentElement.style.position = docStyles.position;
	document.documentElement.style.overflow = docStyles.overflow;
	document.documentElement.style.height = docStyles.height;
	document.documentElement.style.width = docStyles.width;
	document.documentElement.style.fontSize = docStyles.fontSize;
}

export function Drawer({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [openDrawer, setOpenDrawer] = useState(false);
	const idbCrudDrawerRef = createRef();
	const [isContentVisible, setIsContentVisible] = useState(false);
	const [docStyles, setDocStyles] = useState<DocStyles | null>(null);

	useEffect(() => {
		function handleClick(request: Record<string, any>) {
			if (request.type === 'MOUNT_UI') {
				if (openDrawer) setOpenDrawer(false);
				else setOpenDrawer(true);
			}
		}
		chrome.runtime.onMessage.addListener(handleClick);
		return () => chrome.runtime.onMessage.removeListener(handleClick);
	});

	useEffect(() => {
		if (openDrawer) {
			idbCrudDrawerRef.current.focus();
			setTimeout(() => {
				const docStyles = createOverlay();
				setDocStyles(docStyles);
				setIsContentVisible(true);
			}, 100);
		} else {
			idbCrudDrawerRef.current.blur();
			setIsContentVisible(false);
			setTimeout(() => {
				if (docStyles) removeOverlay(docStyles);
				setDocStyles(null);
			}, 200);
		}
	}, [openDrawer]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			ref={idbCrudDrawerRef}
			tabIndex={-1} // focusable
			className={`fixed top-0 right-0 h-full outline-none! ${
				openDrawer ? 'w-[98%]' : 'w-0'
			} transform bg-white transition-all duration-500 ease-in-out`}
		>
			<button
				onClick={() => setOpenDrawer(false)}
				className={`bg-accent absolute bottom-[50%] -left-5 flex h-24 w-5 cursor-pointer items-center justify-center rounded-tl-md rounded-bl-md ${
					openDrawer ? 'visible' : 'invisible'
				}`}
			>
				<ChevronsRight size={20} />
			</button>
			<div
				className={`h-full w-full overflow-auto ${isContentVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-600`}
			>
				{children}
			</div>
		</div>
	);
}
