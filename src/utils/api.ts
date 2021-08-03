import querystring from "querystring";
export interface FetchApiProps {
	url: string;
	method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
	data?: any;
	options?: any;
}

const fetchApi = ({ url, method, data, options }: FetchApiProps) => {
	const headers = new Headers();
	const token = localStorage.getItem("token");

	if (token !== null) {
		// headers.set('Authorization', `Bearer ${token}`);
	}

	if (method === "GET") {
		const qstring = querystring.stringify({
			...data,
		});
		url = `${url}${qstring.length > 0 ? `?${qstring}` : ""}`;
		data = null;
	} else if (data) {
		data = JSON.stringify(data);
	}

	return fetch(process.env.REACT_APP_APIREST + url, {
		method,
		headers,
		body: data,
		...options,
	});
};

export default fetchApi;
