import {urlParameters} from '@models/url'
import {isPortrait, isSmartphone} from '@models/utils'
import { rgb2Color } from '@models/utils'
import chatStore from '@stores/Chat'
import errorInfo from '@stores/ErrorInfo'
import mapStore from '@stores/Map'
import participantsStore from '@stores/participants/Participants'
import roomInfo from '@stores/RoomInfo'
import sharedContentsStore from '@stores/sharedContents/SharedContents'
import {Observer} from 'mobx-react-lite'
import React, {Fragment, useRef, useState} from 'react'
import SplitPane from 'react-split-pane'
import {Footer} from './footer/Footer'
import {Emoticons} from './footer/Emoticons'
import {ZoneAvatar} from './footer/ZoneAvatar'
import {LeftBar} from './leftBar/LeftBar'
import {MainScreen} from './map/MainScreen'
import {Map} from './map/map'
import {Stores} from './utils'
import {styleCommon, styleForSplit} from './utils/styles'
/* import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import logo_es from '@images/logo.png'
import DialogContent from '@material-ui/core/DialogContent'
import IdleTimer from 'react-idle-timer' */


export const App: React.FC<{}> = () => {
  const clsSplit = styleForSplit()
  const classes = styleCommon()
  const DEBUG_VIDEO = false //  To see all local and remote tracks or not.
  const stores:Stores = {
    map: mapStore,
    participants: participantsStore,
    contents: sharedContentsStore,
    chat: chatStore,
    roomInfo: roomInfo,
  }

  const refDiv = useRef<HTMLDivElement>(null)
  const refPane = useRef<SplitPane>(null)
  const [able, setAble] = useState<Boolean>(false)

  /////////////////////////////////////////////////////////
  // for Idle
  //const [showDialog, setShowDialog] = useState(false);
  //const [active, setActive] = useState(false);

  //const _idleTimer = useRef(0)

  /* let idleTimeout = 1000 * 5 * 1;  //1 minute
  let idleLogout = 1000 * 10 * 2; //2 Minutes


  useEffect(() => {
    if(showDialog) {
      const logoutTimer = setTimeout(() => {
        console.log("logout timer End")
        clearTimeout(logoutTimer)
        if(!active) {
          window.location.href="./"
        } else {
          setActive(false)
        }
    }, idleLogout);
      return
    }
    const idleTimer = setTimeout(() => {
        console.log("timer End")
        clearTimeout(idleTimer)
        if(!active) {
          setShowDialog(true)
        } else {
          setActive(false)
        }
    }, idleTimeout);
    return () => {
        clearTimeout(idleTimer)
    }
  },);  */

  //////////////////////////////////////////////////////////
  // Idle Events
  /* const handleOnAction = () => {
    console.log('user did something')
  }

  const handleOnActive = () => {
    console.log('user is active')
    console.log('time remaining-',)
  }

  const handleOnIdle = () => {
    console.log('user is idle-')
  } */
  //////////////////////////////////////////////////////////
  let press = false
  // For toggle right panel that has users/contents/chat
  window.addEventListener('keydown', (ev) => {
    //ev.preventDefault()
    if(ev.key === "F3" && press === false) {
      ev.preventDefault()
      press = true;
      if(able === true) {
        setAble(false)
      } else
      if(able === false) {
        setAble(true)
      }
    }
  }, {})

  /* // click
  window.addEventListener('click', (ev) => {
    setActive(true)
    if(showDialog) {
      setShowDialog(false)
    }
    ev.preventDefault()
  },                      {passive: false, capture: false})

  // onmousemove
  window.addEventListener('onmousemove', (ev) => {
    setActive(true)
    if(showDialog) {
      setShowDialog(false)
    }
    ev.preventDefault()
  },                      {passive: false, capture: false})
  // onmousemove
  window.addEventListener('onkeypress', (ev) => {
    setActive(true)
    if(showDialog) {
      setShowDialog(false)
    }
    ev.preventDefault()
  },                    {passive: false, capture: false}) */

  //  toucmove: prevent browser zoom by pinch
  window.addEventListener('touchmove', (ev) => {
    //  if (ev.touches.length > 1) {
    /* setActive(true)
    if(showDialog) {
      setShowDialog(false)
    } */
    ev.preventDefault()
    //  }
  },                      {passive: false, capture: false})
  //  contextmenu: prevent to show context menu with right mouse click
  window.addEventListener('contextmenu', (ev) => {
    /* setActive(true)
    if(showDialog) {
      setShowDialog(false)
    } */
    ev.preventDefault()
  },                      {passive: false, capture: false})

  //  Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    if ((error?.message === 'Ping timeout' || error?.message === 'Strophe: Websocket error [object Event]')
     && message === null && source === null && lineno === null && colno === null){
      errorInfo.setType('connection')
      if (urlParameters.testBot !== null){  //  testBot
        window.location.reload()  //  testBot will reload when connection is cutted off.
      }
    }else{
      console.warn(`Global handler: ${message}`, source, lineno, colno, error)
    }

    return true
  }

  return <Observer>{()=>{
    return <div ref={refDiv} className={classes.back} style={{backgroundColor: rgb2Color(roomInfo.backgroundFill)}}>
        {/* <SplitPane className={classes.fill} split="vertical" resizerClassName={clsSplit.resizerVertical}
          minSize={0} defaultSize="7em"> */}
          <SplitPane pane2Style={able === true ? {display: 'block', backgroundColor: '#FF00FF40'} : {display: 'none', backgroundColor: '#FFF'}} ref={refPane} className={classes.fill} split="vertical" resizerClassName={clsSplit.resizerVertical}
          minSize={0} defaultSize={able === true ? "85%" : "100%"}>
         {/*  <LeftBar stores={stores}/> */}

          <Fragment>

            <MainScreen showAllTracks = {DEBUG_VIDEO} stores={stores} />

            <Observer>{() => <Map transparent={sharedContentsStore.tracks.mainStream !== undefined
             || DEBUG_VIDEO} stores={stores} />
            }</Observer>


            <Footer stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <ZoneAvatar stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <Emoticons stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />

          </Fragment>
          <div style={{display: (able === true ? "block" : "none")}}>
            <LeftBar stores={stores}/>
          </div>
        </SplitPane>

{/*
        <IdleTimer
          timeout={1000 * 10}
          onActive={handleOnActive}
          onIdle={handleOnIdle}
          onAction={handleOnAction}
          debounce={250}
        />


        <Dialog
        open={showDialog}
        maxWidth="xl" fullWidth={false} fullScreen={true}
        onClose={handleClose}
      >
      <DialogContent style={{overflowY: 'hidden', backgroundColor: '#5f7ca0', fontSize: isSmartphone() ? '2em' : '1em'}}>
        <Box style={{position: 'absolute' as 'absolute',top: '20%',left: '50%',transform: 'translate(-50%, -50%)',width: '25em', boxShadow: '5em'}}>
          <Typography variant="h4" component="h2" style={{textAlign:'center'}}>
           Are you still there?
          </Typography>
        </Box>
        <Box mt={2}>
      <div style={{position: 'relative', top: '37em', width: '100%', textAlign:'center'}}>
        <img style={{width:'8em'}} src={logo_es} alt="" />
      </div>
      </Box>
      </DialogContent>
      </Dialog>
 */}
      </div>
  }}</Observer>
}
App.displayName = 'App'
