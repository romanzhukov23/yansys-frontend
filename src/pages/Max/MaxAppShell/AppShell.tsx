import {Outlet} from 'react-router-dom'

import {Header} from './Header'

export function AppShell(): JSX.Element {

	return <div className="overflow-x-hidden relative h-[100vh] w-[100vw]">
		<div className="flex flex-col">
			<Header/>
			<div className="bg-white grow">
				<Outlet/>
			</div>
		</div>
	</div>
}
