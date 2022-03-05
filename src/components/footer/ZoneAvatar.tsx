/* import {ErrorDialog} from '@components/error/ErrorDialog' */
import {BMProps} from '@components/utils'
/* import {acceleratorText2El} from '@components/utils/formatter' */
/* import megaphoneIcon from '@iconify/icons-mdi/megaphone' */
/* import {Icon} from '@iconify/react' */
import {Collapse} from '@material-ui/core'
/* import Menu from '@material-ui/core/Menu' */
/* import MenuItem from '@material-ui/core/MenuItem' */
/* import Popover from '@material-ui/core/Popover' */
import {makeStyles} from '@material-ui/core/styles'
/* import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import SettingsIcon from '@material-ui/icons/Settings'
import VideoIcon from '@material-ui/icons/Videocam'
import VideoOffIcon from '@material-ui/icons/VideocamOff'
import SpeakerOffIcon from '@material-ui/icons/VolumeOff'
import SpeakerOnIcon from '@material-ui/icons/VolumeUp' */

/* import smileIcon from '@images/whoo-screen_btn-smile.png' */
/* import symSmileIcon from '@images/whoo-screen_sym-smile.png' */
/* import clapIcon from '@images/whoo-screen_btn-clap.png' */
/* import symClapIcon from '@images/whoo-screen_sym-clap.png' */
/* import handIcon from '@images/whoo-screen_btn-hand.png' */
/* import symHandIcon from '@images/whoo-screen_sym-hand.png' */


/* import {useTranslation} from '@models/locales' */
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef, useState} from 'react'
/* import {AdminConfigForm} from './adminConfig/AdminConfigForm' */
/* import {BroadcastControl} from './BroadcastControl' */
import {FabMain} from './FabEx'

/* import {LocalParticipant} from '@stores/participants/LocalParticipant' */
import { PlaybackParticipant } from '@stores/participants/PlaybackParticipant'
/* import {RemoteParticipant} from '@stores/participants/RemoteParticipant' */

/* import {ShareButton} from './share/ShareButton'
import {StereoAudioSwitch} from './StereoAudioSwitch' */
import {Observer} from 'mobx-react-lite'
import {rgb2Color} from '@models/utils'

import {connection} from '@models/api'
import {MessageType} from '@models/api/MessageType'

import { getVideoButtonStatus } from './Footer'


/* import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
  palette: {
    primary: { main: '#000000' },
    secondary: { main: '#ef4623' }
  }
}); */

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
  },
  fabActive: {
    display:'block',
  },
  vidicon:{
    display: 'none',
    height: 50,
    position:'relative',
    backgroundColor: 'black', //'#9e886c', //  '#ef4623' : '#9e886c',
    transform: 'rotateY(180deg)',
    right: 0,
    ...buttonStyle,
  },
  vidiconActive:{
    display: 'block',
    height: 50,
    position:'relative',
    alignItems:'center',
    backgroundColor: 'black', //'#9e886c', //  '#ef4623' : '#9e886c',
    transform: 'rotateY(180deg)',
    right: 0,
    ...buttonStyle,
  },
  container:{
    position: 'absolute',
    width: '30%',
    top: '0%',
    right:0,
    padding: 0,
    outline: 'none',
    pointerEvents: 'none',
  },
  wrapper:{width:'100%'},
  wrapperInner:{width:'100%', display:'flex', flexDirection:'column', alignItems:'flex-end'},

})

/* class Member{
  timeoutOut:NodeJS.Timeout|undefined = undefined
  touched = false
} */

