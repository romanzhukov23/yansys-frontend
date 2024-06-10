import {Outlet, useNavigate} from "react-router-dom";
import {isAuthenticated} from "../../../auth/auth";
import {Menubar} from "primereact/menubar";
import {MenuItem} from "primereact/menuitem";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {useState} from "react";
import {InputText} from "primereact/inputtext";
import axios from "axios";
import {GRAPHQL_URL} from "../../../shared/URL";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Avatar} from "primereact/avatar";

export function AppHeader(): JSX.Element {
	const navigate = useNavigate();
	const [visible, setVisible] = useState<boolean>(false);
	const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());
	const [isInvalid, setIsInvalid] = useState<boolean>(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const items: MenuItem[] = [
		{
			label: 'Главная',
			icon: 'pi pi-home',
			command: () => navigate('/home'),
		},
		{
			label: 'Избранные',
			icon: 'pi pi-star',
			command: () => navigate('/favorites'),
		}
	]

	const handleLoginClick = async () => {
		const graphqlQuery = {
			"query": `mutation {login (username: "${username}", password: "${password}")}`
		}

		return axios.post(GRAPHQL_URL, graphqlQuery).then((res) => {
			if (res.data.data.login === 'ok') {
				localStorage.setItem("username", username)
				localStorage.setItem("password", password)
				setIsAuth(true);
				window.location.reload();
				return 'ok';
			} else {
				return 'invalid password';
			}
		});
	};

	const accept = () => {
		localStorage.clear(); setIsAuth(false); window.location.reload();
	}

	const confirm = (position: any) => {
		confirmDialog({
			message: 'Вы уверены, что хотите выйти?',
			acceptLabel: 'Да',
			rejectLabel: 'Нет',
			position,
			accept,
		});
	};

	const end = (isAuth ?
			<div className='flex align-items-center'>
				<Avatar onClick={() => navigate('/profile')} icon='pi pi-user' style={{ backgroundColor: '#f9fafb'}}/>
				<Button onClick={() => confirm('top-right')} icon='pi pi-sign-out' style={{ backgroundColor: '#f9fafb', color: '#4b5563', border: 0}}/>
				<ConfirmDialog />
			</div>
		:
			<>
				<Button onClick={() => setVisible(true)} icon='pi pi-sign-in' style={{ backgroundColor: '#f9fafb', color: '#4b5563', border: 0}}/>
				<Dialog
					visible={visible}
					modal
					onHide={() => setVisible(false)}
					content={({ hide }) => (
						<div className="flex flex-column px-8 py-5 gap-4 border-round-lg bg-white">
							<div className='flex flex-column gap-5'>
								<div className="flex flex-wrap justify-content-center align-items-center gap-2">
									<label className="w-6rem">Логин</label>
									<InputText id="username" type="text" className="w-12rem border-1 border-primary-500" value={username} onChange={(evt): void => setUsername(evt.target.value)}/>
								</div>
								<div className="flex flex-wrap justify-content-center gap-2 mb-3">
									<label className="w-6rem">Пароль</label>
									<div className="flex flex-column">
										<InputText id="password" type="password" invalid={isInvalid}
												   className="w-12rem border-1 border-primary-500" value={password}
												   onChange={(evt): void => setPassword(evt.target.value)}/>
										<small className='text-red-500'>{isInvalid ? 'Неправильный пароль' : ''}</small>
									</div>
								</div>
							</div>
							<div className="flex align-items-center gap-2">
								<Button label="Войти"
										onClick={async (e) => {
											const res = await handleLoginClick()
											if (res === 'ok') {
												setIsInvalid(false);
												hide(e)
											} else {
												setIsInvalid(true);
											}
										}}
										text
										className="p-3 w-full text-primary-500 border-1 border-primary-500" />
								<Button label="Отмена" onClick={(e) => hide(e)} text
										className="p-3 w-full text-primary-500 border-1 border-primary-500" />
							</div>
						</div>
					)}
				></Dialog>
			</>
	)

	return (
		<div className="overflow-hidden relative" style={{height: '100vh', width: '100vw'}}>
			<div className="flex flex-column">
				<div className='z-20 shadow-4'>
					<Menubar model={items} end={end}/>
				</div>
				<div className="bg-white grow">
					<Outlet context={isAuth}/>
				</div>
			</div>
		</div>
	)
}

// function HeaderSpan({span, to}: { span: string, to: string }): JSX.Element {
// 	return (
// 		<Link className='text-lg text-center w-[15vw] hover:text-[#02879e] hover:text-xl ease-in duration-150' to={to}>
// 			<span>{span}</span>
// 		</Link>
// 	)
// }

// <div className="overflow-x-hidden relative h-[100vh] w-[100vw]">
// 	<div className="card">
//
// 	</div>
// </div>

//
// 	<div className='ml-auto flex text-[#06b6d4]'>
// 		<HeaderSpan span="Агрегатор" to="/agregator"/>
//
// 	</div>
// </div>