import {urlParameters} from '@models/url'
import {isPortrait, isSmartphone} from '@models/utils'
import { rgb2Color } from '@models/utils'
import chatStore from '@stores/Chat'
import errorInfo from '@stores/ErrorInfo'
import mapStore from '@stores/Map'
import participantsStore from '@stores/participants/Participants'
import roomInfo from '@stores/RoomInfo'
import sharedContentsStore from '@stores/sharedContents/SharedContents'
import {Observer, useObserver} from 'mobx-react-lite'
import React, {Fragment, useRef, useState, useEffect} from 'react'
import SplitPane from 'react-split-pane'
import {Footer} from './footer/Footer'
import {Emoticons} from './footer/Emoticons'
import {ZoneAvatar} from './footer/ZoneAvatar'
import {LeftBar} from './leftBar/LeftBar'
import {MainScreen} from './map/MainScreen'
import {Map} from './map/map'
import {Stores} from './utils'
import {styleCommon/* , styleForSplit */} from './utils/styles'
import logo_es from '@images/logo.png'
import { getLoginClick} from './error/TheEntrance' // getRoomName

/* import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'; */
/* import iconCollapse from '@images/earshot_icon_btn_collapse.png' */
import tabCollapseChat from '@images/earshot_icon_tab.png'
import tabCollapseContent from '@images/earshot_icon_tab_content.png'

import tabChat from '@images/earshot_icon_btn-chat.png'
import tabChatActive from '@images/earshot_icon_btn-chat.png'

import tabContent from '@images/earshot_icon_btn-note.png'
import tabContentActive from '@images/earshot_icon_btn-note.png'


let _able:Boolean = false
export function getAbleStatus():Boolean {
  return _able
}

let _menuType:string = ''
export function getSelectedMenuType() :string {
  return _menuType
}


