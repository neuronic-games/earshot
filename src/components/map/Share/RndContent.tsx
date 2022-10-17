/* import clipboardCopy from '@iconify-icons/heroicons-outline/clipboard-copy'
import maximizeIcon from '@iconify-icons/tabler/arrows-maximize'
import minimizeIcon from '@iconify-icons/tabler/arrows-minimize'
import pinIcon from '@iconify/icons-mdi/pin'
import pinOffIcon from '@iconify/icons-mdi/pin-off' */
import {Icon} from '@iconify/react'
import {Button, Dialog, DialogActions, DialogContent, Tooltip, Zoom} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {CreateCSSProperties} from '@material-ui/core/styles/withStyles'
/* import DoneIcon from '@material-ui/icons/CheckCircle'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import EditIcon from '@material-ui/icons/Edit' */
/* import FlipToBackIcon from '@material-ui/icons/FlipToBack'
import FlipToFrontIcon from '@material-ui/icons/FlipToFront' */
/* import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import PlayArrowIcon from '@material-ui/icons/PlayArrow' */
import settings from '@components/Settings'
import {doseContentEditingUseKeyinput, /* isContentWallpaper,  */isContentEditable, /* isContentMaximizable,  */ISharedContent} from '@models/ISharedContent'
import {t} from '@models/locales'
import {isSmartphone, mulV2, normV, Pose2DMap} from '@models/utils'
import {addV2, extractScaleX, extractScaleY, mulV, rotateVector2DByDegree, subV2} from '@models/utils'
import {/* copyContentToClipboard,  */moveContentToBottom, moveContentToTop} from '@stores/sharedContents/SharedContentCreator'
import {TITLE_HEIGHT} from '@stores/sharedContents/SharedContents'
import _ from 'lodash'
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Rnd} from 'react-rnd'
import {useGesture} from 'react-use-gesture'
import { FullGestureState, UserHandlersPartial } from 'react-use-gesture/dist/types'
import {Content/* , contentTypeIcons, editButtonTip */} from './Content'
import {ISharedContentProps} from './SharedContent'
import {SharedContentForm} from './SharedContentForm'

///////////////////////
import {ShareDialog} from '@components/footer/share/ShareDialog'
/* import { getBasePingStatus } from '../Base' */
import crossIcon from '@iconify-icons/fa-solid/expand-arrows-alt'
import { isCanvasMoved } from '../Base'

import proximityIcon from '@images/whoo-screen_btn-earshot.png'
import proximityOffIcon from '@images/whoo-screen_btn-earshot.png'
import MoreIcon from '@images/whoo-screen_btn-more.png'
import CloseIcon from '@images/whoo-screen_btn-delete.png'



/* import pinIcon from '@images/whoo-screen_btn-lock.png'
import pinOffIcon from '@images/whoo-screen_btn-lock.png' */

import FlipToBackIcon from '@images/whoo-screen_btn-back.png'
import FlipToFrontIcon from '@images/whoo-screen_btn-front.png'
import UploadShare from '@images/whoo-screen_btn-add-63.png'
//import PingIcon from '@images/whoo-screen_pointer.png'

/* import StopWatchOnIcon from '@material-ui/icons/Timer'
import StopWatchOffIcon from '@material-ui/icons/Timer' */
import RotateRightIcon from '@material-ui/icons/RotateRight'
/* import AspectRatioIcon from '@material-ui/icons/AspectRatio'; */
import AspectRatioIcon from '@images/aspectratio.png'
import StopWatchIcon from '@images/stopwatch.png'
import { PARTICIPANT_SIZE } from '@models/Participant'

///////////////////////

const MOUSE_RIGHT = 2
const BORDER_TIMER_DELAY = 1 * 1000 // For 1 secs

export type MouseOrTouch = React.MouseEvent | React.TouchEvent
export interface RndContentProps extends ISharedContentProps {
  hideAll ?: boolean
  autoHideTitle ?: boolean
  onShare ?: (evt: MouseOrTouch) => void
  onClose: (evt: MouseOrTouch) => void
  updateAndSend: (c: ISharedContent) => void
  updateOnly: (c: ISharedContent) => void
}
interface StyleProps{
  props: RndContentProps,
  pose: Pose2DMap,
  size: [number, number],
  showTitle: boolean,
  showBorder: boolean,
  pinned: boolean,
  dragging: boolean,
  editing: boolean,

  downPos: number,
  downXPos: number,
  _down: boolean,
  _title:boolean,
  pingX: number,
  pingY: number,
  // Other props
  uploadMouseEnter: boolean,
  deleteMouseEnter: boolean,
  frontMouseEnter: boolean,
  backMouseEnter: boolean,
  moreMouseEnter: boolean,
  proxMouseEnter: boolean,
  scaleRotateMouseEnter: boolean,
  stopWatchMouseEnter: boolean,
}
class RndContentMember{
  buttons = 0
  dragCanceled = false

  _borderTimer = 0
  _down = false
  _item = ''
  _timer = 0
  downTime = 0
  upTime = 0
  downPos = 0
  downXPos = 0
  movePos = 0
  moveXPos = 0
  onContent = false
  onContext = false
  moveX = 0
  moveY = 0
  clickStatus = ''
  userAngle = 0
  clickEnter = false
  pingX = 0
  pingY = 0
  isMoved = false
  hidePinIcon = 0
  // Stop watch
  OnTimerClick = false
  intervalStep = 0
  // zIndex
  _zIndex = 0
  _clickX = 0
  _clickY = 0
  _checkForRotation = false
  _onContentForEdit = false
  touchStart = 0
  touchEnd = 0
}

let contextMenuStatus:boolean = false
export function getContextMenuStatus(): boolean {
  return contextMenuStatus
}
let isLocaked:boolean = false
export function getContentLocked(): boolean {
  return isLocaked
}

let pingEnable:boolean = false
export function getRndPingStatus():boolean {
  return pingEnable
}

let _contentDialogOpen = false
export function getContentDialogStatus() : boolean {
  return _contentDialogOpen
}

let _contentDeleteDialogOpen = false
export function getContentDeleteDialogStatus() : boolean {
  return _contentDeleteDialogOpen
}

let _isOnContent = false
export function isOnContentStatus() : boolean {
  return _isOnContent
}

let _contenHandler = false
export function isContentHandlerOn() : boolean {
  return _contenHandler
}

// For Double Touch
let dblTouchTapCount = 0

