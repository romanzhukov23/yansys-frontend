import AppRoutes from "./Routes"
import {createClient, Provider} from 'urql'

const client = createClient({
	url: 'http://localhost:3334/graphql',
})

function App() {
	return (
		<Provider value={client}>
			<AppRoutes/>
		</Provider>
	)
}

export default App
