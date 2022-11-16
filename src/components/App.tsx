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
import { getLoginClick, getUserType } from './error/TheEntrance'
import {Footer} from './footer/Footer'
import {LeftBar} from './leftBar/LeftBar'
import {MainScreen} from './map/MainScreen'
import {Map} from './map/map'
import {Stores} from './utils'
import {styleCommon/* , styleForSplit */} from './utils/styles'
import logo_es from '@images/logo.png'
//import { getLoginClick, getUserType} from './error/TheEntrance' // getRoomName

import tabCollapseChat from '@images/earshot_icon_tab.png'
import tabCollapseContent from '@images/earshot_icon_tab_content.png'
import tabChatActive from '@images/earshot_icon_btn-chat.png'
import tabContentActive from '@images/earshot_icon_btn-note.png'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
/* import CloseTabIcon from '@material-ui/icons/HighlightOff'; */
import html2canvas from 'html2canvas'
import { Dialog, DialogContent} from '@material-ui/core'
import Draggable from 'react-draggable'
import { Emoticons } from './footer/Emoticons'
import { ZoneAvatar } from './footer/ZoneAvatar'
// Media Share Icons
/* import twitchIcon from '@images/twitch.png' */
/* import {Icon} from '@iconify/react'
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo'; */

/* import {Icon} from '@iconify/react' */
/* import twitchActive from '@images/twitchActive.png' */

// Common app icon
import appIcon from '@images/earshot_icon_globe.png';


let _able:Boolean = false
export function getAbleStatus():Boolean {
  return _able
}

let _menuType:string = ''
export function getSelectedMenuType() :string {
  return _menuType
}

let _menuPos:number = -2
export function getSelectedMenuPos() : number {
  return _menuPos;
}

//let selectedImage:string = ''
let selectedGroup = ''
let selectedSkin = ''
let selectedHairColor = ''
let selectedHair = ''
let selectedHairBack = ''
let selectedOutfits = ''
let selectedSpecs = ''


let defaultActive:boolean = false


let onDragging:boolean = false

//let clickType:string = ''


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
  const [menuType, setMenuType] = useState('')
  const [activeOutfit, setActiveOutfit] = useState(-1)
  const [activeSpecs, setActiveSpecs] = useState(-1)
  const [activeSkin, setActiveSkin] = useState(-1)
  const [activeHair, setActiveHair] = useState(-1)
  const [activeGroup, setActiveGroup] = useState(-1)
  const [activeFrontHair, setActiveFrontHair] = useState(-1)
  const [activeBackHair, setActiveBackHair] = useState(-1)
  // help ui
  const [showHelp, setShowHelp] = useState(false)

  // for tab
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [positionMedia, setPositionMedia] = useState({ x: 0, y: 0 })

  const [activeTabIndex, setActiveTabIndex] = useState(-1)

  const [anim, setAnim] = useState(false)


  //console.log(document.getElementById('appFrame'))
  /* var iframe = document.querySelector( 'iframe');
  console.log(iframe?.src, " SRC") */

  //console.log(window.location.host, " HOST")


  // For Saving data
  const refAvatar = useRef<HTMLDivElement>(null)

  // For supporting Apps
  const refEntity_0 = useRef<Draggable>(null)
  const refEntity_1 = useRef<Draggable>(null)
  const refEntity_2 = useRef<Draggable>(null)
  const refEntity_3 = useRef<Draggable>(null)
  const refEntity_4 = useRef<Draggable>(null)
  const refEntity_5 = useRef<Draggable>(null)
  const refEntity_6 = useRef<Draggable>(null)
  const refEntity_7 = useRef<Draggable>(null)
  const refEntity_8 = useRef<Draggable>(null)

  // For Media Stream
  const refEntity_9 = useRef<Draggable>(null)



  /* let totalTab:number = 0 */
  const zoneMediaURL = useObserver(() => stores.participants.local.zone?.mediaURL)
  const inZone = useObserver(() => stores.participants.local.zone?.zone)

  const videoParent = window.location.host.split("https://www.")[0]

  //let animCount = 0
  if(zoneMediaURL === undefined) {
    //animCount = 0
    if(defaultActive === true){
      defaultActive = false
      setMenuType('chat')
    }
  } else {
    if(zoneMediaURL !== undefined && inZone === 'close') {
      defaultActive = true
      if(menuType === '') {
        _menuPos = -2
        setMenuType('twitch')
      }
      const _timer = setTimeout(() => {
        clearTimeout(_timer)
        if(anim === false) {
          setAnim(true)
          //animCount++
        } else {
          setAnim(false)
        }
      }, 500)
    } else {
      setAnim(false)
    }
  }

  //console.log(anim, " < ANIMATE ARROW")
  /* if(zoneMediaURL !== undefined && zoneMediaURL !== "" && inZone !== undefined && inZone === "close") {
    const setPosTimer = setTimeout(() => {
      clearTimeout(setPosTimer)
      console.log("SETTING POS")
      // Setting Pos
      CheckAndSetPosition(2)
      CheckAndActivateMenu(2)
    }, 3000)
  } */
  /*if(zoneMediaURL !== undefined && zoneMediaURL !== "" && inZone !== undefined && inZone === "close") {
    const setPosTimer = setTimeout(() => {
      clearTimeout(setPosTimer)
      _menuPos = -2
      setMenuType('twitch')
    }, 100)
  }  else if(zoneMediaURL !== undefined && zoneMediaURL !== "" && inZone === undefined) {
    const setPosTimer = setTimeout(() => {
      clearTimeout(setPosTimer)
      setAble(false)
    }, 100)
  } */
  //console.log(zoneMediaURL, " --- ", inZone)



  // to display image and desc
  let roomImgPath:string = ""
  let roomImgDesc:string = ""
  let activeBgColor:string = ""
  let AllMenusTypes:any = []





  //let lastTabIndex = 0
  let tabsDisabled:any = []

  const cContent = useObserver(() => stores.contents.all)

  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgPath = content.url
  ))
  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgDesc = content.contentDesc
  ))

  // Setting default Menu Type
  cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    index === 0 && menuType === '' ? setMenuType(content.type) : ''
  ))
  // For Apps section [Room based loading directly from JSON file]
  cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    //console.log(content, " TYPE ", index)
    //content.type === menuType ? content.
    //console.log(menuType, " -------------- ", content.type)
    menuType === content.type ? activeBgColor = content.baseColor : ''
  ))
  cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    AllMenusTypes.push(content.type)
  ))


  //console.log(cContent, " ALL CONTENT")

  // Find last Index
  if(AllMenusTypes.length === 0) {
    //lastTabIndex = 2
    tabsDisabled.splice(0)
    if(Object(refEntity_0.current?.state).x === 0) {
      tabsDisabled.push('chat')
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      tabsDisabled.push('content')
    }
  } else {
    //lastTabIndex = AllMenusTypes.length + 2
  }

// Checking for tabs in normal states
function getNormalTabs() {
  /* let AllNormalTabs:any = []
  if(Object(refEntity_0.current?.state).x === 0) {
    AllNormalTabs.push(refEntity_0)
  }
  if(Object(refEntity_1.current?.state).x === 0) {
    AllNormalTabs.push(refEntity_1)
  }
  if(Object(refEntity_2.current?.state).x === 0) {
    AllNormalTabs.push(refEntity_2)
  }
  if(Object(refEntity_3.current?.state).x === 0) {
    AllNormalTabs.push(refEntity_3)
  }
  if(Object(refEntity_4.current?.state).x === 0) {
    AllNormalTabs.push(refEntity_4)
  }
  if(Object(refEntity_5.current?.state).x === 0) {
    AllNormalTabs.push(refEntity_5)
  }
  if(Object(refEntity_6.current?.state).x === 0) {
    AllNormalTabs.push(refEntity_6)
  }
  return AllNormalTabs */
  let _index = 0
  if(AllMenusTypes.length === 0) {
    if(Object(refEntity_0.current?.state).x === 0) {
      _index++
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      _index++
    }
  } else {
    //_index = (AllMenusTypes.length + 2)
    if(AllMenusTypes.length === 1) {
      if(Object(refEntity_0.current?.state).x === 0) {
        _index++
      }
      if(Object(refEntity_1.current?.state).x === 0) {
        _index++
      }
      if(Object(refEntity_2.current?.state).x === 0) {
        _index++
      }
    } else if(AllMenusTypes.length === 2) {
      if(Object(refEntity_0.current?.state).x === 0) {
        _index++
      }
      if(Object(refEntity_1.current?.state).x === 0) {
        _index++
      }
      if(Object(refEntity_2.current?.state).x === 0) {
        _index++
      }
      if(Object(refEntity_3.current?.state).x === 0) {
        _index++
      }
    }
  }
  return _index
}



//console.log(getNormalTabs())

let mediaIndex = getNormalTabs() //.length

let mediaItemIndex = AllMenusTypes.length === 0 ? 2 : ((AllMenusTypes.length + 2))

//console.log(mediaIndex, " ================ ", mediaItemIndex)

