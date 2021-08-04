import { regex_dict } from "@common/atoms/Form/form_utils";
import { objectEntries } from "@common/utils";
import moment from "moment";
import * as y from "yup";

y.addMethod(y.string, "assert", function (f: (v) => boolean, errorMessage) {
	return this.test(`assert`, errorMessage, function (value) {
		const { path, createError } = this;
		return f(value) || createError({ path, message: errorMessage });
	});
});
const migratory_status = y.mixed().oneOf(["resident", "citizen"]).required();
const schema_name = {
	first_name: y.string().required().matches(regex_dict.name, "Not valid"),
	middle_name: y.string().optional().matches(regex_dict.name, "Not valid"),
	last_name: y.string().required().matches(regex_dict.name, "Not valid"),
};
const schema_basic = {
	name: schema_name.first_name,
	dob: y
		.string()
		.required()
		["assert"]((s) => moment().diff(s, "years") >= 18, "Must be 18+"),
	apply: y.boolean().default(true),
	sex: y.string().required(),
	ssn: y.string().matches(regex_dict.ssn, { message: "Not an SSN", excludeEmptyString: true }).optional(),
};
const schema_income = {
	income_type: y.mixed().oneOf(["employed", "self_employed"]).required(),
	income: y.number().min(100).required(),
	// employer: y.object({
	e_name: y.string().required(),
	// .matches(regex_dict.name, "Only words")
	e_phone: y.string().required().matches(regex_dict.phone, "Not a phone"),
	// }).optional(),
};
const schema = y.object({
	offapp: y.object({
		// primary: y.object({
		...schema_basic,
		phone: y.string().required().matches(regex_dict.phone, "Not a phone"),
		// tobacco: y.boolean().default(false),
		email: y.string().required().email(),
		address: y.object({
			address: y.string().required(),
			zip: y.string().required(),
			city: y.string().required(),
			state: y.string().required(),
		}),
		migratory_status,
		recidence_number: y.string().optional(),
		// }),
		// income: y.object({
		...schema_income,
		// }),
		// household: y.object({
		h_size: y.number().required().min(1).max(10),
		h_applying: y.boolean().required().default(true),
		// income_type: y.string().required(),
		h_income: y.number().min(100).required(),
		h_members: y.array(
			y.object({
				...schema_basic,
				dob: y.string().required(),
				relation: y.mixed().oneOf(["spouse", "dependent"]).required(),
				// income: y
				// 	.object({
				...schema_income,
				// })
				// .optional(),
			})
		),
		// }),
		// plan: y.object({
		p_selected: y.string().required(),
		p_monthly: y.number().required().default(0),
		// }),
		// payment_card: y.object({
		c_number: y.string().required().matches(regex_dict.card_number, "Not a card number"),
		c_expiration: y.string().required().matches(regex_dict.card_expiration, "Not an expiration"),
		c_cvv: y.string().required().matches(regex_dict.card_cvv, "Not a CVV"),

		c_first_name: y.string().required().matches(regex_dict.name, "Not valid"),
		c_middle_name: y.string().optional().matches(regex_dict.name, "Not valid"),
		c_last_name: y.string().required().matches(regex_dict.name, "Not valid"),
		// }),
	}),
});

// Add a prefix to keys
// ...objectEntries(schema_name).reduce((a,[k,v]) => {a[`c_${k}`];return a;}, {} as {[k:string]:y.BaseSchema}),

export default schema;
