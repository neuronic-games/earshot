import {PARTICIPANT_SIZE} from '@models/Participant'
import {Pose3DAudio, convertToAudioCoordinate} from '@models/utils'
import {mulV3, normV} from '@models/utils/coordinates'
import errorInfo from '@stores/ErrorInfo'
import {ConfigurableParams, ConfigurableProp} from './StereoParameters'
import contents from '@stores/sharedContents/SharedContents'
//import { participants } from '@stores/'
//import {useStore} from '@hooks/MapStore'
import participants from '@stores/participants/Participants'


export function setAudioOutputDevice(audio: HTMLAudioElement, deviceId: string) {
  const audioEx:any = audio
  if (audioEx.setSinkId) {
    audioEx.setSinkId(deviceId).then(
      () => {
        //  console.debug('audio.setSinkId:', deviceId, ' success')
      },
    ).catch(
      () => { console.warn('audio.setSinkId:', deviceId, ' failed') },
    )
  }
}


// NOTE Set default value will change nothing. Because value will be overwrite by store in ConnectedGroup
/*
const DEFAULT_PANNER_NODE_CONFIG: Partial<PannerNode> & {refDistance: number} = {
  panningModel: 'HRTF',
  distanceModel: 'inverse',
  refDistance: PARTICIPANT_SIZE,
  maxDistance: 10000,
  rolloffFactor: 1,
  coneInnerAngle: 45,
  coneOuterAngle: 360,
  coneOuterGain: 0,
}
*/
export const BROADCAST_DISTANCE = 100000

export type PlayMode = 'Context' | 'Element' | 'Pause'



export class NodeGroup {
  private sourceNode: MediaStreamAudioSourceNode | undefined = undefined
  private audioElement: HTMLAudioElement | undefined = undefined

  private readonly gainNode: GainNode
  private readonly pannerNode: PannerNode
  private readonly destination: MediaStreamAudioDestinationNode

  private readonly context: AudioContext
  private playMode: PlayMode|undefined
  private audioDeviceId = ''
  private distance = 1

  constructor(context: AudioContext, destination: MediaStreamAudioDestinationNode,
              playMode: PlayMode|undefined, audibility: boolean) {
    this.context = context
    this.destination = destination

    this.gainNode = this.createGainNode(context)
    this.pannerNode = this.createPannerNode(context)

    this.gainNode.connect(this.pannerNode)
    this.pannerNode.connect(this.destination)

    this.playMode = playMode
    this.updateAudibility(audibility)
  }

  interval:NodeJS.Timeout|undefined = undefined
  setPlayMode(playMode: PlayMode|undefined) {
    this.playMode = playMode

    switch (playMode) {
      case 'Pause': {
        this.sourceNode?.disconnect()
        /*try {
          this.pannerNode.disconnect(this.destination)
        }catch (e) {}*/

        if (this.interval) {
          clearInterval(this.interval)
          this.interval = undefined
        }
        if (this.audioElement) {
          this.audioElement.pause()
        }
        break
      }
      case 'Context': {
        this.sourceNode?.connect(this.gainNode)
        //  this.pannerNode.connect(this.destination)
        if (this.interval) {
          clearInterval(this.interval)
          this.interval = undefined
        }
        if (this.audioElement) {
          this.audioElement.pause()
        }
        break
      }
      case 'Element': {
        this.sourceNode?.disconnect()
        /*try {
          this.pannerNode.disconnect(this.destination)
        }catch (e) {}*/

        if (!this.audioElement) {
          this.audioElement = this.createAudioElement()
        }
        this.audioElement.muted = false
        if (!this.interval) {
          this.interval = setInterval(
            () => {
              if (!errorInfo.type) {
                this?.audioElement?.play().then(() => {
                  //  console.warn(`Succeed to play in NodeGroup`)
                  if (this.interval) {
                    clearInterval(this.interval)
                    this.interval = undefined
                  }
                }).catch(reason => {
                  //  console.warn(`Failed to play in NodeGroup reason:${reason}`)
                })
              }
            },
            500,
          )
        }
        break
      }
      default:
        console.error(`Unknown output: ${playMode}`)
        break
    }

    this.updateAudibility(this.audibility)
    this.updateVolume()
  }

  setAudioOutput(id: string) {
    if (this.audioDeviceId !== id) {
      this.audioDeviceId = id
      if (this.audioElement) {
        setAudioOutputDevice(this.audioElement, this.audioDeviceId)
      }
    }
  }

  updateStream(stream: MediaStream | undefined) {
    this.updateSourceStream(stream)
    this.setPlayMode(this.playMode)
  }

