import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {GRAPHQL_URL} from "../../URL";
import {Submit, TextField} from "../../../shared/ui";

export function Login() {
	const navigate = useNavigate();

	const [nickname, setNickname] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginClick = (): void => {
		localStorage.setItem("nickname", nickname)
		localStorage.setItem("password", password)


		const graphqlQuery = {
			"query": `mutation {maxLogin (nickname: "${nickname}", password: "${password}")}`
		}


		axios.post(GRAPHQL_URL, graphqlQuery).then(() => {
			localStorage.setItem("nickname", nickname)
		})

		navigate(`/max`);
	};


	return (
		<div className='flex flex-col justify-center items-center'>
			<div className="flex center items-center mt-[14vh] mb-[7vh]">
				<img className='w-[32vw] h-[13vw]' src='/images/img.png' alt="logo"/>
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
					onChange={(evt): void => setPassword(evt.target.value)} value={password} type="password"/>
			</div>
			<Submit color='bg-[#842e5f]' onClick={handleLoginClick} label='ВОЙТИ'/>
		</div>)
}