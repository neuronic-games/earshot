import {Button, Dialog, DialogActions, DialogContent, /* DialogTitle, */ Tooltip, Zoom} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {CreateCSSProperties} from '@material-ui/core/styles/withStyles'
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

import StopWatchOnIcon from '@material-ui/icons/Timer'
import StopWatchOffIcon from '@material-ui/icons/Timer'
import RotateRightIcon from '@material-ui/icons/RotateRight'
import AspectRatioIcon from '@material-ui/icons/AspectRatio';


import settings from '@models/api/Settings'
import {doseContentEditingUseKeyinput, isContentEditable, ISharedContent} from '@models/ISharedContent' // , isContentMaximizable
import {t} from '@models/locales'
import {Pose2DMap} from '@models/utils'
import {addV2, extractScaleX, extractScaleY, mulV, rotateVector2DByDegree, subV2, normV, mulV2} from '@models/utils'
import {moveContentToBottom, moveContentToTop} from '@stores/sharedContents/SharedContentCreator' // copyContentToClipboard,
import {TITLE_HEIGHT} from '@stores/sharedContents/SharedContents'
import _ from 'lodash'
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Rnd} from 'react-rnd'
import {useGesture} from 'react-use-gesture'
import { FullGestureState, UserHandlersPartial } from 'react-use-gesture/dist/types'
import {Content} from './Content' // , contentTypeIcons, editButtonTip
import {ISharedContentProps} from './SharedContent'
import {SharedContentForm} from './SharedContentForm'
import {PARTICIPANT_SIZE} from '@models/Participant'
import {ShareDialog} from '@components/footer/share/ShareDialog'
/* import { getBasePingStatus } from '../Base' */
import {Icon} from '@iconify/react'
import crossIcon from '@iconify-icons/fa-solid/expand-arrows-alt'




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
  editing: boolean
  downPos: number,
  downXPos: number,
  _down: boolean,
  _title:boolean,
  pingX: number,
  pingY: number,
  /* _stopWatch:boolean,
  showStopWatch:boolean, */
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

  _contentDialogOpen = showUploadOption
 // _contentDeleteDialogOpen = showDelete

  // For Stop Watch
  //const [showStopWatch, setShowStopWatch] = useState(false)
  //props.content.stopWatchToggle = false
  const stopWatchToggle = useObserver(() => props.content.stopWatchToggle)
  const stopWatchReset = useObserver(() => props.content.stopWatchReset)

  const showHandler = useObserver(() => props.content.scaleRotateToggle)

  //const [isPaused, setIsPaused] = useState(props.content.stopWatchToggle)
  const [time, setTime] = useState(0);


  // For Ping Location
  const [pingLocation, setPingLocation] = useState(false)
  //const _pingIcon = useObserver(()=> participants.local.pingIcon)

  //const contentEdit = useObserver(()=> props.stores.contents.pasted.pinned)
  //console.log(contentEdit, " EDIT")


  //console.log(stopWatchToggle, " stopWatchDisplayTime")
  //console.log(editing, " PS")


  //console.log(pingLocation, " PL")

  if(props.content.zone === undefined) {
    if(props.content.shareType === "zoneimg") {
      props.content.zone = "close"
    } else {
      props.content.zone = undefined
    }
  }

  // Timer