  updatePose(pose: Pose3DAudio) {
    const participant_pose = pose
    const dist = normV(pose.position)

    const mul = ((dist * dist) / (this.pannerNode.refDistance * this.pannerNode.refDistance)
      + this.pannerNode.refDistance - 1) / (dist ? dist : 1)
    this.distance = mul * dist

    if (this.pannerNode.positionX && this.pannerNode.orientationX) {
      this.pannerNode.positionX.setValueAtTime(mul * pose.position[0], this.context.currentTime)
      this.pannerNode.positionY.setValueAtTime(mul * pose.position[1], this.context.currentTime)
      this.pannerNode.positionZ.setValueAtTime(mul * pose.position[2], this.context.currentTime)
      this.pannerNode.orientationX.setValueAtTime(pose.orientation[0], this.context.currentTime)
      this.pannerNode.orientationY.setValueAtTime(pose.orientation[1], this.context.currentTime)
      this.pannerNode.orientationZ.setValueAtTime(pose.orientation[2], this.context.currentTime)
    }else {
      this.pannerNode.setPosition(...mulV3(mul, pose.position))
      this.pannerNode.setOrientation(...pose.orientation)
    }
    this.updateVolume()
    //this.updateVolumeWithAssets(participant_pose)
  }
  private getContentsStatus(_x: number, _y:number) {
    
    let _status = 0
    //console.log(contents.all, " all content")
    let cLength = contents.all.length
    let cWidth = 0
    let cHeight = 0
    let xUpdated = 0
    let yUpdated = 0

    let xDiff = 0
    let yDiff = 0
    let wDiff = 0
    let hDiff = 0
    //let found = false

    let xPos = _x
    let yPos = _y
    
    
    /*let wDiff = 0;
    let hDiff = 0;
    let _XX = _x */

    if(_x < 0) {
      xUpdated = (_x + 190) * -1
      
    } else {
      xUpdated = (_x - 190) * -1
    }

    if(_y < 0) {
      yUpdated = _y - 30 //(_y + 50) * -1
    } else {
      yUpdated = _y - 35 //(_y - 50) * -1
    }


    _x = (_x + 30) * - 1
    _y = (_y - 30)

    let xD = (_x - 100)
    let yD = (_y - 100)
    
    //participants.local.setPhysics({inProximity: false})

    

    //console.log(contents.all)
    for (let i=0; i<cLength; i++) {


      
      
      //participants.local.savePhysicsToStorage(false)
      

      

      wDiff = ((contents.all[i].pose.position[0] + contents.all[i].size[0]) + 100)
      hDiff = ((contents.all[i].pose.position[1] + contents.all[i].size[1]) + 100)

      xDiff = contents.all[i].pose.position[0] - 200
      yDiff = contents.all[i].pose.position[1] - 200

      //if(xUpdated >= xDiff && xUpdated < wDiff && yUpdated >= yDiff && yUpdated <= hDiff) {
        //if(contents.all[i].proximity === true) {
        
        //if(xUpdated >= xDiff && xUpdated < wDiff && yUpdated >= yDiff && yUpdated <= hDiff) {

        

          cWidth = ((contents.all[i].pose.position[0] + contents.all[i].size[0]) - 50)
          cHeight = ((contents.all[i].pose.position[1] + contents.all[i].size[1]) - 60)

          let cPose = convertToAudioCoordinate(contents.all[i].pose)
          //let cPose = (contents.all[i].pose)

          
      
          //console.log(_y, " DISTANCE Content ", cPose.position[2])

          //console.log(_x, " -- ", cPose, " -------- ", contents.all[i].pose)


          // , " -- y user", (yPos + 475), " -- y content ", cPose.position[2]
          //console.log((xPos + 30) * -1, " <- x user : x content -> ", cPose.position[0])
          //console.log((yPos - 30), " <- y user : y content -> ", (cPose.position[2] * -1))

        console.log(participants.local.pose.orientation, "---" , contents.all[i].pose.orientation)

        let _valueX = 0
        let _valueY = 0
        let _valueW = 0
        if(participants.local.pose.orientation < 0) {
          //_valueX = (xPos +  participants.local.pose.orientation) + 60
          //_valueY = (yPos -  (participants.local.pose.orientation * -1) - 60)
          //_valueW = (((contents.all[i].pose.position[0] + contents.all[i].size[0])) - 60)
        } else {
          //_valueX = (xPos -  participants.local.pose.orientation) + 60
          //_valueY = (yPos +  (participants.local.pose.orientation * -1) - 60)
          //_valueW = (((contents.all[i].pose.position[0] + contents.all[i].size[0])) - 60)
        }
        
        //_valueX = (xPos - (participants.local.pose.orientation)) - 60

        //console.log(xPos * -1 , " - X : CX -", contents.all[i].pose.position[0], " :: W -> ", _valueW)
        //console.log(yPos, " - Y : CY -", contents.all[i].pose.position[1])

        //console.log((((xPos +  ) + 60)), "--" , cPose.position[0], "::", yPos, " -- ", contents.all[i].pose.position[1])

          /* let diffX = ((xPos + 30) * - 1)
          let diffY = (yPos - 30)
          let xContent = cPose.position[0]
          let yContent = (cPose.position[2] * -1)

          let  cW1 = ((cPose.position[0] + contents.all[i].size[0])) - 60
          let  cH1 = (((cPose.position[2] * -1) + contents.all[i].size[1])) - 60 */
          let diffX = ((xPos + 30) * - 1)
          let diffY = (yPos - 30)
          let xContent = contents.all[i].pose.position[0]
          let yContent = (contents.all[i].pose.position[1])

          let  cW1 = ((contents.all[i].pose.position[0] + contents.all[i].size[0])) - 60
          let  cH1 = (((contents.all[i].pose.position[1]) + contents.all[i].size[1])) - 60


          let xContentProx = cPose.position[0] - 100
          let yContentProx = ((cPose.position[2] * -1)) - 150

          let  cWProx = (((cPose.position[0] + contents.all[i].size[0])) - 60) + 100
          let  cHProx = ((((cPose.position[2] * -1) + contents.all[i].size[1])) - 60) + 100

          //console.log(diffY, " -- ", cH1)
          

          let  cW = ((cPose.position[0] + contents.all[i].size[0]) - 60)
          let  cH = (((cPose.position[2] * -1) + contents.all[i].size[1]) - 60)

          

            //if((diffX >= xContent && diffX <= cW1) && (diffY >= yContent && diffY <= cH1)) {
            if((diffX >= (xContent-100) && diffX <= (cW1+100)) && (diffY >= (yContent-100) && diffY <= (cH1+100))) {
              if((diffX >= xContent && diffX <= cW1) && (diffY >= yContent && diffY <= cH1)) {
                if(contents.all[i].proximity === true) {
                  console.log("inside image")
                  //participants.local.savePhysicsToStorage(true)
                  _status = 1
                  break
                }
              } else {
                if(contents.all[i].proximity === true) {
                  console.log("inside image proxy area")
                  //participants.local.savePhysicsToStorage(false)
                  _status = 2
                  break
                }
              }
            } 
            /* else if((diffX >= xContentProx && diffX <= xContent) || (diffY >= yContentProx && diffY <= yContent) || (diffX >= cW1 && diffX <= cWProx) || (diffY >= cH1 && diffY <= cHProx)) {
              if(contents.all[i].proximity === true) {
                if(((diffX - xContent) <= 100) && ((diffY - yContent) <= 100) && ((diffX - cW1) <= 100) && ((diffY - cH1) <= 100)) {
                  //console.log("in proxy area")
                  _status = 2
                }
              }
            } */

          let wD = (cW + 100)
          let hD = (cH + 100)

          //if(_x >= xD && _x < wD && _y >= yD && _y <= hD) {

          //console.log(_x, " : User X -- Content X : ", cPose.position[0], " W : ", cWidth, " ::: ", _y, " : User Y --- Content Y : ", cPose.position[2], " H : ", cHeight)

          //console.log(_x, " : User X -- Content X : ", cPose.position[0], " W: ", cW, " ::: ", _y, " : User Y --- Content Y : ", (cPose.position[2] * - 1), " H : ", cH)

          //console.log(_x , " x Diff ", xD, " ::: ", _y, " y diff ", yD, " :::: W diff ", wD, " :::: H diff ", hD)
          
           /*  if((_x >= cPose.position[0] && _x <= cW) && (_y >= (cPose.position[2]* - 1) && _y <= cH)) {
              if(contents.all[i].proximity === true) {
                //console.log(" sound zone : ", i)
                _status = 1
                break
              }
            } else {
              //if((_x >= (cPose.position[0]-100) && _x <= (cPose.position[0])) || (_x >= (cW) && _x <= (cW-100)) || (_y >= ((cPose.position[2]* - 1) - 100) && _y <= (cPose.position[2]* - 1)) || (_y >= (cH) && _y <= (cH+100))){ 
              if(((_x >= (cPose.position[0]-100) && _x <= (cPose.position[0])) || (_x >= (cW) && _x <= (cW-100))) || ((_y >= ((cPose.position[2]* - 1) - 100) && _y <= (cPose.position[2]* - 1)) || (_y >= (cH) && _y <= (cH+100)))){ 
                if(contents.all[i].proximity === true) {
                  //console.log(" no sound zone ")
                  _status = 2
                }
              } 
            } */

          //}

          //console.log(xUpdated, " --- ", contents.all[i].pose.position[0], " w : ", cWidth)


          //console.log(yUpdated, " --- ", contents.all[i].pose.position[1], " x ", xUpdated, " -- ", contents.all[i].pose.position[0], " w : ", cWidth, " h : ", cHeight)

          /* if((xUpdated >= contents.all[i].pose.position[0] && xUpdated <= cWidth) && (yUpdated >= contents.all[i].pose.position[1] && yUpdated <= cHeight)) {
            if(contents.all[i].proximity === true) {
              //console.log("enter image : ", i)
              _status = 1
            }
          } else {
            if(contents.all[i].proximity === true) {
              _status = 2
            } else {
              _status = 0
            }
          }  */
        //}
      
      /* if(xUpdated >= xDiff && xUpdated < wDiff && yUpdated >= yDiff && yUpdated <= hDiff) {
        found = true
        if(contents.all[i].proximity === true) {
        _status = 2
        } else {
          _status = 0
        }
      } else {
        if(found === false) {
        _status = 0
        }
      } */



      
      /* 
      if(contents.all[i].proximity === true) {
      //yDiff = contents.all[i].pose.position[1] - _y
      //wDiff = contents.all[i].size[0] - _x
      //hDiff = contents.all[i].size[1] - _y
      cWidth = ((contents.all[i].pose.position[0] + contents.all[i].size[0]) - 50)
      cHeight = ((contents.all[i].pose.position[1] + contents.all[i].size[1]) - 60)

      wDiff = ((contents.all[i].pose.position[0] + contents.all[i].size[0]) + 100)
      hDiff = ((contents.all[i].pose.position[1] + contents.all[i].size[1]) + 100)

      //xUpdated = (_x + 110) * -1
      //yUpdated = (_y - 480)

      
      //console.log(_x, " --- ", contents.all[i].pose.position[0])

      if(_x < 0) {
        xUpdated = (_x + 30) * -1
      } else {
        xUpdated = (_x + 30) * -1
      }

      if(_y < 0) {
        //console.log("neg y")
        yUpdated = _y - 30 //(_y + 50) * -1
      } else {
        //console.log("pos y")
        yUpdated = _y - 35 //(_y - 50) * -1
      }

      
        xDiff = contents.all[i].pose.position[0] - 100
        yDiff = contents.all[i].pose.position[1] - 100
      


      //console.log(yUpdated, " --- ", contents.all[i].pose.position[1], " x ", xUpdated, " -- ", contents.all[i].pose.position[0])
      
        found = true
        if((xUpdated >= contents.all[i].pose.position[0] && xUpdated <= cWidth) && (yUpdated >= contents.all[i].pose.position[1] && yUpdated <= cHeight)) {
          //console.log(" HIT AREA ")
          _status = 1
        } else if(xUpdated >= xDiff && xUpdated < wDiff && yUpdated >= yDiff && yUpdated <= hDiff) {
          _status = 2
        } else {
          _status = 0
        }
    } else {
        if(found === false) {
          _status = 0
        }
    } */

      //console.log(xUpdated, " >= ", contents.all[i].pose.position[0], " || AND ", yUpdated, " >= ", contents.all[i].pose.position[1], "- size", contents.all[i].size[0], " w ", cWidth, " -size h ", contents.all[i].size[1], " h ", cHeight, " proxi ", contents.all[i].proximity)
      /*if((_x >= contents.all[i].pose.position[0] && _x <= cWidth) && (_y >= contents.all[i].pose.position[1] && _y <= cHeight) && contents.all[i].proximity === true) {
        _status = 1
      } else {
        if(contents.all[i].proximity === true) {
        _status = 2
        } else {
          _status = 0
        }
      }*/
    }
    return _status
  }
  private updateVolumeWithAssets(participant_pose:Pose3DAudio) {
    let volume = 0
    let touchStatus = 0
    let xParticipant = 0;
    let yParticipant = 0;
    // checking content pos
    //this.localParticipant.myContents.forEach((c) => {
       // (c.pose, t.pose)
    //}
    if (this.playMode === 'Element') {
      xParticipant = ((participant_pose.position[0]));
      yParticipant = ((participant_pose.position[2]))
      touchStatus = this.getContentsStatus(xParticipant, yParticipant)
      
      console.log(touchStatus, " touch ")
      
      if(touchStatus === 1) {
        participants.local.savePhysicsToStorage(true)
        this.distance = 90
      } else if(touchStatus === 2) {
        participants.local.savePhysicsToStorage(false)
        this.distance = 150
      } else {
        participants.local.savePhysicsToStorage(false)
      }

        volume = Math.pow(Math.max(this.distance, this.pannerNode.refDistance) / this.pannerNode.refDistance,
                          - this.pannerNode.rolloffFactor)
    }
    if (this.audioElement) {
      //console.log (volume, " NodeG volume ")
      this.audioElement.volume = volume
    }
  }
  private updateVolume() {
    let volume = 0
    let remoteProx = 0
    /* if(participants.local.physics.inProximity) {
      this.distance = 90
    } else {
      this.distance = 120
    } */

    // checking for remote user location proximity
    /* const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
    for (const [i, id] of remotes.entries()) {
        console.log(participants.remote.get(remotes[i])?.pose.position)
    } */

    //console.log(participants.local.physics.inProximity, " --- ", remoteProx)
    /* if(participants.local.physics.inProximity === true) {
      this.distance = 90
    } else {
      this.distance = 150
    } */

    if (this.playMode === 'Element') {
    //if (this.playMode === 'Element' && participants.local.physics.inProximity === true) {
    //if (this.playMode === 'Element') {
     // if(participants.local.physics.inProximity === true) {
      //volume = 1
     // } else {
        volume = Math.pow(Math.max(this.distance, this.pannerNode.refDistance) / this.pannerNode.refDistance,
                      - this.pannerNode.rolloffFactor)
    //  }
    } 
    if (this.audioElement) {
      //console.log(volume, " > vol")
      this.audioElement.volume = volume
    }
  }

