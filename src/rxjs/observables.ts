import {
	APIFetchResponse,
	createAPIFetch,
	createAPIFetchCustom,
	createAPIFetchQuery,
	createAPIFetchStatic,
} from "@common/rxjs/rxjs_utils";
import { bind } from "@react-rxjs/core";
import { OfflineApp as OfflineAppForm } from "../pages_test/OfflineForm_val";

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
type Contacts = Contact[] | APIFetchResponse | null;
export const [useApi_Contacts, contacts$] = createAPIFetchStatic<Contacts>(`/Contacts`, undefined, null);
// ----------------------

// * CARRIERS **********
export const [useApi_Carriers, carriers$] = createAPIFetchStatic(`/Carriers`);
// ----------------------

// * CITIES ********
interface City {
	id: string;
	code?: string | null;
	name: string;
	stateId: string;
	countyId: string;
}
type Cities = City[] | APIFetchResponse | null;
export const [useApi_Cities, cities$] = createAPIFetchStatic<Cities>(`/Cities`, undefined, null);
// ----------------------

// * COUNTIES ********
interface County {
	id: string;
	code?: string | null;
	name: string;
	stateId: string;
}
type Counties = County[] | APIFetchResponse | null;
export const [useApi_Counties, counties$] = createAPIFetchStatic<Counties>(`/Counties`, undefined, null);
// ----------------------

// * STATES ********
interface State {
	id: string;
	code?: string | null;
	name: string;
	countryId: string;
}
type States = State[] | APIFetchResponse | null;
export const [useApi_States, states$] = createAPIFetchStatic(`/States`);
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
interface PolicyResponse extends PagesResponse<Policy> {}

export const [setApi_PolicyQuery, useApi_PolicyQuery, useApi_Policy, policy$] = createAPIFetchQuery<
	PolicyQuery,
	PolicyResponse | null
>("/Policies", undefined, null);
// ----------------------

// * SUMMARY *********
interface SummaryQuery {
	year?: number;
	month?: number;
	contactId: string;
	carrierId?: string;
	groupBy?: string;
}
interface SummaryItem {
	contactId: string;
	carrierId: string;
	carrierName: string;
	members: number;
	policies: number;
	isAgency: boolean;
	month: number;
	year: number;
}
type Summary = SummaryItem[] | APIFetchResponse | null;
export const [setApi_SummaryQuery, useApi_SummaryQuery, useApi_Summary, summary$] = createAPIFetchQuery<
	SummaryQuery,
	Summary
>("/Policies/summaries");
// ----------------------

// * OFFLINE APP GET *********
export interface OfflineAppQuery extends PagesQuery {
	fromDob?: string;
	toDob?: string;
}
export interface OfflineApp extends OfflineAppForm {
	id: string;
	activeStatus?: string;
}

type OfflineAppResponse = PagesResponse<OfflineApp> | null;
export const [setApi_OfflineAppGetQuery, useApi_OfflineAppGetQuery, useApi_OfflineAppGet, offlineAppGet$] =
	createAPIFetchQuery<OfflineAppQuery, OfflineAppResponse>("/OfflineApp");
// ----------------------

// * OFFLINE APP POST *********
export const [setApi_OfflineAppPostQuery, useApi_OfflineAppPostQuery, useApi_OfflineAppPost, offlineAppPost$] =
	createAPIFetchCustom<any, any>(
		(v) =>
			createAPIFetch(`/OfflineApp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(v),
			}),
		null
	);
// ----------------------

// * POLICY DETAIL *********
export const [setApi_PolicyDetailQuery, useApi_PolicyDetailQuery, useApi_PolicyDetail, policyDetail$] =
	createAPIFetchCustom<{ id: string }, any>((v) => createAPIFetch(`/Policies/detail/${v.id}`));
// ----------------------
