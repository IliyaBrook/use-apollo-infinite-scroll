import { ApolloProvider } from '@apollo/client'
import apolloClient from './apolloClient'
import App from './App'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<>
		<ApolloProvider client={apolloClient}>
			<App/>
		</ApolloProvider>
	</>
)