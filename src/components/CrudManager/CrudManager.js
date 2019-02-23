import React from "react";
import PropTypes from "prop-types";
import debounce from 'lodash.debounce';
import { reduxForm } from "redux-form";

import {Button, Checkbox, Modal, Page, Alert, TextInput, Breadcrumb}  from "codeflow-react-ui";

import CrudMember from '../CrudMember/CrudMember';
import CrudEdit from "../CrudEdit/CrudEdit";

import 'react-table/react-table.css';
import DataTable from "../DataTable/DataTable";

class CrudManager extends React.Component {
	constructor(props) {
		super(props);
		this.rowSelector = this.rowSelector.bind(this);
		this.headSelector = this.headSelector.bind(this);
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
		this.handleEditClick = this.handleEditClick.bind(this);
		this.state = {
			selectedRows: [],
			selectedAll: false,
			loading: false,
			data: props.data || [],
			pages: 0,
			pageSize: 100,
			page: 0,
			sorted: undefined,
			filtered: undefined,
			totalCount: 0,
			editingItem: undefined,
			columns: this.getColumns(),
			deletingItems: [],
			filterable: false,
			inserting: false 
		};
	}
	
	onFetchDataReWrite(state) {
		const { pageSize, page, sorted, filtered } = state;
		const reWritedFilters = filtered.map(filter => {
			const column = state.columns.find(c => c.accessor === filter.id);
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
		if (this.state.inserting) {
			await Promise.resolve(this.props.onCreate(item));
		} else {
			await Promise.resolve(this.props.onUpdate(item));
		}
		this.setState({ editingItem: undefined, inserting: false }, this.reloadData);
	}

	onCancelClick() {
		this.setState({ editingItem: undefined, inserting: false });
	}
	onAddClick() {
		this.setState({ editingItem: {}, inserting: true });
	}

	getColumns() {
		const columns = React.Children.map(this.props.children, element => {
			let col = {
				Header: () => (<div><span>{element.props.header}</span><i className="fa fa-sort margin-left-sm" /></div>),
				accessor: element.props.field,
				filterMatchMode: element.props.filterMatchMode,
				className: element.props.className,
				Filter: ({ filter, onChange }) => {
					if (element.props.fieldRender) {
						return React.cloneElement(element.props.fieldRender(), {onChange, value: filter? filter.value : ""});
					} else {
						return <TextInput onChange={(e) => onChange(e.target.value)} value={filter? filter.value : ""} />
					}
				}
			};
			return col;
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

		return [select, ...columns];
	}

	handlePageSizeChange(pageSize) {
		this.setState({pageSize: pageSize.value}, this.reloadData);
	}

	async reloadData() {
		if (this.props.onRead) {
			this.setState({ loading: true });
	
			const data = await Promise.resolve(this.props.onRead(
				this.state.pageSize,
				this.state.page,
				this.state.sorted,
				this.state.filtered
			));
	
			this.setState({
				data: data.rows,
				pages: Math.ceil(data.count / this.state.pageSize),
				totalCount: data.count,
				loading: false
			});
		}
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
		if (this.props.onReadDetail) {
			Promise.resolve(this.props.onReadDetail(row)).then(item => {
				this.setState({ editingItem: item });
			});
		} else {
			this.setState({ editingItem: row });
		}
	}

	async deleteConfirmed() {
		if (this.props.enableDelete) {
			await Promise.resolve(this.props.onDelete(this.state.deletingItems));
			this.reloadData();
			this.setState({deletingItems: []});
		}
	}

	render() {
		const editingFullscreen = this.state.editingItem && this.props.editMode === MODE_FULLSCREEN;
		return (
			<Page>
				<div className="codeflow-crud-manager__title-box">
					{ !editingFullscreen ?
						<React.Fragment>
							<div className="codeflow-crud-manager__title-left">{this.props.title}</div>
							<div>
								{ this.props.enableFilter ?
									<Button className="codeflow-crud-manager__title-button" circle outline primary onClick={()=>this.setState({filterable: !this.state.filterable})}>
										<i className="fa fa-filter" />
									</Button>
									: null 
								}
								{ this.props.enableCreate ?
									<Button className="codeflow-crud-manager__title-button" circle outline primary onClick={this.onAddClick} >
										<i className="fa fa-plus" />
									</Button>
									: null
								}
								{ this.props.enableDelete ?
									<Button className="codeflow-crud-manager__title-button" circle outline primary onClick={this.onMultipleRemoveClick} disabled={this.state.selectedRows.length < 1 && !this.state.selectedAll}>
										<i className="fa fa-times" />
									</Button>
									: null
								}
							</div>
						</React.Fragment>
					: (
						<div>
							<Breadcrumb>
								{ this.props.title }
								Editando
							</Breadcrumb> 
						</div>
					)
				}
				</div>
				<div className="codeflow-crud-manager__body">
					{ editingFullscreen ?
						null
					:
						<DataTable
							filterable={this.state.filterable}
							resizable={false}
							data={this.state.data}
							onFetchData={this.onFetchDataReWrite}
							columns={this.state.columns}
							totalCount={this.state.totalCount}
							pageSize={this.state.pageSize}
							loading={this.state.loading}
							pageSizeChange={this.handlePageSizeChange}
							onEditClick={this.handleEditClick}
							onRemoveClick={this.onRemoveClick}
							extraActions={this.props.extraActions}
							enableUpdate={this.props.enableUpdate}
							enableDelete={this.props.enableDelete}
						/>
					}
					{this.state.editingItem 
						?	<CrudEdit
								form={this.props.formKey}
								initialValues={this.state.editingItem}
								editForm={this.props.editForm}
								members={React.Children.toArray(this.props.children)}
								onSave={this.onSaveClick}
								onCancel={this.onCancelClick}
								modalProps={this.props.modalProps}
								editMode={this.props.editMode}
								title={this.props.title}
							/>
						:	null 
					}
				</div>
			
				<Alert isOpen={this.state.deletingItems.length > 0}
					danger
					title="Remover item"
					confirmButtonLabel="Sim, remover"
					dismissButtonLabel="Não, manter"
					onConfirm={this.deleteConfirmed}
					onDismiss={() => this.setState({deletingItems: []})}
				>
					{this.state.selectedRows.length > 1 ? (
						<p className="margin-top-md">
							Deseja realmente remover os {this.state.selectedRows.length} itens selecionados ?
						</p>
					) : (
						<p className="margin-top-md">Deseja realmente remover esse registro ?</p>
					)}
				</Alert>
			</Page>
		);
	}
}

const MODE_MODAL = "modal";
const MODE_INLINE = "inline";
const MODE_FULLSCREEN = "fullscreen";

CrudManager.propTypes = {
	formKey: PropTypes.string.isRequired,
	keyField: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	onCreate: PropTypes.func,
	onRead: PropTypes.func.isRequired,
	onUpdate: PropTypes.func.isRequired,
	onDelete: PropTypes.func,
	onReadDetail: PropTypes.func,
	extraActions: PropTypes.func,
	editForm: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
	clientPagination: PropTypes.bool,
	editMode: PropTypes.oneOf([MODE_MODAL, MODE_INLINE, MODE_FULLSCREEN]),
	enableCreate: PropTypes.bool,
	enableUpdate: PropTypes.bool,
	enableDelete: PropTypes.bool,
	enableFilter: PropTypes.bool,
	modalProps: PropTypes.object,

	editValidation: (props) => {
		if (props.enableCreate && !props.onCreate)
			return new Error('You must provide a handler for onCreate if enableCreate is true');
		if (props.enableDelete && !props.onDelete)
			return new Error('You must provide a handler for onDelete if enableDelete is true');
		if (props.enableDelete && !props.onDelete)
			return new Error('You must provide a handler for onUpdate if enableUpdate is true');
	},

	modeValidation: (props) => {
		if (props.modalProps && props.editMode !== MODE_MODAL)
			return new Error(`Modal props are only valid for editMode ${MODE_MODAL}`);
	}
};

CrudManager.defaultProps = {
	clientPagination: true,
	editMode: MODE_MODAL,
	enableCreate: true,
	enableUpdate: true,
	enableDelete: true,
	enableFilter: true,
};

export default CrudManager;
