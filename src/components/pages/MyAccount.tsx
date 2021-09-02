import React, { ReactNode } from "react";
import s from "./MyAccount.module.scss";
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
import { useCallback } from "react";

const Payment = () => {
	return (
		<Form>
			<div style={{ display: "inline-flex", flexFlow: "column nowrap", alignItems: "center", maxWidth: 300 }}>
				<Field name='account_number' label='Account Number' editConfirm className='full-width' />
				<Field name='routing_number' label='Routing Number' editConfirm className='full-width' />
				<Field name='payment_method' label='Payment Method' type='select' placeholder='' className='full-width'>
					<option value='ach'>ACH</option>
					<option value='check'>Check</option>
					<option value='wire'>Wire Transfer</option>
				</Field>
			</div>
		</Form>
	);
};

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

	const Section = useCallback(
		// () =>
		({ children, header, ...props }) => (
			<div {...props} className={cnf(s, props.className, "section card")}>
				{header && <h2 className='margin-top-0'>{header}</h2>}
				{children}
			</div>
		),
		[]
	);
	const [showPayment, setShowPayment] = useState(false);

	return (
		<div className={className}>
			<Section header='Personal'>
				<Form state={userData} setState={setUserData}>
					<div style={{ display: "flex", flexFlow: "column nowrap", alignItems: "center" }} className='padding-2'>
						<div
							style={{
								borderRadius: "50%",
								width: 80,
								height: 80,
								position: "relative",
								display: "inline-block",
								overflow: "hidden",
							}}
						>
							<div className={cnf(s, "change-photo")}>Change Photo</div>
							<Image src={user_icon} alt='Glasses' />
						</div>
						{/* <div>{userData.values.name}</div> */}
						<Field name='name' label='Name' editConfirm />

						<Field name='email' label='Email' editConfirm />
					</div>
					{/* <div className='padding-3'>
						<Field type='file' className='full-width' label='Profile Picture' direction='left' />

						<Button className='border'>Upload</Button>
					</div> */}
				</Form>
			</Section>
			<Section header='Security'>
				<Form state={userData} setState={setUserData} initialState={{ values: { password: "123456" } }}>
					<Field type='password' label='Password' editConfirm disabled name='password' />
				</Form>
			</Section>
			<Section header='Payment'>
				{showPayment ? (
					<Payment />
				) : (
					<Button
						className='error-background border'
						onClick={() => {
							setShowPayment(true);
						}}
					>
						Show Payment Info
					</Button>
				)}
			</Section>

			{/* <div style={{ display: "flex" }}>
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
								
								<div style={{ display: "flex", flexFlow: "column" }}>
									<Field name='themeForce' type='toggle' label='Force Theme' />
									<UseForm>
										{({ state }) => state.values.themeForce && <Field name='theme' type='toggle' label='Theme' />}
									</UseForm>
								</div>
								
							</Form>
						</Route>
						<Route>
							<Redirect to={`${url}/contact`} />
						</Route>
					</Switch>
				</div>
			</div> */}
		</div>
	);
};

export default MyAccount;
