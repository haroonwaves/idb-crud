export function ActionIconsContainer({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex h-9 w-fit items-center justify-center gap-4 rounded-md border px-3 py-1">
			{children}
		</div>
	);
}
