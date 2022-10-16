import {MoreButton, moreButtonControl, MoreButtonMember} from '@components/utils/MoreButton'
import {makeStyles} from '@material-ui/core/styles'
import participants from '@stores/participants/Participants'
import {RemoteParticipant as RemoteParticipantStore} from '@stores/participants/RemoteParticipant'
import {useObserver} from 'mobx-react-lite'
import React, { useRef } from 'react'
import {Participant, ParticipantProps} from './Participant'
import {RemoteParticipantForm} from './RemoteParticipantForm'


import {isDialogOpen} from "@components/footer/share/ShareDialog"
import CallIcon from '@images/earshot_icon_mic.png'
import YarnPhoneIcon from '@images/earshot_icon_btn-earshot-2.png'
import ChatIcon from '@images/earshot_icon_btn-chat.png'
import FocusIcon from '@images/earshot_icon_btn-extract.png'
import KickIcon from '@images/earshot_icon_btn-kick.png'
import chat from '@stores/Chat'
import { TITLE_HEIGHT } from '@stores/sharedContents/SharedContents'

import { useTranslation } from '@models/locales'
import { getContentDialogStatus, getContentLocked, isOnContentStatus, MouseOrTouch } from '../Share/RndContent'
import { useGesture } from 'react-use-gesture'
import { Dialog, DialogContent, Tooltip, Zoom } from '@material-ui/core'
import { isSmartphone } from '@models/utils'
import { conference } from '@models/conference'
import { MessageType } from '@models/conference/DataMessageType'

/* const AVATAR_SPEED_LIMIT = 50
const MAP_SPEED_LIMIT = 600
const MAP_SPEED_MIN = 100
const HALF_DEGREE = 180
const WHOLE_DEGREE = 360 */
///////////////////////////////////////////////


interface RemoteParticipantMember extends MoreButtonMember{
  timeout:NodeJS.Timeout|undefined

  ///////////////////////////////////
  smoothedDelta: [number, number]
  scrollAgain: boolean
  ///////////////////////////////////
}

interface StyleProps {
  position: [number, number],
  size: number,
  // For hover listen
  callMouseEnter: boolean
  yarnMouseEnter: boolean
  chatMouseEnter: boolean
  focusMouseEnter: boolean
  kickMouseEnter: boolean
}
const useStyles = makeStyles({
  more: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.5 ,
    height: props.size * 0.5,
    left: props.position[0] + props.size * 0.4,
    top: props.position[1] - props.size * 0.8,
    opacity: '0',
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
    /* transform: isSmartphone() ? 'scale(2.8)' : 'scale(1.2)', */
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

  callIcon: (props:StyleProps) => ({
    display: 'block',
    /* height: TITLE_HEIGHT, */
    position:'absolute',
    textAlign: 'center',
    top: 90,
    left: 64,
    whiteSpace: 'pre',
    cursor: 'default',
    background: props.callMouseEnter ? 'black' : '#9e886c',
    opacity: 0.2,
    /* ...buttonStyle */
    margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',
  }),

  yarnPhoneIcon: (props:StyleProps) => ({
    display: 'block',
    /* height: TITLE_HEIGHT, */
    position:'absolute',
    textAlign: 'center',
    top: 44,
    left: 90,
    whiteSpace: 'pre',
    cursor: 'default',
    //background: '#9e886c',
    //background: participants.yarnPhones.size > 0 ? '#ef4623' : '#9e886c',
    background: props.yarnMouseEnter ? (participants.yarnPhones.size > 0 ? 'black' : 'black') : participants.yarnPhones.size > 0 ? '#ef4623' : '#9e886c',
    //...buttonStyle
    /* ...participants.yarnPhones.size > 0 ? buttonStyleActive : buttonStyle */
    margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',
  }),

  chatIcon: (props:StyleProps) => ({
    display: 'block',
    /* height: TITLE_HEIGHT, */
    position:'absolute',
    textAlign: 'center',
    top: 23,
    left: 140,
    whiteSpace: 'pre',
    cursor: 'default',
    /* background: '#9e886c', */
   /*  ...buttonStyle */
   background: props.chatMouseEnter ? 'black' : '#9e886c',
   margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',
  }),

  focusIcon: (props:StyleProps) => ({
    display: 'block',
    /* height: TITLE_HEIGHT, */
    position:'absolute',
    textAlign: 'center',
    top: 40, //23, //40,
    left: 190, //140, //190,
    whiteSpace: 'pre',
    cursor: 'default',
    /* background: '#9e886c', */
    /* ...buttonStyle */
    background: props.focusMouseEnter ? 'black' : '#9e886c',
    margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',
  }),

  kickIcon: (props:StyleProps) => ({
    display: 'block',
    /* height: TITLE_HEIGHT, */
    position:'absolute',
    textAlign: 'center',
    top: 85, //40, //85,
    left:217, //190, //217,
    whiteSpace: 'pre',
    cursor: 'default',
    /* background: '#9e886c', */
    /* ...buttonStyle */
    background: props.kickMouseEnter ? 'black' : '#9e886c',
    margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',
  }),
})

