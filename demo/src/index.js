import React, {Component} from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux';

import EditForm from './EditForm';

import 'codeflow-react-ui/es/main.css';
import './demo.css';
import '../../src/main.css';

import {getData} from './dataForTable';
import store from './store';

import CrudManager from '../../src/components/CrudManager/CrudManager';
import CrudMember from '../../src/components/CrudMember/CrudMember';


const fakeFetch = () => {
  return new Promise((resolve, reject) => {
    const fakeData = getData();
    setTimeout(2000,  resolve({
      rows: fakeData,
      count: fakeData.length,
    }))
  });
}

const fakeDetailPromise = (row) => {
  return new Promise((resolve, reject) => {
    setTimeout(2000,  resolve(row))
  });
}

const fakeDetail = (row) => {
  return row;
}

class Demo extends Component {

  render() {
    return (
      <div>
        <div className="demoRow">
          <CrudManager
              manual={false}
              // saveFunction={api.User.Register}
              fetchFunction={fakeFetch}
              // deleteFunction={api.User.Delete}
              keyField="id"
              uniqueFormId="myTestFormId"
              // editForm={EditForm}
              fetchItem={fakeDetail}
            >
            <CrudMember field="id" header="Id" filterMatchMode="gte" />
            <CrudMember field="name" header="Nome" />
            <CrudMember field="createdAt" header="Dt. Criação" />
          </CrudManager>
        </div>
      </div>);
  }
}


/* eslint-disable */
const MyApp = () => (
  <Provider store={store}>
    <Demo />
  </Provider>
);
/* eslint-enable */

render(<MyApp/>, document.querySelector('#demo'))
