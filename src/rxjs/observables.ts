import {
	createAPIFetch,
	createAPIFetchCustom,
	createAPIFetchQuery,
	createAPIFetchStatic,
	ResponseFetch,
} from "@common/rxjs/rxjs_utils";
import { OfflineAppFormType } from "../pages_test/OfflineForm_val";

type DetailQuery = { id: string };
type SuccessResponse = { success: boolean };

// * CONTACTS ***********
interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	createdDate: string;
	createdBy: string;
	updatedBy: string;
	entityMetadataId: string;
	updatedDate: string;
}

export const [useApi_Contacts, contacts$] = createAPIFetchStatic<Contact[]>(`/Contacts`);
// ----------------------

// * CARRIERS **********
interface Carrier {
	id: string;
	contactId: string;
	name: string;
}

export const [useApi_Carriers, carriers$] = createAPIFetchStatic<Carrier[]>(`/Carriers`);
// ----------------------

// * CITIES ********
interface City {
	id: string;
	code?: string | null;
	name: string;
	stateId: string;
	countyId: string;
}

export const [useApi_Cities, cities$] = createAPIFetchStatic<City[]>(`/Cities`);
// ----------------------

// * COUNTIES ********
interface County {
	id: string;
	code?: string | null;
	name: string;
	stateId: string;
}

export const [useApi_Counties, counties$] = createAPIFetchStatic<County[]>(`/Counties`);
// ----------------------

// * STATES ********
interface State {
	id: string;
	code?: string | null;
	name: string;
	countryId: string;
}

export const [useApi_States, states$] = createAPIFetchStatic<State[]>(`/States`);
// ----------------------
// * AGENTS ********
interface Agent {
	id: string;
	contactId: string | null;
	firstName: string | null;
	lastName: string | null;
}

export const [useApi_Agents, agents$] = createAPIFetchStatic<Agent[]>(`/Agent`);
// * TYPEGENERIC ********
interface TypeGeneric {
	id: string;
	code?: string | null;
	name: string;
}

export const [useApi_TypeStatus, typeStatus$] = createAPIFetchStatic<TypeGeneric[]>(
	`/TypeGeneric/791B7B3D-E2D0-4319-9676-7DEA67D0F030`
);
// ----------------------

interface PagesQuery {
	pageNumber?: number;
	pageSize: number;
}
interface PagesResponse<T> {
	pageNumber: number;
	pageSize: number;
	firstPage: string;
	lastPage: string;
	totalPages: number;
	totalRecords: number;
	nextPage?: string;
	previousPage?: string;
	data: T[];
	succeded: boolean;
}

// * POLICY *********
export interface PolicyQuery extends PagesQuery {
	policyNumber?: string;
	zipCode?: string;
	cityId?: string;
	countyId?: string;
	stateId?: string;
	carrierId?: string;
	fromDob?: string;
	toDob?: string;
}
interface Policy {
	id: string;
	policyNumber: string;
	firstName: string;
	lastName: string;
	address?: string;
	addressLine2?: string;
	zipCode?: string;
	email?: string;
	phone?: string;
	dob?: string;
	planName?: string;
	numberOfMembers: number;
	premiumAmount?: number;
	carrierId: string;
	carrierName: string;
	cityId?: string;
	cityName?: string;
	countyId?: string;
	countyName?: string;
	stateId: string;
	statename: string;
}

export const [setApi_PolicyQuery, useApi_PolicyQuery, useApi_Policy, policy$] = createAPIFetchQuery<
	PolicyQuery,
	PagesResponse<Policy>
>("/Policies", undefined);
// ----------------------

// * POLICY DETAIL *********
export const [setApi_PolicyDetailQuery, useApi_PolicyDetailQuery, useApi_PolicyDetail, policyDetail$] =
	createAPIFetchCustom<DetailQuery, any>((v) => createAPIFetch(`/Policies/detail/${v.id}`));
// ----------------------

