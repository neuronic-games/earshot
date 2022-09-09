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

//import ExitIcon from '@material-ui/icons/ExitToApp'

import smileIcon from '@images/whoo-screen_btn-smile.png'
/* import symSmileIcon from '@images/whoo-screen_sym-smile.png' */
import clapIcon from '@images/whoo-screen_btn-clap.png'
/* import symClapIcon from '@images/whoo-screen_sym-clap.png' */
import handIcon from '@images/whoo-screen_btn-hand.png'
/* import symHandIcon from '@images/whoo-screen_sym-hand.png' */


/* import {useTranslation} from '@models/locales' */
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef} from 'react'
/* import {AdminConfigForm} from './adminConfig/AdminConfigForm' */
/* import {BroadcastControl} from './BroadcastControl' */
import {FabMain} from '@components/utils/FabEx'
import {isSmartphone} from '@models/utils'

/* import {ShareButton} from './share/ShareButton'
import {StereoAudioSwitch} from './StereoAudioSwitch' */

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
    width: isSmartphone() ? '100px' : '45px',
    height: isSmartphone() ? '90px' : '45px',
    textAlign: 'center',
  },
}

const useStyles = makeStyles({
  emoticon:{
    //display: 'block',
    height: 50,
    position:'relative',
    cursor: 'pointer',
    backgroundColor: '#9e886c', //  '#ef4623' : '#9e886c',
    right: 0,
    ...buttonStyle,
  },
  emoticonActive:{
    display: 'block',
    height: 50,
    position:'relative',
    cursor: 'pointer',
    backgroundColor: '#ef4623', //  '#ef4623' : '#9e886c',
    right: 0,
    ...buttonStyle,
  },
  container:{
    position: 'absolute',
    width: '30%',
    /* top: '70%', */
    bottom: 15,
    right:0,
    padding: 0,
    outline: 'none',
    pointerEvents: 'none',
  },
  wrapper:{width:'100%'},
  wrapperInner:{width:'100%', display:'flex', flexDirection:'column', alignItems:'flex-end'},
})

class Member{
  timeoutOut:NodeJS.Timeout|undefined = undefined
  touched = false
}

