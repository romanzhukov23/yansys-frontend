import {BrowserRouter as Router, Route, Routes,} from 'react-router-dom'
import {CheckYourself} from "./pages/Yansys/CheckYourself";
import {Login} from "./pages/Yansys/Login";
import {AppShell} from "./pages/Yansys/AppShell/AppShell";
import {TheoryStudy} from "./pages/Yansys/TheoryStudy";
import {ProtectedRoute} from "./auth/ProtectedRoute";
import {Main} from "./pages/Practice/Main";
import {AppHeader} from "./pages/Practice/AppHeader";
import {Forum} from "./pages/Practice/Forum";
import {ForumLogin} from "./pages/Practice/ForumLogin";
import {Theory} from "./pages/Max/Theory/Theory";
import {Test} from "./pages/Max/Test/Test";
import {Login as MaxLogin} from "./pages/Max/MaxLogin";
import {AppShell as MaxAppShell} from "./pages/Max/MaxAppShell/AppShell";
import {MaxProtectedRoute} from "./auth/MaxProtectedRoute";

const AppRoutes = () => (
	<Router>
		<Routes>
			<Route path="/login" element={<Login />}/>
			<Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
				<Route path='checkyourself' element={<ProtectedRoute><CheckYourself /></ProtectedRoute>} />
				<Route path='theorystudy' element={<ProtectedRoute><TheoryStudy /></ProtectedRoute>} />
			</Route>
			<Route path='/coursework' element={<Main />}/>
			<Route path="/practice/login" element={<ForumLogin />}/>
			<Route path='/practice' element={<ProtectedRoute><AppHeader /></ProtectedRoute>}>
				<Route path='/practice/forum' element={<Forum />}/>
				<Route path='/practice/agregator' element={<Main />}/>
			</Route>
			<Route path="/max/login" element={<MaxLogin />}/>
			<Route path='/max' element={<MaxProtectedRoute><MaxAppShell /></MaxProtectedRoute>}>
				<Route path='/max/theory' element={<MaxProtectedRoute><Theory /></MaxProtectedRoute>}/>
				<Route path='/max/test' element={<MaxProtectedRoute><Test /></MaxProtectedRoute>}/>
			</Route>
		</Routes>
	</Router>
)

export default AppRoutes