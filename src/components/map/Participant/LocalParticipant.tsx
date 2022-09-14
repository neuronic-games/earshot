import {MAP_SIZE} from '@components/Constants'
import {MoreButton, moreButtonControl, MoreButtonMember} from '@components/utils/MoreButton'
import {makeStyles} from '@material-ui/core/styles'
import {addV2, assert, isSmartphone, mulV2, /* rotateVector2DByDegree,  */subV2, /* transformPoint2D, transfromAt,  */rgb2Color} from '@models/utils'
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef, useState} from 'react'
import {DragHandler, DragState} from '../../utils/DragHandler'
/* import {KeyHandlerPlain} from '../../utils/KeyHandler' */
import {LocalParticipantForm} from './LocalParticipantForm'
import {Participant, ParticipantProps} from './Participant'

import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import { TITLE_HEIGHT } from '@stores/sharedContents/SharedContents'
import { MouseOrTouch } from '../Share/RndContent'
import html2canvas from 'html2canvas'
import { Button, Dialog, DialogContent, DialogTitle, List, ListItem, Tooltip, Zoom } from '@material-ui/core'
import MoreIcon from '@images/whoo-screen_btn-more.png'
import AvatarGenIcon from '@images/earshot_icon_edit_avatar.png'
import { useGesture } from 'react-use-gesture'
import {useTranslation} from '@models/locales'


const theme = createTheme({
  palette: {
    primary: { main: '#7ececc' },
    secondary: { main: '#ef4623' },
  },
});

const AVATAR_SPEED_LIMIT = 50
const MAP_SPEED_LIMIT = 600
const MAP_SPEED_MIN = 100
const HALF_DEGREE = 180
const WHOLE_DEGREE = 360
//const HALF = 0.5


type LocalParticipantProps = ParticipantProps

interface StyleProps {
  position: [number, number],
  size: number,
  mem:LocalMember,
}

const useStyles = makeStyles({
  more: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.5 ,
    height: props.size * 0.5,
    left: props.position[0] + props.size * 0.4,
    top: props.position[1] - props.size * 0.8,
  }),
  hideMenuContainer: (props:StyleProps) => ({
    display: 'flex',
    position: 'absolute',
    width: 350,
    height: 250,
    overflow: 'hidden',
    userSelect: 'none',
    userDrag: 'none',
    bottom: 'auto',
    /* transform: 'scale(0)', */
    backgroundColor: 'transparent',
    transition: '0s ease-out',
    cursor: 'default',
  }),
  showMenuContainer: (props:StyleProps) => ({
    display: 'flex',
    position: 'absolute',
    width: 350,
    height: 250,
    overflow: 'hidden',
    userSelect: 'none',
    userDrag: 'none',
    //top: (props.position[1]) - 130,
    //left: isSmartphone() ? (props.position[0]) - 160 : (props.position[0]) - 170,
    top: 0,
    left: 0,
    bottom: 'auto',
   /*  transform: isSmartphone() ? 'scale(2.8)' : 'scale(1.2)', */
    backgroundColor: 'transparent',
    transition: '0.3s ease-out',
    transitionDelay: '0.1s',
    cursor: 'default',
  }),

  dashedCircle: (props: StyleProps) => ({
    position: 'relative',
    width:200,
    height:200,
    borderWidth:2,
    borderStyle: 'solid',
    borderColor:'#9e886c',
    borderRadius:'50%',
    opacity: 0.4,
    top: 25,
    left: 65,
    background: 'radial-gradient(#ffffff, #ffffff, #ffffff, #9e886c, #9e886c)',
    zIndex: -9999,
  }),

  moreIcon: (props:StyleProps) => ({
    display: 'block',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    top: 180,
    left: 145,
    whiteSpace: 'pre',
    cursor: 'default',
    background: '#9e886c',
    ...buttonStyle
  }),

  avatarTool: (props:StyleProps) => ({
    display: 'block',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    top: 25,
    left: 140,
    whiteSpace: 'pre',
    cursor: 'default',
    background: '#9e886c',
    /* opacity: 0.2, */
    ...buttonStyle
  }),

  moreInfo: (props:StyleProps) => ({
    display: 'block',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    top: 180,
    left: 145,
    whiteSpace: 'pre',
    cursor: 'default',
    background: '#9e886c',
    ...buttonStyle
  }),

  mainContainer: {
    display: 'flex',
    height: '100%',
    width:'100%',

  },
  menuContainer: {
    position:'relative',
    top:'12px',
    left: '15px',
    width:'100px',
    height:'100px',
  },
  galleryMain : {
    width:'91%',
    height:'100%',
    minWidth: '440px',
    minHeight: '400px', //'245px',
    border:'2px dashed #00000030',
    left:'45px',
    position:'relative'
  },
  gallery: {
    display:'grid',
    position: 'relative',
    marginLeft: '10px',
    gridTemplateColumns: 'repeat(7, 0.1fr)',
    gap:-10,
    overflowY:'auto',
    overflowX: 'hidden',
    height:'334px',
    alignContent:'flex-start',
  },
  galleryList: {
    display:'grid',
    position: 'relative',
    marginLeft: '10px',
    gridTemplateColumns: 'repeat(7, 0.1fr)',
    gap:-10,
    overflowY:'hidden',
    overflowX: 'hidden',
    height:isSmartphone() ? '110px' : '90px',
    alignContent:'flex-start',
  },
  deavticeButtons: {
    position:'relative',
    padding:'10px',
    fontSize:isSmartphone() ? '1.5em' : '1em',
    fontWeight:'bold',
    borderBottom: '2px solid #7ececc',
    color:'#000000',
    cursor: 'pointer',
  },

  avticeButtons: {
    position:'relative',
    padding:'10px',
    fontSize:isSmartphone() ? '1.5em' : '1em',
    fontWeight:'bold',
    borderBottom:'2px solid #7ececc',
    color:'#ef4623',
    cursor: 'default',
  }
})

const buttonStyle = {
  '&': {
    margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',

    //border: '2px solid #9e886c',
    //backgroundColor: 'white',
  },

  '&:hover': {
    backgroundColor: 'black', //'rosybrown',
    margin: '5px',
    padding: '3px',
    borderRadius: '50%',
  },
  '&:active': {
    //backgroundColor: 'firebrick',
    margin: '5px',
    padding: '3px',
    borderRadius: '50%',
  },
}

class LocalMember{
  prebThirdPersonView = false
  mouseDown = false
  dragging = false

  // New values
  upTime = 0
  downTime = 0
  downXpos = 0
  downYpos = 0
  upXpos = 0
  upYpos = 0
  contentX = 0
  contentY = 0
  zoomX = 0
  zoomY = 0
  moveX = 0
  moveY = 0

  clickStatus = ''
  userAngle = 0
  clickEnter = false
  pingX = 0
  pingY = 0
  hidePinIcon = 0

  // moveLoc
  cursorX = 0
  cursorY = 0
}

interface LocalParticipantMember extends MoreButtonMember{
  smoothedDelta: [number, number]
  scrollAgain: boolean
}

let onLocalUser:boolean = false
export function getOnLocalUser() : boolean {
  return onLocalUser;
}

let isConteMenuOpen:boolean = false
export function getUserContextMenu() : boolean {
  return isConteMenuOpen;
}


let selectedImage:string = ''
let selectedGroup = ''
let selectedSkin = ''
let selectedHairColor = ''
let selectedHair = ''
let selectedHairBack = ''
let selectedOutfits = ''
let selectedSpecs = ''
export function getSelectedImage() : string {
  return selectedImage
}

export function ResetSelectedImage() {
  selectedImage = ''
}

