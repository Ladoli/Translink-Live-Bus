import axios from 'axios';
import {fromJS} from 'immutable';
import { isEmpty, map } from 'lodash';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ReactMapGL,{ Marker } from 'react-map-gl';
import { BUS_REFRESH_INTERVAL, MAPBOX_TOKEN, NODE_API_LINK } from '../../config/config.js';
import { busStore } from '../../store/busStore';
import './map.css';
import mapStyleJson from './mapStyle.js';

const mapStyle = fromJS(mapStyleJson);

const initialState = {
    viewport: {
        height: 400,
        latitude: 49.254404,
        longitude: -123.120994,
        width: 400,
        zoom: 11,
    },
    busses: [{Latitude: 0, Longitude: 0}]
};

interface InjectedProps {
  busStore: typeof busStore
}

type State = typeof initialState;
type Viewport = typeof initialState.viewport;

@inject("busStore")
@observer
class Map extends React.Component<{}, State> {
    public state: State = initialState;

    public interval:any;
    get injected() {
      return this.props as InjectedProps;
    }

    public getBusData(){
      axios.get(NODE_API_LINK, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        this.injected.busStore.setBusList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
    }

    public componentWillMount() {
      this.getBusData();
    }

    public componentDidMount() {
      const that = this;
      this.interval = setInterval(() => {
        that.getBusData()
      }, BUS_REFRESH_INTERVAL);
      window.addEventListener('resize', this.resize);
      this.resize();
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
        clearInterval(this.interval);
    }

    public updateViewport = (viewport: Viewport) => {
        this.setState(prevState => ({
            viewport: { ...prevState.viewport, ...viewport },
        }));
    };

    public resize = () => {
        this.setState(prevState => ({
            viewport: {
                ...prevState.viewport,
                height: window.innerHeight,
                width: window.innerWidth,
            },
        }));
    };

    public render() {
        const busList = this.injected.busStore.getBusList;
        const { viewport } = this.state;
        if(isEmpty(busList)){
          return <div>Loading</div>
        }

        return (
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                onViewportChange={(v: Viewport) => this.updateViewport(v)}
                mapStyle={mapStyle}
            >
            {
              map(busList,(value,key)=>{
                    return (<Marker key={key} latitude={value.Latitude} longitude={value.Longitude}>
                      <div className="marker"/>
                    </Marker>);
                })
            }
            </ReactMapGL>
        );
    }
}

export default Map;
