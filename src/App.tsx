import AppRoutes from "./Routes"
import {createClient, Provider} from 'urql'
import { PrimeReactProvider } from 'primereact/api';


const client = createClient({
	url: 'http://localhost:3334/graphql',
})

function App() {
	return (
		<PrimeReactProvider>
			<Provider value={client}>
				<AppRoutes/>
			</Provider>
		</PrimeReactProvider>
	)
}

export default App
