import {ErrorDialog} from '@components/error/ErrorDialog'
import {BMProps} from '@components/utils'
import {acceleratorText2El} from '@components/utils/formatter'
//import megaphoneIcon from '@iconify/icons-mdi/megaphone'
//import {Icon} from '@iconify/react'
import Collapse from '@material-ui/core/Collapse'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import {makeStyles} from '@material-ui/core/styles'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import SettingsIcon from '@material-ui/icons/Settings'
import VideoIcon from '@material-ui/icons/Videocam'
import VideoOffIcon from '@material-ui/icons/VideocamOff'
import SpeakerOffIcon from '@material-ui/icons/VolumeOff'
import SpeakerOnIcon from '@material-ui/icons/VolumeUp'
//import HeadsetIcon from '@material-ui/icons/HeadsetMic'

import CheckBoxIcon from '@material-ui/icons/Done';

/* import smileIcon from '@images/whoo-screen_btn-smile.png'
import symSmileIcon from '@images/whoo-screen_sym-smile.png'
import clapIcon from '@images/whoo-screen_btn-clap.png'
import symClapIcon from '@images/whoo-screen_sym-clap.png'
import handIcon from '@images/whoo-screen_btn-hand.png'
import symHandIcon from '@images/whoo-screen_sym-hand.png' */

import MoreIcon from '@images/whoo-screen_btn-more.png'



import {useTranslation} from '@models/locales'
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef} from 'react'
import {AdminConfigForm} from './adminConfig/AdminConfigForm'
import {BroadcastControl} from './BroadcastControl'
import {StereoSwitchControl} from './StereoSwitchControl'
//import {SettingsControl} from './SettingsControl'
import {BroadcastVideoControl} from './BroadcastVideoControl'
import {FabMain, FabWithTooltip} from './FabEx'
import {ShareButton} from './share/ShareButton'
//import {StereoAudioSwitch} from './StereoAudioSwitch'
//import UploadIcon from '@material-ui/icons/Publish'
//import DownloadIcon from '@material-ui/icons/GetApp'
//import RoomPreferencesIcon from '@material-ui/icons/Settings'

import {ShareDialogItem} from './share/SharedDialogItem'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SettingsControl } from './SettingsControl'
import Container from '@material-ui/core/Container'
//import {isSmartphone} from '@models/utils'



const theme = createMuiTheme({
  palette: {
    primary: { main: '#7ececc' },
    secondary: { main: '#ef4623' }
  }
});

const buttonStyle = {
  '&': {
    margin: '5px',
    borderRadius: '50%',
    width: '57px',
    height: '57px',
    textAlign: 'center',
  },
}
const useStyles = makeStyles({
  menu:{
    position: 'absolute',
    width: '100%',
    left: '-100%',
    opacity: 0,
    transition: '0.5s ease-out',
  },
  menuActive:{
    position: 'absolute',
    width: '100%',
    opacity: 1,
    left: 0,
    transition: '0.5s ease-out',
  },
  more:{
    display: 'inline-block',
    height: 50,
    position:'relative',
    cursor: 'pointer',
    backgroundColor: '#bcbec0', //  '#ef4623' : '#9e886c', bcbec0
    right: 0,
    left: 0,
    bottom:0,
    ...buttonStyle,
  },
  moreActive:{
    display: 'inline-block',
    height: 50,
    position:'relative',
    cursor: 'pointer',
    backgroundColor: '#ef4623', //  '#ef4623' : '#9e886c',
    right: 0,
    left:0,
    bottom:0,
    ...buttonStyle,
  },

  container:{
    position: 'absolute',
    width: '100%',
    bottom: 5,
    padding: 0,
    left: 60,
    outline: 'none',
    pointerEvents: 'none',
  },
  wrapper:{width:'100%'},
  wrapperInner:{width:'100%', display:'flex', alignItems:'flex-end'},
})

class Member{
  timeoutOut:NodeJS.Timeout|undefined = undefined
  touched = false

  // For sub menu
  downTime = 0
  upTime = 0
}