/* let intervalTimer = undefined
  if (showStopWatch && isPaused === false) {
    intervalTimer = setInterval(() => {
      setTime((time) => time + 10);
    }, 10);
  } else {
    console.log("isPaused - ", isPaused)
    clearInterval(intervalTimer);
  } */
  //console.log(showStopWatch, " && ", isPaused)
  /* const timerInterval = setInterval(() => {
    clearInterval(timerInterval)
    if(showStopWatch) {
      //console.log(isPaused, " isPaused")
      if(isPaused === false) {
        setTime((time) => time + 10)
      }
    }
  }, 10) */

  useEffect(  //  update pose
    ()=> {
      member.dragCanceled = true

      //console.log(isPaused, " in Eff ", stopWatchToggle, " ---- ", stopWatchReset)
      // Place timer here
      //////////////////////////////////////////////////////////////////////////////////////////////
      // Working Code
      //let intervalStep = 0
      //console.log("LAYOUT - ", isPaused, " --- ", stopWatchToggle)
      if (props.content.showStopWatch && stopWatchToggle === false && stopWatchReset === false) {
      //if (props.content.showStopWatch &&  stopWatchToggle === false) {
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
      //////////////////////////////////////////////////////////////////////////////////////////////'
      //let intervalStep: NodeJS.Timeout | null = null;
      /* member.intervalStep = +global.setInterval(() => {
        if (props.content.showStopWatch && stopWatchToggle === false && stopWatchReset === false) {
          setTime((time) => time + 10);
        } else if(stopWatchReset) {
          setTime(0)
          clearInterval(member.intervalStep);
        } else {
          clearInterval(member.intervalStep);
        }
      }, 10); */
      //////////////////////////////////////////////////////////////////////////////////////////////
      /* return () => {
        clearInterval(intervalStep);
      } */

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

    //console.log("pos changed")
    //setShowHandler(false)
  }
  useLayoutEffect(  //  reflect pose etc. to rnd size
    () => {
      setPoseAndSizeToRnd()
      //console.log("ENTER in Layout")

      ///////////////////////////////////////////////////
      // Use Timer here
      /* const timerInterval = setInterval(() => {
        //clearInterval(timerInterval)
        if(showStopWatch) {
          console.log(isPaused, " isPaused")
          if(isPaused === false) {
            setTime((time) => time + 10)
          } else {
            clearInterval(timerInterval)
          }
        }
      }, 10) */

      /* let intervalStep = 0
      //console.log("LAYOUT - ", isPaused, " --- ", stopWatchToggle)
      if (props.content.showStopWatch && isPaused === false) {
      //if (props.content.showStopWatch &&  stopWatchToggle === false) {
        intervalStep = window.setInterval(() => {
          setTime((time) => time + 10);
        }, 10);
      } else {
        clearInterval(intervalStep);
      }
      return () => {
        clearInterval(intervalStep);
      } */
      ////////////////////////////////////////////////////
      /* window.document.body.addEventListener(
        'click',
        (ev) => {
          // console.log('click called', ev)
          console.log(member._onContentForEdit, " onContent-", )
          //ev.preventDefault()
          //ev.stopPropagation()
          //console.log("onStage Click")


          if(showHandler && showTitle === false && member._onContentForEdit === false) {
            member._onContentForEdit = true
            props.content.scaleRotateToggle = !props.content.scaleRotateToggle
            props.content.pinned = !props.content.pinned
            props.updateAndSend(props.content)
            return
          }
        },
        {passive:false},
      ) */

      ////////////////////////////////////////////////////

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pose, size, showTitle, map.rotation],
  )

  //  handlers
  function stop(ev:MouseOrTouch|React.PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
  }
 /*  function onClickShare(evt: MouseOrTouch) {
    stop(evt)
    props.onShare?.call(null, evt)
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
    onLeaveIcon()
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
  }
  /* function onClickCopy(evt: MouseOrTouch){
    stop(evt)
    copyContentToClipboard(props.content)
  } */
  /* function onClickMaximize(evt: MouseOrTouch){
    stop(evt)
    if (map.zoomed){
      map.restoreZoom()
    }else{
      map.zoomTo(props.content)
    }
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

  function updateHandler() {
    if (JSON.stringify(pose) !== JSON.stringify(props.content.pose) ||
      JSON.stringify(size) !== JSON.stringify(props.content.size)) {
      props.content.size = [...size] //  Must be new object to compare the pose or size object.
      props.content.pose = {...pose} //  Must be new object to compare the pose or size object.
      props.updateAndSend(props.content)
      //console.log("pos changed")
      //setShowHandler(false)

      setShowOnRotation(false)
    }
  }

  //  drag for title area
  function dragHandler(delta:[number, number], buttons:number, event:any) {
    if (member.dragCanceled){ return }
    const ROTATION_IN_DEGREE = 360
    const ROTATION_STEP = 15
    if (buttons === MOUSE_RIGHT) {
      //console.log(showOnRotation, " >showOnRotation")

      //console.log(delta[0], " --- ", delta[1])
    //if (buttons === 1 && showOnRotation) {
    //if (buttons === 1 && props.content.scaleRotateToggle) {
      setPreciseOrientation((preciseOrientation + delta[0] + delta[1]) % ROTATION_IN_DEGREE)
      let newOri
      if (event?.shiftKey || event?.ctrlKey) {
        newOri = preciseOrientation
      } else {
        newOri = preciseOrientation - preciseOrientation % ROTATION_STEP
      }
      //    mat.translateSelf(...addV2(props.pose.position, mulV(0.5, size)))
      const CENTER_IN_RATIO = 0.5
      const center = addV2(pose.position, mulV(CENTER_IN_RATIO, size))
      pose.position = addV2(pose.position,
                            subV2(rotateVector2DByDegree(pose.orientation - newOri, center), center))
      pose.orientation = newOri
      setPose(Object.assign({}, pose))
    } else {
      const lv = map.rotateFromWindow(delta)
      const cv = rotateVector2DByDegree(-pose.orientation, lv)
      pose.position = addV2(pose.position, cv)
      setPose(Object.assign({}, pose))
    }
  }


  ////////////////////////////
  function hindleClickStatus() {
    //console.log(mem.clickStatus, " onClick")

    if(member.clickStatus === 'single') {
      if(member.clickEnter) {return}
     // if(pingLocation) {return}
     if(member.isMoved) {return}
     if(showDelete) {return}
     //if(member.OnTimerClick) {return}



     //console.log(showOnRotation, " onRota icon")
     if(showOnRotation) {return}

     if(pingLocation) {}
      pingEnable = false
      member.clickStatus = ''
      participants.local.pingIcon = false
      participants.local.pingX = 0
      participants.local.pingY = 0
      setPingLocation(false)
      const moveTimer = setTimeout(() =>{
        clearTimeout(moveTimer)
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
      //console.log('double click action goes here and play sound')
      //mem.userAngle = props.stores.participants.loca
      ///////////////////////////////////
     /*  if(pingLocation) {return}
      if(getBasePingStatus()) {return} */
      ///////////////////////////////////

      window.clearTimeout(member.hidePinIcon)

      //let audio = new Audio("sound/beep.mp3")
      //audio.play()


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
  ////////////////////////////

  //const isFixed = (props.autoHideTitle && props.content.pinned)
  const isFixed = (props.content.pinned)


  //const stopTimeValue = ("0" + Math.floor((time / 3600000) % 60)).slice(-2) + ":" + ("0" + Math.floor((time / 60000) % 60)).slice(-2) + ":" + ("0" + Math.floor((time / 1000) % 60)).slice(-2) // + ":" + ("0" + ((time / 10) % 100)).slice(-2)
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
    onDrag: ({down, delta, event, xy, buttons}) => {
      //  console.log('onDragTitle:', delta)
      isLocaked = props.content.pinned
      //console.log(isLocaked, " rnd")
      _isOnContent = true
      if (isFixed) { return }
      if(showTitle) {return}
      //if(showDelete) {return}
      event?.stopPropagation()

      if (down) {
        //  event?.preventDefault()
        dragHandler(delta, buttons, event)
      }
    },
    onDragStart: ({event, currentTarget, delta, buttons}) => {   // to detect click
      //  console.log(`dragStart delta=${delta}  buttons=${buttons}`)
      //member.OnTimerClick = false

      if(showTitle) {return}
      setDragging(true)
      member.buttons = buttons
      member.dragCanceled = false
      if (currentTarget instanceof Element && event instanceof PointerEvent){
        currentTarget.setPointerCapture(event?.pointerId)
      }
    },
    onDragEnd: ({event, currentTarget, delta, buttons, xy}) => {
      //  console.log(`dragEnd delta=${delta}  buttons=${buttons}`)

     //console.log(String(Object(event?.target).nodeName))

     //console.log(member._down, " dragged")

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


      if(showTitle) {return}

      //_isOnContent = false

      //setShowOnRotation(false)
      // Remove All From Edit mode
      //console.log(member._checkForRotation, " >> member._checkForRotation")

      let isEdit = checkContentsInEdit()
      if(isEdit && member._checkForRotation) {
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
        setShowForm(true)
        map.keyInputUsers.add('contentForm')
      }
      member.buttons = 0

      //console.log(props.content.pose.position[1], " checking Pos", (participants.local.mouse.position[1]))

      //const diff = subV2([member.moveX, member.moveY], participants.local.pose.position)
      //const dir = mulV2(normV(diff) / normV(diff), diff)
      //console.log(props.content.size[1], " --- ", addV2(participants.local.pose.position, dir))

      //console.log(props.content.size[1], ' ---- ', (map.mouseOnMap[1] - props.content.pose.position[1]))

      //console.log(props.content.size[1] - (map.mouseOnMap[1] - props.content.pose.position[1]))

      //const diff = subV2(map.mouseOnMap, pose.position)
      //console.log(diff[1], " ---- ", props.content.size[0]/2, " ==== ", pose.position[0])

      //console.log(props.content.size[0]/2 - diff[0])



      //console.log(getRect(props.content.pose, props.content.size))
        //console.log(diff[0], props.content.size[0]/2)
        //if(diff[0] >= (props.content.size[0]/2 - 25) && diff[0] <= (props.content.size[0]/2 + 25)) {

        if(props.content.scaleRotateToggle && member._checkForRotation) {
          member._checkForRotation = false
          RotateContent()
          updateHandler()
          return
        }


      let yCheck = props.content.size[1] - (map.mouseOnMap[1] - props.content.pose.position[1]) //participants.local.mouse.position[1]
      let xCheck = props.content.size[0] - (props.content.size[0] - (map.mouseOnMap[0] - props.content.pose.position[0]))

      //console.log(xCheck, " xCheck")

      //if(member.OnTimerClick) {return}
      ///////////////////////////////////////////////
      if (event?.detail === 1) {
        //console.log(member.OnTimerClick , " onTimer")
        //console.log(member._down, " down")
        //if(yCheck > -45 && yCheck < - 20) {
        if(yCheck > 5 && yCheck < 35 && xCheck > 7 && xCheck < 110) {
          member.clickStatus = 'toggleTimer'
          //console.log("onTimer click")
        } else {
          member.clickStatus = 'single'
        }
      } else if (event?.detail === 2) {
        //if(yCheck > -45 && yCheck < - 20) {
        if(yCheck > 5 && yCheck < 35 && xCheck > 7 && xCheck < 110) {
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
      }, 250)
//////////////////////////////////////////


    },
    onMove:({xy}) => {
      //isLocaked = props.content.pinned
      if(showTitle) {return}
      //_isOnContent = true
      member.isMoved = true
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


    onMouseUp: (arg) => {
      //console.log("Mouse up ", editing, "-", member._down)
      //member._down = false

      if(editing) {
        arg.stopPropagation()
      } else {
        //console.log("UPUP")
        if(arg.button > 0) {return}

        member.onContent = false

        //_isOnContent = true

        member.isMoved = false
        member.upTime = new Date().getSeconds()
        let diffTime = member.upTime - member.downTime
        //console.log(diffTime, " diffTi")
        if(diffTime < 2 && String(Object(arg.target).tagName) === "DIV" && showTitle === false) {
          if(member._down === false || showTitle) return

          /* if(showHandler) {
            setShowHandler(false)
          } else {
            setShowHandler(true)
          } */

          /* setTimeout(() =>{
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
          }, 0) */

        } else {
        }
      }
    },

    onMouseMove: (arg) => {
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
      //member._down = true
      //console.log(arg, " target over")
      _isOnContent = true

      // new props
      member._onContentForEdit = true

      member._item = String(Object(arg.target).tagName)
      window.clearTimeout(member._timer)
    },
    onMouseOut: (arg) => {
      //console.log(Object(arg.target).id , " target")
      //console.log(showTitle, " target out")
      if(showTitle) {return}

      // use it
      _isOnContent = false

      // new props
      member._onContentForEdit = false

      member.onContent = false
      isLocaked = false
    },
    onMouseDown: (arg) => {
      //console.log(arg.button, " button")
      //console.log("onMouseDown -- Checking Double Click")
      if(editing) {
        arg.stopPropagation()
      } else {
        if(arg.button > 0) {return}
        //if(member.OnTimerClick) {return}

        //console.log(String(Object(arg.target).id))

        //console.log(arg.nativeEvent.pageX, pose.position[0])
        /* const diff = subV2(map.mouseOnMap, pose.position)
        //console.log(diff[0], props.content.size[0]/2)
        if(diff[0] >= (props.content.size[0]/2 - 25) && diff[0] <= (props.content.size[0]/2 + 25)) {
          return
        } */

        member._checkForRotation = true
        member.onContent = true
        member._down = true
        member.downTime = new Date().getSeconds()
        member.moveX = map.mouseOnMap[0]
        member.moveY = map.mouseOnMap[1]
        window.clearTimeout(member._timer)
        //console.log("Click")

        //console.log(arg)

        member._clickX = arg.clientX
        member._clickY = arg.clientY

        // Storing zIndex
        member._zIndex = Number(props.content.zIndex)

        //if(showOnRotation) {return}

        //if(showHandler) {
          //setShowHandler(false)
        //} else {
          //setShowHandler(true)
        //}

        //console.log(member._down, " ---- ", showTitle)


        const _mTimer = setTimeout(function() {
          clearTimeout(_mTimer)
          //console.log("Enter timer")
          //if(props.content.ownerName === participants.local.information.name) {

            //let yCheck = props.content.size[1] - (map.mouseOnMap[1] - props.content.pose.position[1])
            //console.log(yCheck, " IN")

            //console.log(showOnRotation, " onRota icon")



            if(member._down && showTitle === false && showOnRotation === false) {
              /* if(yCheck > 5 && yCheck < 35) {
                member.clickStatus = 'resetTimer'
                member.clickEnter = false
                hindleClickStatus()
              } else { */
                //console.log("Checking the Zindex --- ", props.content.zIndex)

                // Remove the edit controls
                //setShowHandler(false)

                const diff = subV2(map.mouseOnMap, pose.position)
                member.downPos = Number(diff[1])
                member.downXPos = Number(diff[0])
                contextMenuStatus = true
                setShowTitle(true)
                //setEditing(false)
                //setTimeout(()=>{
                  /* stop(arg)
                  moveContentToTop(props.content)
                  props.updateAndSend(props.content) */
                //}, 100)
              //}
            }
          //}
        },500)
        //showTimer(Number(Object(arg.nativeEvent).layerY), Number(Object(arg.nativeEvent).layerX))
      }
    },
    onTouchStart: (arg) => { if(editing) {arg.stopPropagation() }},
    onTouchEnd: (arg) => { if(editing) {arg.stopPropagation()} },
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

      /* console.log(member._zIndex, " ------ ", props.content.zIndex, " ----- ", _delay)
      if(_delay === 1) {return}
      if(member._zIndex === Number(props.content.zIndex)) {return}
      moveContentToIndex(props.content, member._zIndex)
      props.updateAndSend(props.content) */

    }, (_delay * 1000))
  }

  //function startStopWatch(_bool:boolean) {
    //console.log("Timer start : ", _bool, " --- " , isPaused)
 // }

  const handlerForContent:UserHandlersPartial = Object.assign({}, handlerForTitle)
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

   /*  if (dir === 'left' || dir === 'topLeft' || dir === 'bottomLeft') {
      deltaPos[0] = -cd[1]
      posChange = posChange || cd[0] !== 0
    }
    if (dir === 'top' || dir === 'topLeft' || dir === 'topRight') {
      deltaPos[1] = -cd[1]
      posChange = posChange || cd[1] !== 0
    } */

    /* if (dir === 'left' || dir === 'topLeft' || dir === 'bottomLeft') {
      deltaPos[0] = -cd[1]
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

  const classes = useStyles({props, pose, size, showTitle, showBorder, pinned:props.content.pinned, dragging, editing, downPos:member.downPos, downXPos:member.downXPos, _down:member._down, _title:titleDisplay, pingX:member.pingX, pingY:member.pingY})
  //  console.log('render: TITLE_HEIGHT:', TITLE_HEIGHT)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const formRef = React.useRef<HTMLDivElement>(null)
  const gestureForContent = useGesture(handlerForContent)
  const gestureForTitle = useGesture(handlerForTitle)
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
        <div className={classes.nameContainer}>{props.content.name}</div>
        <div className={classes.stopWatchTitle}>{stopTimeValue}</div>
        {/* <div className={showBorder ? classes.dashed : undefined}></div> */}
        <div className={(showHandler && showTitle === false) ? classes.dashed : (showBorder ? classes.dashed : undefined)}></div>


