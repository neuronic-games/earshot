import {Avatar} from '@components/avatar'
import {Stores} from '@components/utils'
import megaphoneIcon from '@iconify/icons-mdi/megaphone'
import {Icon} from '@iconify/react'
import {Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import HeadsetIcon from '@material-ui/icons/HeadsetMic'
import MicOffIcon from '@material-ui/icons/MicOff'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SpeakerOffIcon from '@material-ui/icons/VolumeOff'
import {/* addV2, mulV2,  */normV, /* rotateVector2DByDegree, subV2, */ getRelativePose} from '@models/utils'
import {LocalParticipant} from '@stores/participants/LocalParticipant'
import {PlaybackParticipant} from '@stores/participants/PlaybackParticipant'
import {RemoteParticipant} from '@stores/participants/RemoteParticipant'
import {useObserver} from 'mobx-react-lite'
import React, { useState } from 'react'
import {SignalQualityIcon} from './SignalQuality'
import {VRMAvatar} from '../../avatar/VRMAvatar'

// Image
import proximityVolumeIcon from '@images/whoo-emoticons_voice.png'

// Animated Emoticons
import symSmileIcon from '@images/whoo-screen_sym-smile.png'
import symClapIcon from '@images/whoo-screen_sym-clap.png'
import symHandIcon from '@images/whoo-screen_sym-hand.png'
import badConnIcon from '@images/whoo-screen_sym-slow.png'

import zoneGlowIcon from '@images/earshot_icon_avatar_glow.png'

import PingIcon from '@images/whoo-screen_pointer.png'
import {TITLE_HEIGHT} from '@stores/sharedContents/SharedContents'
import { rgb2Color} from '@models/utils'

declare const config:any             //  from ../../config.js included from index.html

interface StyleProps {
  position: [number, number],
  orientation: number,
  size: number,
}

// const SVG_RATIO = 18
const SVG_RATIO = 12
const HALF = 0.5


let animCount = 0

const useStyles = makeStyles({
  root: (props: StyleProps) => ({
    position: 'absolute',
    left: props.position[0],
    top: props.position[1],
    width:0,
    height:0,
  }),
  pointerRotate: (props: StyleProps) => ({
    transformOrigin: `top left`,
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
    transformOrigin: `top left`,
    transform: `translate(${props.size * HALF}px, ${props.size * HALF}px) `
      +`rotate(${-props.orientation}deg) translate(${-props.size * HALF}px, ${-props.size * HALF}px)`,
  }),
  avatarGlow: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 3 ,
    height: props.size * 3,
    left: props.size * -1,
    top: props.size * -1,
    opacity: 0,
    pointerEvents: 'none',
    transform: "scale(0.5)",
    transition: '0.5s ease-out'
  }),
  avatarGlowEffect: (props: StyleProps) => ({
    position: 'absolute',
    width: props.size * 3 ,
    height: props.size * 3,
    left: props.size * -1,
    top: props.size * -1,
    opacity: 1,
    pointerEvents: 'none',
    transform: "scale(0.9)",
    transition: '0.5s ease-out'
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
    display: 'none',
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
  pingLocIcon: (props:StyleProps) => ({
    position: 'absolute',
    transform: `rotate(${props.orientation}deg)`,
    width: '200px',
    height: '200px'
  }),
})

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
  /* const mapData = props.stores.map */

  const participant = props.participant

  const rgb = participant.getColorRGB()
  const participantProps = useObserver(() => ({
    position: participant.pose.position,
    orientation: participant.pose.orientation,
    mousePosition: participant.mouse.position,
    awayFromKeyboard: participant.physics.awayFromKeyboard,
  }))

  const name = useObserver(() => participant!.information.name)
  const audioLevel = useObserver(() =>
    participant!.trackStates.micMuted ? 0 : Math.pow(participant!.audioLevel, 0.5))
  const micMuted = useObserver(() => participant.trackStates.micMuted)
  const speakerMuted = useObserver(() => participant.trackStates.speakerMuted)
  const headphone = useObserver(() => participant.trackStates.headphone)
  const onStage = useObserver(() => participant.physics.onStage)
  /* const viewpoint = useObserver(() => ({center:participant.viewpoint.center, height:participant.viewpoint.height, nodding: participant.viewpoint.nodding})) */

  const inZone = useObserver(() => props.stores.participants.local.zone?.zone)
  const _icons = useObserver(() => participant.trackStates.emoticon)
  const _connQuality = useObserver(() => participant.quality)

  // For Chat Zone only
  const zoneId = useObserver(() => {
    let remotes = Array.from(props.stores.participants.remote.keys()).filter(key => key !== props.stores.participants.localId)
    for(let [i] of remotes.entries()) {
      if(props.stores.participants.remote.get(remotes[i])?.closedZone !== undefined) {
        if(props.stores.participants.remote.get(remotes[i])?.id === participant.id && props.stores.participants.remote.get(remotes[i])?.closedZone?.id !== '') {
          return props.stores.participants.remote.get(remotes[i])?.closedZone?.id
        }
      } else {
        return undefined
      }
    }
  })

   // For Chat Zone only
   const localZoneId = useObserver(() => (props.stores.participants.local.zone?.id !== undefined && props.stores.participants.local.zone?.id !== '') ? props.stores.participants.local.zone?.id : undefined)

   // For Proximity Zone only

  const proxCords = useObserver(() => {
    let remotes = Array.from(props.stores.participants.remote.keys()).filter(key => key !== props.stores.participants.localId)
    let remoteDist:number = 0
    const localPos = props.stores.participants.local.pose
    for(let [i] of remotes.entries()) {

      if(props.stores.participants.remote.get(remotes[i])?.id === participant.id && props.stores.participants.remote.get(remotes[i])?.closedZone?.id === undefined) {
        if(Object(props.stores.participants.remote.get(remotes[i])).pose.position !== undefined) {
          let posDiff = getRelativePose(localPos, Object(props.stores.participants.remote.get(remotes[i])).pose)
          remoteDist = normV(posDiff.position)
        }
        return remoteDist
      }
    }
  })

  const _pingIcon = useObserver(() => participant.trackStates.pingIcon)
  const _pingX = useObserver(() => participant.trackStates.pingX)
  const _pingY = useObserver(() => participant.trackStates.pingY)


  const [togglePingSound, setTogglePingSound] = useState(false)
  const [pingXY, setPingXY] = useState([0,0])

  const [anim, setAnim] = useState(false)

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


  if(localZoneId === undefined) {
    animCount = 0
  } else {
    if(zoneId === localZoneId) {
      const _timer = setTimeout(() => {
        if(animCount >= 2) {return}
        clearTimeout(_timer)
        if(anim === false) {
          setAnim(true)
          animCount++
        } else {
          setAnim(false)
          //animCount = 0
        }
      }, 500)
    }
  }

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

  /* const shadowOffset = Math.sqrt(viewpoint.height) / 2.5 - 4
  const shadowScale = 1 + (shadowOffset/200)
  const eyeOffsetMul = normV(viewpoint.center)/500 * 0.16 + 0.85

  const dir = subV2(participantProps.mousePosition, participantProps.position)
  const eyeDist = 0.45

  const nodding = viewpoint.nodding
  const isNoseUp = nodding ? nodding < -0.01 : false
  const noseWidth = 0.45
  const noseStart = 0.9 * (nodding ? Math.cos(nodding * 4) : 1)
  const noseLength = 0.6 * noseStart
  //const tailStart = noseStart
  //const tailLength = tailStart * 0.9
  //const tailWidth = 0.36
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
  } */

  const shadow = <svg className={classes.pointer} width={props.size * SVG_RATIO} height={props.size * SVG_RATIO}
    xmlns="http://www.w3.org/2000/svg">{/* Cast shadow to show the height */}
    {/* <defs>
      <radialGradient id="grad">
        <stop offset="0%" stopColor="rgb(0,0,0,0.4)"/>
        <stop offset="70%" stopColor="rgb(0,0,0,0.4)"/>
        <stop offset="100%" stopColor="rgb(0,0,0,0)"/>
      </radialGradient>
    </defs>
    <circle r={outerRadius * shadowScale} cy={svgCenter-shadowOffset} cx={svgCenter-shadowOffset}
      stroke="none" fill={'url(#grad)'} /> */}
  </svg>

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

  /* const arrow = <g transform={`translate(${svgCenter} ${svgCenter}) rotate(-135) `}>
    <rect style={{pointerEvents: 'fill'}}
      height={outerRadius} width={outerRadius} fill={color} />
    {isLocal ?
      <path  d={`M 0 ${outerRadius} h ${outerRadius} v ${-outerRadius}` +
        `a ${outerRadius} ${outerRadius} 0 1 0 ${-outerRadius} ${outerRadius}`}
        fill="none" stroke={textColor} />
    : undefined}
  </g> */

  /* const flog = <g style={{pointerEvents: 'fill'}} >
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
  </g>
  const nose = <path d={`M ${svgCenter-noseWidth*outerRadius/2} ${svgCenter-outerRadius*noseStart} `+
    `Q ${svgCenter} ${svgCenter-outerRadius*(noseStart+noseLength)}` +
    ` ${svgCenter+noseWidth*outerRadius/2} ${svgCenter-outerRadius*noseStart}`} stroke={textColor} fill={color} /> */


  //const tail = <path d={`M ${svgCenter-tailWidth*outerRadius} ${svgCenter+outerRadius*tailStart}` +
  //  ` Q ${svgCenter} ${svgCenter+outerRadius*(tailStart+tailLength)}`+
  //  `  ${svgCenter+tailWidth*outerRadius} ${svgCenter+outerRadius*tailStart}`} stroke={textColor} fill={color} />

  /* const tail = undefined */

  /* const avatarOuter = config.avatar === 'arrow' ?  //  arrow (circle with a corner) type avatar
    arrow : '' // Frog type (two eyes) avatar */

  const outerUnder = <svg
    className={classes.pointer} width={props.size * SVG_RATIO} height={props.size * SVG_RATIO} xmlns="http://www.w3.org/2000/svg">
    {/* {nodding ? (isNoseUp ? tail : nose) : undefined}
    <circle r={outerRadius} cy={svgCenter} cx={svgCenter} stroke={isLocal ? textColor : 'none'} fill={color} />
    {audioMeter}
    {(!nodding || !isNoseUp) ? avatarOuter : undefined} */}
    { (inZone === 'close' && (participant.id !== props.stores.participants.localId) && zoneId === localZoneId) ?
    <circle r={outerRadius} cy={svgCenter} cx={svgCenter} stroke="#ff4500" stroke-width="4" fill={'#00000020'} /* fill={color} */ />
    :  (proxCords !== undefined && proxCords < 360 &&
      ((participant.id !== props.stores.participants.localId)) && localZoneId === undefined)
      ? <circle r={outerRadius} cy={svgCenter} cx={svgCenter} stroke="#ff4500" stroke-width="4" fill={'#00000020'} />
      : <circle r={outerRadius} cy={svgCenter} cx={svgCenter} stroke="none" fill={'#00000020'} />
    }
    {audioMeter}
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
      </g>}
  </svg>

  /* const outerOver = <svg
    className={classes.pointer} width={props.size * SVG_RATIO} height={props.size * SVG_RATIO} xmlns="http://www.w3.org/2000/svg">
    {isNoseUp ? avatarOuter: undefined}
    {nodding ? (isNoseUp ? nose : tail) : undefined}
  </svg> */

  const useVrm = participant.information.avatarSrc && participant.information.avatarSrc.slice(-4) === '.vrm'

  return <>
    <div className={classes.root} style={{zIndex:isLocal ? 5000 : participant.zIndex}}>
      {shadow}
      <div className={classes.pointerRotate}>
        {outerUnder}
        <div className={classes.avatar + ' dragHandle'} onContextMenu={props.onContextMenu}>
          <Tooltip title={name}>
            <div>
            { (inZone === 'close' && (participant.id !== props.stores.participants.localId) && zoneId === localZoneId) ?
            <img src={zoneGlowIcon} className={anim ? classes.avatarGlow : classes.avatarGlowEffect} draggable={false} alt='' />
             :  (proxCords !== undefined && proxCords < 360 &&
            ((participant.id !== props.stores.participants.localId)) && localZoneId === undefined)
            ?  '' : ''}
              <Avatar {...props} />
              {iconMeter}
              <img src={_icons === 'smile' ? symSmileIcon : (_icons === "hand" ? symHandIcon : (_icons === "clap" ? symClapIcon : undefined))} className={_icons === '' ? classes.iconEmoticonNone : classes.iconEmoticon}  alt='' />
              <SignalQualityIcon className={classes.signalIcon} quality={props.participant.quality} />
              {(_connQuality !== undefined && _connQuality < 70) ? <img src={badConnIcon} className={classes.conIcon}  alt='' /> : undefined}
              {headphone ? <HeadsetIcon className={classes.icon} htmlColor="rgba(0, 0, 0, 0.3)" /> : undefined}
              {speakerMuted ? <SpeakerOffIcon className={classes.icon} color="secondary" /> :
                (micMuted ? <MicOffIcon className={classes.icon} color="secondary" /> : undefined)}
              {!micMuted && onStage ? <Icon className={classes.icon} icon={megaphoneIcon} color="gold" /> : undefined }
              {props.isPlayback ? <PlayArrowIcon className={classes.icon} htmlColor="#0C0" /> : undefined}
            </div>
          </Tooltip>
          <div>
            <img src={_pingIcon !== false ? PingIcon : undefined} style={_pingIcon !== false ? {display: 'block', width: TITLE_HEIGHT,position:'relative', textAlign: 'center', top: (yPos), left: (xPos), whiteSpace: 'pre'} : {display:'none'}} alt='' />
            <img style={_pingIcon !== false ? {backgroundColor:rgb2Color(rgb), borderRadius: '50%', position:'relative', display: 'block', width: (TITLE_HEIGHT - 4), textAlign: 'center', top: (yPos - 48), left: (xPos+1.5), whiteSpace: 'pre'}  : {display:'none'}} src={_pingIcon !== false ? participant.information.avatarSrc : undefined} alt='' />
        </div>
        </div>
       {/*  {outerOver} */}
      </div>
    </div>
    {useVrm ? <div className={classes.root} style={{zIndex:participant.zIndex + 5000}}>
      <VRMAvatar participant={participant} /></div> : undefined}
  </>
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