//console.log(mediaIndex, " TWITCH INDEX")















  //console.log(tabsDisabled.length, " LEN")


  //const elementsRef = useRef(cContent.filter(item => item.shareType === "appimg").map(() => React.createRef()));
  let press = false
  const loginStatus = useObserver(() => stores.participants.localId)
  const _roomName = sessionStorage.getItem("room") //getRoomName()
  const enterUserType = useObserver(() => getUserType())
  //console.log(loginStatus, " --------- !!!! -------- ", enterUserType)
  _able = able
  _menuType = menuType

  let tabBGTopBGWeb:number = 0 //100 //98 //98
  let tabBGTopBGMob:number = 0 //242 //238

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

     //console.log(enterUserType, " --CHECK RANDOM-- ", activeSkin, " --- ", stores.participants.local.information.randomAvatar, " ==== ", stores.participants.local.information.randomAvatar.length)
     if(getLoginClick() || loginStatus) {
       if(enterUserType === "N" && activeSkin === -1 && (stores.participants.local.information.randomAvatar === undefined || stores.participants.local.information.randomAvatar.length === 0)) {
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


  window.addEventListener('keydown', (ev) => {
    //ev.preventDefault()
    if(ev.ctrlKey) {return}

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


  /////////////////////////////////////////////////////////////////////////////////

  function trackPos(data:any, _index:number, _menu:string) {
    //console.log(data.x, " XXXX START")

    if(data.x > -100 || data.x === 0) {
      setPosition({ x: 0, y: 0 })
      return
    }

    if(_menu === "twitch") {
      setPositionMedia({ x: data.x, y: data.y })
    }

    setPosition({ x: data.x, y: data.y })
    _menuPos = position.x


    onDragging = true

    // TODAY
    //_menuType = _menu

    // Setting Pos
    CheckAndSetPosition(_index)
    CheckAndActivateMenu(_index)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Check How many items are there in the dock tab
    /* let _bool = false
    if(Object(refEntity_0.current?.state).x === 0 || Object(refEntity_1.current?.state).x === 0 || Object(refEntity_2.current?.state).x === 0) {
      _bool = true
    }
    console.log(_bool) */
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    if(_index === 0) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = (moveIndex * -51)
      }

    } else if(_index === 1) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = (moveIndex * -51)
      }
    } else if(_index === 2) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = (moveIndex * -51)
      }
    } else if(_index === 3) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = (moveIndex * -51)
      }
    } else if(_index === 4) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = (moveIndex * -51)
      }
    } else if(_index === 5) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = (moveIndex * -51)
      }
    } else if(_index === 6) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = (moveIndex * -51)
      }
    }
     */
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //setMenuType('chat')
    setActiveTabIndex(_index)

    //setMenuType('chat')
    //setAble(false)

    /* cContent.filter(item => item.shareType === "appimg").map((content, index) => (
      console.log(Object(refEntity.current?.state).x, " - ALL X POS - ", content.type)
    )) */
  }

  /* function setDefaultTrack(_url:string, _index:number) {
    if(_index === 0) {
      Object(refEntity_0.current?.state).x = -99999999
      console.log("Hiding Element", Object(refEntity_0.current))
    } else if(_index === 1) {
      Object(refEntity_1.current?.state).x = -99999999
    } else if(_index === 2) {
      Object(refEntity_2.current?.state).x = -99999999
    } else if(_index === 3) {
      Object(refEntity_3.current?.state).x = -99999999
    } else if(_index === 4) {
      Object(refEntity_4.current?.state).x = -99999999
    }

    ///////////////////////////////////////////////////////
    //window.open(_url, "_new")
    let externalWindow = window.open(_url, '', 'width=400,height=650,left=500,top=100');
    var timer = setInterval(function() {
      if(externalWindow?.closed) {
          clearInterval(timer);
      }})
  } */



  function CheckAndActivateMenu(_index:number) {
    //console.log(AllMenusTypes)
    if(AllMenusTypes.length === 0) {
      if(_index === 0) {
        if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else if(Object(refEntity_2.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType('twitch')
        } else {
          setMenuType('blank')
        }
      } else if(_index === 1) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else if(Object(refEntity_2.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType('twitch')
        } else {
          setMenuType('blank')
        }
      } else if(_index === 2) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else {
          setMenuType('blank')
        }
      }
    } else {
      if(_index === 0) {
        if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else if(Object(refEntity_2.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 2) {
            setMenuType(AllMenusTypes[_index])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_3.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 3) {
            setMenuType(AllMenusTypes[_index+1])
          }else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_4.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 4) {
            setMenuType(AllMenusTypes[_index+2])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_5.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 5) {
            setMenuType(AllMenusTypes[_index+3])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_6.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 6) {
            setMenuType(AllMenusTypes[_index+4])
          } else {
            setMenuType('twitch')
          }
        } else {
          setMenuType('blank')
        }
      } else if(_index === 1) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else if(Object(refEntity_2.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 2) {
            setMenuType(AllMenusTypes[_index-1])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_3.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 3) {
            setMenuType(AllMenusTypes[_index])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_4.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 4) {
            setMenuType(AllMenusTypes[_index+1])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_5.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 5) {
            setMenuType(AllMenusTypes[_index+3])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_6.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 6) {
            setMenuType(AllMenusTypes[_index+4])
          } else {
            setMenuType('twitch')
          }
        } else {
          setMenuType('blank')
        }
      } else if(_index >= 2) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else if(Object(refEntity_3.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 3) {
            setMenuType(AllMenusTypes[_index-2])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_4.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 4) {
            setMenuType(AllMenusTypes[_index-2])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_5.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 5) {
            setMenuType(AllMenusTypes[_index-2])
          } else {
            setMenuType('twitch')
          }
        } else if(Object(refEntity_6.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          if(mediaItemIndex !== 6) {
            setMenuType(AllMenusTypes[_index-2])
          } else {
            setMenuType('twitch')
          }
        } else {
          setMenuType('blank')
        }
      }
       /* else if(_index === 3) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else if(Object(refEntity_2.current?.state).x === 0) {
          setMenuType(AllMenusTypes[_index-2])
        } else if(Object(refEntity_4.current?.state).x === 0) {
          setMenuType(AllMenusTypes[_index-2])
        } else if(Object(refEntity_5.current?.state).x === 0) {
          setMenuType(AllMenusTypes[_index-2])
        } else if(Object(refEntity_6.current?.state).x === 0) {
          setMenuType(AllMenusTypes[_index-2])
        } else {
          setMenuType('blank')
        }
      } */
    }
  }


  function CheckAndSetPosition(_index:number) {
    if(_index === 0) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(mediaItemIndex !== 2) {
        if(Object(refEntity_2.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }

      if(mediaItemIndex !== 3) {
        if(Object(refEntity_3.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 4) {
        if(Object(refEntity_4.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 5) {
        if(Object(refEntity_5.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_5.current?.state).x = 0
          Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 6) {
        if(Object(refEntity_6.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_6.current?.state).x = 0
          Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
    } else if(_index === 1) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(mediaItemIndex !== 2) {
        if(Object(refEntity_2.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 3) {
        if(Object(refEntity_3.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 4) {
        if(Object(refEntity_4.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 5) {
        if(Object(refEntity_5.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_5.current?.state).x = 0
          Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 6) {
        if(Object(refEntity_6.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_6.current?.state).x = 0
          Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
    } else if(_index === 2) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(mediaItemIndex !== 2) {
        if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 3) {
        if(Object(refEntity_3.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 4) {
        if(Object(refEntity_4.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 5) {
        if(Object(refEntity_5.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_5.current?.state).x = 0
          Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 6) {
        if(Object(refEntity_6.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_6.current?.state).x = 0
          Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
    } else if(_index === 3) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(mediaItemIndex !== 2) {
        if(Object(refEntity_2.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 3) {
        if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 4) {
        if(Object(refEntity_4.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 5) {
        if(Object(refEntity_5.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_5.current?.state).x = 0
          Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 6) {
        if(Object(refEntity_6.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_6.current?.state).x = 0
          Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
    } else if(_index === 4) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(mediaItemIndex !== 2) {
        if(Object(refEntity_2.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 3) {
        if(Object(refEntity_3.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 4) {
        if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 5) {
        if(Object(refEntity_5.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_5.current?.state).x = 0
          Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 6) {
        if(Object(refEntity_6.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_6.current?.state).x = 0
          Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
    } else if(_index === 5) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(mediaItemIndex !== 2) {
        if(Object(refEntity_2.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 3) {
        if(Object(refEntity_3.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 4) {
        if(Object(refEntity_4.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 5) {
        if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_5.current?.state).x = 0
          Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 6) {
        if(Object(refEntity_6.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_6.current?.state).x = 0
          Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
    } else if(_index === 6) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(mediaItemIndex !== 2) {
        if(Object(refEntity_2.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 3) {
        if(Object(refEntity_3.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 4) {
        if(Object(refEntity_4.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 5) {
        if(Object(refEntity_5.current?.state).x < 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_5.current?.state).x = 0
          Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
      if(mediaItemIndex !== 6) {
        if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
          moveIndex = moveIndex + 1
        } else {
          Object(refEntity_6.current?.state).x = 0
          Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
        }
      }
    }
  }

  function setTrack(data:any, _url:string, _index:number, _menu:string) {
    //setMenuType(_type)

    /* if(_index === 0) {
      if(Object(refEntity_0.current?.state).x > 0) {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      _menuPos = -2
    } */

    /* if(data.x >= -1) {
    if(_index === 0) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x >= 0) {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * 51)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      _menuPos = -2
    } else if(_index === 1) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x === 0) {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_1.current?.state).x >= 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      _menuPos = -2
    } else if(_index === 2) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x === 0) {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_2.current?.state).x >= 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      _menuPos = -2
    } else if(_index === 3) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x === 0) {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_3.current?.state).x >= 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (0)
      }
      _menuPos = -2
    } else if(_index === 4) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x === 0) {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }

      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
      if(Object(refEntity_4.current?.state).x >= 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = (moveIndex * -51)
      }
      _menuPos = -2
    }
  } */


  // 30
  //console.log(window.innerHeight, " --- ", data.y)
  //console.log(data.x, " ---- ", (stores.map.screenSize))

  //console.log(data.y, "  < " , ((_index * -51)))

  //if(data.x === -40 || data.x === 0) {return}

  const resetDrag = setTimeout(() => {
    clearTimeout(resetDrag)
    onDragging = false
  }, 300)



  /* console.log(data.x, " ---- ", clickType)
  if(data.x < -500) {
    Object(refEntity_2.current?.state).x = -99999999
    return
  } */


    //if(data.y < (-135 + (_index * -51)) || data.y > (675 + (_index * -51)) || data.x < (-(stores.map.screenSize[0] - 40)) || data.x > 0) {
    if(data.y < ((_index * -51)) || data.y > (675 + (_index * -51)) || data.x < (-(stores.map.screenSize[0] - 40)) || data.x > 0) {
      ///////////////////////////////////////////////////////
      // Hide the Tab
      if(_index === 0) {
        //Object(refEntity_0.current?.state).x = -99999999
        ResetAppsPanel(0, 'chat')
        return
      } else if(_index === 1) {
        //Object(refEntity_1.current?.state).x = -99999999
        ResetAppsPanel(1, 'content')
        return
      } else if(_index === 2) {
        Object(refEntity_2.current?.state).x = -99999999
      } else if(_index === 3) {
        Object(refEntity_3.current?.state).x = -99999999
      } else if(_index === 4) {
        Object(refEntity_4.current?.state).x = -99999999
      } else if(_index === 5) {
        Object(refEntity_5.current?.state).x = -99999999
      } else if(_index === 6) {
        Object(refEntity_6.current?.state).x = -99999999
      } else if(_index === 9) {
        Object(refEntity_9.current?.state).x = -99999999
        /* ResetAppsPanel(9, 'twitch')
        return */
      }

      ///////////////////////////////////////////////////////
      //window.open(_url, "_new")

      //console.log(_index, " INDEX ", _url)
      // zonemedia URL (filter out)
      let mediaType = _url.indexOf('twitch')
      let scWidth = window.innerWidth
      let scHeight = window.innerHeight
      let winWidth = window.innerWidth// - 100
      let winHeight = window.innerHeight// - 100
      var winLeft = ( scWidth - winWidth ) / 2
      var winTop = ( scHeight - winHeight ) / 2

      //window.open(_url, "_new")
      let externalWindow = window.open(_index === mediaItemIndex ? (mediaType !== -1 ? (_url + '&parent=' + videoParent + '&autoplay=true') : (_url + "?autoplay=true")) : _url, '', 'width='+winWidth+',height='+winHeight+',left='+winLeft+',top='+winTop);



      //let externalWindow = window.open(_index === mediaItemIndex ? _url + '&parent=' + videoParent + '&autoplay=true' : _url, '', 'width=400,height=650,left=500,top=100');
      var timer = setInterval(function() {
        if(externalWindow?.closed) {
            clearInterval(timer);
            //alert(_index);
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //CheckAndSetPosition(_index)
            if(_index === 0) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * 51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(mediaItemIndex !== 2) {
                if(Object(refEntity_2.current?.state).x === 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_2.current?.state).x < 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 3) {
                if(Object(refEntity_3.current?.state).x === 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_3.current?.state).x < 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 4) {
                if(Object(refEntity_4.current?.state).x === 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_4.current?.state).x < 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 5) {
                if(Object(refEntity_5.current?.state).x === 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_5.current?.state).x < 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 6) {
                if(Object(refEntity_6.current?.state).x === 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                }
              } else {
                if(Object(refEntity_6.current?.state).x < 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

            } else if(_index === 1) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(mediaItemIndex !== 2) {
                if(Object(refEntity_2.current?.state).x === 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_2.current?.state).x < 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 3) {
                if(Object(refEntity_3.current?.state).x === 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_3.current?.state).x < 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 4) {
                if(Object(refEntity_4.current?.state).x === 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_4.current?.state).x < 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 5) {
                if(Object(refEntity_5.current?.state).x === 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_5.current?.state).x < 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 6) {
                if(Object(refEntity_6.current?.state).x === 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                }
              } else {
                if(Object(refEntity_6.current?.state).x < 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

            } else if(_index === 2) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(mediaItemIndex !== 2) {
                if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 3) {
                if(Object(refEntity_3.current?.state).x === 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_3.current?.state).x < 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 4) {
                if(Object(refEntity_4.current?.state).x === 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_4.current?.state).x < 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 5) {
                if(Object(refEntity_5.current?.state).x === 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_5.current?.state).x < 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 6) {
                if(Object(refEntity_6.current?.state).x === 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                }
              } else {
                if(Object(refEntity_6.current?.state).x < 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

            } else if(_index === 3) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                //Object(refEntity_1.current?.state).y = (0)
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(mediaItemIndex !== 2) {
                if(Object(refEntity_2.current?.state).x === 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_2.current?.state).x < 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 3) {
                if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 4) {
                if(Object(refEntity_4.current?.state).x === 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = (0)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_4.current?.state).x < 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 5) {
                if(Object(refEntity_5.current?.state).x === 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_5.current?.state).x < 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 6) {
                if(Object(refEntity_6.current?.state).x === 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                }
              } else {
                if(Object(refEntity_6.current?.state).x < 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

            } else if(_index === 4) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                //Object(refEntity_1.current?.state).y = (0)
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(mediaItemIndex !== 2) {
                if(Object(refEntity_2.current?.state).x === 0) {
                  Object(refEntity_2.current?.state).x = 0
                  //Object(refEntity_2.current?.state).y = (0)
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_2.current?.state).x < 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 3) {
                if(Object(refEntity_3.current?.state).x === 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_3.current?.state).x < 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 4) {
                if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 5) {
                if(Object(refEntity_5.current?.state).x === 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_5.current?.state).x < 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 6) {
                if(Object(refEntity_6.current?.state).x === 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                }
              } else {
                if(Object(refEntity_6.current?.state).x < 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }
            } else if(_index === 5) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                //Object(refEntity_1.current?.state).y = (0)
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(mediaItemIndex !== 2) {
                if(Object(refEntity_2.current?.state).x === 0) {
                  Object(refEntity_2.current?.state).x = 0
                  //Object(refEntity_2.current?.state).y = (0)
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_2.current?.state).x < 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 3) {
                if(Object(refEntity_3.current?.state).x === 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_3.current?.state).x < 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 4) {
                if(Object(refEntity_4.current?.state).x === 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_4.current?.state).x < 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 5) {
                if(Object(refEntity_5.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_5.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 6) {
                if(Object(refEntity_6.current?.state).x === 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                }
              } else {
                if(Object(refEntity_6.current?.state).x < 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

            } else if(_index === 6) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                //Object(refEntity_1.current?.state).y = (0)
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(mediaItemIndex !== 2) {
                if(Object(refEntity_2.current?.state).x === 0) {
                  Object(refEntity_2.current?.state).x = 0
                  //Object(refEntity_2.current?.state).y = (0)
                  Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_2.current?.state).x < 0) {
                  Object(refEntity_2.current?.state).x = 0
                  Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 3) {
                if(Object(refEntity_3.current?.state).x === 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_3.current?.state).x < 0) {
                  Object(refEntity_3.current?.state).x = 0
                  Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 4) {
                if(Object(refEntity_4.current?.state).x === 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_4.current?.state).x < 0) {
                  Object(refEntity_4.current?.state).x = 0
                  Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 5) {
                if(Object(refEntity_5.current?.state).x === 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                } else {
                  moveIndex = moveIndex + 1
                }
              } else {
                if(Object(refEntity_5.current?.state).x < 0) {
                  Object(refEntity_5.current?.state).x = 0
                  Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }

              if(mediaItemIndex !== 6) {
                if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
                }
              } else {
                if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
                  Object(refEntity_6.current?.state).x = 0
                  Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
                }
              }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            setPosition({x:0, y:0})
            setPositionMedia({x:0, y:0})
            // CHECKING MENU
            //console.log(_menu, " Menu TO be active")
            setMenuType(_menu)
        }
    }, 100);
      ///////////////////////////////////////////////////////
      /* if(_index === 0) {
        let moveIndex = 0
        if(Object(refEntity_0.current?.state).x < 0) {
          Object(refEntity_0.current?.state).x = 0
          Object(refEntity_0.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_1.current?.state).x === 0) {
          Object(refEntity_1.current?.state).x = 0
          Object(refEntity_1.current?.state).y = (moveIndex * 51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_2.current?.state).x === 0) {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_3.current?.state).x === 0) {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_4.current?.state).x === 0) {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = (moveIndex * -51)
        }
      } else if(_index === 1) {
        let moveIndex = 0
        if(Object(refEntity_0.current?.state).x === 0) {
          Object(refEntity_0.current?.state).x = 0
          Object(refEntity_0.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_1.current?.state).x < 0) {
          Object(refEntity_1.current?.state).x = 0
          Object(refEntity_1.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_2.current?.state).x === 0) {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_3.current?.state).x === 0) {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_4.current?.state).x === 0) {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = (moveIndex * -51)
        }
      } else if(_index === 2) {
        let moveIndex = 0
        if(Object(refEntity_0.current?.state).x === 0) {
          Object(refEntity_0.current?.state).x = 0
          Object(refEntity_0.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_1.current?.state).x === 0) {
          Object(refEntity_1.current?.state).x = 0
          Object(refEntity_1.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_2.current?.state).x < 0) {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_3.current?.state).x === 0) {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_4.current?.state).x === 0) {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = (moveIndex * -51)
        }
      } else if(_index === 3) {
        let moveIndex = 0
        if(Object(refEntity_0.current?.state).x === 0) {
          Object(refEntity_0.current?.state).x = 0
          Object(refEntity_0.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_1.current?.state).x === 0) {
          Object(refEntity_1.current?.state).x = 0
          Object(refEntity_1.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_2.current?.state).x === 0) {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_3.current?.state).x < 0) {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_4.current?.state).x === 0) {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = (0)
        }
      } else if(_index === 4) {
        let moveIndex = 0
        if(Object(refEntity_0.current?.state).x === 0) {
          Object(refEntity_0.current?.state).x = 0
          Object(refEntity_0.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_1.current?.state).x === 0) {
          Object(refEntity_1.current?.state).x = 0
          Object(refEntity_1.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_2.current?.state).x === 0) {
          Object(refEntity_2.current?.state).x = 0
          Object(refEntity_2.current?.state).y = (0)
        } else {
          moveIndex = moveIndex + 1
        }

        if(Object(refEntity_3.current?.state).x === 0) {
          Object(refEntity_3.current?.state).x = 0
          Object(refEntity_3.current?.state).y = (moveIndex * -51)
        } else {
          moveIndex = moveIndex + 1
        }
        if(Object(refEntity_4.current?.state).x < 0) {
          Object(refEntity_4.current?.state).x = 0
          Object(refEntity_4.current?.state).y = (moveIndex * -51)
        }
      } */

      ///////////////////////////////////////////////////////
        _menuPos = -2
        // TODAY
        //setPosition({x:0, y:0})
        setAble(false)
        //console.log(_menuPos, " menuPos")
    }
  }

//console.log(able, " able")

//////////////////////////////////////////

/* let timer = 0
let delay = 200;
let prevent = false;
 */

/* function onSingleClickHandler() {
  timer = window.setTimeout(() => {
    if (!prevent) {
      console.log("single click")
    }
  }, delay);
};
function onDoubleClickHandler(){
  clearTimeout(timer);
  prevent = true;
  setTimeout(() => {
    prevent = false;
    //console.log("double click")

  }, delay);
}; */
//////////////////////////////////////////
function ResetAppsPanel(index:number, _type:string) {
  if(index === 0) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * 51)
    } else {
      moveIndex = moveIndex + 1
    }

    /* if(mediaItemIndex !== 2) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_2.current?.state).x < 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 3) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_3.current?.state).x < 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 4) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_4.current?.state).x < 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 5) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_5.current?.state).x === 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_5.current?.state).x < 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 6) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_6.current?.state).x === 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else {
      if(Object(refEntity_6.current?.state).x < 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

  } else if(index === 1) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    /* if(mediaItemIndex !== 2) { */
   if(_type !== 'twitch') {
      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_2.current?.state).x < 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 3) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_3.current?.state).x < 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 4) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_4.current?.state).x < 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    if(mediaItemIndex !== 5) {
    /* if(_type !== 'twitch') { */
      if(Object(refEntity_5.current?.state).x === 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_5.current?.state).x < 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    if(mediaItemIndex !== 6) {
    /* if(_type !== 'twitch') { */
      if(Object(refEntity_6.current?.state).x === 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else {
      if(Object(refEntity_6.current?.state).x < 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

  } else if(index === 2) {
    let moveIndex = 0

      if(Object(refEntity_0.current?.state).x === 0) {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }


      if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }


    /* if(mediaItemIndex !== 2) { */
   if(_type !== 'twitch') {
      if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 3) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_3.current?.state).x < 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 4) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_4.current?.state).x < 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 5) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_5.current?.state).x === 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_5.current?.state).x < 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 6) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_6.current?.state).x === 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else {
      if(Object(refEntity_6.current?.state).x < 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

  } else if(index === 3) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      //Object(refEntity_1.current?.state).y = (0)
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    /* if(mediaItemIndex !== 2) { */
   if(_type !== 'twitch') {
      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_2.current?.state).x < 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 3) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_3.current?.state).x < 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 4) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        //Object(refEntity_4.current?.state).y = (0)
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_4.current?.state).x < 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 5) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_5.current?.state).x === 0) {
        Object(refEntity_5.current?.state).x = 0
        //Object(refEntity_5.current?.state).y = (0)
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_5.current?.state).x < 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

   /*  if(mediaItemIndex !== 6) { */
   if(_type !== 'twitch') {
      if(Object(refEntity_6.current?.state).x === 0) {
        Object(refEntity_6.current?.state).x = 0
        //Object(refEntity_6.current?.state).y = (0)
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else {
      if(Object(refEntity_6.current?.state).x < 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

  } else if(index === 4) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      //Object(refEntity_1.current?.state).y = (0)
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    /* if(mediaItemIndex !== 2) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        //Object(refEntity_2.current?.state).y = (0)
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_2.current?.state).x < 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 3) { */
   if(_type !== 'twitch') {
      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_3.current?.state).x < 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 4) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_4.current?.state).x < 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 5) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_5.current?.state).x === 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_5.current?.state).x < 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 6) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_6.current?.state).x === 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else {
      if(Object(refEntity_6.current?.state).x < 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

  } else if(index === 5) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      //Object(refEntity_1.current?.state).y = (0)
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    /* if(mediaItemIndex !== 2) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_2.current?.state).x < 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 3) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_3.current?.state).x < 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 4) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_4.current?.state).x < 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 5) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_5.current?.state).x < 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 6) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_6.current?.state).x === 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else {
      if(Object(refEntity_6.current?.state).x < 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }
  } else if(index === 6) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      //Object(refEntity_1.current?.state).y = (0)
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    /* if(mediaItemIndex !== 2) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_2.current?.state).x === 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = (0)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_2.current?.state).x < 0) {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 3) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_3.current?.state).x === 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_3.current?.state).x < 0) {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 4) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_4.current?.state).x === 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_4.current?.state).x < 0) {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 5) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_5.current?.state).x === 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      } else {
        moveIndex = moveIndex + 1
      }
    } else {
      if(Object(refEntity_5.current?.state).x < 0) {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }

    /* if(mediaItemIndex !== 6) { */
    if(_type !== 'twitch') {
      if(Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else {
      if(Object(refEntity_6.current?.state).x < 0) {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
      }
    }
  }
  _menuPos = -2
  setPosition({x:0, y:0})
  setPositionMedia({x:0, y:0})
  setActiveTabIndex(-1)
  setMenuType(_type)
}
//////////////////////////////////////////
let clicks:any = [];
let timeout:any;
// Single & Double Click
function singleClick(event:any, tabType:string, tabURL:string, tabIndex:number) {
  //alert(tabType);
  //console.log(tabIndex, " ---- ", tabType, " --- ", position.x, " --- ", activeTabIndex)
  // ResetAppsPanel((mediaItemIndex), 'twitch')
  //console.log(activeTabIndex, " --- ", tabIndex)
  //console.log(onDragging)
  //console.log('RESET PANEL ', position.x, " ==== ", tabIndex, " <><><> ", activeTabIndex)

  if((position.x < 0 || position.x > 0) && activeTabIndex === tabIndex) {
    if(onDragging === false) {
      ResetAppsPanel((tabIndex), tabType)
    }
    return
  }

  if(tabIndex === 0) {
    //console.log(Object(refEntity_0.current?.state).x, " >>>>>> 0")
    if((Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) /* && activeTabIndex === tabIndex */) {
      ResetAppsPanel((tabIndex), tabType)
      return

    }
  } else if(tabIndex === 1) {
    //console.log(Object(refEntity_1.current?.state).x, " >>>>>> 1")
    if((Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) /* && activeTabIndex === tabIndex */) {
      ResetAppsPanel((tabIndex), tabType)
      return
    }
  } else if(tabIndex === 2) {
    if((Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) /* && activeTabIndex === tabIndex */) {
      ResetAppsPanel((tabIndex), tabType)
      return
    }
  } else if(tabIndex === 3) {
    if((Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) /* && activeTabIndex === tabIndex */) {
      ResetAppsPanel((tabIndex), tabType)
      return
    }
  } else if(tabIndex === 4) {
    if((Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) /* && activeTabIndex === tabIndex */) {
      ResetAppsPanel((tabIndex), tabType)
      return
    }
  } else if(tabIndex === 5) {
    if((Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) /* && activeTabIndex === tabIndex */) {
      ResetAppsPanel((tabIndex), tabType)
      return
    }
  } else if(tabIndex === 6) {
    if((Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) /* && activeTabIndex === tabIndex */) {
      ResetAppsPanel((tabIndex), tabType)
      return
    }
  }

    press = true;
    if(able === true) {
      if(menuType === tabType) {
        setAble(false)
      }
    } else
    if(able === false) {
      setAble(true)
    }
    setMenuType(tabType)
    setActiveTabIndex(tabIndex)
}

function doubleClick(event:any, tabType:string, tabURL:string, tabIndex:number) {
  //alert(tabType);
  if(tabIndex === 0 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {return}
    Object(refEntity_0.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0])
    Object(refEntity_0.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 1 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {return}
    Object(refEntity_1.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0])
    Object(refEntity_1.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 2 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {return}
    Object(refEntity_2.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0])
    Object(refEntity_2.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 3 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {return}
    Object(refEntity_3.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_3.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 4 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {return}
    Object(refEntity_4.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_4.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 5 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {return}
    Object(refEntity_5.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_5.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25) //(120)
  } else if(tabIndex === 6 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) {return}
    Object(refEntity_6.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_6.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 9 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_9.current?.state).x < 0 || Object(refEntity_9.current?.state).x > 0) {return}
    Object(refEntity_9.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    //Object(refEntity_9.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
    Object(refEntity_9.current?.state).y = isSmartphone() ? (0) : (0)
  } else {
    if(tabIndex === 0) {
      if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {return}
      Object(refEntity_0.current?.state).x = -99999999
    } else if(tabIndex === 1) {
      if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {return}
      Object(refEntity_1.current?.state).x = -99999999
    } else if(tabIndex === 2) {
      if(Object(refEntity_2.current?.state).x < -99999998 || Object(refEntity_2.current?.state).x > 0 ) {
        setPosition({x:0, y:0})
        return
      }
      Object(refEntity_2.current?.state).x = -99999999
    } else if(tabIndex === 3) {
      /* if(Object(refEntity_3.current?.state).x > 0 || Object(refEntity_3.current?.state).x > 0) {return} */
      if(Object(refEntity_3.current?.state).x < -99999998 || Object(refEntity_3.current?.state).x > 0 ) {
        setPosition({x:0, y:0})
        return
      }
      Object(refEntity_3.current?.state).x = -99999999
    } else if(tabIndex === 4) {
      /* if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {return} */
      if(Object(refEntity_4.current?.state).x < -99999998 || Object(refEntity_4.current?.state).x > 0 ) {
        setPosition({x:0, y:0})
        return
      }
      Object(refEntity_4.current?.state).x = -99999999
    } else if(tabIndex === 5) {
      /* if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {return} */
      if(Object(refEntity_5.current?.state).x < -99999998 || Object(refEntity_5.current?.state).x > 0 ) {
        setPosition({x:0, y:0})
        return
      }
      Object(refEntity_5.current?.state).x = -99999999
    } else if(tabIndex === 6) {
      /* if(Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) {return} */
      if(Object(refEntity_6.current?.state).x < -99999998 || Object(refEntity_6.current?.state).x > 0 ) {
        setPosition({x:0, y:0})
        return
      }
      Object(refEntity_6.current?.state).x = -99999999
    } else if(tabIndex === 9) {
      /* if(Object(refEntity_9.current?.state).x < 0 || Object(refEntity_9.current?.state).x > 0) {return} */
      if(Object(refEntity_9.current?.state).x < -99999998 || Object(refEntity_9.current?.state).x > 0 ) {
        setPosition({x:0, y:0})
        return
      }
      Object(refEntity_9.current?.state).x = -99999999
    }

    ///////////////////////////////////////////////////////
    //console.log(tabIndex, " <><><> ", tabURL)

    // zonemedia URL (filter out)
    let mediaType = tabURL.indexOf('twitch')

    //console.log(window.innerWidth, " ---- ", window.outerWidth)
    let scWidth = window.innerWidth
    let scHeight = window.innerHeight
    let winWidth = window.innerWidth// - 100
    let winHeight = window.innerHeight// - 100
    var winLeft = ( scWidth - winWidth ) / 2
    var winTop = ( scHeight - winHeight ) / 2

    //window.open(_url, "_new")
    let externalWindow = window.open(tabType === 'twitch' ? (mediaType !== -1 ? (tabURL + '&parent=' + videoParent + '&autoplay=true') : (tabURL + "?autoplay=true")) : tabURL, '', 'width='+winWidth+',height='+winHeight+',left='+winLeft+',top='+winTop);


    var timer = setInterval(function() {
      if(externalWindow?.closed) {
          clearInterval(timer);
          //alert(_index);
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //CheckAndSetPosition(_index)
          if(tabIndex === 0) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(mediaItemIndex !== 2) {
              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_2.current?.state).x < 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 3) {
              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_3.current?.state).x < 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 4) {
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_4.current?.state).x < 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 5) {
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_5.current?.state).x < 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 6) {
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else {
              if(Object(refEntity_6.current?.state).x < 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

          } else if(tabIndex === 1) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(mediaItemIndex !== 2) {
              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_2.current?.state).x < 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 3) {
              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_3.current?.state).x < 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 4) {
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_4.current?.state).x < 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 5) {
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_5.current?.state).x < 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 6) {
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else {
              if(Object(refEntity_6.current?.state).x < 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

          } else if(tabIndex === 2) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(mediaItemIndex !== 2) {
              if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 3) {
              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_3.current?.state).x < 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 4) {
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_4.current?.state).x < 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 5) {
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_5.current?.state).x < 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 6) {
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else {
              if(Object(refEntity_6.current?.state).x < 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

          } else if(tabIndex === 3) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              //Object(refEntity_1.current?.state).y = (0)
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(mediaItemIndex !== 2) {
              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_2.current?.state).x < 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 3) {
              if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 4) {
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_4.current?.state).x < 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 5) {
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_5.current?.state).x < 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 6) {
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else {
              if(Object(refEntity_6.current?.state).x < 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

          } else if(tabIndex === 4) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(mediaItemIndex !== 2) {
              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                //Object(refEntity_2.current?.state).y = (0)
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_2.current?.state).x < 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 3) {
              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_3.current?.state).x < 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 4) {
              if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 5) {
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_5.current?.state).x < 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 6) {
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else {
              if(Object(refEntity_6.current?.state).x < 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

          } else if(tabIndex === 5) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              //Object(refEntity_1.current?.state).y = (0)
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(mediaItemIndex !== 2) {
              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                //Object(refEntity_2.current?.state).y = (0)
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_2.current?.state).x < 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 3) {
              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_3.current?.state).x < 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 4) {
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_4.current?.state).x < 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 5) {
              if(Object(refEntity_5.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_5.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 6) {
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else {
              if(Object(refEntity_6.current?.state).x < 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

          } else if(tabIndex === 6) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              //Object(refEntity_1.current?.state).y = (0)
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(mediaItemIndex !== 2) {
              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                //Object(refEntity_2.current?.state).y = (0)
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_2.current?.state).x < 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 3) {
              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_3.current?.state).x < 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 4) {
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_4.current?.state).x < 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 5) {
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
            } else {
              if(Object(refEntity_5.current?.state).x < 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }

            if(mediaItemIndex !== 6) {
              if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else {
              if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (0) : (0)
              }
            }
          }
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //if(tabIndex === 9) {
            //_menuPos = -20
          //} else {
            _menuPos = -2
          //}
          setPosition({x:0, y:0})
          setPositionMedia({x:0, y:0})
          setMenuType(tabType)
      }
  }, 100);
    ///////////////////////////////////////////////////////
    //_menuPos = -2
    //setAble(false)

  }

  //_menuPos = -(stores.map.screenSize[0]/2)
  CheckAndSetPosition(tabIndex)

  // When double click
  CheckAndActivateMenu(tabIndex)

  setActiveTabIndex(tabIndex)

  // Enable When needed
  setAble(false)
}

function onTabMenuClick(event:any, _type:string, _url:string, _index:number) {
  //onDragging = false
  event.preventDefault();
  clicks.push(new Date().getTime());
  window.clearTimeout(timeout);
  const clickTimeout = window.setTimeout(() => {
    clearTimeout(clickTimeout) // 250
    if (clicks.length > 1 && clicks[clicks.length - 1] - clicks[clicks.length - 2] < 300) {
      //console.log("double click")
      //clickType = 'double'
      doubleClick(event.target, _type, _url, _index)
    } else {
      //console.log("single click")
      //clickType = 'single'
      singleClick(event.target, _type, _url, _index)
    }
  }, 250);
}

  //////////////////////////////////////////////////////////////////////////////////

  return <Observer>{()=>{
    return <div ref={refDiv} className={classes.back} style={{backgroundColor: '#0f5c81'/* rgb2Color(roomInfo.backgroundFill) */}}>
        {/* <SplitPane className={classes.fill} split="vertical" resizerClassName={clsSplit.resizerVertical}
          minSize={0} defaultSize="7em"> */}
          <SplitPane pane2Style={able === true ? {display: 'block', backgroundColor: menuType === 'chat' ? '#0f5c81' : menuType === 'content' || menuType === 'twitch' ? '#8b5e3c' : menuType !== 'blank' ? activeBgColor : 'white'
/* '#5f7ca020' */, boxShadow: menuType !== 'blank' ? '5px 10px 10px 3px black' : '5px 10px 10px 3px white'} : {display: 'none', backgroundColor: '#FFF'}} className={classes.fill} split="vertical" /* resizerClassName={clsSplit.resizerVertical} */
  minSize={0} defaultSize={able === true ? isSmartphone() ? '40%' : (_menuType !== 'chat' && _menuType !== 'content') ? "73%" : '73%'/* "77%" *//* "85%" */ : "100%"}>
          {/* <LeftBar stores={stores}/> */}
          <Fragment>
            <MainScreen showAllTracks = {DEBUG_VIDEO} stores={stores} />
            <Observer>{() => <Map transparent={sharedContentsStore.mainScreenStream !== undefined
             || DEBUG_VIDEO} stores={stores} />
            }</Observer>


            {/* /////////////////////////////////SEPARATE BLOCK/////////////////////////////////// */}
             {/* <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex'}}
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
               <img src={tabCollapseChat} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : 18}} draggable={false} alt='' />
                <img src={able ? tabChatActive : tabChat} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px', userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
             </div> */}


             {/* <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex'}}
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
              <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:isSmartphone() ? '119px' : '49px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : 17}} draggable={false} alt='' />
              <img src={able ? tabContentActive : tabContent} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:isSmartphone() ? '122px' : '52px', left:isSmartphone() ? '10px' : '5px', userSelect:'none', zIndex:showIntro ? 0 : 98}} draggable={false} alt='' />
             </div> */}

            {/* /////////////////////////////////CHAT APP/////////////////////////////////// */}

            <Draggable /* bounds={{top: (0 * -51), left: -(stores.map.screenSize[0] - 40), right: -40, bottom: (stores.map.screenSize[1] - (50 + (0 * 51)))}} */ ref={refEntity_0} key={0} onDrag={(e, data) => trackPos(data, 0, 'chat')} onStop={(e, data) => setTrack(data, '', 0, 'chat')} defaultPosition={{x: 0, y: 0}}>

            <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + (0 * 119) : tabBGTopBGWeb + (0*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : (activeTabIndex === 0) ? 19 : (18 - (0+2)), height:'100%'}}>
            <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : (18 - (0+2))}}
            ////////////////////////////////////////////////////////////////////
              onClick={(e) => {
                // handling single & double click
                onTabMenuClick(e, 'chat', '', 0)
              }}
              onTouchEnd={(e) => {
                onTabMenuClick(e, 'chat', '', 0)
              }}
              >

                <img src={tabCollapseChat} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : (18 - (0+2))}} draggable={false} alt='' />
                <img src={tabChatActive} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
              </div>

              <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px'/* , top:'0px' */, backgroundColor:'#0f5c81', borderRadius:'2px', minWidth:'280px', top:'0px',
              display:((Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0)) ? 'block' : 'none' , zIndex:-9999}}>
              {/* <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                onClick={() => {
                  ResetAppsPanel(0, 'chat')
                }}
                onTouchEnd={() => {
                  ResetAppsPanel(0, 'chat')
                }}
              /> */}
                <LeftBar stores={stores} type={'chat'}/>
              </div>
              </div>
            </Draggable>

             {/* /////////////////////////////////CONTENT APP////////////////////////////////// */}

             <Draggable /* bounds={{top: (1 * -51), left: -(stores.map.screenSize[0] - 40), right: -40, bottom: (stores.map.screenSize[1] - (50 + (1 * 51)))}} */ ref={refEntity_1} key={1} onDrag={(e, data) => trackPos(data, 1, 'content')} onStop={(e, data) => setTrack(data, '', 1, 'content')} defaultPosition={{x: 0, y: 0}}>
            <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + (1 * 119) : tabBGTopBGWeb + (1*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : (activeTabIndex === 1) ? 19 : (18 - (1+2)), height:'100%'}}>
            <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : (18 - (1+2))}}
              onClick={(e) => {
                // handling single & double click
                onTabMenuClick(e, 'content', '', 1)
              }}
              onTouchEnd={(e) => {
                onTabMenuClick(e, 'content', '', 1)
              }}
              >
                <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : (18 - (1+2))}} draggable={false} alt='' />
                <img src={tabContentActive} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
              </div>

              <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px'/* , top:'0px' */, backgroundColor:'#8b5e3c', borderRadius:'2px', minWidth:'280px', top:'0px',
              display:((Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0)) ? 'block' : 'none' , zIndex:-9999}}>
              {/* <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                onClick={() => {
                  ResetAppsPanel(1, 'content')
                }}
                onTouchEnd={() => {
                  ResetAppsPanel(1, 'content')
                }}
              /> */}
                <LeftBar stores={stores} type={'content'}/>
              </div>
              </div>
            </Draggable>
              {/* /////////////////////////////////////////////////////////////////// */}



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
             {/* console.log(activeTabIndex, " TAB active") */}
             <>
            { cContent.filter(item => item.shareType === "appimg").map((content, index) => (
              <Draggable/*  bounds={{ top: -2500, left: -2500, right: 0, bottom: 2500 }} */ bounds={content.url === '' ? {top: ((index+2) * -51), left: -(stores.map.screenSize[0] - 40), right: -40, bottom: (stores.map.screenSize[1] - (50 + ((index+2) * 51)))} : {}}

              ref={(index+2) === 2 ? refEntity_2 : (index+2) === 3 ? refEntity_3 : (index+2) === 4 ? refEntity_4 : (index+2) === 5 ? refEntity_5 : (index+2) === 6 ? refEntity_6 : (index+2) === 7 ? refEntity_7 : refEntity_8}

              key={(index+2)} onDrag={(e, data) => trackPos(data, (index+2), content.type)} onStop={(e, data) => setTrack(data, content.url, (index+2), content.type)} /* disabled={able ? true : false} */ defaultPosition={{x: 0, y: 0}}>

                <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + ((index+2) * 119) : tabBGTopBGWeb + ((index+2)*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === content.type ? 19 : (activeTabIndex === (index+2)) ? 19 : (18 - ((index+2)+2)), height:'100%'}}>
                <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === content.type ? 19 : (18 - ((index+2)+2))}}
                ////////////////////////////////////////////////////////////////////
                  onClick={(e) => {

                    // handling single & double click
                    onTabMenuClick(e, content.type, content.url, (index+2))

                    /*
                    //console.log(position.x, " --- ", menuType)
                    if((position.x < 0 || position.x > 0) && activeTabIndex === index) {return}
                    //if(position.x < -2 && menuType === content.type) {
                      //setAble(false)
                      //setMenuType('')
                    //} else {

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
                    //} */
                  }}
                  onTouchEnd={(e) => {
                    onTabMenuClick(e, content.type, content.url, (index+2))
                  }}
                  ////////////////////////////////////////////////////////////////////
                 /*  onClick={onSingleClickHandler}
                  onDoubleClick={onDoubleClickHandler} */
                  /* onClick={(e) => {
                    if(position.x < 0 || position.x > 0) {return}
                    timer = window.setTimeout(() => {
                      if (!prevent) {
                        //console.log("single click")
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
                      }
                    }, delay);
                  }}
                  onDoubleClick={(e) => {
                    clearTimeout(timer);
                    prevent = true;
                    setTimeout(() => {
                      prevent = false;
                      //console.log("double click")
                      //setTrack(data, content.url, index)
                      //console.log(data, " --- ", index)
                      setDefaultTrack(content.url, index)
                    }, delay);
                  }} */
                >
                  <img src={content.baseImage} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px'/* isSmartphone() ? tabBGTopBGMob + (index * 119) : tabBGTopBGWeb + (index*51) */, left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === content.type ? 19 : (18 - ((index+2)+2))}} draggable={false} alt='' />
                  <img src={content.baseIcon} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px'/* isSmartphone() ? tabBGTopIconMob + (index * 119) : tabBGTopIconWeb + (index*51) */, left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
                </div>

                <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px'/* , top:'0px' */, backgroundColor:content.baseColor, borderRadius:'2px', minWidth:'280px', top:'0px'/* isSmartphone() ? tabBGTopBGMob + (index * 119) : tabBGTopBGWeb + (index*51) */,
                display:((Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) && (index+2) === 2) ? 'block' : ((Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) && (index+2) === 3) ? 'block' : ((Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) && (index+2) === 4) ? 'block' : ((Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) && (index+2) === 5) ? 'block' : ((Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) && (index+2) === 6) ? 'block' : 'none'

                /* Object(refEntity_5.current?.state).x < 0 ? 'block' : Object(refEntity_6.current?.state).x < ? 'block' : Object(refEntity_7.current?.state).x < 0 ? 'block' : Object(refEntity_8.current?.state).x < 0 ? 'block' : 'none' */, zIndex:-9999}}>
                {/* <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                  onClick={() => {
                    //console.log("Close Tab click")
                    //console.log(Object(refEntity.current?.state).x)
                    ResetAppsPanel((index+2), content.type)
                  }}
                  onTouchEnd={() => {
                    //console.log("Close Tab click")
                    //console.log(Object(refEntity.current?.state).x)
                    ResetAppsPanel((index+2), content.type)
                  }}
                 /> */}

                 {/* {(content.type.toLowerCase() !== 'chat' || content.type.toLowerCase() !== 'content') ?
                    <iframe src={content.url} title={content.type} allowTransparency={true} frameBorder={0} style={{width:'100%', height:'100%'}}></iframe>
                    : <LeftBar stores={stores}/>}
 */}
                  {}
                 {/*  {content.type === 'chat' || content.type === 'content' ?
                  <LeftBar stores={stores} type={content.type}/>
                  :  */}<iframe src={content.url} title={content.type} allowTransparency={true} frameBorder={0} style={{width:'100%', height:'100%'}} ></iframe>
                 {/* } */}
                </div>
                </div>
              </Draggable>

             ))}

            {/* Add Stream Video section here */}
            {/* console.log(" TAB TOTAL ", zoneMediaURL, " --- ", inZone, " >>> ", positionMedia.x) */}

            {inZone !== undefined && inZone === "close" && zoneMediaURL !== undefined && zoneMediaURL !== ""
            ?
                 <Draggable ref={(mediaItemIndex) === 2 ? refEntity_2 : mediaItemIndex === 3 ? refEntity_3 : mediaItemIndex === 4 ? refEntity_4 : mediaItemIndex === 5 ? refEntity_5 : mediaItemIndex === 6 ? refEntity_6 : mediaItemIndex === 7 ? refEntity_7 : refEntity_8} key={(mediaItemIndex)} onDrag={(e, data) => trackPos(data, (mediaItemIndex), 'twitch')} onStop={(e, data) => setTrack(data, zoneMediaURL, (mediaItemIndex), 'twitch')} defaultPosition={{x: 0, y: 0}} >

              <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + ((mediaIndex) * 119) : tabBGTopBGWeb + ((mediaIndex)*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (activeTabIndex === (mediaIndex)) ? 19 : (18 - ((mediaIndex)+2)), height:'100%'}}>
                <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (18 - ((mediaIndex)+2))}}
                 onClick={(e) => {
                  // handling single & double click
                  onTabMenuClick(e, 'twitch', zoneMediaURL, (mediaItemIndex))
                }}
                onTouchEnd={(e) => {
                  onTabMenuClick(e, 'twitch', zoneMediaURL, (mediaItemIndex))
                }}
                >
                {/* <div style={{position:'relative', left:'6px', top:'4px', display:positionMedia.x === 0 && anim === true ? 'block' : 'none', zIndex:999}}>
                  <img src={twitchActive} style={{position:'absolute', width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50}} draggable={false} alt="" />
                </div> */}
              <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (18 - ((mediaIndex)+2))}} draggable={false} alt='' />
                  <img src={appIcon} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99, display:positionMedia.x === 0 && anim === true && able === false ? 'none' : 'block'}} draggable={false} alt='' />
                </div>

                <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px', backgroundColor:'#8b5e3c', borderRadius:'2px', minWidth:'280px', top:'0px', display:((Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) && (mediaItemIndex) === 2) ? 'block' : ((Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) && (mediaItemIndex) === 3) ? 'block' : ((Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) && (mediaItemIndex) === 4) ? 'block' : ((Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) && (mediaItemIndex) === 5) ? 'block' : ((Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) && (mediaItemIndex) === 6) ? 'block' : 'none', zIndex:-9999}}>
                {/* <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                onClick={() => {
                  ResetAppsPanel((mediaItemIndex), 'twitch')
                }}
                onTouchEnd={() => {
                  ResetAppsPanel((mediaItemIndex), 'twitch')
                }}
              /> */}
                <iframe src={(Object(refEntity_2.current?.state).x < 0 && Object(refEntity_2.current?.state).x > -99999999) && mediaItemIndex === 2 ? (zoneMediaURL.indexOf('twitch') !== -1 ? (zoneMediaURL + "&parent=" + videoParent + "&autoplay=true") : (zoneMediaURL + "?autoplay=true")) : (Object(refEntity_3.current?.state).x < 0 && Object(refEntity_3.current?.state).x > -99999999) && mediaItemIndex === 3 ? (zoneMediaURL.indexOf('twitch') !== -1 ? (zoneMediaURL + "&parent=" + videoParent + "&autoplay=true") : (zoneMediaURL + "?autoplay=true")) : (Object(refEntity_4.current?.state).x < 0 && Object(refEntity_4.current?.state).x > -99999999) && mediaItemIndex === 4 ? (zoneMediaURL.indexOf('twitch') !== -1 ? (zoneMediaURL + "&parent=" + videoParent + "&autoplay=true") : (zoneMediaURL + "?autoplay=true")) : (Object(refEntity_5.current?.state).x < 0 && Object(refEntity_5.current?.state).x > -99999999) && mediaItemIndex === 5 ? (zoneMediaURL.indexOf('twitch') !== -1 ? (zoneMediaURL + "&parent=" + videoParent + "&autoplay=true") : (zoneMediaURL + "?autoplay=true")) : (Object(refEntity_6.current?.state).x < 0 && Object(refEntity_6.current?.state).x > -99999999) && mediaItemIndex === 6 ? (zoneMediaURL.indexOf('twitch') !== -1 ? (zoneMediaURL + "&parent=" + videoParent + "&autoplay=true") : (zoneMediaURL + "?autoplay=true")) : ''} title={'Twitch'} allowTransparency={true} frameBorder={0} style={{width:'100%', height:'100%'}} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
                  </div>
                  </div>

                  {/*
                  <Draggable ref={refEntity_9} key={9} onDrag={(e, data) => trackPos(data, 9, 'twitch')} onStop={(e, data) => setTrack(data, zoneMediaURL, 9)} defaultPosition={{x: 0, y: 0}}>

            <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + (9 * 119) : tabBGTopBGWeb + (9*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (activeTabIndex === 0) ? 19 : (18 - (9)), height:'100%'}}>
            <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (18 - (9))}}
            ////////////////////////////////////////////////////////////////////
              onClick={(e) => {
                // handling single & double click
                onTabMenuClick(e, 'twitch', zoneMediaURL, 9)
              }}
              onTouchEnd={(e) => {
                onTabMenuClick(e, 'twitch', zoneMediaURL, 9)
              }}
              >
              <div style={{position:'relative', left:'0px', top:'10px', display:positionMedia.x === 0 && anim === true ? 'block' : 'none'}}>
                  <img src={twitchActive} style={{position:'absolute', width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50}} draggable={false} alt="" />
              </div>
                <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (18 - (9))}} draggable={false} alt='' />
                <img src={twitchIcon} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99, display:positionMedia.x === 0 && anim === true ? 'none' : 'block'}} draggable={false} alt='' />
              </div>
              <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px', backgroundColor:'#8b5e3c', borderRadius:'2px', minWidth:'280px', top:'0px',
              display:((Object(refEntity_9.current?.state).x < 0 || Object(refEntity_9.current?.state).x > 0)) ? 'block' : 'none' , zIndex:-9999}}>
              <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                onClick={() => {
                  ResetAppsPanel(9, 'twitch')
                }}
                onTouchEnd={() => {
                  ResetAppsPanel(9, 'twitch')
                }}
              />
                <iframe src={(Object(refEntity_9.current?.state).x < 0 && Object(refEntity_9.current?.state).x > -99999999) ? zoneMediaURL + "&parent=" + videoParent + "&autoplay=true" : ''} title={'Twitch'} allowTransparency={true} frameBorder={0} style={{width:'100%', height:'100%'}} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
              </div>
              </div>
                   */}

              {/* <Draggable ref={refEntity_9} key={9} onDrag={(e, data) => trackPos(data, 9, 'twitch')} onStop={(e, data) => setTrack(data, zoneMediaURL, 9)} defaultPosition={{x: 0, y: 0}}>

            <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + (9 * 119) : tabBGTopBGWeb + (9*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (activeTabIndex === 0) ? 19 : (18 - (9)), height:'100%'}}>
            <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (18 - (9))}}
            ////////////////////////////////////////////////////////////////////
              onClick={(e) => {
                // handling single & double click
                onTabMenuClick(e, 'twitch', zoneMediaURL, 9)
              }}
              onTouchEnd={(e) => {
                onTabMenuClick(e, 'twitch', zoneMediaURL, 9)
              }}
              >
              <div style={{position:'relative', left:'0px', top:'10px', display:positionMedia.x === 0 && anim === true ? 'block' : 'none'}}>
                  <img src={twitchActive} style={{position:'absolute', width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50}} draggable={false} alt="" />
              </div>
                <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'twitch' ? 19 : (18 - (9))}} draggable={false} alt='' />
                <img src={twitchIcon} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99, display:positionMedia.x === 0 && anim === true ? 'none' : 'block'}} draggable={false} alt='' />
              </div>
              <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px', backgroundColor:'#8b5e3c', borderRadius:'2px', minWidth:'280px', top:'0px',
              display:((Object(refEntity_9.current?.state).x < 0 || Object(refEntity_9.current?.state).x > 0)) ? 'block' : 'none' , zIndex:-9999}}>
              <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                onClick={() => {
                  ResetAppsPanel(9, 'twitch')
                }}
                onTouchEnd={() => {
                  ResetAppsPanel(9, 'twitch')
                }}
              />
                <iframe src={(Object(refEntity_9.current?.state).x < 0 && Object(refEntity_9.current?.state).x > -99999999) ? zoneMediaURL + "&parent=" + videoParent + "&autoplay=true" : ''} title={'Twitch'} allowTransparency={true} frameBorder={0} style={{width:'100%', height:'100%'}} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
              </div>
              </div> */}


            </Draggable>
             : zoneMediaURL === undefined && inZone === undefined ?
             /*  console.log("") */
             ''
             :''}


            {/* END stream video section here */}

             </>
            <Footer stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <ZoneAvatar stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <Emoticons stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
          </Fragment>
          <div style={{display: (able === true ? "block" : "none"), minWidth:'280px', width:'100%', maxWidth:'280px'}}>
            <LeftBar stores={stores} type={_menuType}/>
          </div>

        </SplitPane>

        <div /* onClick={StartMeeting}  */style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center', verticalAlign:'center',position:'absolute', backgroundColor: '#5f7ca0', textAlign:'center', display:showIntro ? 'block' : 'none'}}>
        <p style={{textAlign:'right', color: 'white', position:'relative', right:'24.5px', top:'20px', fontSize: isSmartphone() ? '2.4rem' : '1rem', fontWeight:'normal'}}>Version 4.0.1</p>
          <div style={{position:'relative', top:roomImgPath === '' ? '20%' : '0%'}}>
          <p style={{textAlign:'center', color: 'white',fontSize:isSmartphone() ? '3rem' : '1.2rem', fontWeight:'normal'}}>Welcome To</p>
          <p style={_roomName ? {textAlign:'center', color: 'white', marginTop:isSmartphone() ? '-2.6rem' : '-0.8rem', fontSize:isSmartphone() ? '2.8rem' : '1.2rem', fontWeight:'bold', opacity: 1, transition: 'opacity 300ms'} : {textAlign:'center', color: 'white', marginTop:isSmartphone() ? '-2.6rem' : '-0.8rem', fontSize:isSmartphone() ? '3rem' : '1.2rem', fontWeight:'bold', opacity: 0}}>{_roomName}</p>
          <img src={roomImgPath} style={roomImgPath ? {height: '250px', transform: "scale(1)", opacity:1, transition: 'opacity 300ms, transform: 300ms', userSelect:'none'} : {height: '0px', transform: "scale(0)", opacity:0, transition: '0.3s ease-out', userSelect:'none'}} draggable={false} alt=""/>
          <p style={{textAlign:'center', color: '#cdcdcd', fontSize:isSmartphone() ? '2.8rem' : '1rem', overflow:'hidden', position:'relative', marginTop:'0.5rem', width:'80%', marginLeft:'10%', fontWeight:'normal'}}>{roomImgDesc}</p>
          <img style={{width:isSmartphone() ? '8rem' : '4rem', backgroundColor:'#00000020', borderRadius: '50%', position:'relative', marginTop:roomImgPath !== '' ? '20px' : '-15px', userSelect:'none'}} src={stores.participants.local.information.avatarSrc} draggable={false} alt="" />
        <p style={{textAlign:'center', color: 'black', marginTop:'0.5rem', fontSize:isSmartphone() ? '3rem' : '1.2rem', fontWeight:'normal'}}>{stores.participants.local.information.name}</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'1.5rem',fontSize:isSmartphone() ? '3rem' : '1.2rem', fontWeight:'normal'}}>Give your web browser permissions</p>
        <p style={{textAlign:'center', color: 'black', marginTop:isSmartphone() ? '-2.9rem' : '-0.9rem',fontSize:isSmartphone() ? '3rem' : '1.2rem', fontWeight:'normal'}}>to access the mic and camera if necessary.</p>
        <img style={{width:isSmartphone() ? '18rem' : '8rem', position:'relative', userSelect:'none'}} src={logo_es} draggable={false} alt="" />
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







