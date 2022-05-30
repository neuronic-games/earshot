import {ErrorDialog} from '@components/error/ErrorDialog'
import {BMProps} from '@components/utils'
import {acceleratorText2El} from '@components/utils/formatter'
//import megaphoneIcon from '@iconify/icons-mdi/megaphone'
//import {Icon} from '@iconify/react'
import {Collapse} from '@material-ui/core'
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
import {useTranslation} from '@models/locales'
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef} from 'react'
import {AdminConfigForm} from './adminConfig/AdminConfigForm'
import {BroadcastControl} from './BroadcastControl'
import {FabMain, FabWithTooltip} from './FabEx'
import {StereoSwitchControl} from './StereoSwitchControl'
import {BroadcastVideoControl} from './BroadcastVideoControl'
import { SettingsControl } from './SettingsControl'
//import {ShareButton} from './share/ShareButton'
//import {StereoAudioSwitch} from './StereoAudioSwitch'
import CheckBoxIcon from '@material-ui/icons/Done'
import MoreIcon from '@images/whoo-screen_btn-more.png'
import {ShareDialogItem} from './share/SharedDialogItem'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
//import { SettingsControl } from './SettingsControl'
import Container from '@material-ui/core/Container'
//import {connection} from '@models/api/ConnectionDefs' // For checking Host
import {connection} from '@models/api'
import {MessageType} from '@models/api/MessageType'
import { isSmartphone } from '@models/utils'

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
    width: isSmartphone() ? '90px' : '57px',
    height: isSmartphone() ? '90px' : '57px',
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
    minWidth : 530,
    pointerEvents: 'none',
  },
  wrapper:{width:'100%'},
  wrapperInner:{width:'100%', display:'flex', alignItems:'flex-end'},
})

class Member{
  timeoutOut:NodeJS.Timeout|undefined = undefined
  touched = false
   // For canvas context menu
   downTime = 0
   upTime = 0
}

let buttonClickStatus:boolean = false
export function getVideoButtonStatus():boolean {
  return buttonClickStatus
}

export const Footer: React.FC<BMProps&{height?:number}> = (props) => {
  const {map, participants} = props.stores
  //  showor not
  const [show, setShow] = React.useState<boolean>(false)
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false)
  const [showShare, setShowShareRaw] = React.useState<boolean>(false)
  const [openSettiong, setOpenSettiong] = React.useState<boolean>(false)

  // For Video Stream
  //const [vidStream, setVidStream] = React.useState<boolean>(false)
  //const [toggleIcon, setToggleIcon] = React.useState<boolean>(false)

  //console.log(props.stores.roomInfo.password, " pass")

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

  const store = props.stores.participants
  const ids = useObserver(() => Array.from(store.remote.keys()).filter((id) => {
    const remote = store.find(id)!
    //console.log(participants.local.tracks.avatarStream, " local Video status")
    if(remote.tracks.avatarStream !== undefined) {
        return remote
    }
    return undefined
  }))

  //console.log(ids.length, " in footer")

  /* if(participants.local.tracks.avatarStream !== undefined) {
    ids.push(participants.localId)
  } */


