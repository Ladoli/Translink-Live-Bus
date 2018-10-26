import axios from 'axios';
import {fromJS} from 'immutable';
import { isEmpty, map } from 'lodash';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ReactMapGL,{ Marker } from 'react-map-gl';
import { Button, Icon, Input } from 'semantic-ui-react';
import { BUS_REFRESH_INTERVAL, MAPBOX_TOKEN, NODE_API_LINK } from '../../config/config.js';
import { busStore } from '../../store/busStore';
import Toast from '../Toast';
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
    busRouteDisplayed: false,
    filteredRoute: "",
    filterRouteInputField: "",
    errorMessages: "",
    location: {Latitude: 0, Longitude: 0},
    filtering: false
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
      let routeFilter = "";
      if(this.state.filterRouteInputField){
        routeFilter = "?route="+this.state.filterRouteInputField;
      }
      axios.get(NODE_API_LINK + routeFilter, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        if(res.data.Code){
          this.setState({errorMessages: res.data.Message});
        }else{
          if(res.data.query === this.state.filteredRoute){
            this.injected.busStore.setBusList(res.data.busList);
            this.setState({
              errorMessages: "",
              filtering: false
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });

    }

    public componentWillMount() {
      this.toggleBusRoute = this.toggleBusRoute.bind(this);
      this.getBusData = this.getBusData.bind(this);
      this.getBusData();
      const that = this;
      if (navigator.geolocation) {
          navigator.geolocation.watchPosition((position)=>{
            that.setState({
              location: {Latitude: position.coords.latitude, Longitude: position.coords.longitude}
            })
          });
      }
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
        const busList = this.injected.busStore.getBusList;
        const { viewport, errorMessages, busRouteDisplayed, filterRouteInputField, location, filtering } = this.state;
        if(isEmpty(busList)){
          return (
            <div style={{width: "100%",textAlign: "center", paddingTop: "90px"}}>

              <Toast message="Loading taking a while? Our Heroku Node Server is probably waking up!" />

              <div style={{display: "inline-block", marginTop: "80px"}}>
                <div className="viLoader"/>
                <h1 className="fader">Loading...</h1>
              </div>
            </div>
          )
        }
        return (
          <div>
            <div className="mapContainer">
              <ReactMapGL
                  {...viewport}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  onViewportChange={(v: Viewport) => this.updateViewport(v)}
                  mapStyle={mapStyle}
                  className="displayMap"
              >
              {
                map(busList,(value,key)=>{
                      return (<Marker key={key} latitude={value.Latitude} longitude={value.Longitude}>
                        <div className="marker">
                          { busRouteDisplayed && (
                            <div className="markerBusInfo">{value.RouteNo}</div>
                            )
                          }
                        </div>
                      </Marker>);
                  })
              }
              {
                location && (
                  <Marker latitude={location.Latitude} longitude={location.Longitude}>
                    <div className="locationMarkerEmphasis flexCenterAll">
                      <div className="locationMarker"/>
                    </div>
                  </Marker>
                )
              }
              </ReactMapGL>
            </div>
            {
              !isEmpty(errorMessages) && (
                <Toast message={errorMessages} error={true}/>
              )
            }
            {
              filtering && (
                <div style={{display: "inline-block", top: "90px", position: "fixed", width: "100%", textAlign: "center"}}>
                  <div className="viLoader"/>
                  <h1 className="fader">Loading...</h1>
                </div>
              )
            }
            <div className="mapOptionsControlBar">
              <div className="flexCenterAll" style={{width:"100%", height: "100%"}}>
                <div>
                  <Button onClick={this.toggleBusRoute} compact={true} color="blue" className="mapMenuItem">Toggle Bus Route Display</Button>
                  <div className="mapMenuItem">
                    <Input
                      className="mapMenuItem"
                      focus={true}
                      placeholder='Filter by Bus Route'
                      onChange={(e)=>{
                        this.setState({filterRouteInputField: e.target.value})
                      }}
                      value={this.state.filterRouteInputField}
                     />
                    <Button
                      className="iconButton"
                      color='green'
                      onClick={()=>{
                        this.setState({
                          filteredRoute: filterRouteInputField,
                          "filtering": true
                        });
                        this.getBusData();
                      }
                      }>
                      <Icon className="fieldIcon" name='search' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default Map;
