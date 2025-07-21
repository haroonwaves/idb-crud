/* eslint-disable sonarjs/deprecation */
import { Chrome, Github } from 'lucide-react';

export function Panel1Footer() {
	return (
		<div className="sticky bottom-0 flex items-center justify-between bg-white py-3">
			<span className="text-muted-foreground/70 text-sm">v-{process.env.APP_VERSION}</span>
			<div className="flex items-center gap-2">
				<Chrome
					className="hover:stroke-primary text-muted-foreground/70 size-5 cursor-pointer transition-colors"
					strokeWidth={1}
					onClick={() =>
						window.open(
							'https://chromewebstore.google.com/detail/idb-crud-database-manager/olbigpjodejcmmdkafnhaphdblimjogg',
							'_blank',
							'noopener'
						)
					}
				/>
				<Github
					className="hover:stroke-primary text-muted-foreground/70 size-5 cursor-pointer transition-colors"
					onClick={() =>
						window.open('https://github.com/haroonwaves/idb-crud', '_blank', 'noopener')
					}
					strokeWidth={1}
				/>
			</div>
		</div>
	);
}
