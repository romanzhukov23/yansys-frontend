import {BrowserRouter as Router, Route, Routes,} from 'react-router-dom'
import {CheckYourself} from "./pages/Yansys/CheckYourself";
import {Login} from "./pages/Yansys/Login";
import {AppShell} from "./pages/Yansys/AppShell/AppShell";
import {TheoryStudy} from "./pages/Yansys/TheoryStudy";
import {ProtectedRoute} from "./auth/ProtectedRoute";
import {Main} from "./pages/AnalyticTradingPlatform/Main";
import {AppHeader} from "./pages/AnalyticTradingPlatform/AppHeader";
import {Forum} from "./pages/AnalyticTradingPlatform/Forum";
import {ForumLogin} from "./pages/AnalyticTradingPlatform/ForumLogin";

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
		</Routes>
	</Router>
)

export default AppRoutes