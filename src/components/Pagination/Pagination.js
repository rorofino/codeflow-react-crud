import React from 'react';
import RCPagination from "rc-pagination";

import "rc-pagination/assets/index.css";

const Pagination = (props) => {
	const { page, pageSize, onPageChange } = props;
	const totalCount = props.manual ? props.totalCount : (props.pages * pageSize);
	return (
	<div className="codeflow-pagination">
		<RCPagination
			total={totalCount}
			current={page + 1}
			pageSize={pageSize}
			className="codeflow-pagination__paginator"
			showTitle={false}
			onChange={internalPage => onPageChange(internalPage - 1)}
		/>
	</div>
); }

export default Pagination;