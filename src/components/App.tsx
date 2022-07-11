import {urlParameters} from '@models/url'
import {isPortrait, isSmartphone} from '@models/utils'
/* import { rgb2Color } from '@models/utils' */
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
import { getLoginClick, getUserType} from './error/TheEntrance' // getRoomName

/* import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'; */
/* import iconCollapse from '@images/earshot_icon_btn_collapse.png' */
import tabCollapseChat from '@images/earshot_icon_tab.png'
import tabCollapseContent from '@images/earshot_icon_tab_content.png'
//import tabCollapseEvents from '@images/earshot_icon_tab_events.png'

import tabChat from '@images/earshot_icon_btn-chat.png'
import tabChatActive from '@images/earshot_icon_btn-chat.png'

import tabContent from '@images/earshot_icon_btn-note.png'
import tabContentActive from '@images/earshot_icon_btn-note.png'

//import tabEvents from '@images/earshot_icon_btn_events.png'
//import tabEventsActive from '@images/earshot_icon_btn_events.png'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


//import { toPng } from 'html-to-image'

import html2canvas from 'html2canvas'
import { Dialog, DialogContent } from '@material-ui/core'

//declare const config:any             //  from ../../config.js included from index.html

let _able:Boolean = false
export function getAbleStatus():Boolean {
  return _able
}

let _menuType:string = ''
export function getSelectedMenuType() :string {
  return _menuType
}

