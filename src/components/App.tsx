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
  const [able, setAble] = useState<Boolean>(false)

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
  //  toucmove: prevent browser zoom by pinch
  window.addEventListener('touchmove', (ev) => {
    //  if (ev.touches.length > 1) {
    ev.preventDefault()
    //  }
  },                      {passive: false, capture: false})
  //  contextmenu: prevent to show context menu with right mouse click
  window.addEventListener('contextmenu', (ev) => {
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
  // FF00FF

  return <Observer>{()=>{
    return <div ref={refDiv} className={classes.back} style={{backgroundColor: rgb2Color(roomInfo.backgroundFill)}}>
        {/* <SplitPane className={classes.fill} split="vertical" resizerClassName={clsSplit.resizerVertical}
          minSize={0} defaultSize="70em"> */}

        <SplitPane pane2Style={able === true ? {display: 'block', backgroundColor: '#5f7ca020'} : {display: 'none', backgroundColor: '#FFF'}} className={classes.fill} split="vertical" resizerClassName={clsSplit.resizerVertical}
          minSize={0} defaultSize={able === true ? "85%" : "100%"}>
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
      </div>
  }}</Observer>
}
App.displayName = 'App'