export const Emoticons: React.FC<BMProps&{height?:number}> = (props) => {
  const {map, participants} = props.stores

  //console.log(Object(participants.local).Blob " >>zone")

  //  showor not
  //const [show, setShow] = React.useState<boolean>(true)
  //const [showAdmin, setShowAdmin] = React.useState<boolean>(false)
  //const [showShare, setShowShareRaw] = React.useState<boolean>(false)

  // For toggle emoticons
  const [toggleSmile, setToggleSmile] = React.useState<boolean>(false)
  const [toggleClap, setToggleClap] = React.useState<boolean>(false)
  const [toggleHand, setToggleHand] = React.useState<boolean>(false)


  /* function setShowShare(flag: boolean) {
    if (flag) {
      map.keyInputUsers.add('shareDialog')
    }else {
      map.keyInputUsers.delete('shareDialog')
    }
    //setShowShareRaw(flag)
  } */

  const memberRef = useRef<Member>(new Member())
  const member = memberRef.current
  const containerRef = useRef<HTMLDivElement>(null)
  //const adminButton = useRef<HTMLDivElement>(null)
  //  observers
  /*
   */
  //  Fab state and menu
  /* const [deviceInfos, setDeviceInfos] = React.useState<MediaDeviceInfo[]>([])
  const [micMenuEl, setMicMenuEl] = React.useState<Element|null>(null)
  const [speakerMenuEl, setSpeakerMenuEl] = React.useState<Element|null>(null)
  const [videoMenuEl, setVideoMenuEl] = React.useState<Element|null>(null) */

  /* const {t} = useTranslation() */
  const classes = useStyles()

  //  Footer collapse conrtrol
  function checkMouseOnBottom() {
    return map.screenSize[1] - (map.mouse[1] - map.offset[1]) < 90
  }
  const mouseOnBottom = useObserver(checkMouseOnBottom)
  useEffect(() => {
    if (checkMouseOnBottom()) { member.touched = true }
    setShowFooter(mouseOnBottom || !member.touched)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [mouseOnBottom, member.touched])
  function setShowFooter(show: boolean) {
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
  }

  //  keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      //  console.log(`onKeyDown: code: ${e.code}`)
      /* if (map.keyInputUsers.size === 0) {
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
            participants.local.awayFromKeyboard = true
          }
        }
      } */
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
    /* function makeMenuItem(info: MediaDeviceInfo, close:(did:string) => void):JSX.Element {
      let selected = false
      if (info.kind === 'audioinput') {
        selected = info.deviceId === participants.local.devicePreference.audioInputDevice
      }else if (info.kind === 'audiooutput') {
        selected = info.deviceId === participants.local.devicePreference.audioOutputDevice
      }else if (info.kind === 'videoinput') {
        selected = info.deviceId === participants.local.devicePreference.videoInputDevice
      }

      return <MenuItem key={info.deviceId}
        onClick={() => { close(info.deviceId) }}
        > { (selected ? '✔\u00A0' : '\u2003') + info.label }</MenuItem>  //  \u00A0: NBSP, u2003: EM space.
    } */

    /* const micMenuItems:JSX.Element[] = [<MenuItem  key = {'broadcast'} ><BroadcastControl {...props} /></MenuItem>]
    const speakerMenuItems:JSX.Element[] = []
    const videoMenuItems:JSX.Element[] = [] */
    /* deviceInfos.forEach((info) => {
      if (info.kind === 'audioinput') {
        const broadcastControl = micMenuItems.pop() as JSX.Element
        micMenuItems.push(makeMenuItem(info, closeMicMenu))
        micMenuItems.push(broadcastControl)
      }
      if (info.kind === 'audiooutput') {
        speakerMenuItems.push(makeMenuItem(info, closeSpeakerMenu))
      }
      if (info.kind === 'videoinput') {
        videoMenuItems.push(makeMenuItem(info, closeVideoMenu))
      }
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
    } */

    //  Device list update when the user clicks to show the menu
    //const fabSize = props.height
    const iconSize = 55 //props.height ? props.height * 0.7 : 55
    /* function updateDevices(ev:React.PointerEvent | React.MouseEvent | React.TouchEvent) {
      navigator.mediaDevices.enumerateDevices()
      .then(setDeviceInfos)
      .catch(() => { console.log('Device enumeration error') })
    }

    function openAdmin(){
      map.keyInputUsers.add('adminForm')
      setShowAdmin(true)
    }
    function closeAdmin(){
      map.keyInputUsers.delete('adminForm')t
      setShowAdmin(false)
    } */

    function toggleSmileButton() {
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
    }

    return <div ref={containerRef} className={classes.container}>
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

        <ErrorDialog {...props}/> */}

        {/* ADD ANIMATED ICONS*/}

        {/* <div className={toggleSmile ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleSmileButton}>
          <img src={smileIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-5px'}} alt='' />
        </div>

        <div className={toggleClap ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleClapButton}>
          <img src={clapIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-5px'}} alt='' />
        </div>

        <div className={toggleHand ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleHandButton}>
          <img src={handIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-4px'}} alt='' />
        </div> */}

        <FabMain size={isSmartphone() ? 100 : 45}
          onClick = { () => {
            toggleSmileButton()
          }}
        >
          {toggleSmile ? <div className={classes.emoticonActive}>
            <img src={smileIcon} style={{width:iconSize, height:iconSize, position:'relative', top:isSmartphone() ? '17px' : '-5px', left:isSmartphone() ? '0px' : '-5px', transform : isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div>
            : <div className={classes.emoticon}>
            <img src={smileIcon} style={{width:55, height:55, position:'relative', top:isSmartphone() ? '17px' : '-5px', left:isSmartphone() ? '0px' : '-5px', transform : isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div> }
        </FabMain>
        <FabMain size={isSmartphone() ? 100 : 45}
          onClick = { () => {
            toggleClapButton()
          }}
        >
          {toggleClap ? <div className={classes.emoticonActive}>
            <img src={clapIcon} style={{width:iconSize, height:iconSize, position:'relative', top:isSmartphone() ? '17px' : '-5px', left:isSmartphone() ? '0px' : '-5px', transform : isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div>
            : <div className={classes.emoticon}>
            <img src={clapIcon} style={{width:55, height:55, position:'relative', top:isSmartphone() ? '17px' : '-5px', left:isSmartphone() ? '0px' : '-5px', transform : isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div> }
        </FabMain>
        <FabMain size={isSmartphone() ? 100 : 45}
          onClick = { () => {
            toggleHandButton()
          }}
        >
          {toggleHand ? <div className={classes.emoticonActive}>
            <img src={handIcon} style={{width:iconSize, height:iconSize, position:'relative', top:isSmartphone() ? '17px' : '-5px', left:isSmartphone() ? '0px' : '-5px', transform : isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div>
            : <div className={classes.emoticon}>
            <img src={handIcon} style={{width:55, height:55, position:'relative', top:isSmartphone() ? '17px' : '-5px', left:isSmartphone() ? '0px' : '-5px', transform : isSmartphone() ? 'scale(2)' : 'scale(1)'}} alt=""/></div> }
        </FabMain>

        {/* <FabMain size={45} onClick={toggleSmileButton}
            >
            <div className={toggleSmile ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleSmileButton}>
              <img src={smileIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-5px'}} alt='' />
            </div>
          </FabMain>
          <FabMain size={45} onClick={toggleClapButton}
            >
           <div className={toggleClap ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleClapButton}>
            <img src={clapIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-5px'}} alt='' />
          </div>
          </FabMain>
          <FabMain size={45} onClick={toggleHandButton}
            >
            <div className={toggleHand ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleHandButton}>
              <img src={handIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-4px'}} alt='' />
            </div>
          </FabMain> */}

        {/*
        <MuiThemeProvider theme={theme}>
          <FabMain size={45} onClick={toggleSmileButton} color={toggleSmile ? 'secondary' : 'primary' }
            style={{marginLeft:'57%', opacity:1}}>
            <img src={smileIcon} style={{width:iconSize, height:iconSize}} alt='' />
          </FabMain>
          <FabMain size={45} onClick={toggleClapButton} color={toggleClap ? 'secondary' : 'primary' }
            style={{marginLeft:'0em', opacity:1}}>
            <img src={clapIcon} style={{width:iconSize, height:iconSize}} alt='' />
          </FabMain>
          <FabMain size={45} onClick={toggleHandButton} color={toggleHand ? 'secondary' : 'primary' }
            style={{marginLeft:'0em', opacity:1}}>
            <img src={handIcon} style={{width:iconSize, height:iconSize}} alt='' />
          </FabMain>
        </MuiThemeProvider>
 */}

        {/* <FabMain size={fabSize} onClick={openAdmin} divRef={adminButton}
          style={{marginLeft:'auto', marginRight:10, opacity:0.1}}>
          <SettingsIcon style={{width:iconSize, height:iconSize}} />
        </FabMain>
        <Popover open={showAdmin} onClose={closeAdmin}
          anchorEl={adminButton.current} anchorOrigin={{vertical:'top', horizontal:'left'}}
          anchorReference = "anchorEl" >
          <AdminConfigForm close={closeAdmin} stores={props.stores}/>
        </Popover> */}

      </Collapse>
    </div >
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleSmile, toggleClap, toggleHand]

    )
}
Emoticons.displayName = 'Emoticons'
