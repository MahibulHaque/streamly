import { Toaster } from 'sonner';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ControlLayer from './layouts/ControlLayer';
import AuthButton from './components/common/AuthButton';
import Widget from './components/common/Widget';

const client = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={client}>
			<ControlLayer>
				<AuthButton />
				<Widget />
			</ControlLayer>
			<Toaster />
		</QueryClientProvider>
	);
}

export default App;
