import {Avatar} from '@components/avatar'
import {Stores} from '@components/utils'
import megaphoneIcon from '@iconify/icons-mdi/megaphone'
import {Icon} from '@iconify/react'
import {Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import HeadsetIcon from '@material-ui/icons/HeadsetMic'
//import PingLocIcon from '@material-ui/icons/PlayArrow'
import MicOffIcon from '@material-ui/icons/MicOff'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SpeakerOffIcon from '@material-ui/icons/VolumeOff'
//////////////
//import {addV2, mulV2, normV, rotateVector2DByDegree, subV2} from '@models/utils'
/////////////
import {LocalParticipant} from '@stores/participants/LocalParticipant'
import { PlaybackParticipant } from '@stores/participants/PlaybackParticipant'
import {RemoteParticipant} from '@stores/participants/RemoteParticipant'
import {useObserver} from 'mobx-react-lite'
import React, { useState } from 'react'
import {SignalQualityIcon} from './SignalQuality'
// Image
import proximityVolumeIcon from '@images/whoo-emoticons_voice.png'
// Animated Emoticons
import symSmileIcon from '@images/whoo-screen_sym-smile.png'
import symClapIcon from '@images/whoo-screen_sym-clap.png'
import symHandIcon from '@images/whoo-screen_sym-hand.png'
import badConnIcon from '@images/whoo-screen_sym-slow.png'

import PingIcon from '@images/whoo-screen_pointer.png'
import {TITLE_HEIGHT} from '@stores/sharedContents/SharedContents'
import { rgb2Color } from '@models/utils'



//import {connection} from '@models/api/ConnectionDefs' // For checking Host
//import {userName} from '@components/error/TheEntrance'
declare const config:any             //  from ../../config.js included from index.html

interface StyleProps {
  position: [number, number],
  orientation: number,
  size: number,
}

// const SVG_RATIO = 18
const SVG_RATIO = 12
const HALF = 0.5

const useStyles = makeStyles({
  root: (props: StyleProps) => ({
    position: 'absolute',
    left: props.position[0],
    top: props.position[1],
  }),
  pointerRotate: (props: StyleProps) => ({
    transform: `rotate(${props.orientation}deg)`,
  }),
  pointer: (props: StyleProps) => ({
    position: 'absolute',
    width: `${SVG_RATIO * props.size}`,
    left: `-${SVG_RATIO * props.size * HALF}px`,
    top: `-${SVG_RATIO * props.size * HALF}px`,
    pointerEvents: 'none',
  }),
  avatar: (props: StyleProps) => ({
    position: 'absolute',
    left: `-${props.size * HALF}px`,
    top: `-${props.size * HALF}px`,
  }),
  icon: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.4 ,
    height: props.size * 0.4,
    left: props.size * 0.6,
    top: props.size * 0.6,
    pointerEvents: 'none',
  }),
  signalIcon: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.25 ,
    height: props.size * 0.25,
    left: props.size * 0.8,
    top: props.size * 0.8,
    display: 'none', // Hide the connection quality icon
    pointerEvents: 'none',
  }),
  iconProximity: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.6 ,
    height: props.size * 0.6,
    left: props.size * 0.7,
    top: props.size * 0.4,
    pointerEvents: 'none',
  }),
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
  conIcon: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.85 ,
    height: props.size * 0.85,
    left: props.size * 0.5,
    top: props.size * -0.3,
    pointerEvents: 'none',
  }),
  more: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 0.4 ,
    height: props.size * 0.4,
    left: props.size * 0.9,
    top: -props.size * 0.3,
  }),

  /* PingLocation: (props:StyleProps) => ({
    display: 'block',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    //top: (props.position[1] - 125),
    //left: (props.position[0] - 17),
    //transform: `rotate(${props.props.stores.map.rotation}deg)`,
    whiteSpace: 'pre',
  }),

  PingLocationHide: (props:StyleProps) => ({
    display: 'none',
    height: TITLE_HEIGHT,
    position:'absolute',
    textAlign: 'center',
    //top: (props.position[1] - 25),
    //left: (props.position[0] - 17),
    //transform: `rotate(${props.props.stores.map.rotation}deg)`,
    whiteSpace: 'pre',
  }), */

  pingLocIcon: (props:StyleProps) => ({
    position: 'absolute',
    transform: `rotate(${props.orientation}deg)`,
    width: '200px',
    height: '200px'
  }),

})


