import React from "react";
import PropTypes from "prop-types";
import debounce from 'lodash.debounce';
import { reduxForm } from "redux-form";

import {Button, Checkbox, Modal, Page, Alert}  from "codeflow-react-ui";

import CrudMember from '../CrudMember/CrudMember';
import CrudEdit from "../CrudEdit/CrudEdit";

import 'react-table/react-table.css';
import DataTable from "../DataTable/DataTable";

class CrudManager extends React.Component {
	constructor(props) {
		super(props);
		this.rowSelector = this.rowSelector.bind(this);
		this.headSelector = this.headSelector.bind(this);
		this.actionsColumn = this.actionsColumn.bind(this);
		this.toggleSelection = this.toggleSelection.bind(this);
		this.toggleAll = this.toggleAll.bind(this);
		this.onFetchDataReWrite = this.onFetchDataReWrite.bind(this);
		this.onRemoveClick = this.onRemoveClick.bind(this);
		this.onMultipleRemoveClick = this.onMultipleRemoveClick.bind(this);
		this.onSaveClick = this.onSaveClick.bind(this);
		this.onCancelClick = this.onCancelClick.bind(this);
		this.onAddClick = this.onAddClick.bind(this);
		this.deleteConfirmed = this.deleteConfirmed.bind(this);
		this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
		this.reloadData = this.reloadData;
		this.state = {
			selectedRows: [],
			selectedAll: false,
			loading: false,
			data: props.data || [],
			pages: 0,
			pageSize: 10,
			page: 0,
			sorted: undefined,
			filtered: undefined,
			totalCount: 0,
			editingItem: undefined,
			deleting: false,
			columns: this.getColumns(),
			deletingItems: [],
			filtrable: false
		};
	}
	
	onFetchDataReWrite(state) {
		const { pageSize, page, sorted, filtered } = state;
		const reWritedFilters = filtered.map(filter => {
			const column = state.columns.filter(c => c.accessor === filter.id)[0];
			return { ...filter, filterMatchMode: column.filterMatchMode };
		});
		this.setState(
			{ pageSize, page, sorted, filtered: reWritedFilters },
			this.reloadData
		);
	}

	onRemoveClick(item) {
		this.setState({ deletingItems: [].concat(item) });
	}

	onMultipleRemoveClick() {
		if (this.state.selectedAll) {
			this.setState({deletingItems: this.state.data});
		} else {
			const items = this.state.data.filter(item => this.state.selectedRows.indexOf(item.id) > -1);
			this.setState({deletingItems: items});
		}
	}

	async onSaveClick(item) {
		await this.props.saveFunction(item);
		this.reloadData();
		this.setState({ editingItem: undefined });
	}

	onCancelClick() {
		this.setState({ editingItem: undefined });
	}
	onAddClick() {
		this.setState({ editingItem: {} });
	}

	getColumns() {
		const columns = [];
		const elementColumns = React.Children.toArray(this.props.children);
		elementColumns.forEach(element => {
			columns.push({
				Header: () => (<div><span>{element.props.header}</span><i style={{marginLeft: 5}} className="fa fa-sort" /></div>),
				accessor: element.props.field,
				filterMatchMode: element.props.filterMatchMode,
				className: element.props.className
			});
		});
		const select = {
			id: "_selector",
			accessor: () => "x",
			Header: this.headSelector,
			Cell: ci => this.rowSelector(ci.original),
			width: 50,
			filterable: false,
			sortable: false,
			resizable: false,
		};
		const actions = {
			id: "_actions",
			accessor: () => "x2",
			Header: "Ações",
			Cell: ci => this.actionsColumn(ci),
			width: 70,
			filterable: false,
			sortable: false,
			resizable: false,
		};
		return [select, ...columns, actions];
	}

	handlePageSizeChange(pageSize) {
		this.setState({pageSize: pageSize.value}, this.reloadData);
	}

	async reloadData() {
		if (this.props.fetchFunction) {
			this.setState({ loading: true });
	
			const data = await this.props.fetchFunction(
				this.state.pageSize,
				this.state.page,
				this.state.sorted,
				this.state.filtered
			);
	
			this.setState({
				data: data.rows,
				pages: Math.ceil(data.count / this.state.pageSize),
				totalCount: data.count,
				loading: false
			});
		}
	}

