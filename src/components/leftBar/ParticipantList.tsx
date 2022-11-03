import {ImageAvatar} from '@components/avatar/ImageAvatar'
import {LocalParticipantForm} from '@components/map/Participant/LocalParticipantForm'
import {RemoteParticipantForm} from '@components/map/Participant/RemoteParticipantForm'
import {BMProps} from '@components/utils'
import {/* FormControlLabel, */ Tooltip} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import {conference} from '@models/conference'
import {MessageType} from '@models/conference/DataMessageType'
import {getColorOfParticipant} from '@models/Participant'
/* import {isDarkColor} from '@models/utils' */
import {ParticipantBase} from '@stores/participants/ParticipantBase'
import {autorun} from 'mobx'
import {useObserver} from 'mobx-react-lite'
import React, { /* useState */ } from 'react'
import {styleForList} from '../utils/styles'
import {TextLineStyle} from './LeftBar'
import {StatusDialog} from './StatusDialog'

import goodConnIcon from '@images/earshot_icon_quality_3.png'
import averageConnIcon from '@images/earshot_icon_quality_2.png'
import badConnIcon from '@images/earshot_icon_quality_1.png'
import {isSmartphone} from '@models/utils'
// Animated Emoticons
import symSmileIcon from '@images/whoo-screen_sym-smile.png'
import symClapIcon from '@images/whoo-screen_sym-clap.png'
import symHandIcon from '@images/whoo-screen_sym-hand.png'

import {makeStyles} from '@material-ui/core/styles'

/* import Switch from '@material-ui/core/Switch' */


// config.js
declare const config:any             //  from ../../config.js included from index.html

interface StyleProps {
  size: number,
}

