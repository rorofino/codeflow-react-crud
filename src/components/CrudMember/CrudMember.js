import react from 'react';
import PropTypes from "prop-types";

export const CrudMember = () => null;

CrudMember.propTypes = {
	header: PropTypes.string.isRequired,
	field: PropTypes.string.isRequired,
	filterMatchMode: PropTypes.oneOf([
		"eq",
		"ne",
		"startsWith",
		"endsWith",
		"contains",
		"gt",
		"gte",
		"lt",
		"lte",
		"regexp",
		"in",
		"notIn"
	]),
	required: PropTypes.bool,
	extraValidators: PropTypes.arrayOf(PropTypes.func),
	cellRender: PropTypes.func,
	fieldRender: PropTypes.func,
};

CrudMember.defaultProps = {
	filterMatchMode: "contains"
};

export default CrudMember;