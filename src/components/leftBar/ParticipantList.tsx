import {ImageAvatar} from '@components/avatar/ImageAvatar'
import {LocalParticipantForm} from '@components/map/ParticipantsLayer/LocalParticipantForm'
import {RemoteParticipantForm} from '@components/map/ParticipantsLayer/RemoteParticipantForm'
import {BMProps} from '@components/utils'
import {Tooltip} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import {connection} from '@models/api'
import {MessageType} from '@models/api/MessageType'
import {getColorOfParticipant} from '@models/Participant'
/* import {isDarkColor} from '@models/utils' */
import {ParticipantBase} from '@stores/participants/ParticipantBase'
import {autorun} from 'mobx'
import {useObserver} from 'mobx-react-lite'
import React from 'react'
import {styleForList} from '../utils/styles'
import {TextLineStyle} from './LeftBar'
import {StatusDialog} from './StatusDialog'
import goodConnIcon from '@images/earshot_icon_quality_3.png'
import averageConnIcon from '@images/earshot_icon_quality_2.png'
import badConnIcon from '@images/earshot_icon_quality_1.png'
import {isSmartphone} from '@models/utils'




// config.js
declare const config:any             //  from ../../config.js included from index.html

export const ParticipantLine: React.FC<TextLineStyle&BMProps&{participant: ParticipantBase}> = (props) => {
  const map = props.stores.map
  const name = useObserver(() => (props.participant.information.name))
  const avatarSrc = useObserver(() => (props.participant.information.avatarSrc))
  const colors = useObserver(() => getColorOfParticipant(props.participant.information))
  const size = useObserver(() => props.lineHeight)
  const classes = styleForList({height:props.lineHeight, fontSize:props.fontSize})
  const [showForm, setShowForm] = React.useState(false)
  const ref = React.useRef<HTMLButtonElement>(null)
  const {lineHeight, ...propsForForm} = props
  //  console.log(`PColor pid:${props.participant.id} colors:${colors}`, props.participant)

  const _connQuality = useObserver(() => props.participant.quality?.connectionQuality)
  const zoneName = useObserver(() => {
    let remotes = Array.from(props.stores.participants.remote.keys()).filter(key => key !== props.stores.participants.localId)
    for(let [i] of remotes.entries()) {
      if(props.stores.participants.remote.get(remotes[i])?.closedZone !== undefined) {
        if(props.stores.participants.remote.get(remotes[i])?.id === props.participant.id && props.stores.participants.remote.get(remotes[i])?.closedZone?.name !== '') {
          return ' (' + props.stores.participants.remote.get(remotes[i])?.closedZone?.name + ')'
        }
      } else {
        return ''
      }
    }
  })

  const localZone = useObserver(() => (props.stores.participants.local.zone?.name !== undefined && props.stores.participants.local.zone?.name !== '') ? ' ('+props.stores.participants.local.zone?.name+')' : '')

  function onClick(){
    if (props.participant.physics.located){
      map.focusOn(props.participant)
    }else{
      if(config.bmRelayServer){
        connection.conference.pushOrUpdateMessageViaRelay(
          MessageType.REQUEST_PARTICIPANT_STATES, [props.participant.id])
      }
      const disposer = autorun(()=>{
        if (props.participant.physics.located){
          map.focusOn(props.participant)
          disposer()
        }
      })
    }
  }
  function onContextMenu(){
    if (props.participant.physics.located){
      setShowForm(true)
      map.keyInputUsers.add('participantList')
    }else{
      if(config.bmRelayServer){
        connection.conference.pushOrUpdateMessageViaRelay(
          MessageType.REQUEST_PARTICIPANT_STATES, [props.participant.id])
      }
      const disposer = autorun(()=>{
        if (props.participant.physics.located){
          setShowForm(true)
          map.keyInputUsers.add('participantList')
          disposer()
        }
      })
    }
  }

  return <>
    <Tooltip title={<span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{`${props.participant.information.name} (${props.participant.id})`}</span>} placement="right">
      <div className={classes.outer} /* style={{margin:'1px 0 1px 0'}} */ style={{margin:'1px 0 1px 10px'}}>
        <IconButton style={{margin:0, padding:0, marginTop: '5px', marginLeft:isSmartphone() ? '10px' : '5px'}} onClick={onClick} onContextMenu={onContextMenu}>
          <ImageAvatar border={true} colors={colors} /* size={size} */ size={(isSmartphone() ? (size * 3.2) : (size * 2))} name={name} avatarSrc={avatarSrc} />
        </IconButton>
        <Button /* variant="contained" */ className={classes.line} ref={ref}
          style={{/* backgroundColor:colors[0],  */color:'#FFFFFF'/* colors[1] */, textTransform:'none', marginLeft:'10px', marginTop: '5px', fontWeight: 'bold', fontSize: isSmartphone() ? '2em' : '1em'}}
          onClick={onClick} onContextMenu={onContextMenu}>
            {name}
            <div style={{color:'#EDA741', letterSpacing:'0px', position:'relative', marginLeft:'5px', fontSize:isSmartphone() ? '1.5em' : '1em'}}>{(props.stores.participants.localId === props.participant.id) ? localZone : zoneName}</div>
        </Button>
        <div style={{position:'absolute', width:'10px', height:'10px', /* backgroundColor:'yellow', */ right:isSmartphone() ? '50px' : '25px', marginTop: '2px',}}>
            {(_connQuality !== undefined && _connQuality > 80) ? <img width={isSmartphone() ? '60px' : '40px'} height={isSmartphone() ? '60px' : '40px'} src={goodConnIcon} draggable={false} style={{userSelect:'none'}} alt='' /> : (_connQuality !== undefined && _connQuality < 80 && _connQuality > 50) ? <img width={isSmartphone() ? '60px' : '40px'} height={isSmartphone() ? '60px' : '40px'} src={averageConnIcon} draggable={false} style={{userSelect:'none'}} alt='' /> : <img width={isSmartphone() ? '60px' : '40px'} height={isSmartphone() ? '60px' : '40px'} src={badConnIcon} draggable={false} style={{userSelect:'none'}} alt='' /> }
        </div>
      </div>
    </Tooltip>
    {props.participant.id === props.stores.participants.localId ?
      <LocalParticipantForm stores={props.stores} open={showForm} close={()=>{
        setShowForm(false)
        map.keyInputUsers.delete('participantList')
      }} anchorEl={ref.current} anchorOrigin={{vertical:'top', horizontal:'right'}} /> :
      <RemoteParticipantForm {...propsForForm} open={showForm} close={()=>{
        setShowForm(false)
        map.keyInputUsers.delete('participantList')
      }} participant={props.stores.participants.remote.get(props.participant.id)}
        anchorEl={ref.current} anchorOrigin={{vertical:'top', horizontal:'right'}} />
    }
  </>
}

