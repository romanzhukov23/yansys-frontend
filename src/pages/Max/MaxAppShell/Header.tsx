import {isAuthenticated} from "../../../auth/auth";

export function Header() {
	return (<div className='z-20 flex items-center h-[10vh] w-[100vw] bg-white shadow-xl '>
		<div className="flex items-center ml-10">
			<a className='text-2xl text-center w-[15vw]' href="/max">
				<img className='w-[9vw] h-[3.5vw]' src='/images/img.png' alt="logo"/>
			</a>
		</div>
		<div className='ml-auto flex text-[#842e5f]'>
			<a className='text-lg text-center w-[15vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href='/max/theory'>
				<span>Теория</span>
			</a>
			<a className='text-lg text-center w-[15vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href='/max/test'>
				<span>Тест</span>
			</a>
			<a onClick={evt => localStorage.clear()} className='text-lg text-center w-[12vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' href="/max/login">
				<span>{!isAuthenticated() ? 'Вход' : 'Выход'}</span>
			</a>
		</div>

	</div>)
}