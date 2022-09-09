import {FabColor, IconColor, MoreButton, moreButtonControl, MoreButtonMember} from '@components/utils/MoreButton'
import {Tooltip} from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import {makeStyles} from '@material-ui/core/styles'
import React, {useRef, useState} from 'react'
import { isSmartphone } from '@models/utils'

const useStyles = makeStyles((theme) => {
  return ({
    container: {
      display:'inline-block',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      pointerEvents: 'auto',
    },
  })
})

/* interface MyFabProps{
  children: React.ReactElement,
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>|React.TouchEvent<HTMLButtonElement>) => void,
  onClickMore?: (e: React.PointerEvent<HTMLButtonElement>
    |React.MouseEvent<HTMLButtonElement, MouseEvent>|React.TouchEvent<HTMLButtonElement>) => void,
  color?: FabColor
  iconColor?: IconColor
  htmlColor?: string
  className?: string
  style?: React.CSSProperties
  title?: string | React.ReactElement,
  size?: number,
  divRef?: React.RefObject<HTMLDivElement>
}


export const FabMain: React.FC<MyFabProps> = (props) => {
  const classes = useStyles()
  const [showMore, setShowMore] = useState<boolean>(false)
  const memberRef = useRef<MoreButtonMember>({timeout:undefined})
  const member = memberRef.current

  return <div className={classes.container + (props.className ? ` ${props.className}` : '')}
    style={props.style} ref={props.divRef}
    {...moreButtonControl(setShowMore, member)}
  >
    <Fab style={{height:props.size, width:props.size}}
      onClick = {(ev) => { if (props.onClick) { props.onClick(ev) } } }
      onContextMenu={(ev) => {
        ev.preventDefault()
        if (props.onClickMore) { props.onClickMore(ev) }
      }}
      color = {props.color} onFocus = {(e) => { (e.target as HTMLElement)?.blur() }}>
      {props.children}
    </Fab>
    {props.onClickMore ? <MoreButton style={{position:'relative', top:-35, left:-15, marginRight:-41}}
    show={showMore} color={props.color} htmlColor={props.htmlColor} iconColor={props.iconColor}
    onClickMore = {props.onClickMore}
    /> : undefined}
  </div>
}

export const FabWithTooltip: React.FC<MyFabProps> = (props) => {
  if (props.title) {
    return <Tooltip placement="top-start" arrow={true}
    title={props.title}>
    <span style={{paddingTop:20}} >
      <FabMain {...props} />
    </span>
    </Tooltip>
  }

  return <FabMain {...props} />
} */

interface MyFabProps{
  children: React.ReactElement,
  onDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>|React.TouchEvent<HTMLButtonElement>) => void,
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>|React.TouchEvent<HTMLButtonElement>) => void,
  onClickMore?: (e: React.PointerEvent<HTMLButtonElement>
    |React.MouseEvent<HTMLButtonElement, MouseEvent>|React.TouchEvent<HTMLButtonElement>) => void,
  color?: FabColor
  iconColor?: IconColor
  htmlColor?: string
  className?: string
  style?: React.CSSProperties
  title?: string | React.ReactElement,
  size?: number,
  divRef?: React.RefObject<HTMLDivElement>
  isOpen?: boolean,
  index?: number,
}


export const FabMain: React.FC<MyFabProps> = (props) => {
  const classes = useStyles()
  const [showMore, setShowMore] = useState<boolean>(false)
  const memberRef = useRef<MoreButtonMember>({timeout:undefined})
  const member = memberRef.current

  let tDelay = ''

  if(props.index !== undefined && props.isOpen === true) {
    tDelay = ((props.index/2 * 0.3) + 0.5) + 's'
  }

  // Dummy
  if(showMore){}

  return <div className={classes.container + (props.className ? ` ${props.className}` : '')}
    style={props.style} ref={props.divRef}
    {...moreButtonControl(setShowMore, member)}
  >
    <Fab style={{height:props.size, width:props.size}}
      onClick = {(ev) => { if (props.onClick) { props.onClick(ev) } } }
      onMouseDown = {(ev) => { if (props.onDown) { props.onDown(ev) } } }
      onTouchStart = {(ev) => { if (props.onDown) { props.onDown(ev) } } }
      onContextMenu={(ev) => {
        ev.preventDefault()
        if (props.onClickMore) { props.onClickMore(ev) }
      }}
      color = {props.color} onFocus = {(e) => { (e.target as HTMLElement)?.blur() }}>
      {props.children}
    </Fab>
    {props.onClickMore ? <MoreButton style={isSmartphone() ? props.isOpen ? {position:'relative', top:-103/* top:-35 */, left:-95 /* left:-15 */, marginRight:-81/* , display:'none' */, opacity: 0.8, transition: '0.3s ease-out', transitionDelay:(tDelay)} : {position:'relative', top:-10/* top:-35 */, left:-95 /* left:-15 */, marginRight:-81/* , display:'none' */, opacity: 0, transition: '0.1s ease-out', transitionDelay:'0s'} : props.isOpen ? {position:'relative', top:-53/* top:-35 */, left:-52 /* left:-15 */, marginRight:-41/* , display:'none' */, opacity:0.8, transition: '0.3s ease-out', transitionDelay:(tDelay)}: {position:'relative', top:-10/* top:-35 */, left:-52 /* left:-15 */, marginRight:-41/* , display:'none' */, opacity:0, transition: '0.1s ease-out', transitionDelay:'0s'}}
    /* show={showMore} */ show={true} color={props.color} htmlColor={props.htmlColor} iconColor={props.iconColor}
    onClickMore = {props.onClickMore}
    /> : undefined}
  </div>
}

export const FabWithTooltip: React.FC<MyFabProps> = (props) => {
  if (props.title) {
    return <Tooltip placement="top-start" arrow={true}
    title={props.title}>
    <span style={{paddingTop:20}} >
      <FabMain {...props} />
    </span>
    </Tooltip>
  }
  return <FabMain {...props} />
}