/*
import {urlParameters} from '@models/url'
import {isPortrait, isSmartphone} from '@models/utils'
//import { rgb2Color } from '@models/utils'
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
//import {Emoticons} from './footer/Emoticons'
//import {ZoneAvatar} from './footer/ZoneAvatar'
import {LeftBar} from './leftBar/LeftBar'
import {MainScreen} from './map/MainScreen'
import {Map} from './map/map'
import {Stores} from './utils'
import {styleCommon} from './utils/styles'
import logo_es from '@images/logo.png'
import { getLoginClick, getUserType} from './error/TheEntrance' // getRoomName

// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
// import iconCollapse from '@images/earshot_icon_btn_collapse.png'
////////////////////////////////////////////////////////////////////////////////////
import tabCollapseChat from '@images/earshot_icon_tab.png'
import tabCollapseContent from '@images/earshot_icon_tab_content.png'
////////////////////////////////////////////////////////////////////////////////////
//import tabCollapseEvents from '@images/earshot_icon_tab_events.png'

////////////////////////////////////////////////////////////////////////////////////
//import tabChat from '@images/earshot_icon_btn-chat.png'
import tabChatActive from '@images/earshot_icon_btn-chat.png'

//import tabContent from '@images/earshot_icon_btn-note.png'
import tabContentActive from '@images/earshot_icon_btn-note.png'
////////////////////////////////////////////////////////////////////////////////////

//import tabEvents from '@images/earshot_icon_btn_events.png'
//import tabEventsActive from '@images/earshot_icon_btn_events.png'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import CloseTabIcon from '@material-ui/icons/HighlightOff';


//import { toPng } from 'html-to-image'

import html2canvas from 'html2canvas'
import { Dialog, DialogContent } from '@material-ui/core'
import Draggable from 'react-draggable'
import { Emoticons } from './footer/Emoticons'



//declare const config:any             //  from ../../config.js included from index.html

let _able:Boolean = false
export function getAbleStatus():Boolean {
  return _able
}

let _menuType:string = ''
export function getSelectedMenuType() :string {
  return _menuType
}

let _menuPos:number = -2
export function getSelectedMenuPos() : number {
  return _menuPos;
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
  // const clsSplit = styleForSplit()
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

  const [menuType, setMenuType] = useState('')

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


  // for tab
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [activeTabIndex, setActiveTabIndex] = useState(-1)



  // For Saving data
  const refAvatar = useRef<HTMLDivElement>(null)

  // For supporting Apps
  const refEntity_0 = useRef<Draggable>(null)
  const refEntity_1 = useRef<Draggable>(null)
  const refEntity_2 = useRef<Draggable>(null)
  const refEntity_3 = useRef<Draggable>(null)
  const refEntity_4 = useRef<Draggable>(null)
  const refEntity_5 = useRef<Draggable>(null)
  const refEntity_6 = useRef<Draggable>(null)
  const refEntity_7 = useRef<Draggable>(null)
  const refEntity_8 = useRef<Draggable>(null)

  //const p = React.createRef<Draggable>(null)

  // to display image and desc
  let roomImgPath:string = ""
  let roomImgDesc:string = ""
  let activeBgColor:string = ""
  let AllMenusTypes:any = []
  const cContent = useObserver(() => stores.contents.all)
  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgPath = content.url
  ))

  cContent.filter(item => item.shareType==="roomimg").map(content => (
    roomImgDesc = content.contentDesc
  ))

  // Setting default Menu Type
  cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    index === 0 && menuType === '' ? setMenuType(content.type) : ''
  ))

  // For Apps section [Room based loading directly from JSON file]
  cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    //console.log(content, " TYPE ", index)
    //content.type === menuType ? content.
    //console.log(menuType, " -------------- ", content.type)
    menuType === content.type ? activeBgColor = content.baseColor : ''
  ))

  cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    AllMenusTypes.push(content.type)
  ))

  //const elementsRef = useRef(cContent.filter(item => item.shareType === "appimg").map(() => React.createRef()));

  // const rgb = stores.participants.local.getColorRGB()

  let press = false
  const loginStatus = useObserver(() => stores.participants.localId)

  const _roomName = sessionStorage.getItem("room") //getRoomName()

  const enterUserType = useObserver(() => getUserType())

  //console.log(loginStatus, " --------- !!!! -------- ", enterUserType)

  _able = able
  _menuType = menuType



  let tabBGTopBGWeb:number = 0 //100 //98 //98
  let tabBGTopBGMob:number = 0 //242 //238


  //console.log(activeTabIndex, " TAB INDEX")
  //let tabBGTopIconWeb:number = 2 //102 //104 //102
  //let tabBGTopIconMob:number = 255 //241

  ////////////////////////////////////////////////////////////
  //console.log(config.apps[0].name, " >>> ")
  ////////////////////////////////////////////////////////////
  const [data,setData] = useState('');
  const [uiData, setUIData] = useState('')
  const getData=()=>{
    fetch('folderlist.php?folder=avatar_tool/*.png')
      .then((response) => response.text())
      .then((response) => setData(response));
    // let dataStr = "avatar_tool/Colors/es_co_group_0.png,avatar_tool/Colors/es_co_group_1.png,avatar_tool/Colors/es_co_group_2.png,avatar_tool/Colors/es_co_group_3.png,avatar_tool/Colors/es_co_group_4.png,avatar_tool/Colors/es_co_group_5.png,avatar_tool/Colors/es_co_group_6.png,avatar_tool/Colors/es_co_group_x.png,avatar_tool/Colors/es_co_hair_0.png,avatar_tool/Colors/es_co_hair_1.png,avatar_tool/Colors/es_co_hair_2.png,avatar_tool/Colors/es_co_hair_3.png,avatar_tool/Colors/es_co_hair_4.png,avatar_tool/Colors/es_co_hair_5.png,avatar_tool/Colors/es_co_hair_6.png,avatar_tool/Colors/es_co_skin_0.png,avatar_tool/Colors/es_co_skin_1.png,avatar_tool/Colors/es_co_skin_2.png,avatar_tool/Colors/es_co_skin_3.png,avatar_tool/Colors/es_co_skin_4.png,avatar_tool/Colors/es_co_skin_5_x.png,avatar_tool/Colors/es_co_skin_6_x.png,avatar_tool/Hair/avatars_hair_5_0_f.png,avatar_tool/Hair/avatars_hair_5_1_f.png,avatar_tool/Hair/avatars_hair_5_2_f.png,avatar_tool/Hair/avatars_hair_5_3_f.png,avatar_tool/Hair/avatars_hair_5_4_f.png,avatar_tool/Hair/avatars_hair_5_5_f.png,avatar_tool/Hair/avatars_hair_5_6_f.png,avatar_tool/Hair/es_hair_0_0_f.png,avatar_tool/Hair/es_hair_0_1_f.png,avatar_tool/Hair/es_hair_0_2_f.png,avatar_tool/Hair/es_hair_0_3_f.png,avatar_tool/Hair/es_hair_0_4_f.png,avatar_tool/Hair/es_hair_0_5_f.png,avatar_tool/Hair/es_hair_0_6_f.png,avatar_tool/Hair/es_hair_0_x_b.png,avatar_tool/Hair/es_hair_0_x_f.png,avatar_tool/Hair/es_hair_1_0_b.png,avatar_tool/Hair/es_hair_1_0_f.png,avatar_tool/Hair/es_hair_1_1_b.png,avatar_tool/Hair/es_hair_1_1_f.png,avatar_tool/Hair/es_hair_1_2_b.png,avatar_tool/Hair/es_hair_1_2_f.png,avatar_tool/Hair/es_hair_1_3_b.png,avatar_tool/Hair/es_hair_1_3_f.png,avatar_tool/Hair/es_hair_1_4_b.png,avatar_tool/Hair/es_hair_1_4_f.png,avatar_tool/Hair/es_hair_1_5_b.png,avatar_tool/Hair/es_hair_1_5_f.png,avatar_tool/Hair/es_hair_1_6_b.png,avatar_tool/Hair/es_hair_1_6_f.png,avatar_tool/Hair/es_hair_2_0_f.png,avatar_tool/Hair/es_hair_2_1_f.png,avatar_tool/Hair/es_hair_2_2_f.png,avatar_tool/Hair/es_hair_2_3_f.png,avatar_tool/Hair/es_hair_2_4_f.png,avatar_tool/Hair/es_hair_2_5_f.png,avatar_tool/Hair/es_hair_2_6_f.png,avatar_tool/Hair/es_hair_3_0_f.png,avatar_tool/Hair/es_hair_3_1_f.png,avatar_tool/Hair/es_hair_3_2_f.png,avatar_tool/Hair/es_hair_3_3_f.png,avatar_tool/Hair/es_hair_3_4_f.png,avatar_tool/Hair/es_hair_3_5_f.png,avatar_tool/Hair/es_hair_3_6_f.png,avatar_tool/Hair/es_hair_4_0_f.png,avatar_tool/Hair/es_hair_4_1_f.png,avatar_tool/Hair/es_hair_4_2_f.png,avatar_tool/Hair/es_hair_4_3_f.png,avatar_tool/Hair/es_hair_4_4_f.png,avatar_tool/Hair/es_hair_4_5_f.png,avatar_tool/Hair/es_hair_4_6_f.png,avatar_tool/Outfits/es_outfit_0.png,avatar_tool/Outfits/es_outfit_1.png,avatar_tool/Outfits/es_outfit_2.png,avatar_tool/Outfits/es_outfit_3.png,avatar_tool/Outfits/es_outfit_4.png,avatar_tool/Outfits/es_outfit_5.png,avatar_tool/Outfits/es_outfit_6.png,avatar_tool/Specs/es_specs_0.png,avatar_tool/Specs/es_specs_1.png,avatar_tool/Specs/es_specs_2.png,"
    // setData(dataStr)

    // let uiDataStr = "help/help_0.png,help/help_1.png,help/help_2.png,"
    // setUIData(uiDataStr)
  }

  const getUIData=()=>{
    fetch('folderlist.php?folder=ui/help/*.png')
      .then((response) => response.text())
      .then((response) => setUIData(response));

    // let uiDataStr = "ui/help/help_0.png,ui/help/help_1.png,ui/help/help_2.png,"
    // setUIData(uiDataStr)
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

    //console.log(enterUserType, " --CHECK RANDOM-- ", activeSkin)
    if(getLoginClick() || loginStatus) {
      //console.log(sessionStorage.getItem("room"), " roomname")
      //console.log("Show User random avatar - ", data)
      //console.log("BBBB --- ", stores.participants.local.information, " ---- ", getUserType())
      if(enterUserType === "N" && activeSkin === -1 && (stores.participants.local.information.randomAvatar === undefined || stores.participants.local.information.randomAvatar.length === 0)) {
      //if(stores.participants.local.information.avatarSrc === "" || stores.participants.local.information.avatarSrc === undefined || activeSkin === -1 || stores.participants.local.information.randomAvatar === undefined || stores.participants.local.information.randomAvatar.length === 0) {
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

    // toPng(refAvatar.current, { cacheBust: true, })
    //   .then((dataUrl) => {
    //   ////////////////////////////////////////////////////
    //   console.log(dataUrl, " DATA")
    //   var formData = new FormData();
    //   formData.append('imgData', dataUrl);
    //   fetch('saveAvatarImage.php',
    //     {
    //       method: 'POST',
    //       body: formData
    //     }
    //   )
    //     .then((response) => response.text())
    //     .then((response) => updateUserAvatar(response));
    //   ////////////////////////////////////////////////////
    // })
    // .catch((err) => {
    //   console.log(err)
    // })
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
    // if(backHairs.length > 0) {
    //   let randBackHairIndex = generateRandomNumber(0, backHairs.length-1)
    //   selectedHairBack = backHairs[randBackHairIndex]
    //   setActiveBackHair(backHairIndex[randBackHairIndex])
    // } else {
    //   selectedHairBack = ''
    //   setActiveBackHair(-1)
    // }

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

  // function StartMeeting() {
  //   setShowIntro(false)
  // }

  function trackPos(data:any, _index:number, _menu:string) {
    setPosition({ x: data.x, y: data.y })
    _menuPos = position.x

    //_menuType = menu

    // Setting Pos
    CheckAndSetPosition(_index)
    CheckAndActivateMenu(_index)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Check How many items are there in the dock tab
    // let _bool = false
    // if(Object(refEntity_0.current?.state).x === 0 || Object(refEntity_1.current?.state).x === 0 || Object(refEntity_2.current?.state).x === 0) {
    //   _bool = true
    // }
    // console.log(_bool)
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // if(_index === 0) {
    //   let moveIndex = 0
    //   if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (0)
    //   }
    //   if(Object(refEntity_1.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_1.current?.state).x = 0
    //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_2.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_2.current?.state).x = 0
    //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_3.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_3.current?.state).x = 0
    //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_4.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_4.current?.state).x = 0
    //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_5.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_5.current?.state).x = 0
    //     Object(refEntity_5.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_6.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_6.current?.state).x = 0
    //     Object(refEntity_6.current?.state).y = (moveIndex * -51)
    //   }

    // } else if(_index === 1) {
    //   let moveIndex = 0
    //   if(Object(refEntity_0.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (0)
    //   }
    //   if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
    //     moveIndex = moveIndex + 1
    //   } else if(Object(refEntity_1.current?.state).x === 0) {
    //     Object(refEntity_1.current?.state).x = 0
    //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_2.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_2.current?.state).x = 0
    //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_3.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_3.current?.state).x = 0
    //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_4.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_4.current?.state).x = 0
    //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_5.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_5.current?.state).x = 0
    //     Object(refEntity_5.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_6.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_6.current?.state).x = 0
    //     Object(refEntity_6.current?.state).y = (moveIndex * -51)
    //   }
    // } else if(_index === 2) {
    //   let moveIndex = 0
    //   if(Object(refEntity_0.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (0)
    //   }
    //   if(Object(refEntity_1.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_1.current?.state).x = 0
    //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_2.current?.state).x = 0
    //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_3.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_3.current?.state).x = 0
    //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_4.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_4.current?.state).x = 0
    //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_5.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_5.current?.state).x = 0
    //     Object(refEntity_5.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_6.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_6.current?.state).x = 0
    //     Object(refEntity_6.current?.state).y = (moveIndex * -51)
    //   }
    // } else if(_index === 3) {
    //   let moveIndex = 0
    //   if(Object(refEntity_0.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_1.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_1.current?.state).x = 0
    //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_2.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_2.current?.state).x = 0
    //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_3.current?.state).x = 0
    //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_4.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_4.current?.state).x = 0
    //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_5.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_5.current?.state).x = 0
    //     Object(refEntity_5.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_6.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_6.current?.state).x = 0
    //     Object(refEntity_6.current?.state).y = (moveIndex * -51)
    //   }
    // } else if(_index === 4) {
    //   let moveIndex = 0
    //   if(Object(refEntity_0.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_1.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_1.current?.state).x = 0
    //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_2.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_2.current?.state).x = 0
    //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_3.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_3.current?.state).x = 0
    //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_4.current?.state).x = 0
    //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_5.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_5.current?.state).x = 0
    //     Object(refEntity_5.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_6.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_6.current?.state).x = 0
    //     Object(refEntity_6.current?.state).y = (moveIndex * -51)
    //   }
    // } else if(_index === 5) {
    //   let moveIndex = 0
    //   if(Object(refEntity_0.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_1.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_1.current?.state).x = 0
    //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_2.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_2.current?.state).x = 0
    //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_3.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_3.current?.state).x = 0
    //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_4.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_4.current?.state).x = 0
    //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_5.current?.state).x = 0
    //     Object(refEntity_5.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_6.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_6.current?.state).x = 0
    //     Object(refEntity_6.current?.state).y = (moveIndex * -51)
    //   }
    // } else if(_index === 6) {
    //   let moveIndex = 0
    //   if(Object(refEntity_0.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_1.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_1.current?.state).x = 0
    //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_2.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_2.current?.state).x = 0
    //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_3.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_3.current?.state).x = 0
    //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_4.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_4.current?.state).x = 0
    //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_5.current?.state).x < 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_5.current?.state).x = 0
    //     Object(refEntity_5.current?.state).y = (moveIndex * -51)
    //   }
    //   if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
    //     moveIndex = moveIndex + 1
    //   } else {
    //     Object(refEntity_6.current?.state).x = 0
    //     Object(refEntity_6.current?.state).y = (moveIndex * -51)
    //   }
    // }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //setMenuType('chat')
    setActiveTabIndex(_index)

    //setMenuType('chat')
    //setAble(false)

    // cContent.filter(item => item.shareType === "appimg").map((content, index) => (
    //   console.log(Object(refEntity.current?.state).x, " - ALL X POS - ", content.type)
    // ))
  }

  // function setDefaultTrack(_url:string, _index:number) {
  //   if(_index === 0) {
  //     Object(refEntity_0.current?.state).x = -99999999
  //     console.log("Hiding Element", Object(refEntity_0.current))
  //   } else if(_index === 1) {
  //     Object(refEntity_1.current?.state).x = -99999999
  //   } else if(_index === 2) {
  //     Object(refEntity_2.current?.state).x = -99999999
  //   } else if(_index === 3) {
  //     Object(refEntity_3.current?.state).x = -99999999
  //   } else if(_index === 4) {
  //     Object(refEntity_4.current?.state).x = -99999999
  //   }

  //   ///////////////////////////////////////////////////////
  //   //window.open(_url, "_new")
  //   let externalWindow = window.open(_url, '', 'width=400,height=650,left=500,top=100');
  //   var timer = setInterval(function() {
  //     if(externalWindow?.closed) {
  //         clearInterval(timer);
  //     }})
  // }



  function CheckAndActivateMenu(_index:number) {
    //console.log(AllMenusTypes)
    if(AllMenusTypes.length === 0) {
      if(_index === 0) {
        if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else {
          setMenuType('blank')
        }
      } else if(_index === 1) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else {
          setMenuType('blank')
        }
      }
    } else {
      if(_index === 0) {
        if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else if(Object(refEntity_2.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index])
        } else if(Object(refEntity_3.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index+1])
        } else if(Object(refEntity_4.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index+2])
        } else if(Object(refEntity_5.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index+3])
        } else if(Object(refEntity_6.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index+4])
        } else {
          setMenuType('blank')
        }
      } else if(_index === 1) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else if(Object(refEntity_2.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index-1])
        } else if(Object(refEntity_3.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index])
        } else if(Object(refEntity_4.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index+1])
        } else if(Object(refEntity_5.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index+3])
        } else if(Object(refEntity_6.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index+4])
        } else {
          setMenuType('blank')
        }
      } else if(_index >= 2) {
        if(Object(refEntity_0.current?.state).x === 0) {
          setMenuType('chat')
        } else if(Object(refEntity_1.current?.state).x === 0) {
          setMenuType('content')
        } else if(Object(refEntity_3.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index-2])
        } else if(Object(refEntity_4.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index-2])
        } else if(Object(refEntity_5.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index-2])
        } else if(Object(refEntity_6.current?.state).x === 0) {
          _menuPos = -2
          setActiveTabIndex(-1)
          setMenuType(AllMenusTypes[_index-2])
        } else {
          setMenuType('blank')
        }
      // } else if(_index === 3) {
      //   if(Object(refEntity_0.current?.state).x === 0) {
      //     setMenuType('chat')
      //   } else if(Object(refEntity_1.current?.state).x === 0) {
      //     setMenuType('content')
      //   } else if(Object(refEntity_2.current?.state).x === 0) {
      //     setMenuType(AllMenusTypes[_index-2])
      //   } else if(Object(refEntity_4.current?.state).x === 0) {
      //     setMenuType(AllMenusTypes[_index-2])
      //   } else if(Object(refEntity_5.current?.state).x === 0) {
      //     setMenuType(AllMenusTypes[_index-2])
      //   } else if(Object(refEntity_6.current?.state).x === 0) {
      //     setMenuType(AllMenusTypes[_index-2])
      //   } else {
      //     setMenuType('blank')
      //   }
      // }
    }
  }




  function CheckAndSetPosition(_index:number) {

    if(_index === 0) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }

    } else if(_index === 1) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else if(Object(refEntity_1.current?.state).x === 0) {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else if(_index === 2) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = (0)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else if(_index === 3) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else if(_index === 4) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else if(_index === 5) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    } else if(_index === 6) {
      let moveIndex = 0
      if(Object(refEntity_0.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_0.current?.state).x = 0
        Object(refEntity_0.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_1.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_1.current?.state).x = 0
        Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_2.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_2.current?.state).x = 0
        Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_3.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_3.current?.state).x = 0
        Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_4.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_4.current?.state).x = 0
        Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_5.current?.state).x < 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_5.current?.state).x = 0
        Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
      if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_6.current?.state).x > 0) {
        moveIndex = moveIndex + 1
      } else {
        Object(refEntity_6.current?.state).x = 0
        Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
      }
    }

  }

  function setTrack(data:any, _url:string, _index:number) {
    //setMenuType(_type)

    // if(_index === 0) {
    //   if(Object(refEntity_0.current?.state).x > 0) {
    //     Object(refEntity_0.current?.state).x = 0
    //     Object(refEntity_0.current?.state).y = (0)
    //   }
    //   _menuPos = -2
    // }

  //   if(data.x >= -1) {
  //   if(_index === 0) {
  //     let moveIndex = 0
  //     if(Object(refEntity_0.current?.state).x >= 0) {
  //       Object(refEntity_0.current?.state).x = 0
  //       Object(refEntity_0.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_1.current?.state).x === 0) {
  //       Object(refEntity_1.current?.state).x = 0
  //       Object(refEntity_1.current?.state).y = (moveIndex * 51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_2.current?.state).x === 0) {
  //       Object(refEntity_2.current?.state).x = 0
  //       Object(refEntity_2.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_3.current?.state).x === 0) {
  //       Object(refEntity_3.current?.state).x = 0
  //       Object(refEntity_3.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_4.current?.state).x === 0) {
  //       Object(refEntity_4.current?.state).x = 0
  //       Object(refEntity_4.current?.state).y = (moveIndex * -51)
  //     }
  //     _menuPos = -2
  //   } else if(_index === 1) {
  //     let moveIndex = 0
  //     if(Object(refEntity_0.current?.state).x === 0) {
  //       Object(refEntity_0.current?.state).x = 0
  //       Object(refEntity_0.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_1.current?.state).x >= 0) {
  //       Object(refEntity_1.current?.state).x = 0
  //       Object(refEntity_1.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_2.current?.state).x === 0) {
  //       Object(refEntity_2.current?.state).x = 0
  //       Object(refEntity_2.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_3.current?.state).x === 0) {
  //       Object(refEntity_3.current?.state).x = 0
  //       Object(refEntity_3.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_4.current?.state).x === 0) {
  //       Object(refEntity_4.current?.state).x = 0
  //       Object(refEntity_4.current?.state).y = (moveIndex * -51)
  //     }
  //     _menuPos = -2
  //   } else if(_index === 2) {
  //     let moveIndex = 0
  //     if(Object(refEntity_0.current?.state).x === 0) {
  //       Object(refEntity_0.current?.state).x = 0
  //       Object(refEntity_0.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_1.current?.state).x === 0) {
  //       Object(refEntity_1.current?.state).x = 0
  //       Object(refEntity_1.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_2.current?.state).x >= 0) {
  //       Object(refEntity_2.current?.state).x = 0
  //       Object(refEntity_2.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_3.current?.state).x === 0) {
  //       Object(refEntity_3.current?.state).x = 0
  //       Object(refEntity_3.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_4.current?.state).x === 0) {
  //       Object(refEntity_4.current?.state).x = 0
  //       Object(refEntity_4.current?.state).y = (moveIndex * -51)
  //     }
  //     _menuPos = -2
  //   } else if(_index === 3) {
  //     let moveIndex = 0
  //     if(Object(refEntity_0.current?.state).x === 0) {
  //       Object(refEntity_0.current?.state).x = 0
  //       Object(refEntity_0.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_1.current?.state).x === 0) {
  //       Object(refEntity_1.current?.state).x = 0
  //       Object(refEntity_1.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_2.current?.state).x === 0) {
  //       Object(refEntity_2.current?.state).x = 0
  //       Object(refEntity_2.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_3.current?.state).x >= 0) {
  //       Object(refEntity_3.current?.state).x = 0
  //       Object(refEntity_3.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_4.current?.state).x === 0) {
  //       Object(refEntity_4.current?.state).x = 0
  //       Object(refEntity_4.current?.state).y = (0)
  //     }
  //     _menuPos = -2
  //   } else if(_index === 4) {
  //     let moveIndex = 0
  //     if(Object(refEntity_0.current?.state).x === 0) {
  //       Object(refEntity_0.current?.state).x = 0
  //       Object(refEntity_0.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_1.current?.state).x === 0) {
  //       Object(refEntity_1.current?.state).x = 0
  //       Object(refEntity_1.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_2.current?.state).x === 0) {
  //       Object(refEntity_2.current?.state).x = 0
  //       Object(refEntity_2.current?.state).y = (0)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }

  //     if(Object(refEntity_3.current?.state).x === 0) {
  //       Object(refEntity_3.current?.state).x = 0
  //       Object(refEntity_3.current?.state).y = (moveIndex * -51)
  //     } else {
  //       moveIndex = moveIndex + 1
  //     }
  //     if(Object(refEntity_4.current?.state).x >= 0) {
  //       Object(refEntity_4.current?.state).x = 0
  //       Object(refEntity_4.current?.state).y = (moveIndex * -51)
  //     }
  //     _menuPos = -2
  //   }
  // }


  // 30
  //console.log(window.innerHeight, " --- ", data.y)
  //console.log(data.x, " ---- ", (stores.map.screenSize))

  //console.log(data.y, "  < " , ((_index * -51)))


    //if(data.y < (-135 + (_index * -51)) || data.y > (675 + (_index * -51)) || data.x < (-(stores.map.screenSize[0] - 40)) || data.x > 0) {
    if(data.y < ((_index * -51)) || data.y > (675 + (_index * -51)) || data.x < (-(stores.map.screenSize[0] - 40)) || data.x > 0) {
      ///////////////////////////////////////////////////////
      // Hide the Tab
      if(_index === 0) {
        Object(refEntity_0.current?.state).x = -99999999
      } else if(_index === 1) {
        Object(refEntity_1.current?.state).x = -99999999
      } else if(_index === 2) {
        Object(refEntity_2.current?.state).x = -99999999
      } else if(_index === 3) {
        Object(refEntity_3.current?.state).x = -99999999
      } else if(_index === 4) {
        Object(refEntity_4.current?.state).x = -99999999
      } else if(_index === 5) {
        Object(refEntity_5.current?.state).x = -99999999
      } else if(_index === 6) {
        Object(refEntity_6.current?.state).x = -99999999
      }

      ///////////////////////////////////////////////////////
      //window.open(_url, "_new")
      let externalWindow = window.open(_url, '', 'width=400,height=650,left=500,top=100');
      var timer = setInterval(function() {
        if(externalWindow?.closed) {
            clearInterval(timer);
            //alert(_index);
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //CheckAndSetPosition(_index)
            if(_index === 0) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * 51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else if(_index === 1) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else if(_index === 2) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else if(_index === 3) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else if(_index === 4) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else if(_index === 5) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_5.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_6.current?.state).x === 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            } else if(_index === 6) {
              let moveIndex = 0
              if(Object(refEntity_0.current?.state).x === 0) {
                Object(refEntity_0.current?.state).x = 0
                Object(refEntity_0.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_1.current?.state).x === 0) {
                Object(refEntity_1.current?.state).x = 0
                Object(refEntity_1.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_2.current?.state).x === 0) {
                Object(refEntity_2.current?.state).x = 0
                Object(refEntity_2.current?.state).y = (0)
              } else {
                moveIndex = moveIndex + 1
              }

              if(Object(refEntity_3.current?.state).x === 0) {
                Object(refEntity_3.current?.state).x = 0
                Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_4.current?.state).x === 0) {
                Object(refEntity_4.current?.state).x = 0
                Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_5.current?.state).x === 0) {
                Object(refEntity_5.current?.state).x = 0
                Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              } else {
                moveIndex = moveIndex + 1
              }
              if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
                Object(refEntity_6.current?.state).x = 0
                Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
              }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            setPosition({x:0, y:0})
        }
    }, 100);
      ///////////////////////////////////////////////////////
      // if(_index === 0) {
      //   let moveIndex = 0
      //   if(Object(refEntity_0.current?.state).x < 0) {
      //     Object(refEntity_0.current?.state).x = 0
      //     Object(refEntity_0.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_1.current?.state).x === 0) {
      //     Object(refEntity_1.current?.state).x = 0
      //     Object(refEntity_1.current?.state).y = (moveIndex * 51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_2.current?.state).x === 0) {
      //     Object(refEntity_2.current?.state).x = 0
      //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_3.current?.state).x === 0) {
      //     Object(refEntity_3.current?.state).x = 0
      //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_4.current?.state).x === 0) {
      //     Object(refEntity_4.current?.state).x = 0
      //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
      //   }
      // } else if(_index === 1) {
      //   let moveIndex = 0
      //   if(Object(refEntity_0.current?.state).x === 0) {
      //     Object(refEntity_0.current?.state).x = 0
      //     Object(refEntity_0.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_1.current?.state).x < 0) {
      //     Object(refEntity_1.current?.state).x = 0
      //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_2.current?.state).x === 0) {
      //     Object(refEntity_2.current?.state).x = 0
      //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_3.current?.state).x === 0) {
      //     Object(refEntity_3.current?.state).x = 0
      //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_4.current?.state).x === 0) {
      //     Object(refEntity_4.current?.state).x = 0
      //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
      //   }
      // } else if(_index === 2) {
      //   let moveIndex = 0
      //   if(Object(refEntity_0.current?.state).x === 0) {
      //     Object(refEntity_0.current?.state).x = 0
      //     Object(refEntity_0.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_1.current?.state).x === 0) {
      //     Object(refEntity_1.current?.state).x = 0
      //     Object(refEntity_1.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_2.current?.state).x < 0) {
      //     Object(refEntity_2.current?.state).x = 0
      //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_3.current?.state).x === 0) {
      //     Object(refEntity_3.current?.state).x = 0
      //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_4.current?.state).x === 0) {
      //     Object(refEntity_4.current?.state).x = 0
      //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
      //   }
      // } else if(_index === 3) {
      //   let moveIndex = 0
      //   if(Object(refEntity_0.current?.state).x === 0) {
      //     Object(refEntity_0.current?.state).x = 0
      //     Object(refEntity_0.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_1.current?.state).x === 0) {
      //     Object(refEntity_1.current?.state).x = 0
      //     Object(refEntity_1.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_2.current?.state).x === 0) {
      //     Object(refEntity_2.current?.state).x = 0
      //     Object(refEntity_2.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_3.current?.state).x < 0) {
      //     Object(refEntity_3.current?.state).x = 0
      //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_4.current?.state).x === 0) {
      //     Object(refEntity_4.current?.state).x = 0
      //     Object(refEntity_4.current?.state).y = (0)
      //   }
      // } else if(_index === 4) {
      //   let moveIndex = 0
      //   if(Object(refEntity_0.current?.state).x === 0) {
      //     Object(refEntity_0.current?.state).x = 0
      //     Object(refEntity_0.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_1.current?.state).x === 0) {
      //     Object(refEntity_1.current?.state).x = 0
      //     Object(refEntity_1.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_2.current?.state).x === 0) {
      //     Object(refEntity_2.current?.state).x = 0
      //     Object(refEntity_2.current?.state).y = (0)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }

      //   if(Object(refEntity_3.current?.state).x === 0) {
      //     Object(refEntity_3.current?.state).x = 0
      //     Object(refEntity_3.current?.state).y = (moveIndex * -51)
      //   } else {
      //     moveIndex = moveIndex + 1
      //   }
      //   if(Object(refEntity_4.current?.state).x < 0) {
      //     Object(refEntity_4.current?.state).x = 0
      //     Object(refEntity_4.current?.state).y = (moveIndex * -51)
      //   }
      // }

      ///////////////////////////////////////////////////////
      _menuPos = -2
      //setPosition({x:0, y:0})
      setAble(false)
    }
  }

//console.log(able, " able")

//////////////////////////////////////////

// let timer = 0
// let delay = 200;
// let prevent = false;


// function onSingleClickHandler() {
//   timer = window.setTimeout(() => {
//     if (!prevent) {
//       console.log("single click")
//     }
//   }, delay);
// };
// function onDoubleClickHandler(){
//   clearTimeout(timer);
//   prevent = true;
//   setTimeout(() => {
//     prevent = false;
//     //console.log("double click")

//   }, delay);
// };
//////////////////////////////////////////
function ResetAppsPanel(index:number, _type:string) {
  if(index === 0) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x < 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * 51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_2.current?.state).x === 0) {
      Object(refEntity_2.current?.state).x = 0
      Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_3.current?.state).x === 0) {
      Object(refEntity_3.current?.state).x = 0
      Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_4.current?.state).x === 0) {
      Object(refEntity_4.current?.state).x = 0
      Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_5.current?.state).x === 0) {
      Object(refEntity_5.current?.state).x = 0
      Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_6.current?.state).x === 0) {
      Object(refEntity_6.current?.state).x = 0
      Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    }

  } else if(index === 1) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x < 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_2.current?.state).x === 0) {
      Object(refEntity_2.current?.state).x = 0
      Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_3.current?.state).x === 0) {
      Object(refEntity_3.current?.state).x = 0
      Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_4.current?.state).x === 0) {
      Object(refEntity_4.current?.state).x = 0
      Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_5.current?.state).x === 0) {
      Object(refEntity_5.current?.state).x = 0
      Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_6.current?.state).x === 0) {
      Object(refEntity_6.current?.state).x = 0
      Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    }

  } else if(index === 2) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_2.current?.state).x < 0) {
      Object(refEntity_2.current?.state).x = 0
      Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_3.current?.state).x === 0) {
      Object(refEntity_3.current?.state).x = 0
      Object(refEntity_3.current?.state).y = (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_4.current?.state).x === 0) {
      Object(refEntity_4.current?.state).x = 0
      Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_5.current?.state).x === 0) {
      Object(refEntity_5.current?.state).x = 0
      Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_6.current?.state).x === 0) {
      Object(refEntity_6.current?.state).x = 0
      Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    }

  } else if(index === 3) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_2.current?.state).x === 0) {
      Object(refEntity_2.current?.state).x = 0
      Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_3.current?.state).x < 0) {
      Object(refEntity_3.current?.state).x = 0
      Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_4.current?.state).x === 0) {
      Object(refEntity_4.current?.state).x = 0
      Object(refEntity_4.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_5.current?.state).x === 0) {
      Object(refEntity_5.current?.state).x = 0
      Object(refEntity_5.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_6.current?.state).x === 0) {
      Object(refEntity_6.current?.state).x = 0
      Object(refEntity_6.current?.state).y = (0)
    }
  } else if(index === 4) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_2.current?.state).x === 0) {
      Object(refEntity_2.current?.state).x = 0
      Object(refEntity_2.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_3.current?.state).x === 0) {
      Object(refEntity_3.current?.state).x = 0
      Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_4.current?.state).x < 0) {
      Object(refEntity_4.current?.state).x = 0
      Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_5.current?.state).x === 0) {
      Object(refEntity_5.current?.state).x = 0
      Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_6.current?.state).x === 0) {
      Object(refEntity_6.current?.state).x = 0
      Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    }
  } else if(index === 5) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_2.current?.state).x === 0) {
      Object(refEntity_2.current?.state).x = 0
      Object(refEntity_2.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_3.current?.state).x === 0) {
      Object(refEntity_3.current?.state).x = 0
      Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_4.current?.state).x === 0) {
      Object(refEntity_4.current?.state).x = 0
      Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_5.current?.state).x < 0) {
      Object(refEntity_5.current?.state).x = 0
      Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_6.current?.state).x === 0) {
      Object(refEntity_6.current?.state).x = 0
      Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    }
  } else if(index === 6) {
    let moveIndex = 0
    if(Object(refEntity_0.current?.state).x === 0) {
      Object(refEntity_0.current?.state).x = 0
      Object(refEntity_0.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_1.current?.state).x === 0) {
      Object(refEntity_1.current?.state).x = 0
      Object(refEntity_1.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_2.current?.state).x === 0) {
      Object(refEntity_2.current?.state).x = 0
      Object(refEntity_2.current?.state).y = (0)
    } else {
      moveIndex = moveIndex + 1
    }

    if(Object(refEntity_3.current?.state).x === 0) {
      Object(refEntity_3.current?.state).x = 0
      Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_4.current?.state).x === 0) {
      Object(refEntity_4.current?.state).x = 0
      Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_5.current?.state).x === 0) {
      Object(refEntity_5.current?.state).x = 0
      Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    } else {
      moveIndex = moveIndex + 1
    }
    if(Object(refEntity_6.current?.state).x < 0) {
      Object(refEntity_6.current?.state).x = 0
      Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
    }
  }
  _menuPos = -2
  setPosition({x:0, y:0})
  setActiveTabIndex(-1)
  setMenuType(_type)
}
//////////////////////////////////////////
let clicks:any = [];
let timeout:any;
// Single & Double Click
function singleClick(event:any, tabType:string, tabURL:string, tabIndex:number) {
  //alert(tabType);
  if((position.x < 0 || position.x > 0) && activeTabIndex === tabIndex) {return}
    press = true;
    if(able === true) {
      if(menuType === tabType) {
        setAble(false)
      }
    } else
    if(able === false) {
      setAble(true)
    }
    setMenuType(tabType)
    setActiveTabIndex(tabIndex)
}

function doubleClick(event:any, tabType:string, tabURL:string, tabIndex:number) {
  //alert(tabType);
  if(tabIndex === 0 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {return}
    Object(refEntity_0.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0])
    Object(refEntity_0.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 1 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {return}
    Object(refEntity_1.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0])
    Object(refEntity_1.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 2 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {return}
    Object(refEntity_2.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0])
    Object(refEntity_2.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 3 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {return}
    Object(refEntity_3.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_3.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 4 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {return}
    Object(refEntity_4.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_4.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else if(tabIndex === 5 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {return}
    Object(refEntity_5.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_5.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25) //(120)
  } else if(tabIndex === 6 && (tabType === 'chat' || tabType === 'content')) {
    if(Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) {return}
    Object(refEntity_6.current?.state).x = -Math.floor(Math.random() * (stores.map.screenSize[0] - 500 + 1) + 500) //Math.random() * -(stores.map.screenSize[0] + 400)/2
    Object(refEntity_6.current?.state).y = Math.floor(Math.random() * (150 - 50 + 1) + 50) + (tabIndex * -25)
  } else {
    if(tabIndex === 0) {
      if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {return}
      Object(refEntity_0.current?.state).x = -99999999
    } else if(tabIndex === 1) {
      if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {return}
      Object(refEntity_1.current?.state).x = -99999999
    } else if(tabIndex === 2) {
      if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {return}
      Object(refEntity_2.current?.state).x = -99999999
    } else if(tabIndex === 3) {
      if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {return}
      Object(refEntity_3.current?.state).x = -99999999
    } else if(tabIndex === 4) {
      if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {return}
      Object(refEntity_4.current?.state).x = -99999999
    } else if(tabIndex === 5) {
      if(Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) {return}
      Object(refEntity_5.current?.state).x = -99999999
    } else if(tabIndex === 6) {
      if(Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) {return}
      Object(refEntity_6.current?.state).x = -99999999
    }

    ///////////////////////////////////////////////////////
    //window.open(_url, "_new")
    let externalWindow = window.open(tabURL, '', 'width=400,height=650,left=500,top=100');
    var timer = setInterval(function() {
      if(externalWindow?.closed) {
          clearInterval(timer);
          //alert(_index);
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //CheckAndSetPosition(_index)
          if(tabIndex === 0) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_2.current?.state).x === 0) {
              Object(refEntity_2.current?.state).x = 0
              Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_3.current?.state).x === 0) {
              Object(refEntity_3.current?.state).x = 0
              Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_4.current?.state).x === 0) {
              Object(refEntity_4.current?.state).x = 0
              Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_5.current?.state).x === 0) {
              Object(refEntity_5.current?.state).x = 0
              Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_6.current?.state).x === 0) {
              Object(refEntity_6.current?.state).x = 0
              Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            }
          } else if(tabIndex === 1) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_2.current?.state).x === 0) {
              Object(refEntity_2.current?.state).x = 0
              Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_3.current?.state).x === 0) {
              Object(refEntity_3.current?.state).x = 0
              Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_4.current?.state).x === 0) {
              Object(refEntity_4.current?.state).x = 0
              Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_5.current?.state).x === 0) {
              Object(refEntity_5.current?.state).x = 0
              Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_6.current?.state).x === 0) {
              Object(refEntity_6.current?.state).x = 0
              Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            }
          } else if(tabIndex === 2) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) {
              Object(refEntity_2.current?.state).x = 0
              Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_3.current?.state).x === 0) {
              Object(refEntity_3.current?.state).x = 0
              Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_4.current?.state).x === 0) {
              Object(refEntity_4.current?.state).x = 0
              Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_5.current?.state).x === 0) {
              Object(refEntity_5.current?.state).x = 0
              Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_6.current?.state).x === 0) {
              Object(refEntity_6.current?.state).x = 0
              Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            }
          } else if(tabIndex === 3) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_2.current?.state).x === 0) {
              Object(refEntity_2.current?.state).x = 0
              Object(refEntity_2.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) {
              Object(refEntity_3.current?.state).x = 0
              Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_4.current?.state).x === 0) {
              Object(refEntity_4.current?.state).x = 0
              Object(refEntity_4.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_5.current?.state).x === 0) {
              Object(refEntity_5.current?.state).x = 0
              Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_6.current?.state).x === 0) {
              Object(refEntity_6.current?.state).x = 0
              Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            }
          } else if(tabIndex === 4) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_2.current?.state).x === 0) {
              Object(refEntity_2.current?.state).x = 0
              Object(refEntity_2.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_3.current?.state).x === 0) {
              Object(refEntity_3.current?.state).x = 0
              Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) {
              Object(refEntity_4.current?.state).x = 0
              Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_5.current?.state).x === 0) {
              Object(refEntity_5.current?.state).x = 0
              Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_6.current?.state).x === 0) {
              Object(refEntity_6.current?.state).x = 0
              Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            }
          } else if(tabIndex === 5) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_2.current?.state).x === 0) {
              Object(refEntity_2.current?.state).x = 0
              Object(refEntity_2.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_3.current?.state).x === 0) {
              Object(refEntity_3.current?.state).x = 0
              Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_4.current?.state).x === 0) {
              Object(refEntity_4.current?.state).x = 0
              Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_5.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
              Object(refEntity_5.current?.state).x = 0
              Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_6.current?.state).x === 0) {
              Object(refEntity_6.current?.state).x = 0
              Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            }
          } else if(tabIndex === 6) {
            let moveIndex = 0
            if(Object(refEntity_0.current?.state).x === 0) {
              Object(refEntity_0.current?.state).x = 0
              Object(refEntity_0.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_1.current?.state).x === 0) {
              Object(refEntity_1.current?.state).x = 0
              Object(refEntity_1.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_2.current?.state).x === 0) {
              Object(refEntity_2.current?.state).x = 0
              Object(refEntity_2.current?.state).y = (0)
            } else {
              moveIndex = moveIndex + 1
            }

            if(Object(refEntity_3.current?.state).x === 0) {
              Object(refEntity_3.current?.state).x = 0
              Object(refEntity_3.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_4.current?.state).x === 0) {
              Object(refEntity_4.current?.state).x = 0
              Object(refEntity_4.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_5.current?.state).x === 0) {
              Object(refEntity_5.current?.state).x = 0
              Object(refEntity_5.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            } else {
              moveIndex = moveIndex + 1
            }
            if(Object(refEntity_6.current?.state).x < 0  || Object(refEntity_5.current?.state).x > 0) {
              Object(refEntity_6.current?.state).x = 0
              Object(refEntity_6.current?.state).y = isSmartphone() ? (moveIndex * -121) : (moveIndex * -51)
            }
          }
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          _menuPos = -2
          setPosition({x:0, y:0})
          setMenuType(tabType)
      }
  }, 100);
    ///////////////////////////////////////////////////////
    //_menuPos = -2
    //setAble(false)
  }

  //_menuPos = -(stores.map.screenSize[0]/2)
  CheckAndSetPosition(tabIndex)

  // When double click
  CheckAndActivateMenu(tabIndex)

  setActiveTabIndex(tabIndex)

  // Enable When needed
  setAble(false)
}

function onTabMenuClick(event:any, _type:string, _url:string, _index:number) {
  event.preventDefault();
  clicks.push(new Date().getTime());
  window.clearTimeout(timeout);
  timeout = window.setTimeout(() => {
      if (clicks.length > 1 && clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250) {
          doubleClick(event.target, _type, _url, _index);
      } else {
          singleClick(event.target, _type, _url, _index);
      }
  }, 250);
}

//////////////////////////////////////////

  return <Observer>{()=>{
    return <div ref={refDiv} className={classes.back} style={{backgroundColor: '#0f5c81'}}>
        <SplitPane pane2Style={able === true ? {display: 'block', backgroundColor: menuType === 'chat' ? '#0f5c81' : menuType === 'content' ? '#8b5e3c' : menuType !== 'blank' ? activeBgColor : 'white', boxShadow: menuType !== 'blank' ? '5px 10px 10px 3px black' : '5px 10px 10px 3px white'} : {display: 'none', backgroundColor: '#FFF'}} className={classes.fill} split="vertical"
          minSize={0} defaultSize={able === true ? isSmartphone() ? '40%' : (_menuType !== 'chat' && _menuType !== 'content') ? "73%" : '73%' : "100%"}>

          <Fragment>
            <MainScreen showAllTracks = {DEBUG_VIDEO} stores={stores} />
            <Observer>{() => <Map transparent={sharedContentsStore.mainScreenStream !== undefined
             || DEBUG_VIDEO} stores={stores} />
            }</Observer>





            <Draggable bounds={{top: (0 * -51), left: -(stores.map.screenSize[0] - 40), right: -40, bottom: (stores.map.screenSize[1] - (50 + (0 * 51)))}}ref={refEntity_0} key={0} onDrag={(e, data) => trackPos(data, 0, 'chat')} onStop={(e, data) => setTrack(data, '', 0)} defaultPosition={{x: 0, y: 0}}>

            <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + (0 * 119) : tabBGTopBGWeb + (0*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : (activeTabIndex === 0) ? 19 : (18 - (0+2)), height:'100%'}}>
            <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : (18 - (0+2))}}
            ////////////////////////////////////////////////////////////////////
              onClick={(e) => {
                // handling single & double click
                onTabMenuClick(e, 'chat', '', 0)
              }}
              onTouchEnd={(e) => {
                  onTabMenuClick(e, 'chat', '', 0)
                }}
              >

                <img src={tabCollapseChat} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'chat' ? 19 : (18 - (0+2))}} draggable={false} alt='' />
                <img src={tabChatActive} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
              </div>

              <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px' backgroundColor:'#0f5c81', borderRadius:'2px', minWidth:'280px', top:'0px',
              display:((Object(refEntity_0.current?.state).x < 0 || Object(refEntity_0.current?.state).x > 0)) ? 'block' : 'none' , zIndex:-9999}}>
              <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                onClick={() => {
                  ResetAppsPanel(0, 'chat')
                }}
                onTouchEnd={() => {
                  ResetAppsPanel(0, 'chat')
                }}
              />
                <LeftBar stores={stores} type={'chat'}/>
              </div>
              </div>
            </Draggable>




             <Draggable bounds={{top: (1 * -51), left: -(stores.map.screenSize[0] - 40), right: -40, bottom: (stores.map.screenSize[1] - (50 + (1 * 51)))}}ref={refEntity_1} key={1} onDrag={(e, data) => trackPos(data, 1, 'content')} onStop={(e, data) => setTrack(data, '', 1)} defaultPosition={{x: 0, y: 0}}>

            <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + (1 * 119) : tabBGTopBGWeb + (1*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : (activeTabIndex === 1) ? 19 : (18 - (1+2)), height:'100%'}}>
            <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : (18 - (1+2))}}
              onClick={(e) => {
                // handling single & double click
                onTabMenuClick(e, 'content', '', 1)
              }}
              onTouchEnd={(e) => {
                onTabMenuClick(e, 'content', '', 1)
              }}
              >

                <img src={tabCollapseContent} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === 'content' ? 19 : (18 - (1+2))}} draggable={false} alt='' />
                <img src={tabContentActive} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
              </div>

              <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px', backgroundColor:'#8b5e3c', borderRadius:'2px', minWidth:'280px', top:'0px',
              display:((Object(refEntity_1.current?.state).x < 0 || Object(refEntity_1.current?.state).x > 0)) ? 'block' : 'none' , zIndex:-9999}}>
              <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                onClick={() => {
                  ResetAppsPanel(1, 'content')
                }}
                onTouchEnd={() => {
                  ResetAppsPanel(1, 'content')
                }}
              />
                <LeftBar stores={stores} type={'content'}/>
              </div>
              </div>
            </Draggable>


             <>
            { cContent.filter(item => item.shareType === "appimg").map((content, index) => (
              <Draggable bounds={content.url === '' ? {top: ((index+2) * -51), left: -(stores.map.screenSize[0] - 40), right: -40, bottom: (stores.map.screenSize[1] - (50 + ((index+2) * 51)))} : {}}

              ref={(index+2) === 2 ? refEntity_2 : index === 3 ? refEntity_3 : index === 4 ? refEntity_4 : index === 5 ? refEntity_5 : index === 6 ? refEntity_6 : index === 7 ? refEntity_7 : refEntity_8}

              key={(index+2)} onDrag={(e, data) => trackPos(data, (index+2), content.type)} onStop={(e, data) => setTrack(data, content.url, (index+2))} defaultPosition={{x: 0, y: 0}}>

                <div style={{position:'absolute', right:able ? '0%' : '0%', top:isSmartphone() ? tabBGTopBGMob + ((index+2) * 119) : tabBGTopBGWeb + ((index+2)*51), borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === content.type ? 19 : (activeTabIndex === (index+2)) ? 19 : (18 - ((index+2)+2)), height:'100%'}}>
                <div  style={{position:'absolute', right:able ? '0%' : '0%', top:'0px', borderRadius: '5px', display:'flex', zIndex:showIntro ? 0 : menuType === content.type ? 19 : (18 - ((index+2)+2))}}
                ////////////////////////////////////////////////////////////////////
                  onClick={(e) => {
                    // handling single & double click
                    onTabMenuClick(e, content.type, content.url, (index+2))
                  }}
                  onTouchEnd={(e) => {
                    onTabMenuClick(e, content.type, content.url, (index+2))
                  }}
                  ////////////////////////////////////////////////////////////////////
                >
                  <img src={content.baseImage} style={{width:isSmartphone() ? 120 : 50, height:'auto', position:'relative', top:'0px', left:isSmartphone() ? '1px' : '1px', userSelect:'none', zIndex:showIntro ? 0 : menuType === content.type ? 19 : (18 - ((index+2)+2))}} draggable={false} alt='' />
                  <img src={content.baseIcon} style={{width:isSmartphone() ? 120 : 50, height:isSmartphone() ? 120 : 50, color:'white', position:'absolute', top:'2px', left:isSmartphone() ? '10px' : '5px' , userSelect:'none', zIndex:showIntro ? 0 : 99}} draggable={false} alt='' />
                </div>

                <div style={{position: 'absolute', width:'405px', height:'70%', left:'0px', backgroundColor:content.baseColor, borderRadius:'2px', minWidth:'280px', top:'0px',

                display:((Object(refEntity_2.current?.state).x < 0 || Object(refEntity_2.current?.state).x > 0) && (index+2) === 2) ? 'block' : ((Object(refEntity_3.current?.state).x < 0 || Object(refEntity_3.current?.state).x > 0) && (index+2) === 3) ? 'block' : ((Object(refEntity_4.current?.state).x < 0 || Object(refEntity_4.current?.state).x > 0) && (index+2) === 4) ? 'block' : ((Object(refEntity_5.current?.state).x < 0 || Object(refEntity_5.current?.state).x > 0) && (index+2) === 5) ? 'block' : ((Object(refEntity_6.current?.state).x < 0 || Object(refEntity_6.current?.state).x > 0) && (index+2) === 6) ? 'block' : 'none'

               , zIndex:-9999}}>
                <CloseTabIcon style={{width:'40px', height:'50px', position:'absolute', right:'25px', color:'white', padding:isSmartphone() ? '10px' : '1px', transform:isSmartphone() ? 'scale(2)' : 'scale(1)', zIndex:9999}}
                  onClick={() => {
                    //console.log("Close Tab click")
                    //console.log(Object(refEntity.current?.state).x)
                    ResetAppsPanel((index+2), content.type)
                  }}
                  onTouchEnd={() => {
                    //console.log("Close Tab click")
                    //console.log(Object(refEntity.current?.state).x)
                    ResetAppsPanel((index+2), content.type)

                  }}
                 />
                  {}
                <iframe src={content.url} title={content.type} allowTransparency={true} frameBorder={0} style={{width:'100%', height:'100%'}}></iframe>

                </div>
                </div>
              </Draggable>

             ))}
             </>

            <Footer stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />
            <Emoticons stores={stores} height={(isSmartphone() && isPortrait()) ? 100 : undefined} />


          </Fragment>
          <div style={{display: (able === true ? "block" : "none"), minWidth:'280px', width:'100%', maxWidth:'280px'}}>
            <LeftBar stores={stores} type={_menuType}/>
          </div>
        </SplitPane>
        <div style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center', verticalAlign:'center',position:'absolute', backgroundColor: '#5f7ca0', textAlign:'center', display:showIntro ? 'block' : 'none'}}>
        <p style={{textAlign:'right', color: 'white', position:'relative', right:'24.5px', top:'20px', fontSize: isSmartphone() ? '2.4em' : '1em'}}>Version 2.0.5</p>
          <div style={{position:'relative', top:roomImgPath === '' ? '20%' : '0%'}}>
          <p style={{textAlign:'center', color: 'white', fontSize:isSmartphone() ? '3em' : '1.2em'}}>Welcome To</p>
          <p style={_roomName ? {textAlign:'center', color: 'white', marginTop:'-0.8em', fontSize:isSmartphone() ? '2.8em' : '1.2em', fontWeight:'bold', opacity: 1, transition: 'opacity 300ms'} : {textAlign:'center', color: 'white', marginTop:'-0.8em', fontSize:isSmartphone() ? '3em' : '1.2em', fontWeight:'bold', opacity: 0}}>{_roomName}</p>
          <img src={roomImgPath} style={roomImgPath ? {height: '250px', transform: "scale(1)", opacity:1, transition: 'opacity 300ms, transform: 300ms', userSelect:'none'} : {height: '0px', transform: "scale(0)", opacity:0, transition: '0.3s ease-out', userSelect:'none'}} draggable={false} alt=""/>
          <p style={{textAlign:'center', color: '#cdcdcd', fontSize:isSmartphone() ? '2.8em' : '1em', overflow:'hidden', position:'relative', marginTop:'0.5em', width:'80%', marginLeft:'10%'}}>{roomImgDesc}</p>
          <img style={{width:isSmartphone() ? '8em' : '4em', backgroundColor:'#00000020', borderRadius: '50%', position:'relative', marginTop:roomImgPath !== '' ? '20px' : '-15px', userSelect:'none'}} src={stores.participants.local.information.avatarSrc} draggable={false} alt="" />
        <p style={{textAlign:'center', color: 'black', marginTop:'0.5em', fontSize:isSmartphone() ? '3em' : '1.2em'}}>{stores.participants.local.information.name}</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'1.5em',fontSize:isSmartphone() ? '3em' : '1.2em'}}>Give your web browser permissions</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'-0.9em',fontSize:isSmartphone() ? '3em' : '1.2em'}}>to access the mic and camera if necessary.</p>
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



        <Dialog open={showHelp} onClose={() => setShowHelp(false)} onExited={() => setShowHelp(false)}
        keepMounted
        PaperProps={{
          style: {
            backgroundColor: 'white',
            position:'relative',

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
 */