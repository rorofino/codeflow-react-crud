import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import cc from 'classcat';

import {Dropdown, Button} from 'codeflow-react-ui';

import Pagination from "../Pagination/Pagination";

const footer = props => {
    return (
        <div className="codeflow-data-table__footer">
            <Dropdown className="codeflow-data-table__rowNumber"
                primary material 
                value={props.pageSize}
                onChange={props.pageSizeChange}
                placeholder="Qtd linhas"
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

const actionsColumn = (props, row) => {
    return (
        <div className="codeflow-data-table__action-column">
            {props.extraActions ? props.extraActions(row.original) : null}
            { props.enableUpdate ?
                <Button
                primary flat hover={false}
                className="codeflow-data-table__action-button"
                onClick={() => props.onEditClick ? props.onEditClick(row.original) : undefined }
                >
                    <i className="fa fa-pencil" />
                </Button>
                : null
            }
            { props.enableDelete ?
                <Button 
                danger flat hover={false} className="codeflow-data-table__action-button" 
                onClick={() => props.onRemoveClick ? props.onRemoveClick(row.original) : undefined }>
                    <i className="fa fa-times" />
                </Button>
                : null
            }
        </div>
    );
}

const actions = (props) => ({
    id: "_actions",
    accessor: () => "x",
    Header: "Ações",
    Cell: ci => actionsColumn(props, ci),
    width: 70,
    filterable: false,
    sortable: false,
    resizable: false,
});

const DataTable = (props) => {
    const actionsCol = actions(props);
    const finalColumns = [...props.columns, actionsCol];
    return (
        <ReactTable
            {...props}
            columns={finalColumns}
            className="codeflow-data-table"
            resizable={false}
            getTheadProps={() => ({ className: "codeflow-data-table__th-row" })}
            getTrGroupProps={() => ({ className: "codeflow-data-table__tr-group" })}
            getTheadThProps={() => ({ className: cc(["codeflow-data-table__header-cell", {"codeflow-data-table__header-cell--filtering": props.filterable}]) })}
            getTheadFilterThProps={() => ({ className: "codeflow-data-table__filter-cell" })}
            getTrProps={() => ({ className: "codeflow-data-table__body-row" })}
            getTdProps={() => ({ className: "codeflow-data-table__body-cell" })}
            PaginationComponent={footer}
            defaultPageSize={5}
            noDataText="A busca não retornou nenhum resultado válido"
            loadingText="Carregando..."
        />
    );
}
DataTable.propTypes = {
    
};

DataTable.defaultProps = {
	enableUpdate: true,
	enableDelete: true,
};

export default DataTable;