/* class Member{
  isShown = false
} */


export interface ParticipantProps{
  participant: LocalParticipant | RemoteParticipant | PlaybackParticipant
  size: number
  onContextMenu?:(ev:React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  stores: Stores
}
export interface RawParticipantProps extends ParticipantProps{
  isLocal: boolean
  isPlayback?: boolean
}

const RawParticipant: React.ForwardRefRenderFunction<HTMLDivElement , RawParticipantProps> = (props, ref) => {
  const mapData = props.stores.map
//  const participants = useStore()
  const participant = props.participant

  //console.log(connection.conference._jitsiConference?.isModerator(), " isModerator")

  //console.log(participant.quality?.connectionQuality, " quality")

  //if(props.stores.participants.localId != '') {return}

    /* const rname = useObserver(() => (props.stores.roomInfo.roomProps.get('roomDetails')))
    console.log(rname, " STORES") */

    const rgb = participant.getColorRGB()

    //console.log("CHECKING")

  //let _name = userName()
  //console.log(props.stores.participants.localId, " --- ", _name)
  //if(props.stores.participants.localId === '') {
    // set Matrix [Reset ZoomLevel]
    //const changeMatrix = (new DOMMatrix()).scaleSelf(1, 1, 1)
    //mapData.setMatrix(changeMatrix)
   // mapData.setCommittedMatrix(changeMatrix)

    // Position Avatar at center of stage
    //mapData.setMouse([mapData.screenSize[0]/2, mapData.screenSize[1]/2])
    //participant.pose.position = Object.assign({}, mapData.mouseOnMap)
  //}
  /* if(_name !== '') {
    // set Name
    props.stores.participants.local.information.name = _name
    props.stores.participants.local.sendInformation()
    props.stores.participants.local.saveInformationToStorage(true)

  } */

  /* if(props.stores.participants.localId === '') {
    // set Matrix [Reset ZoomLevel]
    const changeMatrix = (new DOMMatrix()).scaleSelf(1, 1, 1)
    mapData.setMatrix(changeMatrix)
    mapData.setCommittedMatrix(changeMatrix)

    // Position Avatar at center of stage
    mapData.setMouse([mapData.screenSize[0]/2, mapData.screenSize[1]/2])
    participant.pose.position = Object.assign({}, mapData.mouseOnMap)
  }

  // Setting logged-in Username
  if(_name !== '') {
    // set Name
    props.stores.participants.local.information.name = _name
    props.stores.participants.local.sendInformation()
    props.stores.participants.local.saveInformationToStorage(true)
  } */

  //console.log(mapData.visibleArea())



  const participantProps = useObserver(() => ({
    position: participant.pose.position,
    orientation: participant.pose.orientation,
    mousePosition: participant.mouse.position,
    awayFromKeyboard: participant.physics.awayFromKeyboard,
  }))
  const name = useObserver(() => participant!.information.name)
  const audioLevel = useObserver(() =>
    participant!.trackStates.micMuted ? 0 : Math.pow(participant!.audioLevel, 0.5))
  // console.log(`audioLevel ${audioLevel}`)
  const micMuted = useObserver(() => participant.trackStates.micMuted)
  const speakerMuted = useObserver(() => participant.trackStates.speakerMuted)
  const headphone = useObserver(() => participant.trackStates.headphone)
  const onStage = useObserver(() => participant.physics.onStage)


  //const mousePos = useObserver(() => props.stores.map.mouseOnMap)
  //console.log(mousePos, " mousePos")

///////////////////
  //const viewpoint = useObserver(() => ({center:participant.viewpoint.center, height:participant.viewpoint.height}))
///////////////////
//const viewpoint = useObserver(() => ({center:participant.viewpoint.center, height:participant.viewpoint.height}))
//console.log(viewpoint, "view point")

  const inZone = useObserver(() => props.stores.participants.local.zone?.zone)
  const _icons = useObserver(() => participant.trackStates.emoticon)
  const _connQuality = useObserver(() => participant.quality?.connectionQuality)


  //const vCon = useObserver(() => participant.muteVideo)

  /* let xPos = -1
  let yPos = -1 */

  const _pingIcon = useObserver(() => participant.trackStates.pingIcon)
  const _pingX = useObserver(() => participant.trackStates.pingX)
  const _pingY = useObserver(() => participant.trackStates.pingY)

  //const soundLocalBase = useObserver(() => props.stores.participants.local.soundLocalizationBase)


//console.log(soundLocalBase, " soundLocalBase")

  const [togglePingSound, setTogglePingSound] = useState(false)
  const [pingXY, setPingXY] = useState([0,0])

  if(_pingIcon && (pingXY[0] !== _pingX || pingXY[1] !== _pingY)) {
    setTogglePingSound(false)
  }

  let xPos = ((_pingX) + 14)
  let yPos = ((_pingY) - 55)

  if(_pingIcon && togglePingSound === false) {
    playToggleIcon()
    //let audio = new Audio("sound/beep.mp3")
    //audio.play()
    setPingXY([_pingX, _pingY])
    setTogglePingSound(true)
  } else if(_pingIcon === false && togglePingSound) {
    setTogglePingSound(false)
  }

  //const _pingCursor = useObserver(() => participant.trackStates.cursorMove)
  //const _pingY = useObserver(() => participant.trackStates.pingY)

  //const isSetIconPos = useObserver(()=> props.stores.participants.local.cursorMove)

  //console.log("AAAA - ", _pingIcon1)


  //console.log(_pingCursor, " --- ")

  //xPos = (_pingX - participantProps.position[0]) + 17
  //yPos = (_pingY - participantProps.position[1]) - 50
  //let xPos = _pingX
  //let yPos = _pingY

 //if(xPos === -1) {
   //if(xPos === 0) {
  //if(_pingCursor === false) {
  //console.log(_pingIcon, " ::: ")
  //if(_pingIcon)
  //if(xPos === 0) {


  /* let xPos = ((participantProps.mousePosition[0] - participantProps.position[0]) + 12)
  let yPos = ((participantProps.mousePosition[1] - participantProps.position[1]) - 55) */

  /*
  // If DIV
  let xPos = ((_pingX) + 14)
  let yPos = ((_pingY) - 80)
 */
/////////////////////////////////////////////////
  /* let xPos = ((_pingX) + 14)
  let yPos = ((_pingY) - 55) */
/////////////////////////////////////////////////


  /* if(_pingIcon) {
    //console.log(mapData.visibleArea()[0], " --- ", yPos)
    if(mapData.visibleArea()[0] < yPos && mapData.visibleArea()[1] > xPos && mapData.visibleArea()[3] < xPos && mapData.visibleArea()[2] > yPos) {
      console.log("Inside Visible")
    } else {
      console.log("outside visible")
    }
  } */

  //}
  // }
 //}

 function playToggleIcon() {
    let xClick = participantProps.mousePosition[0]
    let xAvatar = props.stores.participants.local.pose.position[0]
    //console.log(xClick, " ----- ", xAvatar)
    const URL = 'sound/beep.mp3';
    const context = new AudioContext();
    window.fetch(URL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      let panNode = context.createStereoPanner();
      if(xClick > (xAvatar + 10) /* && soundLocalBase === "avatar" */) {
        //console.log("RIGHT")
        panNode.pan.value = 1
      } else if(xClick < (xAvatar - 10) /* && soundLocalBase === "avatar" */) {
        //console.log("LEFT")
        panNode.pan.value = -1
      } else {
        //console.log("NORMAL")
        panNode.pan.value = 0
      }
      source.connect(panNode);
      panNode.connect(context.destination);
      source.start();
    });
 }


