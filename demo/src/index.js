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
import { Dropdown, Button } from 'codeflow-react-ui';


const fakeFetch = () => {
  return new Promise((resolve, reject) => {
    const fakeData = getData();
    setTimeout(2000,  resolve({
      rows: fakeData,
      count: fakeData.length,
    }))
  });
}

const fakeFetchNoPromise = () => {
  const fakeData = getData();
  return {
    rows: fakeData,
    count: fakeData.length,
  };
}

const fakeDetailPromise = (row) => {
  return new Promise((resolve, reject) => {
    setTimeout(2000,  resolve(row))
  });
}

const fakeDetail = (row) => {
  console.log('chamou detail');
  return row;
}

const isZero = value => (value == 0 ? undefined : 'deve ser zero');

class Demo extends Component {

  render() {
    return (
      <div>
        <div className="demoRow">
          <CrudManager
              title="Testing the crud manager"
              formKey="myTestFormId"
              keyField="id"
              // editForm={EditForm}
              onCreate={() => console.log('created')}
              onRead={fakeFetchNoPromise}
              onReadDetail={fakeDetail}
              onUpdate={() => console.log('updated')}
              onDelete={() => console.log('deleted')}
              editMode="fullscreen"
              modalProps={{position: "right", style: {content: {width: '50%'}} }}
              extraActions={(item) => <Button flat hover={false}><i className="fa fa-unlock" onClick={console.log(item)}/></Button>}
            >
            <CrudMember field="id" header="Id" filterMatchMode="gte" required extraValidators={[isZero]} />
            <CrudMember field="name" header="Nome" required fieldRender={() => <Dropdown material items={['Rodrigo 0', 'Rodrigo 1']} />}/>
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
