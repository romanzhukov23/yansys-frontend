import {Navigate, useLocation} from "react-router-dom";
import {isAuthenticated} from "./auth";

type Props = {
	children: JSX.Element;
};

export function ProtectedRoute({children}: Props): JSX.Element {
	const location = useLocation()
	return isAuthenticated() ? children : <Navigate to="/home" state={{from: location}} replace/>
}