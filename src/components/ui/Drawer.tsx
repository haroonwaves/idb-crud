import React from 'preact/compat';

export function Drawer({
	children,
	open,
	onClose,
}: {
	children: React.ReactNode;
	open: boolean;
	onClose: () => void;
}) {
	return (
		<div
			className={`fixed top-0 right-0 h-full ${
				open ? 'w-[90%]' : 'w-0'
			} transform bg-white shadow-lg transition-all duration-500 ease-in-out`}
		>
			<button
				onClick={onClose}
				className="absolute top-2 -left-8 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</button>
			{children}
		</div>
	);
}