export const ZoneAvatar: React.FC<BMProps&{height?:number}> = (props) => {
  //const {map, participants} = props.stores
  const {participants} = props.stores

  //console.log("Zone Stream class")
  const rgb = participants.local.getColorRGB()

  const videoButtonStatus = getVideoButtonStatus()

  //const inzone = useObserver(() => participants.local.zone?.zone)
  //if(inzone !== undefined) {
  //console.log(inzone, " >>zone")
  //}


  //const startStream = useObserver(() => participants.local.showVideo)

  //var dispText = ''



  // check for remote status
  //const local = participants.local
  const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
  //console.log(remotes[0])
//let pp:RemoteParticipant | undefined

  let userIndex:number = 0;
  for (const [i] of remotes.entries()) {
    //console.log(participants.remote.get(remotes[i])?.showVideo, " Video Status")
   //pp = participants.remote.get(remotes[i])?.showVideo
   //const startStream = useObserver(() => _status)
   //if(participants.remote.get(remotes[i])?.showVideo) {
  if(participants.remote.get(remotes[i])?.tracks.avatarStream !== undefined) {
    userIndex = i
    //break
   }
  }

  //const rgbRemote = (participants.remote.get(remotes[userIndex])?.getColorRGB())

  const store = props.stores.participants
  const ids = useObserver(() => Array.from(store.remote.keys()).filter((id) => {
    const remote = store.find(id)!



    if(remote.tracks.avatarStream !== undefined) {
      //return remote.tracks.avatarStream
      //if(remote.id !== activeStreamUser) {
        //activeStreamUser = remote.id
        return remote
      //}
    }
    return undefined
  }))

  //console.log(participants.remote.get(ids[ids.length-1])?.tracks.avatarStream, " checking")
  //console.log(ids.length, " ids")

  //const [toggleUser, setToggleUser] = React.useState<string>(ids[ids.length-1])
  //console.log(toggleUser, " toggleUser")



const [streamUser, setStreamUser] = React.useState(ids)
let result:any = []
if(ids.length !== streamUser.length) {
  //console.log(streamUser, ids)
  let onlyInA = ids.filter(comparer(streamUser));
  let onlyInB = streamUser.filter(comparer(ids));

  if(ids.length === 0) {
    result = []
  }else {
    result = onlyInA.concat(onlyInB)
  }
  console.log(ids, "---", result)
  setStreamUser(result)
}

function comparer(otherArray:string[]){
  return function(current:string){
    return otherArray.filter(function(other){
      return other === current
    }).length === 0;
  }
}

/*
  let val = ["abc", "ghi"]
  const name = ["abc", "def", "ghi"]
  function comparer(otherArray:string[]){
    return function(current:string){
      return otherArray.filter(function(other){
        return other == current
      }).length == 0;
    }
  }
  var onlyInA = name.filter(comparer(val));
  var onlyInB = val.filter(comparer(name));
  let result = onlyInA.concat(onlyInB);
  console.log(result); */




  //ids.find(element => element !== streamUser)
  //for (let i=0; i<ids.length; i++) {
    //console.log(ids[i], " List of stream user ", streamUser)
    /* for(let j=0; j<streamUser.length; j++) {
      if(ids[i] !== streamUser[j])
      {
        console.log(ids[i], " List of stream user")
      }

    } */
 // }

  const localStream = useObserver(() => Boolean(participants.local.showVideo))
  const startStream = useObserver(() => Boolean(participants.remote.get(streamUser[streamUser.length-1])?.showVideo))
  /* const startStream = useObserver(() => Boolean(participants.remote.get(remotes[0])?.showVideo)) */

  const rgbR = participants.remote.get(streamUser[streamUser.length-1])?.getColorRGB()

  //const avStream = useObserver(() => participants.local.tracks.avatarStream)
  const avLocalStream = useObserver(() =>  participants.local.tracks.avatarStream)
  //const avStream = useObserver(() =>  participants.remote.get(remotes[userIndex])?.tracks.avatarStream)
  const avStream = useObserver(() =>  participants.remote.get(streamUser[streamUser.length-1])?.tracks.avatarStream)
  /* const avStream = useObserver(() =>  participants.remote.get(remotes[0])?.tracks.avatarStream) */

  //console.log(startStream, " video on")

  //console.log(localStream, " ---- ", startStream)

  //console.log(participants.local.muteVideo, " LOCAL ---- ", participants.remote.get(ids[0])?.muteVideo, " ---- REMOTE")


  //if(startStresm)

    let stream = (localStream && !(participants instanceof PlaybackParticipant) ?
    avLocalStream : (startStream && !(participants instanceof PlaybackParticipant) ?
    avStream : undefined))

    /* let stream = (localStream && !(participants instanceof PlaybackParticipant) ?
    avLocalStream : undefined) */

    /* let stream = (startStream && !(participants instanceof PlaybackParticipant) ?
    avStream : (localStream && !(participants instanceof PlaybackParticipant) ?
    avLocalStream : undefined)) */



    let blob = stream && (participants instanceof PlaybackParticipant) ?
      participants.videoBlob: undefined
 // }

 //console.log(stream, " ------------")



  // For toggle emoticons
  //const [toggleStream, setToggleStream] = React.useState<boolean>(startStream ? startStream : (localStream ? localStream : false))

  //const [toggleStream, setToggleStream] = React.useState<boolean>((stream !== undefined) ? true : false)
  const [toggleStream, setToggleStream] = React.useState<boolean>((localStream !== false || startStream !== false) ? true : false)

  //const [toggleUI, setToggleUI] = React.useState<boolean>(true)

  //const [toggleBreadCast, setToggleBreadCast] = React.useState<boolean>(false)

  //const [zone, setZone] = React.useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [liveTimer, setLiveTimer] = useState(1)

  //const memberRef = useRef<Member>(new Member())
  //const member = memberRef.current
  const containerRef = useRef<HTMLDivElement>(null)
  //  observers

  //console.log("CALLED")
  //console.log(window.navigator.userAgent.indexOf("Mozilla"), " browser type")


  //  observers
  const mute = useObserver(() => ({
    muteA: participants.local.muteAudio,  //  mic
    muteS: participants.local.muteSpeaker,  //  speaker
    muteV: participants.local.muteVideo,  //  camera
    onStage: participants.local.physics.onStage,
  }))


  //console.log(toggleStream, " ====================", localStream, "--", startStream)

  //console.log(mute.muteV, " current status")

  //console.log("AAAAAA")
  //const bStatus = useObserver(() => getVideoButtonStatus())
  //console.log("bStatus - ", bStatus)

  //console.log(localStream, " --- ", startStream, " --- ", stream, "----", videoButtonStatus)

  // for video
  //const vStatus = useObserver(() => participants.local.trackStates.videoOn)

  //console.log("CHECK STATUS --- ", vStatus)



  //if(localStream || startStream) {

    //if(localStream === false && startStream === false) {return}



    if(stream === undefined) {
      /* if(localStream || ids.length === 0 || videoButtonStatus === false) { */
      var dispText = ''
      //console.log(liveTimer, " liveTimer")
      //dispText = "GOING LIVE IN " + (4-liveTimer) + "..."
      dispText = "GOING LIVE..."
      if(videoButtonStatus === false) {
        dispText = "STREAM OFF"
      } else {
        if(localStream) {
          setTimeout (() => {
            let nTime = liveTimer
            //if(nTime <= 6) {
              nTime += 1
              //console.log(nTime, " nTime")
              setLiveTimer(nTime)

            //}
            //console.log(nTime, " nTime")
            //dispText = "GOING LIVE... " + liveTimer
        },500)

        /* // Reset Timer
        if(liveTimer >= 4) {
          setLiveTimer(1)
        } */

        } else if(startStream) {
          dispText = "RECONNECTING..."
        } else {
          dispText = "STREAM OFF"
        }
      }
    } else {
        dispText = ""
    }
  //}


  //console.log(toggleUI, " UI toggle")

  const classes = useStyles()
  //  Footer collapse conrtrol
  /* function checkMouseOnBottom() {
    return map.screenSize[1] - (map.mouse[1] - map.offset[1]) < 90
  }




  const mouseOnBottom = useObserver(checkMouseOnBottom)
 */
  useEffect(() => {
    //console.log("CHECKING")
   /*  if (videoRef?.current !== null) {
    let activeTime = liveTimer
    activeTime++
    const timer = setTimeout(() => {
      clearTimeout(timer)
      setLiveTimer(activeTime)
    }, 100)
  } */

  /* const timer = setTimeout(() => {
    clearTimeout(timer)
    console.log("ENTER IN VIDEO STREAM - ", startStream, " ---- ", localStream)
    checkToggle()
  }, 300) */



    if (videoRef?.current !== null) {
      //console.log(blob, " TYPE", stream)
      setStream(videoRef.current, stream, blob,
        '300', '300')
        //console.log("AAA")

        checkToggle()
    }
    //if (checkMouseOnBottom()) { member.touched = true }
    //console.log("start stream")
        //setToggleStream(startStream);
   /*  if (checkMouseOnBottom()) { member.touched = true }
      setShowFooter(mouseOnBottom || !member.touched)*/
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => {
        if(localStream === false) {
          setLiveTimer(1)
        }
      }
    },)

    function checkToggle() {
      //setToggleStream(startStream ? startStream : (localStream ? localStream : false))
      //console.log(stream, " -- toggle check")

      //console.log(localStream, " -----LS------ ", startStream)

      //setToggleStream((stream !== undefined) ? true : false)
      setToggleStream((localStream !== false || startStream !== false) ? true : false)

    }

    /* function checkZone() {
      if(zone) {
        setZone(false)
      } else {
        setZone(true)
      }
    } */
  /* function setShowFooter(show: boolean) {
    if (show) {
      //setShow(true)
      if (member.timeoutOut) {
        clearTimeout(member.timeoutOut)
        member.timeoutOut = undefined
      }
      containerRef.current?.focus()
    }else {
      if (!member.timeoutOut) {
        member.timeoutOut = setTimeout(() => {
          //setShow(false)
          member.timeoutOut = undefined
        },                             500)
      }
    }
  } */

  function setStream(video: HTMLVideoElement, stream: MediaStream|undefined, blob: Blob|undefined,
    videoLargerWidthClass: string, videoLargerHeightClass: string){

    if (stream) {video.srcObject = stream}
    else if (blob){
      const url = URL.createObjectURL(blob)
      video.src = url
    }
    video.autoplay = true
    video.onloadedmetadata = () => {
      //console.log(video.width, " --- ", video.height)
      const settings = {
        width: 300, //video.width,
        height: 300, //video.height,
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

  //  render footer
  //return React.useMemo(() => {
    //  Device list update when the user clicks to show the menu
    //const fabSize = props.height
    //const iconSize = 55

    //console.log(toggleStream, " sS")
    //Please check firewall setting. Binaural Meet connect to https (port 443/TCP) and port 8801-8810/UDP or 80/TCP.

    //  marginLeft:'-50px', marginTop:'-75px'
    return <Observer>{() => {
    return <div ref={containerRef} className={classes.container}>
      <Collapse in={true} classes={classes}>
        {/* <FabMain size={250} className={(toggleStream) ? classes.fabActive : classes.fab} */}
        {/* <MuiThemeProvider  theme={theme}> */}

       {/*  <FabMain size={250} className={((localStream !== false || startStream !== false || ids.length > 0  || videoButtonStatus)) ? classes.fabActive : classes.fab} */}

        <FabMain size={250} /* color={(dispText === "STREAM OFF" ? 'default' : 'default')} */ className={((localStream !== false || startStream !== false /* || videoButtonStatus */)) ? classes.fabActive : classes.fab}

        onClick = { () => {
          /* console.log("on Vid Click") */
          connection.conference.sendMessage(MessageType.MUTE_VIDEO, true)
          participants.local.muteVideo = !mute.muteV
          participants.local.saveMediaSettingsToStorage()
        }}
        >
          <div className={(toggleStream) ? classes.vidiconActive : classes.vidicon}>
            <video ref={videoRef} style={{width: '300px', height:'300px', position: 'absolute', marginTop:'-30px', marginLeft:'-150px'}}/>
          </div>
        </FabMain>
        {/* </MuiThemeProvider> */}
        <div style={{height:'50px', width:'150px', textAlign:'center', position:'relative', left:'-66px',
          verticalAlign:'middle', display:'flex', flexDirection:'row', whiteSpace:'nowrap', marginTop: '-50px', color:'white', overflow:'hidden'}}>
            <img style={{position:'relative', display: dispText !== "STREAM OFF" ? 'block' : 'none', width:'25px', height:'25px', marginTop:'0px', marginLeft: '35px', backgroundColor:localStream ? rgb2Color(rgb) : (rgbR !== undefined ? rgb2Color(rgbR) : undefined), borderRadius: '50%'}} src={localStream ? participants.local.information.avatarSrc : participants.remote.get(remotes[userIndex])?.information.avatarSrc}  alt=''/>
            <p style={{position:'relative', marginTop:'4px', marginLeft:'4px', overflow:'hidden', display: dispText !== 'STREAM OFF' ? 'block' : 'none'}}>{localStream ? participants.local.information.name : participants.remote.get(remotes[userIndex])?.information.name}</p>
        </div>
        <div className={localStream || ids.length === 0 || videoButtonStatus === false ? classes.hidetapBroadcast : classes.tapBroadcast}>
          TAP TO GO LIVE
        </div>
        {/* <div style={stream === undefined ? {width:'240px', height:'240px', top:'14px', left:'-148px', position:'absolute', backgroundColor:'black', borderRadius:'50%', display:'block'} : {display:'none'}}></div> */}
        {/* <div style={(stream === undefined && localStream) || dispText === "STREAM OFF" ? {width:'240px', height:'243px', top:'12.5px', right:'20.7px', position:'absolute', backgroundColor:'black', borderRadius:'50%', display:'block'} : {display:'none'}}></div>*/}
        {/* <p style={{position:'absolute', color:(dispText === "STREAM OFF" ? 'red' : 'white'), top:'110px', width:'270px', textAlign:'center'}}>{dispText}</p> */}
        {/* <p className={dispText === "STREAM OFF" ? classes.hidetapBroadcast : classes.tapBroadcast}>{dispText}</p> */}
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
