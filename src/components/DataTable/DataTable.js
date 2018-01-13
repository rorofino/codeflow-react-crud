import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";

import {Dropdown} from 'codeflow-react-ui';

import Pagination from "../Pagination/Pagination";

const footer = props => {
    return (
        <div className="codeflow-data-table__footer">
            <Dropdown primary material 
                value={props.pageSize}
                onChange={props.pageSizeChange}
                placeholder="Linhas por página"
                items={[
                    {label: '5 linhas', value: 5},
                    {label: '10 linhas', value: 10},
                    {label: '20 linhas', value: 20},
                    {label: '50 linhas', value: 50},
                    {label: '100 linhas', value: 100}
                ]}/>
            <Pagination {...props} />
        </div>
    );
};

const DataTable = (props) => (
    <ReactTable
        {...props}
        className="codeflow-data-table"
        resizable={false}
        getTheadProps={() => ({ className: "codeflow-data-table__th-row" })}
        getTrGroupProps={() => ({ className: "codeflow-data-table__tr-group" })}
        getTheadThProps={() => ({ className: "codeflow-data-table__header-cell" })}
        getTrProps={() => ({ className: "codeflow-data-table__body-row" })}
        getTdProps={() => ({ className: "codeflow-data-table__body-cell" })}
        PaginationComponent={footer}
        defaultPageSize={5}
        noDataText="A busca não retornou nenhum resultado válido"
        loadingText="Carregando..."
    />
);

DataTable.propTypes = {
    
};

DataTable.defaultProps = {

};

export default DataTable;