	actionsColumn(row) {
		return (
			<div className="actionsColumn">
				<Button
					primary flat hover={false}
					className="codeflow-crud-manager__action-button"
					onClick={() => this.handleEditClick(row.original)}
				>
					<i className="fa fa-pencil" />
				</Button>
				<Button 
					danger flat hover={false} className="codeflow-crud-manager__action-button" 
					onClick={() => this.onRemoveClick(row.original)}>
					<i className="fa fa-times" />
				</Button>
			</div>
		);
	}

	selectAll() {
		this.setState({ selectedRows: [] });
	}

	toggleSelection(key) {
		const keyIndex = this.state.selectedRows.indexOf(key);
		if (keyIndex >= 0) {
			this.setState({
				selectedRows: this.state.selectedRows.filter(item => item !== key)
			});
		} else {
			this.setState({ selectedRows: this.state.selectedRows.concat(key) });
		}
	}

	isSelected(key) {
		return (
			this.state.selectedRows.filter(item => item === key).length > 0 ||
			this.state.selectedAll
		);
	}

	headSelector() {
		return (
			<Checkbox
				value={this.state.selectedAll}
				onClick={e => {
					e.stopPropagation();
					this.toggleAll();
				}}
			/>
		);
	}

	toggleAll() {
		this.setState({ selectedAll: !this.state.selectedAll });
	}

	rowSelector(row) {
		const checked = this.isSelected(row[this.props.keyField]);
		return (
			<Checkbox
				value={checked}
				onClick={e => {
					const { shiftKey } = e;
					e.stopPropagation();
					this.toggleSelection(row[this.props.keyField], shiftKey, row);
				}}
			/>
		);
	}

	handleEditClick(row) {
		if (this.props.fetchItem) {
			Promise.resolve(this.props.fetchItem(row)).then(item => {
				this.setState({ editingItem: item });
			});
		} else {
			this.setState({ editingItem: row });
		}
	}

	async deleteConfirmed() {
		this.setState({deleting: true});
		await this.props.deleteFunction(this.state.deletingItems);
		this.reloadData();
		this.setState({deleting: false, deletingItems: []});
	}

	render() {
		return (
			<Page className="dataTable">
				<div className="titleBar">
					<div className="titleBarLeft">Data Table de Usuarios</div>
					<div className="titleBarRight">
						<Button className="codeflow-crud-manager__title-button" circle outline primary>
							<i className="fa fa-file" />
						</Button>
						<Button className="codeflow-crud-manager__title-button" circle outline primary onClick={()=>this.setState({filtrable: !this.state.filtrable})}>
							<i className="fa fa-filter" />
						</Button>
						<Button className="codeflow-crud-manager__title-button" circle outline primary onClick={this.onAddClick} >
							<i className="fa fa-plus" />
						</Button>
						<Button className="codeflow-crud-manager__title-button" circle outline primary onClick={this.onMultipleRemoveClick} disabled={this.state.selectedRows.length < 1 && !this.state.selectedAll}>
							<i className="fa fa-times" />
						</Button>
					</div>
				</div>
				<div className="datatable-content-body">
					<DataTable
						filterable={this.state.filtrable}
						resizable={false}
						data={this.state.data}
						onFetchData={this.onFetchDataReWrite}
						pages={this.state.pages}
						columns={this.state.columns}
						totalCount={this.state.totalCount}
						pageSize={this.state.pageSize}
						loading={this.state.loading}
						pageSizeChange={this.handlePageSizeChange}
					/>
				</div>
				<Modal
					isOpen={this.state.editingItem != null}
					className={this.props.editModalClassName}
					icon="fa fa-user"
				>
					<CrudEdit
						form={this.props.uniqueFormId}
						initialValues={this.state.editingItem}
						editForm={this.props.editForm}
						members={React.Children.toArray(this.props.children)}
						onSave={this.onSaveClick}
						onCancel={this.onCancelClick}
					/>
				</Modal>
				
				<Alert isOpen={this.state.deletingItems.length > 0}
					danger
					title="Remover item"
					confirmButtonLabel="Sim, remover"
					dismissButtonLabel="Não, manter"
					onConfirm={this.deleteConfirmed}
					onDismiss={() => this.setState({deletingItems: []})}
				>
					{this.state.selectedRows.length > 1 ? (
						<p>
							Deseja realmente remover os {this.state.selectedRows.length} itens selecionados ?
						</p>
					) : (
						<p>Deseja realmente remover esse registro ?</p>
					)}
				</Alert>
			</Page>
		);
	}
}

export default CrudManager;