export const Footer: React.FC<BMProps&{height?:number}> = (props) => {
  const {map, participants} = props.stores
  //  showor not
  const [show, setShow] = React.useState<boolean>(false)
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false)
  const [showShare, setShowShareRaw] = React.useState<boolean>(false)

  const [vidStream, setVidStream] = React.useState<boolean>(false)

  // For toggle emoticons
  /* const [toggleSmile, setToggleSmile] = React.useState<boolean>(false)
  const [toggleClap, setToggleClap] = React.useState<boolean>(false)
  const [toggleHand, setToggleHand] = React.useState<boolean>(false) */


  function setShowShare(flag: boolean) {
    if (flag) {
      map.keyInputUsers.add('shareDialog')
    }else {
     map.keyInputUsers.delete('shareDialog')
    }
    setShowShareRaw(flag)
  }

  const memberRef = useRef<Member>(new Member())
  const member = memberRef.current
  const containerRef = useRef<HTMLDivElement>(null)
  const adminButton = useRef<HTMLDivElement>(null)

  let userIndex:number = 0

  const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)

  for (const [i] of remotes.entries()) {
    //console.log(participants.remote.get(remotes[i])?.showVideo, " Video Status")
   //pp = participants.remote.get(remotes[i])?.showVideo
   //const startStream = useObserver(() => _status)
    if(participants.remote.get(remotes[i])?.showVideo) {
      userIndex = i;
      break;
    }
  }

  //  observers
  const mute = useObserver(() => ({
    muteA: participants.local.muteAudio,  //  mic
    muteS: participants.local.muteSpeaker,  //  speaker
    muteV: participants.local.muteVideo,  //  camera
    onStage: participants.local.physics.onStage,
    lStream: participants.local.tracks.avatarStream,
    remoteStream: participants.remote.get(remotes[userIndex])?.tracks.avatarStream,
    //onHeadPhone: participants.local.physics.onHeadPhone
    //onHeadPhone: participants.local.trackStates.headphone
  }))
  //  Fab state and menu
  const [deviceInfos, setDeviceInfos] = React.useState<MediaDeviceInfo[]>([])
  const [micMenuEl, setMicMenuEl] = React.useState<Element|null>(null)
  const [speakerMenuEl, setSpeakerMenuEl] = React.useState<Element|null>(null)
  const [videoMenuEl, setVideoMenuEl] = React.useState<Element|null>(null)
  const [settingsMenuEl, setSettingsMenuEl] = React.useState<Element|null>(null)



  //console.log(mute.muteV, " on change")

  // check for remote video playing or not

  //for (const [i] of remotes.entries()) {
    //console.log(participants.remote.get(remotes[i])?.showVideo, " Video Status")
   //pp = participants.remote.get(remotes[i])?.showVideo
   //const startStream = useObserver(() => _status)
  //}
  /* const startStream = useObserver(() => Boolean(participants.remote.get(remotes[0])?.showVideo))
  // Check video status
  if(startStream && !mute.muteV) {
    participants.local.muteVideo = true
    participants.local.saveMediaSettingsToStorage()
  } */

  //mute.muteV = !mute.muteV

  //console.log(participants.local.showVideo, " status")

  //const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)

// Checing events
const localStream = useObserver(() => Boolean(participants.local.showVideo))
const startStream = useObserver(() => Boolean(participants.remote.get(remotes[userIndex])?.showVideo))
//const avStream = useObserver(() =>  participants.remote.get(remotes[0])?.tracks.avatarStream)

/* const [toggleStream, setToggleStream] = React.useState<boolean>(startStream ? startStream : (localStream ? localStream : false)) */


//console.log("-----------", mute.remoteStream, "---", participants.remote.get(remotes[userIndex])?.muteVideo)

//const em = useObserver(() => Boolean(participants.local.emoticon))




