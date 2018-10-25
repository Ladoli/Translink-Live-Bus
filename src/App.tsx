import { Provider } from 'mobx-react'
import * as React from 'react';
import './App.css';
import Map from './components/Map';
import { busStore } from './store/busStore';
class App extends React.Component {


  public render() {
    return (
      <Provider busStore={busStore}>
        <Map />
      </Provider>
    );
  }
}

export default App;
