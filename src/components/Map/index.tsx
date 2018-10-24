import axios from 'axios';
import {fromJS} from 'immutable';
import { isEmpty, map } from 'lodash';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ReactMapGL,{ Marker } from 'react-map-gl';
import { Button } from 'semantic-ui-react';
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
    busses: [{Latitude: 0, Longitude: 0}],
    busRouteDisplayed: true
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

    public toggleBusRoute = () =>{
      if(this.state.busRouteDisplayed){
        this.setState({busRouteDisplayed:false});
      }else{
        this.setState({busRouteDisplayed:true});
      }
    }

    public render() {
        this.toggleBusRoute = this.toggleBusRoute.bind(this);
        const busList = this.injected.busStore.getBusList;
        const { viewport } = this.state;
        if(isEmpty(busList)){
          return (
            <div style={{width: "100%",textAlign: "center", paddingTop: "10%"}}>
              <div style={{display: "inline-block"}}>
                <div className="viLoader"/>
                <h1 className="fader">Loading...</h1>
              </div>
            </div>
          )
        }

        return (
          <div>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                onViewportChange={(v: Viewport) => this.updateViewport(v)}
                mapStyle={mapStyle}
            >
            {
              map(busList,(value,key)=>{
                    return (<Marker key={key} latitude={value.Latitude} longitude={value.Longitude}>
                      <div className="marker">
                        { this.state.busRouteDisplayed && (
                          <div className="markerBusInfo">{value.RouteNo}</div>
                          )
                        }
                      </div>
                    </Marker>);
                })
            }
            </ReactMapGL>
            <div className="mapOptionsControlBar">
              <div className="flexCenterAll" style={{width:"100%", height: "100%"}}>
                <Button onClick={this.toggleBusRoute} compact={true} color="blue" className="mapMenuButton">Toggle Bus Route Display</Button>
              </div>
            </div>
          </div>

        );
    }
}

export default Map;