if(mute.remoteStream !== undefined && mute.lStream !== undefined) {
  //mute.muteV = !mute.muteV
  //console.log("enter 1st")
  //participants.local.muteVideo = !mute.muteV
  //participants.local.saveMediaSettingsToStorage()
  //setVidStream(true)
  setTimeout(function(){
    //console.log("enter 2nd")
    //participants.local.muteVideo = !mute.muteV
    //participants.local.saveMediaSettingsToStorage()
    //setVidStream(true)
  }, 500)
}

  //console.log(settingsMenuEl, " onLoaded")
  // const local = participants.local
  //const statusBroadcastVideo = useObserver(() => !mute.muteV)
  //console.log(mute.muteV, " statusBroadcastVideo")
  //const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
  //if(!mute.muteV) {
    //console.log(mute.muteV)
    //participants.local.muteVideo = !mute.muteV
    //participants.local.saveMediaSettingsToStorage()
    /* for (const [i] of remotes.entries()) {
      let users = Object(participants.remote.get(remotes[i]))
      users.muteVideo = false
    } */
  //}



  //const inzone = useObserver(() => participants.local.zone?.zone)
  //const headphone = useObserver(() => participants.local.trackStates.headphone)
  //const soundLocalizationBase = useObserver(() => participants.local.soundLocalizationBase)
  //const stereo = useObserver(() => participants.local.useStereoAudio)

  //console.log(mute.onHeadPhone)


  //if(inzone !== undefined) {
  //console.log(inzone, " >>footer zone")

  const {t} = useTranslation()
  const classes = useStyles()

  //  Footer collapse conrtrol
  function checkMouseOnBottom() {
    return map.screenSize[1] - (map.mouse[1] - map.offset[1]) < 90
  }
  const mouseOnBottom = useObserver(checkMouseOnBottom)

  useEffect(() => {
    //participants.local.muteVideo = !mute.muteV
    //participants.local.saveMediaSettingsToStorage()

    console.log(mute.remoteStream, " .. in footer")
    if(mute.remoteStream !== undefined && mute.lStream !== undefined) {
      if(!mute.muteV) {
        participants.local.muteVideo = !mute.muteV
        participants.local.saveMediaSettingsToStorage()
        if(vidStream) {
          setVidStream(false)
        } else {
          setVidStream(true)
        }
      }
    }

   //if (checkMouseOnBottom()) { member.touched = true }
    //setShowFooter(mouseOnBottom || !member.touched)
    // eslint-disable-next-line react-hooks/exhaustive-deps
//  [mouseOnBottom, member.touched]
  }, [mute.remoteStream, mute.lStream, mute.muteV, participants.local, vidStream, mouseOnBottom, member.touched])
