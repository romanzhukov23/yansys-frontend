import {Link, Outlet, useNavigate} from "react-router-dom";
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
			command: () => navigate('/features'),
		}
	]

	const handleLoginClick = (): void => {
		localStorage.setItem("username", username)
		localStorage.setItem("password", password)
		setIsAuth(true);

		const graphqlQuery = {
			"query": `mutation {login (username: "${username}", password: "${password}")}`
		}

		axios.post(GRAPHQL_URL, graphqlQuery).then(() => {
			localStorage.setItem("username", username)
		})
	};

	const accept = () => {
		localStorage.clear(); setIsAuth(false)
	}

	const confirm = (position: any) => {
		confirmDialog({
			message: 'Do you want to sign out?',
			position,
			accept,
		});
	};

	const end = (isAuth ?
			<div className='flex align-items-center'>
				<Avatar onClick={() => navigate('/profile')} icon='pi pi-user' style={{ backgroundColor: '#ffffff'}}/>
				<Button onClick={() => confirm('top-right')} icon='pi pi-sign-out'/>
				<ConfirmDialog />
			</div>
		:
			<>
				<Button onClick={() => setVisible(true)} icon='pi pi-sign-in'/>
				<Dialog
					visible={visible}
					modal
					onHide={() => setVisible(false)}
					content={({ hide }) => (
						<div className="flex flex-column px-8 py-5 gap-4 border-round-lg bg-white">
							<div className='flex flex-column gap-5'>
								<div className="flex flex-wrap justify-content-center align-items-center gap-2">
									<label className="w-6rem">Username</label>
									<InputText id="username" type="text" className="w-12rem border-1 border-primary-500" value={username} onChange={(evt): void => setUsername(evt.target.value)}/>
								</div>
								<div className="flex flex-wrap justify-content-center align-items-center gap-2">
									<label className="w-6rem">Password</label>
									<InputText id="password" type="password" className="w-12rem border-1 border-primary-500" value={password} onChange={(evt): void => setPassword(evt.target.value)}/>
								</div>
							</div>
							<div className="flex align-items-center gap-2">
								<Button label="Sign-In"
										onClick={(e) => {
											handleLoginClick()
											hide(e)
										}}
										text
										className="p-3 w-full text-primary-500 border-1 border-primary-500" />
								<Button label="Cancel" onClick={(e) => hide(e)} text
										className="p-3 w-full text-primary-500 border-1 border-primary-500" />
							</div>
						</div>
					)}
				></Dialog>
			</>
	)

	return (
		<div className="overflow-x-hidden relative h-[100vh] w-[100vw]">
			<div className="flex flex-col">
				<div className='z-20 shadow-xl '>
					<Menubar model={items} end={end}/>
				</div>
				<div className="bg-white grow">
					<Outlet/>
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