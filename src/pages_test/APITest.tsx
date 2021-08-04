import Input from "@common/atoms/Form/Input";
import { bind, SUSPENSE } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { fromFetch } from "rxjs/fetch";
import Button from "@common/atoms/Button";
import { object_equals } from "@common/utils";
import {
	AsyncSubject,
	catchError,
	delay,
	distinctUntilChanged,
	interval,
	map,
	Observable,
	of,
	share,
	shareReplay,
	Subject,
	switchMap,
	take,
} from "rxjs";

// A signal is an entry point to react-rxjs. It's equivalent to using a subject
const [textChange$, setText] = createSignal<string>();
// Bind creates hook that subscribes to observable
const [useText, text$] = bind<string>(textChange$, "");
const [useTextLength, textLength$] = bind<number>(text$.pipe(map((v) => v.length)), 0);

const int$ = interval(1000).pipe(share());
const [useInt, latestInt$] = bind(int$, 0);
// ---------------

const createAPIFetch = (endpoint: string, init?: RequestInit) => {
	if (endpoint[0] !== "/") endpoint = "/" + endpoint;
	if (!process.env.REACT_APP_API_URL) throw new Error(`process.env.REACT_APP_API_URL undefined?`);
	const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
	return fromFetch(url, init).pipe(
		switchMap((res) => {
			if (res.ok) {
				return res.json();
			} else {
				return of({ errors: true, message: `Error ${res.status}` });
			}
		}),
		catchError((err) => {
			console.error(err);
			return of({ errors: true, message: err.message });
		})
	);
};
const createAPIFetchStatic = (endpoint: string, init?: RequestInit) =>
	createAPIFetch(endpoint, init).pipe(shareReplay());
const [useApi_Carriers, api_Carriers$] = bind(createAPIFetchStatic(`/api/Carriers`), null);
const [useApi_Cities, api_Cities$] = bind(createAPIFetchStatic(`/api/Cities`), null);
const [useApi_Contacts, api_Contacts$] = bind(createAPIFetchStatic(`/api/Contacts`), null);
const [useApi_Countries, api_Countries$] = bind(createAPIFetchStatic(`/api/Countries`), null);
const [useApi_States, api_States$] = bind(createAPIFetchStatic(`/api/States`), null);

const queryString = (v?: any) => {
	if (typeof v !== "object" || Array.isArray(v)) return "";
	else {
		return (
			"?" +
			Object.entries(v)
				.map(([k, v]) => `${k}=${v}`)
				.join("&")
		);
	}
};
/** To customize how to fetch the API */
function createAPIFetchCustom<T extends {}, E>(
	toFetch: (val: T) => Observable<E>
): [(v: T) => void, () => Exclude<E, typeof SUSPENSE> | null, any] {
	const [value$, setValue] = createSignal<T>();
	const result$ = value$.pipe(
		// Only update when parameters changed
		distinctUntilChanged((prev, curr) => object_equals(prev, curr)),
		switchMap(toFetch)
	);
	const [useResult, shareResult$] = bind(result$, null);
	return [setValue, useResult, shareResult$];
}
/** To customize how to fetch the API */
function createAPIFetchQuery<T extends {}>(endpoint: string, init?: RequestInit) {
	return createAPIFetchCustom((val: T) => createAPIFetch(endpoint + queryString(val), init));
}

interface PolicyQuery {
	policyNumber?: string;
	firstName?: string;
	lastName?: string;
	zipCode?: string;
	cityId?: string;
	countyId?: string;
	stateId?: string;
	carrierId?: string;
	fromDob?: string;
	pageNumber?: number;
	pageSize: number;
}
const [setPolicyQuery, usePolicy, policy$] = createAPIFetchQuery<PolicyQuery>("/api/Policies");

const QueryError = ({ query }) => {
	return <>{query?.errors && query?.message}</>;
};

const APITest = () => {
	const text = useText();
	const textLength = useTextLength();
	const int = useInt();
	const result = usePolicy();

	return (
		<>
			<div style={{ display: "flex" }}>
				<div className='card'>
					<Input onChange={(e) => setText(e.target.value)} />
					<br />
					<span>You have input: {text}</span>
					<br />
					<span>The length of input: {textLength}</span>
					<span>A counter {int}</span>
				</div>
				<div className='card'>
					<Input id='api_test' />
					<br />
					<Button
						onClick={() => {
							const o = document.getElementById("api_test");
							// if (o) setPolicySubject(o["value"]);
							setPolicyQuery({ pageSize: 10 });
						}}
					>
						Look for Policy
					</Button>
					<QueryError query={result} />
					<textarea value={JSON.stringify(result, undefined, 2)}></textarea>
				</div>
			</div>
		</>
	);
};
export default APITest;
