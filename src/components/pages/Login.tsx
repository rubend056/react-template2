import React, { ReactNode, useEffect } from "react";
import s from "./Login.module.scss";
import { useTheme } from "@common/atoms/Theme";
import { cnf } from "@common/utils";
import Stepper from "@common/atoms/Stepper";
import Field from "@common/atoms/Form/Field";
import Form from "@common/atoms/Form/Form";
import Button from "@common/atoms/Button";
import { useHistory } from "react-router";

export interface LoginProps {
	children?: ReactNode;
}

const fieldsCommon = (
	<>
		<Field name='username' label='Username' />
		<Field name='password' type='password' label='Password' />
	</>
);
const Login = ({ className, children, ...props }: LoginProps & React.HTMLAttributes<HTMLDivElement>) => {
	const theme = useTheme().name;
	className = cnf(s, `comp`, theme, className);

	const history = useHistory();
	const onSubmit = () => {
		localStorage.setItem("token", "true");
		history.push("/portal/dashboard");
	};
	// const token = localStorage.getItem('token');
	// useEffect(() => {
	// 	if(token)
	// }, [token])

	return (
		<div className={className} {...props}>
			<div className={cnf(s, "container")}>
				<Stepper
					animTime={0.4}
					steps={[
						{
							header: "Login",
							value: (
								<div>
									<Form onSubmit={onSubmit}>
										{({ submit }) => (
											<>
												{fieldsCommon}
												<Button className='full-width border margin-top-3' onClick={submit}>
													Login
												</Button>
											</>
										)}
									</Form>
								</div>
							),
						},
						{
							header: "Register",
							value: (
								<div>
									<Form onSubmit={onSubmit}>
										{({ submit }) => (
											<>
												{fieldsCommon}
												<Button className='full-width border margin-top-3' onClick={submit}>
													Register
												</Button>
											</>
										)}
									</Form>
								</div>
							),
						},
					]}
				/>
			</div>
		</div>
	);
};

export default Login;
