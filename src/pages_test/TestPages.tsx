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
import OfflineForm from "./OfflineForm";

const testPages = [
	{comp:TestPage0, name: 'Test 0'},
	{comp:EDEForm, name: 'EDE Form'},
	{comp:OfflineForm, name: 'Offline Form'},
].map((v, i) => {
	return { route: `/${v.name.replace(/ /g, '_')}`, ...v };
});

const TestPages = (props) => {
	
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
						<Apply depth_max={-1} to={Button} className='width-full' style={{borderRadius:0}}>
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
				
				<Switch>
					{testRoutes}
				</Switch>
				
			</Drawer>
		</>
	);
};
export default TestPages;