//let selectedImage:string = ''
let selectedGroup = ''
let selectedSkin = ''
let selectedHairColor = ''
let selectedHair = ''
let selectedHairBack = ''
let selectedOutfits = ''
let selectedSpecs = ''


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
  const [activeOutfit, setActiveOutfit] = useState(-1)
  const [activeSpecs, setActiveSpecs] = useState(-1)

  const [activeSkin, setActiveSkin] = useState(-1)
  const [activeHair, setActiveHair] = useState(-1)
  const [activeGroup, setActiveGroup] = useState(-1)

  const [activeFrontHair, setActiveFrontHair] = useState(-1)
  const [activeBackHair, setActiveBackHair] = useState(-1)


  // help ui
  const [showHelp, setShowHelp] = useState(false)



  // For Saving data
  const refAvatar = useRef<HTMLDivElement>(null)


  // to display image and desc
  let roomImgPath:string = ""
  let roomImgDesc:string = ""
  let activeBgColor:string = ""
  const cContent = useObserver(() => stores.contents.all)
  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgPath = content.url
  ))

  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgDesc = content.contentDesc
  ))

  // For Apps section [Room based loading directly from JSON file]
  cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    //console.log(content, " TYPE ", index)
    //content.type === menuType ? content.
    //console.log(menuType, " -------------- ", content.type)
    menuType === content.type ? activeBgColor = content.baseColor : ''
  ))

  /* const rgb = stores.participants.local.getColorRGB() */

  let press = false
  const loginStatus = useObserver(() => stores.participants.localId)

  const _roomName = sessionStorage.getItem("room") //getRoomName()

  _able = able
  _menuType = menuType


  let tabBGTopBGWeb:number = 100 //98 //98
  let tabBGTopBGMob:number = 242 //238

  let tabBGTopIconWeb:number = 102 //104 //102
  let tabBGTopIconMob:number = 255 //241

  ////////////////////////////////////////////////////////////
  //console.log(config.apps[0].name, " >>> ")
  ////////////////////////////////////////////////////////////
  const [data,setData] = useState('');
  const [uiData, setUIData] = useState('')
  const getData=()=>{
    fetch('folderlist.php?folder=avatar_tool/*/*.png')
      .then((response) => response.text())
      .then((response) => setData(response));
    /* let dataStr = "avatar_tool/Colors/es_co_group_0.png,avatar_tool/Colors/es_co_group_1.png,avatar_tool/Colors/es_co_group_2.png,avatar_tool/Colors/es_co_group_3.png,avatar_tool/Colors/es_co_group_4.png,avatar_tool/Colors/es_co_group_5.png,avatar_tool/Colors/es_co_group_6.png,avatar_tool/Colors/es_co_group_x.png,avatar_tool/Colors/es_co_hair_0.png,avatar_tool/Colors/es_co_hair_1.png,avatar_tool/Colors/es_co_hair_2.png,avatar_tool/Colors/es_co_hair_3.png,avatar_tool/Colors/es_co_hair_4.png,avatar_tool/Colors/es_co_hair_5.png,avatar_tool/Colors/es_co_hair_6.png,avatar_tool/Colors/es_co_skin_0.png,avatar_tool/Colors/es_co_skin_1.png,avatar_tool/Colors/es_co_skin_2.png,avatar_tool/Colors/es_co_skin_3.png,avatar_tool/Colors/es_co_skin_4.png,avatar_tool/Colors/es_co_skin_5_x.png,avatar_tool/Colors/es_co_skin_6_x.png,avatar_tool/Hair/avatars_hair_5_0_f.png,avatar_tool/Hair/avatars_hair_5_1_f.png,avatar_tool/Hair/avatars_hair_5_2_f.png,avatar_tool/Hair/avatars_hair_5_3_f.png,avatar_tool/Hair/avatars_hair_5_4_f.png,avatar_tool/Hair/avatars_hair_5_5_f.png,avatar_tool/Hair/avatars_hair_5_6_f.png,avatar_tool/Hair/es_hair_0_0_f.png,avatar_tool/Hair/es_hair_0_1_f.png,avatar_tool/Hair/es_hair_0_2_f.png,avatar_tool/Hair/es_hair_0_3_f.png,avatar_tool/Hair/es_hair_0_4_f.png,avatar_tool/Hair/es_hair_0_5_f.png,avatar_tool/Hair/es_hair_0_6_f.png,avatar_tool/Hair/es_hair_0_x_b.png,avatar_tool/Hair/es_hair_0_x_f.png,avatar_tool/Hair/es_hair_1_0_b.png,avatar_tool/Hair/es_hair_1_0_f.png,avatar_tool/Hair/es_hair_1_1_b.png,avatar_tool/Hair/es_hair_1_1_f.png,avatar_tool/Hair/es_hair_1_2_b.png,avatar_tool/Hair/es_hair_1_2_f.png,avatar_tool/Hair/es_hair_1_3_b.png,avatar_tool/Hair/es_hair_1_3_f.png,avatar_tool/Hair/es_hair_1_4_b.png,avatar_tool/Hair/es_hair_1_4_f.png,avatar_tool/Hair/es_hair_1_5_b.png,avatar_tool/Hair/es_hair_1_5_f.png,avatar_tool/Hair/es_hair_1_6_b.png,avatar_tool/Hair/es_hair_1_6_f.png,avatar_tool/Hair/es_hair_2_0_f.png,avatar_tool/Hair/es_hair_2_1_f.png,avatar_tool/Hair/es_hair_2_2_f.png,avatar_tool/Hair/es_hair_2_3_f.png,avatar_tool/Hair/es_hair_2_4_f.png,avatar_tool/Hair/es_hair_2_5_f.png,avatar_tool/Hair/es_hair_2_6_f.png,avatar_tool/Hair/es_hair_3_0_f.png,avatar_tool/Hair/es_hair_3_1_f.png,avatar_tool/Hair/es_hair_3_2_f.png,avatar_tool/Hair/es_hair_3_3_f.png,avatar_tool/Hair/es_hair_3_4_f.png,avatar_tool/Hair/es_hair_3_5_f.png,avatar_tool/Hair/es_hair_3_6_f.png,avatar_tool/Hair/es_hair_4_0_f.png,avatar_tool/Hair/es_hair_4_1_f.png,avatar_tool/Hair/es_hair_4_2_f.png,avatar_tool/Hair/es_hair_4_3_f.png,avatar_tool/Hair/es_hair_4_4_f.png,avatar_tool/Hair/es_hair_4_5_f.png,avatar_tool/Hair/es_hair_4_6_f.png,avatar_tool/Outfits/es_outfit_0.png,avatar_tool/Outfits/es_outfit_1.png,avatar_tool/Outfits/es_outfit_2.png,avatar_tool/Outfits/es_outfit_3.png,avatar_tool/Outfits/es_outfit_4.png,avatar_tool/Outfits/es_outfit_5.png,avatar_tool/Outfits/es_outfit_6.png,avatar_tool/Specs/es_specs_0.png,avatar_tool/Specs/es_specs_1.png,avatar_tool/Specs/es_specs_2.png,"
    setData(dataStr) */

    /* let uiDataStr = "help/help_0.png,help/help_1.png,help/help_2.png,"
    setUIData(uiDataStr) */
  }

  const getUIData=()=>{
    fetch('folderlist.php?folder=ui/help/*.png')
      .then((response) => response.text())
      .then((response) => setUIData(response));

    /* let uiDataStr = "ui/help/help_0.png,ui/help/help_1.png,ui/help/help_2.png,"
    setUIData(uiDataStr) */
  }


  ////////////////////////////////////////////////////////////
  //console.log("CALLLEEEED- ", loginStatus)
  let sliderData: Array<string> = []
  let sliderDots: Array<string> = []
  if(uiData !== '') {
    sliderData = uiData.split(',')
    sliderDots = uiData.split(',')
    sliderDots.pop()
  }

  useEffect(() => {
    //console.log("CALLLEEEED- ", getLoginClick())
    getData()
    getUIData()


    if(getLoginClick() || loginStatus) {
      //console.log(sessionStorage.getItem("room"), " roomname")
      //console.log("Show User random avatar - ", data)
      //console.log("BBBB --- ", stores.participants.local.information.name, " ---- ", getUserType())

      if(getUserType() === "N" && activeSkin === -1 && stores.participants.local.information.randomAvatar.length === 0) {
      //if(activeSkin === -1 && stores.participants.local.information.randomAvatar.length === 0) {
        onGenerateRandomAvatar()
        const genImage = setTimeout(() => {
          clearTimeout(genImage)
          onGenImageForNewUser()
        }, 50)
      }

      const introTimer = setTimeout(() => {
        clearTimeout(introTimer)
        setShowIntro(false)

        if(getUserType() === "N" && activeSkin === -1) {
          setShowHelp(true)
        }

      }, 5000)
    }
  })

  const [currentSlide, setCurrentSlide] = useState(0)
  const slidesLength = sliderData.length-1

  if(!Array.isArray(sliderData) || sliderData.length <= 0) {
    return null
  }

  function onGenImageForNewUser() {
    if (refAvatar.current === null) {
      return
    }

    html2canvas(refAvatar.current, { allowTaint: true }).then(function(canvas:any) {
      var formData = new FormData();
      formData.append('imgData', canvas.toDataURL());
      fetch('saveAvatarImage.php',
        {
          method: 'POST',
          body: formData
        }
      )
        .then((response) => response.text())
        .then((response) => updateUserAvatar(response));
      ////////////////////////////////////////////////////
    })
    .catch((err) => {
      console.log(err)
    })

    /* toPng(refAvatar.current, { cacheBust: true, })
      .then((dataUrl) => {
      ////////////////////////////////////////////////////
      console.log(dataUrl, " DATA")
      var formData = new FormData();
      formData.append('imgData', dataUrl);
      fetch('saveAvatarImage.php',
        {
          method: 'POST',
          body: formData
        }
      )
        .then((response) => response.text())
        .then((response) => updateUserAvatar(response));
      ////////////////////////////////////////////////////
    })
    .catch((err) => {
      console.log(err)
    }) */
  }


  function updateUserAvatar(_path:string) {
    stores.participants.local.information.avatarSrc = _path

    // Storing values to localstorage
    stores.participants.local.information.randomAvatar = [selectedSkin, selectedHairColor, selectedGroup, selectedHair, selectedOutfits, selectedSpecs]

    stores.participants.local.sendInformation()
    stores.participants.local.saveInformationToStorage(true)

  }

  function generateRandomNumber(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


  function onGenerateRandomAvatar() {

    //////////////////////////////////////////////////////////////////////////////

  //console.log(data, " data")
  // format accordingly to folder name
  const folders : Array<string> = []
  const images : Array<string> = []
  let tempArr : string = ''
  let dataFolderWise = data.split(',')

  for (let i=0; i<dataFolderWise.length-1; i++) {
      if(folders.indexOf(dataFolderWise[i].split('/')[1]) === -1 && dataFolderWise[i].split('/')[1] !== undefined) {
        folders.push(dataFolderWise[i].split('/')[1])
      }

    }
    for (var j=0; j < folders.length; j++) {
      for (let i=0; i<dataFolderWise.length-1; i++) {
      if(folders[j] === dataFolderWise[i].split('/')[1]) {
        tempArr += (dataFolderWise[i]) + ','
      }
    }
    images.push(tempArr)
    tempArr = ''
  }
  ////////////////////////////////////////////////////////////////////////////
    // For Group, Skin and Hair Color setting
    //let randGroupIndex = generateRandomNumber(0,6)
    let randSkinIndex = generateRandomNumber(15, 20)
    let randHairColorIndex = generateRandomNumber(8, 14)
    let imgArr = images[0].split(',')
    let randGroupIndex = imgArr.indexOf('avatar_tool/Colors/es_co_group_x.png')

    //console.log(randGroupIndex)

    //if(pageIndex === 0) {
      //if(randGroupIndex < 7) {
        selectedGroup = imgArr[randGroupIndex]
        if(activeGroup !== randGroupIndex) {
          setActiveGroup(randGroupIndex)
        }
      //}
    //}
    if(randHairColorIndex >= 7 && randHairColorIndex < 15) {
      selectedHairColor = imgArr[randHairColorIndex].split('/')[2].split('.')[0].split('co_')[1]
      if(activeHair !== randHairColorIndex) {
        setActiveHair(randHairColorIndex)
      }
    }
    if(randSkinIndex >= 15 && randSkinIndex < 20) {
      selectedSkin = imgArr[randSkinIndex]
      if(activeSkin !== randSkinIndex) {
        setActiveSkin(randSkinIndex)
      }
    }
  //}

    // Setting Hairs [ Front , Back ]
    let imgHairArr = images[1].split(',')
    let frontHairs : Array<string> = []
    let frontHairIndex : Array<number> = []
    let backHairs : Array<string> = []
    let backHairIndex : Array<number> = []
    frontHairs.splice(0)
    frontHairIndex.splice(0)
    backHairs.splice(0)
    backHairIndex.splice(0)
    for (let i:number = 0; i < imgHairArr.length - 1; i++) {
      //console.log(selectedHairColor.split('_')[1], " ---- ", imgHairArr[i].split("_")[4])
      //if(imgHairArr[i].indexOf(selectedHairColor) !== -1) {

        //console.log(selectedHairColor.split('_')[1], " --- ", selectedHairColor)

        if(imgHairArr.indexOf(selectedHairColor.split('_')[1] + '_' + imgHairArr[i].split("_")[4]) === -1) {
        if((selectedHairColor.split("_")[1] === imgHairArr[i].split("_")[4])) {
          let hairType = imgHairArr[i].split('/')[2].split('.')[0].split('_')[4]
          if(hairType === 'f') {
            frontHairs.push(imgHairArr[i])
            frontHairIndex.push(i)
          } else if(hairType === 'b') {
            backHairs.push(imgHairArr[i])
            backHairIndex.push(i)
          }
        }
      }
    }
    if(frontHairs.length > 0) {
      let randFrontHairIndex = generateRandomNumber(0, frontHairs.length-1)
      selectedHair = frontHairs[randFrontHairIndex]
      //console.log(frontHairs[randFrontHairIndex])
      if(activeFrontHair !== frontHairIndex[randFrontHairIndex]) {
        setActiveFrontHair(frontHairIndex[randFrontHairIndex])
      }
      //console.log(frontHairs[randFrontHairIndex].split('/')[2].split('.')[0], " random front")
      let findBack = imgHairArr.indexOf(String(frontHairs[randFrontHairIndex].split('_f.png')[0] + '_b.png'))
      //console.log(String(frontHairs[randFrontHairIndex].split('_f.png')[0] + '_b.png'), " BackRandom ", findBack)
      //console.log(findBack, " findBack")
      if(findBack !== -1) {
        selectedHairBack = imgHairArr[findBack]
        if(activeBackHair !== findBack) {
          setActiveBackHair(findBack)
        } else {
          selectedHairBack = ''
          setActiveBackHair(-1)
        }
      } else {
        selectedHairBack = ''
        setActiveBackHair(-1)
      }

    } else {
      selectedHair = ''
      setActiveFrontHair(-1)

      selectedHairBack = ''
      setActiveBackHair(-1)
    }
    /* if(backHairs.length > 0) {
      let randBackHairIndex = generateRandomNumber(0, backHairs.length-1)
      selectedHairBack = backHairs[randBackHairIndex]
      setActiveBackHair(backHairIndex[randBackHairIndex])
    } else {
      selectedHairBack = ''
      setActiveBackHair(-1)
    } */

    // Setting OutFits
    let imgOutfitArr = images[2].split(',')
    let randOutfitIndex = generateRandomNumber(0, imgOutfitArr.length-2)
    selectedOutfits = imgOutfitArr[randOutfitIndex]
    if(activeOutfit !== randOutfitIndex) {
      setActiveOutfit(randOutfitIndex)
    }

    // Setting Specs
    let imgSpecsArr = images[3].split(',')
    let randSpecsIndex = generateRandomNumber(0, imgSpecsArr.length-2)
    selectedSpecs = imgSpecsArr[randSpecsIndex]
    if(activeSpecs !== randSpecsIndex) {
      setActiveSpecs(randSpecsIndex)
    }
  }


  function onPrevClick() {
    //console.log("prev click")
    setCurrentSlide(currentSlide === 0 ? slidesLength-1 : currentSlide - 1)
  }

  function onNextClick() {
    //console.log("next click")
    setCurrentSlide(currentSlide === slidesLength-1 ? 0 : currentSlide + 1)
  }


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

        <SplitPane pane2Style={able === true ? {display: 'block', backgroundColor: menuType === 'chat' ? '#0f5c81' : menuType === 'content' ? '#8b5e3c' : activeBgColor


        /* '#5f7ca020' */, boxShadow: '5px 10px 10px 3px black'} : {display: 'none', backgroundColor: '#FFF'}} className={classes.fill} split="vertical" /* resizerClassName={clsSplit.resizerVertical} */
          minSize={0} defaultSize={able === true ? isSmartphone() ? '40%' : (_menuType !== 'chat' && _menuType !== 'content') ? "73%" : "77%"/* "85%" */ : "100%"}>

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
               <img src={tabCollapseChat} style={{width:isSmartphone() ? 120 : 50, height:'auto', /* color:'white',  */position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : 18}} draggable={false} alt='' />
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
              <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', /* color:'white',  */position:'relative', top:isSmartphone() ? '119px' : '49px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : 17}} draggable={false} alt='' />
              <img src={able ? tabContentActive : tabContent} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:isSmartphone() ? '122px' : '52px', left:isSmartphone() ? '10px' : '5px' /* transform: able ? 'rotate(0deg)' : 'rotate(-180deg)' */, userSelect:'none', zIndex:showIntro ? 0 : 98}} draggable={false} alt='' />
             </div>

             {/* <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex'}}
              onClick={() => {
                press = true;
                if(able === true) {
                  if(menuType === 'events') {
                    setAble(false)
                  }
                } else
                if(able === false) {
                  setAble(true)
                }
                setMenuType('events')
               }}
             >
              <img src={tabCollapseEvents} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:isSmartphone() ? '238px' : '100px', left:isSmartphone() ? '1px' : '0px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'events' ? 9 : 7}} draggable={false} alt='' />
              <img src={able ? tabEventsActive : tabEvents} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:isSmartphone() ? '241px' : '102px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
             </div> */}

             <>

            { cContent.filter(item => item.shareType === "appimg").map((content, index) => (
              <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex'}}
                onClick={() => {
                  press = true;
                  if(able === true) {
                    if(menuType === content.type) {
                      setAble(false)
                    }
                  } else
                  if(able === false) {
                    setAble(true)
                  }
                  setMenuType(content.type)
                }}
              >
                <img src={content.baseImage} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:isSmartphone() ? tabBGTopBGMob + (index * 119) : tabBGTopBGWeb + (index*51), left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === content.type ? 19 : (18 - (index+2))}} draggable={false} alt='' />
                <img src={content.baseIcon} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:isSmartphone() ? tabBGTopIconMob + (index * 119) : tabBGTopIconWeb + (index*48), left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
              </div>
             ))}
             </>

            <Footer stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <ZoneAvatar stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <Emoticons stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />

          </Fragment>
          <div style={{display: (able === true ? "block" : "none"), minWidth:'280px', width:'100%', maxWidth:'280px'}}>
            <LeftBar stores={stores}/>
          </div>
        </SplitPane>
        <div /* onClick={StartMeeting}  */style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center', verticalAlign:'center',position:'absolute', backgroundColor: '#5f7ca0', textAlign:'center', display:showIntro ? 'block' : 'none'}}>
        <p style={{textAlign:'right', color: 'white', position:'relative', right:'24.5px', top:'20px', fontSize: isSmartphone() ? '2.4em' : '1em'}}>Version 1.9.4</p>
          <div style={{position:'relative', top:roomImgPath === '' ? '20%' : '0%'}}>
          <p style={{textAlign:'center', color: 'white', /* marginTop:roomImgPath !== '' ? '1em' : '10.5em', */fontSize:isSmartphone() ? '3em' : '1.2em'}}>Welcome To</p>
          <p style={_roomName ? {textAlign:'center', color: 'white', marginTop:'-0.8em', fontSize:isSmartphone() ? '2.8em' : '1.2em', fontWeight:'bold', opacity: 1, transition: 'opacity 300ms'/* , width: '50%', marginLeft:'25%' */} : {textAlign:'center', color: 'white', marginTop:'-0.8em', fontSize:isSmartphone() ? '3em' : '1.2em', fontWeight:'bold', opacity: 0}}>{_roomName}</p>
          <img src={roomImgPath} style={roomImgPath ? {height: '250px', transform: "scale(1)", opacity:1, transition: 'opacity 300ms, transform: 300ms', userSelect:'none'} : {height: '0px', transform: "scale(0)", opacity:0, transition: '0.3s ease-out', userSelect:'none'}} draggable={false} alt=""/>
          <p style={{textAlign:'center', color: '#cdcdcd', fontSize:isSmartphone() ? '2.8em' : '1em', overflow:'hidden', position:'relative', marginTop:'0.5em', width:'80%', marginLeft:'10%'}}>{roomImgDesc}</p>
          <img style={{width:isSmartphone() ? '8em' : '4em', backgroundColor:'#00000020'/* , backgroundColor:rgb2Color(rgb) */, borderRadius: '50%', position:'relative', marginTop:roomImgPath !== '' ? '20px' : '-15px', userSelect:'none'}} src={stores.participants.local.information.avatarSrc} draggable={false} alt="" />
        <p style={{textAlign:'center', color: 'black', marginTop:'0.5em', fontSize:isSmartphone() ? '3em' : '1.2em'}}>{stores.participants.local.information.name}</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'1.5em',fontSize:isSmartphone() ? '3em' : '1.2em'}}>Give your web browser permissions</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'-0.9em',fontSize:isSmartphone() ? '3em' : '1.2em'}}>to access the mic and camera if necessary.</p>
         {/* <p style={{textAlign:'center', color: 'black', position:'absolute', bottom: '90px', width:'40%', marginLeft:'30%',fontSize:'1.2em'}}>Give your web browser permissions</p>
        <p style={{textAlign:'center', color: 'black', position:'absolute', bottom: '65px', width:'40%', marginLeft:'30%',fontSize:'1.2em'}}>to access the mic and camera if necessary.</p> */}
        {/* <img style={{width:'8em', position:'absolute', bottom:'30px', marginLeft:'-4em'}} src={logo_es} alt="" /> */}
        <img style={{width:isSmartphone() ? '18em' : '8em', position:'relative', userSelect:'none'}} src={logo_es} draggable={false} alt="" />
        </div>
        </div>


        <div ref={refAvatar} style={{position:'relative', width:'130px', height:'130px', maxWidth:'130px', zIndex:-999}}>
          <div style={{position:'absolute', top:'0px', left:'0px'}}>
            <img style={{display: selectedGroup !== '' ? 'block' : 'none'}} src={selectedGroup} width={'130px'} height={'130px'} draggable={false} alt='' />
          </div>
          <div style={{position:'absolute', top:'0px', left:'0px'}}>
            <img style={{display: selectedHairBack !== '' ? 'block' : 'none'}} src={selectedHairBack} width={'130px'} height={'130px'} draggable={false} alt='' />
          </div>
          <div style={{position:'absolute', top:'0px', left:'0px'}}>
            <img style={{display: selectedSkin !== '' ? 'block' : 'none'}} src={selectedSkin} width={'130px'} height={'130px'}  draggable={false} alt='' />
          </div>
          <div style={{position:'absolute', top:'0px', left:'0px'}}>
            <img style={{display: selectedHair !== '' ? 'block' : 'none'}} src={selectedHair} width={'130px'} height={'130px'}  draggable={false}alt='' />
          </div>
          <div style={{position:'absolute', top:'-3px', left:'0px'}}>
            <img style={{display: selectedOutfits !== '' ? 'block' : 'none'}} src={selectedOutfits} width={'130px'} height={'130px'} draggable={false} alt='' />
          </div>
          <div style={{position:'absolute', top:'0px', left:'0px'}}>
            <img style={{display: selectedSpecs !== '' ? 'block' : 'none'}} src={selectedSpecs} width={'130px'} height={'130px'} draggable={false} alt='' />
          </div>
        </div>


        {/* Showing slideshow for new user */}
        <Dialog open={showHelp} onClose={() => setShowHelp(false)} onExited={() => setShowHelp(false)}
        keepMounted
        PaperProps={{
          style: {
            backgroundColor: 'white',
            position:'relative',
            /* boxShadow: 'none', */
            overflow:'hidden',
            borderRadius: '20px',
            width: 300,
            height: 350,
            zIndex: 0,
            left: '250px',
            transform: isSmartphone() ? 'scale(1.5)' : 'scale(1)',
          },
        }}
        BackdropProps={{ invisible: true }}
        >
        <DialogContent style={{overflow:'hidden'}}>
          <div>
            <div style={{position:'relative', left:'0px'}}>
              <>
              {
                sliderData.map((slide, index) => {
                  return (
                    <div className={index === currentSlide ? classes.activeSlide : classes.slide} key={index}>
                      {index === currentSlide && (
                         <img src={slide} width={'250px'} height={'250px'} alt='' />
                      )}

                    </div>
                  )
                })
              }
              </>
            </div>
            <div style={{width:'100%', height:'1px', backgroundColor:'lightgrey', position:'relative', top:'5px'}}></div>
            <div style={{display:'flex', position:'relative', top:'15px', width:'100%'}}>
              <div onClick={() => onPrevClick()}>
                <ArrowBackIosIcon className={classes.previous}  />
              </div>
              <div onClick={() => onNextClick()}>
                <ArrowForwardIosIcon className={classes.next} />
              </div>
              <div style={{display:'flex', width:'80%', justifyContent:'center', position:'relative', top:'15px', left:'10%'}}>
              {
                sliderDots.map((slide, index) => {
                  return (
                    <div style={{position:'relative', width:'12px', height:'12px', borderRadius:'50%', backgroundColor: index === currentSlide ? 'green' : 'lightgray', alignItems:'center', margin:'3px'}} />
                  )
                })
              }
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
  }}</Observer>
}
App.displayName = 'App'
