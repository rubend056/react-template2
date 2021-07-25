import Divider from "@catoms/Divider";
import { Field } from "@catoms/Form/Field";
import Form, { FieldArray } from "@catoms/Form/Form";
import Input from "@catoms/Form/Input";
import Button from "@catoms/Button";
import GroupClose from "src/common/atoms/GroupClose";
import Apply from "src/common/atoms/HOC/Apply";
import Icon from "src/common/atoms/Icon";
import { FiX } from "react-icons/fi";

// const MyField = (props)=>{
// 	return Input
// }

const EDEForm = () => {
	return (
		<Form initialState={{}}>
			{({ values }) => (
				<div className='col'>
					<div className='col-9' style={{ display: "flex", justifyContent: "center", flexFlow: "column nowrap" }}>
						<div className='card' style={{ flex: "0 1 100px" }}>
							<h3 style={{ textAlign: "center" }}>Primary Contact</h3>
							{/* <div className='col'> */}
							<GroupClose>
								<Field name='primary.first' label='First Name' required />
								<Field name='primary.middle' label='Middle Name' />
								<Field name='primary.last' label='Last Name' required style={{ flexGrow: 2 }} />
							</GroupClose>
							{/* </div> */}

							{/* <Field name='primary.suffix' type='select'>
								<option value='' selected>
									Suffix (optional)
								</option>
								<option value='mr'>Mr.</option>
								<option value='ms'>Ms.</option>
							</Field> */}

							<Apply className='margin-2'>
								<Field name='primary.sex' type='select' label='Sex'>
									<option value='male'>Male</option>
									<option value='female'>Female</option>
								</Field>
								<Field name='primary.dob' type='date' label='Date of Birth' required />

								<Field name='primary.tobacco' type='checkbox' label='Tobacco User'>
									{/* <option value='true'>Yes</option>
									<option value='false'>No</option> */}
								</Field>
							</Apply>
							
							<Field type="toggle" name="test" label="Test Toggle" id="test-toggle"/>
							

							<Divider />

							<Field name='primary.email' label='Email' type='email' required />
							<FieldArray name='primary.phones'>
								{({ arr, push, name, remove }) => (
									<div>
										{arr.map((phone, i) => (
											<div className='border padding-3' style={{ position: "relative" }} key={i}>
												<div style={{fontSize:'1em', fontWeight:'bold'}} className="margin-bottom-3">Phone {i}</div>
												<Field name={`${name}[${i}].number`} label={`Number`} required/>
												<Field name={`${name}[${i}].type`} type='select' label='Type' id={`phone-type-${i}`} required>
													<option value='home'>Home</option>
													<option value='cell'>Cell</option>
													<option value='office'>Office</option>
												</Field>
												<Field name={`${name}[${i}].extension`} label={`Extension`} />
												<Button
													button_type='icon'
													style={{ position: "absolute", top: 0, right: 0 }}
													onClick={() => remove(i)}
												>
													<Icon icon={FiX} />
												</Button>
											</div>
										))}
										<Button onClick={() => push({})}>Add Phone</Button>
									</div>
								)}
							</FieldArray>
							<Divider/>

							<div className='col'>
								<div className='col-12 col-6-tablet'>
									{/* <label> */}
										<Field name='primary.notice.type' type='radio' value='paperless' label="Paperless"/>
										{/* Go paperless */}
									{/* </label> */}
									{values.primary?.notice?.type === "paperless" && (
										<div>
											<label>
												<Field type='checkbox' name='primary.notice.text' />
												Text Me
											</label>
											<label>
												<Field type='checkbox' name='primary.notice.email' />
												Email Me
											</label>
										</div>
									)}
								</div>
								<div className='col-12 col-6-tablet'>
									<label>
										<Field name='primary.notice.type' type='radio' value='mail' />
										Via mail
									</label>
								</div>
							</div>
						</div>
					</div>
					<div className='col-3'>
						<textarea
							value={JSON.stringify(values, null, 2)}
							style={{ height: "100vh", width: "100%", position: "sticky", top: 0 }}
							className='background-background-active'
						></textarea>
					</div>
				</div>
			)}
		</Form>
	);
};

export default EDEForm;
