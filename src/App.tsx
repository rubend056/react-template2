import ThemeProvider from "@catoms/Theme";
import { HashRouter as Router } from "react-router-dom";
import TestPages from "./pages_test/TestPages";

function Providers(children) {
	return (
		<ThemeProvider>
			<Router>{children}</Router>
		</ThemeProvider>
	);
}
function Content() {
	return <TestPages />;
}

function App() {
	return Providers(Content());
}

export default App;
