import { state } from '@/src/state/state';
import { useState } from 'preact/compat';
import { X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Error {
	message: string;
	details?: string;
}

export function ErrorFooter() {
	const errors = state.errors.value;
	const [isCollapsed, setIsCollapsed] = useState(true);

	if (!errors || errors.length === 0) return null;

	return (
		<div
			className={cn(
				'absolute bottom-4 z-50 w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out',
				isCollapsed ? 'h-10' : 'h-120'
			)}
		>
			<div className="bg-muted/50 h-full rounded-md backdrop-blur-sm">
				<div className="bg-muted/80 flex items-center justify-between rounded-md border border-gray-200 p-2">
					<div className="flex items-center gap-2.5">
						<div className="bg-destructive/10 flex h-6 w-6 items-center justify-center rounded-full">
							<AlertCircle className="text-destructive h-4 w-4" />
						</div>
						<span className="text-destructive font-medium">
							{errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<button
							onClick={() => setIsCollapsed(!isCollapsed)}
							className="text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md p-1.5 transition-colors"
						>
							{isCollapsed ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronUp className="h-4 w-4" />
							)}
						</button>
						<button
							onClick={() => (state.errors.value = [])}
							className="text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md p-1.5 transition-colors"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
				{!isCollapsed && (
					<div className="h-[calc(100%-2.75rem)] overflow-y-auto p-4">
						<div className="space-y-3">
							{errors.map((error: Error, index: number) => (
								<div
									key={index}
									className="group border-destructive/20 bg-destructive/5 relative rounded-lg border p-4 text-sm transition-colors"
								>
									<div className="flex items-start gap-3">
										<div className="bg-destructive/10 text-destructive mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
											{index + 1}
										</div>
										<div className="flex-1 space-y-1.5">
											<div className="text-destructive font-medium">{error.message}</div>
											<div className="text-muted-foreground text-xs">{error.details}</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
