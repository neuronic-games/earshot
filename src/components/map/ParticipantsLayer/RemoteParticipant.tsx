import {MoreButton, moreButtonControl, MoreButtonMember} from '@components/utils/MoreButton'
import {makeStyles} from '@material-ui/core/styles'
import { connection } from '@models/api'
import participants from '@stores/participants/Participants'
import {RemoteParticipant as RemoteParticipantStore} from '@stores/participants/RemoteParticipant'
import {useObserver} from 'mobx-react-lite'
//import React from 'react'
import {Participant, ParticipantProps} from './Participant'
import {RemoteParticipantForm} from './RemoteParticipantForm'

////////////////////////////////////////////////////////////////////
import {addV2, assert, mulV2, subV2} from '@models/utils'
import {DragHandler, DragState} from '../../utils/DragHandler'
import {MAP_SIZE} from '@components/Constants'
import React, {useEffect} from 'react'
import { MessageType } from '@models/api/MessageType'



const AVATAR_SPEED_LIMIT = 50
const MAP_SPEED_LIMIT = 600
const MAP_SPEED_MIN = 100
const HALF_DEGREE = 180
const WHOLE_DEGREE = 360
////////////////////////////////////////////////////////////////////

interface RemoteParticipantMember extends MoreButtonMember{
  timeout:NodeJS.Timeout|undefined

  ////////////////////////////////////////////////////////////////////
  smoothedDelta: [number, number]
  scrollAgain: boolean
  ////////////////////////////////////////////////////////////////////
}

interface StyleProps {
  position: [number, number],
  size: number,
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
})


let isMoved:boolean = false
export function checkIsRemoteMoved():boolean {
  return isMoved
}
export function resetIsRemoteMoved() {
  isMoved = false
}