/* const buttonStyle = {
  '&': {
    margin: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    padding: '3px',
  },

  '&:hover': {
    backgroundColor: 'black',
    margin: '5px',
    padding: '3px',
    borderRadius: '50%',
  },
  '&:active': {
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
} */

class RemoteMember{
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


let isMoved:boolean = false
export function checkIsRemoteMoved():boolean {
  return isMoved
}
export function resetIsRemoteMoved() {
  isMoved = false
}

let onRemoteUser:boolean = false
export function getOnRemote():boolean {
  return onRemoteUser
}

let remoteMenuOpen:boolean = false
export function getRemoteMenuStatus():boolean {
  return remoteMenuOpen;
}

export const RemoteParticipant: React.FC<ParticipantProps> = (props) => {
  const member = React.useRef<RemoteParticipantMember>({} as RemoteParticipantMember).current
  const [showMore, setShowMore] = React.useState(false)
  const moreControl = moreButtonControl(setShowMore, member)
  const [showForm, setShowForm] = React.useState(false)
  const [color] = props.participant.getColor()

  /////////////////////////////////////////////////

  const memRef = useRef<RemoteMember>(new RemoteMember())
  const mem = memRef.current
  const [showMenu, setShowMenu] = React.useState(false)

  ////////////////////////////////////////////////////////////////////
  //console.log(connection.conference._jitsiConference?.isModerator(), " isHost")
  /* const isHost = connection.conference._jitsiConference?.isModerator() */
  const map = props.stores.map
  //const participants = props.stores.participants
  /* const participant = props.participant */
 //assert(props.participant.id === participant.id)

  ////////////////////////////////////////////////////////////
  const [isCallMouseEnter, setIsCallMouseEnter] = React.useState(false)
  const [isYarnMouseEnter, setIsYarnMouseEnter] = React.useState(false)
  const [isFocusMouseEnter, setIsFocusMouseEnter] = React.useState(false)
  const [isChatMouseEnter, setIsChatMouseEnter] = React.useState(false)
  const [isKickMouseEnter, setIsKickMouseEnter] = React.useState(false)

  const styleProps = useObserver(() => ({
    position: props.participant.pose.position,
    size: props.size,
    callMouseEnter: isCallMouseEnter,
    yarnMouseEnter: isYarnMouseEnter,
    chatMouseEnter: isChatMouseEnter,
    focusMouseEnter: isFocusMouseEnter,
    kickMouseEnter: isKickMouseEnter,
  }))



  const classes = useStyles(styleProps)

  const {t} = useTranslation()

  /* function switchYarnPhone(ev:React.MouseEvent<HTMLDivElement>, id:string){
    if (showForm){ return }
    if (participants.yarnPhones.has(id)) {
      participants.yarnPhones.delete(id)
    }else {
      participants.yarnPhones.add(id)
    }
    participants.yarnPhoneUpdated = true
  } */
  function onClose() {
    props.stores.map.keyInputUsers.delete('remoteForm')
    setShowForm(false)
  }
  function openForm() {
    props.stores.map.keyInputUsers.add('remoteForm')
    setShowForm(true)
  }
  const buttonRef=React.useRef<HTMLButtonElement>(null)

  function stop(ev:MouseOrTouch|React.PointerEvent) {
    ev.stopPropagation()
    ev.preventDefault()
  }

  ////////////////////////////////////////////////////////////////////////
  const MOUSE_LEFT = 1
  //const MOUSE_RIGHT = 2
  const bind = useGesture(
    {
      onDragStart: ({buttons, xy, event}) => {

        event?.preventDefault()

        document.body.focus()
        mem.dragging = true
        mem.mouseDown = true

        onRemoteUser = true

        mem.downTime = new Date().getSeconds()
        mem.moveX = map.mouseOnMap[0]
        mem.moveY = map.mouseOnMap[1]


        let itemLocked = getContentLocked()
        let _onContent = isOnContentStatus()

        //let _onRemoteUser = getOnRemote()
        let _dialogStatus:boolean = isDialogOpen()

        let _contentDialogStatus:boolean = getContentDialogStatus()
        if(_contentDialogStatus) {return}
        if(_dialogStatus) {return}

        //console.log(_onRemoteUser, " onRemoteUser")

        //if(showUploadOption) {return}
        if(_onContent) {return}
        //if(_onRemoteUser) {return}

        //  console.log('Base StartDrag:')
        if (buttons === MOUSE_LEFT || buttons === 0) {

          mem.downTime = new Date().getSeconds()
          mem.downXpos = xy[0]
          mem.downYpos = xy[1]

          //console.log(props.participant.mouse.position[0], " Mouse---- ", xy[0], " ---Pose ", props.participant.pose.position[0])

          ////////////////////////////////////////////////
          //const local = participants.local
          /* const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
          for (const [i] of remotes.entries()) {
            let remoteX = Number(participants.remote.get(remotes[i])?.pose.position[0])
            let remoteY = Number(participants.remote.get(remotes[i])?.pose.position[1])
            let mouseX = Number(map.mouseOnMap[0])
            let mouseY = Number(map.mouseOnMap[1])
            if(mouseX >= (remoteX-30) && mouseX <= (remoteX+30) && mouseY >= (remoteY-30) && mouseY <= (remoteY+30)) {
              return
            }
          } */
          ////////////////////////////////////////////////
          const downTimer = setTimeout(() => {
            clearTimeout(downTimer)
            if(itemLocked) {return}

            let diffX = mem.downXpos - mem.cursorX
            let diffY = mem.downYpos - mem.cursorY

            //console.log(diffX, " ---- ", diffY)

            if(mem.mouseDown && diffX === 0 && diffY === 0 /* && showUploadOption === false */) {
              //console.log("Open Context Menu")
              mem.zoomX = xy[0]
              mem.zoomY = xy[1]


              // Resetting the pos
             /*  if(props.participant.pose.position[0] < 0) {
                mem.downXpos = (xy[0] - (Math.abs(props.participant.pose.position[0]) - Math.abs(props.participant.mouse.position[0])))
              } else {
                mem.downXpos = (xy[0] - (Math.abs(props.participant.mouse.position[0]) - Math.abs(props.participant.pose.position[0])))
              }

              if(props.participant.pose.position[1] < 0) {
                mem.downYpos = (xy[1] - (Math.abs(props.participant.pose.position[1]) - Math.abs(props.participant.mouse.position[1])))
              } else {
                mem.downYpos = (xy[1] - (Math.abs(props.participant.mouse.position[1]) - Math.abs(props.participant.pose.position[1])))
              } */

              mem.contentX = map.mouseOnMap[0]
              mem.contentY = map.mouseOnMap[1]
              //_menuCanvas = true
              remoteMenuOpen = true
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

        let _dialogStatus:boolean = isDialogOpen()

        //console.log()
        let _contentDialogStatus:boolean = getContentDialogStatus()
        if(_contentDialogStatus) {return}

        if(_dialogStatus) {return}


        /* if((mem.upXpos >= (mem.downXpos-20) && mem.upXpos <= (mem.downXpos+20) && (mem.upYpos >= (mem.downYpos-20) && mem.upYpos <= (mem.downYpos+20))) && String(Object(event?.target).tagName) === "DIV" && timeDiff < 1) {
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
        } */

        if(timeDiff === 0) {
          //switchYarnPhoneID(props.participant.id)
        }

        mem.dragging = false
        mem.mouseDown = false
        onRemoteUser = false
        setShowMenu(false)
        const resetTimer = setTimeout(() => {
          clearInterval(resetTimer)
          remoteMenuOpen = false
        }, 250)
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
        onRemoteUser = true
        map.setMouse([ev.touches[0].clientX, ev.touches[0].clientY])
        participants.local.mouse.position = Object.assign({}, map.mouseOnMap)
      },

      onTouchEnd:(e) => {
        //console.log(e.changedTouches)
        var changedTouch = e.changedTouches[0];
        var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
        // Menu Functionality
        if(elem?.nodeName === "IMG" && elem?.id === "rsCall") {
        } else if(elem?.nodeName === "IMG" && elem?.id === "yarnPhone") {
          onConnectYarnPhone(e)
        } else if(elem?.nodeName === "IMG" && elem?.id === "yarnChat") {
          onSendChatTo(e)
        } else if(elem?.nodeName === "IMG" && elem?.id === "focusCenter") {
          onFocusCenter(e)
        } else if(elem?.nodeName === "IMG" && elem?.id === "kickUser") {
          onUserKick(e)
        }
        onRemoteUser = false
      }
    },
    {
      eventOptions:{passive:false}, //  This prevents default zoom by browser when pinch.
    },
  )

  ///////////////////////////////////////
  function onConnectYarnPhone(ev:MouseOrTouch) {
    if (!props.participant) { return }
    if (participants.yarnPhones.has(props.participant.id)){
      participants.yarnPhones.delete(props.participant.id)
    }else{
      participants.yarnPhones.add(props.participant.id)
    }
  }

  function onFocusCenter(ev:MouseOrTouch) {
    if (!props.participant) { return }
    props.stores.map.focusOn(props.participant)
  }

  function onUserKick(ev:MouseOrTouch) {
    if (!props.participant) { return }
    //conference.dataConnection.(props.participant.id)
    setTimeout(()=>{conference.dataConnection.sendMessage(
      MessageType.KICK, 'Kicked by Host.', props.participant!.id)}, 5000)
  }

  function onSendChatTo(ev:MouseOrTouch) {
    if (!props.participant) { return }
    chat.sendTo = props.participant.id
  }
 ///////////////////////////////////////////////////////////////////////
 function handleMouseEnter(event:MouseOrTouch) {
  let menuType = (Object(event.target)).id
  if(menuType === 'callDiv' || menuType === 'rsCAll') {
    setIsCallMouseEnter(true)
  } else  if(menuType === 'yarnDiv' || menuType === 'yarnPhone') {
    setIsYarnMouseEnter(true)
  } else  if(menuType === 'chatDiv' || menuType === 'yarnChat') {
    setIsChatMouseEnter(true)
  } else  if(menuType === 'focusDiv' || menuType === 'focusCenter') {
    setIsFocusMouseEnter(true)
  } else  if(menuType === 'kickDiv' || menuType === 'kickUser') {
    setIsKickMouseEnter(true)
  }
}

function handleMouseOut(event:MouseOrTouch) {
  let menuType = (Object(event.target)).id
  if(menuType === 'callDiv' || menuType === 'rsCAll') {
    setIsCallMouseEnter(false)
  } else  if(menuType === 'yarnDiv' || menuType === 'yarnPhone') {
    setIsYarnMouseEnter(false)
  } else  if(menuType === 'chatDiv' || menuType === 'yarnChat') {
    setIsChatMouseEnter(false)
  } else  if(menuType === 'focusDiv' || menuType === 'focusCenter') {
    setIsFocusMouseEnter(false)
  } else  if(menuType === 'kickDiv' || menuType === 'kickUser') {
    setIsKickMouseEnter(false)
  }
}

///////////////////////////////////////////////////////////////////////

  return (
    <div {...moreControl} {...bind()}
      /* onClick = {(ev)=>switchYarnPhone(ev, props.participant.id)} */

      /* onContextMenu={(ev) => {ev.preventDefault(); openForm()}} */
    >
      <Participant {...props} isLocal={false}/>
      <MoreButton show={showMore} className={classes.more} htmlColor={color} {...moreControl}
      buttonRef={buttonRef}
      onClickMore = {(ev)=>{
        ev.stopPropagation()
        openForm()
      }} />
      <RemoteParticipantForm open={showForm} close={onClose} stores={props.stores}
        participant={props.participant as RemoteParticipantStore}
        anchorEl={buttonRef.current} anchorOrigin={{vertical:'top', horizontal:'left'}}
        anchorReference = "anchorEl"
      />
      {/* // Context Menu */}
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
            <Tooltip placement="left" title={showMenu ? t('rsCall') : ''}>
                <div id='callDiv' className={classes.callIcon}
                  onTouchStart={stop}>
                    <img id='rsCall' src={CallIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} style={{transform:'scale(1.2)'}} alt=""/>
                </div>
              </Tooltip>
              <Tooltip placement="left" title={showMenu ? t('rsConnectYarnPhone') : ''}>
              <div id='yarnDiv' className={classes.yarnPhoneIcon} onMouseUp={onConnectYarnPhone}
                  onTouchStart={stop}>
                    <img id='yarnPhone' src={YarnPhoneIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} style={{transform:'scale(1.2)'}} alt=""/>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={showMenu ? t('rsChatTo') : ''}>
              <div id='chatDiv' className={classes.chatIcon} onMouseUp={onSendChatTo}
                  onTouchStart={stop}>
                    <img id='yarnChat' src={ChatIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} style={{transform:'scale(1.2)'}} alt=""/>
                </div>
              </Tooltip>
              <Tooltip placement="right" title={showMenu ? t('ctFocus') : ''}>
              <div id='focusDiv' className={classes.focusIcon} onMouseUp={onFocusCenter}
                  onTouchStart={stop}>
                    <img id='focusCenter' src={FocusIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} style={{transform:'scale(1.2)'}} alt=""/>
                </div>
              </Tooltip>
              <Tooltip placement="right" title={showMenu ? t('ctKick') : ''}>
              <div id='kickDiv' className={classes.kickIcon} onMouseUp={onUserKick}
                  onTouchStart={stop}>
                    <img id='kickUser' src={KickIcon} onMouseEnter={handleMouseEnter} onMouseOut={handleMouseOut} height={TITLE_HEIGHT} width={TITLE_HEIGHT} style={{transform:'scale(1.2)'}} alt=""/>
                </div>
              </Tooltip>
            <div className={classes.dashedCircle}></div>
            </div>
          </Zoom>
        </DialogContent>
      </Dialog>
    </div>
  )
}
