import React, { ReactNode } from "react";
import s from "./MyInfo.module.scss";
import { useTheme } from "@common/atoms/Theme";
import { cnf } from "@common/utils";
import Input from "@common/atoms/Form/Input";
import Image from "@common/atoms/Image";
import user_icon from "../../glasses_man_small.jpg";
import Button from "@common/atoms/Button";
import Apply from "@common/atoms/HOC/Apply";
import Field from "@common/atoms/Form/Field";
import Form, { UseForm } from "@common/atoms/Form/Form";
import { Link, Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { useState } from "react";
import { UseLocation, UseRouteMatch } from "@common/atoms/Hooks/routerHooks";
import { capitalize } from "voca";

export interface MyInfoProps {
	children?: ReactNode | undefined;
}

const MyAccount = ({ className, children, ...props }: MyInfoProps & React.HTMLAttributes<HTMLDivElement>) => {
	const theme = useTheme().name;
	className = cnf(s, `comp text-align-center`, theme, className);

	const [userData, setUserData] = useState<any>({
		values: { name: "Ruben D Prieto", email: "rubendariopm14@gmail.com" },
	});
	const { url, path } = useRouteMatch();

	return (
		<div className={className} {...props}>
			<div style={{ display: "flex" }}>
				<div className='border-right'>
					<div className='card'>
						<div style={{ borderRadius: "50%", width: 50, height: 50, display: "inline-block", overflow: "hidden" }}>
							<Image src={user_icon} alt='Glasses' />
						</div>
						<div>{userData.values.name}</div>
					</div>
					<Apply to={Button} depth_max={-1} className='full-width'>
						<Link to={`${url}/contact`}>
							<Button>Contact</Button>
						</Link>
						<Link to={`${url}/settings`}>
							<Button>Settings</Button>
						</Link>
					</Apply>
				</div>
				<div className='text-align-center padding-3' style={{ flexGrow: 1, maxWidth: 400 }}>
					<UseLocation>{(l) => <h2>{capitalize(l.pathname.split("/").slice(-1)[0])}</h2>}</UseLocation>
					<Switch>
						<Route path={`${path}/contact`}>
							<Form state={userData} setState={setUserData}>
								<div style={{ display: "flex", alignItems: "center" }} className='padding-2 border-bottom'>
									<Field name='name' label='Name' />
									<div style={{ flexGrow: 1 }} />
									<Field name='email' label='Email' />
								</div>
								<div className='padding-3'>
									<Field type='file' className='full-width' label='Profile Picture' direction='left' />

									<Button className='border'>Upload</Button>
								</div>
							</Form>
						</Route>
						<Route path={`${path}/settings`}>
							<Form>
								{/* <Apply to={Field} depth_max={-1} className="full-width"> */}
								<div style={{ display: "flex", flexFlow: "column" }}>
									<Field name='themeForce' type='toggle' label='Force Theme' />
									<UseForm>
										{({ state }) => state.values.themeForce && <Field name='theme' type='toggle' label='Theme' />}
									</UseForm>
								</div>
								{/* </Apply> */}
							</Form>
						</Route>
						<Route>
							<Redirect to={`${url}/contact`} />
						</Route>
					</Switch>
				</div>
			</div>
		</div>
	);
};

export default MyAccount;