/* const [streamUser, setStreamUser] = React.useState(ids)
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
 */




  // For Check user video stream
  //let userIndex:number = 0
  const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)

  //console.log(participants.remote, " remote")

  for (const [i] of remotes.entries()) {
    //if(participants.remote.get(remotes[i])?.showVideo) {
    if(participants.remote.get(remotes[i])?.tracks.avatarStream !== undefined) {
      //userIndex = i;
      //break;
    }
  }


  //  observers
  const mute = useObserver(() => ({
    muteA: participants.local.muteAudio,  //  mic
    muteS: participants.local.muteSpeaker,  //  speaker
    muteV: participants.local.muteVideo,  //  camera
    onStage: participants.local.physics.onStage,

    // For video stream
    lStream: participants.local.tracks.avatarStream,
    remoteStream: participants.remote.get(ids[ids.length-1])?.tracks.avatarStream,
  }))

  //  Fab state and menu
  const [deviceInfos, setDeviceInfos] = React.useState<MediaDeviceInfo[]>([])
  const [micMenuEl, setMicMenuEl] = React.useState<Element|null>(null)
  const [speakerMenuEl, setSpeakerMenuEl] = React.useState<Element|null>(null)
  const [videoMenuEl, setVideoMenuEl] = React.useState<Element|null>(null)
  const [settingsMenuEl, setSettingsMenuEl] = React.useState<Element|null>(null)

  const {t} = useTranslation()
  const classes = useStyles()


  // for video
  //const vStatus = useObserver(() => participants.local.trackStates.videoOn)


  //console.log(connection.conference._jitsiConference?.isModerator(), " isModerator")
  //console.log(mute.lStream, " AAAAA")

  // Video stream toggle
  //console.log(ids.length, " ids", vidStream, " --- ", mute.lStream)
  //if(ids.length > 0 && vidStream === false && mute.lStream !== undefined) {
    //console.log("LENGTH >")

    /* participants.local.muteVideo = !mute.muteV
    participants.local.saveMediaSettingsToStorage()
    setVidStream(true) */

  //}

  //  Footer collapse conrtrol
  function checkMouseOnBottom() {
    return map.screenSize[1] - (map.mouse[1] - map.offset[1]) < 90
  }
  const mouseOnBottom = useObserver(checkMouseOnBottom)

  useEffect(() => {
    //console.log(mute.remoteStream, " .. in footer ", mute.lStream?.getTracks(), " : ", mute.muteV)

    //console.log("CALLED EACH TIME - ", mute.muteV)

    if(mute.remoteStream !== undefined || mute.lStream !== undefined) {
      //if(mute.lStream !== undefined) {
        // && vidStream === false
      /* if(!mute.muteV) {
        participants.local.muteVideo = !mute.muteV
        participants.local.saveMediaSettingsToStorage()
        if(vidStream) {
          setVidStream(false)
        } else {
          setVidStream(true)
        }
        //setVidStream(true)
      } */

      ////////////////////////////////////////////////////////////////////


      /* if(mute.remoteStream !== undefined) {
        if(mute.muteV) {
          console.log("mute")
          participants.local.muteVideo = !mute.muteV
          participants.local.saveMediaSettingsToStorage()

        } else {
          console.log("unmute")
          participants.local.muteVideo = !mute.muteV
          participants.local.saveMediaSettingsToStorage()
        }

        if(vidStream) {
          setVidStream(false)
        } else {
          setVidStream(true)
        } */



        ///////////////////////////////////////////////////////////////////

        /* if(mute.muteV) {
          console.log("muted")
          participants.local.muteVideo = !mute.muteV
          participants.local.saveMediaSettingsToStorage()
        } else {
          console.log("unmuted")
          participants.local.muteVideo = !mute.muteV
         participants.local.saveMediaSettingsToStorage()
        }
        if(vidStream) {
          setVidStream(false)
        } else {
          setVidStream(true)
        } */


      //}
    }

    /* if (checkMouseOnBottom()) { member.touched = true }
    setShowFooter(mouseOnBottom || !member.touched) */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [mouseOnBottom, member.touched])
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
            participants.local.muteAudio = !participants.local.muteAudio
            setShowFooter(true)
          }
          if (e.code === 'KeyC') {  //  Create share dialog
            setShowFooter(true)
            setShowShare(true)
            e.preventDefault()
            e.stopPropagation()
          }
          if (e.code === 'KeyL' || e.code === 'Escape') {  //  Leave from keyboard
            //participants.local.physics.awayFromKeyboard = true
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

  //  render footer
  return React.useMemo(() => {
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

      /* return <MenuItem key={info.deviceId}
        onClick={() => { close(info.deviceId) }}
        > { (selected ? '✔\u00A0' : '\u2003') + info.label }</MenuItem>  //  \u00A0: NBSP, u2003: EM space. */
        return <div style={{position:'relative', display:'flex', alignItems:'center', marginLeft:'15px'}}> {selected ? <CheckBoxIcon style={{opacity:'1', position:'absolute', marginLeft:'-10px', fontSize:isSmartphone() ? '3em' : '1.5em'}} /> : <CheckBoxIcon style={{opacity:'0', position:'absolute', marginLeft:'-10px', fontSize:isSmartphone() ? '3em' : '1.5em'}} />}
      <MenuItem key={info.deviceId} style={{fontSize:isSmartphone() ? '2.5em' : '1em', marginLeft:isSmartphone() ? '0.5em' : '0em'}}
        onClick={() => { close(info.deviceId) }}
        > {info.label }
        </MenuItem></div>  //  \u00A0: NBSP, u2003: EM space.
    }

    /* const micMenuItems:JSX.Element[] = [<MenuItem  key = {'broadcast'} ><BroadcastControl {...props} /></MenuItem>]
    const speakerMenuItems:JSX.Element[] = []
    const videoMenuItems:JSX.Element[] = [] */
    const micMenuItems:JSX.Element[] = [<MenuItem key = {'broadcast'} style={{fontSize:isSmartphone() ? '2.5em' : '1em'}} ><BroadcastControl {...props} /></MenuItem>]
    const speakerMenuItems:JSX.Element[] = [<MenuItem key = {'soundLoc'} style={{fontSize:isSmartphone() ? '2.5em' : '1em'}} ><StereoSwitchControl {...props} /></MenuItem>]
    const videoMenuItems:JSX.Element[] = [<MenuItem  key = {'broadcastVideo'} style={{fontSize:isSmartphone() ? '2.5em' : '1em'}} ><BroadcastVideoControl {...props} /></MenuItem>]

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

    return <div ref={containerRef} className={classes.container}>
      <div style={{position:'relative', left:'-50px', top:'0px'}}>
        <FabMain size={fabSize}
          onClick = { () => {
            showMainMenu()
          }}
        >
          {show ? <div className={show ? classes.moreActive : classes.more}>
            <img src={MoreIcon} style={{width:55, height:55, position:'relative', top:isSmartphone() ? '17px' : '2px', left:'-0.5px', transform: isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div>
            : <div className={show ? classes.moreActive : classes.more}>
            <img src={MoreIcon} style={{width:55, height:55, position:'relative', top:isSmartphone() ? '17px' : '2px', left:'-0.5px', transform: isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div> }
        </FabMain>
        </div>
      <Collapse in={true} classes={classes}>
        {/* <StereoAudioSwitch size={fabSize} iconSize={iconSize} {...props}/>
        <FabMain size={fabSize} color={mute.muteS ? 'primary' : 'secondary' }
          aria-label="speaker" onClick={() => {
            participants.local.muteSpeaker = !mute.muteS
            if (participants.local.muteSpeaker) {
              participants.local.muteAudio = true
            }
            participants.local.saveMediaSettingsToStorage()
          }}
          onClickMore = { (ev) => {
            updateDevices(ev)
            setSpeakerMenuEl(ev.currentTarget)
          }}
          >
          {mute.muteS ? <SpeakerOffIcon style={{width:iconSize, height:iconSize}} />
            : <SpeakerOnIcon style={{width:iconSize, height:iconSize}} /> }
        </FabMain>
        <Menu anchorEl={speakerMenuEl} keepMounted={true}
          open={Boolean(speakerMenuEl)} onClose={() => { closeSpeakerMenu('') }}>
          {speakerMenuItems}
        </Menu>

        <FabWithTooltip size={fabSize} color={mute.muteA ? 'primary' : 'secondary' } aria-label="mic"
          title = {acceleratorText2El(t('ttMicMute'))}
          onClick = { () => {
            participants.local.muteAudio = !mute.muteA
            if (!participants.local.muteAudio) {
              participants.local.muteSpeaker = false
            }
            participants.local.saveMediaSettingsToStorage()
          }}
          onClickMore = { (ev) => {
            updateDevices(ev)
            setMicMenuEl(ev.currentTarget)
          } }
          >
          {mute.muteA ? <MicOffIcon style={{width:iconSize, height:iconSize}} /> :
            mute.onStage ?
              <Icon icon={megaphoneIcon} style={{width:iconSize, height:iconSize}} color="gold" />
              : <MicIcon style={{width:iconSize, height:iconSize}} /> }
        </FabWithTooltip>
        <Menu anchorEl={micMenuEl} keepMounted={true}
          open={Boolean(micMenuEl)} onClose={() => { closeMicMenu('') }}>
          {micMenuItems}
        </Menu>

        <FabMain size={fabSize} color={mute.muteV ? 'primary' : 'secondary'} aria-label="camera"
          onClick = { () => {
            participants.local.muteVideo = !mute.muteV
            participants.local.saveMediaSettingsToStorage()
          }}
          onClickMore = { (ev) => {
            updateDevices(ev)
            setVideoMenuEl(ev.currentTarget)
          } }
        >
          {mute.muteV ? <VideoOffIcon style={{width:iconSize, height:iconSize}} />
            : <VideoIcon style={{width:iconSize, height:iconSize}} /> }
        </FabMain>
        <Menu anchorEl={videoMenuEl} keepMounted={true}
          open={Boolean(videoMenuEl)} onClose={() => { closeVideoMenu('') }}>
          {videoMenuItems}
        </Menu>

        <ShareButton {...props} size={fabSize} iconSize={iconSize} showDialog={showShare}
          setShowDialog={setShowShare} />

        <ErrorDialog {...props}/>

        <FabMain size={fabSize} onClick={openAdmin} divRef={adminButton}
          style={{marginLeft:'auto', marginRight:10, opacity:0.1}}>
          <SettingsIcon style={{width:iconSize, height:iconSize}} />
        </FabMain>
        <Popover open={showAdmin} onClose={closeAdmin}
          anchorEl={adminButton.current} anchorOrigin={{vertical:'top', horizontal:'left'}}
          anchorReference = "anchorEl" >
          <AdminConfigForm close={closeAdmin} stores={props.stores}/>
        </Popover> */}
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

        {/* <FabWithTooltip size={fabSize} color={(toggleIcon === false && mute.muteV) ? 'primary' : 'secondary'} aria-label="camera" */}
        <FabWithTooltip size={fabSize} color={mute.muteV ? 'primary' : 'secondary'} aria-label="camera"
          onClick = { () => {
            //if(inzone !== undefined) {
              member.upTime = new Date().getSeconds()
              let timeDiff = member.upTime - member.downTime;
              if(timeDiff > 1) {
              } else {



                //Stop All Stream
                //if(!mute.muteV) {
                  //(mute.lStream, " LEN")
                  //if(mute.lStream === undefined) {

                    /* if(vStatus === false) {
                      participants.local.videoEnabled = true
                    } else {
                      participants.local.videoEnabled = false
                    } */

                    /* if(vStatus === "on") {
                      participants.local.videoOn = ''
                    } else {
                      participants.local.videoOn = 'on'
                    } */

                    // uncomment if needed
                  // connection.conference.sendMessage(MessageType.MUTE_VIDEO, true)


                  //}
                  // Start Local Stream
                  //participants.local.muteVideo = !mute.muteV

                  //console.log(vStatus, " CHECK STATUS")


                  // mute all remote videos

                  connection.conference.sendMessage(MessageType.MUTE_VIDEO, true)

                  participants.local.muteVideo = !mute.muteV
                  participants.local.saveMediaSettingsToStorage()


                  buttonClickStatus = true


                  //setToggleIcon(true)


                //setVidStream(false)

              //}
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

        {/* {toggleIcon === false ? <VideoOffIcon style={{width:iconSize, height:iconSize, color:'white'}} /> */}
          {mute.muteV ? <VideoOffIcon style={{width:iconSize, height:iconSize, color:'white'}} />
            : <VideoIcon style={{width:iconSize, height:iconSize, color:'white'}} /> }
        </FabWithTooltip>
        <Menu anchorEl={videoMenuEl} keepMounted={true}  style={{marginTop:-70}}
          open={Boolean(videoMenuEl)} onChange={() => { closeVideoMenu('') }} onClose={() => { closeVideoMenu('') }}>
          {videoMenuItems}
        </Menu>

        {/* <ShareButton {...props} size={fabSize} iconSize={iconSize} showDialog={showShare}
          setShowDialog={setShowShare} /> */}

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
              //setSettingsMenuEl(ev.currentTarget)
              openAdmin()
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
                setOpenSettiong(true)
            }, 500)
          }}
          >
            <SettingsIcon style={{width:iconSize, height:iconSize, color:'white'}} />
        </FabMain>

        <Menu anchorEl={settingsMenuEl} keepMounted={false} style={openSettiong ? {marginTop:-70, display:'block'} : {marginTop:-70, display:'none'}}
          //open={Boolean(settingsMenuEl)} /* onClick={() => { setTimeout(()=>{closeSettingsMenu('')},100)}} */ onClose={() => { closeSettingsMenu('') }}>
          open={Boolean(settingsMenuEl)} onClick={() => { setTimeout(()=>{setOpenSettiong(false)},100)}} onClose={() => { closeSettingsMenu('') }}>
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
    show, showAdmin, showShare, micMenuEl, speakerMenuEl, videoMenuEl, settingsMenuEl, openSettiong, deviceInfos]

    )
}
Footer.displayName = 'Footer'