// * SUMMARY *********
interface SummaryQuery {
	year?: number;
	month?: number;
	contactId: string;
	carrierId?: string;
	groupBy?: string;
}
export interface SummaryItem {
	contactId: string;
	carrierId: string;
	carrierName: string;
	members: number;
	policies: number;
	isAgency: boolean;
	month: number;
	year: number;
}

export const [setApi_SummaryQuery, useApi_SummaryQuery, useApi_Summary, summary$] = createAPIFetchQuery<
	SummaryQuery,
	SummaryItem[]
>("/Policies/summaries");
// ----------------------

// * OFFLINEAPP GET *********
export interface OfflineAppQuery extends PagesQuery {
	fromDob?: string;
	toDob?: string;
}
export interface OfflineApp extends OfflineAppFormType {
	id: string;
	activeStatus?: string;
	membersLength?: number;
}

export const [setApi_OfflineAppGetQuery, useApi_OfflineAppGetQuery, useApi_OfflineAppGet, offlineAppGet$] =
	createAPIFetchQuery<OfflineAppQuery, PagesResponse<OfflineApp>>("/OfflineApp");
// ----------------------

// * OFFLINEAPP POST *********
export const [setApi_OfflineAppPostQuery, useApi_OfflineAppPostQuery, useApi_OfflineAppPost, offlineAppPost$] =
	createAPIFetchCustom<OfflineAppFormType, any>(
		(v) =>
			createAPIFetch(`/OfflineApp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(v),
			}),
		{ shareReplay: false }
	);
// ----------------------

// * OFFLINEAPP/ID GET *********
export interface OfflineAppId extends OfflineAppFormType {
	id: string;
	activeStatus?: string;
	membersLength?: number;
}
export const [setApi_OfflineAppIdGetQuery, useApi_OfflineAppIdGetQuery, useApi_OfflineAppIdGet, offlineAppIdGet$] =
	createAPIFetchCustom<DetailQuery, ResponseFetch<OfflineAppId>>((v) =>
		createAPIFetch<OfflineAppId>(`/OfflineApp/${v.id}`)
	);
// ----------------------

// * OFFLINEAPP/ID PUT *********
export const [setApi_OfflineAppIdPutQuery, useApi_OfflineAppIdPutQuery, useApi_OfflineAppIdPut, offlineAppIdPut$] =
	createAPIFetchCustom<DetailQuery & OfflineAppFormType, ResponseFetch<SuccessResponse>>(
		({ id, ...v }) =>
			createAPIFetch<SuccessResponse>(`/OfflineApp/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(v),
			}),
		{ shareReplay: false }
	);
// ----------------------

// * OFFLINEAPP/ID/STATUS GET *********
export interface OfflineAppStatus {
	id: string;
	name: string;
	code: string;
}
export const [
	setApi_OfflineAppIdStatusGetQuery,
	useApi_OfflineAppIdStatusGetQuery,
	useApi_OfflineAppIdStatusGet,
	offlineAppIdStatusGet$,
] = createAPIFetchCustom<DetailQuery, ResponseFetch<OfflineAppStatus[]>>((v) =>
	createAPIFetch<OfflineAppStatus[]>(`/OfflineApp/${v.id}/status`)
);
// ----------------------

// * OFFLINEAPP/ID/STATUS POST *********
export interface OfflineAppStatusQuery {
	statusId?: string;
	agentId?: string;
}
export const [
	setApi_OfflineAppIdStatusPostQuery,
	useApi_OfflineAppIdStatusPostQuery,
	useApi_OfflineAppIdStatusPost,
	offlineAppIdStatusPost$,
] = createAPIFetchCustom<DetailQuery & OfflineAppStatusQuery, ResponseFetch<OfflineAppStatus>>(
	({ id, ...v }) =>
		createAPIFetch<OfflineAppStatus>(`/OfflineApp/${id}/status`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(v),
		}),
	{ shareReplay: false }
);
// ----------------------