  const classes = useStyles({
    ...participantProps,
    size: props.size,
  })

  const [color, textColor] = participant ? participant.getColor() : ['white', 'black']
  const outerRadius = props.size / 2 + 2
  const isLocal = props.isLocal
  const AUDIOLEVELSCALE = props.size * SVG_RATIO * HALF
  const svgCenter = SVG_RATIO * props.size * HALF

  //const shadowOffset = Math.sqrt(viewpoint.height) / 2.5 - 4
  //const shadowScale = 1 + (shadowOffset/200)



  ////////////////////////////////////////////////
/*
  const eyeOffsetMul = normV(viewpoint.center)/500 * 0.16 + 0.85

  const dir = subV2(participantProps.mousePosition, participantProps.position)
  //const dir = subV2(mousePos, participantProps.position)
  const eyeDist = 0.4
  const eyeOffsets:[[number, number], [number, number]]
    = [[eyeDist * outerRadius, - eyeOffsetMul*outerRadius],
      [-eyeDist * outerRadius, - eyeOffsetMul*outerRadius]]
  const dirs = eyeOffsets.map(offset => subV2(dir, rotateVector2DByDegree(participantProps.orientation, offset)))
  const eyeballsGlobal = dirs.map((dir) => {
    const norm = normV(dir)
    const dist = Math.log(norm < 1 ? 1 : norm) * 0.3
    const limit = 0.1 * outerRadius
    const offset = dist > limit ? limit : dist

    return mulV2(offset / norm, dir)
  })
  const eyeballs = eyeballsGlobal.map(g => addV2([0, -0.04 * outerRadius],
                                                 rotateVector2DByDegree(-participantProps.orientation, g)))
  function onClickEye(ev: React.MouseEvent | React.TouchEvent | React.PointerEvent){
    if (props.participant.id === props.stores.participants.localId){
      ev.stopPropagation()
      ev.preventDefault()
      props.stores.participants.local.physics.awayFromKeyboard = true
    }
  }
  const eyeClick = {
    onMouseDown: onClickEye,
    onTouchStart: onClickEye,
    onPointerDown: onClickEye,
  }
 */
  ///////////////////////////////////////////////////////////////

