import { configureStore, createSlice } from "@reduxjs/toolkit";
import createAPIEndpoint, { BaseEntity } from "./createEndpoint";

interface Entity extends BaseEntity {
	id: string;
	name: string;
}
const cities = createAPIEndpoint<Entity, {}>("cities", "/api/cities");

// const slice = createSlice({
// 	initialState: 0,
// 	name: "test",
// 	reducers: {
// 		increment: (s) => {
// 			return s++;
// 		},
// 	},
// });

const store = configureStore({
	reducer: {
		cities: cities.reducer,
	},
});

export const actions = {
	cities: cities.actions,
};

export default store;