export const RemoteParticipant: React.FC<ParticipantProps> = (props) => {
  const member = React.useRef<RemoteParticipantMember>({} as RemoteParticipantMember).current
  const [showMore, setShowMore] = React.useState(false)
  const moreControl = moreButtonControl(setShowMore, member)



  ////////////////////////////////////////////////////////////////////
  //const [showConfig, setShowConfig] = React.useState(false)
  ////////////////////////////////////////////////////////////////////


  const [showForm, setShowForm] = React.useState(false)
  const [color] = props.participant.getColor()

  ////////////////////////////////////////////////////////////////////
  //console.log(connection.conference._jitsiConference?.isModerator(), " isHost")
  const isHost = connection.conference._jitsiConference?.isModerator()
  const map = props.stores.map
  //const participants = props.stores.participants
  const participant = props.participant
  assert(props.participant.id === participant.id)
  //const [pose, setPose] = React.useState(participant!.pose.position)

  //const storeParticipant = props.stores.participants.find(participant.id)

  //console.log(storeParticipant?.pose.position, " posistion")

////////////////////////////////////////////////////////////////////


  const styleProps = useObserver(() => ({
    position: props.participant.pose.position,
    size: props.size,
  }))
  const classes = useStyles(styleProps)
  function switchYarnPhone(ev:React.MouseEvent<HTMLDivElement>, id:string){
    if (showForm){ return }
    if (participants.yarnPhones.has(id)) {
      participants.yarnPhones.delete(id)
    }else {
      participants.yarnPhones.add(id)
    }
    participants.yarnPhoneUpdated = true
  }
  function onClose() {
    props.stores.map.keyInputUsers.delete('remoteForm')
    setShowForm(false)
  }
  function openForm() {
    props.stores.map.keyInputUsers.add('remoteForm')
    setShowForm(true)
  }
  const buttonRef=React.useRef<HTMLButtonElement>(null)


////////////////////////////////////////////////////////////////////
  const moveParticipant = (state: DragState<HTMLDivElement>) => {
    if(isHost === false) {return}

    //console.log(participant!.information.name, " ----- ", participant!.pose)
    //  move local participant

    let delta = subV2(state.xy, map.toWindow(participant!.pose.position))
    const norm = Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1])
    if (norm > AVATAR_SPEED_LIMIT) {
      delta = mulV2(AVATAR_SPEED_LIMIT / norm, delta)
    }

    //if (participants.local.thirdPersonView) {
      const remoteDelta = map.rotateFromWindow(delta)  // transform.rotateG2L(delta)

      participant!.pose.position = addV2(participant!.pose.position, remoteDelta)

      //storeParticipant!.pose.position = addV2(storeParticipant!.pose.position, remoteDelta)

      const SMOOTHRATIO = 0.8
      if (!member.smoothedDelta) { member.smoothedDelta = [delta[0], delta[1]] }
      member.smoothedDelta = addV2(mulV2(1 - SMOOTHRATIO, remoteDelta), mulV2(SMOOTHRATIO, member.smoothedDelta))
      const dir = Math.atan2(member.smoothedDelta[0], -member.smoothedDelta[1]) * HALF_DEGREE / Math.PI
      let diff = dir - participant!.pose.orientation
      if (diff < -HALF_DEGREE) { diff += WHOLE_DEGREE }
      if (diff > HALF_DEGREE) { diff -= WHOLE_DEGREE }
      const ROTATION_SPEED = 0.2
      participant!.pose.orientation += diff * ROTATION_SPEED

      /////////////////////////////////////////////////////////////////////////////////////////
      //Object.assign(participant!.pose.position, [100, 200])
      /* participant.trackStates.remoteID = participant!.id
      participant.trackStates.remoteX = participant!.pose.position[0]
      participant.trackStates.remoteY = participant!.pose.position[1] */
      // To Send Message to Conference
      //setPose(Object.assign({}, participant!.pose.position))
      //participant!.pose
    //} else {
      //participant!.pose.position = addV2(map.rotateFromWindow(delta), //    transform.rotateG2L(delta),
                                         //participant!.pose.position)
      //console.log('2 change')
    //}
    //participant.setPhysics({pose: participant.pose.position})
    //participants.savePhysicsToStorage(false)

    //participant.setPhysics({})
    //Object.assign({}, participant.pose)
    //participant.pose = Object.assign({}, participant.pose)
    //setPose(Object.assign({}, participant.pose))
    //Object.assign({}, participant!.pose)
    //connection.conference.sendMessage(MessageType.PARTICIPANT_POSE, participant.id)
    //////////////////////////////////////////////////////////////////////////////////////



    // New Message Type
    // Create message type that receive partipant id, and its dragged position and update it accordingly
    //connection.conference.sendMessage(MessageType.UPDATE_POSE, participant.id, participant!.pose.position)
    connection.conference.sendMessage(MessageType.UPDATE_POSE, participant.id)

  }

  const scrollMap = () => {
    const posOnScreen = map.toWindow(participant!.pose.position)
    const target = [posOnScreen[0], posOnScreen[1]]
    const RATIO = 0.2
    const left = map.left + map.screenSize[0] * RATIO
    const right = map.left + map.screenSize[0] * (1 - RATIO)
    const bottom = map.screenSize[1] * (1 - RATIO)
    const top = participants.local.thirdPersonView ? map.screenSize[1] * RATIO : bottom
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
    //console.log(state.event?.type, " state.dragging")

    //console.log(isMoved, " check is moved")
    //if (state.dragging) {
    if(state.event?.type === 'pointermove') {
      //isMoved = true
      onDrag(state)
    } else {
      isMoved = false
    }
    const rv = scrollMap()
    //  console.log(`onTimer: drag:${state.dragging} again:${rv}`)
    return rv
  }

  const onDrag = (state:DragState<HTMLDivElement>) => {
    //  console.log('participant onDrag')
    moveParticipant(state)
  }

  //  pointer drag
  const TIMER_INTERVAL = 33
  const drag = DragHandler<HTMLDivElement>(onDrag, 'dragHandle',
                                               onTimer, TIMER_INTERVAL, () => { /* setShowConfig(true) */ })
  useEffect(() => {
    drag.target.current?.focus({preventScroll:true})
  })
  //const ref = React.useRef<HTMLButtonElement>(null)
  ////////////////////////////////////////////////////////////////////

  return (
    <div /* ref={drag.target} {...drag} */ {...moreControl}
      onClick = {(ev)=>switchYarnPhone(ev, props.participant.id)}
      onContextMenu={(ev) => {ev.preventDefault(); openForm()}}
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
    </div>
  )
}

