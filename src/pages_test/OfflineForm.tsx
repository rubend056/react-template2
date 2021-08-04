import Button from "@common/atoms/Button";
import Drawer, { DrawerToggle } from "@common/atoms/Drawer";
import Form, { FieldArray, FormNameProvider, UseForm } from "@common/atoms/Form/Form";
import Icon from "@common/atoms/Icon";
import { useNotifications } from "@common/atoms/Notifications";
import { FiX } from "react-icons/fi";
import Divider from "../common/atoms/Divider";
import { Field } from "../common/atoms/Form/Field";
import { field_utils } from "../common/atoms/Form/form_utils";
import DrawerTogglePreset from "../common/molecules/DrawerTogglePreset";
import schema from "./OfflineForm_val";

const Section = ({ content, name, ...props }) => {
	return (
		<div className='card' style={{ display: "flex", flexFlow: "row wrap", gap: ".5em" }} {...props}>
			<h3 style={{ textAlign: "center", width: "100%" }}>{name}</h3>
			{content}
		</div>
	);
};
const subsections = {
	income: (
		<FormNameProvider name=''>
			<Field name='income_type' label='Type of income' type='select' placeholder='' required>
				<option value='employed'>Employed</option>
				<option value='self_employed'>Self-employed</option>
			</Field>
			<Field name='income' label='Annual Income' {...field_utils.money} required />
			{/* <UseForm>
				{({ getValueRel }) =>
					getValueRel("income_type") === "employed" && ( */}
			<>
				<Field name='e_name' label='Employer Name' required />
				<Field name='e_phone' label='Employer Phone Number' {...field_utils.phone} required />
			</>
			{/* )
				}
			</UseForm> */}
		</FormNameProvider>
	),
};
const sections = {
	primary: {
		name: "Primary",
		content: (
			<>
				<FormNameProvider name=''>
					<Field name='name' label='Customer Name' required />
					<Field name='dob' label='Date of Birth' type='date' required />
					<Field name='apply' label='Apply' type='checkbox' required />
					<Field name='sex' type='select' label='Sex' placeholder='' required>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
					</Field>
					<Field name='ssn' label='SSN' {...field_utils.ssn} />
					<Field name='phone' label='Cell Phone' {...field_utils.phone} required />
					<Field name='email' label='Email' required />
					<FormNameProvider name=''>
						<Field name='address' label='Address' required />
						<Field name='zip' label='Zip' required />
						<Field name='city' label='City' required />
						<Field name='state' label='State' required />
					</FormNameProvider>
					<Field name='migratory_status' label='Migratory Status' type='select' placeholder='' required>
						<option value='resident'>Resident</option>
						<option value='citizen'>Citizen</option>
					</Field>
					<Field name='recidence_number' label='Residence Card #' />
				</FormNameProvider>
			</>
		),
	},
	income: {
		name: "Income",
		content: <>{subsections.income}</>,
	},
	household: {
		name: "Household",
		content: (
			<>
				<FormNameProvider name=''>
					<Field name='h_size' label='Family size' {...field_utils.number} required />
					<Field name='h_applying' label='Family applying for coverage?' type='checkbox' required />
					<Field name='h_income' label='Household Income' {...field_utils.money} required />

					<FieldArray name='h_members'>
						{({ arr, push, remove, Map }) => (
							<>
								<Divider style={{ width: "100%" }} />
								{!arr?.length && <div className='border padding-3 text-align-center full-width'>No members</div>}
								{Map({
									className: "border padding-3",
									style: { display: "flex", flexFlow: "row wrap" },
									children: ({ value, index }) => (
										<>
											<div style={{ display: "flex", flexFlow: "row nowrap", width: "100%", gap: 10 }}>
												<h4 style={{ flexGrow: 1, textAlign: "left" }}>
													Member {index} - {value?.["name"] || ""}
												</h4>
												<Button button_type='icon' onClick={() => remove(index)}>
													<Icon icon={FiX} />
												</Button>
											</div>

											<Field name='name' label='Name' required />
											<Field name='relation' label='Relation' type='select' placeholder='' required>
												<option value='spouse'>Spouse</option>
												<option value='dependent'>Dependent</option>
											</Field>
											<Field name='dob' label='Date of Birth' type='date' required />
											<Field name='apply' label='Apply' type='checkbox' required />
											<Field name='sex' type='select' label='Sex' placeholder='' required>
												<option value='male'>Male</option>
												<option value='female'>Female</option>
											</Field>
											<Field name='migratory_status' label='Migratory Status' type='select' placeholder='' required>
												<option value='resident'>Resident</option>
												<option value='citizen'>Citizen</option>
											</Field>
											<Field name='ssn' label='SSN' {...field_utils.ssn} />

											<UseForm>
												{({ getValueRel }) => getValueRel("relation") === "spouse" && subsections.income}
											</UseForm>
										</>
									),
								})}
								<div style={{ display: "flex", flexFlow: "row nowrap", width: "100%", gap: 20, alignItems: "center" }}>
									<Divider style={{ flex: "1 1 auto" }} />
									<Button style={{ justifySelf: "end" }} onClick={() => push()}>
										Add Member
									</Button>
								</div>
							</>
						)}
					</FieldArray>
				</FormNameProvider>
			</>
		),
	},
	plan: {
		name: "Plan",
		content: (
			<>
				<Field name='p_selected' label='Plan Selected' required />
				<Field name='p_monthly' label='Monthly Payment' required {...field_utils.money} />
			</>
		),
	},
	payment_card: {
		name: "Payment Card",
		content: (
			<>
				<FormNameProvider name=''>
					<Field name='c_number' label='Card Number' required {...field_utils.card_number} />
					<Field
						name='expiration'
						label={
							<>
								Card Expiration <b>mm/yy</b>
							</>
						}
						required
						{...field_utils.card_expiration}
					/>
					<Field name='c_cvv' label='CVV' required {...field_utils.card_cvv} />
					{/* <GroupClose> */}
					<Field name='c_first_name' label='Card First Name' required />
					<Field name='c_middle_name' label='Card Middle Name' />
					<Field name='c_last_name' label='Card Last Name' required />
					{/* </GroupClose> */}
				</FormNameProvider>
			</>
		),
	},
};

