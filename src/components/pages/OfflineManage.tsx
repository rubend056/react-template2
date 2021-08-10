import React, { ReactNode, useEffect, useState } from "react";
import s from "./OfflineManage.module.scss";
import { useTheme } from "@common/atoms/Theme";
import { cnf } from "@common/utils";
import {
	useApi_OfflineAppGet,
	useApi_OfflineAppGetQuery,
	OfflineAppQuery,
	setApi_OfflineAppGetQuery,
} from "../../rxjs/observables";
import { columnsQuick } from "@common/atoms/Table";
import TableSimple from "@common/atoms/TableSimple";
import Form from "@common/atoms/Form/Form";
import Field from "@common/atoms/Form/Field";
import Button from "@common/atoms/Button";
import Icon from "@common/atoms/Icon";
import { AiTwotoneEye } from "react-icons/ai";
import { useRouteMatch, useHistory } from "react-router-dom";
import Checkbox from "@common/atoms/Form/Checkbox";
import { Row } from "react-table";
import useIsKeyPressed from "@common/atoms/Hooks/useIsKeyPressed";
import Modal from "@common/atoms/Modal";
import OfflineForm from "../../pages_test/OfflineForm";

export interface OfflineManageProps {
	children?: ReactNode | undefined;
}

const OfflineManage = ({
	className,
	children,
	...props
}: OfflineManageProps & React.HTMLAttributes<HTMLDivElement>) => {
	const theme = useTheme().name;
	className = cnf(s, `comp`, theme, className);

	// * POLICY FETCH **********
	const offlinesQuery = useApi_OfflineAppGetQuery();
	const offlines = useApi_OfflineAppGet();
	// To set a new policy query value
	const setOfflineAppGetQueryMerge = (v: Partial<OfflineAppQuery>) => {
		setApi_OfflineAppGetQuery(offlinesQuery ? { ...offlinesQuery, ...v } : { ...v, pageSize: 100 });
	};
	const onFormChange = (v) => {
		setApi_OfflineAppGetQuery(v.values);
	};
	// Trigger a first fetch of policy query
	useEffect(() => setOfflineAppGetQueryMerge({}), []);
	// -------------------------

	// * TABLE COLUMN HANDLING *
	// Set a column in table to view policy details
	const columns = columnsQuick("id,ID;name;dob;email;phone;address;city;annualIncome;planSelected;agentName");

	const shiftPressed = useIsKeyPressed("Shift");
	const controlPressed = useIsKeyPressed("Control");
	const [selected, setSelected] = useState<string[]>([]);
	const { url } = useRouteMatch();
	const history = useHistory();
	columns.push({
		id: "ShowButton",
		accessor: "id",
		Cell: (cell) => (
			<Button button_type='icon' ripple_type='center' onClick={() => history.push(`${url}/${cell.value}`)}>
				<Icon icon={AiTwotoneEye} />
			</Button>
		),
	});
	const onClickRow = (row: Row<{}>) => {
		let i = selected.findIndex((id) => id === row.values.id);
		if (controlPressed) {
			if (i >= 0) setSelected(selected.filter((id) => id !== row.values.id));
			else setSelected([...selected, row.values.id]);
		} else if (shiftPressed && selected.length > 0) {
		} else {
			setSelected([row.values.id]);
		}
	};
	// -------------------------

	// columns.splice(0, 0, { accessor: "id", Cell: <Checkbox value={} /> });
	const [showModalNew, setShowModalNew] = useState(false);
	const toggleNew = (e) => {
		setShowModalNew(!showModalNew);
		setTimeout(() => {
			setShowModalNew(showModalNew);
		}, 3000);
	};

	return (
		<div
			className={className}
			{...props}
			onClick={() => {
				setSelected([]);
			}}
		>
			<div onClick={(e) => e.stopPropagation()}>
				<Form initialState={offlinesQuery || {}} onChange={onFormChange}>
					<Field name='name' label='Name' />
					<Field name='fromDob' type='date' label='From Dob' />
					<Field name='toDob' type='date' label='To Dob' />
					<Field name='sex' type='select' placeholder='' label='Sex'>
						<option value='M'>Male</option>
						<option value='F'>Female</option>
					</Field>
				</Form>
			</div>
			<div style={{ maxHeight: "80vh", overflow: "auto" }} className='card'>
				{(offlines?.data?.length && (
					<TableSimple
						rowProps={(row) => ({
							className: cnf(s, "row", selected.includes(row.values.id) ? "selected" : ""),
							onClick: () => onClickRow(row),
						})}
						style={{ width: "100%" }}
						className={cnf(s, "table")}
						onClick={(e) => e.stopPropagation()}
						options={{ columns, data: offlines.data }}
					/>
				)) ||
					"No Data"}
			</div>
			<div className='margin-2'>{(selected.length && <span>Selected {selected.length} items</span>) || ""}</div>
			<Modal isOpen={showModalNew} onClose={() => console.log("Modal closed")}>
				<div style={{ display: "flex", flexDirection: "row-reverse" }}>
					<Button onClick={toggleNew} className='primary-background'>
						Close
					</Button>
				</div>
				<OfflineForm />
				<div style={{ display: "flex", flexDirection: "row-reverse" }}>
					<Button onClick={toggleNew} className='primary-background'>
						Close
					</Button>
				</div>
			</Modal>
			<div className='margin-2' onClick={(e) => e.stopPropagation()}>
				<Button onClick={toggleNew}>New</Button>
				<Button disabled={!selected.length}>Assign</Button>
				<Button disabled={!selected.length}>Edit</Button>
				<Button disabled={!selected.length}>Delete</Button>
			</div>
			{/* {children} */}
		</div>
	);
};

export default OfflineManage;
