import {action, makeObservable, observable} from 'mobx'

export class RoomInfo{
  defaultBackgroundFill = [0xDF, 0xDB, 0xE5]
  defaultBackgroundColor = [0xB9, 0xB2, 0xC4]
  
  @observable roomProps = new Map<string, string>()
  @observable password=''
  @observable newPassword=''
  @observable passMatched=false
  @observable backgroundFill = [0xFF, 0xFF, 0xFF]
  @observable backgroundColor = [0xFF, 0xFF, 0xFF]
  @observable backgroundLeftFill = [0xFF, 0xCC, 0xFF]

  constructor() {
    makeObservable(this)
  }
  @action onUpdateProp(key:string, val:string){
    switch(key){
      case 'backgroundFill': this.backgroundFill = JSON.parse(val); break
      case 'backgroundColor': this.backgroundColor = JSON.parse(val); break
      case 'backgroundLeftFill': this.backgroundLeftFill = JSON.parse(val); break
    }
  }
}

export default new RoomInfo()
