import React from "react";
import PropTypes from "prop-types";

import { connect } from 'react-redux';
import { reduxForm, change, formValueSelector} from "redux-form";
import CrudField from '../CrudField/CrudField';
import { TextInput, Button, Modal } from 'codeflow-react-ui';

const handleCancel = props => {
	props.onCancel();
}

const renderEditForm = props => {
	if (typeof props.editForm === "function") {
		return props.editForm(props.initialValues);
	}
	return <props.editForm value={props.initialValues} onChange={(field, value) => props.dispatch(change(props.form, field, value))} />;
}

//props.handleSubmit
const baseCrudEdit = props => (
	<form onSubmit={props.handleSubmit(props.onSave)}>
		<input type="hidden" name={props.keyField} value={props.initialValues ? props.initialValues[props.keyField] : null} />
		
		{props.editForm ?
				renderEditForm(props)
				: 
				props.members.map(member => {
				const memberProps = member.props;
				return (
					<CrudField
						key={memberProps.field}
						name={memberProps.field}
						required={memberProps.required}
						extraValidators={memberProps.extraValidators}
						format={memberProps.format}
						parse={memberProps.parse}
						normalize={memberProps.normalize}
					>
						{memberProps.fieldRender ? memberProps.fieldRender() : <TextInput />}
					</CrudField>
				);
			})}
	</form>
);

const renderButtonsModal = props => (
	<React.Fragment>
		<Button primary loading={props.submitting} onClick={props.handleSubmit(props.onSave)}>
			Salvar
		</Button>
		<Button primary outline hover={false} bold onClick={() => handleCancel(props)} type="button" className="margin-left-sm">
			Fechar Janela
		</Button>
	</React.Fragment>
)

const renderButtonsFullscreen = props => (
	<div className="hc margin-top-sm">
		<Button primary loading={props.submitting} onClick={props.handleSubmit(props.onSave)}>
			Salvar
		</Button>
		<Button danger outline hover={false} bold onClick={props.reset} type="button" className="margin-left-sm">
			Limpar
		</Button>
	</div>
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
					{renderButtonsModal(props)}
				</div>
			)}
			{...props.modalProps}
		>
			{baseCrudEdit(props)}
		</Modal>
	:
	props.initialValues != null ?
		<React.Fragment>
			<div className="padding-left-xl padding-right-xl">
				{baseCrudEdit(props)}
			</div>
			{renderButtonsFullscreen(props)}
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

const decorated = props => reduxForm()(CrudEdit);

//export default decorated;

export default reduxForm()(CrudEdit);