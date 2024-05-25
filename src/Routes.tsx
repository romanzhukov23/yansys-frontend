import {BrowserRouter as Router, Navigate, Route, Routes,} from 'react-router-dom'
import {ProtectedRoute} from "./auth/ProtectedRoute";
import {Home} from "./pages/AnalyticTradingPlatform/Home";
import {AppHeader} from "./pages/AnalyticTradingPlatform/AppHeader";
import {AggregatorLogin} from "./pages/AnalyticTradingPlatform/AggregatorLogin";
import {Profile} from "./pages/AnalyticTradingPlatform/Profile";
import {Stock} from "./pages/AnalyticTradingPlatform/Stock";

const AppRoutes = () => (
	<Router>
		<Routes>
			<Route path="/login" element={<AggregatorLogin />}/>
			<Route path='/' element={<AppHeader />}>
				<Route path='/home' element={<Home />}/>
				<Route path='/stocks/:ticker' element={<Stock />}/>
				<Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
			</Route>
			<Route path="*" element={<Navigate to={"/home"} />}/>
		</Routes>
	</Router>
)

export default AppRoutes