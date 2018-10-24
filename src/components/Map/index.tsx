import axios from 'axios';
import {fromJS} from 'immutable';
import { isEmpty, map } from 'lodash';
import * as React from 'react';
import ReactMapGL,{ Marker } from 'react-map-gl';
import { MAPBOX_TOKEN } from '../../config/api_keys.js';
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



type State = typeof initialState;
type Viewport = typeof initialState.viewport;

export default class Map extends React.Component<{}, State> {
    public state: State = initialState;

    public interval:any;


    public getBusData(){
      const that = this;
      axios.get("http://localhost:5000", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        that.setState({"busses": res.data});
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
      }, 5000);
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
        const { viewport } = this.state;

        if(isEmpty(this.state.busses)){
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
              map(this.state.busses,(value,key)=>{
                    return (<Marker key={key} latitude={value.Latitude} longitude={value.Longitude}>
                      <div className="marker"/>
                    </Marker>);
                })
            }
            </ReactMapGL>
        );
    }
}
