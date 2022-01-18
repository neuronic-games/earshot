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
import React, {useEffect, useRef} from 'react'
/* import {AdminConfigForm} from './adminConfig/AdminConfigForm' */
/* import {BroadcastControl} from './BroadcastControl' */
import {FabMain} from './FabEx'

/* import {LocalParticipant} from '@stores/participants/LocalParticipant' */
import { PlaybackParticipant } from '@stores/participants/PlaybackParticipant'
/* import {RemoteParticipant} from '@stores/participants/RemoteParticipant' */

/* import {ShareButton} from './share/ShareButton'
import {StereoAudioSwitch} from './StereoAudioSwitch' */
import {Observer} from 'mobx-react-lite'


/* import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
  palette: {
    primary: { main: '#9e886c' },
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



  //const inzone = useObserver(() => participants.local.zone?.zone)
  //if(inzone !== undefined) {
  //console.log(inzone, " >>zone")
  //}


  //const startStream = useObserver(() => participants.local.showVideo)



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
   if(participants.remote.get(remotes[i])?.showVideo) {
    userIndex = i
    break
   }
  }


  const localStream = useObserver(() => Boolean(participants.local.showVideo))
  const startStream = useObserver(() => Boolean(participants.remote.get(remotes[userIndex])?.showVideo))


  //const avStream = useObserver(() => participants.local.tracks.avatarStream)
  const avLocalStream = useObserver(() =>  participants.local.tracks.avatarStream)
  const avStream = useObserver(() =>  participants.remote.get(remotes[userIndex])?.tracks.avatarStream)
  //console.log(startStream, " video on")

  //if(startStresm)

    let stream = (localStream && !(participants instanceof PlaybackParticipant) ?
    avLocalStream : (startStream && !(participants instanceof PlaybackParticipant) ?
    avStream : undefined))
    let blob = stream && (participants instanceof PlaybackParticipant) ?
      participants.videoBlob: undefined
 // }

 console.log(stream, " ------------")



  // For toggle emoticons
  //const [toggleStream, setToggleStream] = React.useState<boolean>(startStream ? startStream : (localStream ? localStream : false))
  const [toggleStream, setToggleStream] = React.useState<boolean>((stream !== undefined) ? true : false)
  //const [zone, setZone] = React.useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  //const memberRef = useRef<Member>(new Member())
  //const member = memberRef.current
  const containerRef = useRef<HTMLDivElement>(null)
  //  observers

  //console.log("CALLED")

  console.log(toggleStream, " ====================", localStream, "--", startStream)

  const classes = useStyles()
  //  Footer collapse conrtrol
  /* function checkMouseOnBottom() {
    return map.screenSize[1] - (map.mouse[1] - map.offset[1]) < 90
  } */

  //const mouseOnBottom = useObserver(checkMouseOnBottom)

  useEffect(() => {
    if (videoRef?.current !== null) {
      //console.log(blob, " TYPE", stream)
      setStream(videoRef.current, stream, blob,
        '250px', '250px')
        //console.log("AAA")
        checkToggle()
    }
    //if (checkMouseOnBottom()) { member.touched = true }
    //console.log("start stream")
        //setToggleStream(startStream);
   /*  if (checkMouseOnBottom()) { member.touched = true }
      setShowFooter(mouseOnBottom || !member.touched)*/
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },)

    function checkToggle() {
      //setToggleStream(startStream ? startStream : (localStream ? localStream : false))
      console.log(stream, " -- toggle check")
      setToggleStream((stream !== undefined) ? true : false)
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
      const settings = {

        width: video.width,
        height: video.height,
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
    console.log(videoRef?.current, "mask")

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

    return <Observer>{() => {

    return <div ref={containerRef} className={classes.container}>
      <Collapse in={true} classes={classes}>
        <FabMain size={250} className={(toggleStream) ? classes.fabActive : classes.fab}>
          <div className={(toggleStream) ? classes.vidiconActive : classes.vidicon}>
            <video ref={videoRef} style={{position: 'relative', marginLeft:'-50px', marginTop:'-25px'}}/>
          </div>
        </FabMain>
        <div style={{height:'20px', width:'150px', textAlign:'center', position:'relative', left:'-67px',
          verticalAlign:'middle', display:'flex', flexDirection:'row', whiteSpace:'nowrap', marginTop: '-35px', color:'white'}}>
            <img style={{position:'relative', width:'25px', height:'25px', marginTop:'-10px', marginLeft: '35px'}} src={localStream ? participants.local.information.avatarSrc : participants.remote.get(remotes[userIndex])?.information.avatarSrc}  alt=''/>
            <p style={{position:'relative', marginTop:'-6px', marginLeft:'4px'}}>{localStream ? participants.local.information.name : participants.remote.get(remotes[userIndex])?.information.name}</p>
        </div>
      </Collapse>
    </div >
    }}</Observer>
  //},
    // eslint-disable-next-line react-hooks/exhaustive-deps
  //  []

   // )
}
ZoneAvatar.displayName = 'ZoneAvatar'
