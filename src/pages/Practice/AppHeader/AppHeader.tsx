import {Outlet} from "react-router-dom";
import {f} from "../../texts";
import {isAuthenticated} from "../../../auth/auth";

export function AppHeader(): JSX.Element {

	return (
		<div className="overflow-x-hidden relative h-[100vh] w-[100vw]">
			<div className="flex flex-col">

				<div className='z-20 flex items-center h-[10vh] w-[100vw] bg-white shadow-xl '>
					<div className='ml-auto flex text-[#06b6d4]'>
						<a className='text-lg text-center w-[15vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href='/practice/forum' onClick={async evt => f()}>
							<span>Форум</span>
						</a>
						<a className='text-lg text-center w-[15vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href='/practice/agregator'>
							<span>Агрегатор</span>
						</a>
						<a onClick={evt => localStorage.clear()} className='text-lg text-center w-[12vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href="/practice/login">
							<span>{!isAuthenticated() ? 'Вход' : 'Выход'}</span>
						</a>
					</div>
				</div>

				<div className="bg-white grow">
					<Outlet/>
				</div>

			</div>
		</div>
	)
}