import React from "react";
import PropTypes from "prop-types";

import { reduxForm } from "redux-form";
import CrudField from '../CrudField/CrudField';
import { TextInput, Button } from 'codeflow-react-ui';

const CrudEdit = props => (
	<form onSubmit={props.handleSubmit(props.onSave)}>
        {props.editForm ? <props.editForm /> : props.members.map(member => {
            const memberProps = member.props;
            return (
                <CrudField key={memberProps.field} name={memberProps.field} required={memberProps.required} extraValidators={memberProps.extraValidators}>
                    {memberProps.fieldRender ? memberProps.fieldRender() : <TextInput />}
                </CrudField>
            );
        })}
		<div style={{ textAlign: "center", marginTop: 15 }}>
			<Button primary loading={props.submitting}>
				Salvar
			</Button>
			<Button primary outline hover={false} bold onClick={props.onCancel} type="button" className="margin-left-sm">
				Fechar Janela
			</Button>
		</div>
	</form>
);

CrudEdit.propTypes = {
	form: PropTypes.string.isRequired,
	onSave: PropTypes.func,
	onCancel: PropTypes.func.isRequired,
};

CrudEdit.defaultProps = {
	
};

export default reduxForm()(CrudEdit);