import {
	combineInputs,
	createAPIFetch,
	createAPIFetchChain,
	createAPIFetchEvent,
	createAPIFetchHelper,
	createAPIFetchStatic,
	ResponseFetch,
	responseIsValid,
} from "@common/rxjs/rxjs_utils";
import { jwtParse } from "@common/utils";
import { combineLatestAll, filter, from, map, Observable, of, shareReplay, startWith, switchMap } from "rxjs";
import { OfflineAppFormType } from "../components/pages/OfflineForm_val";

type DetailQuery = { id: string };
type SuccessResponse = { success: boolean };

// ****************** AUTHENTICATION ****************
if (!process.env.REACT_APP_API_URL_AUTH) throw new Error("REACT_APP_API_URL_AUTH not defined?");
const baseURLAuth = process.env.REACT_APP_API_URL_AUTH + "/api/auth";
export interface Login {
	token: string;
}
interface AuthCommon {
	email: string;
}
export interface LoginQuery extends AuthCommon {
	password: string;
}
export interface RegisterQuery extends LoginQuery {}
export const [setApi_LoginPostQuery, useApi_LoginPostQuery, useApi_LoginPost, loginPost$] = createAPIFetchEvent<
	LoginQuery,
	ResponseFetch<Login>
>(([v]) => createAPIFetchHelper<Login>({ endpoint: `/login`, type: "json", body: v, baseUrl: baseURLAuth }), {
	shareReplay: false,
});

const tokenValid$ = loginPost$.pipe(
	map((r) => (responseIsValid(r) ? r?.data?.token : undefined)),
	startWith(localStorage.getItem("token") ?? undefined),
	filter((r) => Boolean(r)),
	map((token) => ({ token })),
	shareReplay(1)
);

export const [setApi_RegisterPostQuery, useApi_RegisterPostQuery, useApi_RegisterPost, registerPost$] =
	createAPIFetchEvent<RegisterQuery, ResponseFetch<boolean>>(
		([v]) => createAPIFetchHelper<boolean>({ endpoint: `/register`, type: "json", body: v, baseUrl: baseURLAuth }),
		{
			shareReplay: false,
		}
	);

export interface ForgotPassQuery extends AuthCommon {}
export const [setApi_ForgotPassPostQuery, useApi_ForgotPassPostQuery, useApi_ForgotPassPost, forgotPassPost$] =
	createAPIFetchEvent<ForgotPassQuery, ResponseFetch<boolean>>(
		([v]) =>
			createAPIFetchHelper<boolean>({ endpoint: `/forgotPassword`, type: "json", body: v, baseUrl: baseURLAuth }),
		{
			shareReplay: false,
		}
	);
export interface ResetPassQuery extends LoginQuery {
	code: string;
}
export const [setApi_ResetPassPostQuery, useApi_ResetPassPostQuery, useApi_ResetPassPost, resetPassPost$] =
	createAPIFetchEvent<ResetPassQuery, ResponseFetch<boolean>>(
		([v]) => createAPIFetchHelper<boolean>({ endpoint: `/resetPassword`, type: "json", body: v, baseUrl: baseURLAuth }),
		{
			shareReplay: false,
		}
	);

// ----------------------

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

export const [useApi_Contacts, contacts$] = createAPIFetchStatic<Contact[]>({ endpoint: `/Contacts` });
// ----------------------

// * CARRIERS **********
interface Carrier {
	id: string;
	contactId: string;
	name: string;
}

export const [useApi_Carriers, carriers$] = createAPIFetchStatic<Carrier[]>({ endpoint: `/Carriers` });
// ----------------------

// * CITIES ********
interface City {
	id: string;
	code?: string | null;
	name: string;
	stateId: string;
	countyId: string;
}

export const [useApi_Cities, cities$] = createAPIFetchStatic<City[]>({ endpoint: `/Cities` });
// ----------------------

// * COUNTIES ********
interface County {
	id: string;
	code?: string | null;
	name: string;
	stateId: string;
}

export const [useApi_Counties, counties$] = createAPIFetchStatic<County[]>({ endpoint: `/Counties` });
// ----------------------

// * STATES ********
interface State {
	id: string;
	code?: string | null;
	name: string;
	countryId: string;
}

export const [useApi_States, states$] = createAPIFetchStatic<State[]>({ endpoint: `/States` });
// ----------------------
// * AGENTS ********
interface Agent {
	id: string;
	contactId: string | null;
	firstName: string | null;
	lastName: string | null;
}

export const [useApi_Agents, agents$] = createAPIFetchStatic<Agent[]>({ endpoint: `/Agent` });
// * TYPEGENERIC ********
interface TypeGeneric {
	id: string;
	code?: string | null;
	name: string;
}

export const [useApi_TypeStatus, typeStatus$] = createAPIFetchStatic<TypeGeneric[]>({
	endpoint: `/TypeGeneric/791B7B3D-E2D0-4319-9676-7DEA67D0F030`,
});
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

export const [setApi_PolicyQuery, useApi_PolicyQuery, useApi_Policy, policy$] = createAPIFetchEvent<
	PolicyQuery,
	ResponseFetch<PagesResponse<Policy>>
>(([v]) => createAPIFetchHelper({ endpoint: "/Policies", query: v }));
// ----------------------

// * POLICY DETAIL *********
export const [setApi_PolicyDetailQuery, useApi_PolicyDetailQuery, useApi_PolicyDetail, policyDetail$] =
	createAPIFetchEvent<DetailQuery, any>(([v]) => createAPIFetchHelper({ endpoint: `/Policies/detail/${v.id}` }));
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

export const [setApi_SummaryQuery, useApi_SummaryQuery, useApi_Summary, summary$] = createAPIFetchEvent<
	SummaryQuery,
	ResponseFetch<SummaryItem[]>
