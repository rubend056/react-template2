import { configureStore, createSlice, createStore } from "@reduxjs/toolkit";

const slice = createSlice({
	initialState: 0,
	name: "test",
	reducers: {
		increment: (s) => {
			return s++;
		},
	},
});

const store = configureStore({
	reducer: {
		test: slice.reducer,
	},
});

export default store;