{/* {showHandler ? */}
<div style={{position:'absolute', width:size[0], height:size[1], top:0, left:0/* , backgroundColor:'green' */}}
        /* onMouseEnter={()=>{
          //console.log("onRot")
          setShowHandler(true)
        }}
        onMouseOut={()=>{
          //console.log("onRot")
          setShowHandler(false)
        }} */
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
          /* onMouseDown={(evt)=>{
            console.log("down")
            setShowOnRotation(true)
            //dragHandler([0, 0], 1, evt)
          }}
          onMouseUp={(evt)=>{
            console.log("up")
            setShowOnRotation(false)
          }} */
          /* onMouseOver={(evt)=>{
            console.log("on Rot Over")
            setShowOnRotation(true)
          }}
          onMouseOut={(evt)=>{
            console.log("on Rot out")
            setShowOnRotation(false)
          }} */

        >
        <RotateRightIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white', position:'absolute', left:'2px', top:'3px'}} />
        </div>

        {/* <div id='rotate' style={{width:'50px', height:'50px',  position:'absolute', left: (size[0]/2 - 15), top:(size[1]/2) - 25, backgroundColor:'blue', borderRadius:'50%', zIndex:999999}}></div> */}

        {/* <div style={{position:'absolute', width:size[0] + 40, height:size[1] + 40, top:-20, left:-20, backgroundColor:'#FFFF0030'}}
          onMouseOut={(evt)=>{
            console.log("on out")
          }}
          >
        </div> */}

        </div>
        : ''}
      </div>
      {/*  : ''} */}



      </div>

      <div className={classes.titlePosition} {...gestureForTitle() /* title can be placed out of Rnd */}>

      <div className={classes.titleContainer}
           onMouseLeave = {() => {
            //console.log("out from title - ", member.onContent)
            //member._item = "DIV"
            //clearTimeout(member._timer)
            //showHideTimer()
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
        style={showDelete ? {zIndex:9999} : {zIndex:-9999}}
        BackdropProps={{ invisible: true }}
        >
          {/* <DialogTitle style={{backgroundColor:'#B34700', height:'17px', position:'relative', top:'-13px', color:'white'}}>{t('deleteAlert')}</DialogTitle> */}
          <DialogContent style={{userSelect: 'none', fontSize:'25px', fontWeight:'bold'}}>
            {t('deleteMsg')}
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
      {/*   : ''} */}


      {/* <div className={classes.titleContainer}
           onMouseLeave = {() => {
            //console.log("out from title - ", member.onContent)
            //member._item = "DIV"
            //clearTimeout(member._timer)
            //showHideTimer()
          }}
            onContextMenu = {() => {
              setShowForm(true)
              map.keyInputUsers.add('contentForm')
            }}
            >
          <Tooltip placement="top" title={member._down ? (props.content.pinned ? t('ctUnpin') : t('ctPin')) : ''}>
          <div className={classes.pin} onMouseUp={onClickPin} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
            <img src={props.content.pinned ? pinIcon : pinOffIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt="" />
          </div></Tooltip>
            <Tooltip placement="top" title={member._down ? t('ctMoveTop') : ''} >
              <div className={classes.moveTopButton} onMouseUp={onClickMoveToTop}
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  <img src={FlipToFrontIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
                  </div></Tooltip>
            <Tooltip placement="top" title={member._down ? t('ctMoveBottom') : ''} >
              <div className={classes.moveBottomButton} onMouseUp={onClickMoveToBottom}
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  <img src={FlipToBackIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
                </div></Tooltip>
          <Tooltip placement="top" title={member._down ? (props.content.zone === "close" ? t('ctUnProximity') : t('ctProximity')) : ''} >
          <div className={classes.prox} onMouseUp={onClickZone} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
            <img src={props.content.zone === "close" ? proximityOffIcon : proximityIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
          </div>
          </Tooltip>
          <div className={classes.titleButton} onMouseUp={onClickMore} onTouchStart={stop} onMouseLeave={onLeaveIcon} ref={formRef}>
              <img src={MoreIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
          </div>
          <SharedContentForm open={showForm} {...props} close={onCloseForm}
            anchorEl={contentRef.current} anchorOrigin={{vertical:'top', horizontal:'right'}}
          />
            <div className={classes.close} onMouseUp={onClickClose} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
              <img src={CloseIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
          <Tooltip placement="bottom" title={member._down ? t('ctUploadZone') : ''} >
            <div className={classes.uploadZone} onMouseUp={onClickUploadZone}
              onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                <img src={UploadShare} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
          </Tooltip>
          <Tooltip placement="top" title={member._down ? (props.content.showStopWatch ? t('ctStopWatchOff') : t('ctStopWatchOn')) : ''} >
            <div className={classes.stopWatch} onMouseUp={onClickStopWatch}
              onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                {props.content.showStopWatch ? <StopWatchOffIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} /> :
                <StopWatchOnIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} />
                }
            </div>
          </Tooltip>
          <div className={showTitle ? classes.dashedCircle : undefined}></div>
        </div> */}


      </div>

    </div>
  //  console.log('Rnd rendered.')


  return (

    <div className={classes.container} style={{zIndex:props.content.zIndex}} onContextMenu={
      (evt) => {
        evt.stopPropagation()
        evt.preventDefault()
      }
      }>

      {/* <Rnd className={classes.rndCls} enableResizing={isFixed ? resizeDisable : resizeEnable} */}
      {props.content.shareType !== 'roomimg' ?
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
      >
        {theContent}
      </Rnd> : ''}

      {/* <div className={(pingLocation && _pingIcon) ? classes.PingLocation:classes.PingLocationHide}>
        <img src={PingIcon} width={TITLE_HEIGHT} alt=""/>
      </div> */}
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
                <div className={classes.moveTopButton_dialog} onMouseUp={onClickMoveToTop}
                  onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                    <img src={FlipToFrontIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
                    </div></Tooltip>
              <Tooltip placement="top" title={member._down ? t('ctMoveBottom') : ''} >
                <div className={classes.moveBottomButton_dialog} onMouseUp={onClickMoveToBottom}
                  onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                    <img src={FlipToBackIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
                  </div></Tooltip>
            <Tooltip placement="top" title={member._down ? (props.content.zone === "close" ? t('ctUnProximity') : t('ctProximity')) : ''} >
            <div className={classes.prox_dialog} onMouseUp={onClickZone} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
              <img src={props.content.zone === "close" ? proximityOffIcon : proximityIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
            </Tooltip>
            <div className={classes.titleButton_dialog} onMouseUp={onClickMore} onTouchStart={stop} onMouseLeave={onLeaveIcon} ref={formRef}>
                <img src={MoreIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
            {/* <SharedContentForm open={showForm} {...props} close={onCloseForm}
              anchorEl={contentRef.current} anchorOrigin={{vertical:'top', horizontal:'right'}}
            /> */}
              <div className={classes.close_dialog} onMouseUp={onClickClose} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                <img src={CloseIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
              </div>
            <Tooltip placement="bottom" title={member._down ? t('ctUploadZone') : ''} >
              <div className={classes.uploadZone_dialog} onMouseUp={onClickUploadZone}
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  <img src={UploadShare} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
              </div>
            </Tooltip>
            <Tooltip placement="top" title={member._down ? (props.content.showStopWatch ? t('ctStopWatchOff') : t('ctStopWatchOn')) : ''} >
              <div className={classes.stopWatch_dialog} onMouseUp={onClickStopWatch}
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  {props.content.showStopWatch ? <StopWatchOffIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} /> :
                  <StopWatchOnIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} />
                  }
              </div>
            </Tooltip>
            <Tooltip placement="top" title={member._down ? (props.content.scaleRotateToggle ? t('ctUnScaleRotate') : t('ctScaleRotate')) : ''} >
              <div className={classes.scaleRotate_dialog} onMouseUp={onClickScaleRotate}
                onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                  {props.content.scaleRotateToggle ? <AspectRatioIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} /> :
                  <AspectRatioIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} />
                  }
              </div>
            </Tooltip>

            <div className={showTitle ? classes.dashedCircle_dialog : undefined}></div>
          </div>
          </Zoom>
        </DialogContent>
        </Dialog>
        {/* : '' } */}



      {/* <Dialog open={showTitle}
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
            left: Number(member._clickX) - 200,
            top: Number(member._clickY) - 170,
          },
        }}
        BackdropProps={{ invisible: true }}
        >
        <DialogContent>
          <div className={classes.titleContainer_dialog}>
          <Tooltip placement="top" title={member._down ? (props.content.pinned ? t('ctUnpin') : t('ctPin')) : ''}>
            <div className={classes.pin_dialog} onMouseUp={onClickPin} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
              <img src={props.content.pinned ? pinIcon : pinOffIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt="" />
            </div>
          </Tooltip>

            <Tooltip placement="top" title={member._down ? t('ctMoveTop') : ''} >
            <div className={classes.moveTopButton_dialog} onMouseUp={onClickMoveToTop} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
              <img src={FlipToFrontIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
          </Tooltip>

          <Tooltip placement="top" title={member._down ? t('ctMoveBottom') : ''} >
            <div className={classes.moveBottomButton_dialog} onMouseUp={onClickMoveToBottom} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
              <img src={FlipToBackIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
          </Tooltip>

          <Tooltip placement="top" title={member._down ? (props.content.zone === "close" ? t('ctUnProximity') : t('ctProximity')) : ''} >
            <div className={classes.prox_dialog} onMouseUp={onClickZone} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
              <img src={props.content.zone === "close" ? proximityOffIcon : proximityIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
          </Tooltip>

         <div className={classes.titleButton_dialog} onMouseUp={onClickMore} onTouchStart={stop} onMouseLeave={onLeaveIcon} ref={formRef}>
              <img src={MoreIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
          </div>
          <SharedContentForm open={showForm} {...props} close={onCloseForm}
            anchorEl={contentRef.current} anchorOrigin={{vertical:'top', horizontal:'right'}}/>
          <div className={classes.close_dialog} onMouseUp={onClickClose} onTouchStart={stop} onMouseLeave={onLeaveIcon}>
            <img src={CloseIcon} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
          </div>

          <Tooltip placement="bottom" title={member._down ? t('ctUploadZone') : ''} >
            <div className={classes.uploadZone_dialog} onMouseUp={onClickUploadZone}
              onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                <img src={UploadShare} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
            </div>
          </Tooltip>

          <Tooltip placement="top" title={member._down ? (props.content.showStopWatch ? t('ctStopWatchOff') : t('ctStopWatchOn')) : ''} >
            <div className={classes.stopWatch_dialog} onMouseUp={onClickStopWatch}
              onTouchStart={stop} onMouseLeave={onLeaveIcon}>
                {props.content.showStopWatch ? <StopWatchOffIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} /> :
                <StopWatchOnIcon style={{width:TITLE_HEIGHT, height:TITLE_HEIGHT, color:'white'}} />
                }
            </div>
          </Tooltip>

          <div className={showTitle ? classes.dashedCircle_dialog : undefined}></div>
          </div>
        </DialogContent>
        </Dialog> */}


    </div >
  )
}

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
  /* titleContainer: (props:StyleProps) => {
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
  }, */

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
      //rv['top'] = (props.downPos - ((tPos/2))) // 165
      //rv['left'] = props.props.content.shareType === 'img' ? (props.downXPos - (360/2)) : (props.downXPos - ((lPos/2))) // 380

      rv['top'] = (props.downPos - ((tPos/2))) // 165
      rv['left'] = props.props.content.shareType === 'img' ? (props.downXPos - (360/2)) : (props.downXPos - ((lPos/2))) // 380

      // Scale Accordingly
      rv['transform'] = 'scale('+zoomRatio+')'
      }
    return rv
  },

  /* titleContainer: (props:StyleProps) => (

    props.showTitle ?
    {

      display: 'flex',
      position: 'absolute',
      bottom: 0,
      top: (props.downPos - (130/2)), // 100
      left: (props.downXPos - (380/2)), // 270
      transition: '0.3s ease-out',
      transform: 'scale(1)',
    }
    :
    {
      display: 'flex',
      position: 'absolute',
      width: (props.pinned ? 350 : 350), //props.size[0],
      height: (props.pinned ? 200 : 200), //props.size[0],
      overflow: 'hidden',
      userSelect: 'none',
      userDrag: 'none',
      bottom: 0,
      transform: 'scale(0)',
      //top: '200px',
      //backgroundColor: 'red',
      transition: '0.5s ease-out',
    }
  ), */


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
      //visibility: props.props.onShare ? 'visible' : 'hidden',
      visibility: 'hidden',
      whiteSpace: 'pre',
      //borderRadius: '0.5em 0 0 0',
      position: 'relative',
      top: 143,
      left: 170,
      ...buttonStyle,
    } : {
      visibility: 'hidden',
    }),
  pin: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      //top: props.props.content.shareType === 'img' ? 45 : 57,

      /* top: props.props.content.shareType === 'img' ? 50 : 77,
      left: props.props.content.shareType === 'img' ? 60 : 60, */
     /*  top: 99, //77,
      left: 79, //60, */

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
      /* top: 13,
      left: 233, */
      //top: '0px',
      //left: '185px',


      //top: 13,
      //left: props.props.content.shareType === 'img' ? 117 : 87,

      /* top: 27,
      left: props.props.content.shareType === 'img' ? 117 : 82, */

     /*  top: 52, //27,
      left: 94, //82, */

      top: 78, //27,
      left: 82, //82,

      whiteSpace: 'pre',
      cursor: 'default',
      //transform: "rotate(60deg)",
      background: props.props.content.zone === "close" ? '#ef4623' : '#9e886c',
      //...buttonStyle,
      //...props.props.content.zone === "close" ? buttonStyleActive : buttonStyle,
      ...props.props.content.zone === "close" ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
    } : {display:'none'}
  ),

  prox_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      top: 128, //100, //76,
      left: 38, //34, //37,
      whiteSpace: 'pre',
      cursor: 'default',
      background: props.props.content.zone === "close" ? '#ef4623' : '#9e886c',
      ...props.props.content.zone === "close" ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
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
      /* top: '57px',
      left: '258px', */
      /* top: props.props.content.shareType === 'img' ? 13 : 13,
      left: props.props.content.shareType === 'img' ? 213 : 233, */

      //top: props.props.content.shareType === 'img' ? 45 : 57,
      //left: props.props.content.shareType === 'img' ? 253 : 260,

      /* top: props.props.content.shareType === 'img' ? 50 : 77,
      left: props.props.content.shareType === 'img' ? 240 : 258, */

     /*  top: 102, //77,
      left: 237, //258, */

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
      height: TITLE_HEIGHT,
      textAlign: 'center',
      whiteSpace: 'pre',
      position:'absolute',
      cursor: 'default',
      top: 128, //150, //128,
      left: 205, //195, //205,
      background: '#9e886c',
      ...buttonStyle,
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
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 190,
      left: 125,
      whiteSpace: 'pre',
      cursor: 'default',
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),


  stopWatch: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',

      /* top: 170,
      left: 185, */

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
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 76, //52, //33,
      left: 37, //50, //68,
      whiteSpace: 'pre',
      cursor: 'default',
      background:  props.props.content.showStopWatch ? '#ef4623' : '#9e886c',
      ...props.props.content.showStopWatch ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
    } : {display:'none'}
  ),

  scaleRotate_dialog: (props:StyleProps) => (
    props.showTitle ? {
      display: props.props.onShare ? 'none' : 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 33, //20, //33,
      left: 68, //92, //68,
      whiteSpace: 'pre',
      cursor: 'default',
      background:  props.props.content.scaleRotateToggle ? '#ef4623' : '#9e886c',
      ...props.props.content.showStopWatch ?  (props._down ? buttonStyle : buttonStyleActive) : (props._down ? buttonStyle : buttonStyleDisabled),
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
      //top: 13,
      //left: props.props.content.shareType === 'img' ? 117 : 87,


      //top: props.props.content.shareType === 'img' ? 5 : 0,


      //left: props.props.content.shareType === 'img' ? 165 : 135,
      //left: props.props.content.shareType === 'img' ? 165 : 134,

     /*  top: props.props.content.shareType === 'img' ? 11 : 0,
      left: props.props.content.shareType === 'img' ? 97 : 134, */


      /* top: 22, //0,
      left: 134, */

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
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 14, //18, //14,
      left: 120, //148, //120,
      whiteSpace: 'pre',
      cursor: 'default',
      background: '#9e886c',
      ...buttonStyle,
    } : {display:'none'}
  ),

  moveBottomButton: (props:StyleProps) => (
    props.showTitle ? {
      display: 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',

      //top: props.props.content.shareType === 'img' ? 5 : 0,
      //left: props.props.content.shareType === 'img' ? 165 : 135,


      //left: '185px',
      /* top: 0,
      left: props.props.content.shareType === 'img' ? 150 : 186, */

      /* top: 22, //0,
      left: 186, */

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
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: 32, //49, //32,
      left: 174, //192, //174,
      whiteSpace: 'pre',
      cursor: 'default',
      background: '#9e886c',
      ...buttonStyle,
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
   /*  top: '105px',
    left: '268px', */
    //top: props.props.content.shareType === 'img' ? 45 : 57,
    //left: props.props.content.shareType === 'img' ? 253 : 260,


    //top: props.props.content.shareType === 'img' ? 13 : 13,


    //left: props.props.content.shareType === 'img' ? 213 : 233,
    /* top: props.props.content.shareType === 'img' ? 11 : 27,
    left: props.props.content.shareType === 'img' ? 203 : 233, */

    /* top: 53, //27,
    left: 225, //233, */

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
    margin:0,
    padding:0,
    height: TITLE_HEIGHT,
    borderRadius: '0 0.5em 0 0',
    cursor: 'default',
    background: '#9e886c',
    ...buttonStyle,
  }),

  nameContainer: (props: StyleProps) => ({
    display: (props._title && props.props.content.name !== '') ? 'block' : 'none',
    fontWeight: 'bold',
    fontSize: '1.2em',
    width : props.props.content.name.length * 12 + 'px', //"70%",
    height: '20',
    marginLeft : ((props.size[0]) - (props.props.content.name.length * 12))/2 + 'px', //(100 - (props.props.content.name.length * 5))/2 + "%", //"15%",
    marginBottom: 5,
    marginTop: -(props.size[1] + 38),
    padding:5,
    backgroundColor: '#7ececc', //'#eab676',
    textAlign: 'center',
    borderRadius: 2,
    overflow:'hidden',
    alignContent: 'center',
    position:'relative',
    bottom: 5,
  }),

  stopWatchTitle: (props: StyleProps) => ({
    display: (props.props.content.showStopWatch ? 'block' : 'none'), //(props._stopWatch) ? 'block' : 'none',
    fontWeight: 'bold',
    fontSize: '1.2em',
    width : '90px', //'40%', //"70%",
    height: '20px',
    //marginLeft : (100 - (40))/2 + "%",
    marginLeft : '5px', //((props.size[0]) - 100)/2 + 'px', //5, //((props.size[0]))/200 + "%",
    marginBottom: '5px',
    //marginTop: -(props.size[1] + 38),
    padding:5,
    backgroundColor: '#EEDC82', //'#F8DE7E', //'#7ececc',
    textAlign: 'center',
    borderRadius: 2,
    overflow:'hidden',
    alignContent: 'center',
    position:'absolute',
    bottom: 0,
  }),

  PingLocation: (props:StyleProps) => ({
    display: 'block',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    top: (props.pingY - 25),
    left: (props.pingX - 17),
    //transform: `rotate(${props.props.stores.map.rotation}deg)`,
    whiteSpace: 'pre',
  }),

  PingLocationHide: (props:StyleProps) => ({
    display: 'none',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    top: (props.pingY - 25),
    left: (props.pingX - 17),
    //transform: `rotate(${props.props.stores.map.rotation}deg)`,
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
  /* backgroundColor: 'red', */
  color: 'white',
  borderRadius: '50%',
  cursor: 'auto',
}

RndContent.displayName = 'RndContent'
