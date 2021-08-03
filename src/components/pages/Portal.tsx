import Button from "@common/atoms/Button";
import Collapsible, { CollapsibleToggleIcon } from "@common/atoms/Collapsible";
import Drawer, { DrawerContentData } from "@common/atoms/Drawer";
import Apply from "@common/atoms/HOC/Apply";
import Icon from "@common/atoms/Icon";
import Table, { columnsQuick } from "@common/atoms/Table";
import { useTheme } from "@common/atoms/Theme";
import { cnf } from "@common/utils";
import React, { ReactNode, useState } from "react";
import { AiOutlineBell, AiOutlinePieChart, AiOutlineUser } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { Link, Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Bar, BarChart, ComposedChart, Legend, Line, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import OfflineForm from "../../pages_test/OfflineForm";
import s from "./Portal.module.scss";
// import { randomInt } from "crypto";
// import styles from "@common/styles/globals_export.scss";

function randomInt(max, min = 0) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
const names = ["Molina", "Ambetter", "Oscar", "Carrier0", "Carrier1"];
const testData = [5, 6, 5, 3].map((v, i) => ({ v, name: names[i] }));
let policiesData = [
	{ name: "Ambetter", members: randomInt(1000), policies: randomInt(1000) },
	{ name: "Oscar", members: randomInt(1000), policies: randomInt(1000) },
	{ name: "BEBS", members: randomInt(1000), policies: randomInt(1000) },
	{ name: "Bright", members: randomInt(1000), policies: randomInt(1000) },
	{ name: "Molina", members: randomInt(1000), policies: randomInt(1000) },
];

// policiesData = policiesData.map(p => {p['percent'] = p.policies / totals.policies;return p})
const totals = policiesData.reduce(
	(t, p) => {
		t.members += p.members;
		t.policies += p.policies;
		return t;
	},
	{ members: 0, policies: 0 }
);
policiesData = policiesData.map((p) => {
	p["percent"] = Math.floor((p.policies / totals.policies) * 1000) / 10;
	return p;
});
const policiesDataTotals = JSON.parse(JSON.stringify(policiesData));
policiesDataTotals.push({ name: "Totals", members: totals.members, policies: totals.policies });

const policiesTime = [] as any[];
for (let i = 0; i < 10; i++) {
	if (i !== 9) policiesTime.push({ policies: randomInt(10000) });
	else policiesTime.push({ policies: totals.policies });
}
console.log(policiesTime);

const Dashboard = (props) => {
	return (
		<div style={{ display: "flex", flexFlow: "row wrap", gap: "1em" }} className='padding-4'>
			{/* <ResponsiveContainer width="100%" height="400px"> */}
			<div className='card padding-0' style={{ position: "relative" }}>
				<PieChart width={400} height={400}>
					<Pie
						data={policiesData}
						dataKey='policies'
						innerRadius='30%'
						outerRadius='50%'
						nameKey='name'
						fill='#7B54A3'
					/>
					<Pie data={policiesData} dataKey='members' innerRadius='60%' outerRadius='75%' fill='#DF5395' label />
					<Tooltip />
				</PieChart>
				<div
					style={{
						position: "absolute",
						textAlign: "center",
						top: "50%",
						width: "30%",
						left: "50%",
						transform: "translate(-50%,-50%)",
					}}
				>
					My Sales
				</div>
			</div>
			<BarChart
				className='card padding-0'
				width={600}
				margin={{ top: 20, left: 20, bottom: 20 }}
				height={400}
				data={policiesData}
			>
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey='members' fill='#DF5395' />
				<Bar dataKey='policies' fill='#7B54A3' />
			</BarChart>
			<div className='card padding-0'>
				<ComposedChart
					width={600}
					height={400}
					data={policiesTime}
					margin={{
						top: 20,
						right: 20,
						bottom: 20,
						left: 20,
					}}
				>
					{/* <CartesianGrid stroke="#f5f5f5" /> */}
					{/* <XAxis dataKey='name' scale='band' /> */}
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey='policies' barSize={20} fill='#7B54A3' />
					<Line type='monotone' dataKey='policies' stroke='#DF5395' />
				</ComposedChart>
			</div>
			<div className='card'>
				<Table
					options={{
						columns: columnsQuick("name,Carrier;members,Members;policies,Policies;percent, %"),
						data: policiesDataTotals,
					}}
				/>
			</div>

			{/* </ResponsiveContainer> */}
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
	const linkButton = (children) => <Button>{children}</Button>;
	const pathArr = [
		"dashboard",
		"info",
		"stats",
		"commisions",
		"calendar",
		"analyst",
		"messages",
		"email",
		"today",
		"offline_form",
	];
	const { pathNames, links, linkNames } = pathArr.reduce(
		(a, v) => {
			const linkName = `${url}/${v}`;
			const pathName = `${path}/${v}`;
			a.links[v] = (children) => <Link to={linkName}>{linkButton(children)}</Link>;
			a.pathNames[v] = pathName;
			a.linkNames[v] = linkName;

			return a;
		},
		{ links: {}, pathNames: {}, linkNames: {} } as {
			links: { [key: string]: (c) => any };
			pathNames: any;
			linkNames: any;
		}
	);
	// Defining drawer content
	const dcontent: DrawerContentData = {
		dashboard: {
			header: links.dashboard(
				<>
					<Icon icon={BiNews} />
					Dashboard
					{/* <div style={{flexGrow:1}}/>
					<CollapsibleToggleIcon/> */}
				</>
			),
		},
		profile: {
			header: linkButton(
				<>
					<Icon icon={AiOutlineUser} />
					My Profile
					<div style={{ flexGrow: 1 }} />
					<CollapsibleToggleIcon />
				</>
			),
			content: (
				<>
					{links.info("My Info")}
					{links.stats("My Stats")}
					{links.commisions("My Commisions")}
					{links.calendar("My Calendar")}
					{links.offline_form("Offline Form")}
				</>
			),
		},
		analyst: {
			header: links.analyst(
				<>
					<Icon icon={AiOutlinePieChart} />
					Analyst
					{/* <div style={{flexGrow:1}}/>
					<CollapsibleToggleIcon/> */}
				</>
			),
		},
		notifications: {
			header: linkButton(
				<>
					<Icon icon={AiOutlineBell} />
					Notifications
					<div style={{ flexGrow: 1 }} />
					<CollapsibleToggleIcon />
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

	// const drawer = useDrawer();
	// if (drawer.setContent) {
	// 	drawer.setContent(dcontent);
	// 	console.log("Set drawer");
	// }
	const [open, setOpen] = useState(true);

	const sideLinks = (
		<>
			<Apply depth_max={-1} className='margin-right-2' to={Icon}>
				<Apply
					depth_max={-1}
					className='full-width border-radius-0'
					style={{ textAlign: "left", display: "flex", alignItems: "center" }}
					to={Button}
				>
					{Object.entries(dcontent).map(
						([k, v], i) =>
							v && (
								<Collapsible key={i}>
									<div className={cnf(s, "margin-top-3")}>{v.header}</div>
									<div>{v.content}</div>
								</Collapsible>
							)
					)}
				</Apply>
			</Apply>
		</>
	);
	const routes = (
		<Switch>
			<Route exact path={`${path}/`}>
				<Redirect to={linkNames.dashboard} />
			</Route>
			<Route path={pathNames.dashboard} component={Dashboard} />
			<Route path={pathNames.offline_form} component={OfflineForm} />
			<Route path={`${path}/*`}>Not Implemented</Route>
		</Switch>
	);

	return (
		<Drawer
			background={false}
			floating
			fixed
			// sticky
			style={{ minHeight: "100%" }}
			open={open}
			setOpen={setOpen}
			drawer={
				<>
					<div>
						<Icon size={70} style={{ width: "100%" }} className='margin-bottom-1' icon={FaUserCircle}></Icon>
						Mike Wazosky
					</div>
					{sideLinks}
				</>
			}
			contentProps={{ style: { marginLeft: "250px" } }}
			drawerProps={{
				// className:cnf(s, 'drawer'),
				style: { background: "linear-gradient(75deg, #7B54A3, #DF5395)" },
			}}
		>
			{routes}
		</Drawer>
		// SOMETHING ELSE
		// <div >
		// </div>
	);
};

export default Portal;
