import { action, observable } from 'mobx';

interface Bus {
  Destination: string
  Direction: string
  Latitude: number
  Longitude: number
  Pattern: string
  RecordedTime: string
  RouteMap: {Href: string}
  RouteNo: string
  TripId: number
  VehicleNo: string
}

class BusStore {
   @observable
   public busList: Bus[] = []

   @action
   public setBusList(newBusList: Bus[]) {
     this.busList = newBusList;
   }

}


export const busStore = new BusStore()
