import {BMProps} from '@components/utils'
import {Collapse} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef, useState} from 'react'
import {FabMain/* , FabWithTooltip */} from '@components/utils/FabEx'
import { PlaybackParticipant } from '@stores/participants/PlaybackParticipant'
import {Observer} from 'mobx-react-lite'
import {isSmartphone, rgb2Color} from '@models/utils'
import { getVideoButtonStatus } from './Footer'


const buttonStyle = {
  '&': {
    margin: '5px',
    borderRadius: '50%',
    width: '250px',
    height: '243px',
    textAlign: 'center',
    overflow: 'hidden',
    top: '1px',
    PointerEvent: 'none',
  },
}

const useStyles = makeStyles({
  tapBroadcast: {
    display: 'block',
    width:'265px',
    position:'relative',
    left:'-10px',
    textAlign:'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '20px',
    textShadow: '1px 1px #000, -1px 1px #cdcdcd, -1px -1px #cdcdcd, 1px -1px #cdcdcd' // '1px 2px 2px #000000' //
  },
  tapBroadcastText: {
    display: 'block',
    width:'265px',
    position:'relative',
    top: '-20px',
    left:'-10px',
    textAlign:'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '20px',
    textShadow: '1px 1px #000, -1px 1px #cdcdcd, -1px -1px #cdcdcd, 1px -1px #cdcdcd' // '1px 2px 2px #000000' //
  },
  hidetapBroadcast:{
    display: 'none',
  },
  fab:{
    display:'none',
    opacity: 0,
    transition: 'opacity 0.3s ease-out',
  },
  fabActive: {
    display:'block',
    opacity: 1,
    transition: 'opacity 0.3s ease-out'
  },
  vidicon:{
    display: 'none',
    height: 50,
    position:'relative',
    backgroundColor: 'black',
    transform: 'rotateY(180deg)',
    right: 0,
    ...buttonStyle,
  },
  vidiconActive:{
    display: 'block',
    height: 50,
    position:'relative',
    alignItems:'center',
    backgroundColor: 'black',
    transform: 'rotateY(180deg)',
    right: 0,
    ...buttonStyle,
  },
  container:{
    position: 'absolute',
    width: '30%',
    top: '0%',
    right:10,
    padding: 0,
    outline: 'none',
    pointerEvents: 'none',
  },
  wrapper:{width:'100%'},
  wrapperInner:{width:'100%', display:'flex', flexDirection:'column', alignItems:'flex-end'},

})
export const ZoneAvatar: React.FC<BMProps&{height?:number}> = (props) => {
  const {participants} = props.stores
  const rgb = participants.local.getColorRGB()
  const videoButtonStatus = getVideoButtonStatus()
  // check for remote status
  const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
  let userIndex:number = 0;
  for (const [i] of remotes.entries()) {
  if(participants.remote.get(remotes[i])?.tracks.avatarStream !== undefined) {
    userIndex = i
   }
  }
  const store = props.stores.participants
  const ids = useObserver(() => Array.from(store.remote.keys()).filter((id) => {
    const remote = store.find(id)!
    if(remote.tracks.avatarStream !== undefined) {
        return remote
    }
    return undefined
  }))
const [streamUser, setStreamUser] = React.useState(ids)
let result:any = []
if(ids.length !== streamUser.length) {
  let onlyInA = ids.filter(comparer(streamUser));
  let onlyInB = streamUser.filter(comparer(ids));
  if(ids.length === 0) {
    result = []
  }else {
    result = onlyInA.concat(onlyInB)
  }
  setStreamUser(result)
}
function comparer(otherArray:string[]){
  return function(current:string){
    return otherArray.filter(function(other){
      return other === current
    }).length === 0;
  }
}
  const localStream = useObserver(() => Boolean(participants.local.showVideo))
  const startStream = useObserver(() => Boolean(participants.remote.get(streamUser[streamUser.length-1])?.showVideo))
  const rgbR = participants.remote.get(streamUser[streamUser.length-1])?.getColorRGB()
  //const avStream = useObserver(() => participants.local.tracks.avatarStream)
  const avLocalStream = useObserver(() =>  participants.local.tracks.avatarStream)
  //const avStream = useObserver(() =>  participants.remote.get(remotes[userIndex])?.tracks.avatarStream)
  const avStream = useObserver(() =>  participants.remote.get(streamUser[streamUser.length-1])?.tracks.avatarStream)
  /* const avStream = useObserver(() =>  participants.remote.get(remotes[0])?.tracks.avatarStream) */
  let stream = (localStream && !(participants instanceof PlaybackParticipant) ?
  avLocalStream : (startStream && !(participants instanceof PlaybackParticipant) ?
  avStream : undefined))

  let blob = stream && (participants instanceof PlaybackParticipant) ? participants.videoBlob: undefined
  // For toggle emoticons
  const [toggleStream, setToggleStream] = React.useState<boolean>((localStream !== false || startStream !== false) ? true : false)
  const [toggleUI, setToggleUI] = React.useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [liveTimer, setLiveTimer] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  /* //  observers
  const mute = useObserver(() => ({
    muteA: participants.local.muteAudio,  //  mic
    muteS: participants.local.muteSpeaker,  //  speaker
    muteV: participants.local.muteVideo,  //  camera
    onStage: participants.local.physics.onStage,
  })) */

  if(stream === undefined) {
    var dispText = ''
    dispText = "GOING LIVE..."
    if(videoButtonStatus === false) {
      dispText = "STREAM OFF"
    } else {
      if(localStream) {
      if(toggleUI) {
        setToggleUI(false)
      }
      } else if(startStream) {
        //dispText = "RECONNECTING..."
        dispText = ""
      } else {
        dispText = "STREAM OFF"
        if(toggleUI === false) {
          setTimeout (() => {
            let nTime = liveTimer
            if(nTime <= 8) {
              nTime += 1
              setLiveTimer(nTime)
            }
          },500)
          if(liveTimer >= 6) {
            //console.log("timer off")
            setLiveTimer(1)
            setToggleUI(true)
          }
        }
      }
    }
  } else {
      dispText = ""
  }
  const classes = useStyles()
  useEffect(() => {
    if (videoRef?.current !== null) {
      setStream(videoRef.current, stream, blob,
        '300', '300')
        checkToggle()
    }
    return () => {
      if(localStream === false) {
        setLiveTimer(1)
      }
    }
  },)

  function checkToggle() {
    setToggleStream((localStream !== false || startStream !== false) ? true : false)
  }
  function setStream(video: HTMLVideoElement, stream: MediaStream|undefined, blob: Blob|undefined,
    videoLargerWidthClass: string, videoLargerHeightClass: string){

    if (stream) {video.srcObject = stream}
    else if (blob){
      const url = URL.createObjectURL(blob)
      video.src = url
    }
    video.autoplay = true
    video.onloadedmetadata = () => {
      const settings = {
        width: 350, //video.width,
        height: 350, //video.height,
      }
      if (settings.width !== undefined && settings.height !== undefined) {
        video.className = settings.width >= settings.height ? videoLargerWidthClass : videoLargerHeightClass
      } else {
        console.error('video stream width || height is undefined')
        video.className = videoLargerWidthClass
      }
    }
  }
  //  keyboard shortcut
  useEffect(() => {
    //console.log(videoRef?.current, "mask")
    /* window.addEventListener('click', (ev) => {
      //checkZone()
      ev.preventDefault()
    },                      {passive: false, capture: false}) */
    /* const onKeyDown = (e: KeyboardEvent) => {
      console.log(`onKeyDown: code: ${e.code}`)
    }
    window.addEventListener('keydown', onKeyDown) */

    return () => {
      //window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [])
  return <Observer>{() => {
  return <div ref={containerRef} className={classes.container}>
    <Collapse in={true} classes={classes}>
      <FabMain size={250} className={((localStream !== false || startStream !== false || toggleUI === false)) ? classes.fabActive : classes.fab}
      onClick = { () => {
        /* console.log("on Vid Click") */
        /* if(localStream !== false || startStream !== false || toggleUI === false) {return} */
        /* connection.conference.sendMessage(MessageType.MUTE_VIDEO, true)
        participants.local.muteVideo = !mute.muteV
        participants.local.saveMediaSettingsToStorage() */
      }}
      >
      <div className={(toggleStream) ? classes.vidiconActive : classes.vidicon}>
        <video ref={videoRef} style={{width: '350px', height:'350px', position: 'absolute', marginTop:'-50px', marginLeft:'-150px'}}/>
      </div>
    </FabMain>
      <div style={toggleUI === false && stream === undefined ? {width:'240px', height:'243px', borderRadius: '50%',top:'12.5px', right:'20.7px', position:'absolute', backgroundColor:'black',/*  display:'block', */ /* transform: 'opacity(1)',  */opacity: 1, transition: 'opacity 0.3s ease-out'} : {/* display:'none',  */width:'240px', height:'243px', borderRadius: '50%', top:'12.5px', right:'20.7px', position:'absolute', backgroundColor:'black', /* transform: 'opacity(0)',  */ opacity: 0, transition: 'opacity 0.3s ease-out'}}>
        <p style={dispText === 'GOING LIVE...' || stream !== undefined ? {display:'none'} : {display:'block', position:'absolute', color:'red', top:'235px', width:'250px', textAlign:'center', fontSize:'20px', fontWeight:'bold', /* textShadow: '1px 1px #ff0000, -1px 1px #ff0000, -1px -1px #ff0000, 1px -1px #ff0000' */}}>{/* RECONNECTING... */}</p>
      </div>

      <div style={{height:'50px', width:'150px', textAlign:'center', position:'relative', left:'-66px',
        verticalAlign:'middle', display:'flex', flexDirection:'row', whiteSpace:'nowrap', marginTop: '-50px', color:'white', overflow:'hidden'}}>
          <img style={{position:'relative', display: dispText !== "STREAM OFF" ? 'block' : 'none', width:'25px', height:'25px', marginTop:'0px', marginLeft: '35px', backgroundColor:localStream ? rgb2Color(rgb) : (rgbR !== undefined ? rgb2Color(rgbR) : undefined), borderRadius: '50%'}} src={localStream ? participants.local.information.avatarSrc : participants.remote.get(remotes[userIndex])?.information.avatarSrc}  alt=''/>
          <p style={{position:'relative', marginTop:'4px', marginLeft:'4px', overflow:'hidden', display: dispText !== 'STREAM OFF' ? 'block' : 'none', fontSize: isSmartphone() ? '2rem' : '1rem', fontWeight:'bold'}}>{localStream ? participants.local.information.name : participants.remote.get(remotes[userIndex])?.information.name}</p>
      </div>
      <div className={localStream || ids.length === 0 || videoButtonStatus === false ? classes.hidetapBroadcast : classes.tapBroadcast}>
        TAP TO GO LIVE
      </div>
      <p className={dispText === "STREAM OFF" ? classes.hidetapBroadcast : classes.tapBroadcastText}>{dispText}</p>
    </Collapse>
  </div >
  }}</Observer>
  //},
    // eslint-disable-next-line react-hooks/exhaustive-deps
  //  []

   // )
}
ZoneAvatar.displayName = 'ZoneAvatar'
