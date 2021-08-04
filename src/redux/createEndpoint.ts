import { objectEntries } from "@common/utils";
import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
	AsyncThunk,
	ActionReducerMapBuilder,
	EntityState,
	SerializedError,
	EntityAdapter,
} from "@reduxjs/toolkit";
import fetchAPI from "../utils/api";

export interface BaseEntity {
	id?: number | string;
	name?: string;
}

export type LoadingState = "idle" | "loading";

export interface InitialState<T extends BaseEntity> extends EntityState<T> {
	status: LoadingState;
	current: T | null;
	error: SerializedError | null;
}

export interface FindReturns {
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalRecords: number;
	data: Array<any>;
	succeeded: boolean;
}

export interface CommonActions {
	find: AsyncThunk<FindReturns, any, any>;
	get: AsyncThunk<any, any, any>;
	create: AsyncThunk<any, any, any>;
	update: AsyncThunk<any, any, any>;
	patch: AsyncThunk<any, any, any>;
	remove: AsyncThunk<any, any, any>;
}

// export const getKeyValue =
//     <U extends keyof T, T extends object>(key: U) =>
//     (obj: T) =>
//         obj[key];

const createAPIEndpoint = <E, T>(
	endpointName: string,
	endpointURL: string,
	_adapter?: EntityAdapter<E>,
	_state?: InitialState<E> & T,
	_reducers?: any,
	extraBuilder?: (builder: ActionReducerMapBuilder<EntityState<E> & InitialState<E>>) => void
) => {
	const actions_types = {
		find: `${endpointName}/find`,
		get: `${endpointName}/get`,
		create: `${endpointName}/create`,
		put: `${endpointName}/put`,
		patch: `${endpointName}/patch`,
		remove: `${endpointName}/remove`,
	};

	// Create an Entity Adapter, used to flatten fields, has {ids:string[], entities:{[key: string]: E}}
	const adapter = createEntityAdapter<E>(_adapter);

	// Creating initial state with the flattened fields above + {state, current, error}
	const initState = adapter.getInitialState({
		status: "idle" as LoadingState,
		current: null,
		error: null,
		..._state,
	});

	// Creating async thunk actions
	const actions = {} as CommonActions;
	const processResponse = (response: Response) => {
		if (response.ok) return response.json();

		throw new Error(response.statusText);
	};

	// Creates the action of 'actions_types.find' to fetch api, and return a json as a value
	// Also generates /pending, /fulfilled and /rejected actions that will be ejecuted when the thunk is dispatched
	actions.find = createAsyncThunk(actions_types.find, (_filters: any) => {
		return fetchAPI({
			url: `${endpointURL}`,
			method: "GET",
			data: _filters,
		}).then(processResponse);
	});
	actions.get = createAsyncThunk(actions_types.get, (_id: any) => {
		return fetchAPI({
			url: `${endpointURL}/${_id}`,
			method: "GET",
		}).then(processResponse);
	});
	actions.create = createAsyncThunk(actions_types.create, (entity: any) => {
		return fetchAPI({
			url: `${endpointURL}`,
			method: "POST",
			data: entity,
		}).then(processResponse);
	});
	actions.update = createAsyncThunk(actions_types.put, (entity: any) => {
		return fetchAPI({
			url: `${endpointURL}/${entity.id}`,
			method: "PUT",
			data: entity,
		}).then(processResponse);
	});
	actions.patch = createAsyncThunk(actions_types.patch, (entity: any) => {
		return fetchAPI({
			url: `${endpointURL}/${entity.id}`,
			method: "PATCH",
			data: entity,
		});
	});
	actions.remove = createAsyncThunk(actions_types.remove, (id: any) => {
		return fetchAPI({
			url: `${endpointURL}/${id}`,
			method: "DELETE",
		}).then(processResponse);
	});

	// Creates a slice that exposes actions
	const slice = createSlice({
		name: endpointName,
		initialState: initState,
		reducers: {
			status: (state: any, action: any) => {
				state.status = action.payload as LoadingState;
			},
			setOne: (state: any, action: any) => {
				state.current = action.payload;
			},
			setAll: adapter.setAll,
			addOne: adapter.addOne,
			removeOne: adapter.removeOne,
			updateOne: adapter.updateOne,
			upsertOne: adapter.upsertOne,
			..._reducers,
		},
		extraReducers: (builder) => {
			objectEntries(actions).forEach(([key, action]) => {
				builder
					.addCase(action.pending, (state, action) => {
						state.status = "loading";
						state.error = null;
					})
					.addCase(action.fulfilled, (state, action) => {
						state.status = "idle";
						state.error = null;
					})
					.addCase(action.rejected, (state, action: any) => {
						state.status = "idle";
						state.error = action.error;
					});
			});
			// Call _extra function with builder
			extraBuilder && extraBuilder(builder);
		},
	});

	// Selector to pull value from endpoint
	const selectbase = createSelector(
		(state: any) => state[endpointName],
		(endpoint) => endpoint
	);
	const selectors = adapter.getSelectors(selectbase);
	const getOne = createSelector(selectbase, (endpoint) => endpoint.current);
	const getStatus = createSelector<any, any, LoadingState>(selectbase, (endpoint) => endpoint.status as LoadingState);

	return {
		actions: { ...actions, ...slice.actions },
		reducer: slice.reducer,
		selectors: {
			selectbase,
			getOne,
			getStatus,
			...selectors,
		},
	};
};

export default createAPIEndpoint;
