import {isAuthenticated} from "../../../auth/auth";
import {f} from "../../texts";

export function Header() {
	return (<div className='z-20 flex items-center h-[10vh] w-[100vw] bg-white shadow-xl '>
		<div><img className='w-[8vw] h-[4.5vw]' src="/images/logo192.png" alt="logo"/></div>
		<a className='text-3xl text-center w-[15vw] -ml-[6.5vw]' href="/">
			<span>YanSys</span>
		</a>
		<div className='ml-auto flex text-[#06b6d4]'>
			<a className='text-lg text-center w-[15vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href='/theorystudy' onClick={async evt => f()}>
				<span>Изучение теории</span>
			</a>
			<a className='text-lg text-center w-[15vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href='/checkyourself'>
				<span>Проверь себя</span>
			</a>
			<a onClick={evt => localStorage.clear()} className='text-lg text-center w-[12vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href="/login">
				<span>{!isAuthenticated() ? 'Вход' : 'Выход'}</span>
			</a>
		</div>

	</div>)
}