  private _defaultPannerRefDistance = PARTICIPANT_SIZE
  private get defaultPannerRefDistance () { return this._defaultPannerRefDistance }
  private set defaultPannerRefDistance(val: number) {
    this._defaultPannerRefDistance = val
    if (this.pannerNode.refDistance !== BROADCAST_DISTANCE) { // not in broadcast mode
      this.pannerNode.refDistance = this._defaultPannerRefDistance
    }
  }
  updateBroadcast(broadcast: boolean) {
    if (!broadcast) {
      this.pannerNode.refDistance = this.defaultPannerRefDistance
    } else {
      this.pannerNode.refDistance = BROADCAST_DISTANCE
    }
  }

  updatePannerConfig(config: ConfigurableParams) {
    const observedPannerKeys: ConfigurableProp[] =
      ['coneInnerAngle', 'coneOuterAngle', 'coneOuterGain', 'distanceModel', 'maxDistance', 'distanceModel', 'panningModel', 'refDistance', 'rolloffFactor']
    observedPannerKeys.forEach((key) => {
      if (key === 'refDistance') {
        this.defaultPannerRefDistance = config['refDistance']
      } else {
        (this.pannerNode[key] as any) = config[key]
      }
    })
  }

  private audibility = false
  updateAudibility(audibility: boolean) {
    if (audibility) {
      this.gainNode.connect(this.pannerNode)
    } else {
      this.gainNode.disconnect()
    }

    if (this.audioElement) {
      this.audioElement.muted = !audibility
    }

    this.audibility = audibility
  }

