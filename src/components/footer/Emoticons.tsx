import {BMProps} from '@components/utils'
import {Collapse} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import smileIcon from '@images/whoo-screen_btn-smile.png'
/* import symSmileIcon from '@images/whoo-screen_sym-smile.png' */
import clapIcon from '@images/whoo-screen_btn-clap.png'
/* import symClapIcon from '@images/whoo-screen_sym-clap.png' */
import handIcon from '@images/whoo-screen_btn-hand.png'
/* import symHandIcon from '@images/whoo-screen_sym-hand.png' */

import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef} from 'react'
/* import {FabMain} from './FabEx' */


const buttonStyle = {
  '&': {
    margin: '5px',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    textAlign: 'center',
  },
}

const useStyles = makeStyles({
  emoticon:{
    display: 'block',
    height: 50,
    position:'relative',
    cursor: 'pointer',
    backgroundColor: '#9e886c', //  '#ef4623' : '#9e886c',
    right: 20,
    ...buttonStyle,
  },
  emoticonActive:{
    display: 'block',
    height: 50,
    position:'relative',
    cursor: 'pointer',
    backgroundColor: '#ef4623', //  '#ef4623' : '#9e886c',
    right: 20,
    ...buttonStyle,
  },

  container:{
    position: 'absolute',
    width: '100%',
    top: '63%',
    padding: 0,
    right: 0,
    outline: 'none',
    //pointerEvents: 'none',
  },
  wrapper:{width:'100%'},
  wrapperInner:{width:'100%', display:'flex', flexDirection:'column', alignItems:'flex-end'},
})

class Member{
  timeoutOut:NodeJS.Timeout|undefined = undefined
  touched = false
}

export const Emoticons: React.FC<BMProps&{height?:number}> = (props) => {
  const {map, participants} = props.stores
  //  showor not
  /* const [show, setShow] = React.useState<boolean>(true)*/

  // For toggle emoticons
  const [toggleSmile, setToggleSmile] = React.useState<boolean>(false)
  const [toggleClap, setToggleClap] = React.useState<boolean>(false)
  const [toggleHand, setToggleHand] = React.useState<boolean>(false)

  const memberRef = useRef<Member>(new Member())
  const member = memberRef.current
  const containerRef = useRef<HTMLDivElement>(null)
  const classes = useStyles()

  //  Footer collapse conrtrol
  function checkMouseOnBottom() {
    return map.screenSize[1] - (map.mouse[1] - map.offset[1]) < 90
  }
  const mouseOnBottom = useObserver(checkMouseOnBottom)
  useEffect(() => {
    if (checkMouseOnBottom()) { member.touched = true }
    setShowFooter(mouseOnBottom || !member.touched)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [mouseOnBottom, member.touched])
  function setShowFooter(show: boolean) {
    if (show) {
      //setShow(true)
      if (member.timeoutOut) {
        clearTimeout(member.timeoutOut)
        member.timeoutOut = undefined
      }
      containerRef.current?.focus()
    }else {
      if (!member.timeoutOut) {
        member.timeoutOut = setTimeout(() => {
          //setShow(false)
          member.timeoutOut = undefined
        },                             500)
      }
    }
  }

  //  keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      //  console.log(`onKeyDown: code: ${e.code}`)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [])

  //  render footer
  return React.useMemo(() => {
    //  Create menu list for device selection
    //  Device list update when the user clicks to show the menu
    //const fabSize = 45 //props.height
    const iconSize = 55 //props.height ? props.height * 0.7 : 42
    function toggleSmileButton() {
      participants.local.emoticon = ''
      setToggleHand(false)
      setToggleClap(false)
      setTimeout(()=>{
        if(toggleSmile) {
          participants.local.emoticon = ''
          setToggleSmile(false)
        } else {
          participants.local.emoticon = 'smile'
          setToggleSmile(true)
        }
      },100)
    }
    function toggleClapButton() {
      participants.local.emoticon = ''
      setToggleSmile(false)
      setToggleHand(false)
      setTimeout(()=>{
        if(toggleClap) {
          participants.local.emoticon = ''
          setToggleClap(false)
        } else {
          participants.local.emoticon = 'clap'
          setToggleClap(true)
        }
      },100)
    }
    function toggleHandButton() {
      participants.local.emoticon = ''
      setToggleSmile(false)
      setToggleClap(false)
      setTimeout(()=>{
        if(toggleHand) {
          participants.local.emoticon = ''
          setToggleHand(false)
        } else {
          participants.local.emoticon = 'hand'
          setToggleHand(true)
        }
      },100)
    }

    return <div ref={containerRef} className={classes.container}>
      <Collapse in={true} classes={classes}>

      <div className={toggleSmile ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleSmileButton}>
          <img src={smileIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-5px'}} alt='' />
        </div>

        <div className={toggleClap ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleClapButton}>
          <img src={clapIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-5px'}} alt='' />
        </div>

        <div className={toggleHand ? classes.emoticonActive : classes.emoticon} onMouseDown={toggleHandButton}>
          <img src={handIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'-5px', left:'-4px'}} alt='' />
        </div>

        {/* ADD ANIMATED ICONS*/}
        {/* <FabMain size={fabSize} onClick={toggleSmileButton}
          style={{marginLeft:'35em', opacity:1}}>
          <img src={toggleSmile ? symSmileIcon : smileIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'2px'}} alt='' />
        </FabMain>
        <FabMain size={fabSize} onClick={toggleClapButton} 
          style={{marginLeft:'0em', opacity:1}}>
          <img src={toggleClap ? symClapIcon : clapIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'2px'}} alt='' />
        </FabMain>
        <FabMain size={fabSize} onClick={toggleHandButton} 
          style={{marginLeft:'0em', opacity:1}}>
          <img src={toggleHand ? symHandIcon : handIcon} style={{width:iconSize, height:iconSize, position:'relative', top:'2px'}} alt='' />
        </FabMain> */}
      </Collapse>
    </div >
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleSmile, toggleClap, toggleHand]

    )
}
Emoticons.displayName = 'Emoticons'
