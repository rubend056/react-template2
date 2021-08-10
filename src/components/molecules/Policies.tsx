import Button from "@common/atoms/Button";
import Dropdown from "@common/atoms/Dropdown";
import Flex from "@common/atoms/Flex";
import Select from "@common/atoms/Form/Select";
import Icon from "@common/atoms/Icon";
import { columnsQuick } from "@common/atoms/Table";
import { createAPIFetch, queryString } from "@common/rxjs/rxjs_utils";
import { bind } from "@react-rxjs/core";
import { Column, TableOptions, useTable } from "react-table";
import { createSignal } from "@react-rxjs/utils";
import React, { useEffect, useState } from "react";
import { FaFilter, FaFileExport, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { combineLatest, map, of, switchMap } from "rxjs";
import {
	useApi_Policy,
	PolicyQuery,
	useApi_PolicyQuery,
	useApi_Contacts,
	setApi_PolicyQuery,
	useApi_Cities,
	useApi_Counties,
	useApi_States,
	useApi_Carriers,
	useApi_PolicyDetail,
	setApi_PolicyDetailQuery,
} from "../../rxjs/observables";
import Input from "@common/atoms/Form/Input";
import Form from "@common/atoms/Form/Form";
import Field from "@common/atoms/Form/Field";
import { AiTwotoneEye } from "react-icons/ai";
import { useHistory, useLocation, useParams, useRouteMatch } from "react-router";
import Drawer from "@common/atoms/Drawer";
import Apply from "@common/atoms/HOC/Apply";
import TableSimple from "@common/atoms/TableSimple";

const fileExtsMap = {
	xls: ["application/vnd.ms-excel", "xlsx"],
	pdf: ["application/pdf", "pdf"],
	csv: ["text/csv", "csv"],
};
export const getAcceptHeader = (option: string): string =>
	fileExtsMap[option] ? fileExtsMap[option][0] ?? "application/pdf" : "application/pdf";

export const getFileExtension = (option: string): string =>
	fileExtsMap[option] ? fileExtsMap[option][1] ?? "pdf" : "pdf";

type DownloadQuery = PolicyQuery & { type: string };
const [downloadPQuery$, setPDownloadQuery] = createSignal<DownloadQuery>();
const [usePDownload, downloadP$] = bind(
	downloadPQuery$.pipe(
		switchMap((params) => {
			const { type, ...queryParams } = params;
			return createAPIFetch(
				`/policies${queryString(queryParams)}`,
				{ headers: { Accept: getAcceptHeader(type) } },
				(res) => combineLatest([res.blob(), of(type)])
			);
		})
	)
);
downloadP$.subscribe(([blob, type]) => {
	if (!blob["errors"]) {
		if (window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(
				new Blob([blob], { type: getAcceptHeader(type) }),
				`policies.${getFileExtension(type)}`
			);
		} else {
			var url = window.URL.createObjectURL(blob);
			var a = document.createElement("a");
			a.style.display = "none";
			a.href = url;
			a.download = `policies.${getFileExtension(type)}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		}
	}
});

export const PoliciesDetail = () => {
	const { id } = useParams<{ id?: string }>();
	const policyDetail = useApi_PolicyDetail();
	useEffect(() => {
		if (id) {
			setApi_PolicyDetailQuery({ id });
			// setDetailOpen(true);
		}
	}, [id]);
	return (
		<>
			{(policyDetail && (
				<div className='padding-3'>
					We have policy id <code>{policyDetail.policyId}</code>:
					<div className='padding-3 padding-v-5'>
						<table>
							<tr>
								<th>Name</th>
								<th>Value</th>
							</tr>
							{Object.entries(policyDetail).map(([k, v]) => (
								<tr key={k}>
									<td>{String(k)}</td>
									<td>{String(v)}</td>
								</tr>
							))}
						</table>
					</div>
				</div>
			)) ||
				"No policy fetched"}
		</>
	);
};

const Policies = () => {
	// Use all static API's
	const cities = useApi_Cities();
	const counties = useApi_Counties();
	const states = useApi_States();
	const carriers = useApi_Carriers();

	// const [detailOpen, setDetailOpen] = useState(false);
	// Allow for id parameter in url and fetch when a new id is provided

	const policiesQuery = useApi_PolicyQuery();
	const policies = useApi_Policy();
	// To set a new policy query value
	const setPolicyQueryMerge = (v: Partial<PolicyQuery>) => {
		setApi_PolicyQuery(policiesQuery ? { ...policiesQuery, ...v } : { ...v, pageSize: 20 });
	};
	const onFormChange = (v) => {
		setPolicyQueryMerge(v.values);
	};

	// Trigger a first fetch of policy query
	useEffect(() => setPolicyQueryMerge({}), []);

	// Set a column in table to view policy details
	const columns = columnsQuick(
		"policyNumber,Policy Number;firstName,First Name;lastName,Last Name;address,Address;zipCode,Zip;email,Email;phone,Phone;planName;numberOfMembers"
	);
	const { url } = useRouteMatch();
	const history = useHistory();
	columns.push({
		Header: "View",
		accessor: "id",
		Cell: (cell) => (
			<Button button_type='icon' ripple_type='center' onClick={() => history.push(`${url}/${cell.value}`)}>
				<Icon icon={AiTwotoneEye} />
			</Button>
		),
	});

	// Are the filters shown or not
	const [filtersOn, setFiltersOn] = useState(false);

	return (
		<>
			{/* <Drawer open={detailOpen} setOpen={setDetailOpen} right fixed drawer={}> */}

			<div style={{ display: "flex" }}>
				<div style={{ flexGrow: 1 }} />
				<Button className='outline' onClick={(e) => setFiltersOn(!filtersOn)}>
					<Icon icon={FaFilter} /> Filters
				</Button>
				<Dropdown style={{ marginLeft: "0.2em" }}>
					<Button className='outline'>
						<Icon icon={FaFileExport} /> Export
					</Button>
					<div className='background-background-10 border-radius-2'>
						<Button
							className='full-width'
							onClick={() => policiesQuery && setPDownloadQuery({ ...policiesQuery, type: "pdf" })}
						>
							<Icon icon={FaFilePdf} style={{ float: "left" }} /> PDF
						</Button>
						<Button
							className='full-width'
							onClick={() => policiesQuery && setPDownloadQuery({ ...policiesQuery, type: "xls" })}
						>
							<Icon icon={FaFileExcel} style={{ float: "left" }} /> Excel
						</Button>
					</div>
				</Dropdown>
			</div>
			{filtersOn && (
				<div>
					<Form initialState={policiesQuery || {}} onChange={onFormChange}>
						{({ submit }) => (
							<>
								{/* POLICY NUMBER */}
								<Field name='policyNumber' label='Policy Number' />
								{/* ZIP CODE */}
								<Field name='zipCode' label='Zip Code' />
								{/* FROM DOB */}
								<Field type='date' name='fromDob' label='From Dob' />
								{/* CITY  */}
								<Field name='cityId' type='select' placeholder='' label='Select City'>
									{Array.isArray(cities) && cities.map((c) => <option value={c.id}>{c.name}</option>)}
								</Field>
								{/* COUNTY  */}
								<Field name='countyId' type='select' placeholder='' label='Select County'>
									{Array.isArray(counties) && counties.map((c) => <option value={c.id}>{c.name}</option>)}
								</Field>
								{/* STATES  */}
								<Field name='stateId' type='select' placeholder='' label='Select State'>
									{Array.isArray(states) && states.map((c) => <option value={c.id}>{c.name}</option>)}
								</Field>
								{/* CARRIERS  */}
								<Field name='carrierId' type='select' placeholder='' label='Select Carrier'>
									{Array.isArray(carriers) && carriers.map((c) => <option value={c.id}>{c.name}</option>)}
								</Field>{" "}
							</>
						)}
					</Form>

					{/* These are the filters */}
				</div>
			)}
			<div style={{ maxHeight: "80vh", overflow: "auto" }} className='card'>
				{(policies?.data?.length && (
					<TableSimple
						tableProps={{ style: { textAlign: "center", width: "100%" } }}
						options={{
							data: policies.data,
							columns: columns,
						}}
					/>
				)) ||
					"No data"}
			</div>
			{/* </Drawer> */}
		</>
	);
};
export default Policies;