const OfflineForm = (props) => {
	const nots = useNotifications();
	const onSubmit = (vals) => {
		if (vals) {
			console.log("Submit ", vals);
			nots.addNotification({ text: "Sucessfully Submitted!" });
		} else {
			nots.addNotification({ type: "error", text: "Submit failed, form errors" });
		}
	};
	return (
		<Form validationSchema={schema} submit={onSubmit}>
			<Drawer
				right
				fixed
				drawer={
					<UseForm>
						{({ state }) => (
							<textarea
								readOnly
								value={JSON.stringify(state, null, 4)}
								style={{
									height: "100%",
									width: "100%",
								}}
								className='background-background-active'
							></textarea>
						)}
					</UseForm>
				}
				maxWidth={400}
			>
				<Drawer
					fixed
					floating
					drawer={Object.entries(sections).map(([k, v]) => (
						<Button
							key={k}
							className='full-width border-radius-0'
							onClick={() => document?.getElementById(k)?.scrollIntoView({ block: "start", behavior: "smooth" })}
						>
							{/* {k
										.replace(/_/g, " ")
										.split(" ")
										.map((s) => s[0].toUpperCase() + s.substr(1))
										.join(" ")} */}
							{v.name}
						</Button>
					))}
					contentProps={{ style: { textAlign: "center" } }}
				>
					<div
						style={{
							display: "inline-flex",
							// justifyContent: "center",
							flexFlow: "column nowrap",
							gap: 50,
							maxWidth: 700,
						}}
						className='padding-4 padding-bottom-8'
					>
						<FormNameProvider name='offapp'>
							{Object.entries(sections).map(([k, v], i) => Section({ ...v, id: k, key: i }))}
						</FormNameProvider>
						<UseForm>
							{({ submit }) => (
								<Button className='full-width primary-background' onClick={() => submit()}>
									Submit
								</Button>
							)}
						</UseForm>
					</div>

					<DrawerTogglePreset style={{ position: "fixed", bottom: 12, left: 12 }} className='primary-background' />
				</Drawer>
				<DrawerToggle>
					<Button style={{ position: "fixed", bottom: 12, right: 12 }} className='primary-background'>
						FormState
					</Button>
				</DrawerToggle>
			</Drawer>
		</Form>
	);
};
export default OfflineForm;
