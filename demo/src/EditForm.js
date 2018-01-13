import React from "react";

import CrudField from '../../src/components/CrudField/CrudField';
import {Checkbox, TextInput}  from "codeflow-react-ui";

const EditForm = props => (
	<div>
		<CrudField name="login" connected required>
			<TextInput />
		</CrudField>
		<CrudField name="email" connected required>
			<TextInput />
		</CrudField>
		<CrudField name="name" connected required>
			<TextInput />
		</CrudField>
	</div>
)

export default EditForm;
