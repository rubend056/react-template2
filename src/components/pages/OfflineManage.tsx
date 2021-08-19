import Button from "@common/atoms/Button";
import Field from "@common/atoms/Form/Field";
import Form, { UseForm } from "@common/atoms/Form/Form";
import useIsKeyPressed from "@common/atoms/Hooks/useIsKeyPressed";
import Icon from "@common/atoms/Icon";
import Modal from "@common/atoms/Modal";
import { useNotifications } from "@common/atoms/Notifications";
import QueryErrorContainer from "@common/atoms/QueryErrorContainer";
import { columnsQuick } from "@common/atoms/Table";
import TableSimple from "@common/atoms/TableSimple";
import { useTheme } from "@common/atoms/Theme";
import { responseIsError, responseIsValid } from "@common/rxjs/rxjs_utils";
import { cnf, useStateObject } from "@common/utils";
import moment from "moment";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { AiFillDelete, AiOutlineUserSwitch, AiTwotoneEye } from "react-icons/ai";
import { FiEdit, FiEdit3, FiX } from "react-icons/fi";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Row } from "react-table";
import { OfflineAppForm, OfflineForm_Schema } from "../../pages_test/OfflineForm";
import {
	OfflineApp,
	OfflineAppQuery,
	setApi_OfflineAppGetQuery,
	setApi_OfflineAppIdGetQuery,
	setApi_OfflineAppIdPutQuery,
	setApi_OfflineAppIdStatusPostQuery,
	setApi_OfflineAppPostQuery,
	useApi_Agents,
	useApi_Contacts,
	useApi_OfflineAppGet,
	useApi_OfflineAppGetQuery,
	useApi_OfflineAppIdGet,
	useApi_OfflineAppIdGetQuery,
	useApi_OfflineAppIdPut,
	useApi_OfflineAppIdPutQuery,
	useApi_OfflineAppIdStatusPost,
	useApi_OfflineAppPost,
	useApi_OfflineAppPostQuery,
	useApi_TypeStatus,
} from "../../rxjs/observables";
import s from "./OfflineManage.module.scss";