//}, [mouseOnBottom, member.touched])

  function setShowFooter(show: boolean) {
    if (show) {
      setShow(true)
      if (member.timeoutOut) {
        clearTimeout(member.timeoutOut)
        member.timeoutOut = undefined
      }
      containerRef.current?.focus()
    }else {
      if (!member.timeoutOut) {
        member.timeoutOut = setTimeout(() => {
          setShow(false)
          member.timeoutOut = undefined
        },                             500)
      }
    }
  }

  //  keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      //  console.log(`onKeyDown: code: ${e.code}`)
      if (map.keyInputUsers.size === 0) {
        if (!e.ctrlKey && !e.metaKey && !e.altKey){
          if (e.code === 'KeyM') {  //  mute/unmute audio
            //participants.local.muteAudio = !participants.local.muteAudio
            setShowFooter(true)
          }
          if (e.code === 'KeyC') {  //  Create share dialog
            setShowFooter(true)
            setShowShare(true)
            e.preventDefault()
            e.stopPropagation()
          }
          if (e.code === 'KeyL' || e.code === 'Escape') {  //  Leave from keyboard
            participants.local.awayFromKeyboard = true
          }
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [])

  /* if(show) {
  window.addEventListener('click', (ev) => {

      setShow(false)


    ev.preventDefault()
    ev.stopPropagation()
  },                      {passive: false, capture: false})
} */

/* function checkToggle() {
  setToggleStream(startStream ? startStream : (localStream ? localStream : false))
} */

/* useEffect(() => {
  //if (videoRef?.current !== null) {
    console.log("AAABBBB - ", localStream, " ---- ", startStream)
    checkToggle()
  //}

  },) */
  //useEffect(() => {
    //console.log(avStream, " onLoad-", mute.muteRV)
    /* if((avStream !== undefined) && (vidStream === false)) {
      participants.local.muteVideo = !mute.muteV
      participants.local.saveMediaSettingsToStorage()
      //setShowFooter(true)
      setVidStream(true)
    } */
    //console.log("AAAAA")
  //})

  //  render footer
  return React.useMemo(() => {

    //if(startStream && localStream) {
      //console.log("Check")
      //participants.local.muteVideo = !mute.muteV
      //participants.local.saveMediaSettingsToStorage()
      //closeVideoMenu('')
    //}

    //  Create menu list for device selection
    function makeMenuItem(info: MediaDeviceInfo, close:(did:string) => void):JSX.Element {
      let selected = false
      if (info.kind === 'audioinput') {
        selected = info.deviceId === participants.local.devicePreference.audioInputDevice
      }else if (info.kind === 'audiooutput') {
        selected = info.deviceId === participants.local.devicePreference.audioOutputDevice
      }else if (info.kind === 'videoinput') {
        selected = info.deviceId === participants.local.devicePreference.videoInputDevice
      }

      // > { (selected ? '✔\u00A0' : '\u2003') + info.label }</MenuItem>  //  \u00A0: NBSP, u2003: EM space.
      //const _fontSize = isSmartphone() ? '2em' : '1em'

      return <div style={{position:'relative', display:'flex', alignItems:'center', marginLeft:'15px'}}> {selected ? <CheckBoxIcon style={{opacity:'1', position:'absolute', marginLeft:'-10px'}} /> : <CheckBoxIcon style={{opacity:'0', position:'absolute', marginLeft:'-10px'}} />}
      <MenuItem key={info.deviceId}
        onClick={() => { close(info.deviceId) }}
        > {info.label }
        </MenuItem></div>  //  \u00A0: NBSP, u2003: EM space.
    }


    const micMenuItems:JSX.Element[] = [<MenuItem key = {'broadcast'} ><BroadcastControl {...props} /></MenuItem>]
    const speakerMenuItems:JSX.Element[] = [<MenuItem key = {'soundLoc'} ><StereoSwitchControl {...props} /></MenuItem>]
    const videoMenuItems:JSX.Element[] = [<MenuItem  key = {'broadcastVideo'} ><BroadcastVideoControl {...props} /></MenuItem>]

    /* const settingsMenuItems:JSX.Element[] = [<MenuItem style={{display:'flex', flexDirection:'column'}}><ShareDialogItem
      key="shareImport" onClick={()=>console.log('Import')} text={t('shareImport')} icon={<UploadIcon/>}
    /><ShareDialogItem
    key="shareDownload" text={t('shareDownload')} icon={<DownloadIcon />}
  /><ShareDialogItem
  key="settingPreference" text={t('settingPreference')} icon={<RoomPreferencesIcon />}
/>
  </MenuItem>] */

  /* icon={<RoomPreferencesIcon />} */

  const settingsMenuItems:JSX.Element[] = [<MenuItem style={{display:'flex', flexDirection:'column', textAlign:'center', marginLeft:'-35px'}} key = {'settingLoc'} ><SettingsControl {...props} /><Container><ShareDialogItem
  key="settingPreference" text={t('settingPreference')} onClick={openAdmin}
/></Container></MenuItem>]

    deviceInfos.forEach((info) => {

      if (info.kind === 'audioinput') {
        const broadcastControl = micMenuItems.pop() as JSX.Element
        micMenuItems.push(makeMenuItem(info, closeMicMenu))
        micMenuItems.push(broadcastControl)
      }
      if (info.kind === 'audiooutput') {
        const stereoSwitchControl = speakerMenuItems.pop() as JSX.Element
        speakerMenuItems.push(makeMenuItem(info, closeSpeakerMenu))
        speakerMenuItems.push(stereoSwitchControl)
      }
      if (info.kind === 'videoinput') {
        const broadcastVidControl = videoMenuItems.pop() as JSX.Element
        videoMenuItems.push(makeMenuItem(info, closeVideoMenu))
        videoMenuItems.push(broadcastVidControl)
      }

      const settingControl = settingsMenuItems.pop() as JSX.Element
      settingsMenuItems.push(settingControl)
    })
    function closeMicMenu(did:string) {
      if (did) {
        participants.local.devicePreference.audioInputDevice = did
        participants.local.saveMediaSettingsToStorage()
      }
      setMicMenuEl(null)
    }
    function closeSpeakerMenu(did:string) {
      if (did) {
        participants.local.devicePreference.audioOutputDevice = did
        participants.local.saveMediaSettingsToStorage()
      }
      setSpeakerMenuEl(null)
    }
    function closeVideoMenu(did:string) {
      if (did) {
        participants.local.devicePreference.videoInputDevice = did
        participants.local.saveMediaSettingsToStorage()
      }
      setVideoMenuEl(null)
    }

    function closeSettingsMenu(did:string) {
        setSettingsMenuEl(null)
    }

    function showMainMenu() {
      if(show) {
        setShow(false)
      } else {
        setShow(true)
      }
    }

    //  Device list update when the user clicks to show the menu
    const fabSize = props.height
    const iconSize = props.height ? props.height * 0.7 : 36
    function updateDevices(ev:React.PointerEvent | React.MouseEvent | React.TouchEvent) {
      navigator.mediaDevices.enumerateDevices()
      .then(setDeviceInfos)
      .catch(() => { console.log('Device enumeration error') })
    }

    function openAdmin(){
      map.keyInputUsers.add('adminForm')
      closeSettingsMenu('')
      setShowAdmin(true)
    }
    function closeAdmin(){
      map.keyInputUsers.delete('adminForm')
      setShowAdmin(false)
    }

    /* function toggleSmileButton() {
      participants.local.emoticon = ''
      setToggleHand(false)
      setToggleClap(false)
      const _timer = setTimeout(()=> {
        clearTimeout(_timer)
        if(toggleSmile) {
          participants.local.emoticon = ''
          setToggleSmile(false)
        } else {
          participants.local.emoticon = 'smile'
          setToggleSmile(true)
        }
      },100)
    }
    function toggleClapButton() {
      participants.local.emoticon = ''
      setToggleHand(false)
      setToggleSmile(false)
      const _timer = setTimeout(()=> {
        clearTimeout(_timer)
        if(toggleClap) {
          participants.local.emoticon = ''
          setToggleClap(false)
        } else {
          participants.local.emoticon = 'clap'
          setToggleClap(true)
        }
      },100)
    }
    function toggleHandButton() {
      participants.local.emoticon = ''
      setToggleClap(false)
      setToggleSmile(false)
      const _timer = setTimeout(()=> {
        clearTimeout(_timer)
        if(toggleHand) {
          participants.local.emoticon = ''
          setToggleHand(false)
        } else {
          participants.local.emoticon = 'hand'
          setToggleHand(true)
        }
      },100)
    } */

    return <div ref={containerRef} className={classes.container}>
        {/* <div className={show ? classes.moreActive : classes.more} onClick={showMainMenu}>
            <img src={MoreIcon} style={{width:55, height:55, position:'relative', top:'2px', left:'-0.5px'}} alt=""/>
        </div> */ }
        <div style={{position:'relative', left:'-50px', top:'0px'}}>
        <FabMain size={fabSize}
          onClick = { () => {
            showMainMenu()
          }}
        >
          {show ? <div className={show ? classes.moreActive : classes.more}>
            <img src={MoreIcon} style={{width:55, height:55, position:'relative', top:'2px', left:'-0.5px'}} alt=""/></div>
            : <div className={show ? classes.moreActive : classes.more}>
            <img src={MoreIcon} style={{width:55, height:55, position:'relative', top:'2px', left:'-0.5px'}} alt=""/></div> }
        </FabMain>
        </div>

      <Collapse in={true} classes={classes}>
        <div className={show ? classes.menuActive : classes.menu}>
        <MuiThemeProvider theme={theme}>
        {/* <StereoAudioSwitch size={fabSize} iconSize={iconSize} {...props}/> */ }
        <FabMain size={fabSize} color={mute.muteS ? 'primary' : 'secondary' }
          aria-label="speaker" onClick={(ev) => {
            member.upTime = new Date().getSeconds()
            let timeDiff = member.upTime - member.downTime;
            if(timeDiff > 1) {
            } else {
              participants.local.muteSpeaker = !mute.muteS
              if (participants.local.muteSpeaker) {
                participants.local.muteAudio = true
              }
              participants.local.saveMediaSettingsToStorage()
            }
          }}
          onDown={(ev) => {
            member.downTime = new Date().getSeconds()
            let _ev = ev
            let _target = ev.currentTarget
            const _timer = setTimeout(()=> {
              clearTimeout(_timer)
              let timeDiff = member.upTime - member.downTime;
              if(timeDiff >= 0) return
              updateDevices(_ev)
              setSpeakerMenuEl(_target)
            }, 500)
          }}
          onClickMore = { (ev) => {
            updateDevices(ev)
            setSpeakerMenuEl(ev.currentTarget)
          }}
          >

          {mute.muteS ? <SpeakerOffIcon style={{width:iconSize, height:iconSize, color:'white'}} /> /* :
          stereo ?
            <HeadsetIcon style={{width:iconSize, height:iconSize, color:'gold'}} /> */
            : <SpeakerOnIcon style={{width:iconSize, height:iconSize, color:'white'}} /> }
        </FabMain>
        <Menu anchorEl={speakerMenuEl} keepMounted={false} style={{marginTop:-70}}
          open={Boolean(speakerMenuEl)} onChange={() => { closeSpeakerMenu('') }} onClose={() => { closeSpeakerMenu('') }}>
          {speakerMenuItems}
        </Menu>

        <FabWithTooltip size={fabSize} color={mute.muteA ? 'primary' : 'secondary' } aria-label="mic"
          title = {acceleratorText2El(t('ttMicMute'))}
          onClick = { () => {
            member.upTime = new Date().getSeconds()
            let timeDiff = member.upTime - member.downTime;
            if(timeDiff > 1) {
            } else {
              participants.local.muteAudio = !mute.muteA
              if (!participants.local.muteAudio) {
                participants.local.muteSpeaker = false
              }
              participants.local.saveMediaSettingsToStorage()
            }
          }}
          onDown={(ev) => {
            member.downTime = new Date().getSeconds()
            let _ev = ev
            let _target = ev.currentTarget
            const _timer = setTimeout(()=> {
              clearTimeout(_timer)
              let timeDiff = member.upTime - member.downTime;
              if(timeDiff >= 0) return
              updateDevices(_ev)
              setMicMenuEl(_target)
            }, 500)
          }}
          onClickMore = { (ev) => {
            updateDevices(ev)
            setMicMenuEl(ev.currentTarget)
          } }
          >
          {mute.muteA ? <MicOffIcon style={{width:iconSize, height:iconSize, color:'white'}} /> /* :
            mute.onStage ?
              <Icon icon={megaphoneIcon} style={{width:iconSize, height:iconSize}} color="gold" /> */
              : <MicIcon style={{width:iconSize, height:iconSize, color:'white'}} /> }
        </FabWithTooltip>
        <Menu anchorEl={micMenuEl} keepMounted={true}  style={{marginTop:-70}}
          open={Boolean(micMenuEl)} onChange={() => { closeMicMenu('') }} onClose={() => { closeMicMenu('') }}>
          {micMenuItems}
        </Menu>

        <FabWithTooltip size={fabSize} color={mute.muteV ? 'primary' : 'secondary'} aria-label="camera"
          onClick = { () => {
            //if(inzone !== undefined) {
              member.upTime = new Date().getSeconds()
              let timeDiff = member.upTime - member.downTime;
              if(timeDiff > 1) {
              } else {
                participants.local.muteVideo = !mute.muteV
                participants.local.saveMediaSettingsToStorage()
                //setVidStream(false)
              }
           //}
          }}
          onDown={(ev) => {
            //if(inzone !== undefined) {
              member.downTime = new Date().getSeconds()
              let _ev = ev
              let _target = ev.currentTarget
              const _timer = setTimeout(()=> {
                clearTimeout(_timer)
                let timeDiff = member.upTime - member.downTime;
                if(timeDiff >= 0) return
                updateDevices(_ev)
                setVideoMenuEl(_target)
              }, 500)
            //}
          }}
          onClickMore = { (ev) => {
            updateDevices(ev)
            setVideoMenuEl(ev.currentTarget)
          } }
        >
          {mute.muteV ? <VideoOffIcon style={{width:iconSize, height:iconSize, color:'white'}} />
            : <VideoIcon style={{width:iconSize, height:iconSize, color:'white'}} /> }
        </FabWithTooltip>
        <Menu anchorEl={videoMenuEl} keepMounted={true}  style={{marginTop:-70}}
          open={Boolean(videoMenuEl)} onChange={() => { closeVideoMenu('') }} onClose={() => { closeVideoMenu('') }}>
          {videoMenuItems}
        </Menu>

        <ShareButton {...props} size={fabSize} iconSize={iconSize} showDialog={showShare}
          setShowDialog={setShowShare} />

        <ErrorDialog {...props}/>

        {/* ADD ANIMATED ICONS*/}

        {/* <FabMain size={45} onClick={toggleSmileButton}
          style={{marginLeft:'57%', opacity:1}}>
          <img src={toggleSmile ? symSmileIcon : smileIcon} style={{width:iconSize, height:iconSize}} alt='' />
        </FabMain>
        <FabMain size={45} onClick={toggleClapButton}
          style={{marginLeft:'0em', opacity:1}}>
          <img src={toggleClap ? symClapIcon : clapIcon} style={{width:iconSize, height:iconSize}} alt='' />
        </FabMain>
        <FabMain size={45} onClick={toggleHandButton}
          style={{marginLeft:'0em', opacity:1}}>
          <img src={toggleHand ? symHandIcon : handIcon} style={{width:iconSize, height:iconSize}} alt='' />
        </FabMain> */}


        {/* position:'inherit', right:120, top:'15px' */}


        <FabMain size={fabSize} color={'primary'}
          aria-label="settings" onClick={(ev) => {
            member.upTime = new Date().getSeconds()
            let timeDiff = member.upTime - member.downTime;
            if(timeDiff > 1) {
            } else {
            }
          }}
          onDown={(ev) => {
            member.downTime = new Date().getSeconds()
            //let _ev = ev
            let _target = ev.currentTarget
            const _timer = setTimeout(()=> {
              clearTimeout(_timer)
              let timeDiff = member.upTime - member.downTime;
              if(timeDiff >= 0) return
                setSettingsMenuEl(_target)
            }, 500)
          }}
          >
            <SettingsIcon style={{width:iconSize, height:iconSize, color:'white'}} />
        </FabMain>

        <Menu anchorEl={settingsMenuEl} keepMounted={false} style={{marginTop:-70}}
          open={Boolean(settingsMenuEl)} /* onChange={() => { closeSettingsMenu('') }} */ onClose={() => { closeSettingsMenu('') }}>
          {settingsMenuItems}
        </Menu>


       {/*  <FabMain size={fabSize} onClick={openAdmin} divRef={adminButton} color='primary'
          style={{marginLeft:'auto', marginRight:0, opacity:1, position:'relative', left:10 }}>
          <SettingsIcon style={{width:iconSize, height:iconSize, color:'white'}} />
        </FabMain> */}
        </MuiThemeProvider>
        {/* <Popover open={showAdmin} onClose={closeAdmin}
          anchorEl={adminButton.current} anchorOrigin={{vertical:'top', horizontal:'left'}}
          anchorReference = "anchorEl" >
          <AdminConfigForm close={closeAdmin} stores={props.stores}/>
        </Popover> */}

        <Popover open={showAdmin} onClose={closeAdmin}
          anchorEl={adminButton.current} anchorOrigin={{vertical:330, horizontal:350}}
          anchorReference = "anchorEl" >
          <AdminConfigForm close={closeAdmin} stores={props.stores}/>
        </Popover>

        </div>
      </Collapse>

    </div >
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mute.muteA, mute.muteS, mute.muteV, mute.onStage,
    show, showAdmin, showShare, micMenuEl, speakerMenuEl, videoMenuEl, settingsMenuEl, deviceInfos, startStream, localStream]
    )
}
Footer.displayName = 'Footer'
