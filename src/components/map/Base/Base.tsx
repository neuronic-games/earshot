import {BMProps, MapProps as BP} from '@components/utils'
import {makeStyles} from '@material-ui/core/styles'
import {PARTICIPANT_SIZE} from '@models/Participant'
import {
  crossProduct, extractRotation, extractScaleX,
  radian2Degree, rotate90ClockWise, rotateVector2D, transformPoint2D, transfromAt, vectorLength,
} from '@models/utils'
import {addV2, mulV2, normV, subV2} from '@models/utils/coordinates'
import {SCALE_LIMIT} from '@stores/Map'
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef, useState} from 'react'
import ResizeObserver from 'react-resize-observer'
import {useGesture} from 'react-use-gesture'

import {getContextMenuStatus, MouseOrTouch, getContentLocked} from '../ShareLayer/RndContent'
import {isDialogOpen} from "@components/footer/share/ShareDialog"
import {Tooltip} from '@material-ui/core'
import UploadShare from '@images/whoo-screen_btn-add-63.png'
//import PingIcon from '@images/whoo-screen_pointer.png'
import {TITLE_HEIGHT} from '@stores/sharedContents/SharedContents'
import {t} from '@models/locales'
import {ShareDialog} from '@components/footer/share/ShareDialog'
//import { getRndPingStatus } from '../ShareLayer/RndContent'


//  utility
function limitScale(currentScale: number, scale: number): number {
  const targetScale = currentScale * scale

  if (targetScale > SCALE_LIMIT.maxScale) {
    return SCALE_LIMIT.maxScale / currentScale
  }

  if (targetScale < SCALE_LIMIT.minScale) {
    return SCALE_LIMIT.minScale / currentScale
  }

  return scale
}