>(([v]) => createAPIFetchHelper({ endpoint: "/Policies/summaries", query: v }));
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
	createAPIFetchEvent<OfflineAppQuery, ResponseFetch<PagesResponse<OfflineApp>>>(([v]) =>
		createAPIFetchHelper({ endpoint: "/OfflineApp", query: v })
	);
// ----------------------

// * OFFLINEAPP POST *********
export const [setApi_OfflineAppPostQuery, useApi_OfflineAppPostQuery, useApi_OfflineAppPost, offlineAppPost$] =
	createAPIFetchEvent<OfflineAppFormType, any>(
		([v]) => createAPIFetchHelper({ endpoint: "/OfflineApp", body: v, type: "json" }),
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
	createAPIFetchEvent<DetailQuery, ResponseFetch<OfflineAppId>>(([v]) =>
		createAPIFetchHelper<OfflineAppId>({ endpoint: `/OfflineApp/${v.id}` })
	);
// ----------------------

// * OFFLINEAPP/ID PUT *********
export const [setApi_OfflineAppIdPutQuery, useApi_OfflineAppIdPutQuery, useApi_OfflineAppIdPut, offlineAppIdPut$] =
	createAPIFetchEvent<DetailQuery & OfflineAppFormType, ResponseFetch<SuccessResponse>>(
		([{ id, ...v }]) =>
			createAPIFetchHelper<SuccessResponse>({
				endpoint: `/OfflineApp/${id}`,
				init: {
					method: "PUT",
				},
				type: "json",
				body: v,
			}),
		{ shareReplay: false }
	);
// ----------------------
// * OFFLINEAPP/STATUS POST *********
export interface OfflineAppStatusQuery {
	listIds: string[];
	statusId: string;
	agentId?: string;
}
export const [
	setApi_OfflineAppStatusPostQuery,
	useApi_OfflineAppStatusPostQuery,
	useApi_OfflineAppStatusPost,
	offlineAppStatusPost$,
] = createAPIFetchEvent<OfflineAppStatusQuery, ResponseFetch<OfflineAppStatus[]>>(
	([{ ...v }]) => createAPIFetchHelper<OfflineAppStatus[]>({ endpoint: `/OfflineApp/status`, type: "json", body: v }),
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
] = createAPIFetchEvent<DetailQuery, ResponseFetch<OfflineAppStatus[]>>(([v]) =>
	createAPIFetchHelper<OfflineAppStatus[]>({ endpoint: `/OfflineApp/${v.id}/status` })
);
// ----------------------

// * OFFLINEAPP/ID/STATUS POST *********
export interface OfflineAppIdStatusQuery {
	id: string;
	statusId: string;
	agentId?: string;
}
export const [
	setApi_OfflineAppIdStatusPostQuery,
	useApi_OfflineAppIdStatusPostQuery,
	useApi_OfflineAppIdStatusPost,
	offlineAppIdStatusPost$,
] = createAPIFetchEvent<OfflineAppIdStatusQuery, ResponseFetch<OfflineAppStatus>>(
	([{ id, ...v }]) =>
		createAPIFetchHelper<OfflineAppStatus>({ endpoint: `/OfflineApp/${id}/status`, type: "json", body: v }),
	{ shareReplay: false }
);
// ----------------------

// * CONFIGURATION *********
export interface ConfigurationAPI {
	variable: string;
	value: string;
	description: string;
	type: "date" | "string" | "integer" | "decimal" | "boolean";
}
export const [useApi_Configuration, configuration$] = createAPIFetchStatic<ConfigurationAPI[]>({
	endpoint: "/Configuration",
});
// ----------------------

// * USER *********
/**
 * We need to pull all user data once the user logs in AND the UI requests the data.
 *  - We need to split the data the UI needs, for example this user data can't contain the photo or payment info since it would ALL pulled once the user logs in and we want separate reuqests for every UI screen.
 * 	- What we need is separate UI functions to pull /user /user/payment and /user/photo AND be triggered every time a new user logs in.
 ** - MEANING: we need an observable to valid token for login to send in request either: when the user logs in or it's saved in local storage and make new rquests every time those events happen.
 ** - MEANING: Remove token pulling from LocalStorage in createAPIFetch method and concat every method that needs user auth after a valid token is provided ------ DONE
 ** - MEANING: Since so many different observables need this, we need the following:
 *		1. Create a concat option in createAPIFetchCustom/createAPIFetchQuery ----- DONE
 */

export interface UserData {
	name: string;
	email: string;
	contactId?: string;
}
export interface UserPayment {
	account_number: string;
	routing_number: string;
}
export const [useApi_UserQuery, useApi_User, user$] = createAPIFetchChain([tokenValid$], ([{ token }]) => {
	const tokenData = jwtParse(token);
	tokenData.name = tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
	tokenData.email = tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
	const r = { data: { ...tokenData } };
	return of(r) as Observable<ResponseFetch<UserData>>;
	// return createAPIFetchHelper<UserData>({ endpoint: "/user", token })
});
export const [useApi_UserPhotoQuery, useApi_UserPhoto, userPhoto$] = createAPIFetchChain([tokenValid$], ([v]) =>
	createAPIFetchHelper<string>({ endpoint: "/user/photo", ...v })
);
export const [useApi_UserPaymentQuery, useApi_UserPayment, userPayment$] = createAPIFetchChain([tokenValid$], ([v]) => {
	const dummy_payment: UserPayment = { account_number: "45454545454", routing_number: "45454545454" };
	return of({ data: dummy_payment }) as Observable<ResponseFetch<UserPayment>>;
	// return createAPIFetchHelper<UserPayment>({ endpoint: "/user/payment", ...v });
});

// ----------------------
