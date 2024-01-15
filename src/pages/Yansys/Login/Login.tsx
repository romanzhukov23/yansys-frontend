import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Submit, TextField} from "../../../shared/ui";
import axios from "axios";
import {GRAPHQL_URL} from "../../URL";
import {Radio} from "../../../shared/ui/forms/Radio";
import {f} from "../../texts";

function Login() {
	const navigate = useNavigate();

	const [role, setRole] = useState('student');

	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginClick = (): void => {
		localStorage.setItem("firstname", firstname)
		localStorage.setItem("lastname", lastname)
		localStorage.setItem("password", password)
		localStorage.setItem("role", role)


		const graphqlQuery = {
			"query": `mutation {login (firstname: "${firstname}", lastname: "${lastname}", password: "${password}", role: "${role}")}`
		}


		axios.post(GRAPHQL_URL, graphqlQuery).then(r => {
			localStorage.setItem("id", r.data.data.login)
		})

		f()

		navigate(`/`);
	};


	return (
		<div className='flex flex-col justify-center items-center'>
			<div className="flex center items-center mt-[11vh] mb-[7vh]">
				<img className='w-[32vw] h-[18vw]' src='/images/logo192.png' alt="logo"/>
			</div>
			<div className="flex flex-col justify-center mb-[5vh]">
				<label className="mb-1 font-[Inter] font-[500] text-[12px] text-black">
					Имя
				</label>
				<TextField
					className='mb-[1.5vh]'
					onChange={(evt): void => setFirstname(evt.target.value)} value={firstname}/>
				<label className="mb-1 font-[Inter] font-[500] text-[12px] text-black">
					Фамилия
				</label>
				<TextField
					className='mb-[1.5vh]'
					onChange={(evt): void => setLastname(evt.target.value)} value={lastname}/>
				<label className="mb-1 font-[Inter] font-[500] text-[12px] text-black">
					Пароль
				</label>
				<TextField
					onChange={(evt): void => setPassword(evt.target.value)} value={password}/>
			</div>
			<div className='flex flex-row space-x-[1vw] mb-[2vh]'>
				<Radio checked={role === 'student'} name='radio' onChange={(evt) => setRole(evt.target.value)} value='student' children='Студент'></Radio>
				<Radio checked={role === 'teacher'} name='radio' onChange={(evt) => setRole(evt.target.value)} value='teacher' children='Преподаватель'></Radio>
			</div>
			<Submit color='bg-[#06b6d4]' onClick={handleLoginClick} label='ВОЙТИ'/>
		</div>)
}

export {Login};