import Button from "@common/atoms/Button";
import Drawer from "@common/atoms/Drawer";
import Apply from "@common/atoms/HOC/Apply";
import Toolbar from "@common/organisms/Toolbar";
import Portal from "../components/pages/Portal";
import { BsFillCaretLeftFill, BsJustify } from "react-icons/bs";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import DrawerTogglePreset from "../common/molecules/DrawerTogglePreset";
import ThemeTogglePreset from "../common/molecules/ThemeTogglePreset";
import TestPage0 from "../pages_test/TestPage0";
import EDEForm from "./EDEForm";
import OfflineForm from "./OfflineForm";
import APITest from "./APITest";

const testPages = [
	{ comp: TestPage0, name: "Test 0" },
	{ comp: EDEForm, name: "EDE Form" },
	{ comp: OfflineForm, name: "Offline Form" },
	{ comp: Portal, name: "Portal" },
	{ comp: APITest, name: "API Test" },
].map((v, i) => {
	return { route: `/${v.name.replace(/ /g, "_").toLowerCase()}`, ...v };
});

const TestPages = (props) => {
	const testLinks = testPages.map((v) => (
		<Link to={v.route} key={v.route}>
			<Button>{v.name}</Button>
		</Link>
	));
	const testRoutes = testPages.map((v) => {
		return <Route key={v.route} path={v.route} component={v.comp} />;
	});
	// const rmatch = useRouteMatch();
	const location = useLocation();

	return (
		<>
			<Drawer
				fixed
				drawer={
					<>
						<Apply depth_max={-1} to={Button} className='width-full' style={{ borderRadius: 0 }}>
							{DrawerTogglePreset({ icon: BsFillCaretLeftFill })}
							<ThemeTogglePreset />
							{testLinks}
						</Apply>
					</>
				}
			>
				{/* <Toolbar
					left={
						<>
							<DrawerTogglePreset icon={BsJustify} />
							<Apply className='hide show-tablet'> {testLinks} </Apply>
						</>
					}
					middle={location.pathname}
					right={<ThemeTogglePreset />}
				/> */}

				<Switch>{testRoutes}</Switch>
				<DrawerTogglePreset icon={BsJustify} style={{ position: "fixed", left: 10, bottom: 10 }} />
			</Drawer>
		</>
	);
};
export default TestPages;