//  -----------------------------------------------------------------------------------
//  The RnDContent component
export const RndContent: React.FC<RndContentProps> = (props:RndContentProps) => {
  /*
  function rotateG2C(gv: [number, number]) {
    const lv = mapData.rotateFromWindow(gv)
    const cv = rotateVector2DByDegree(-pose.orientation, lv)
    //  console.log('rotateG2C called ori', pose.orientation, ' tran:', transform.rotation)

    return cv
  }*/
  /*
  function rotateG2L(gv: [number, number]) {
    const lv = transform.rotateG2L(gv)

    return lv
  }
  function rotateC2G(cv: [number, number]) {
    const lv = rotateVector2DByDegree(pose.orientation, cv)
    const gv = transform.rotateL2G(lv)

    return gv
  }*/

  // states
  const [pose, setPose] = useState(props.content.pose)  //  pose of content
  const [size, setSize] = useState(props.content.size)  //  size of content
  const [resizeBase, setResizeBase] = useState(size)    //  size when resize start
  const [resizeBasePos, setResizeBasePos] = useState(pose.position)    //  position when resize start
  //const [showTitle, setShowTitle] = useState(!props.autoHideTitle || !props.content.pinned)
  const [showTitle, setShowTitle] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [preciseOrientation, setPreciseOrientation] = useState(pose.orientation)
  const [dragging, setDragging] = useState(false)
  const rnd = useRef<Rnd>(null)                         //  ref to rnd to update position and size
  const {contents, map, participants} = props.stores
  const editing = useObserver(() => contents.editing === props.content.id)
  //const zoomed = useObserver(() => map.zoomed)
  function setEditing(flag: boolean) { contents.setEditing(flag ? props.content.id : '') }
  const memberRef = useRef<RndContentMember>(new RndContentMember())
  const member = memberRef.current

  const titleDisplay = useObserver(() => props.content.showTitle)
  const [showUploadOption, setShowUploadOption] = useState(false)
  const [showBorder, setShowBorder] = useState(false)

  // For Delete confirm dialog
  const [showDelete, setShowDelete] = useState(false)
  //const [showHandler, setShowHandler] = useState(false)
  const [showOnRotation, setShowOnRotation] = useState(false)

  // Over States
  const [isUploadMouseEnter, setIsUploadMouseEnter] = useState(false)
  const [isDeleteMouseEnter, setIsDeleteMouseEnter] = useState(false)
  const [isFrontMouseEnter, setIsFrontMouseEnter] = useState(false)
  const [isBackMouseEnter, setIsBackMouseEnter] = useState(false)
  const [isMoreMouseEnter, setIsMoreMouseEnter] = useState(false)
  const [isProxMouseEnter, setIsProxMouseEnter] = useState(false)
  const [isScaleRotateMouseEnter, setIsScaleRotateMouseEnter] = useState(false)
  const [isStopWatchMouseEnter, setIsStopWatchMouseEnter] = useState(false)

  _contentDialogOpen = showUploadOption
  const mDeleteTimer = setTimeout(function() {
    clearTimeout(mDeleteTimer)
   _contentDeleteDialogOpen = showDelete
  }, 500)

  // For Stop Watch
  const stopWatchToggle = useObserver(() => props.content.stopWatchToggle)
  const stopWatchReset = useObserver(() => props.content.stopWatchReset)
  const showHandler = useObserver(() => props.content.scaleRotateToggle)
  _contenHandler = showHandler
  const [time, setTime] = useState(0);
  // Delte Message
  const _msgTitle = (props.content.shareType === 'img' ? ' Image?' : (props.content.shareType === 'zoneimg' ? ' Chat Zone?' : ' Text?'))
  // For Ping Location
  const [pingLocation, setPingLocation] = useState(false)


  /* console.log(props.content.zone, " ZONE CHECK") */
  if(props.content.zone === undefined) {
    if(props.content.shareType === "zoneimg") {
      props.content.zone = "close"
    } else {
      props.content.zone = undefined
    }
  }


  useEffect(  //  update pose
    ()=> {
      member.dragCanceled = true
     /*  if (!_.isEqual(size, props.content.size)) {
        setSize(_.cloneDeep(props.content.size))
      }
      if (!_.isEqual(pose, props.content.pose)) {
        setPose(_.cloneDeep(props.content.pose))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.content], */
    // Resizing the elments
      ////////////////////////////////////////////////////////////////////////////
        //console.log(props.content.size[0])
        if(props.content.scaleRotateToggle) {
          if(props.content.size[0] < 80 || props.content.size[1] < 80) {
            setSize([props.content.size[0] + (150-props.content.size[0]), props.content.size[1] + (150 - props.content.size[1])])
          }
          updateHandler()
        }
        ////////////////////////////////////////////////////////////////////////////
      // Working Code
      if (props.content.showStopWatch && stopWatchToggle === false && stopWatchReset === false) {
        // +global.setInterval()
        member.intervalStep = window.setInterval(() => {
          setTime((time) => time + 10);
        }, 10);
      } else if(stopWatchReset) {
        setTime(0)
        window.clearInterval(member.intervalStep);
      } else {
        window.clearInterval(member.intervalStep);
      }
      if(props.content.shareType !== "img") {
        window.clearTimeout(member._timer)
        //member._timer = window.setTimeout( function() {
        const _mTimer = setTimeout( function() {
          clearTimeout(_mTimer)
          if(showTitle === true) return
            contextMenuStatus = false
            setShowTitle(false)
        }, 2)
      }
      if (!_.isEqual(size, props.content.size)) {
        setSize(_.cloneDeep(props.content.size))
      }
      if (!_.isEqual(pose, props.content.pose)) {
        setPose(_.cloneDeep(props.content.pose))
      }

    return () => {
      //clearInterval(member.intervalStep);
      window.clearInterval(member.intervalStep)
    };


    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.content, props.content.showStopWatch, props.content.stopWatchToggle],
  )


  function setPoseAndSizeToRnd(){
    if (rnd.current) { rnd.current.resizable.orientation = pose.orientation + map.rotation }
    const titleHeight = showTitle ? TITLE_HEIGHT : 0
    rnd.current?.updatePosition({x:pose.position[0], y:pose.position[1] - titleHeight})
    rnd.current?.updateSize({width:size[0], height:size[1] + titleHeight})
  }
  useLayoutEffect(  //  reflect pose etc. to rnd size
    () => {
      setPoseAndSizeToRnd()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pose, size, showTitle, map.rotation],
  )

  //  handlers
  function stop(ev:MouseOrTouch|React.PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
  }
  /* function onClickShare(evt: MouseOrTouch) {
    stop(evt)
    props.onShare?.call(null, evt)
  } */

  /* function onClickClose(evt: MouseOrTouch) {
    stop(evt)
    props.onClose?.call(null, evt)
  } */
  function onClickClose(evt: MouseOrTouch) {
    stop(evt)
    //props.onClose?.call(null, evt)
    onLeaveIcon()
    setShowDelete(true)
  }
  /* function onClickEdit(evt: MouseOrTouch) {
    stop(evt)
    setEditing(!editing)
  } */
  /* function onClickMoveToTop(evt: MouseOrTouch) {
    stop(evt)
    moveContentToTop(props.content)
    props.updateAndSend(props.content)
  }
  function onClickMoveToBottom(evt: MouseOrTouch) {
    stop(evt)
    moveContentToBottom(props.content)
    props.updateAndSend(props.content)
  } */
  function onClickMoveToTop(evt: MouseOrTouch) {
    stop(evt)
    moveContentToTop(props.content)
    props.updateAndSend(props.content)
    onLeaveIcon()
  }
  function onClickMoveToBottom(evt: MouseOrTouch) {
    stop(evt)
    moveContentToBottom(props.content)
    props.updateAndSend(props.content)
    onLeaveIcon()
  }
  /* function onClickPin(evt: MouseOrTouch) {
    stop(evt)
    props.content.pinned = !props.content.pinned
    props.updateAndSend(props.content)
  } */
  function onClickUploadZone(evt: MouseOrTouch) {
    onLeaveIcon()
    setShowUploadOption(true)
  }
  function onClickScaleRotate(evt: MouseOrTouch) {
    stop(evt)

    props.content.scaleRotateToggle = !props.content.scaleRotateToggle
    props.content.pinned = !props.content.pinned
    props.updateAndSend(props.content)
    /* if(showOnRotation) {
      setShowOnRotation(false)
    } */
    onLeaveIcon()
  }

  function onClickStopWatch(evt:MouseOrTouch) {
    //console.log("On CLICK")
    /* if(showStopWatch) {
      setTime(0)
      setShowStopWatch(false)
      setIsPaused(true)
    } else {
      setShowStopWatch(true)
      setIsPaused(false)
    } */
    /* stop(evt)
    props.content.showStopWatch = !props.content.showStopWatch
    console.log(props.content.showStopWatch, " props.content.showStopWatch")
    props.updateAndSend(props.content)
    setIsPaused(!isPaused) */
    stop(evt)
    member._down = false
    //props.content.zone = !props.content.zone
    if(props.content.showStopWatch) {
      props.content.showStopWatch = false
      props.content.stopWatchToggle = true
      props.content.stopWatchReset = true
      //setTime(0)
      //setIsPaused(true)
    } else {
      props.content.showStopWatch = true
      props.content.stopWatchToggle = false
      props.content.stopWatchReset = false
      //setIsPaused(false)
    }
    props.updateAndSend(props.content)
    onLeaveIcon()
  }

  function onClickZone(evt: MouseOrTouch) {
    stop(evt)
    member._down = false
    //props.content.zone = !props.content.zone

    if(props.content.zone === "open"){
      props.content.zone = "close"
    } else {
      if (props.content.shareType === "img") {
          if(props.content.zone === undefined) {
            props.content.zone = "close"
          } else {
            props.content.zone = undefined
          }
      } else {
        props.content.zone = "open"
      }
    }


    //onLeaveIcon()
    props.updateAndSend(props.content)
    onLeaveIcon()
  }

  /* function onClickCopy(evt: MouseOrTouch){
    stop(evt)
    copyContentToClipboard(props.content)
  }
  function onClickMaximize(evt: MouseOrTouch){
    stop(evt)
    if (map.zoomed){
      map.restoreZoom()
    }else{
      map.zoomTo(props.content)
    }
  } */
  /* function onClickMore(evt: MouseOrTouch){
    stop(evt)
    map.keyInputUsers.add('contentForm')
    setShowForm(true)
  }
  function onCloseForm(){
    setShowForm(false)
    if (props.content.pinned){
      setShowTitle(false)
    }
    map.keyInputUsers.delete('contentForm')
    props.updateAndSend(props.content)
  } */
  function onClickMore(evt: MouseOrTouch){
    stop(evt)
    map.keyInputUsers.add('contentForm')
    setShowForm(true)
    onLeaveIcon()
  }
  function onCloseForm(){
    setShowForm(false)
    if (props.content.pinned){
      contextMenuStatus = false
      setShowTitle(false)
    }
    map.keyInputUsers.delete('contentForm')
    props.updateAndSend(props.content)
  }
  function onLeaveIcon() {
    if(member._down) return
    member._down = false
    member._item = "DIV"
    window.clearTimeout(member._timer)

    showHideTimer(1)
  }

  function handleMouseEnter(event:MouseOrTouch) {
    //console.log("FIRED ON IN - ", member._down)

    //const upTimer = setTimeout(() => {
    //  console.log("FIRED ON IN - ", member._down)
    //  clearTimeout(upTimer)
    //  if(member._down) {
        let menuType = (Object(event.target)).id
        if(menuType === 'uploadDiv' || menuType === 'contextUpload') {
          setIsUploadMouseEnter(true)
        } else  if(menuType === 'deleteDiv' || menuType === 'contextDelete') {
          setIsDeleteMouseEnter(true)
        } else  if(menuType === 'moreDiv' || menuType === 'contextMore') {
          setIsMoreMouseEnter(true)
        } else  if(menuType === 'frontDiv' || menuType === 'contextFlipFront') {
          setIsFrontMouseEnter(true)
        } else  if(menuType === 'backDiv' || menuType === 'contextFlipBack') {
          setIsBackMouseEnter(true)
        } else  if(menuType === 'proxDiv' || menuType === 'contextProx') {
          console.log("CALLED ENTER")
            setIsProxMouseEnter(true)
        } else if(menuType === 'scaleRotateDiv' || menuType === 'contextScaleRotate') {
          setIsScaleRotateMouseEnter(true)
        } else if(menuType === 'stopWatchDiv' || menuType === 'contextStopWatch') {
          setIsStopWatchMouseEnter(true)
        }
     // }
    //}, 250)
  }

  function handleMouseOut(event:MouseOrTouch) {
    //console.log("FIRED ON OUT - ", member._down)
    //const downTimer = setTimeout(() => {
    //  console.log("FIRED ON OUT - ", member._down)
    //  clearTimeout(downTimer)
    //  if(member._down) {
        let menuType = (Object(event.target)).id
        if(menuType === 'uploadDiv' || menuType === 'contextUpload') {
          setIsUploadMouseEnter(false)
        } else  if(menuType === 'deleteDiv' || menuType === 'contextDelete') {
          setIsDeleteMouseEnter(false)
        } else  if(menuType === 'moreDiv' || menuType === 'contextMore') {
          setIsMoreMouseEnter(false)
        } else  if(menuType === 'frontDiv' || menuType === 'contextFlipFront') {
          setIsFrontMouseEnter(false)
        } else  if(menuType === 'backDiv' || menuType === 'contextFlipBack') {
          setIsBackMouseEnter(false)
        } else  if(menuType === 'proxDiv' || menuType === 'contextProx') {
          console.log("CALLED OUT")
            setIsProxMouseEnter(false)
        } else if(menuType === 'scaleRotateDiv' || menuType === 'contextScaleRotate') {
          setIsScaleRotateMouseEnter(false)
        } else if(menuType === 'stopWatchDiv' || menuType === 'contextStopWatch') {
          setIsStopWatchMouseEnter(false)
        }
      //}
    //}, 250)
  }

  function updateHandler() {
    if (JSON.stringify(pose) !== JSON.stringify(props.content.pose) ||
      JSON.stringify(size) !== JSON.stringify(props.content.size)) {
      props.content.size = [...size] //  Must be new object to compare the pose or size object.
      props.content.pose = {...pose} //  Must be new object to compare the pose or size object.
      props.updateAndSend(props.content)

      setShowOnRotation(false)
    }
  }

  //  drag for title area
  function dragHandler(delta:[number, number], buttons:number, event:any) {
    if (member.dragCanceled){ return }
    const ROTATION_IN_DEGREE = 360
    const ROTATION_STEP = 15
    if (buttons === MOUSE_RIGHT) {
      setPreciseOrientation((preciseOrientation + delta[0] + delta[1]) % ROTATION_IN_DEGREE)
      let newOri
      if (event?.shiftKey || event?.ctrlKey) {
        newOri = preciseOrientation
      }else {
        newOri = preciseOrientation - preciseOrientation % ROTATION_STEP
      }
      //    mat.translateSelf(...addV2(props.pose.position, mulV(0.5, size)))
      const CENTER_IN_RATIO = 0.5
      const center = addV2(pose.position, mulV(CENTER_IN_RATIO, size))
      pose.position = addV2(pose.position,
                            subV2(rotateVector2DByDegree(pose.orientation - newOri, center), center))
      pose.orientation = newOri
      setPose(Object.assign({}, pose))
    }else {
      const lv = map.rotateFromWindow(delta)
      const cv = rotateVector2DByDegree(-pose.orientation, lv)
      pose.position = addV2(pose.position, cv)
      setPose(Object.assign({}, pose))
    }
  }

  function hindleClickStatus() {

    //console.log(member.clickStatus, " STATUS")

    if(member.clickStatus === 'single') {
      if(member.clickEnter) {return}
     // if(pingLocation) {return}
     //if(member.isMoved) {return}
     if(isCanvasMoved()) {return}
     if(showDelete) {return}
     //if(member.OnTimerClick) {return}
     //console.log(showOnRotation, " onRota icon")
     if(showOnRotation) {return}
     if(showHandler) {return}
     if(pingLocation) {}
      pingEnable = false
      member.clickStatus = ''
      participants.local.pingIcon = false
      participants.local.pingX = 0
      participants.local.pingY = 0
      setPingLocation(false)
      const moveTimer = setTimeout(() =>{
        clearTimeout(moveTimer)
        //console.log(member.isMoved)
        if(member.isMoved) {return}
        function moveParticipant(move:boolean) {
          const local = participants.local
          //const diff = subV2(map.mouseOnMap, local.pose.position)
          const diff = subV2([member.moveX, member.moveY], local.pose.position)
          if (normV(diff) > PARTICIPANT_SIZE / 10) {
            const dir = mulV2(normV(diff)/5 / normV(diff), diff)
            local.pose.orientation = Math.atan2(dir[0], -dir[1]) * 180 / Math.PI
            if (move) {
              local.pose.position = addV2(local.pose.position, dir)
            } else {
              setShowBorder(true)
            // Start Timer to disable border
            window.clearTimeout(member._borderTimer)
            showHideBorder()
            }
            local.savePhysicsToStorage(false)
            const TIMER_INTERVAL = move ? 0 : 0
            setTimeout(() => { moveParticipant(true) }, TIMER_INTERVAL)
          }
        }
        moveParticipant(false)
      }, 0)
    } else if(member.clickStatus === 'double') {
      if(_contentDeleteDialogOpen) {return}
      window.clearTimeout(member.hidePinIcon)
      pingEnable = true
      setPingLocation(true)
      participants.local.pingX = member.pingX
      participants.local.pingY = member.pingY
      participants.local.pingIcon = true
      member.hidePinIcon = window.setTimeout(() => {
        window.clearTimeout(member.hidePinIcon)
        member.clickStatus = ''
        participants.local.pingIcon = false
        participants.local.pingX = 0
        participants.local.pingY = 0
        pingEnable = false
        setPingLocation(false)
      }, 3000)
    } else if(member.clickStatus === 'toggleTimer') {
      //console.log("toggleTimer")
      member.clickStatus = ''
      //if(isPaused) {
      if(props.content.stopWatchToggle) {
        props.content.stopWatchToggle = false
        props.content.stopWatchReset = false
        //setIsPaused(false)
      } else {
        props.content.stopWatchToggle = true
        props.content.stopWatchReset = false
        //setIsPaused(true)
      }
      props.updateAndSend(props.content)
    } else if(member.clickStatus === "resetTimer") {
      member.clickStatus = ''
      //setIsPaused(true)
      //setTime(0)
      props.content.stopWatchToggle = true
      props.content.stopWatchReset = true
      props.updateAndSend(props.content)
    }
  }

  //const isFixed = (props.autoHideTitle && props.content.pinned)
  const isFixed = (props.content.pinned)

  const stopTimeValue = ("0" + Math.floor((time / 60000) % 60)).slice(-2) + ":" + ("0" + Math.floor((time / 1000) % 60)).slice(-2) + ":" + ("0" + ((time / 10) % 100)).slice(-2)

  const handlerForTitle:UserHandlersPartial = {
    onWheel:(evt)=> {
      if(member._down) {
        if(showTitle) {
          member._down = false
          member._item = "DIV"
          window.clearTimeout(member._timer)
            showHideTimer(0)
        }
      }
    },
    onDoubleClick: (evt)=>{
      if (isContentEditable(props.content)){
        stop(evt)
        setEditing(!editing)
      }
    },
    onDrag: ({down, delta, event, xy, buttons,}) => {
      //  console.log('onDragTitle:', delta)
      isLocaked = props.content.pinned
      _isOnContent = true
      member._down = false

      if (isFixed) { return }
      if(showTitle) {return}

      event?.stopPropagation()
      if (down) {
        //  event?.preventDefault()
        dragHandler(delta, buttons, event)
      }
    },
    onDragStart: ({event, currentTarget, delta, buttons, xy}) => {   // to detect click

      event?.preventDefault()

      //  console.log(`dragStart delta=${delta}  buttons=${buttons}`)
      if(event?.type === "touchstart") {return}
      _isOnContent = true
      if(showTitle) {return}

      setDragging(true)
      member.buttons = buttons
      member.dragCanceled = false
      if (currentTarget instanceof Element && event instanceof PointerEvent){
        currentTarget.setPointerCapture(event?.pointerId)
      }

      member._checkForRotation = true
      member.onContent = true
      member._down = true
      member.downTime = new Date().getSeconds()
      member.moveX = map.mouseOnMap[0]
      member.moveY = map.mouseOnMap[1]
      window.clearTimeout(member._timer)
      member._clickX = xy[0]
      member._clickY = xy[1]
      // Storing zIndex
      member._zIndex = Number(props.content.zIndex)
      //////////////////////////////////////////////
      const mMenuTimer =  setTimeout(function() {
        //console.log("MOVING -- ", member._down, " --- ", _contentDeleteDialogOpen, " IN DRAG ", dblTouchTapCount)
        clearTimeout(mMenuTimer)
        if(member._down && showTitle === false && showOnRotation === false && _contentDeleteDialogOpen === false && dblTouchTapCount === 0) {
          const diff = subV2(map.mouseOnMap, pose.position)
          member.downPos = Number(diff[1])
          member.downXPos = Number(diff[0])
          contextMenuStatus = true
          setShowTitle(true)
        }
      }, 500)
    },
    onDragEnd: ({event, currentTarget, delta, buttons, xy}) => {
      //  console.log(`dragEnd delta=${delta}  buttons=${buttons}`)
      _isOnContent = false
      isLocaked = false
      member._down = false
      member._item = "DIV"
      window.clearTimeout(member._timer)
      if(String(Object(event?.target).nodeName)==="DIV") {
        showHideTimer(0)
      } else {
        showHideTimer(1)
      }


      //console.log(showTitle, " ---- ", checkContentsInEdit())


      if(showTitle) {return}

      let isEdit = checkContentsInEdit()
      if(isEdit/*  && member._checkForRotation */) {
        ExitAllFromEditMode()
        return
      }

      setDragging(false)
      if (!member.dragCanceled){ updateHandler() }
      member.dragCanceled = false

      if (currentTarget instanceof Element && event instanceof PointerEvent){
        currentTarget.releasePointerCapture(event?.pointerId)
      }
      if (!map.keyInputUsers.size && member.buttons === MOUSE_RIGHT){ //  right click
        //setShowForm(true)
        //map.keyInputUsers.add('contentForm')
      }
      member.buttons = 0
      if(props.content.scaleRotateToggle && member._checkForRotation) {
        member._checkForRotation = false
        RotateContent()
        updateHandler()
        return
      }
      let yCheck = props.content.size[1] - (map.mouseOnMap[1] - props.content.pose.position[1]) //participants.local.mouse.position[1]
      let xCheck = props.content.size[0] - (props.content.size[0] - (map.mouseOnMap[0] - props.content.pose.position[0]))
      if (event?.detail === 1) {
        //console.log(member.OnTimerClick , " onTimer")
        //console.log(member._down, " down")
        //if(yCheck > -45 && yCheck < - 20) {
        //if(yCheck > 5 && yCheck < 35 && xCheck > 7 && xCheck < 110) {
        if(yCheck > 5 && yCheck < 35 && xCheck > (props.content.size[0]/2 - 55) && xCheck < props.content.size[0]/2 + 55) {
        //if(diff[0] >= startXPos && diff[0] <= endXPos && diff[1] >= startYPos && diff[1] <= endYPos) {
          member.clickStatus = 'toggleTimer'
          //console.log("onTimer click")
        } else {
          member.clickStatus = 'single'
        }
      } else if (event?.detail === 2) {
        //if(yCheck > -45 && yCheck < - 20) {
        //if(yCheck > 5 && yCheck < 35 && xCheck > 7 && xCheck < 110) {
          if(yCheck > 5 && yCheck < 35 && xCheck > (props.content.size[0]/2 - 55) && xCheck < props.content.size[0]/2 + 55) {
          //if(diff[0] >= startXPos && diff[0] <= endXPos && diff[1] >= startYPos && diff[1] <= endYPos) {
          member.clickStatus = 'resetTimer'
        } else {
          member.clickStatus = "double"
          /* member.pingX = map.mouseOnMap[0]
          member.pingY = map.mouseOnMap[1] */
          member.pingX = participants.local.mouse.position[0] - participants.local.pose.position[0]
          member.pingY = participants.local.mouse.position[1]-participants.local.pose.position[1]
        }
      }
      member.clickEnter = true
      const timer = setTimeout(() => {
        clearTimeout(timer);
        //if(member.OnTimerClick) {return}
        if(member.clickEnter) {
          member.clickEnter = false
            hindleClickStatus()
        }
      }, 220)
    },
    onMove:({event, xy}) => {
      if(showTitle) {return}
      if(event?.type === 'mousemove' && !isSmartphone() === true) {
        member.isMoved = true
      } else {
        member.isMoved = false
      }
      //isLocaked = props.content.pinned
      const diff = subV2([xy[0], xy[1]], pose.position)
      member.downPos = Number(diff[1])
      member.downXPos = Number(diff[0])
      //if(participants.local.trackStates.pingIcon === false) {
        map.setMouse(xy)
      //}
    },
    onPointerUp: (arg) => { if(editing) {arg.stopPropagation()} },
    onPointerDown: (arg) => { if(editing) {arg.stopPropagation()} },
    onTouchMove :(e) => {
      e.preventDefault()

      member.isMoved = true
      member.movePos = Number(map.mouseOnMap[1])
      member.moveXPos = Number(map.mouseOnMap[0])
      //console.log(member.downXPos, " --- ", member.moveXPos)
      if((member.moveXPos >= (member.downXPos-20) && member.moveXPos <= (member.downXPos+20) && (member.movePos >= (member.downPos-20) && member.movePos <= (member.downPos+20)))) {
        member._down = true
        member._checkForRotation = true
      } else {
        member._down = false
        member._checkForRotation = false
      }
    },
    onMouseUp: (arg) => {
      if(editing) {
        arg.stopPropagation()
      } else {
        if(arg.button > 0) {return}

        member.onContent = false

        //_isOnContent = true

        member.isMoved = false
        member.upTime = new Date().getSeconds()
        let diffTime = member.upTime - member.downTime
        //console.log(diffTime, " diffTi")
        if(diffTime < 2 && String(Object(arg.target).tagName) === "DIV" && showTitle === false) {
          if(member._down === false || showTitle) return
        } else {
        }
      }
    },
    onMouseMove: (arg) => {
      //if(isSmartphone()) {return}
      isLocaked = props.content.pinned
      if(showTitle) {return}
      member.movePos = Number(map.mouseOnMap[1])
      member.moveXPos = Number(map.mouseOnMap[0])
      //console.log(member.downXPos, " --- ", member.moveXPos)
      if((member.moveXPos >= (member.downXPos-20) && member.moveXPos <= (member.downXPos+20) && (member.movePos >= (member.downPos-20) && member.movePos <= (member.downPos+20)))) {
        member._down = true
        member._checkForRotation = true
      } else {
        member._down = false
        member._checkForRotation = false
      }
    },
    onMouseOver: (arg) => {
      _isOnContent = true
      // new props
      member._onContentForEdit = true

      member._item = String(Object(arg.target).tagName)
      window.clearTimeout(member._timer)
    },
    onMouseOut: (arg) => {
      if(showTitle) {return}
      // use it
      _isOnContent = false
      // new props
      member._onContentForEdit = false
      member.onContent = false
      isLocaked = false
    },
    /* onMouseDown: (arg) => { if(editing) {arg.stopPropagation()} }, */
    onTouchStart: (arg) => {
      if(editing) {arg.stopPropagation() }
      //console.log(arg.type, " onTYPE")
      var touch = arg.touches[0];
      _isOnContent = true
      if(showTitle) {return}
      //if(dblTouchTapCount > 0) {return}
      setDragging(true)
      member.dragCanceled = false
      /////////////////////////////////////////////
      // SetMouse Pose with map canvas
      member.isMoved = false
      const diff = subV2([touch.clientX, touch.clientY], pose.position)
      member.downPos = Number(diff[1])
      member.downXPos = Number(diff[0])
      map.setMouse([touch.clientX, touch.clientY])
      //////////////////////////////////////////////
      //member.touchStart = 0
      //member.touchEnd = 0
      //member.touchStart = new Date().getMilliseconds()
      //////////////////////////////////////////////
      member._checkForRotation = true
      member.onContent = true
      member._down = true
      member.downTime = new Date().getSeconds()
      member.moveX = map.mouseOnMap[0]
      member.moveY = map.mouseOnMap[1]
      window.clearTimeout(member._timer)
      member._clickX = touch.clientX
      member._clickY = touch.clientY
      // Storing zIndex
      member._zIndex = Number(props.content.zIndex)
      //console.log("MOVING INIT -- ", member._down, " --- ", _contentDeleteDialogOpen, " --- ", member.touchEnd)
      //////////////////////////////////////////////
      const mMenuTimer =  setTimeout(function() {
        //console.log("MOVING END -- ", member._down, " --- ", _contentDeleteDialogOpen, " >> ", member.touchEnd)
        clearTimeout(mMenuTimer)
        //if(dblTouchTapCount === 2) {return}
        //alert(member._down)
        //console.log(showHandler, " showHandler")
        let canvasStat = isCanvasMoved()
        if(showTitle === false && showHandler === false && _contentDeleteDialogOpen === false && dblTouchTapCount === 0) {
          if(canvasStat) {return}
          const diff = subV2(map.mouseOnMap, pose.position)
          member.downPos = Number(diff[1])
          member.downXPos = Number(diff[0])
          contextMenuStatus = true
          setShowTitle(true)
        }
      }, 500)
    },
    /* onTouchEnd: (arg) => { if(editing) {arg.stopPropagation()} }, */
    onTouchEnd:(e) => {
      member._down = false
      _isOnContent = false
      member.isMoved = false
      var changedTouch = e.changedTouches[0];
      var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
        dblTouchTapCount ++
        //console.log(dblTouchTapCount, " checking DBLCLick")
        const dblClick = setTimeout(function () {
          clearTimeout(dblClick)
          if(dblTouchTapCount === 2) {
            //console.log('doubleClick')
            member.clickStatus = "double"
            member.pingX = participants.local.mouse.position[0] - participants.local.pose.position[0]
            member.pingY = participants.local.mouse.position[1]-participants.local.pose.position[1]
          } else if(dblTouchTapCount === 1) {
            //console.log("single click")
          }
          const resetCounter = setTimeout(function() {
            clearTimeout(resetCounter)
            dblTouchTapCount = 0
          }, 700)
        }, 250)

        ////////////////////////////////////////////////////////////////////
        if(elem?.nodeName === "IMG" && elem?.id === "contextUpload") {
          onLeaveIcon()
          setShowUploadOption(true)
        } else if(elem?.nodeName === "IMG" && elem?.id === "contextDelete") {
          onLeaveIcon()
          setShowDelete(true)
        } else if(elem?.nodeName === "IMG" && elem?.id === "contextMore"){
          onLeaveIcon()
          map.keyInputUsers.add('contentForm')
          setShowForm(true)

        } else if(elem?.nodeName === "IMG" && elem?.id === "contextProx") {
          member._down = false
          //props.content.zone = !props.content.zone
          if(props.content.zone === "open"){
            props.content.zone = "close"
          } else {
            if(props.content.shareType === "img") {
                if(props.content.zone === undefined) {
                  props.content.zone = "close"
                } else {
                  props.content.zone = undefined
                }
              } else {
                props.content.zone = "open"
            }
          }
          props.updateAndSend(props.content)
          onLeaveIcon()
        } else if(elem?.nodeName === "IMG" && elem?.id === "contextFlipBack") {
          moveContentToBottom(props.content)
          props.updateAndSend(props.content)
          onLeaveIcon()
        } else if(elem?.nodeName === "IMG" && elem?.id === "contextFlipFront") {
          moveContentToTop(props.content)
          props.updateAndSend(props.content)
          onLeaveIcon()
        } else if((elem?.nodeName === "svg" || elem?.nodeName === "IMG") && elem?.id === "contextScaleRotate") {
          props.content.scaleRotateToggle = !props.content.scaleRotateToggle
          props.content.pinned = !props.content.pinned
          props.updateAndSend(props.content)
          onLeaveIcon()
        } else if((elem?.nodeName === "svg" || elem?.nodeName === "path" || elem?.nodeName === "svg" || elem?.nodeName === "DIV" || elem?.nodeName === "IMG") && elem?.id === "contextStopWatch") {
          member._down = false
          if(props.content.showStopWatch) {
            props.content.showStopWatch = false
            props.content.stopWatchToggle = true
            props.content.stopWatchReset = true
          } else {
            props.content.showStopWatch = true
            props.content.stopWatchToggle = false
            props.content.stopWatchReset = false
          }
          props.updateAndSend(props.content)
          onLeaveIcon()
        } else if(elem?.nodeName === "DIV") {
            showHideTimer(0)
        }
      //}
    },
  }

  function checkContentsInEdit():boolean {
    let isEdit:boolean = false
    if(props.stores.contents.all.length > 0) {
      for(let i:number=0; i<props.stores.contents.all.length; i++) {
        if(props.stores.contents.all[i].scaleRotateToggle && props.stores.contents.all[i].id !== props.content.id) {
          isEdit = true
        }
      }
    }
    return isEdit
  }

  function ExitAllFromEditMode() {
    if(props.stores.contents.all.length > 0) {
      for(let i:number=0; i<props.stores.contents.all.length; i++) {
        if(props.stores.contents.all[i].scaleRotateToggle && props.stores.contents.all[i].id !== props.content.id) {
          props.stores.contents.all[i].scaleRotateToggle = !props.stores.contents.all[i].scaleRotateToggle
        }
        if(props.stores.contents.all[i].pinned === false && props.stores.contents.all[i].id !== props.content.id) {
          props.stores.contents.all[i].pinned = true
        }
        props.stores.contents.updateByLocal(props.stores.contents.all[i])
      }
    }
  }

  function RotateContent() {
    const ROTATION_IN_DEGREE = 360
    const ROTATION_STEP = 90
    setPreciseOrientation((preciseOrientation + 0 + 2) % ROTATION_IN_DEGREE)
    //console.log(pose.orientation, " preciseOrientation")
    let newOri = pose.orientation + ROTATION_STEP
    //    mat.translateSelf(...addV2(props.pose.position, mulV(0.5, size)))
    const CENTER_IN_RATIO = 0.5
    const center = addV2(pose.position, mulV(CENTER_IN_RATIO, size))
    pose.position = addV2(pose.position,
                          subV2(rotateVector2DByDegree(pose.orientation - newOri, center), center))
    pose.orientation = newOri
    if(pose.orientation === 360) {
      pose.orientation = 0
    }
    setPose(Object.assign({}, pose))
  }

  function showHideBorder() {
    //member._borderTimer = window.setTimeout( function() {
    const _bTimer = setTimeout( function() {
      clearTimeout(_bTimer)
      setShowBorder(false)
     }, BORDER_TIMER_DELAY)
  }
  function showHideTimer(_delay:number) {
    const _mTimer = setTimeout( function() {
      //window.clearTimeout(member._timer)
      clearTimeout(_mTimer)
      contextMenuStatus = false
      setShowTitle(false)

      // Reset All menu init color
      /* setIsUploadMouseEnter(false)
      setIsDeleteMouseEnter(false)
      setIsFrontMouseEnter(false)
      setIsBackMouseEnter(false)
      setIsMoreMouseEnter(false)
      setIsProxMouseEnter(false)
      setIsProxMouseEnter(false)*/

    }, (_delay * 1000))
  }



  const handlerForContent:UserHandlersPartial = Object.assign({}, handlerForTitle, {eventOptions:{passive:false}})
  handlerForContent.onDrag = (args: FullGestureState<'drag'>) => {
    //  console.log('onDragBody:', args.delta)
    if (isFixed || map.keyInputUsers.has(props.content.id)) { return }
    handlerForTitle.onDrag?.call(this, args)
  }

  function onResizeStart(evt:React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>){
    if(showTitle) {return}
    member.dragCanceled = false
    evt.stopPropagation(); evt.preventDefault()
    setResizeBase(size)
    setResizeBasePos(pose.position)
  }
  function onResizeStop(){
    if(showTitle) {return}
    if (!member.dragCanceled){ updateHandler() }
    member.dragCanceled = false
  }
  function onResize(evt:MouseEvent | TouchEvent, dir: any, elem:HTMLDivElement, delta:any, pos:any) {
    if(showTitle) {return}
    evt.stopPropagation(); evt.preventDefault()
    //  console.log(`dragcancel:${member.dragCanceled}`)
    if (member.dragCanceled) {
      setPoseAndSizeToRnd()
      return
    }

    const scale = (extractScaleX(map.matrix) + extractScaleY(map.matrix)) / 2
    const cd:[number, number] = [delta.width / scale, delta.height / scale]
    // console.log('resize dir:', dir, ' delta:', delta, ' d:', d, ' pos:', pos)
    /* if (dir === 'left' || dir === 'right') {
      cd[1] = 0
    }
    if (dir === 'top' || dir === 'bottom') {
      cd[0] = 0
    } */
    let posChange = false
    const deltaPos: [number, number] = [0, 0]

    /* if (dir === 'left' || dir === 'topLeft' || dir === 'bottomLeft') {
      deltaPos[0] = -cd[0]
      posChange = posChange || cd[0] !== 0
    }
    if (dir === 'top' || dir === 'topLeft' || dir === 'topRight') {
      deltaPos[1] = -cd[1]
      posChange = posChange || cd[1] !== 0
    } */

    if (dir === 'bottomLeft') {
      deltaPos[0] = -cd[0]
      posChange = posChange || cd[0] !== 0
    } else
    if (dir === 'topRight') {
      deltaPos[1] = -cd[1]
      posChange = posChange || cd[1] !== 0
    }
    if (dir === 'topLeft') {
      deltaPos[1] = -cd[1]
      posChange = posChange || cd[1] !== 0
    }

    if (posChange) {
      pose.position = addV2(resizeBasePos, deltaPos)
      setPose(Object.assign({}, pose))
      //console.log(`setPose ${pose.position}`)
    }
    const newSize = addV2(resizeBase, cd)
    if(newSize[0] > 80 && newSize[1] > 80) {
      if (props.content.originalSize[0]) {
        const ratio = props.content.originalSize[0] / props.content.originalSize[1]
        if (newSize[0] > ratio * newSize[1]) { newSize[0] = ratio * newSize[1] }
        if (newSize[0] < ratio * newSize[1]) { newSize[1] = newSize[0] / ratio }
      }
      setSize(newSize)
    } else {
      updateHandler()
    }
  }

  //const classes = useStyles({props, pose, size, showTitle, pinned:props.content.pinned, dragging, editing})
  const classes = useStyles({props, pose, size, showTitle, showBorder, pinned:props.content.pinned, dragging, editing, downPos:member.downPos, downXPos:member.downXPos, _down:member._down, _title:titleDisplay, pingX:member.pingX, pingY:member.pingY, uploadMouseEnter:isUploadMouseEnter, deleteMouseEnter:isDeleteMouseEnter, frontMouseEnter:isFrontMouseEnter, backMouseEnter:isBackMouseEnter, moreMouseEnter:isMoreMouseEnter, proxMouseEnter:isProxMouseEnter, scaleRotateMouseEnter:isScaleRotateMouseEnter, stopWatchMouseEnter:isStopWatchMouseEnter})
  //  console.log('render: TITLE_HEIGHT:', TITLE_HEIGHT)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const formRef = React.useRef<HTMLDivElement>(null)
  const gestureForContent = useGesture(handlerForContent)
  const gestureForTitle = useGesture(handlerForTitle)
  /* const theContent =
    <div className={classes.rndContainer} {...gestureForContent()}>
      <div className={classes.titlePosition} {...gestureForTitle()}>
        <div className={classes.titleContainer}
            onMouseEnter = {() => { if (props.autoHideTitle) { setShowTitle(true) } }}
            onMouseLeave = {() => {
              if (props.autoHideTitle && !editing && props.content.pinned) { setShowTitle(false) } }}
            onTouchStart = {() => {
              if (props.autoHideTitle) {
                if (!showTitle) {
                  setShowTitle(true)
                }else if (props.content.pinned) {
                  setShowTitle(false)
                }
              }
            }}
            onContextMenu = {() => {
              setShowForm(true)
              map.keyInputUsers.add('contentForm')
            }}
            >
          <div className={classes.type}>
            {contentTypeIcons(props.content.type, TITLE_HEIGHT, TITLE_HEIGHT*1.1)}
          </div>
          <Tooltip placement="top" title={props.content.pinned ? t('ctUnpin') : t('ctPin')} >
          <div className={classes.pin} onClick={onClickPin} onTouchStart={stop}>
            <Icon icon={props.content.pinned ? pinIcon : pinOffIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT*1.1} />
          </div></Tooltip>
          <Tooltip placement="top" title={editButtonTip(editing, props.content)} >
            <div className={classes.edit} onClick={onClickEdit} onTouchStart={stop}>
             {
              editing ? <DoneIcon style={{fontSize:TITLE_HEIGHT}} />
                : <EditIcon style={{fontSize:TITLE_HEIGHT}} />}
            </div>
          </Tooltip>
          {props.content.pinned ? undefined :
            <Tooltip placement="top" title={t('ctMoveTop')} >
              <div className={classes.titleButton} onClick={onClickMoveToTop}
                onTouchStart={stop}><FlipToFrontIcon /></div></Tooltip>}
          {props.content.pinned ? undefined :
            <Tooltip placement="top" title={t('ctMoveBottom')} >
              <div className={classes.titleButton} onClick={onClickMoveToBottom}
                onTouchStart={stop}><FlipToBackIcon /></div></Tooltip>}


          <Tooltip placement="top" title={t('ctCopyToClipboard')} >
            <div className={classes.titleButton} onClick={onClickCopy}
              onTouchStart={stop}>
                <Icon icon={clipboardCopy} height={TITLE_HEIGHT}/>
            </div>
          </Tooltip>
          {isContentMaximizable(props.content) ?
            <Tooltip placement="top" title={zoomed ? t('ctUnMaximize') : t('ctMaximize')} >
              <div className={classes.titleButton} onClick={onClickMaximize}
                onTouchStart={stop}>
                  <Icon icon={zoomed ? minimizeIcon: maximizeIcon} height={TITLE_HEIGHT}/>
              </div>
            </Tooltip> : undefined}
          <div className={classes.titleButton} onClick={onClickMore} onTouchStart={stop} ref={formRef}>
              <MoreHorizIcon />
          </div>
          <SharedContentForm open={showForm} {...props} close={onCloseForm}
            anchorEl={contentRef.current} anchorOrigin={{vertical:'top', horizontal:'right'}}
          />
          <div className={classes.note} onClick={onClickShare} onTouchStart={stop}>Share</div>
          {props.content.playback ? <div className={classes.close} ><PlayArrowIcon htmlColor="#0C0" /></div> :
            (props.content.pinned || isContentWallpaper(props.content)) ? undefined :
              <div className={classes.close} onClick={onClickClose} onTouchStart={stop}>
                <CloseRoundedIcon /></div>}
        </div>
      </div>
      <div className={classes.content} ref={contentRef}
        onFocus={()=>{
          if (doseContentEditingUseKeyinput(props.content) && editing){
            map.keyInputUsers.add(props.content.id)
          }
        }}
        onBlur={()=>{
          if (doseContentEditingUseKeyinput(props.content) && editing){
            map.keyInputUsers.delete(props.content.id)
          }
        }}
      >
        <Content {...props}/>
      </div>
    </div> */
  //  console.log('Rnd rendered.')

  const theContent =
    <div className={classes.rndContainer} {...gestureForContent()}>
      <div className={classes.content} ref={contentRef}
        onFocus={()=>{
          if (doseContentEditingUseKeyinput(props.content) && editing){
            map.keyInputUsers.add(props.content.id)
          }
        }}
        onBlur={()=>{
          if (doseContentEditingUseKeyinput(props.content) && editing){
            map.keyInputUsers.delete(props.content.id)
          }
        }}
      >
        <Content {...props}
        />
        {/* {console.log(props.content.pose.orientation, " ORIEN")} */}
        <div className={classes.nameContainerHolder}>
          <div className={classes.nameContainer}>{props.content.name}</div>
        </div>
        <div className={classes.stopWatchTitleHolder}>
          <div className={classes.stopWatchTitle}>{stopTimeValue}</div>
        </div>
        {/* <div className={showBorder ? classes.dashed : undefined}></div> */}
        <div className={(showHandler && showTitle === false) ? classes.dashedInEdit : (showBorder && (props.content.zone === 'close') ? classes.dashed : undefined)}></div>
{/* {showHandler ? */}
<div style={{position:'absolute', width:size[0], height:size[1], top:0, left:0/* , backgroundColor:'green' */}}
      >
        { (showHandler && showTitle === false) ?
        <div>
        <div style={{width:'40px', height:'40px'/* , border:'2px dashed  #FF000050' */, position:'absolute', left:'-10px', top:'-10px', backgroundColor:'#9e886c', borderRadius:'50%'}}>
          <Icon icon={crossIcon} style={{width:TITLE_HEIGHT/1.5, height:TITLE_HEIGHT/1.5, color:'white', position:'absolute', left:'9px', top:'9px'}} />
        </div>
        <div style={{width:'40px', height:'40px'/* , border:'2px dashed  #FF000050' */, position:'absolute', left:(size[0] - 30), top:'-10px', backgroundColor:'#9e886c', borderRadius:'50%'}}>
        <Icon icon={crossIcon} style={{width:TITLE_HEIGHT/1.5, height:TITLE_HEIGHT/1.5, color:'white', position:'absolute', left:'8.5px', top:'8px'}} />
        </div>
        <div style={{width:'40px', height:'40px'/* , border:'2px dashed  #FF000050' */, position:'absolute', left:(size[0] - 30) + 'px', top:(size[1] - 30) + 'px', backgroundColor:'#9e886c', borderRadius:'50%'}}
          /* onMouseOut={()=>{
            console.log("still over")
          }} */
          >
          <Icon icon={crossIcon} style={{width:TITLE_HEIGHT/1.5, height:TITLE_HEIGHT/1.5, color:'white', position:'absolute', left:'8px', top:'9px'}} />
        </div>
        {/* <div style={{width:(size[0] + 40), height:(size[1] + 40), position:'absolute', left: '-20px', top:'-20px', backgroundColor:'#D4D4D480', alignItems:'center' }}>
        </div> */}
        <div style={{width:'40px', height:'40px'/* , border:'2px dashed  #FF000050' */, position:'absolute', left:'-10px', top:(size[1] - 30) + 'px', backgroundColor:'#9e886c', borderRadius:'50%'}}>
          <Icon icon={crossIcon} style={{width:TITLE_HEIGHT/1.5, height:TITLE_HEIGHT/1.5, color:'white', position:'absolute', left:'9px', top:'9px'}} />
        </div>

        <div style={{width:'40px', height:'40px', /* border:'2px dashed  #FF000050', */ position:'absolute', left: (size[0]/2 - 20)/* (size[0]/2) - 15 */, top:(size[1]/2) - 20, backgroundColor:'#9e886c', borderRadius:'50%'}}
        >
        <RotateRightIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white', position:'absolute', left:'2px', top:'3px'}} />
        </div>
        </div>
        : ''}
      </div>
      </div>
      <div className={classes.titlePosition} {...gestureForTitle() /* title can be placed out of Rnd */}>
      <div className={classes.titleContainer}
           onMouseLeave = {() => {
          }}
            onContextMenu = {() => {
              setShowForm(true)
              map.keyInputUsers.add('contentForm')
            }}
            >
              <SharedContentForm open={showForm} {...props} close={onCloseForm}
            anchorEl={contentRef.current} anchorOrigin={{vertical:'top', horizontal:'right'}}
          />
            </div>

            {/* Dialog for deleting content confirmation */}
        {/* {showDelete ? */}
        <Dialog open={showDelete} onClose={() => setShowDelete(false)} onExited={() => setShowDelete(false)}
        keepMounted
        style={showDelete ? {zIndex:9999, transform:isSmartphone() ? 'scale(2)' : 'scale(1)'} : {zIndex:-9999, transform:isSmartphone() ? 'scale(2)' : 'scale(1)'}}
        BackdropProps={{ invisible: true }}
        >
          <DialogContent style={{userSelect: 'none', fontSize:'25px', fontWeight:'bold'}}>
            {
            t('deleteMsg') + _msgTitle
            }
          </DialogContent>
          <DialogActions>
            <Button variant="contained" /* color="secondary" */ style={{textTransform:'none', marginTop:'0.4em', backgroundColor:'orange', height:'40px', fontSize:'20px', fontWeight:'bold'}}
            onClick={(ev) => {
              setShowDelete(false)
              //_contentDeleteDialogOpen = false
            }}>{t('deleteNo')}</Button>
            <Button variant="contained" /* color="secondary" */ style={{textTransform:'none', marginTop:'0.4em', backgroundColor:'#7ececc', height:'40px', fontSize:'20px', fontWeight:'bold'}}
            onClick={(ev) => {
              setShowDelete(false)
              //_contentDeleteDialogOpen = false
              //stop(ev)
              props.onClose?.call(null, ev)
            }}>{t('deleteYes')}</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>


  return (
    <div className={classes.container} style={{zIndex:props.content.zIndex}} onContextMenu={
      (evt) => {
        evt.stopPropagation()
        evt.preventDefault()
      }
    }>

      {/* <Rnd className={classes.rndCls} enableResizing={isFixed ? resizeDisable : resizeEnable}
        disableDragging={isFixed} ref={rnd}
        onResizeStart = {onResizeStart}
        onResize = {onResize}
        onResizeStop = {onResizeStop}
      >
        {theContent}
      </Rnd> */}

      {(props.content.shareType !== 'roomimg' && props.content.shareType !== 'appimg') ?
        <Rnd className={classes.rndCls} enableResizing={showTitle ? resizeDisable : (showHandler ? resizeEnable : resizeDisable)}
        disableDragging={isFixed} ref={rnd}
       /*  disableDragging={showTitle} ref={rnd}
        disableDragging={false} ref={rnd} */
        onResizeStart = {onResizeStart}
        onResize = {onResize}
        onResizeStop = {onResizeStop}
        /* bounds = {'body'} */
        resizeHandleStyles={{
          topLeft: cursorStyles,
          topRight: cursorStyles,
          bottomLeft: cursorStyles,
          bottomRight: cursorStyles,
        }}
        dragHandleClassName={classes.cursorStyles}
        /* default={{
          x: 0,
          y: 0,
          width: props.content.size[0] * 1.5,
          height: props.content.size[1] * 1.5,
        }} */
      >
          {theContent}
      </Rnd> : ''}

      <ShareDialog {...props} open={showUploadOption} onClose={() => setShowUploadOption(false)} cordX={pose.position[0] + member.downXPos} cordY={pose.position[1] + member.downPos} origin={'contextmenu'} _type={'menu'}/>

      {/*  {showTitle ? */}
      <Dialog open={showTitle} onClose={() => setShowTitle(false)} onExited={() => setShowTitle(false)}
      keepMounted
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            position:'absolute',
            boxShadow: 'none',
            overflow:'hidden',
            //width:'600px',
            //height: '500px',
            //left: props.content.pose.position[0] - props.stores.map.mouseOnMap[0],
            //top:props.stores.map.mouseOnMap[1],
            left: Number(member._clickX) - 207,
            top: Number(member._clickY) - 170,
            zIndex: showTitle ? 999 : -999,
            transform: isSmartphone() ? 'scale(2.5)' : 'scale(1)',
          },
        }}
        BackdropProps={{ invisible: true }}
        >
        <DialogContent style={showTitle ? {transform:'scale(1.1)', transition:'0s ease-out'} : {transform:'scale(0)', transition:'0s ease-out'}}>
        {/* <Zoom in={showTitle} style={{ transitionDelay: showTitle ? '0ms' : '0ms' }}> */}
        <Zoom in={showTitle} style={{ transition: showTitle ? '500ms' : '0ms' }}>
          <div className={classes.titleContainer_dialog}
              onMouseLeave = {() => {
                //console.log("out from title - ", member.onContent)
                //member._item = "DIV"
                //clearTimeout(member._timer)
                //showHideTimer()
              }}
                onContextMenu = {() => {
                  //setShowForm(true)
                  //map.keyInputUsers.add('contentForm')
                }}
            >

           {/*  <Tooltip placement="top" title={member._down ? (props.content.pinned ? t('ctUnpin') : t('ctPin')) : ''}>
            <div className={classes.pin_dialog} onMouseUp={onClickPin} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
              <img src={props.content.pinned ? pinIcon : pinOffIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt="" />
            </div></Tooltip> */}


              <Tooltip placement="top" title={member._down ? t('ctMoveTop') : ''} >
                <div id='frontDiv' className={classes.moveTopButton_dialog} onMouseUp={onClickMoveToTop}
                  onTouchStart={stop} onMouseLeave={onLeaveIcon} /* onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} */>
                    <img id='contextFlipFront' src={FlipToFrontIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
                    </div></Tooltip>
              <Tooltip placement="top" title={member._down ? t('ctMoveBottom') : ''} >
                <div id='backDiv' className={classes.moveBottomButton_dialog} onMouseUp={onClickMoveToBottom}
                  onTouchStart={stop} onMouseLeave={onLeaveIcon} /* onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} */>
                    <img id='contextFlipBack' src={FlipToBackIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
                  </div></Tooltip>
            <Tooltip placement="top" title={member._down ? (props.content.zone === "close" ? t('ctUnProximity') : t('ctProximity')) : ''} >
            <div id='proxDiv' className={classes.prox_dialog} onMouseUp={onClickZone} onTouchStart={stop} /* onMouseLeave={onLeaveIcon} */ /* onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} */>
              <img id='contextProx' src={props.content.zone === "close" ? proximityOffIcon : proximityIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
            </Tooltip>
            <div id='moreDiv' className={classes.titleButton_dialog} onMouseUp={onClickMore} onTouchStart={stop} onMouseLeave={onLeaveIcon} /* onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} */ ref={formRef} >
                <img id='contextMore' src={MoreIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
            {/* <SharedContentForm open={showForm} {...props} close={onCloseForm}
              anchorEl={contentRef.current} anchorOrigin={{vertical:'top', horizontal:'right'}}
            /> */}
              <div id='deleteDiv' className={classes.close_dialog} onMouseUp={onClickClose} /* onTouchEnd={onClickClose} */ onTouchStart={stop} onMouseLeave={onLeaveIcon} /* onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} */>
                <img id='contextDelete' src={CloseIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
              </div>
            <Tooltip placement="bottom" title={member._down ? t('ctUploadZone') : ''} >
              <div id='uploadDiv' className={classes.uploadZone_dialog} onMouseUp={onClickUploadZone} /* onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} */
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  <img id='contextUpload' src={UploadShare} height={TITLE_HEIGHT}  onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} width={TITLE_HEIGHT} alt=""/>
              </div>
            </Tooltip>
            <Tooltip placement="top" title={member._down ? (props.content.showStopWatch ? t('ctStopWatchOff') : t('ctStopWatchOn')) : ''} >
              <div id='stopWatchDiv' className={classes.stopWatch_dialog} onMouseUp={onClickStopWatch}
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  {/* {props.content.showStopWatch ? <StopWatchOffIcon id='contextStopWatch' style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} /> :
                  <StopWatchOnIcon id='contextStopWatch' style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} />
                  } */}
                  <img id='contextStopWatch' src={StopWatchIcon} height={TITLE_HEIGHT}  onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} width={TITLE_HEIGHT} alt=""/>
              </div>
            </Tooltip>
            <Tooltip placement="top" title={member._down ? (props.content.scaleRotateToggle ? t('ctUnScaleRotate') : t('ctScaleRotate')) : ''} >
              <div id='scaleRotateDiv' className={classes.scaleRotate_dialog} onMouseUp={onClickScaleRotate}
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  {/* {props.content.scaleRotateToggle ? <AspectRatioIcon id='contextScaleRotate' onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} /> :
                  <AspectRatioIcon id='contextScaleRotate' onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} />
                  } */}
                  <img id='contextScaleRotate' src={AspectRatioIcon} height={TITLE_HEIGHT}  onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} width={TITLE_HEIGHT} alt=""/>
              </div>
            </Tooltip>

            <div className={showTitle ? classes.dashedCircle_dialog : undefined}></div>
          </div>
          </Zoom>
        </DialogContent>
        </Dialog>

    </div >
  )
}