  //console.log(-participantProps.orientation, " orientation")

  //const rad = (Math.atan2(participantProps.mousePosition[1] - participantProps.position[1], participantProps.mousePosition[0] - participantProps.position[0]))


  //const rad = (Math.atan2(_pingY, _pingX))


  //console.log(rotateVector2DByDegree(-participantProps.orientation))

  const audioMeterSteps = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
  const audioMeter = audioMeterSteps.map(step => (audioLevel > step && inZone !== 'close') ?
    <React.Fragment key={step}>
      <circle r={props.size * HALF + step * AUDIOLEVELSCALE} cy={svgCenter} cx={svgCenter}
        stroke={color} fill="none" opacity={0.4 * (1 - step)} strokeDasharray="4 4 4 24" />
      <circle r={props.size * HALF + step * AUDIOLEVELSCALE} cy={svgCenter} cx={svgCenter}
      stroke="black" fill="none" opacity={0.4 * (1 - step)} strokeDasharray="4 32" strokeDashoffset="-4" />
    </React.Fragment>
    : undefined)

    const iconMeter = audioMeterSteps.map(step => audioLevel > step ?
      <React.Fragment key={step}>
        <img src={proximityVolumeIcon} className={classes.iconProximity} alt=""/>
      </React.Fragment>
      : undefined)

