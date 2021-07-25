import Toolbar from "@common/organisms/Toolbar";
import { Route, Switch, Link, useRouteMatch, useLocation } from "react-router-dom";
import TestPage0 from "src/pages_test/TestPage0";
import Button from "@catoms/Button";
import Drawer from "@catoms/Drawer";
import Apply from "@catoms/HOC/Apply";
import { BsFillCaretLeftFill, BsJustify } from "react-icons/bs";
import DrawerTogglePreset from "src/common/molecules/DrawerTogglePreset";
import ThemeTogglePreset from "src/common/molecules/ThemeTogglePreset";
import EDEForm from "./EDEForm";

const TestPages = (props) => {
	const testPages = [
		TestPage0,
		EDEForm,
	].map((v, i) => {
		return { route: `/testPage${i}`, comp: v, name: v.name };
	});
	const testLinks = testPages.map((v) => (
		<Link to={v.route} key={v.route}>
			<Button>{v.name}</Button>
		</Link>
	));
	const testRoutes = testPages.map(v => {
		return (
			<Route key={v.route} path={v.route} component={v.comp}/>
		)
	})
	// const rmatch = useRouteMatch();
	const location = useLocation();
	
	return (
		<>
			<Drawer fixed
				drawer={
					<>
						<Apply depth_max={-1} to={Button} className='width-full'>
							{DrawerTogglePreset({icon:BsFillCaretLeftFill})}
							{testLinks}
						</Apply>
					</>
				}
			>
				<Toolbar
					left={
						<>
							<DrawerTogglePreset icon={BsJustify} />
							<Apply className='hide show-tablet'> {testLinks} </Apply>
						</>
					}
					middle={location.pathname}
					right={<ThemeTogglePreset/>}
				/>
				<div>
				<Switch>
					{testRoutes}
				</Switch>
				</div>
			</Drawer>
		</>
	);
};
export default TestPages;