/* const buttonStyle = {
  '&:hover': {
    backgroundColor: 'rosybrown',
  },
  '&:active': {
    backgroundColor: 'firebrick',
  },
}

const BORDER_WIDTH = 3

const useStyles = makeStyles({
  container: (props: StyleProps) => {
    const mat = new DOMMatrix()
    mat.rotateSelf(0, 0, props.pose.orientation)

    return ({
      display: props.props.hideAll ? 'none' : 'block',
      width:0,
      height:0,
      transform: mat.toString(),
      position: 'absolute',
    })
  },
  rndCls: (props: StyleProps) => ({
    borderRadius: props.showTitle ? '0.5em 0.5em 0 0' : '0 0 0 0',
    backgroundColor: props.props.content.noFrame ? 'rgba(0,0,0,0)' :
      settings.useTransparent ? 'rgba(200,200,200,0.5)' : 'rgba(200,200,200,1)',
    boxShadow: props.props.content.noFrame ? undefined :
      settings.useTransparent ? '0.2em 0.2em 0.2em 0.2em rgba(0,0,0,0.4)' :
        '0.2em 0.2em 0.2em 0.2em rgba(100,100,100,1)',
  }),
  rndContainer: (props: StyleProps) => ({
    width:'100%',
    height:'100%',
  }),
  titlePosition: (props:StyleProps) => (
    props.showTitle ?
    {}
    :
    {
      width:0,
      heihgt:0,
      position:'absolute',
      top:0,
    }
  ),
  titleContainer: (props:StyleProps) => {
    const rv:CreateCSSProperties = {
      display:'flex',
      width: props.size[0],
      overflow: 'hidden',
      userSelect: 'none',
      userDrag: 'none',
    }
    if (!props.showTitle) {
      rv['position'] = 'absolute'
      rv['bottom'] = 0
    }

    return rv
  },
  content: (props: StyleProps) => ({
    position: 'absolute',
    top: (props.showTitle ? TITLE_HEIGHT : 0) - (props.editing ? BORDER_WIDTH : 0),
    left: props.editing ? -BORDER_WIDTH : 0,
    width: props.size[0],
    height: props.size[1],
    userDrag: 'none',
    pointerEvents: props.dragging ? 'none' : 'auto',
    borderWidth: BORDER_WIDTH,
    borderColor: 'yellow',
    borderStyle: props.editing ? 'solid' : 'none',
    cursor: props.editing ? 'default' : undefined,
    opacity: props.props.content.opacity,
  }),
  note: (props:StyleProps) => (
    props.showTitle ? {
      visibility: props.props.onShare ? 'visible' : 'hidden',
      whiteSpace: 'pre',
      borderRadius: '0.5em 0 0 0',
      ...buttonStyle,
    } : {
      visibility: 'hidden',
    }),
  pin: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      whiteSpace: 'pre',
      cursor: 'default',
      ...buttonStyle,
    } : {display:'none'}
  ),
  titleButton: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      whiteSpace: 'pre',
      cursor: 'default',
      ...buttonStyle,
    } : {display:'none'}
  ),
  edit: (props:StyleProps) => (
    props.showTitle ? {
      display: (props.props.onShare || !isContentEditable(props.props.content)) ? 'none' : 'block',
      height: TITLE_HEIGHT,
      whiteSpace: 'pre',
      cursor: 'default',
      ...buttonStyle,
    } : {display:'none'}
  ),
  type: (props: StyleProps) => ({
    display: props.showTitle ? 'block' : 'none',
    height: TITLE_HEIGHT,
  }),
  close: (props: StyleProps) => ({
    visibility: props.showTitle ? 'visible' : 'hidden',
    position:'absolute',
    right:0,
    margin:0,
    padding:0,
    height: TITLE_HEIGHT,
    borderRadius: '0 0.5em 0 0',
    cursor: 'default',
    ...buttonStyle,
  }),
})

const resizeEnable = {
  bottom: true,
  bottomLeft: true,
  bottomRight: true,
  left: true,
  right: true,
  top: true,
  topLeft: true,
  topRight:true,
}
const resizeDisable = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight:false,
} */

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

