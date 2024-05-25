import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {GRAPHQL_URL} from "../../../shared/URL";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";

function AggregatorLogin() {
	const navigate = useNavigate();

	const [nickname, setNickname] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginClick = (): void => {
		localStorage.setItem("nickname", nickname)
		localStorage.setItem("password", password)

		const graphqlQuery = {
			"query": `mutation {forumLogin (nickname: "${nickname}", password: "${password}")}`
		}

		axios.post(GRAPHQL_URL, graphqlQuery).then(() => {
			localStorage.setItem("nickname", nickname)
		})

		navigate(`/home`);
	};

	return (
		<div className='h-full overflow-y-hidden align-items-center align-content-center justify-content-center'>
			<div className='flex flex-column gap-5'>
				<div className="flex flex-wrap justify-content-center align-items-center gap-2">
					<label className="w-6rem">Username</label>
					<InputText id="username" type="text" className="w-12rem"/>
				</div>
				<div className="flex flex-wrap justify-content-center align-items-center gap-2">
					<label className="w-6rem">Password</label>
					<InputText id="password" type="password" className="w-12rem"/>
				</div>
				<Button label="Login" icon="pi pi-user" className="w-10rem mx-auto"></Button>
			</div>
		</div>
	)
}

export {AggregatorLogin};


// <div className="flex flex-col justify-center mb-[5vh] mt-[30vh]">
// 	<LoginTextField label="Никнейм" state={nickname} setState={setNickname}/>
// 	<LoginTextField label="Пароль" state={password} setState={setPassword}/>
// </div>
// <Submit color='bg-[#06b6d4]' onClick={handleLoginClick} label='ВОЙТИ'/>