const useStyles = makeStyles({
  iconEmoticon: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.6 ,
    height: props.size * 0.6,
    left: props.size * -0.2,
    top: props.size * -0.2,
    pointerEvents: 'none',
    transform: 'scale(1)',
    transition: '0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }),
  iconEmoticonNone: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.6 ,
    height: props.size * 0.6,
    left: props.size * 0.1,
    top: props.size * 0,
    pointerEvents: 'none',
    transform: 'scale(0)',
    transition: '0s ease-out',
  }),
})

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

  const classesIcons = useStyles({
    size: isSmartphone() ? (props.lineHeight * 4) : (props.lineHeight * 2.5),
  })

  const _connQuality = useObserver(() => props.participant.quality)




  //console.log(props)

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

  // For Emoticons
  const _iconsRemote = useObserver(() => {
    let remotes = Array.from(props.stores.participants.remote.keys()).filter(key => key !== props.stores.participants.localId)
    for(let [i] of remotes.entries()) {
      if(props.stores.participants.remote.get(remotes[i])?.trackStates.emoticon !== '') {
        if(props.stores.participants.remote.get(remotes[i])?.id === props.participant.id && props.stores.participants.remote.get(remotes[i])?.trackStates.emoticon !== '') {
          return props.stores.participants.remote.get(remotes[i])?.trackStates.emoticon
        }
      } else {
        return ''
      }
    }
  })
  const _iconsLocal = useObserver(() => props.stores.participants.local.trackStates.emoticon)
  const localZone = useObserver(() => (props.stores.participants.local.zone?.name !== undefined && props.stores.participants.local.zone?.name !== '') ? ' ('+props.stores.participants.local.zone?.name+')' : '')

  function onClick(){
    if (props.participant.physics.located){
      map.focusOn(props.participant)
    }else{
      if(config.bmRelayServer){
        conference.dataConnection.pushOrUpdateMessageViaRelay(
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
        conference.dataConnection.pushOrUpdateMessageViaRelay(
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

  /*
  <>
    <Tooltip title={`${props.participant.information.name} (${props.participant.id})`} placement="right">
      <div className={classes.outer} style={{margin:'1px 0 1px 0'}}>
        <IconButton style={{margin:0, padding:0}} onClick={onClick} onContextMenu={onContextMenu}>
          <ImageAvatar border={true} colors={colors} size={size} name={name} avatarSrc={avatarSrc} />
        </IconButton>
        <Button variant="contained" className={classes.line} ref={ref}
          style={{backgroundColor:colors[0], color:colors[1], textTransform:'none'}}
          onClick={onClick} onContextMenu={onContextMenu}>
            {name}
        </Button>
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
  </> */


  return <>
    <Tooltip title={<span style={{fontSize:isSmartphone() ? '2rem' : '1rem'}}>{`${props.participant.information.name} (${props.participant.id})`}</span>} placement="right">
      <div className={classes.outer} /* style={{margin:'1px 0 1px 0'}} */ style={{margin:'1px 0 1px 10px', position:'relative', left:'5px', marginTop: '0px', top:'7px'}}>
        <IconButton style={{margin:0, padding:0, marginTop: '5px', marginLeft:isSmartphone() ? '10px' : '5px'}} onClick={onClick} onContextMenu={onContextMenu}>
          <ImageAvatar border={true} colors={colors} /* size={size} */ size={(isSmartphone() ? (size * 3.2) : (size * 2))} name={name} avatarSrc={avatarSrc} />
          <img
          src={ (props.stores.participants.localId === props.participant.id) ?
            _iconsLocal === 'smile' ? symSmileIcon : (_iconsLocal === "hand" ? symHandIcon : (_iconsLocal === "clap" ? symClapIcon : undefined)) :  _iconsRemote === 'smile' ? symSmileIcon : (_iconsRemote === "hand" ? symHandIcon : (_iconsRemote === "clap" ? symClapIcon : undefined))
          }
            className={ (props.stores.participants.localId === props.participant.id) ?
              _iconsLocal === '' ? classesIcons.iconEmoticonNone : classesIcons.iconEmoticon
              :  _iconsRemote === '' ? classesIcons.iconEmoticonNone : classesIcons.iconEmoticon
            }  alt='' />
        </IconButton>
        <Button /* variant="contained" */ className={classes.line} ref={ref}
          style={{/* backgroundColor:colors[0],  */color:'#FFFFFF'/* colors[1] */, textTransform:'none', marginLeft:'10px', marginTop: '10px', fontWeight: 'bold', fontSize: isSmartphone() ? '2rem' : '1rem', height:'30px'}}
          onClick={onClick} onContextMenu={onContextMenu}>
            {name}
            <div style={{color:'#EDA741', letterSpacing:'0px', position:'relative', marginLeft:'5px', fontSize:isSmartphone() ? '1.5rem' : '1rem'}}>{(props.stores.participants.localId === props.participant.id) ? localZone : zoneName}</div>
        </Button>
        <div style={{position:'absolute', width:'10px', height:'10px', /* backgroundColor:'yellow', */ right:isSmartphone() ? '60px' : '40px', marginTop: '5px',}}>
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

  /* const [everyone, setEveryone] = useState(false) */


  /* function handleChange(){
    if(everyone) {
      setEveryone(false)
    } else {
      setEveryone(true)
    }
  }; */

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
      <div className={classes.title} /* style={{color:textColor}} */style={{color:'#FFFFFF90'/* textColor */, marginLeft: isSmartphone() ? '14px' : '8px', padding:'10px', borderRadius:'5px', /* border:'1px dotted #FFFFFF80', */ marginTop:'5px', userSelect:'text', fontWeight:'bold', fontSize:isSmartphone() ? '2rem' : '1rem'}} ref={ref}
        onClick={()=>{setShowStat(true)}}
      >{conference.dataConnection.room}{/* {sessionStorage.getItem('room')} */} ({(participants.remote.size + 1).toString()}){/*  in {conference.room} */}</div>
      <StatusDialog open={showStat}
        close={()=>{setShowStat(false)}} {...statusProps} anchorEl={ref.current}/>
      {localElement}{remoteElements}

      {/* <div style={{position: 'absolute', top: '40px', left: '10px'}}>
        <FormControlLabel style={{color:'white'}}
          control={
            <Switch checked={everyone} onChange={handleChange} size="small" color='default' style={{color:'yellowgreen'}} name='Everyone' />
          }
          label="Everyone"
        />
      </div> */}

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