export const App: React.FC<{}> = () => {
  /* const clsSplit = styleForSplit() */
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

  const [showIntro, setShowIntro] = useState<Boolean>(true)

  const [menuType, setMenuType] = useState('chat')

  //console.log(showIntro, " showIntro")


  // to display image and desc
  let roomImgPath:string = ""
  let roomImgDesc:string = ""
  const cContent = useObserver(() => stores.contents.all)
  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgPath = content.url
  ))
  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgDesc = content.contentDesc
  ))
  const rgb = stores.participants.local.getColorRGB()
  let press = false
  const loginStatus = useObserver(() => stores.participants.localId)

  const _roomName = sessionStorage.getItem("room") //getRoomName()

  _able = able
  _menuType = menuType

  //console.log("CALLLEEEED- ", loginStatus)
  useEffect(() => {
    //console.log("CALLLEEEED- ", getLoginClick())
    if(getLoginClick() || loginStatus) {
      //console.log(sessionStorage.getItem("room"), " roomname")
      setTimeout(function() {
        setShowIntro(false)
      }, 5000)
    }
  })

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

  //console.log(isSmartphone(), " .....")

  /* function StartMeeting() {
    setShowIntro(false)
  } */

  return <Observer>{()=>{
    return <div ref={refDiv} className={classes.back} style={{backgroundColor: '#0f5c81'/* '#5f7ca020' */ /* rgb2Color(roomInfo.backgroundFill) */}}>

        {/* <SplitPane className={classes.fill} split="vertical" resizerClassName={clsSplit.resizerVertical}
          minSize={0} defaultSize="70em"> */}

        <SplitPane pane2Style={able === true ? {display: 'block', backgroundColor: menuType === 'chat' ? '#0f5c81' : '#8b5e3c'/* '#5f7ca020' */, boxShadow: '3px 10px 10px 3px black'} : {display: 'none', backgroundColor: '#FFF'}} className={classes.fill} split="vertical" /* resizerClassName={clsSplit.resizerVertical} */
          minSize={0} defaultSize={able === true ? isSmartphone() ? '40%' : "77%"/* "85%" */ : "100%"}>

          <Fragment>
            <MainScreen showAllTracks = {DEBUG_VIDEO} stores={stores} />
            <Observer>{() => <Map transparent={sharedContentsStore.tracks.mainStream !== undefined
             || DEBUG_VIDEO} stores={stores} />
            }</Observer>


             <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex'}}
              onClick={() => {
                press = true;
                if(able === true) {
                  if(_menuType === 'chat') {
                    setAble(false)
                  }
                } else
                if(able === false) {
                  setAble(true)
                }
                setMenuType('chat')
               }}
             >
               <img src={tabCollapseChat} style={{width:isSmartphone() ? 120 : 50, height:'auto', /* color:'white',  */position:'relative', top:'0px', left:isSmartphone() ? '1px' : '0px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'chat' ? 9 : 8}} draggable={false} alt='' />
                <img src={able ? tabChatActive : tabChat} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' /* transform: able ? 'rotate(0deg)' : 'rotate(-180deg)' */, userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
             </div>

             <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex'}}
              onClick={() => {
                press = true;
                if(able === true) {
                  if(menuType === 'content') {
                    setAble(false)
                  }
                } else
                if(able === false) {
                  setAble(true)
                }
                setMenuType('content')
               }}
             >
              <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', /* color:'white',  */position:'relative', top:isSmartphone() ? '119px' : '49px', left:isSmartphone() ? '1px' : '0px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'content' ? 9 : 8}} draggable={false} alt='' />
              <img src={able ? tabContentActive : tabContent} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:isSmartphone() ? '122px' : '52px', left:isSmartphone() ? '10px' : '5px' /* transform: able ? 'rotate(0deg)' : 'rotate(-180deg)' */, userSelect:'none', zIndex:showIntro ? 0 : 98}} draggable={false} alt='' />
             </div>


            <Footer stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <ZoneAvatar stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <Emoticons stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />

          </Fragment>
          <div style={{display: (able === true ? "block" : "none"), minWidth:'280px', width:'100%', maxWidth:'280px'}}>
            <LeftBar stores={stores}/>
          </div>
        </SplitPane>
        <div /* onClick={StartMeeting}  */style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center', verticalAlign:'center',position:'absolute', backgroundColor: '#5f7ca0', textAlign:'center', display:showIntro ? 'block' : 'none'}}>
        <p style={{textAlign:'right', color: 'white', position:'relative', right:'24.5px', top:'20px', fontSize: isSmartphone() ? '2.4em' : '1em'}}>Version 1.8.7</p>
          <div style={{position:'relative', top:roomImgPath === '' ? '20%' : '0%'}}>
          <p style={{textAlign:'center', color: 'white', /* marginTop:roomImgPath !== '' ? '1em' : '10.5em', */fontSize:isSmartphone() ? '3em' : '1.2em'}}>Welcome To</p>
          <p style={_roomName ? {textAlign:'center', color: 'white', marginTop:'-0.8em', fontSize:isSmartphone() ? '2.8em' : '1.2em', fontWeight:'bold', opacity: 1, transition: 'opacity 300ms'/* , width: '50%', marginLeft:'25%' */} : {textAlign:'center', color: 'white', marginTop:'-0.8em', fontSize:isSmartphone() ? '3em' : '1.2em', fontWeight:'bold', opacity: 0}}>{_roomName}</p>
          <img src={roomImgPath} style={roomImgPath ? {height: '250px', transform: "scale(1)", opacity:1, transition: 'opacity 300ms, transform: 300ms', userSelect:'none'} : {height: '0px', transform: "scale(0)", opacity:0, transition: '0.3s ease-out', userSelect:'none'}} draggable={false} alt=""/>
          <p style={{textAlign:'center', color: '#cdcdcd', fontSize:isSmartphone() ? '2.8em' : '1em', overflow:'hidden', position:'relative', marginTop:'0.5em', width:'80%', marginLeft:'10%'}}>{roomImgDesc}</p>
          <img style={{width:isSmartphone() ? '8em' : '4em', backgroundColor:rgb2Color(rgb), borderRadius: '50%', position:'relative', marginTop:roomImgPath !== '' ? '20px' : '-15px', userSelect:'none'}} src={stores.participants.local.information.avatarSrc} draggable={false} alt="" />
        <p style={{textAlign:'center', color: 'black', marginTop:'0.5em', fontSize:isSmartphone() ? '3em' : '1.2em'}}>{stores.participants.local.information.name}</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'1.5em',fontSize:isSmartphone() ? '3em' : '1.2em'}}>Give your web browser permissions</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'-0.9em',fontSize:isSmartphone() ? '3em' : '1.2em'}}>to access the mic and camera if necessary.</p>
         {/* <p style={{textAlign:'center', color: 'black', position:'absolute', bottom: '90px', width:'40%', marginLeft:'30%',fontSize:'1.2em'}}>Give your web browser permissions</p>
        <p style={{textAlign:'center', color: 'black', position:'absolute', bottom: '65px', width:'40%', marginLeft:'30%',fontSize:'1.2em'}}>to access the mic and camera if necessary.</p> */}
        {/* <img style={{width:'8em', position:'absolute', bottom:'30px', marginLeft:'-4em'}} src={logo_es} alt="" /> */}
        <img style={{width:isSmartphone() ? '18em' : '8em', position:'relative', userSelect:'none'}} src={logo_es} draggable={false} alt="" />
        </div>
        </div>
      </div>
  }}</Observer>
}
App.displayName = 'App'