export interface OfflineManageProps {
	children?: ReactNode | undefined;
}
const queryInitial: OfflineAppQuery = { pageSize: 100 };
// const formInitial: FormState = { values: queryInitial };
const OfflineManage = ({
	className,
	children,
	...props
}: OfflineManageProps & React.HTMLAttributes<HTMLDivElement>) => {
	const theme = useTheme().name;
	className = cnf(s, `comp`, theme, className);

	// * OFFLINES FETCH **********
	const offlines = useApi_OfflineAppGet();
	const offlinesQuery = useApi_OfflineAppGetQuery();
	const setOfflineAppGetQueryMerge = (v: Partial<OfflineAppQuery>) => {
		setApi_OfflineAppGetQuery(offlinesQuery ? { ...offlinesQuery, ...v } : { ...queryInitial, ...v });
	};
	useEffect(() => setOfflineAppGetQueryMerge({}), []);
	// -------------------------
	// * OFFLINE POST **********
	const offlinePost = useApi_OfflineAppPost();
	const offlinePostQuery = useApi_OfflineAppPostQuery();

	// const setOfflineAppGetQueryMerge = (v: Partial<OfflineAppQuery>) => {
	// 	setApi_OfflineAppGetQuery(offlinesQuery ? { ...offlinesQuery, ...v } : { ...queryInitial, ...v });
	// };
	// const nots = useNotifications();
	// useEffect(() => {if(offlinePost)nots.addNotification({text:'Submit success!'});else nots.addNotification({text:'Submit error!', type:'error'});  }, [offlinePost]);
	// -------------------------
	// * OFFLINE ID FETCH **********

	const offlineId = useApi_OfflineAppIdGet();
	const offlineIdQuery = useApi_OfflineAppIdGetQuery();
	// const offlineId = useRef<any>(undefined);
	// -------------------------
	// * OFFLINE ID PUT **********
	const offlineIdPut = useApi_OfflineAppIdPut();
	// -------------------------
	// * OFFLINE ID STATUS POST **********
	const offlineIdStatusPost = useApi_OfflineAppIdStatusPost();
	// -------------------------
	// * CONTACTS GET **********
	const contacts = useApi_Contacts();
	// -------------------------
	// * TYPE STATUS GET **********
	const typeStatus = useApi_TypeStatus();
	// -------------------------
	// * AGENTS GET **********
	const agents = useApi_Agents();
	// -------------------------
	const [assignValues, setAssignValues] = useStateObject({
		id: "",
		agentId: "",
		statusId: "",
	});

	const [showModal, _setShowModal] = useStateObject({
		new: false,
		view: false,
		confirm: false,
		assign: false,
	});
	const setShowModal = (k: keyof typeof showModal, v?: boolean) => {
		let j: Partial<typeof showModal> = {};
		j[k] = v ?? !showModal[k];
		_setShowModal(j);
	};
	const setToEdit = (id: string) => {
		// if (offlines && offlines["data"]) {
		// const arr = offlines["data"]["data"] as OfflineApp[];
		setApi_OfflineAppIdGetQuery({ id });
		// }
	};

	const formNewSubmit = (v) => {
		if (v) setApi_OfflineAppPostQuery(v);
	};
	const formEditSubmit = (v) => {
		if (v) setApi_OfflineAppIdPutQuery(v);
	};
	const toggleButton = (toggleFunc) => (
		<div style={{ display: "flex", flexDirection: "row-reverse" }}>
			<Button onClick={toggleFunc} button_type='icon'>
				<Icon icon={FiX} />
			</Button>
		</div>
	);

	// * TABLE COLUMN HANDLING *
	// Set a column in table to view policy details
	// const columns = columnsQuick("id,name;dob,DOB;email;phone;address;city;annualIncome;planSelected;agentName");

	const shiftPressed = useIsKeyPressed("Shift");
	const controlPressed = useIsKeyPressed("Control");
	const [selected, setSelected] = useState<string[]>([]);
	const { url } = useRouteMatch();
	const history = useHistory();
	const columns = columnsQuick(
		"id;name",
		{
			accessor: "dob",
			Header: "DOB",
			Cell: (cell) => moment(cell.value).format("YYYY/MM/DD"),
		},
		"email;phone;address;city;annualIncome,Annual Income;planSelected,Plan Selected;agentName,Agent Name",
		{
			id: "ShowButton",
			accessor: "id",
			Cell: (cell) => (
				<Button
					button_type='icon'
					ripple_type='center'
					onClick={(e) => {
						// history.push(`${url}/${cell.value}`);
						if (offlines && offlines["data"]) {
							setToEdit(cell.value);
							setShowModal("view");
						}
						e.stopPropagation();
					}}
				>
					<Icon icon={AiTwotoneEye} />
				</Button>
			),
		}
	);

	const onClickRow = (row: Row<{}>) => {
		let i = selected.findIndex((id) => id === row.values.id);
		if (controlPressed) {
			if (i >= 0) setSelected(selected.filter((id) => id !== row.values.id));
			else setSelected([...selected, row.values.id]);
		} else if (shiftPressed && selected.length > 0 && i >= 0) {
			// const lastIndex = selected.findIndex((id) => id === selected[selected.length-1])
			// if()
		} else {
			setSelected([row.values.id]);
		}
	};
	// -------------------------
	// * API ON ACTIONS *
	const not = useNotifications();
	useEffect(() => {
		if (offlinePost) {
			if (responseIsValid(offlinePost)) {
				not.addNotification({ text: "Submission Success!" });
				setShowModal("new", false);
				setOfflineAppGetQueryMerge({});
			} else if (responseIsError(offlinePost)) {
				not.addNotification({ text: "Submission error", type: "error" });
			}
		}
	}, [offlinePost]);
	useEffect(() => {
		if (offlineIdPut) {
			if (responseIsValid(offlineIdPut)) {
				not.addNotification({ text: "Edit success!" });
				setShowModal("view", false);
				setOfflineAppGetQueryMerge({});
			} else if (responseIsError(offlineIdPut)) {
				not.addNotification({ text: "Edit error", type: "error" });
			}
		}
	}, [offlineIdPut]);
	useEffect(() => {
		if (offlineIdStatusPost) {
			if (responseIsValid(offlineIdStatusPost)) {
				not.addNotification({ text: "Set status success!" });
				setShowModal("assign", false);
				setOfflineAppGetQueryMerge({});
			} else if (responseIsError(offlineIdStatusPost)) {
				not.addNotification({ text: "Set status error", type: "error" });
			}
		}
	}, [offlineIdStatusPost]);
	// -------------------------

	return (
		<div
			className={className}
			{...props}
			onClick={() => {
				// setSelected([]);
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{ display: "flex", flexFlow: "row wrap", gap: "1em", alignItems: "center" }}
				className='margin-bottom-3'
			>
				<Form
					// state={formState}
					// setState={setFormState}
					initialState={{ values: offlinesQuery }}
					resetState={{ values: queryInitial }}
					// onReset={(v) => setApi_OfflineAppGetQuery(v.values)}
					onChange={(v) => setApi_OfflineAppGetQuery(v.values)}
				>
					<Field name='name' label='Name' />
					<Field name='fromDob' type='date' label='From Dob' />
					<Field name='toDob' type='date' label='To Dob' />
					<Field name='sex' type='select' placeholder='' label='Sex'>
						<option value='M'>Male</option>
						<option value='F'>Female</option>
					</Field>
					<div style={{ textAlign: "right", flexGrow: 1 }}>
						<UseForm>{({ reset }) => <Button onClick={() => reset()}>Clear Filters</Button>}</UseForm>
					</div>
				</Form>
			</div>
			<div style={{ maxHeight: "80vh", overflow: "auto" }} className='card'>
				<QueryErrorContainer response={offlines}>
					{({ data: offlines }) =>
						(offlines?.data?.length && (
							<TableSimple
								rowProps={(row) => ({
									className: cnf(s, "row", selected.includes(row.values.id) ? "selected" : ""),
									onClick: () => onClickRow(row),
								})}
								style={{ width: "100%" }}
								className={cnf(s, "table")}
								onClick={(e) => e.stopPropagation()}
								options={{ columns, data: offlines.data, initialState: { hiddenColumns: ["id"] } }}
							/>
						)) ||
						"No Data"
					}
				</QueryErrorContainer>
			</div>
			<div className='margin-2'>{(selected.length && <span>Selected {selected.length} items</span>) || ""}</div>
			{/* To prevent bubbling from modals */}
			<div onClick={(e) => e.stopPropagation()}>
				{/* New Form */}
				<Modal isOpen={showModal.new}>
					{toggleButton(() => setShowModal("new"))}
					<Form onSubmit={formNewSubmit} validationSchema={OfflineForm_Schema}>
						{({ submit, errors, touched }) => (
							<>
								<h2 className='text-align-center'>New Application</h2>
								<OfflineAppForm>
									{/* <QueryErrorContainer response={offlinePost} feedback feedbackDefault='Sumission Status'>
										{() => "Submission Success"}
									</QueryErrorContainer> */}
									<Button className='full-width shadow-bottom' onClick={submit} disabled={errors || !touched}>
										Submit New
									</Button>
								</OfflineAppForm>
							</>
						)}
					</Form>
					{toggleButton(() => setShowModal("new"))}
				</Modal>
				{/* View/Edit Form */}
				<Modal isOpen={showModal.view}>
					{() => (
						<>
							<input style={{ opacity: 0, width: 0, height: 0 }} />
							<QueryErrorContainer response={offlineId}>
								{({ data: offlineId }) => (
									<Form
										onSubmit={formEditSubmit}
										validationSchema={OfflineForm_Schema}
										initialState={{ values: offlineId }}
									>
										{({ submit, touched, errors }) => (
											<>
												<h2 className='text-align-center full-width'>View/Edit Application</h2>

												<Button
													onClick={() => {
														touched ? setShowModal("confirm") : setShowModal("view");
													}}
													button_type='icon'
													style={{ position: "absolute", top: 20, right: 20 }}
												>
													<Icon icon={FiX} />
												</Button>

												<OfflineAppForm>
													{/* <QueryErrorContainer response={offlineIdPut} feedback feedbackDefault='Edit Status'>
														{() => "Edit Success"}
													</QueryErrorContainer> */}
													<Button className='full-width shadow-bottom' onClick={submit} disabled={!touched || errors}>
														Submit Edit
													</Button>
												</OfflineAppForm>

												<Modal isOpen={showModal.confirm}>
													You've made changes, really close?
													<div style={{ display: "flex" }}>
														<Button
															onClick={() => {
																setShowModal("confirm");
																setShowModal("view");
															}}
														>
															Yes
														</Button>
														<div style={{ flexGrow: 1 }} />
														<Button onClick={() => setShowModal("confirm")}>No</Button>
													</div>
												</Modal>
												{/* {toggleButton(() => {
													touched ? setShowModal("confirm") : setShowModal("view");
												})} */}
											</>
										)}
									</Form>
								)}
							</QueryErrorContainer>
						</>
					)}
				</Modal>
				<Modal isOpen={showModal.assign}>
					{() => (
						<>
							<Button
								onClick={() => {
									setShowModal("assign");
								}}
								button_type='icon'
								style={{ position: "absolute", top: 20, right: 20 }}
							>
								<Icon icon={FiX} />
							</Button>
							<div className='margin-5'>
								<h2 className='text-align-center full-width'>
									Change Status
									<QueryErrorContainer response={typeStatus}>
										{({ data: typeStatus }) => (
											<div style={{ fontSize: ".5em", opacity: 0.8, fontWeight: "normal" }} className='margin-top-2'>
												Changing to <b>{typeStatus && typeStatus.find((s) => s.id === assignValues.statusId)?.name}</b>
											</div>
										)}
									</QueryErrorContainer>
								</h2>

								<Form
									initialState={{ values: assignValues }}
									onSubmit={(v) => v && setApi_OfflineAppIdStatusPostQuery(v)}
								>
									<div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
										{/* <QueryErrorContainer response={typeStatus}>
							{({data:typeStatus}) => <Field name='statusId' type='select' label='Status' placeholder=''>
							{contacts.map((c) => (
											<option value={c.id} key={c.id}>
												{c.firstName}
											</option>
										))}
								<option value='16E47066-FAB2-4B31-B18D-5AFEA30A314B'>Assigned</option>
								<option value='C6A579FE-0A94-41A4-801E-DBEC3B4F4D69'>Void</option>
							</Field>}
							</QueryErrorContainer> */}

										<QueryErrorContainer response={agents} inline>
											{({ data: agents }) => (
												<Field name='agentId' type='select' label='Agent' placeholder=''>
													{agents.map((c) => (
														<option value={c.id} key={c.id}>
															{c.firstName ?? "null"} {c.lastName}
														</option>
													))}
												</Field>
											)}
										</QueryErrorContainer>
									</div>
									{/* <QueryErrorContainer response={offlineIdStatusPost} feedback childrenDefault='Set Status Response'>
									{() => "Set Status Success"}
								</QueryErrorContainer> */}
									<div style={{ textAlign: "center" }}>
										<UseForm>{({ submit }) => <Button onClick={submit}>Set Status</Button>}</UseForm>
									</div>
								</Form>
							</div>
						</>
					)}
				</Modal>
			</div>

			<div
				className='margin-4'
				onClick={(e) => e.stopPropagation()}
				style={{ display: "flex", flexFlow: "row wrap", justifyContent: "space-around", gap: "1em", fontSize: "1.2em" }}
			>
				<Button onClick={() => setShowModal("new")}>
					<Icon icon={FiEdit} /> New
				</Button>
				<Button
					disabled={!selected.length || selected?.length > 1}
					onClick={() => {
						setToEdit(selected[selected.length - 1]);
						setShowModal("view");
					}}
				>
					<Icon icon={FiEdit3} /> View/Edit
				</Button>
				<QueryErrorContainer response={typeStatus}>
					{({ data: typeStatus }) => (
						<Button
							disabled={!selected.length}
							onClick={() => {
								let id = selected[selected.length - 1];
								const ts = typeStatus.find((v) => v.code === "ASG");
								if (!ts) {
									console.error("Coulnd't find ASG typegeneric");
									return;
								}
								setAssignValues({ ...assignValues, id, statusId: ts.id });
								setToEdit(id);
								setShowModal("assign");
							}}
						>
							<Icon icon={AiOutlineUserSwitch} /> Assign
						</Button>
					)}
				</QueryErrorContainer>
				<QueryErrorContainer response={typeStatus}>
					{({ data: typeStatus }) => (
						<Button
							disabled={!selected.length}
							onClick={() => {
								let id = selected[selected.length - 1];
								const ts = typeStatus.find((v) => v.code === "VOID");
								if (!ts) {
									console.error("Coulnd't find VOID typegeneric");
									return;
								}
								setAssignValues({ ...assignValues, id, statusId: ts.id });
								setToEdit(id);
								setShowModal("assign");
							}}
						>
							<Icon icon={AiFillDelete} /> Void
						</Button>
					)}
				</QueryErrorContainer>
			</div>
			{/* {children} */}
		</div>
	);
};

export default OfflineManage;