export const RawParticipantList: React.FC<BMProps&TextLineStyle&{localId: string, remoteIds: string[]}> = (props) => {
  const [showStat, setShowStat] = React.useState(false)
  const participants = props.stores.participants
  /* const roomInfo = props.stores.roomInfo */
  const classes = styleForList({height: props.lineHeight, fontSize: props.fontSize})
  const {localId, remoteIds, lineHeight, fontSize, ...statusProps} = props
  const lineProps = {lineHeight, fontSize, ...statusProps}
  //const textColor = useObserver(() => isDarkColor(roomInfo.backgroundFill) ? 'white' : 'black')

  remoteIds.sort((a, b) => {
    const pa = participants.remote.get(a)
    const pb = participants.remote.get(b)
    let rv = pa!.information.name.localeCompare(pb!.information.name, undefined, {sensitivity: 'accent'})
    if (rv === 0) {
      rv = (pa!.information.avatarSrc || '').localeCompare(pb!.information.avatarSrc || '', undefined, {sensitivity: 'accent'})
    }

    return rv
  })
  const remoteElements = remoteIds.map(id =>
    <ParticipantLine key={id}
      participant={participants.remote.get(id)!}
      {...lineProps} />)
  const localElement = (<ParticipantLine key={localId} participant={participants.local} {...lineProps} />)
  const ref = React.useRef<HTMLDivElement>(null)

  return (
    <div className={classes.container} >
      <div className={classes.title} style={{color:'#FFFFFF90'/* textColor */, marginLeft: isSmartphone() ? '14px' : '8px', padding:'10px', borderRadius:'5px', /* border:'1px dotted #FFFFFF80', */ marginTop:'5px', userSelect:'text', fontWeight:'bold', fontSize:isSmartphone() ? '2em' : '1em'}} ref={ref}
        onClick={()=>{setShowStat(true)}}
     /*  >{(participants.remote.size + 1).toString()} in {connection.conference.name}</div> */
     >{connection.conference.name} ({(participants.remote.size + 1).toString()})</div>
      <StatusDialog open={showStat}
        close={()=>{setShowStat(false)}} {...statusProps} anchorEl={ref.current}/>
      {localElement}{remoteElements}
    </div>
  )
}
RawParticipantList.displayName = 'ParticipantList'

export const ParticipantList = React.memo<BMProps&TextLineStyle>(
  (props) => {
    const localId = useObserver(() => props.stores.participants.localId)
    const ids = useObserver(() => Array.from(props.stores.participants.remote.keys()))

    return <RawParticipantList {...props} localId={localId} remoteIds = {ids} />
  },
)