  return (
    <div className={classes.root + ' dragHandle'} onContextMenu={props.onContextMenu}>
      <svg className={classes.pointer} width={props.size * SVG_RATIO} height={props.size * SVG_RATIO}
        xmlns="http://www.w3.org/2000/svg">{/* Cast shadow to show the height */}
        {/* <defs>
          <radialGradient id="grad">
            <stop offset="0%" stopColor="rgb(0,0,0,0.4)"/>
            <stop offset="70%" stopColor="rgb(0,0,0,0.4)"/>
            <stop offset="100%" stopColor="rgb(0,0,0,0)"/>
          </radialGradient>
        </defs>
        <circle r={outerRadius * shadowScale} cy={svgCenter+shadowOffset} cx={svgCenter+shadowOffset}
          stroke="none" fill={'url(#grad)'} /> */}
      </svg>
      <div className={classes.pointerRotate}>{/* The avatar */}
        <svg
          className={classes.pointer} width={props.size * SVG_RATIO} height={props.size * SVG_RATIO} xmlns="http://www.w3.org/2000/svg">
          <circle r={outerRadius} cy={svgCenter} cx={svgCenter} stroke="none" fill={color} />
          {audioMeter}
        {/*  {inZone === undefined ? audioMeter : undefined} */}
          {config.avatar === 'arrow' ?  //  arrow (circle with a corner) type avatar
            <g transform={`translate(${svgCenter} ${svgCenter}) rotate(-135) `}>
              <rect style={{pointerEvents: 'fill'}}
                height={outerRadius} width={outerRadius} fill={color} />
              {isLocal ?
                <path  d={`M 0 ${outerRadius} h ${outerRadius} v ${-outerRadius}` +
                  `a ${outerRadius} ${outerRadius} 0 1 0 ${-outerRadius} ${outerRadius}`}
                  fill="none" stroke={textColor} />
                : undefined}
            </g>
            : // Frog type (two eyes) avatar
            <g style={{pointerEvents: 'fill'}} >


              {/*
              {isLocal ?
                <circle r={outerRadius} cy={svgCenter} cx={svgCenter} fill="none" stroke={textColor} />
                : undefined}
              <circle {...eyeClick} r={0.35 * outerRadius} cy={svgCenter + eyeOffsets[0][1]}
                cx={svgCenter + eyeOffsets[0][0]} fill={color} />
              <circle {...eyeClick} r={0.35 * outerRadius} cy={svgCenter + eyeOffsets[1][1]}
                cx={svgCenter + eyeOffsets[1][0]} fill={color} />
              {participantProps.awayFromKeyboard === true ?
                undefined
              :<>
                <circle {...eyeClick} r={0.25 * outerRadius} cy={svgCenter + eyeOffsets[0][1]}
                  cx={svgCenter + eyeOffsets[0][0]} fill="white" />
                <circle {...eyeClick} r={0.25 * outerRadius} cy={svgCenter + eyeOffsets[1][1]}
                  cx={svgCenter + eyeOffsets[1][0]} fill="white" />
                <circle {...eyeClick} r={0.14 * outerRadius} cy={svgCenter + eyeOffsets[0][1] + eyeballs[0][1]}
                  cx={svgCenter + eyeOffsets[0][0] +  eyeballs[0][0]} fill="black" />
                <circle {...eyeClick} r={0.14 * outerRadius} cy={svgCenter + eyeOffsets[1][1] + eyeballs[1][1]}
                  cx={svgCenter + eyeOffsets[1][0] +  eyeballs[1][0]} fill="black" />
              </>}
              */}



            </g>
          }
        </svg>
      </div>
      <div className={classes.avatar}
        style = {{transform: `rotate(${-mapData.rotation}deg)`}} >
        <Tooltip title={name}>
          <div>
            <Avatar {...props} />
            {iconMeter}
            <img src={_icons === 'smile' ? symSmileIcon : (_icons === "hand" ? symHandIcon : (_icons === "clap" ? symClapIcon : undefined))} className={_icons === '' ? classes.iconEmoticonNone : classes.iconEmoticon}  alt='' />
            <SignalQualityIcon className={classes.signalIcon} quality={participant.quality?.connectionQuality} />
            {(_connQuality !== undefined && _connQuality < 70) ? <img src={badConnIcon} className={classes.conIcon}  alt='' /> : undefined}
            {headphone ? <HeadsetIcon className={classes.icon} htmlColor="rgba(0, 0, 0, 0.3)" /> : undefined}
            {speakerMuted ? <SpeakerOffIcon className={classes.icon} color="secondary" /> :
              (micMuted ? <MicOffIcon className={classes.icon} color="secondary" /> : undefined)}
            {!micMuted && onStage ? <Icon className={classes.icon} icon={megaphoneIcon} color="gold" /> : undefined }
            {props.isPlayback ? <PlayArrowIcon className={classes.icon} htmlColor="#0C0" /> : undefined}
            {/* <img src={_pingIcon !== false ? PingIcon : undefined} className={_pingIcon !== false ? classes.PingLocation : classes.PingLocationHide} /> */}
            {/* <img src={_pingIcon !== false ? PingIcon : undefined} style={_pingIcon !== false ? {display: 'block', height: TITLE_HEIGHT,position:'relative', textAlign: 'center', top: ((participantProps.mousePosition[1] - participantProps.position[1]) - 50), left: ((participantProps.mousePosition[0] - participantProps.position[0]) + 17), whiteSpace: 'pre',} : {display:'none'}} /> */}
           {/*  <div style={{position: 'absolute', left: '-10px', top:'0px', width:0, height:0, borderTop: '25px solid transparent', borderLeft: '100px solid #555', borderBottom: '25px solid transparent', transform: `rotate(${rad}rad)`}}> */}


           {/*
           // Pointer support
            <div style={{position:'absolute', left: '-30px', width:'120px', height:'120px', top:'-30px', transform: `rotate(${rad}rad)`, transformOrigin:'center'}}>
              <div style={_pingIcon ? {display:'block', position:'absolute', left:'93px', top:'45px', width:'30px', height:'30px', overflow:'hidden'} : {display:'none'}}>
              <PingLocIcon style={{left: '-120px', zIndex:-999999, top:'-75px', position:'absolute', width:'180px', height:'180px', color:rgb2Color(rgb)}}/>
              </div>
            </div> */}
          </div>
        </Tooltip>
        <div>
          <img src={_pingIcon !== false ? PingIcon : undefined} style={_pingIcon !== false ? {display: 'block', width: TITLE_HEIGHT,position:'relative', textAlign: 'center', top: (yPos), left: (xPos), whiteSpace: 'pre'} : {display:'none'}} alt='' />
          <img style={_pingIcon !== false ? {backgroundColor:rgb2Color(rgb), borderRadius: '50%', position:'relative', display: 'block', width: (TITLE_HEIGHT - 4), textAlign: 'center', top: (yPos - 48), left: (xPos+1.5), whiteSpace: 'pre'}  : {display:'none'}} src={_pingIcon !== false ? participant.information.avatarSrc : undefined} alt='' />
        </div>
      </div>
    </div>
  )
}
RawParticipant.displayName = 'RawParticipant'

//export const Participant = forwardRef(RawParticipant)
//Participant.displayName = 'Participant'

export const Participant = (props: RawParticipantProps) =>
  React.useMemo(() => <RawParticipant {...props} />,
  //  eslint-disable-next-line react-hooks/exhaustive-deps
  [props.size, props.participant.id,
    props.participant.information.avatarSrc,
    props.participant.information.color,
    props.participant.information.name,
    props.participant.information.textColor,
  ])
Participant.displayName = 'MemorizedParticipant'
