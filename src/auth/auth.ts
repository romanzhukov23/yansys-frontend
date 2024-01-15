export const isAuthenticated = (): boolean => {
	const password = localStorage.getItem("password")
	return password != null;
}