import React, { ReactNode } from "react";
import s from "./MyInfo.module.scss";
import { useTheme } from "@common/atoms/Theme";
import { cnf } from "@common/utils";
import Input from "@common/atoms/Form/Input";
import Image from "@common/atoms/Image";
import user_icon from "../../glasses_man_small.jpg";
import Button from "@common/atoms/Button";

export interface MyInfoProps {
	children?: ReactNode | undefined;
}

const MyInfo = ({ className, children, ...props }: MyInfoProps & React.HTMLAttributes<HTMLDivElement>) => {
	const theme = useTheme().name;
	className = cnf(s, `comp text-align-center`, theme, className);

	return (
		<div className={className} {...props}>
			<div style={{ maxWidth: 300, display: "inline-block" }}>
				<div style={{ borderRadius: "50%", width: 70, height: 70, display: "inline-block", overflow: "hidden" }}>
					<img src={user_icon} alt='Glasses' />
				</div>
				<br />
				<div className='margin-3'>
					<label>
						Upload profile picture
						<Input type='file' width='200px' />
					</label>
				</div>
				<Button>Upload</Button>
			</div>
		</div>
	);
};

export default MyInfo;