  disconnect() {
    if (this.sourceNode) {
      this.sourceNode.disconnect()
    }

    this.gainNode.disconnect()
    this.pannerNode.disconnect()
    if (this.audioElement) {
      this.audioElement.volume = 0
      this.audioElement.pause()
      this.audioElement.remove()
    }
  }

  get isBroadcast(): boolean {
    return this.pannerNode.refDistance === BROADCAST_DISTANCE
  }

  private createGainNode(context: AudioContext) {
    const gain = context.createGain()

    gain.gain.value = 1

    return gain
  }

  private createPannerNode(context: AudioContext) {
    const panner = context.createPanner()

    

    return panner
  }

  private updateSourceStream(stream: MediaStream | undefined) {
    if (this.sourceNode) {
      this.sourceNode.disconnect()
    }

    if (stream === undefined) {
      this.sourceNode = undefined

      return
    }

    this.sourceNode = this.context.createMediaStreamSource(stream)

    //  Anyway, soruce must be connected audioElement, for the case of Element mode.
    //    if (isChrome) { // NOTE Chorme would not work if not connect stream to audio tag
    if (this.audioElement === undefined) {
      this.audioElement = this.createAudioElement()
    }

    this.audioElement.srcObject = stream
    //    }
  }

  createAudioElement() {
    const audio = new Audio()
    setAudioOutputDevice(audio, this.audioDeviceId)

    return audio
  }
}
