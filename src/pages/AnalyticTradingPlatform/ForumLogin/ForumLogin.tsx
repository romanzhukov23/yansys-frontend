import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Submit, TextField} from "../../../shared/ui";
import axios from "axios";
import {GRAPHQL_URL} from "../../URL";
import {Radio} from "../../../shared/ui/forms/Radio";

function ForumLogin() {
	const navigate = useNavigate();

	const [role, setRole] = useState('user');

	const [nickname, setNickname] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginClick = (): void => {
		localStorage.setItem("nickname", nickname)
		localStorage.setItem("password", password)
		localStorage.setItem("role", role)


		const graphqlQuery = {
			"query": `mutation {forumLogin (nickname: "${nickname}", password: "${password}", role: "${role}")}`
		}


		axios.post(GRAPHQL_URL, graphqlQuery).then(() => {
			localStorage.setItem("nickname", nickname)
		})

		navigate(`/practice`);
	};


	return (
		<div className='flex flex-col justify-center items-center'>
			<div className="flex center items-center mt-[11vh] mb-[7vh]">
				<img className='w-[32vw] h-[18vw]' src='/images/logo192.png' alt="logo"/>
			</div>
			<div className="flex flex-col justify-center mb-[5vh]">
				<label className="mb-1 font-[Inter] font-[500] text-[12px] text-black">
					Никнейм
				</label>
				<TextField
					className='mb-[1.5vh]'
					onChange={(evt): void => setNickname(evt.target.value)} value={nickname}/>
				<label className="mb-1 font-[Inter] font-[500] text-[12px] text-black">
					Пароль
				</label>
				<TextField
					onChange={(evt): void => setPassword(evt.target.value)} type='password' value={password}/>
			</div>
			<div className='flex flex-row space-x-[1vw] mb-[2vh]'>
				<Radio checked={role === 'user'} name='radio' onChange={(evt) => setRole(evt.target.value)} value='user' children='Пользователь'></Radio>
				<Radio checked={role === 'moderator'} name='radio' onChange={(evt) => setRole(evt.target.value)} value='moderator' children='Модератор'></Radio>
			</div>
			<Submit color='bg-[#06b6d4]' onClick={handleLoginClick} label='ВОЙТИ'/>
		</div>)
}

export {ForumLogin};