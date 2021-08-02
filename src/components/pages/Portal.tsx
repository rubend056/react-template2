import React, { ReactNode } from "react";
import s from "./Dashboard.module.scss";
import { useTheme } from "@common/atoms/Theme";
import { cnf, ValuesOf } from "@common/utils";
import Drawer, { DrawerContentData, useDrawer } from "@common/atoms/Drawer";
import { Link, Route, useRouteMatch } from "react-router-dom";
import Icon from "@common/atoms/Icon";
import { BiNews } from "react-icons/bi";
import { AiOutlineUser, AiOutlinePieChart, AiOutlineBell } from "react-icons/ai";
import Button from "@common/atoms/Button";
import { LineChart, Pie, PieChart } from "recharts";

const testData = [2, 3, 2, 4, 3, 5, 6, 5, 3].map((v) => ({ v }));
const Dashboard = (props) => {
	return (
		<div style={{ display: "flex", flexFlow: "row wrap", gap: "1em" }}>
			<PieChart width={400} height={400} className='card'>
				<Pie data={testData} dataKey='v' />
			</PieChart>
		</div>
	);
};

export interface DashboardProps {
	children?: ReactNode | undefined;
}

const Portal = ({ className, children, ...props }: DashboardProps & React.HTMLAttributes<HTMLDivElement>) => {
	const theme = useTheme().name;
	className = cnf(s, `comp`, theme, className);
	const { path, url } = useRouteMatch();
	// Defining links
	const pathArr = ["dashboard", "info", "stats", "commisions", "calendar", "analyst", "messages", "email", "today"];
	const { paths, links } = pathArr.reduce(
		(a, v) => {
			a.links[v] = (children) => (
				<Link to={`${url}/${v}`}>
					<Button>{children}</Button>
				</Link>
			);
			a.paths[v] = `${path}/${v}`;
			return a;
		},
		{ links: {}, paths: {} } as { links: { [key: string]: (c) => any }; paths: { [key: string]: any } }
	);
	// Defining drawer content
	const dcontent: DrawerContentData = {
		dashboard: {
			header: links.dashboard(
				<>
					<Icon icon={BiNews} />
					Dashboard
				</>
			),
		},
		profile: {
			header: links.profile(
				<>
					<Icon icon={AiOutlineUser} />
					My Profile
				</>
			),
			content: (
				<>
					{links.info("My Info")}
					{links.stats("My Stats")}
					{links.commisions("My Commisions")}
					{links.calendar("My Calendar")}
				</>
			),
		},
		analyst: {
			header: links.analyst(
				<>
					<Icon icon={AiOutlinePieChart} />
					Analyst
				</>
			),
		},
		notifications: {
			header: (
				<>
					<Icon icon={AiOutlineBell} />
					Notifications
				</>
			),
			content: (
				<>
					{links.messages("Messages")}
					{links.email("Email")}
					{links.today("Today")}
				</>
			),
		},
	};

	const drawer = useDrawer();
	if (drawer.setContent) {
		drawer.setContent(dcontent);
	}

	return (
		<div className={className}>
			<Route path={paths.dashboard} component={Dashboard} />
		</div>
	);
};

export default Portal;
