import React from "react";
import PropTypes from "prop-types";

import { reduxForm, change} from "redux-form";
import CrudField from '../CrudField/CrudField';
import { TextInput, Button, Modal } from 'codeflow-react-ui';

const handleCancel = props => {
	props.onCancel();
}

//props.handleSubmit
const baseCrudEdit = props => (
	<form onSubmit={props.handleSubmit(props.onSave)}>
		<input type="hidden" name={props.keyField} value={props.initialValues ? props.initialValues[props.keyField] : null} />
        {props.editForm ? <props.editForm value={props.initialValues} onChange={(field, value) => props.dispatch(change(props.form, field, value))} /> : props.members.map(member => {
            const memberProps = member.props;
            return (
                <CrudField key={memberProps.field} name={memberProps.field} required={memberProps.required} extraValidators={memberProps.extraValidators}>
                    {memberProps.fieldRender ? memberProps.fieldRender() : <TextInput />}
                </CrudField>
            );
		})}
	</form>
);

const buttons = props => (
	<React.Fragment>
		<Button primary loading={props.submitting} onClick={props.handleSubmit(props.onSave)}>
			Salvar
		</Button>
		<Button primary outline hover={false} bold onClick={() => handleCancel(props)} type="button" className="margin-left-sm">
			Fechar Janela
		</Button>
	</React.Fragment>
)

const CrudEdit = props => (
	props.editMode === "modal" ? 
		<Modal
			isOpen={props.initialValues != null}
			onClose={() => handleCancel(props)}
			float={false}
			title={props.title}
			footer={(
				<div className="hc">
					{buttons(props)}
				</div>
			)}
			{...props.modalProps}
		>
			{baseCrudEdit(props)}
		</Modal>
	:
	props.initialValues != null ?
		<React.Fragment>
			{baseCrudEdit(props)}
			{buttons(props)}
		</React.Fragment>
	: null
);

CrudEdit.propTypes = {
	form: PropTypes.string.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

CrudEdit.defaultProps = {
	
};

export default reduxForm()(CrudEdit);