// Different Avatar Item
let isAvatarToolOpen: boolean = false
export function getAvatarToolStatus() : boolean {
  return isAvatarToolOpen
}
const LocalParticipant: React.FC<LocalParticipantProps> = (props) => {
  const map = props.stores.map
  const participants = props.stores.participants
  const participant = participants.local


  const memRef = useRef<LocalMember>(new LocalMember())
  const mem = memRef.current

  // Showing default Avatar
  if(participant.information.avatarSrc === '') {
    /* var _rnd = Math.ceil(Math.random() * (AVATARS.length-1))
    participant.information.avatarSrc = AVATARS[_rnd]
    participant.sendInformation()
    participant.saveInformationToStorage(true) */
  }

  function updateUserAvatar(_path:string) {
    if(participant.information.avatarSrc === _path) {return}
    if(activeSkin === -1) {return}
    participant.information.avatarSrc = _path
    // Storing values to localstorage
    participant.information.randomAvatar = [selectedSkin, selectedHairColor, selectedGroup, selectedHair, selectedOutfits, selectedSpecs]
    participant.sendInformation()
    participant.saveInformationToStorage(true)
    onCloseDialog()
  }


  assert(props.participant.id === participant.id)
  const member = useRef<LocalParticipantMember>({} as LocalParticipantMember).current


  const moveParticipant = (state: DragState<HTMLDivElement>) => {
    //  move local participant
    let delta = subV2(state.xy, map.toWindow(participant!.pose.position))
    const norm = Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1])
    if (norm > AVATAR_SPEED_LIMIT) {
      delta = mulV2(AVATAR_SPEED_LIMIT / norm, delta)
    }

    if (participants.local.thirdPersonView) {
      const localDelta = map.rotateFromWindow(delta)  // transform.rotateG2L(delta)
      participant!.pose.position = addV2(participant!.pose.position, localDelta)
      const SMOOTHRATIO = 0.8
      if (!member.smoothedDelta) { member.smoothedDelta = [delta[0], delta[1]] }
      member.smoothedDelta = addV2(mulV2(1 - SMOOTHRATIO, localDelta), mulV2(SMOOTHRATIO, member.smoothedDelta))
      const dir = Math.atan2(member.smoothedDelta[0], -member.smoothedDelta[1]) * HALF_DEGREE / Math.PI
      let diff = dir - participant!.pose.orientation
      if (diff < -HALF_DEGREE) { diff += WHOLE_DEGREE }
      if (diff > HALF_DEGREE) { diff -= WHOLE_DEGREE }
      const ROTATION_SPEED = 0.2
      participant!.pose.orientation += diff * ROTATION_SPEED
    } else {
      participant!.pose.position = addV2(map.rotateFromWindow(delta), //    transform.rotateG2L(delta),
                                         participant!.pose.position)
    }
    participant.savePhysicsToStorage(false)
  }
  /* const moveParticipantByKey = (keys:Set<string>) => {
    let deltaF = 0
    let deltaA = 0
    const VEL = 10
    const ANGVEL = 5
    let relatedKeyPressed = false
    if (keys.has('ArrowUp') || keys.has('KeyW')) {
      deltaF = VEL
      relatedKeyPressed = true
    }
    if (keys.has('ArrowDown') || keys.has('KeyS')) {
      deltaF = -VEL * HALF
      relatedKeyPressed = true
    }
    if (keys.has('ArrowLeft') || keys.has('KeyA') || keys.has('KeyQ')) {
      deltaA = -ANGVEL
      relatedKeyPressed = true
    }
    if (keys.has('ArrowRight') || keys.has('KeyD') || keys.has('KeyE')) {
      deltaA = ANGVEL
      relatedKeyPressed = true
    }
    if (keys.has('ShiftLeft') || keys.has('ShiftRight')) {
      deltaA *= 2
      deltaF *= 2
    }
    let newA = participant!.pose.orientation + deltaA
    if (newA > HALF_DEGREE) { newA -= WHOLE_DEGREE }
    if (newA < -HALF_DEGREE) { newA += WHOLE_DEGREE }
    participant.pose.orientation = newA
    if (!participants.local.thirdPersonView) {
      const center = transformPoint2D(map.matrix, participants.local.pose.position)
      const changeMatrix = (new DOMMatrix()).rotateSelf(0, 0, -deltaA)
      const newMatrix = transfromAt(center, changeMatrix, map.matrix)
      map.setMatrix(newMatrix)
      map.setCommittedMatrix(newMatrix)
    }
    const delta = rotateVector2DByDegree(participant!.pose.orientation, [0, -deltaF])
    //  console.log(participant!.pose.position, delta)
    const newPos = addV2(participant!.pose.position, delta)
    if (newPos[0] < -MAP_SIZE * HALF) { newPos[0] = -MAP_SIZE * HALF }
    if (newPos[0] > MAP_SIZE * HALF) { newPos[0] = MAP_SIZE * HALF }
    if (newPos[1] < -MAP_SIZE * HALF) { newPos[1] = -MAP_SIZE * HALF }
    if (newPos[1] > MAP_SIZE * HALF) { newPos[1] = MAP_SIZE * HALF }
    participant.pose.position = newPos
    participant.savePhysicsToStorage(false)

    return relatedKeyPressed
  } */

  const scrollMap = (ratio: number) => {
    const posOnScreen = map.toWindow(participant!.pose.position)
    const target = [posOnScreen[0], posOnScreen[1]]
    const left = map.left + map.screenSize[0] * ratio
    const right = map.left + map.screenSize[0] * (1 - ratio)
    const bottom = map.screenSize[1] * (1 - ratio)
    const top = participants.local.thirdPersonView ? map.screenSize[1] * ratio : bottom
    if (target[0] < left) { target[0] = left }
    if (target[0] > right) { target[0] = right }
    if (target[1] < top) { target[1] = top }
    if (target[1] > bottom) { target[1] = bottom }
    let diff = subV2(posOnScreen, target) as [number, number]
    const norm = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1])
    if (norm > MAP_SPEED_LIMIT) {
      diff = mulV2(MAP_SPEED_LIMIT / norm, diff) as [number, number]
    }else if (norm < MAP_SPEED_MIN){
      diff = mulV2(MAP_SPEED_MIN / norm, diff) as [number, number]
    }
    const SCROOL_SPEED = 0.1
    const mapMove = mulV2(SCROOL_SPEED, map.rotateFromWindow(diff) as [number, number])
    const EPSILON = 0.2
    if (Math.abs(mapMove[0]) + Math.abs(mapMove[1]) > EPSILON) {
      const newMat = map.matrix.translate(-mapMove[0], -mapMove[1])
      const trans = map.rotateFromWindow([newMat.e, newMat.f])
      const HALF = 0.5
      let changed = false
      if (trans[0] < -MAP_SIZE * HALF) { trans[0] = -MAP_SIZE * HALF; changed = true }
      if (trans[0] > MAP_SIZE * HALF) { trans[0] = MAP_SIZE * HALF; changed = true }
      if (trans[1] < -MAP_SIZE * HALF) { trans[1] = -MAP_SIZE * HALF; changed = true }
      if (trans[1] > MAP_SIZE * HALF) { trans[1] = MAP_SIZE * HALF; changed = true }
      const transMap = map.rotateToWindow(trans);
      [newMat.e, newMat.f] = transMap
      map.setMatrix(newMat)
      map.setCommittedMatrix(newMat)
      member.scrollAgain = !changed

      return !changed
    }
    member.scrollAgain = false

    return false
  }
  const onTimer = (state:DragState<HTMLDivElement>) => {
    if (state.dragging) {
      onDrag(state)
    }
    const rv = scrollMap(0.2)
    //  console.log(`onTimer: drag:${state.dragging} again:${rv}`)

    return rv
  }
  const onDrag = (state:DragState<HTMLDivElement>) => {
    //console.log(`participant onDrag s:${state.start} xy:${state.xy} b:${state.buttons} d:${state.dragging}`)
    moveParticipant(state)
  }
  /* const onKeyTimer = (keys:Set<string>) => {
    //   console.log('onKeyTimer()', keys)
    const participantMoved = moveParticipantByKey(keys)

    if (member.scrollAgain || participantMoved) {
      return scrollMap(0.2)
    }

    return false
  } */
  const TIMER_INTERVAL = 33
  /* const keycodesUse = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'KeyQ', 'KeyW', 'KeyE', 'KeyA', 'KeyS', 'KeyD'])
  KeyHandlerPlain(onKeyTimer, TIMER_INTERVAL, keycodesUse, keycodesUse, () => (map.keyInputUsers.size === 0)) */

  //  pointer drag
  const drag = DragHandler<HTMLDivElement>(onDrag, 'dragHandle',
                                               onTimer, TIMER_INTERVAL, () => { setShowConfig(true) })
  useEffect(() => {
    drag.target.current?.focus({preventScroll:true})
  })

/*  //  always forcus on my avatar.
  useEffect(()=>{
    const dispo = autorun(()=>{
      const mat = map.committedMatrix
      if (!member.scrollAgain && !drag.memo.timerId){
        const scroll = ()=>{
          if (scrollMap(0.01)){
            setTimeout(scroll, TIMER_INTERVAL)
          }
        }
        scroll()
      }
    })
    return dispo
  }, [])
*/


