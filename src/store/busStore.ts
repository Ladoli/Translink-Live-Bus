import { action, observable } from 'mobx'

interface Bus {
  latitude: number
  longitude: number
}

class BusStore {
   @observable
   public busList: Bus[] = []

   @action
   public addBus(latitude: number, longitude: number) {
     this.busList.push({ latitude, longitude })
   }

}


export const busStore = new BusStore()
