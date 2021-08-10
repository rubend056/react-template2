import Button from "@common/atoms/Button";
import Collapsible, { CollapsibleToggleIcon } from "@common/atoms/Collapsible";
import Drawer, { DrawerContentData } from "@common/atoms/Drawer";
import Select from "@common/atoms/Form/Select";
import Apply from "@common/atoms/HOC/Apply";
import Icon from "@common/atoms/Icon";
import Table, { columnsQuick } from "@common/atoms/Table";
import { useTheme } from "@common/atoms/Theme";
import { cnf } from "@common/utils";
import React, { CSSProperties, ReactNode, useState } from "react";
import { AiOutlineBell, AiOutlinePieChart, AiOutlineUser } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { Link, Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { setApi_SummaryQuery, useApi_Contacts, useApi_Summary } from "../../rxjs/observables";
import OfflineForm from "../../pages_test/OfflineForm";
import s from "./Portal.module.scss";
import user_icon from "../../glasses_man_small.jpg";
import Toolbar from "@common/organisms/Toolbar";
import DrawerTogglePreset from "@common/molecules/DrawerTogglePreset";
import Dashboard from "../molecules/Dashboard";
import Policies, { PoliciesDetail } from "../molecules/Policies";
import OfflineManage from "./OfflineManage";
import MyInfo from "./MyInfo";
import MyCalendar from "./MyCalendar";

export const usePaths = (paths: string[] | string) => {
	const match = useRouteMatch();
	// Defining links
	const linkButton = (children) => <Button>{children}</Button>;
	const pathArr = Array.isArray(paths) ? paths : paths.split(";").map((v) => v.trim());
	// Creating common pathNames, links and linkNames
	const others = pathArr.reduce(
		(a, v) => {
			const linkName = `${match.url}/${v}`;
			const pathName = `${match.path}/${v}`;
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
	return { ...match, ...others };
};

export interface DashboardProps {
	children?: ReactNode | undefined;
}
const LinkText = (props) => <span>{props.children}</span>;
const Portal = ({ className, children, ...props }: DashboardProps & React.HTMLAttributes<HTMLDivElement>) => {
	const theme = useTheme().name;
	className = cnf(s, `comp`, theme, className);

	const linkButton = (children) => <Button>{children}</Button>;
	const pathArr = [
		"dashboard",
		"info",
		"policies",
		"stats",
		"commisions",
		"calendar",
		"analyst",
		"messages",
		"email",
		"today",
		"offline_form",
		"offline_manage",
		"offline_queue",
	];
	const { links, linkNames, path, pathNames } = usePaths(pathArr);
	// Defining drawer links content

	const dcontent: DrawerContentData = {
		dashboard: {
			header: links.dashboard(
				<>
					<Icon icon={BiNews} />
					<LinkText>Dashboard</LinkText>

					{/* <div style={{flexGrow:1}}/>
					<CollapsibleToggleIcon/> */}
				</>
			),
		},
		profile: {
			header: linkButton(
				<>
					<Icon icon={AiOutlineUser} />
					<LinkText>My Profile</LinkText>
					<div style={{ flexGrow: 1 }} />
					<CollapsibleToggleIcon />
				</>
			),
			content: (
				<>
					{links.info("My Info")}
					{links.policies("My Policies")}
					{links.stats("My Stats")}
					{links.commisions("My Commisions")}
					{links.calendar("My Calendar")}
					{links.offline_form("Offline App Form")}
					{links.offline_manage("Offline App Manage")}
					{links.offline_queue("Offline App Queue")}
				</>
			),
		},
		analyst: {
			header: links.analyst(
				<>
					<Icon icon={AiOutlinePieChart} />
					<LinkText>Analyst</LinkText>
					{/* <div style={{flexGrow:1}}/>
					<CollapsibleToggleIcon/> */}
				</>
			),
		},
		notifications: {
			header: linkButton(
				<>
					<Icon icon={AiOutlineBell} />
					<LinkText>Notifications</LinkText>
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
	const [open, setOpen] = useState(true);
	const sideLinks = (
		<>
			<Apply depth_max={-1} className={`${open ? "" : "hide"}`} to={LinkText}>
				<Apply depth_max={-1} style={{ flexShrink: 0 }} className='margin-right-2' size='1.4em' to={Icon}>
					<Apply
						depth_max={-1}
						className='full-width border-radius-0'
						style={{ textAlign: "left", display: "flex", alignItems: "center" }}
						to={Button}
					>
						{Object.entries(dcontent).map(
							([k, v], i) =>
								v && (
									<Collapsible key={i} placeholder='Select Agent'>
										<div className={cnf(s, "margin-top-3")}>{v.header}</div>
										<div style={{ paddingLeft: 35 }}>{v.content}</div>
									</Collapsible>
								)
						)}
					</Apply>
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
			<Route path={pathNames.offline_manage} component={OfflineManage} />
			<Route path={`${pathNames.policies}/:id`} component={PoliciesDetail} />
			<Route path={pathNames.policies} component={Policies} />
			<Route path={pathNames.info} component={MyInfo} />
			<Route path={pathNames.calendar} component={MyCalendar} />
			<Route path={pathNames.offline_form} component={OfflineForm} />
			<Route>Not Implemented</Route>
		</Switch>
	);

	const contacts = useApi_Contacts();

	return (
		<Drawer
			// background={false}
			// floating
			fixed
			visible_always
			// sticky
			// style={{ minHeight: "100%" }}
			open={open}
			setOpen={setOpen}
			style={{ minHeight: "100vh" }}
			drawer={
				<>
					<DrawerTogglePreset />
					<div className='padding-v-3'>
						<div style={{ borderRadius: "50%", width: 70, height: 70, display: "inline-block", overflow: "hidden" }}>
							<img src={user_icon} alt='Glasses' />
						</div>
						{/* <Icon size={70} style={{ width: "100%" }} className='margin-bottom-1' icon={FaUserCircle}></Icon> */}
						{/* Contact Selection */}
						<Select
							onChange={(e) => e.target["value"] && setApi_SummaryQuery({ contactId: e.target["value"] })}
							placeholder='Select Agent'
						>
							{Array.isArray(contacts) &&
								contacts.map((c) => (
									<option value={c.id} key={c.id}>
										{c.firstName}
									</option>
								))}
						</Select>
					</div>
					{sideLinks}
				</>
			}
			// contentProps={{ style: { marginLeft: "250px" } }}
			drawerProps={{
				// className:cnf(s, 'drawer'),

				style: { background: "linear-gradient(75deg, #7B54A3, #DF5395)", height: "100vh" },
			}}
		>
			<Toolbar
				left={<DrawerTogglePreset />}
				middle={
					<>
						<div style={{ fontSize: "1.4em" }}>
							<span>Agent Portal</span>
							<br />
							{/* <span>{path}</span> */}
						</div>
					</>
				}
			/>
			<div className='padding-4'>{routes}</div>
		</Drawer>
		// SOMETHING ELSE
		// <div >
		// </div>
	);
};

export default Portal;