/*  rotation changes sound localization and frequent changes are not good to hear.
  //  Rotate participant to look at the pointer
  useEffect(() => {
    const cleanup = reaction(() => mapData.mouse, (mouse) => {
      //  look at mouse
      if (participant.thirdPersonView && !drag.memo?.state?.dragging) {
        const dir = subV2(mapData.mouseOnMap, participant.pose.position)
        const norm = normV(dir)
        if (norm > PARTICIPANT_SIZE / 2) {
          participant.pose.orientation = Math.atan2(dir[0], -dir[1]) * HALF_DEGREE / Math.PI
        }
      }
    })

    return cleanup
  },
            [])
*/
  const styleProps = useObserver(() => ({
    position: participant.pose.position,
    size: props.size,
    mem: mem,
  }))
  const [color] = participant ? participant.getColor() : ['white', 'black']
  const classes = useStyles(styleProps)
  const {t} = useTranslation()
  const [/* showMore,  */,setShowMore] = React.useState(false)
  const [showConfig, setShowConfig] = React.useState(false)
  const moreControl = moreButtonControl(setShowMore, member)

  const [showMenu, setShowMenu] = React.useState(false)
  const [showTool, setShowTool] = React.useState(false)
  const rgb = props.participant.getColorRGB()
  isAvatarToolOpen = showTool

  const [pageIndex, setPageIndex] = useState(0)

  const [activeOutfit, setActiveOutfit] = useState(-1)
  const [activeSpecs, setActiveSpecs] = useState(-1)

  const [activeSkin, setActiveSkin] = useState(-1)
  const [activeHair, setActiveHair] = useState(-1)
  const [activeGroup, setActiveGroup] = useState(-1)

  const [activeFrontHair, setActiveFrontHair] = useState(-1)
  const [activeBackHair, setActiveBackHair] = useState(-1)


  // For Saving data
  const refAvatar = useRef<HTMLDivElement>(null)

  function onClose() {
    setShowConfig(false)
    map.keyInputUsers.delete('LocalParticipantConfig')
  }
  function openConfig() {
    setShowConfig(true)
    map.keyInputUsers.add('LocalParticipantConfig')
  }

  isConteMenuOpen = showConfig



  function openAvatarTool(ev:MouseOrTouch) {
    //console.log(participant.information.randomAvatar.length)
    if(data.length > 0 && participant.information.randomAvatar.length > 0) {
      getNewUserAvatarData()
    }
    setShowTool(true)
  }

  function EnableThis(_pageIndex:number) {
    //console.log(_pageIndex, " pageIndex")
    selectedImage = ''
    //setActive(-1)
    setPageIndex(_pageIndex)
  }

  function ActiveThis(_itemIndex:number) {
    let imgArr = images[pageIndex].split(',')
    selectedImage = imgArr[_itemIndex]

    //console.log(_itemIndex, " itemsIndex")

    if(pageIndex === 0) {
      if(_itemIndex < 7) {
        selectedGroup = imgArr[_itemIndex]
        if(activeGroup !== _itemIndex) {
          setActiveGroup(_itemIndex)
        } /* else {
          selectedGroup = ''
          setActiveGroup(-1)
        } */
      }
      if(_itemIndex >= 7 && _itemIndex < 15) {
        selectedHairColor = imgArr[_itemIndex].split('/')[2].split('.')[0].split('co_')[1]
        //console.log(selectedHairColor, " Hair")

        if(selectedHair !== '' || selectedHairBack !== '') {
          //console.log(selectedHair.split('/')[2].split('_')[2], " ---- ", selectedHair.split('/')[2].split('_')[3])

          let swatchNum = selectedHair.split('/')[2].split('_')[2]
          //let colorSwatchNum = selectedHair.split('/')[2].split('_')[3]
          let selectedHairIndex = selectedHairColor.split("_")[1]
          //console.log(swatchNum, " ---- ", colorSwatchNum, " >>>> ", selectedHairIndex)
          let filterHairsWithSelectedSwatch = swatchNum + "_" + selectedHairIndex
          //console.log(filterHairsWithSelectedSwatch, " FS")
          // Update applied hair style based on swatch selected
          let hairImgArray = images[1].split(',')
          for(let i = 0; i<hairImgArray.length; i++) {
            //console.log(hairImgArray[i], " IMG ARR")
            if(hairImgArray[i].indexOf(filterHairsWithSelectedSwatch) !== -1) {
              //console.log(hairImgArray[i])
              let hairType = hairImgArray[i].split('/')[2].split('.')[0].split('_')[4]
              if(hairType === 'f') {
                selectedHair = hairImgArray[i]
                if(activeFrontHair !== i) {
                  setActiveFrontHair(i)
                } /* else {
                  selectedHair = ''
                  setActiveFrontHair(-1)
                } */
              } else if(hairType === 'b') {
                selectedHairBack = hairImgArray[i]
                if(activeBackHair !== i) {
                  setActiveBackHair(i)
                } /* else {
                  selectedHairBack = ''
                  setActiveBackHair(-1)
                } */
              }
            }
          }
        }

        if(activeHair !== _itemIndex) {
          setActiveHair(_itemIndex)
        } /* else {
          selectedHairColor = ''
          setActiveHair(-1)
        } */
      }
      if(_itemIndex >= 15 && _itemIndex < 22) {
        selectedSkin = imgArr[_itemIndex]
        if(activeSkin !== _itemIndex) {
          setActiveSkin(_itemIndex)
        } /* else {
          selectedSkin = ''
          setActiveSkin(-1)
        } */
      }
    } else if(pageIndex === 1) {
      //console.log(imgArr[_itemIndex].split('/')[2].split('.')[0].split('_')[4], "  >>> hair")
      let hairType = imgArr[_itemIndex].split('/')[2].split('.')[0].split('_')[4]

      /* console.log(images.indexOf(imgArr[_itemIndex].split('/')[2].split('_f.')[0] + "_f.png"), " ---- ", images.indexOf(imgArr[_itemIndex].split('/')[2].split('_f.')[0] + "_b.png")) */

      //console.log(imgArr[_itemIndex].split('/')[2].split('_f.')[0], " IMG")
      //console.log(imgArr.indexOf(String(imgArr[_itemIndex].split('_f.png')[0] + '_b.png')), " Array")

      if(hairType === 'f') {
        let findBack = imgArr.indexOf(String(imgArr[_itemIndex].split('_f.png')[0] + '_b.png'))
        selectedHair = imgArr[_itemIndex]
        if(activeFrontHair !== _itemIndex) {
          setActiveFrontHair(_itemIndex)
        } /* else {
          selectedHair = ''
          setActiveFrontHair(-1)
        } */
        if(findBack !== -1) {
          selectedHairBack = imgArr[findBack]
          if(activeBackHair !== findBack) {
            setActiveBackHair(findBack)
          } /* else {
            selectedHairBack = ''
            setActiveBackHair(-1)
          } */
        } else {
          selectedHairBack = ''
          setActiveBackHair(-1)
        }
      } else if(hairType === 'b') {
        let findFront = imgArr.indexOf(String(imgArr[_itemIndex].split('_b.png')[0] + '_f.png'))
        selectedHairBack = imgArr[_itemIndex]
        if(activeBackHair !== _itemIndex) {
          setActiveBackHair(_itemIndex)
        } /* else {
          selectedHairBack = ''
          setActiveBackHair(-1)
        } */
        if(findFront !== -1) {
          selectedHair = imgArr[findFront]
          if(activeFrontHair !== findFront) {
            setActiveFrontHair(findFront)
          } /* else {
            selectedHair = ''
            setActiveFrontHair(-1)
          } */
        } else {
          selectedHair = ''
          setActiveFrontHair(-1)
        }
      }

      /* if(active !== _itemIndex) {
        setActive(_itemIndex)
      } else {
        if(hairType === 'f') {
          selectedHair = ''
        } else if(hairType === 'b') {
          selectedHairBack = ''
        }
        setActive(-1)
      } */

    } else if(pageIndex === 2) {
      selectedOutfits = imgArr[_itemIndex]
      if(activeOutfit !== _itemIndex) {
        setActiveOutfit(_itemIndex)
      } /* else {
        selectedOutfits = ''
        setActiveOutfit(-1)
      } */
    } else if(pageIndex === 3) {
      selectedSpecs = imgArr[_itemIndex]
      if(activeSpecs !== _itemIndex) {
        setActiveSpecs(_itemIndex)
      } /* else {
        selectedSpecs = ''
        setActiveSpecs(-1)
      } */
    }
    //setActive(_itemIndex)
  }

  const [data,setData] = useState('');
  const getData=()=>{
    fetch('folderlist.php?folder=avatar_tool/*/*.png')
      .then((response) => response.text())
      .then((response) => setData(response));

    /* let dataStr = "avatar_tool/Colors/es_co_group_0.png,avatar_tool/Colors/es_co_group_1.png,avatar_tool/Colors/es_co_group_2.png,avatar_tool/Colors/es_co_group_3.png,avatar_tool/Colors/es_co_group_4.png,avatar_tool/Colors/es_co_group_5.png,avatar_tool/Colors/es_co_group_6.png,avatar_tool/Colors/es_co_hair_0.png,avatar_tool/Colors/es_co_hair_1.png,avatar_tool/Colors/es_co_hair_2.png,avatar_tool/Colors/es_co_hair_3.png,avatar_tool/Colors/es_co_hair_4.png,avatar_tool/Colors/es_co_hair_5.png,avatar_tool/Colors/es_co_hair_6.png,avatar_tool/Colors/es_co_skin_0.png,avatar_tool/Colors/es_co_skin_1.png,avatar_tool/Colors/es_co_skin_2.png,avatar_tool/Colors/es_co_skin_3.png,avatar_tool/Colors/es_co_skin_4.png,avatar_tool/Colors/es_co_skin_5.png,avatar_tool/Colors/es_co_skin_6.png,avatar_tool/Hair/es_hair_0_0_f.png,avatar_toolavatar_toolavatar_tool/Hair/es_hair_0_1_f.png,avatar_tool/Hair/es_hair_0_2_f.png,avatar_tool/Hair/es_hair_0_3_f.png,avatar_tool/Hair/es_hair_0_4_f.png,avatar_tool/Hair/es_hair_0_5_f.png,avatar_tool/Hair/es_hair_0_6_f.png,avatar_tool/Hair/es_hair_1_0_b.png,avatar_tool/Hair/es_hair_1_0_f.png,avatar_tool/Hair/es_hair_1_1_b.png,avatar_tool/Hair/es_hair_1_1_f.png,avatar_tool/Hair/es_hair_1_2_b.png,avatar_tool/Hair/es_hair_1_2_f.png,avatar_tool/Hair/es_hair_1_3_b.png,avatar_tool/Hair/es_hair_1_4_b.png,avatar_tool/Hair/es_hair_1_4_f.png,avatar_tool/Hair/es_hair_1_5_b.png,avatar_tool/Hair/es_hair_1_5_f.png,avatar_tool/Hair/es_hair_1_6_b.png,avatar_tool/Hair/es_hair_1_6_f.png,avatar_tool/Hair/es_hair_3_0_f.png,avatar_tool/Outfits/es_outfit_0.png,avatar_tool/Outfits/es_outfit_1.png,avatar_tool/Outfits/es_outfit_2.png,avatar_tool/Outfits/es_outfit_3.png,avatar_tool/Outfits/es_outfit_4.png,avatar_tool/Outfits/es_outfit_5.png,avatar_tool/Outfits/es_outfit_6.png,avatar_tool/Specs/es_specs_0.png,avatar_tool/Specs/es_specs_1.png,"
    setData(dataStr) */
    /* let dataStr = "avatar_tool/Colors/es_co_group_0.png,avatar_tool/Colors/es_co_group_1.png,avatar_tool/Colors/es_co_group_2.png,avatar_tool/Colors/es_co_group_3.png,avatar_tool/Colors/es_co_group_4.png,avatar_tool/Colors/es_co_group_5.png,avatar_tool/Colors/es_co_group_6.png,avatar_tool/Colors/es_co_group_x.png,avatar_tool/Colors/es_co_hair_0.png,avatar_tool/Colors/es_co_hair_1.png,avatar_tool/Colors/es_co_hair_2.png,avatar_tool/Colors/es_co_hair_3.png,avatar_tool/Colors/es_co_hair_4.png,avatar_tool/Colors/es_co_hair_5.png,avatar_tool/Colors/es_co_hair_6.png,avatar_tool/Colors/es_co_skin_0.png,avatar_tool/Colors/es_co_skin_1.png,avatar_tool/Colors/es_co_skin_2.png,avatar_tool/Colors/es_co_skin_3.png,avatar_tool/Colors/es_co_skin_4.png,avatar_tool/Colors/es_co_skin_5_x.png,avatar_tool/Colors/es_co_skin_6_x.png,avatar_tool/Hair/es_hair_0_0_f.png,avatar_tool/Hair/es_hair_0_1_f.png,avatar_tool/Hair/es_hair_0_2_f.png,avatar_tool/Hair/es_hair_0_3_f.png,avatar_tool/Hair/es_hair_0_4_f.png,avatar_tool/Hair/es_hair_0_5_f.png,avatar_tool/Hair/es_hair_0_6_f.png,avatar_tool/Hair/es_hair_0_b.png,avatar_tool/Hair/es_hair_0_x.png,avatar_tool/Hair/es_hair_1_0_b.png,avatar_tool/Hair/es_hair_1_0_f.png,avatar_tool/Hair/es_hair_1_1_b.png,avatar_tool/Hair/es_hair_1_1_f.png,avatar_tool/Hair/es_hair_1_2_b.png,avatar_tool/Hair/es_hair_1_2_f.png,avatar_tool/Hair/es_hair_1_3_b.png,avatar_tool/Hair/es_hair_1_3_f.png,avatar_tool/Hair/es_hair_1_4_b.png,avatar_tool/Hair/es_hair_1_4_f.png,avatar_tool/Hair/es_hair_1_5_b.png,avatar_tool/Hair/es_hair_1_5_f.png,avatar_tool/Hair/es_hair_1_6_b.png,avatar_tool/Hair/es_hair_1_6_f.png,avatar_tool/Hair/es_hair_2_0_f.png,avatar_tool/Hair/es_hair_2_1_f.png,avatar_tool/Hair/es_hair_2_2_f.png,avatar_tool/Hair/es_hair_2_3_f.png,avatar_tool/Hair/es_hair_2_4_f.png,avatar_tool/Hair/es_hair_2_5_f.png,avatar_tool/Hair/es_hair_2_6_f.png,avatar_tool/Hair/es_hair_3_0_f.png,avatar_tool/Hair/es_hair_3_1_f.png,avatar_tool/Hair/es_hair_3_2_f.png,avatar_tool/Hair/es_hair_3_3_f.png,avatar_tool/Hair/es_hair_3_4_f.png,avatar_tool/Hair/es_hair_3_5_f.png,avatar_tool/Hair/es_hair_3_6_f.png,avatar_tool/Hair/es_hair_4_0_f.png,avatar_tool/Hair/es_hair_4_1_f.png,avatar_tool/Hair/es_hair_4_2_f.png,avatar_tool/Hair/es_hair_4_3_f.png,avatar_tool/Hair/es_hair_4_4_f.png,avatar_tool/Hair/es_hair_4_5_f.png,avatar_tool/Hair/es_hair_4_6_f.png,avatar_tool/Outfits/es_outfit_0.png,avatar_tool/Outfits/es_outfit_1.png,avatar_tool/Outfits/es_outfit_2.png,avatar_tool/Outfits/es_outfit_3.png,avatar_tool/Outfits/es_outfit_4.png,avatar_tool/Outfits/es_outfit_5.png,avatar_tool/Outfits/es_outfit_6.png,avatar_tool/Specs/es_specs_0.png,avatar_tool/Specs/es_specs_1.png," */
    /* let dataStr = "avatar_tool/Colors/es_co_group_0.png,avatar_tool/Colors/es_co_group_1.png,avatar_tool/Colors/es_co_group_2.png,avatar_tool/Colors/es_co_group_3.png,avatar_tool/Colors/es_co_group_4.png,avatar_tool/Colors/es_co_group_5.png,avatar_tool/Colors/es_co_group_6.png,avatar_tool/Colors/es_co_group_x.png,avatar_tool/Colors/es_co_hair_0.png,avatar_tool/Colors/es_co_hair_1.png,avatar_tool/Colors/es_co_hair_2.png,avatar_tool/Colors/es_co_hair_3.png,avatar_tool/Colors/es_co_hair_4.png,avatar_tool/Colors/es_co_hair_5.png,avatar_tool/Colors/es_co_hair_6.png,avatar_tool/Colors/es_co_skin_0.png,avatar_tool/Colors/es_co_skin_1.png,avatar_tool/Colors/es_co_skin_2.png,avatar_tool/Colors/es_co_skin_3.png,avatar_tool/Colors/es_co_skin_4.png,avatar_tool/Colors/es_co_skin_5_x.png,avatar_tool/Colors/es_co_skin_6_x.png,avatar_tool/Hair/avatars_hair_5_0_f.png,avatar_tool/Hair/avatars_hair_5_1_f.png,avatar_tool/Hair/avatars_hair_5_2_f.png,avatar_tool/Hair/avatars_hair_5_3_f.png,avatar_tool/Hair/avatars_hair_5_4_f.png,avatar_tool/Hair/avatars_hair_5_5_f.png,avatar_tool/Hair/avatars_hair_5_6_f.png,avatar_tool/Hair/es_hair_0_0_f.png,avatar_tool/Hair/es_hair_0_1_f.png,avatar_tool/Hair/es_hair_0_2_f.png,avatar_tool/Hair/es_hair_0_3_f.png,avatar_tool/Hair/es_hair_0_4_f.png,avatar_tool/Hair/es_hair_0_5_f.png,avatar_tool/Hair/es_hair_0_6_f.png,avatar_tool/Hair/es_hair_0_x_b.png,avatar_tool/Hair/es_hair_0_x_f.png,avatar_tool/Hair/es_hair_1_0_b.png,avatar_tool/Hair/es_hair_1_0_f.png,avatar_tool/Hair/es_hair_1_1_b.png,avatar_tool/Hair/es_hair_1_1_f.png,avatar_tool/Hair/es_hair_1_2_b.png,avatar_tool/Hair/es_hair_1_2_f.png,avatar_tool/Hair/es_hair_1_3_b.png,avatar_tool/Hair/es_hair_1_3_f.png,avatar_tool/Hair/es_hair_1_4_b.png,avatar_tool/Hair/es_hair_1_4_f.png,avatar_tool/Hair/es_hair_1_5_b.png,avatar_tool/Hair/es_hair_1_5_f.png,avatar_tool/Hair/es_hair_1_6_b.png,avatar_tool/Hair/es_hair_1_6_f.png,avatar_tool/Hair/es_hair_2_0_f.png,avatar_tool/Hair/es_hair_2_1_f.png,avatar_tool/Hair/es_hair_2_2_f.png,avatar_tool/Hair/es_hair_2_3_f.png,avatar_tool/Hair/es_hair_2_4_f.png,avatar_tool/Hair/es_hair_2_5_f.png,avatar_tool/Hair/es_hair_2_6_f.png,avatar_tool/Hair/es_hair_3_0_f.png,avatar_tool/Hair/es_hair_3_1_f.png,avatar_tool/Hair/es_hair_3_2_f.png,avatar_tool/Hair/es_hair_3_3_f.png,avatar_tool/Hair/es_hair_3_4_f.png,avatar_tool/Hair/es_hair_3_5_f.png,avatar_tool/Hair/es_hair_3_6_f.png,avatar_tool/Hair/es_hair_4_0_f.png,avatar_tool/Hair/es_hair_4_1_f.png,avatar_tool/Hair/es_hair_4_2_f.png,avatar_tool/Hair/es_hair_4_3_f.png,avatar_tool/Hair/es_hair_4_4_f.png,avatar_tool/Hair/es_hair_4_5_f.png,avatar_tool/Hair/es_hair_4_6_f.png,avatar_tool/Outfits/es_outfit_0.png,avatar_tool/Outfits/es_outfit_1.png,avatar_tool/Outfits/es_outfit_2.png,avatar_tool/Outfits/es_outfit_3.png,avatar_tool/Outfits/es_outfit_4.png,avatar_tool/Outfits/es_outfit_5.png,avatar_tool/Outfits/es_outfit_6.png,avatar_tool/Specs/es_specs_0.png,avatar_tool/Specs/es_specs_1.png,avatar_tool/Specs/es_specs_2.png,"
    setData(dataStr) */
  }

  useEffect(()=>{
    getData()
  },[])

  function ElementShift(arr:any, old_index:number, new_index:number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(0, 1)[0]);
    return arr;
  };


  const folders : Array<string> = []
  const images : Array<string> = []
  let tempArr : string = ''
  let dataFolderWise = data.split(',')

  for (let i=0; i<dataFolderWise.length-1; i++) {
    //if(folders.indexOf(dataFolderWise[i].split('./')[1].split('/')[1]) === -1 && dataFolderWise[i].split('./')[1].split('/')[1] !== undefined) {
      if(folders.indexOf(dataFolderWise[i].split('/')[1]) === -1 && dataFolderWise[i].split('/')[1] !== undefined) {
      folders.push(dataFolderWise[i].split('/')[1])
    }

  }
  for (var j=0; j < folders.length; j++) {
    for (let i=0; i<dataFolderWise.length-1; i++) {
    if(folders[j] === dataFolderWise[i].split('/')[1]) {
      tempArr += (dataFolderWise[i]) + ','
      //tempArr.push(dataFolderWise[i].split('./')[1])
    }
  }
  // console.log(tempArr, " AAAAA")
  images.push(tempArr)
  tempArr = ''
  }

  const randomAvatarDetails = useObserver(() => props.participant.information.randomAvatar)

  function getNewUserAvatarData() {
    //console.log(data, " details >>> data")
    // Showing selected item from list
      let imgArr = images[0].split(',')
      let randSkinIndex = imgArr.indexOf(randomAvatarDetails[0])
      let randHairColorIndex = imgArr.indexOf('avatar_tool/Colors/es_co_' + randomAvatarDetails[1] + '.png')
      let randGroupIndex = imgArr.indexOf(randomAvatarDetails[2])
      let imgArrHairs = images[1].split(',')
      let imgArrOutFit = images[2].split(',')
      let randomOutfitIndex = imgArrOutFit.indexOf(randomAvatarDetails[4])
      let imgArrSpecs = images[3].split(',')
      let randomSpecsIndex = imgArrSpecs.indexOf(randomAvatarDetails[5])
      selectedSkin = imgArr[randSkinIndex]
      if(activeSkin !== randSkinIndex) {
        setActiveSkin(randSkinIndex)
      }
      selectedHairColor = imgArr[randHairColorIndex].split('/')[2].split('.')[0].split('co_')[1]
      if(activeHair !== randHairColorIndex) {
        setActiveHair(randHairColorIndex)
      }
      selectedGroup = imgArr[randGroupIndex]
      if(activeGroup !== randGroupIndex) {
        setActiveGroup(randGroupIndex)
      }
      ///////////////////////////////////////////////////////////
      let frontHairs : Array<string> = []
      let frontHairIndex : Array<number> = []
      let backHairs : Array<string> = []
      let backHairIndex : Array<number> = []
      frontHairs.splice(0)
      frontHairIndex.splice(0)
      backHairs.splice(0)
      backHairIndex.splice(0)
      for (let i:number = 0; i < imgArrHairs.length - 1; i++) {
          if(imgArrHairs.indexOf(selectedHairColor.split('_')[1] + '_' + imgArrHairs[i].split("_")[4]) === -1) {
          if((selectedHairColor.split("_")[1] === imgArrHairs[i].split("_")[4]) || imgArrHairs[i].split("_")[4] === "x" ) {
            let hairType = imgArrHairs[i].split('/')[2].split('.')[0].split('_')[4]
            if(hairType === 'f') {
              frontHairs.push(imgArrHairs[i])
              frontHairIndex.push(i)
            } else if(hairType === 'b') {
              backHairs.push(imgArrHairs[i])
              backHairIndex.push(i)
            }
          }
        }
      }
      if(frontHairs.length > 0) {
        let randomHairIndex = frontHairs.indexOf(randomAvatarDetails[3])
        selectedHair = frontHairs[randomHairIndex]
        setActiveFrontHair(frontHairIndex[randomHairIndex])
        let findBack = imgArrHairs.indexOf(String(frontHairs[randomHairIndex].split('_f.png')[0] + '_b.png'))
        if(findBack !== -1) {
          selectedHairBack = imgArrHairs[findBack]
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
      ///////////////////////////////////////////////////////////

      selectedOutfits = imgArrOutFit[randomOutfitIndex]
      if(activeOutfit !== randomOutfitIndex) {
        setActiveOutfit(randomOutfitIndex)
      }

      selectedSpecs = imgArrSpecs[randomSpecsIndex]
      if(activeSpecs !== randomSpecsIndex) {
        setActiveSpecs(randomSpecsIndex)
      }
  }

  const _ITEMS = []
  if(images.length > 0 && pageIndex >= 0) {
    let imgArr = images[pageIndex].split(',')
    for (let i:number = 0; i < imgArr.length - 1; i++) {
      if(pageIndex === 1) {
        //console.log(selectedHairColor.split("_")[1], " --- ", imgArr[i].split("_")[4], " ---- ", imgArr[i])
        //if(imgArr[i].indexOf(selectedHairColor) !== -1 && (selectedHairColor.split("_")[1] === imgArr[i].split("_")[4])) {

        //console.log(selectedOutfits, " selectedoutfit")
        //console.log(imgArr[i].split("_")[4], " hait cat")

        if((selectedHairColor.split("_")[1] === imgArr[i].split("_")[4]) || imgArr[i].split("_")[4] === "x") {
          let hairType = imgArr[i].split('/')[2].split('.')[0].split('_')[4]
          if(hairType === 'f') {

            let findBack = imgArr.indexOf(String(imgArr[i].split('_f.png')[0] + '_b.png'))

            _ITEMS.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', borderRadius:'50%', padding:'0px', border:activeFrontHair === i ? '5px solid #ef4623' : '5px dotted #00000000'/* , borderLeft: activeFrontHair === i ? '0px dotted #00000000' : '3px dotted #00000000' */, position:'relative', top:'3px'}} draggable={false} alt='' />

            {/* <div style={{position:'relative', top:'-68px', left:'3px', zIndex:-1, display:findBack !== -1 ?'block' : 'none'}}><img src={findBack !== -1 ? String(imgArr[i].split('_f.png')[0] + '_b.png') : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

            <div style={{position:'relative', top:findBack !== -1 ? '-136px' : '-68px', left:'3px', zIndex:-1, display:selectedSkin !== '' ?'block' : 'none'}}><img src={selectedSkin !== '' ? String(selectedSkin) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

            <div style={{position:'relative', top:findBack !== -1 ? '-204px' : '-136px', left:'3px', zIndex:0, display:selectedOutfits !== '' ?'block' : 'none'}}><img src={selectedOutfits !== '' ? String(selectedOutfits) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px', position:'relative', top:'-2px'}} alt='' /></div>

            <div style={{position:'relative', top:findBack !== -1 ? '-272px' : '-204px', left:'3px', zIndex:1, display:selectedSpecs !== '' ?'block' : 'none'}}><img src={selectedSpecs !== '' ? String(selectedSpecs) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div> */}

            <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-1, display:findBack !== -1 ?'block' : 'none'}}><img src={findBack !== -1 ? String(imgArr[i].split('_f.png')[0] + '_b.png') : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

            <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-1, display:selectedSkin !== '' ?'block' : 'none'}}><img src={selectedSkin !== '' ? String(selectedSkin) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

            <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:0, display:selectedOutfits !== '' ?'block' : 'none'}}><img src={selectedOutfits !== '' ? String(selectedOutfits) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px', position:'relative', top:'-2px'}} alt='' /></div>

            <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:1, display:selectedSpecs !== '' ?'block' : 'none'}}><img src={selectedSpecs !== '' ? String(selectedSpecs) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>


            {/* <div style={{position:'relative', top:(findBack !== -1 && selectedOutfits === "" && selectedSpecs === "") ? '-204px' : (findBack !== -1 && selectedOutfits !== "" && selectedSpecs === "") ? '-204px' : (findBack !== -1 && selectedOutfits !== "" && selectedSpecs !== "") ? '-274px' : (findBack === -1 && selectedOutfits !== "") ? '-204px' : (findBack !== -1 && selectedOutfits !== "") ? '-272px' : '-136px', left:'3px', zIndex:-4, display:selectedGroup !== '' ?'block' : 'none'}}><img src={selectedGroup !== '' ? String(selectedGroup) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div> */}

            <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-4, display:selectedGroup !== '' ?'block' : 'none'}}><img src={selectedGroup !== '' ? String(selectedGroup) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

            </div>)
          }
          //console.log(_ITEMS)
          //else if(hairType === 'bb') {
          //  _ITEMS.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px', border:activeBackHair === i ? '3px solid #ef4623' : '3px dotted #00000000'/* , borderRight: activeBackHair === i ? '0px dotted #00000000' : '3px dotted #00000000' */ /* '3px dotted #00000020' */}} draggable={false} alt='' />{/* <div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div> */}<div style={{position:'relative', width:'20px', height:'64px', backgroundColor:'white', top:'-71px', left:'63px', display: activeBackHair === i ? 'block' : 'none'}}></div></div>)
          //}

          // Sort the hair list to make bald option at the end of the hair list
          ElementShift(_ITEMS, 0, _ITEMS.length)
        }
      } else if(pageIndex === 2) {
        _ITEMS.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'0px', border:activeOutfit === i ? '5px solid #ef462300' : '5px dotted #00000000', borderRadius:'50%' /* '3px dotted #00000020' */, position:'relative', top:'1px'}} draggable={false} alt='' />{/* <div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div> */}



        {/* <div style={{position:'relative', top:'-68px', left:'3px', zIndex:1, display:selectedHair !== '' ?'block' : 'none'}}><img src={selectedHair !== '' ? String(selectedHair) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:'-136px', left:'3px', zIndex:-1, display:selectedHairBack !== '' ?'block' : 'none'}}><img src={selectedHairBack !== '' ? String(selectedHairBack) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:selectedHairBack ? '-204px' : '-136px', left:'3px', zIndex:-1, display:selectedSkin !== '' ?'block' : 'none'}}><img src={selectedSkin !== '' ? String(selectedSkin) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:selectedHairBack ? '-272px' : '-204px', left:'3px', zIndex:1, display:selectedSpecs !== '' ?'block' : 'none'}}><img src={selectedSpecs !== '' ? String(selectedSpecs) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:selectedHairBack !== "" ? '-272px' : '-204px', left:'3px', zIndex:-2, display:selectedGroup !== '' ?'block' : 'none'}}><img src={selectedGroup !== '' ? String(selectedGroup) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div> */}

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:1, display:selectedHair !== '' ?'block' : 'none'}}><img src={selectedHair !== '' ? String(selectedHair) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-1, display:selectedHairBack !== '' ?'block' : 'none'}}><img src={selectedHairBack !== '' ? String(selectedHairBack) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-1, display:selectedSkin !== '' ?'block' : 'none'}}><img src={selectedSkin !== '' ? String(selectedSkin) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'0px', border:activeOutfit === i ? '5px solid #ef4623' : '5px dotted #00000000', borderRadius:'50%', position:'relative', top:'-3px', left:'-3px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:1, display:selectedSpecs !== '' ?'block' : 'none'}}><img src={selectedSpecs !== '' ? String(selectedSpecs) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-2, display:selectedGroup !== '' ?'block' : 'none'}}><img src={selectedGroup !== '' ? String(selectedGroup) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        </div>)
      } else if(pageIndex === 3) {
        _ITEMS.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'0px', border:activeSpecs === i ? '5px solid #ef4623' : '5px dotted #00000000', borderRadius:'50%'/* '3px dotted #00000020' */, position:'relative', top:'3px'}} draggable={false} alt='' />{/* <div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div> */}

        {/* <div style={{position:'relative', top:'-68px', left:'3px', zIndex:1, display:selectedHair !== '' ?'block' : 'none'}}><img src={selectedHair !== '' ? String(selectedHair) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:'-136px', left:'3px', zIndex:-1, display:selectedHairBack !== '' ?'block' : 'none'}}><img src={selectedHairBack !== '' ? String(selectedHairBack) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:selectedHairBack ? '-204px' : '-136px', left:'3px', zIndex:-1, display:selectedSkin !== '' ?'block' : 'none'}}><img src={selectedSkin !== '' ? String(selectedSkin) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:selectedHairBack ? '-272px' : '-204px', left:'3px', zIndex:1, display:selectedOutfits !== '' ?'block' : 'none'}}><img src={selectedOutfits !== '' ? String(selectedOutfits) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'relative', top:selectedHairBack !== "" ? '-340px' : '-272px', left:'3px', zIndex:-2, display:selectedGroup !== '' ?'block' : 'none'}}><img src={selectedGroup !== '' ? String(selectedGroup) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div> */}

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:1, display:selectedHair !== '' ?'block' : 'none'}}><img src={selectedHair !== '' ? String(selectedHair) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-1, display:selectedHairBack !== '' ?'block' : 'none'}}><img src={selectedHairBack !== '' ? String(selectedHairBack) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-1, display:selectedSkin !== '' ?'block' : 'none'}}><img src={selectedSkin !== '' ? String(selectedSkin) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:1, display:selectedOutfits !== '' ?'block' : 'none'}}><img src={selectedOutfits !== '' ? String(selectedOutfits) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px', position:'relative', top:'-2px'}} alt='' /></div>

        <div style={{position:'absolute', top:'6px', marginLeft:'3px', zIndex:-2, display:selectedGroup !== '' ?'block' : 'none'}}><img src={selectedGroup !== '' ? String(selectedGroup) : ''} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'2px'}} alt='' /></div>

        </div>)
      }
    }
  }

  const _ITEMS_SKIN = []
  const _ITEMS_GROUP = []
  const _ITEMS_HAIR = []
  if(images.length > 0 && pageIndex >= 0) {
    let imgArr = images[pageIndex].split(',')
    for (let i:number = 0; i < imgArr.length - 1; i++) {
      //console.log(imgArr[i].indexOf('skin'), " ------ ", imgArr[i])
      if(imgArr[i].indexOf('skin') !== -1) {
        //if(imgArr[i].indexOf("_x") === -1) {
          _ITEMS_SKIN.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'0px', border:activeSkin === i ? '5px solid #ef4623' : '5px dotted #00000000', borderRadius:'50%' /* '3px dotted #00000020' */}} draggable={false} alt='' />{/* <div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div> */}</div>)
        //}
      }
      if(imgArr[i].indexOf('group') !== -1) {
        if(imgArr[i].indexOf('_x') === -1) {
          _ITEMS_GROUP.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'0px', border:activeGroup === i ? '5px solid #ef4623' : '5px dotted #00000000', borderRadius:'50%'  /* '3px dotted #00000020' */}} draggable={false} alt='' />{/* <div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div> */}</div>)
        }
      }
      if(imgArr[i].indexOf('hair') !== -1) {
        _ITEMS_HAIR.push(<div onClick = {() => {ActiveThis(i)}}><img src={encodeURIComponent(imgArr[i])} style={{width:'60px', minHeight:'60px', height:'60px', objectFit:'contain', padding:'0px', border:activeHair === i ? '5px solid #ef4623' : '5px dotted #00000000', borderRadius:'50%' /* '3px dotted #00000020' */}} draggable={false} alt='' />{/* <div style={{textAlign:'center', position:'relative', fontWeight:'bold', marginTop:'-5px'}}>{imgArr[i].split('/')[2].split('.')[0]}</div> */}</div>)
      }
    }
  }

  const ref = useRef<HTMLButtonElement>(null)

  function stop(ev:MouseOrTouch|React.PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
  }

  function onCloseDialog() {
    selectedGroup = ''
    selectedSkin = ''
    selectedHairColor = ''
    selectedHair = ''
    selectedHairBack = ''
    selectedOutfits = ''
    selectedSpecs = ''

    setShowTool(false)
    setActiveGroup(-1)
    setActiveHair(-1)
    setActiveSkin(-1)
    setPageIndex(0)
    //setActive(-1)
    setActiveBackHair(-1)
    setActiveFrontHair(-1)
    setActiveOutfit(-1)
    setActiveSpecs(-1)
  }

  function onApplyChanges() {
    /* html2canvas(window.document.getElementById('userAvatar')).then(canvas => {
        document.body.appendChild(canvas)
    }); */

    //console.log(userContent, " userContent")

    if (refAvatar.current === null) {
      return
    }

    /* toPng(refAvatar.current, { cacheBust: true, })
      .then((dataUrl) => {
        ////////////////////////////////////////////////////
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

    //html2canvas(document.body, { allowTaint: true }).then(function(canvas) {
      //html2canvas(userContent, { allowTaint: true }).then(function(canvas) {
      //let dataImg = canvas.toDataURL('image/png');
      //console.log(dataImg, " >>base64")
      /* $.ajax({
       type: "POST",
       url: 'http://localhost/earshot/saveImage.php',
       dataType: 'text',
       cache: false,
       data: {vals : dataImg},
       success: function(result) {
         if (result) {
             alert(result)
         }
       },
       error: function(error) {
           alert(error);
       }
      }); */
    //})
  }

  function generateRandomNumber(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


  function onGenerateRandomAvatar() {
    // For Group, Skin and Hair Color setting
    //let randGroupIndex = generateRandomNumber(0,6)

    let randSkinIndex = generateRandomNumber(15, 20)
    let randHairColorIndex = generateRandomNumber(8, 14)
    let imgArr = images[0].split(',')

    //console.log(randHairColorIndex)

    //if(pageIndex === 0) {

/////////////////////////////////
      /* if(randGroupIndex < 7) {
        selectedGroup = imgArr[randGroupIndex]
        if(activeGroup !== randGroupIndex) {
          setActiveGroup(randGroupIndex)
        }
      } */
/////////////////////////////////////

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
      setActiveFrontHair(frontHairIndex[randFrontHairIndex])
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
    setActiveOutfit(randOutfitIndex)

    // Setting Specs
    let imgSpecsArr = images[3].split(',')
    let randSpecsIndex = generateRandomNumber(0, imgSpecsArr.length-2)
    selectedSpecs = imgSpecsArr[randSpecsIndex]
    setActiveSpecs(randSpecsIndex)
  }

  ////////////////////////////////////////////////////////////////////////
  const MOUSE_LEFT = 1
  //const MOUSE_RIGHT = 2
  const bind = useGesture(
    {
      onDragStart: ({buttons, xy}) => {

        document.body.focus()
        mem.dragging = true
        mem.mouseDown = true

        onLocalUser = true

        mem.downTime = new Date().getSeconds()
        mem.moveX = map.mouseOnMap[0]
        mem.moveY = map.mouseOnMap[1]

        /* let itemLocked = getContentLocked()
        let _onContent = isOnContentStatus()

        let _onRemoteUser = getOnRemote()
        let _dialogStatus:boolean = isDialogOpen()
        let _contentDialogStatus:boolean = getContentDialogStatus()

        let _avatarToolStatus = getAvatarToolStatus()

        if(_contentDialogStatus) {return}
        if(_dialogStatus) {return}

        //console.log(_onRemoteUser, " onRemoteUser")

        //if(showUploadOption) {return}
        if(_onContent) {return}
        if(_onRemoteUser) {return}

        if(_avatarToolStatus) {return} */

        //  console.log('Base StartDrag:')
        if (buttons === MOUSE_LEFT || buttons === 0) {

          mem.downTime = new Date().getSeconds()
          mem.downXpos = xy[0]
          mem.downYpos = xy[1]

          ////////////////////////////////////////////////
          //const local = participants.local
          const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
          for (const [i] of remotes.entries()) {
            let remoteX = Number(participants.remote.get(remotes[i])?.pose.position[0])
            let remoteY = Number(participants.remote.get(remotes[i])?.pose.position[1])
            let mouseX = Number(map.mouseOnMap[0])
            let mouseY = Number(map.mouseOnMap[1])
            if(mouseX >= (remoteX-30) && mouseX <= (remoteX+30) && mouseY >= (remoteY-30) && mouseY <= (remoteY+30)) {
              return
            }
          }
          ////////////////////////////////////////////////
          const downTimer = setTimeout(() => {
            clearTimeout(downTimer)
            //if(itemLocked) {return}

            let diffX = mem.downXpos - mem.cursorX
            let diffY = mem.downYpos - mem.cursorY

            //console.log(diffX, " ---- ", diffY)

            if(mem.mouseDown && diffX === 0 && diffY === 0 /* && showUploadOption === false */) {
              //console.log("Open Context Menu")
              mem.zoomX = xy[0]
              mem.zoomY = xy[1]
              mem.contentX = map.mouseOnMap[0]
              mem.contentY = map.mouseOnMap[1]
              //_menuCanvas = true
              setShowMenu(true)
            }
          }, 500)
        }
      },
      onDrag: ({down, delta, xy, buttons}) => {
        //console.log('onDrag')
        mem.cursorX = xy[0]
        mem.cursorY = xy[1]
      },
      onDragEnd: ({event, xy}) => {
        mem.upXpos = xy[0]
        mem.upYpos = xy[1]
        mem.upTime = new Date().getSeconds()
        let timeDiff = mem.upTime - mem.downTime

        /* let _dialogStatus:boolean = isDialogOpen()

        //console.log()
        let _contentDialogStatus:boolean = getContentDialogStatus()
        if(_contentDialogStatus) {return}

        if(_dialogStatus) {return}
 */

        if((mem.upXpos >= (mem.downXpos-20) && mem.upXpos <= (mem.downXpos+20) && (mem.upYpos >= (mem.downYpos-20) && mem.upYpos <= (mem.downYpos+20))) && String(Object(event?.target).tagName) === "DIV" && timeDiff < 1) {
          //const local = participants.local
          const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
          for (const [i] of remotes.entries()) {
            let remoteX = Number(participants.remote.get(remotes[i])?.pose.position[0])
            let remoteY = Number(participants.remote.get(remotes[i])?.pose.position[1])
            let mouseX = Number(map.mouseOnMap[0])
            let mouseY = Number(map.mouseOnMap[1])
            if(mouseX >= (remoteX-30) && mouseX <= (remoteX+30) && mouseY >= (remoteY-30) && mouseY <= (remoteY+30)) {
              return
            }
          }
        }
        mem.dragging = false
        mem.mouseDown = false
        onLocalUser = false
        setShowMenu(false)
      },

      onMove:({xy}) => {
        mem.zoomX = xy[0]
        mem.zoomY = xy[1]
        map.setMouse(xy)
        if(showMenu) {return}
        participants.local.mouse.position = Object.assign({}, map.mouseOnMap)
      },

      onTouchStart:(ev) => {
        mem.zoomX = ev.touches[0].clientX
        mem.zoomY = ev.touches[0].clientY
        onLocalUser = true
        map.setMouse([ev.touches[0].clientX, ev.touches[0].clientY])
        participants.local.mouse.position = Object.assign({}, map.mouseOnMap)
      },

      onTouchEnd:(e) => {
        //console.log(e.changedTouches)
        var changedTouch = e.changedTouches[0];

        var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

        console.log(elem?.nodeName, " ----- ", elem?.id)

        if(elem?.nodeName === "IMG" && elem?.id === "contextMore") {
          //setShowUploadOption(true)
          //setShowMenu(false)
          openConfig()
        } else if(elem?.nodeName === "IMG" && elem?.id === "avatarGen") {
          openAvatarTool(e)
        }
        onLocalUser = false
      }
    },
    {
      eventOptions:{passive:false}, //  This prevents default zoom by browser when pinch.
    },
  )

  ///////////////////////////////////////////////////////////////////////


  return (
    <div ref={drag.target} /* {...drag} */ {...moreControl} {...bind()}>
    <Participant {...props} isLocal={true}
      /* onContextMenu={(ev) => {
        ev.preventDefault()
        openConfig()
      }} */
    />
    <MoreButton show={false} className={classes.more} htmlColor={color} {...moreControl}
      buttonRef = {ref}
      onClickMore = {openConfig} />
    <LocalParticipantForm stores={props.stores} open={showConfig} close={onClose}
      anchorEl={ref.current} anchorOrigin={{vertical:'top', horizontal:'left'}}
      anchorReference = "anchorEl"
    />
    <Dialog open={showMenu} onClose={() => setShowMenu(false)} onExited={() => setShowMenu(false)}
        keepMounted
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            position:'absolute',
            boxShadow: 'none',
            overflow:'hidden',
            width: 350,
            height: 250,
            left: Number(mem.downXpos) - 200,
            top: Number(mem.downYpos) - 160,
            zIndex: showMenu ? 999 : -999,
            transform: isSmartphone() ? 'scale(2.5)' : 'scale(1)',
          },
        }}
        BackdropProps={{ invisible: true }}
        >
        <DialogContent style={showMenu ? {transform:'scale(1.1)', transition:'0s ease-out'} : {transform:'scale(0)', transition:'0s ease-out'}}>
        <Zoom in={showMenu} style={{ transition: showMenu ? '500ms' : '0ms' }}>
          <div className={showMenu ? classes.showMenuContainer : classes.hideMenuContainer}>
            {/* <Tooltip placement="bottom" title={showMenu ? t('ctUploadZone') : ''}> */}
                <div className={classes.moreIcon} onMouseUp={openConfig}
                  onTouchStart={stop}>
                    <img id='contextMore' src={MoreIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} style={{transform:'scale(1.2)'}} alt=""/>
                </div>
              {/* </Tooltip> */}
              <Tooltip placement="top" title={showMenu ? t('ctGenerateAvatar') : ''}>
              <div className={classes.avatarTool} onMouseUp={openAvatarTool}
                  onTouchStart={stop}>
                    <img id='avatarGen' src={AvatarGenIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} style={{transform:'scale(1)'}} alt=""/>
                </div>
              </Tooltip>
            <div className={classes.dashedCircle}></div>
            </div>
          </Zoom>
        </DialogContent>
      </Dialog>

      {/* Avatar gen tool dialog */}
      <Dialog open={showTool} onClose={() => onCloseDialog()/* setShowTool(false) */} onExited={() => onCloseDialog()/* setShowTool(false) */} maxWidth="sm" fullWidth={true} fullScreen={false}
        keepMounted
        PaperProps={{
          style: {
            minWidth: 760,
            transform: isSmartphone() ? 'scale(1.2)' : 'scale(1)',
          },
        }}
      >
      <DialogTitle id="simple-dialog-title" disableTypography={true} style={{fontSize: isSmartphone() ? '2.5em' : '1.2em', fontWeight:'bold'}}>
        {'Customize My Avatar'}</DialogTitle>
        <DialogContent>
          <div className={classes.mainContainer}>
          <div className={classes.menuContainer} /* style={{position:'relative', top:'12px', width:'100px', height:'100px'}} */>
            {folders.map((items, index) => {
              return (
                <div className={pageIndex === index ? classes.avticeButtons : classes.deavticeButtons} onClick = {() => {EnableThis(index)}}>{items}</div>
              );
            })}

          <div style={{position:'relative', width:'130px', height:'130px', maxWidth:'130px', marginLeft:'-10px'/* , backgroundColor:'red' */, marginTop:'50px'}}>
            {selectedGroup !== '' || selectedSkin !== '' ?
            <div ref={refAvatar} style={{position:'relative', width:'130px', height:'130px', maxWidth:'130px'}}>
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
            :
            <div>
            <div style={{position:'absolute', top:'0px', left:'0px'}}>
              <img style={{backgroundColor:rgb2Color(rgb), borderRadius: '50%'}} src={props.participant.information.avatarSrc} width={'130px'} height={'130px'} draggable={false} alt='' />
            </div>
            </div>
            }
          <div style={{position:'absolute', top:'145px', left:'0px', fontSize:isSmartphone() ? '2em' : '1em', fontWeight:'bold', color:'#2279BD', width:'100%', textAlign:'center'}}>
           {props.participant.information.name}
          </div>
        </div>
      </div>
          <List>
          {pageIndex === 0 ?
              <ListItem style={{minWidth:'470px', minHeight:'250px'}}>
                <div className={classes.galleryMain}>
                  <div style={{position:'relative', marginTop:'5px', marginLeft:'5px', fontSize:isSmartphone() ? '1.5em' : '0.9em', fontWeight:'bold', color:'#2279BD'}}>SKIN</div>
                  <div className={classes.galleryList}>
                    {_ITEMS_SKIN}
                  </div>
                  <div style={{position:'relative', marginTop:'5px', marginLeft:'5px', fontSize:isSmartphone() ? '1.5em' : '0.9em', fontWeight:'bold', color:'#2279BD'}}>HAIR</div>
                  <div className={classes.galleryList}>
                    {_ITEMS_HAIR}
                  </div>
                  <div style={{position:'relative', marginTop:'5px', marginLeft:'5px', fontSize:isSmartphone() ? '1.5em' : '0.9em', fontWeight:'bold', color:'#2279BD'}}>GROUP</div>
                  <div className={classes.galleryList}>
                    {_ITEMS_GROUP}
                  </div>

                </div>
              </ListItem>
              : <ListItem style={{minWidth:'470px', minHeight:'250px'}}>
              <div className={classes.galleryMain}>
                <div className={classes.gallery}>
                  {_ITEMS}
                </div>
              </div>
            </ListItem>}
              <ListItem style={{width:'100%'}}>
              <MuiThemeProvider theme={theme}>
              <Button
                  variant="contained"
                  /* color="primary" */
                  style={{fontSize: isSmartphone() ? '1.5em' : '1em', backgroundColor:'orange', position:'relative', marginLeft:isSmartphone() ? '-130px' : '75px'}}
                  onClick={() => {
                    onCloseDialog()
                  }}
                >
                  Revert
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{fontSize: isSmartphone() ? '1.5em' : '1em', position:'relative', marginLeft: '13px'}}
                  onClick={() => {
                    onGenerateRandomAvatar()
                  }}
                >
                  Generate Random
                </Button>
                <Button
                  variant="contained"
                  /* color="primary" */
                  style={{fontSize: isSmartphone() ? '1.5em' : '1em', backgroundColor:'orange', position:'relative', marginLeft: '13px'}}
                  onClick={() => {
                    onApplyChanges()
                  }}
                >
                  Apply Changes
                </Button>
                </MuiThemeProvider>
              </ListItem>
            </List>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export const MemoedLocalParticipant = (props: ParticipantProps) =>
  React.useMemo(() => <LocalParticipant {...props} />,
  //  eslint-disable-next-line react-hooks/exhaustive-deps
  [props.size, props.participant.information.avatarSrc,
    props.participant.information.color,
    props.participant.information.name,
    props.participant.information.textColor,
  ])
  MemoedLocalParticipant.displayName = 'MemorizedLocalParticipant'