interface StyleProps {
  matrix: DOMMatrixReadOnly,
  props: BMProps,
  mem:BaseMember,
}

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    userDrag: 'none',
    userSelect: 'none',
    overflow: 'hidden',
  },
  center:{
    position: 'absolute',
    margin: 'auto',
    left:0, right:0, top:0, bottom:0,
    width:0, height:0,
  },
  transform: (props: StyleProps) => ({
    position: 'absolute',
    width:0, height:0,
    transform: props.matrix.toString(),
  }),
  hideMenuContainer: (props:StyleProps) => ({
    display: 'flex',
    position: 'relative',
    width: 350,
    height: 250,
    overflow: 'hidden',
    userSelect: 'none',
    userDrag: 'none',
    //top: (props.mem.zoomY) - 125,
    //left: (props.mem.zoomX) - 170,
    bottom: 'auto',
    transform: 'scale(0)',
    backgroundColor: 'transparent',
    transition: '0s ease-out',
    cursor: 'default',
  }),
  showMenuContainer: (props:StyleProps) => ({
    display: 'flex',
    position: 'relative',
    width: 350,
    height: 250,
    overflow: 'hidden',
    userSelect: 'none',
    userDrag: 'none',
    top: (props.mem.zoomY) - 125,
    left: (props.mem.zoomX) - 170,
    bottom: 'auto',
    transform: 'scale(1.2)',
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
    /* top: 20,
    left: -20, */
    top: 25,
    left: 65,
    background: 'radial-gradient(#ffffff, #ffffff, #ffffff, #9e886c, #9e886c)',
    zIndex: -9999,
  }),

  uploadZone: (props:StyleProps) => ({
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

    PingLocation: (props:StyleProps) => ({
      display: 'block',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: (props.mem.pingY - 25),
      left: (props.mem.pingX - 17),
      //transform: `rotate(${props.props.stores.map.rotation}deg)`,
      whiteSpace: 'pre',
    }),

    PingLocationHide: (props:StyleProps) => ({
      display: 'none',
      height: TITLE_HEIGHT,
      position:'absolute',
      textAlign: 'center',
      top: (props.mem.pingY - 25),
      left: (props.mem.pingX - 17),
      //transform: `rotate(${props.props.stores.map.rotation}deg)`,
      whiteSpace: 'pre',
    }),
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

type MapProps = React.PropsWithChildren<BP>

class BaseMember{
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

}


let _menuCanvas = false
export function getMenuStatus():boolean {
  return _menuCanvas
}

let pingEnable:boolean = false
export function getBasePingStatus():boolean {
  return pingEnable
}


export const Base: React.FC<MapProps> = (props: MapProps) => {
  const {map, participants} = props.stores

  const matrix = useObserver(() => map.matrix)
  const container = useRef<HTMLDivElement>(null)
  const outer = useRef<HTMLDivElement>(null)
  function offset():[number, number] {
    return map.offset
  }
  const thirdPersonView = useObserver(() => participants.local.thirdPersonView)
  const memRef = useRef<BaseMember>(new BaseMember())
  const mem = memRef.current

  const center = transformPoint2D(matrix, participants.local.pose.position)
  if (thirdPersonView !== mem.prebThirdPersonView) {
    mem.prebThirdPersonView = thirdPersonView
    if (thirdPersonView) {
      const mapRot = radian2Degree(extractRotation(matrix))
      if (mapRot) {
        const newMatrix = rotateMap(-mapRot, center)
        map.setCommittedMatrix(newMatrix)
      }
    }else {
      const avatarRot = participants.local.pose.orientation
      const mapRot = radian2Degree(extractRotation(matrix))
      if (avatarRot + mapRot) {
        const newMatrix = rotateMap(-(avatarRot + mapRot), center)
        map.setCommittedMatrix(newMatrix)
      }
    }
  }

  //  utility
  function rotateMap(degree:number, center:[number, number]) {
    const changeMatrix = (new DOMMatrix()).rotateSelf(0, 0, degree)
    const newMatrix = transfromAt(center, changeMatrix, matrix)
    map.setMatrix(newMatrix)

    return newMatrix
  }

  //  Mouse and touch operations ----------------------------------------------
  const MOUSE_LEFT = 1
  const MOUSE_RIGHT = 2

  //  zoom by scrollwheel
  function wheelHandler(event:React.WheelEvent) {
    if (!event.ctrlKey) {
      /*  //  translate map
      const diff = mulV2(0.2, rotateVector2D(matrix.inverse(), [event.deltaX, event.deltaY]))
      const newMatrix = matrix.translate(-diff[0], -diff[1])
      map.setMatrix(newMatrix)*/

      //  zoom map
      let scale = Math.pow(1.2, event.deltaY / 100)
      scale = limitScale(extractScaleX(map.matrix), scale)
      //  console.log(`zoom scale:${scale}`)
      if (scale === 1){
        return
      }

      //  console.log(`Wheel: ${movement}  scale=${scale}`)
      const newMatrix = map.matrix.scale(scale, scale, 1,
        ...transformPoint2D(map.matrix.inverse(), map.mouse))
      map.setMatrix(newMatrix)
      map.setCommittedMatrix(newMatrix)
    }
  }
  /* function moveParticipant(move: boolean, givenTarget?:[number,number]) {
    const local = participants.local
    console.log("moving")
    let target = givenTarget
    if (!target){ target = [mem.moveX, mem.moveY] }
    const diff = subV2(target, local.pose.position)
    if (normV(diff) > (givenTarget ? PARTICIPANT_SIZE*2 : PARTICIPANT_SIZE / 10)) {
      const dir = mulV2(20 / normV(diff)/5, diff)
      local.pose.orientation = Math.atan2(dir[0], -dir[1]) * 180 / Math.PI
      if (move) {
        local.pose.position = addV2(local.pose.position, dir)
      }
      local.savePhysicsToStorage(false)
    }
  }
  function moveParticipantPeriodically(move: boolean, target?:[number,number]) {
    moveParticipant(move, target)
    const TIMER_INTERVAL = move ? 0 : 0
    setTimeout(() => {
      //if (mem.mouseDown) {
        moveParticipantPeriodically(true)
      //}
    }, TIMER_INTERVAL) //  move to mouse position
  } */


  function hindleClickStatus() {
    //console.log(mem.clickStatus, " onClick")

    /* mem.clickStatus = ''
    participants.local.pingIcon = false
    participants.local.pingX = 0
    participants.local.pingY = 0
    //participants.local.cursorMove = false
    pingEnable = false
    setPingLocation(false) */




    if(mem.clickStatus === 'single') {
      if(mem.clickEnter) {return}
      //if(pingLocation) {return}

      if(pingLocation) {}

      pingEnable = false
      participants.local.pingIcon = false
      participants.local.pingX = 0
      participants.local.pingY = 0
      //participants.local.cursorMove = false
      setPingLocation(false)

      const moveTimer = setTimeout(() => {
        clearTimeout(moveTimer)
        function moveParticipant(move: boolean) {
          //const local = participants.local
          //const diff = subV2(map.mouseOnMap, local.pose.position)
          const diff = subV2([mem.moveX, mem.moveY], props.stores.participants.local.pose.position)
          if (normV(diff) > PARTICIPANT_SIZE / 10) {
            const dir = mulV2(normV(diff)/5 / normV(diff), diff)
            props.stores.participants.local.pose.orientation = Math.atan2(dir[0], -dir[1]) * 180 / Math.PI
            if (move) {
              props.stores.participants.local.pose.position = addV2(props.stores.participants.local.pose.position, dir)
            }
            props.stores.participants.local.savePhysicsToStorage(false)
            const TIMER_INTERVAL = move ? 0 : 0
              setTimeout(() => { moveParticipant(true) }, TIMER_INTERVAL)
          }
        }
        moveParticipant(false)
      }, 0)
    } else {
      //console.log('double click action goes here and play sound')
      //mem.userAngle = props.stores.participants.loca
      window.clearTimeout(mem.hidePinIcon)
      /////////////////////////////
      //if(pingLocation) {return}
     // if(getRndPingStatus()) {return}
      ////////////////////////////////
      participants.local.pingX = mem.pingX
      participants.local.pingY = mem.pingY
      participants.local.pingIcon = true
      //participants.local.cursorMove = true

      //let audio = new Audio("sound/beep.mp3")
      //audio.play()


      pingEnable = true
      setPingLocation(true)
      mem.hidePinIcon = window.setTimeout(() =>{
        window.clearTimeout(mem.hidePinIcon)
        //if(!pingLocation) {return}
        mem.clickStatus = ''
        participants.local.pingIcon = false
        participants.local.pingX = 0
        participants.local.pingY = 0
        //participants.local.cursorMove = false
        pingEnable = false
        setPingLocation(false)
      }, 3000)
    }
  }


  const bind = useGesture(
    {
      onDragStart: ({buttons, xy}) => {

        document.body.focus()
        mem.dragging = true
        mem.mouseDown = true

        mem.downTime = new Date().getSeconds()
        mem.moveX = map.mouseOnMap[0]
        mem.moveY = map.mouseOnMap[1]

        let itemLocked = getContentLocked()

        //console.log("locked -- ", itemLocked)


        if(showUploadOption) {return}


        //  console.log('Base StartDrag:')
        if (buttons === MOUSE_LEFT) {

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
            if(itemLocked) {return}

            if(mem.mouseDown && showUploadOption === false) {
              //console.log("Open Context Menu")
              mem.zoomX = xy[0]
              mem.zoomY = xy[1]
              mem.contentX = map.mouseOnMap[0]
              mem.contentY = map.mouseOnMap[1]
              _menuCanvas = true
              setShowMenu(true)
              //setShowUploadOption(true)
            }
          }, 500)

          //  move participant to mouse position
          //moveParticipantPeriodically(false)  //  inital rotation.
        }
      },
      onDrag: ({down, delta, xy, buttons}) => {

        if (delta[0] || delta[1]) { mem.mouseDown = false }
        let _menuStatus:boolean = getContextMenuStatus()

        if(_menuStatus) {return}
        if(showMenu) {return}

        //  if (map.keyInputUsers.size) { return }
        if (mem.dragging && down && outer.current) {
          if (!thirdPersonView && buttons === MOUSE_RIGHT) {  // right mouse drag - rotate map
            const center = transformPoint2D(matrix, participants.local.pose.position)
            const target:[number, number] = addV2(xy, offset())
            const radius1 = subV2(target, center)
            const radius2 = subV2(radius1, delta)

            const cosAngle = crossProduct(radius1, radius2) / (vectorLength(radius1) * vectorLength(radius2))
            const flag = crossProduct(rotate90ClockWise(radius1), delta) > 0 ? -1 : 1
            const angle = Math.acos(cosAngle) * flag
            if (isNaN(angle)) {  // due to accuracy, angle might be NaN when cosAngle is larger than 1
              return  // no need to update matrix
            }

            const newMatrix = rotateMap(radian2Degree(angle), center)
            participants.local.pose.orientation = -radian2Degree(extractRotation(newMatrix))
          } else {
            // left mouse drag or touch screen drag - translate map
            const diff = rotateVector2D(matrix.inverse(), delta)
            const newMatrix = matrix.translate(...diff)
            map.setMatrix(newMatrix)
            //  rotate and direct participant to the mouse position.
            if (delta[0] || delta[1]){
              //moveParticipant(false, map.centerOnMap)
            }
            //console.log('Base onDrag:', delta)
          }
        }
      },
      onDragEnd: ({event, xy}) => {


        mem.upXpos = xy[0]
        mem.upYpos = xy[1]
        mem.upTime = new Date().getSeconds()
        let timeDiff = mem.upTime - mem.downTime;

        let _dialogStatus:boolean = isDialogOpen()
        if(_dialogStatus) {return}


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

        //console.log(event?.detail, " DETAILS")
        //////////////////////////////////////////////////////////////


        /* const diff = subV2(map.mouseOnMap, participants.local.pose.position)
        const dir = mulV2(normV(diff) / normV(diff), diff)
        console.log(addV2(props.stores.participants.local.pose.position, dir), " Base ") */
        //console.log(map.mouseOnMap[0], " Base ", map.mouseOnMap[1])

        //console.log(participants.local.mouse.position[0] - participants.local.pose.position[0], " Base F ", participants.local.mouse.position[1]-participants.local.pose.position[1])

        if (event?.detail === 1) {
          mem.clickStatus = 'single'
        } else if (event?.detail === 2) {
          mem.clickStatus = "double"

         /*  mem.pingX = xy[0]
          mem.pingY = xy[1] */
          mem.pingX = participants.local.mouse.position[0] - participants.local.pose.position[0]
          mem.pingY = participants.local.mouse.position[1]-participants.local.pose.position[1]

          /* const diff = subV2(map.mouseOnMap, local.pose.position)
          const dir = mulV2(normV(diff)/5 / normV(diff), diff)
          props.stores.participants.local.pose.position = addV2(props.stores.participants.local.pose.position, dir) */
        }


        mem.clickEnter = true
        const timer = setTimeout(() => {

          clearTimeout(timer);
          if(mem.clickEnter) {
            mem.clickEnter = false
            hindleClickStatus()
          }
        }, 250)
       ////////////////////////////////////////////////////////
          /* const moveTimer = setTimeout(() => {
            clearTimeout(moveTimer)

            function moveParticipant(move: boolean) {

                //const local = participants.local
                //const diff = subV2(map.mouseOnMap, local.pose.position)


                const diff = subV2([mem.moveX, mem.moveY], local.pose.position)

                if (normV(diff) > PARTICIPANT_SIZE / 10) {
                  const dir = mulV2(normV(diff)/5 / normV(diff), diff)
                  local.pose.orientation = Math.atan2(dir[0], -dir[1]) * 180 / Math.PI
                  if (move) {
                    local.pose.position = addV2(local.pose.position, dir)
                  }
                  local.savePhysicsToStorage(false)
                  const TIMER_INTERVAL = move ? 0 : 0
                  if(event?.detail === 1) {
                    setTimeout(() => { moveParticipant(true) }, TIMER_INTERVAL)
                  }
                }
            }
            moveParticipant(false)
          }, 0) */
        }


        if (matrix.toString() !== map.committedMatrix.toString()) {
          map.setCommittedMatrix(matrix)
          //moveParticipant(false, map.centerOnMap)
          //console.log(`Base onDragEnd: (${map.centerOnMap})`)
        }
        mem.dragging = false
        mem.mouseDown = false
        _menuCanvas = false
        setShowMenu(false)
      },
      onPinch: ({da: [d, a], origin, event, memo}) => {
        if (memo === undefined) {
          return [d, a]
        }

        const [md, ma] = memo

        const center = addV2(origin as [number, number], offset())

        const MIN_D = 10
        let scale = d > MIN_D ? d / md : d <  -MIN_D ? md / d : (1 + (d - md) / MIN_D)
        //console.log(`Pinch: da:${[d, a]} origin:${origin}  memo:${memo}  scale:${scale}`)

        scale = limitScale(extractScaleX(matrix), scale)

        const changeMatrix = thirdPersonView ?
          (new DOMMatrix()).scaleSelf(scale, scale, 1) :
          (new DOMMatrix()).scaleSelf(scale, scale, 1).rotateSelf(0, 0, a - ma)

        const newMatrix = transfromAt(center, changeMatrix, matrix)
        map.setMatrix(newMatrix)

        if (!thirdPersonView) {
          participants.local.pose.orientation = -radian2Degree(extractRotation(newMatrix))
        }

        return [d, a]
      },
      onPinchEnd: () => map.setCommittedMatrix(matrix),
      onMove:({xy}) => {
        mem.zoomX = xy[0]
        mem.zoomY = xy[1]

        //console.log(participants.local.trackStates.pingIcon, " moving")

        //if(participants.local.trackStates.pingIcon === false) {
        map.setMouse(xy)
        //}
        if(showMenu) {return}
        participants.local.mouse.position = Object.assign({}, map.mouseOnMap)
      },

      onTouchStart:(ev) => {
        map.setMouse([ev.touches[0].clientX, ev.touches[0].clientY])
        participants.local.mouse.position = Object.assign({}, map.mouseOnMap)
      },
    },
    {
      eventOptions:{passive:false}, //  This prevents default zoom by browser when pinch.
    },
  )

  //  setClientRect of the outer.
  useEffect(
    () => {
      onResizeOuter()
    },
    // eslint-disable-next-line  react-hooks/exhaustive-deps
    [],
  )

  // Prevent browser's zoom
  useEffect(
    () => {
      function topWindowHandler(event:WheelEvent) {
        //console.log(event)
        if (event.ctrlKey) {
          if (window.visualViewport && window.visualViewport.scale > 1){
            if (event.deltaY < 0){
              event.preventDefault()
              //  console.log('prevent', event.deltaY)
            }else{
              //  console.log('through', event.deltaY)
            }
          }else{
            event.preventDefault()
          }
          //  console.log('CTRL + mouse wheel = zoom prevented.', event)
        }
      }


      window.document.body.addEventListener('wheel', topWindowHandler, {passive: false})

      return () => {
        window.document.body.removeEventListener('wheel', topWindowHandler)
      }
    },
    [],
  )
  /*  //  This has no effect for iframe and other cases can be handled by onMove. So this is useless
  //  preview mouse move on outer
  useEffect(
    () => {
      function handler(ev:MouseEvent) {
        map.setMouse([ev.clientX, ev.clientY])
      }
      if (outer.current) {
        outer.current.addEventListener('mousemove', handler, {capture:true})
      }

      return () => {
        if (outer.current) {
          outer.current.removeEventListener('mousemove', handler)
        }
      }
    },
    [outer])
  */
  //  Event handlers when use scroll ----------------------------------------------
  //  Move to center when root div is created.
  /*
  useEffect(
    () => {
      if (outer.current) {
        const elem = outer.current
        console.log('useEffect[outer] called')
        elem.scrollTo((MAP_SIZE - elem.clientWidth) * HALF, (MAP_SIZE - elem.clientHeight) *  HALF)
      }
    },
    [outer],
  )
  if (!showScrollbar) {
    const elem = outer.current
    if (elem) {
      elem.scrollTo((MAP_SIZE - elem.clientWidth) * HALF, (MAP_SIZE - elem.clientHeight) *  HALF)
    }
  }
  */
  // scroll range
  /*  useEffect(
    () => {
      const orgMat = new DOMMatrix(matrix.toString())
      setMatrix(orgMat)
    },
    [outer],
  )
  */
  //  update offset
  const onResizeOuter = useRef(
      () => {
      if (outer.current) {
        let cur = outer.current as HTMLElement
        let offsetLeft = 0
        while (cur) {
          offsetLeft += cur.offsetLeft
          cur = cur.offsetParent as HTMLElement
        }
        //  console.log(`sc:[${outer.current.clientWidth}, ${outer.current.clientHeight}] left:${offsetLeft}`)
        map.setScreenSize([outer.current.clientWidth, outer.current.clientHeight])
        map.setLeft(offsetLeft)
        // map.setOffset([outer.current.scrollLeft, outer.current.scrollTop])  //  when use scroll
      }
    }
  ).current

  const styleProps: StyleProps = {
    matrix,
    props,
    mem,
  }

  //console.log(props.stores.map.mouseOnMap, " m on m")


  const [showMenu, setShowMenu] = useState(false)
  const [showUploadOption, setShowUploadOption] = useState(false)

  const [pingLocation, setPingLocation] = useState(false)

  //const _pingIcon = useObserver(()=> participants.local.pingIcon)

  //console.log("AAAA - ", _pingIcon)


  const classes = useStyles(styleProps)

  function stop(ev:MouseOrTouch|React.PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
  }
  function onClickUploadZone(evt: MouseOrTouch) {
    //onLeaveIcon()
    setShowUploadOption(true)
    setShowMenu(false)
  }

  //console.log(pingLocation, " pL")

  return (
    <div className={classes.root} ref={outer} {...bind()}>
      <ResizeObserver onResize = { onResizeOuter } />
      <div className={classes.center} onWheel={wheelHandler}>
        <div id="map-transform" className={classes.transform} ref={container}>
            {props.children}
        </div>
      </div>

      {/* Add Context Menu */}
      <div className={showMenu ? classes.showMenuContainer : classes.hideMenuContainer}>
      <Tooltip placement="bottom" title={showMenu ? t('ctUploadZone') : ''} >
          <div className={classes.uploadZone} onMouseUp={onClickUploadZone}
            onTouchStart={stop} /* onMouseLeave={() => setTimeout(()=>{setShowMenu(false)},100)} */>
              <img src={UploadShare} height={TITLE_HEIGHT} width={TITLE_HEIGHT} alt=""/>
          </div>
        </Tooltip>
      <div className={classes.dashedCircle}></div>
      </div>
      {/* <div className={(pingLocation && _pingIcon) ? classes.PingLocation:classes.PingLocationHide}>
        <img src={PingIcon} width={TITLE_HEIGHT} alt=""/>
      </div> */}
      <ShareDialog {...props} open={showUploadOption} onClose={() => setShowUploadOption(false)} cordX={mem.contentX} cordY={mem.contentY} origin={'contextmenu'} _type={'menu'}/>
    </div>
  )
}
Base.displayName = 'MapBase'

