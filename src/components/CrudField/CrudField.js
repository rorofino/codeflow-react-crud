import React from "react";
import PropTypes from "prop-types";

import { Field } from "redux-form";
import { FormItem } from "codeflow-react-ui";

const required = value => (value ? undefined : 'Campo obrigatório');

const element = props => {
	return (<FormItem {...props} {...props.input}>{props.children}</FormItem>);
};

const CrudField = props => {
	const validate = [];
	if (props.required) {
		validate.push(required);
	}
	if (props.extraValidators && props.extraValidators.length > 0) {
		validate.push(...props.extraValidators);
	}

	return (
		<Field
			connected
			name={props.name}
			label={props.label}
			showLabel={props.showLabel}
			children={props.children}
			component={element}
			required={props.required}
			validate={validate}
			className={props.className}
			format={props.format}
			parse={props.parse}
			normalize={props.normalize}
		/>
	);
};

CrudField.defaultProps = {
	showLabel: true
};

export default CrudField;
