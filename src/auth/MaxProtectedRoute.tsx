import {Navigate, useLocation} from "react-router-dom";
import {isAuthenticated} from "./auth";

type Props = {
	children: JSX.Element;
};

export function MaxProtectedRoute({children}: Props): JSX.Element {
	const location = useLocation()
	return isAuthenticated() ? children : <Navigate to="/max/login" state={{from: location}} replace/>
}