const buttonStyleActive = {
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
    backgroundColor: '#B34700', //'rosybrown',
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

const buttonStyleDisabled = {
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
    backgroundColor: '#9e886c', //'rosybrown',
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

const BORDER_WIDTH = 3

const useStyles = makeStyles({
  container: (props: StyleProps) => {
    const mat = new DOMMatrix()
    mat.rotateSelf(0, 0, props.pose.orientation)

    return ({
      display: props.props.hideAll ? 'none' : 'block',
      width:0,
      height:0,
      transform: mat.toString(),
      position: 'absolute',
    })
  },
  rndCls: (props: StyleProps) => ({
    borderRadius: props.showTitle ? '0.5em 0.5em 0 0' : '0 0 0 0',
    backgroundColor: props.props.content.noFrame ? 'rgba(0,0,0,0)' :
      settings.useTransparent ? 'rgba(200,200,200,0.5)' : 'rgba(200,200,200,1)',
    boxShadow: props.props.content.noFrame ? undefined :
      settings.useTransparent ? '0.2em 0.2em 0.2em 0.2em rgba(0,0,0,0.4)' :
        '0.2em 0.2em 0.2em 0.2em rgba(100,100,100,1)',
  }),
  rndContainer: (props: StyleProps) => ({
    width:'100%',
    height:'100%',
  }),

  dashed:(props: StyleProps) => ({
    position: (props.props.content.showTitle ? 'absolute' : 'relative'),
    width:(props.size[0] + 8),
    height:(props.size[1] + 8),
    borderWidth:2,
    borderStyle: 'dashed',
    borderColor:'red',
    borderRadius:0,
    top: (props.props.content.showTitle ? '-5px' : ((-(props.size[1])) - 6) + "px"),
    left: '-6px',
  }),

  dashedInEdit:(props: StyleProps) => ({
    position: (props.props.content.showTitle ? 'absolute' : 'relative'),
    width:(props.size[0] + 8),
    height:(props.size[1] + 8),
    borderWidth:2,
    borderStyle: 'dashed',
    borderColor:'#9e886c',
    borderRadius:0,
    top: (props.props.content.showTitle ? '-5px' : ((-(props.size[1])) - 6) + "px"),
    left: '-6px',
  }),


  titlePosition: (props:StyleProps) => (
    props.showTitle ?
    {}
    :
    {
      width:0,
      heihgt:0,
      position:'absolute',
      top:0,
    }
  ),
  dashedCircle: (props: StyleProps) => ({
    position: 'relative',
    width:200,
    height:200,
    borderWidth:2,
    borderStyle: 'solid',
    borderColor:'#9e886c',
    borderRadius:'50%',
    opacity: 0.4,
    top: 20,
    left: 31,
    //backgroundColor: 'transparent',
    background: 'radial-gradient(#ffffff, #ffffff, #ffffff, #9e886c, #9e886c)',
    zIndex: -9999,
  }),

  dashedCircle_dialog: (props: StyleProps) => ({
    position: 'relative',
    width:220,
    height:220,
    borderWidth:2,
    borderStyle: 'solid',
    borderColor:'#9e886c',
    borderRadius:'50%',
    opacity: 0.4,
    top: 15,
    left: 35,
    //backgroundColor: 'transparent',
    background: 'radial-gradient(#ffffff, #ffffff, #ffffff, #9e886c, #9e886c)',
    zIndex: -9999,
  }),


  titleContainer_dialog: (props:StyleProps) => {
    const rv:CreateCSSProperties = {
      display: 'flex',
      width:'300px',
      height:'250px',
      backgroundColor:'transparent',
      position:'relative',
      //transform: 'scale(0)',
      //transition: '0.3s ease-out',
      cursor: 'default',
    }
    if (!props.showTitle) {
      rv['display'] = 'flex'
      rv['position'] = 'relative'
      rv['bottom'] = 'auto'
      rv['top'] = 'auto'
      rv['left'] = 'auto'
      //rv['transform'] = 'scale(0)'
    } else {
      rv['display'] = 'flex'
      rv['position'] = 'relative'
      rv['bottom'] = 'auto'
      // Scale Accordingly
      //rv['transform'] = 'scale(1)'
      }
    return rv
  },

  titleContainer: (props:StyleProps) => {
    const rv:CreateCSSProperties = {
      display: 'flex',
      position: 'relative',
      width: (props.pinned ? 350 : 350), //props.size[0],
      height: (props.pinned ? 250 : 250), //props.size[0],
      overflow: 'hidden',
      userSelect: 'none',
      userDrag: 'none',
      top: 'auto',
      left: 'auto',
      bottom: 'auto',
      transform: 'scale(0)',

      //top: '200px',
      //backgroundColor: 'red',
      backgroundColor: 'transparent',
      transition: '0.3s ease-out',
      cursor: 'default',
    }
    if (!props.showTitle) {
      rv['display'] = 'flex'
      rv['position'] = 'relative'
      rv['bottom'] = 'auto'
      rv['top'] = 'auto'
      rv['left'] = 'auto'
      rv['transform'] = 'scale(0)'
    } else {
      rv['display'] = 'flex'
      rv['position'] = 'relative'
      rv['bottom'] = 'auto'
      // New Changes [Making menu normal]
      var zoomValue = Number(props.props.stores.map.matrix.a)
      //console.log(zoomValue, " zoomValue")
      var zoomRatio = 1.2/zoomValue;
      var tPos =  165 + (2.7 * zoomValue)
      var lPos = 0
      if(zoomValue >= 1 && zoomValue < 5) {
        lPos = 380 - (6 * zoomValue)
      } else if(zoomValue === 5) {
        lPos = 382 - (5 * zoomValue)
      } else if(zoomValue < 0.34) {
        lPos = 500 - (1 * zoomValue)
      } else if(zoomValue > 0.34 && zoomValue < 0.4) {
        lPos = 465 - (1 * zoomValue)
      } else {
        lPos = 400 - (1 * zoomValue)
      }
      rv['top'] = (props.downPos - ((tPos/2))) // 165
      rv['left'] = props.props.content.shareType === 'img' ? (props.downXPos - (360/2)) : (props.downXPos - ((lPos/2))) // 380

      // Scale Accordingly
      rv['transform'] = 'scale('+zoomRatio+')'
      }
    return rv
  },
  content: (props: StyleProps) => ({
    position: 'absolute',
    top: (props.showTitle ? TITLE_HEIGHT : 0) - (props.editing ? BORDER_WIDTH : 0),
    left: props.editing ? -BORDER_WIDTH : 0,
    width: props.size[0],
    height: props.size[1],
    userDrag: 'none',
    pointerEvents: props.dragging ? 'none' : 'auto',
    borderWidth: BORDER_WIDTH,
    borderColor: 'yellow',
    borderStyle: props.editing ? 'solid' : 'none',
    cursor: props.editing ? 'default' : undefined,
    opacity: props.props.content.opacity,
  }),
  ////////////////////////////////// SAFARI FIX //////////////////////////////////////////////
  note: (props:StyleProps) => (
    props.showTitle ? {
      //visibility: props.props.onShare ? 'visible' : 'hidden',
      visibility: 'hidden',
      whiteSpace: 'pre',
      //borderRadius: '0.5em 0 0 0',
      position: 'relative',
      top: 143,
      left: 170,
      /* ...buttonStyle, */
      background: '#9e886c',
      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',
    } : {
      visibility: 'hidden',
  }),

  pin: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 128, //77,
      left: 86, //60,
      whiteSpace: 'pre',
      cursor: 'default',
      //transform: "rotate(-75deg)",
      background: props.pinned ? '#ef4623' : '#9e886c',
      ...props.pinned ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
    } : {display:'none'}
  ),

  pin_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 150, //128,
      left: 47, //38,
      whiteSpace: 'pre',
      cursor: 'default',
      background: props.pinned ? '#ef4623' : '#9e886c',
      ...props.pinned ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
    } : {display:'none'}
  ),

  prox: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'relative',
      top: 78, //27,
      left: 82, //82,
      whiteSpace: 'pre',
      cursor: 'default',
      //transform: "rotate(60deg)",
      background: props.props.content.zone === "close" ? '#ef4623' : '#9e886c',
      ...props.props.content.zone === "close" ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
    } : {display:'none'}
  ),

  prox_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      /* height: TITLE_HEIGHT, */
      position:'absolute',
      top: 128, //100, //76,
      left: 38, //34, //37,
      whiteSpace: 'pre',
      cursor: 'default',
      //background: props.props.content.zone === "close" ? '#ef4623' : '#9e886c', // B34700
      background: props.proxMouseEnter ? (props.props.content.zone === "close" ?  (props._down ? 'black' : '#B34700') : (props._down ? 'black' : '#9e886c')) : props.props.content.zone === "close" ? '#ef4623' : '#9e886c',
      /* ...props.props.content.zone === "close" ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled), */
      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',
    } : {display:'none'}
  ),


  titleButton: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      textAlign: 'center',
      whiteSpace: 'pre',
      position:'absolute',
      cursor: 'default',
      top: 127, //77,
      left: 230, //258,
      //transform: "rotate(90deg)",
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),

  titleButton_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      /* height: TITLE_HEIGHT, */
      textAlign: 'center',
      whiteSpace: 'pre',
      position:'absolute',
      cursor: 'default',
      top: 128, //150, //128,
      left: 205, //195, //205,
      background: props.moreMouseEnter ? 'black' : '#9e886c',
     /*  ...buttonStyle, */
      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',

    } : {display:'none'}
  ),

  uploadZone: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      /* top: 172,
      left: 138, */
      top: 175,
      left: 160,
      whiteSpace: 'pre',
      cursor: 'default',
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),

  uploadZone_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
     /*  height: TITLE_HEIGHT, */
      position:'absolute',
      textAlign: 'center',
      top: 190,
      left: 125,
      whiteSpace: 'pre',
      cursor: 'default',
      background: props.uploadMouseEnter ? 'black' : '#9e886c',
     /*  ...buttonStyle, */
      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',
    } : {display:'none'}
  ),

  stopWatch: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 36,
      left: 110,
      whiteSpace: 'pre',
      cursor: 'default',
      //...buttonStyle,
      background:  props.props.content.showStopWatch ? '#ef4623' : '#9e886c',
      ...props.props.content.showStopWatch ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
    } : {display:'none'}
  ),

  stopWatch_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      /* height: TITLE_HEIGHT, */
      position:'absolute',
      textAlign: 'center',
      top: 76, //52, //33,
      left: 37, //50, //68,
      whiteSpace: 'pre',
      cursor: 'default',
      /* background:  props.props.content.showStopWatch ? '#ef4623' : '#9e886c',
      ...props.props.content.showStopWatch ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled), */
      //background: props.stopWatchMouseEnter ? (props.props.content.showStopWatch ?  (props._down ? '#9e886c' : 'black') : (props._down ? '#9e886c' : '#ef4623')) : props.props.content.showStopWatch ? '#ef4623' : '#9e886c',
      background: props.stopWatchMouseEnter ? (props.props.content.showStopWatch ?  (props._down ? 'black' : '#B34700') : (props._down ? 'black' : '#9e886c')) : props.props.content.showStopWatch ? '#ef4623' : '#9e886c',
      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',
    } : {display:'none'}
  ),

  scaleRotate_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      /* height: TITLE_HEIGHT, */
      position:'absolute',
      textAlign: 'center',
      top: 33, //20, //33,
      left: 68, //92, //68,
      whiteSpace: 'pre',
      cursor: 'default',
      //background:  props.props.content.scaleRotateToggle ? '#ef4623' : '#9e886c',
      /* ...props.props.content.showStopWatch ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled), */

      /* background: props.scaleRotateMouseEnter ? (props.props.content.scaleRotateToggle ?  (props._down ? 'black' : '#B34700') : (props._down ? 'black' : '#ef4623')) : props.props.content.scaleRotateToggle ? '#ef4623' : '#9e886c', */

      background: props.scaleRotateMouseEnter ? 'black' : '#9e886c',

      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',
    } : {display:'none'}
  ),

  uploadImage: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 190,
      left: 186,
      whiteSpace: 'pre',
      cursor: 'default',
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),

  moveTopButton: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 18, //0,
      left: 158,
      whiteSpace: 'pre',
      cursor: 'default',
      //transform: "rotate(-60deg)",
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),

  moveTopButton_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
     /*  height: TITLE_HEIGHT, */
      position:'absolute',
      textAlign: 'center',
      top: 14, //18, //14,
      left: 120, //148, //120,
      whiteSpace: 'pre',
      cursor: 'default',
      background: props.frontMouseEnter ? 'black' : '#9e886c',
     /*  ...buttonStyle, */
      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',
    } : {display:'none'}
  ),

  moveBottomButton: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 35, //0,
      left: 206,
      whiteSpace: 'pre',
      cursor: 'default',
      //transform: "rotate(45deg)",
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),

  moveBottomButton_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      //height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 32, //49, //32,
      left: 174, //192, //174,
      whiteSpace: 'pre',
      cursor: 'default',
      background: props.backMouseEnter ? 'black' : '#9e886c',
      /* ...buttonStyle, */
      margin: '5px',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      padding: '3px',
    } : {display:'none'}
  ),

  copyClipButton: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      top: '0px',
      left: '185px',
      whiteSpace: 'pre',
      cursor: 'default',
      //transform: "rotate(45deg)",
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),

  edit: (props:StyleProps) => (
    props.showTitle ? {
      display: (props.props.onShare || !isContentEditable(props.props.content)) ? 'none' : 'block',
      height: TITLE_HEIGHT,
      whiteSpace: 'pre',
      cursor: 'default',
      background: '#9e886c',
      position: 'absolute',
      top: 147,
      left: 217,
      ...buttonStyle,
    } : {display:'none'}
  ),
  type: (props: StyleProps) => ({
    display: props.showTitle ? 'block' : 'none',
    height: TITLE_HEIGHT,
    position:'absolute',
    top: 105,
    left: 50,
    //transform: "rotate(75deg)",
    background: '#9e886c',
    ...buttonStyle,
  }),
  close: (props: StyleProps) => ({
    visibility: props.showTitle ? 'visible' : 'hidden',
    position:'absolute',
    textAlign: 'left',
    top: 78, //27,
    left: 234, //233,
    right:0,
    margin:0,
    padding:0,
    height: TITLE_HEIGHT,
    borderRadius: '0 0.5em 0 0',
    //transform: "rotate(90deg)",
    cursor: 'default',
    background: '#9e886c',
    ...buttonStyle,
  }),

  close_dialog: (props: StyleProps) => ({
    visibility: props.showTitle ? 'visible' : 'hidden',
    position:'absolute',
    textAlign: 'left',
    top: 76, //100, //76,
    left: 205, //209, //205,
    right:0,
    //margin:0,
    //padding:0,
    /* height: TITLE_HEIGHT, */
    //borderRadius: '0 0.5em 0 0',
    cursor: 'default',
    background: props.deleteMouseEnter ? 'black' : '#9e886c',
    /* ...buttonStyle, */
    margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',
  }),

  nameContainerHolder: (props: StyleProps) => ({
    display: (props._title && props.props.content.name !== '') ? 'block' : 'none',
    fontWeight: 'bold',
    fontSize: isSmartphone() ? '1.2em' : '1em',
    width: props.pose.orientation === 0 || props.pose.orientation === 180 ? props.size[0] : props.size[0],
    height: props.pose.orientation === 0 || props.pose.orientation === 180 ? props.size[1] : props.size[1],
    padding:5,
    backgroundColor: '#eab67600', //'#eab676',
    textAlign: 'center',
    borderRadius: 2,
    alignContent: 'center',
    position:'absolute',
    bottom: 5,
    transform: props.pose.orientation === 0 ? 'rotate(0deg)' : props.pose.orientation === 90 ? 'rotate(-90deg)' : props.pose.orientation === 180 ? 'rotate(-180deg)' : props.pose.orientation === 270 ? 'rotate(-270deg)' : 'rotate(0deg)',
    left: props.pose.orientation === 0 || props.pose.orientation === 180 ? -5 : props.pose.orientation === 270 ? (props.size[0] - props.size[1])/2 - 10 : (props.size[1] - props.size[0])/2,
    top:  props.pose.orientation === 0 ? 0 : props.pose.orientation === 180 ? -7 : -5,
    transformOrigin: 'middle',
  }),

  nameContainer: (props: StyleProps) => ({
    display: (props._title && props.props.content.name !== '') ? 'block' : 'none',
    fontWeight: 'bold',
    fontSize: isSmartphone() ? '1.2em' : '1em',
    width : props.props.content.name.length * 24 + 'px', //"70%",
    height: '20',
    marginBottom: 5,
    marginLeft: props.pose.orientation === 0 || props.pose.orientation === 180 ? ((props.size[0]) - (props.props.content.name.length * 24))/2 - 3 + 'px' : ((props.size[0]) - (props.props.content.name.length * 24))/2 - 5 + 'px',
    marginTop: -40,
    padding:5,
    backgroundColor: '#7ececc', //'#eab676',
    textAlign: 'center',
    borderRadius: 2,
    overflow:'hidden',
    alignContent: 'center',
    position:'relative',
    bottom: 5,
  }),

  stopWatchTitleHolder: (props: StyleProps) => ({
    display: (props.props.content.showStopWatch ? 'block' : 'none'), //(props._title && props.props.content.name !== '') ? 'block' : 'none',
    fontWeight: 'bold',
    fontSize: isSmartphone() ? '1.2em' : '1em',
    width: props.pose.orientation === 0 || props.pose.orientation === 180 ? props.size[0] : props.size[0],
    height: props.pose.orientation === 0 || props.pose.orientation === 180 ? props.size[1] : props.size[1],
    padding:5,
    backgroundColor: '#eab67600', //'#eab676',
    textAlign: 'center',
    borderRadius: 2,
    alignContent: 'center',
    position:'absolute',
    bottom: 5,
    transform: props.pose.orientation === 0 ? 'rotate(0deg)' : props.pose.orientation === 90 ? 'rotate(-90deg)' : props.pose.orientation === 180 ? 'rotate(-180deg)' : props.pose.orientation === 270 ? 'rotate(-270deg)' : 'rotate(0deg)',

    left: props.pose.orientation === 0 || props.pose.orientation === 180 ? -5 : props.pose.orientation === 270 ? (props.size[0] - props.size[1])/2 - 5 : (props.size[1] - props.size[0])/2 - 5,

    top:  props.pose.orientation === 0 ? -5 : props.pose.orientation === 180 ? -5 : -5,

    transformOrigin: 'middle',
  }),

  stopWatchTitle: (props: StyleProps) => ({
    display: (props.props.content.showStopWatch ? 'block' : 'none'), //(props._stopWatch) ? 'block' : 'none',
    fontWeight: 'bold',
    fontSize: isSmartphone() ? '1.2em' : '1em',
    width : '90px', //'40%', //"70%",
    height: '20px',
    marginLeft: props.pose.orientation === 0 || props.pose.orientation === 180 ? ((props.size[0]) - (90))/2 - 3 + 'px' : ((props.size[0]) - (90))/2 - 5 + 'px',
    marginTop: props.pose.orientation === 0 || props.pose.orientation === 180 ? props.size[1] - 30 : props.size[0] - 30,
    marginBottom: '5px',
    padding:5,
    backgroundColor: '#EEDC82', //'#F8DE7E', //'#7ececc',
    textAlign: 'center',
    borderRadius: 2,
    overflow:'hidden',
    alignContent: 'center',
    position:'relative',
    bottom: 0,
  }),

  PingLocation: (props:StyleProps) => ({
    display: 'block',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    top: (props.pingY - 25),
    left: (props.pingX - 17),
    whiteSpace: 'pre',
  }),

  PingLocationHide: (props:StyleProps) => ({
    display: 'none',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    top: (props.pingY - 25),
    left: (props.pingX - 17),
    whiteSpace: 'pre',
  }),

  cursorStyles:{
    cursor: 'auto',
  }
})

const resizeEnable = {
  bottom: false,
  bottomLeft: true,
  bottomRight: true,
  left: false,
  right: false,
  top: false,
  topLeft: true,
  topRight:true,
}
const resizeDisable = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight:false,
}

const cursorStyles = {
  width: '40px',
  height: '40px',
  color: 'white',
  borderRadius: '50%',
  cursor: 'auto',
}

RndContent.displayName = 'RndContent'
