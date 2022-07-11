import {sharedContentHandler} from '@components/map/ShareLayer/SharedContent'
import {SharedContentForm} from '@components/map/ShareLayer/SharedContentForm'
import {Tooltip} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import DoneIcon from '@material-ui/icons/CheckCircle'
import {isContentOutOfRange, ISharedContent, SharedContentInfo} from '@models/ISharedContent'
import {useTranslation} from '@models/locales'
import {findReverseColorRGB, findTextColorRGB, getRandomColor, getRandomColorRGB, isSmartphone, rgb2Color} from '@models/utils'
/* import {isDarkColor} from '@models/utils' */
import {ParticipantBase} from '@stores/participants/ParticipantBase'
import contents from '@stores/sharedContents/SharedContents'
import {autorun} from 'mobx'
import {Observer} from 'mobx-react-lite'
import {useObserver} from 'mobx-react-lite'
import React from 'react'
import {contentTypeIcons} from '../map/ShareLayer/Content'
import {BMProps} from '../utils'
import {styleForList} from '../utils/styles'
import {TextLineStyle} from './LeftBar'

import {ImageAvatar} from '@components/avatar/ImageAvatar'
/* import {getColorOfParticipant} from '@models/Participant' */
import { Participants } from '@stores/participants/Participants'

function locatedContentOnly(content: ISharedContent|undefined){
  if (isContentOutOfRange(content)){ return undefined }

  return content
}

export const ContentLine: React.FC<BMProps & TextLineStyle &
{participant: ParticipantBase, content: SharedContentInfo, ap:Participants}> = (props) => {
  const classes = styleForList({height:props.lineHeight, fontSize:props.fontSize})
  const [showForm, setShowForm] = React.useState(false)
  const ref = React.useRef<HTMLButtonElement>(null)
  const {lineHeight, content, ...contentProps} = props
  const targetContent = locatedContentOnly(props.stores.contents.find(props.content.id))
  const map = props.stores.map

  //const ownerUser = props.ap.find(props.content.id.split('_')[1])
  //console.log(props.content.id.split("_")[0], " AAB")
  //console.log(props.ap., " ---------- ", props.content.id)
  /* console.log(props.content)*/

  const userName = useObserver(() => {
    return props.content.ownerName
  })

  const userAvatar = useObserver(() => {
    return props.content.ownerURL
  })

  /* const userName = useObserver(() => {
    let remotes = Array.from(props.stores.participants.remote.keys()).filter(key => key !== props.stores.participants.localId)
    for(let [i] of remotes.entries()) {
      if(props.stores.participants.remote.get(remotes[i])?.information.name === props.content.ownerName) {
        return props.stores.participants.remote.get(remotes[i])?.information.name
      }
    }
    if (props.stores.participants.local.information.name === props.content.ownerName) {
      return props.stores.participants.local.information.name
    } else {
      return ''
    }
  })

  const userAvatar = useObserver(() => {
    let remotes = Array.from(props.stores.participants.remote.keys()).filter(key => key !== props.stores.participants.localId)
    for(let [i] of remotes.entries()) {
      if(props.stores.participants.remote.get(remotes[i])?.information.name === props.content.ownerName) {
        return props.stores.participants.remote.get(remotes[i])?.information.avatarSrc
      }
    }
    if (props.stores.participants.local.information.name === props.content.ownerName) {
      return props.stores.participants.local.information.avatarSrc
    } else {
      return ''
    }
  }) */


  /* let colorMix = [0xD0, 0xD0, 0xE0]
  const reverseRGB = findReverseColorRGB(colorMix)
  let textColor = findTextColorRGB(colorMix)
  const colorMixFinal = [rgb2Color(colorMix), rgb2Color(textColor), rgb2Color(reverseRGB)]

  const colorsIcon = useObserver(() => {
    let remotes = Array.from(props.stores.participants.remote.keys()).filter(key => key !== props.stores.participants.localId)
    for(let [i] of remotes.entries()) {
      if(props.stores.participants.remote.get(remotes[i])?.information.name === props.content.ownerName) {
        return getColorOfParticipant(Object(props.stores.participants.remote.get(remotes[i]))?.information)
      }
    }
    if (props.stores.participants.local.information.name === props.content.ownerName) {
      return getColorOfParticipant(props.stores.participants.local.information)
    } else {
      return  colorMixFinal
    }
  }) */


  const colorsIcon = useObserver(() => {
    let color = props.content.color
    if (!color.length) {
      if (userName?.length){
        color = getRandomColorRGB(userName)
      }else{
        color = [0xD0, 0xD0, 0xE0]
      }
    }
    let textColor = props.content.color
    if (!textColor.length) {
      textColor = findTextColorRGB(color)
    }
    const reverseRGB = findReverseColorRGB(color)
    const colors = [rgb2Color(color), rgb2Color(textColor), rgb2Color(reverseRGB)]
    return colors
  })

  //console.log(colorsIcon, " --AAAA-- ", _colors)
  /* const colorsIcon = useObserver(() => {
    return getColorOfParticipant(props.content.ownerInfo)
  })  */
  //console.log(colorsIcon1, " colorsIcon1")
  //console.log(cUName, " uname")
  //const userAvatar = props.ap.find(props.content.id.split('_')[0])?.information.avatarSrc
  //const userName = props.ap.find(props.content.id.split('_')[0])?.information.name
 //console.log(userAvatar, " Avatar")
  /* const colorsIcon1 = useObserver(() => {
    if(userName !== undefined) {
        return getColorOfParticipant(Object(props.ap.find(props.content.id.split('_')[0]))?.information)
      } else {
        return colorMixFinal
      }
    }
  ) */

  //console.log(userAvatar, " ---- ", userName)
  //console.log(props.content.id.split('_')[1], " ---- ", props.ap.find(props.content.id.split('_')[0])?.information.name)
  //console.log(props.content.shareType, " --- ")
  //console.log(props.content.ownerURL, " --------- ")

  const contentInfo = (props.content.shareType === "img") ? 'Image' : (props.content.shareType === 'zoneimg') ? 'Chat Zone' : (props.content.shareType === 'text') ? 'Text' : (props.content.shareType === 'screen') ? 'Screen' : ''

  //console.log(contentInfo, " >> contentInfo")

  return <Observer>{()=> {
    const typeIcon = contentTypeIcons(props.content.type, props.fontSize)
    const colors = getRandomColor(props.content.ownerName)

    if (props.content.color?.length){ colors[0] = rgb2Color(props.content.color) }
    if (props.content.textColor?.length){ colors[1] = rgb2Color(props.content.textColor) }

    return <>
      <Tooltip title={<>{props.content.name}<br />{props.content.ownerName}</>} placement="right">
        <Button ref={ref} /* variant="contained" */ className={classes.line}
          style={{/* backgroundColor:colors[0],  */color:'#FFFFFF'/* colors[1] */, margin: '1px 0 1px 10px', textTransform:'none', position:'relative', left:'5px', marginTop: '0px', top:'7px'}}
          onClick={() => {
            const found = contents.find(props.content.id)
            if (found){
              map.focusOn(found)
            }else{
              contents.requestContent([props.content.id])
              const disposer = autorun(()=>{
                const found = contents.find(props.content.id)
                if (found){
                  map.focusOn(found)
                  disposer()
                }
              })
            }
          }}
          onContextMenu={() => {
            const found = locatedContentOnly(contents.find(props.content.id))
            if (found){
              setShowForm(true)
              map.keyInputUsers.add('contentForm')
            }else{
              contents.requestContent([props.content.id])
              const disposer = autorun(()=>{
                const found = locatedContentOnly(contents.find(props.content.id))
                if (found){
                  setShowForm(true)
                  map.keyInputUsers.add('contentForm')
                  disposer()
                }
              })
            }
          }}
        >{typeIcon}
        <div style={{position:'relative', color:'#FFFFFF', left:'5px', display:'flex', fontSize:isSmartphone() ? '2em' : '1em'}}>
        {/* {String(props.content.shareType.charAt(0).toUpperCase() + String(props.content.shareType.slice(1)))} */}
        {contentInfo}
        <div style={{position:'relative', left:'5px', color:'#F7A76B', /* fontSize:isSmartphone() ? '2em' : '1em' *//* '#EDA741' */}}>
        {props.content.name !== '' ?' (' + props.content.name + ')' : ''}
        </div>
        </div>
        {userName !== '' ?
        <div style={{position:'absolute', width:'100%', right:isSmartphone() ? '25px' : '20px', textAlign:'right'/* '#EDA741' */}}>
        <ImageAvatar border={true} colors={colorsIcon} size={isSmartphone() ? 60 : 30} name={userName !== undefined ? userName : ''} avatarSrc={userAvatar !== undefined ? userAvatar : ''} />
        </div> : ''}
        </Button>
      </Tooltip>
      <SharedContentForm {...contentProps} content={targetContent}
        {...sharedContentHandler(props)} open={showForm}
        close={()=>{
          setShowForm(false)
           map.keyInputUsers.delete('contentForm')
        }}
        anchorEl={ref.current} anchorOrigin={{vertical:'top', horizontal:'right'}}
      />
    </>
  }}</Observer>
}

export const ContentList: React.FC<BMProps&TextLineStyle>  = (props) => {
  //  console.log('Render RawContentList')
  /* const roomInfo = props.stores.roomInfo */
  const contents = props.stores.contents
  const all = useObserver(() => {
    const all:SharedContentInfo[] =
    //Array.from(contents.roomContentsInfo.size ? contents.roomContentsInfo.values() : contents.all)
    Array.from(contents.all)
    all.sort((a,b) => {
        let rv = a.name.localeCompare(b.name)
        if (rv === 0){ rv = a.ownerName.localeCompare(b.ownerName) }
        if (rv === 0){ rv = a.type.localeCompare(b.type) }
        if (rv === 0){ rv = a.id.localeCompare(b.id) }
        return rv
    })
    return all
  })


  /* let contentLength = 0
  all.filter(item => item.shareType === "appimg").map((content, index) => (
    content.shareType === 'appimg' ? contentLength = index-1 : 0
  )) */


  const editing = useObserver(() => contents.editing)
  const classes = styleForList({height:props.lineHeight, fontSize:props.fontSize})
  const participants = useObserver(() => props.stores.participants)

  const elements = all.map(c =>
    c.shareType !== 'appimg' ?
    <ContentLine key={c.id} content = {c} {...props} ap={participants}
      participant={participants.find(contents.owner.get(c.id) as string) as ParticipantBase}
       /> : <></>)
  const {t} = useTranslation()

  /* const textColor = useObserver(() => isDarkColor(roomInfo.backgroundFill) ? 'white' : 'black') */

  return <div className={classes.container} >
    <div className={classes.title} style={{color:'#FFFFFF90', marginLeft:isSmartphone() ? '10px':'8px', padding:'10px', borderRadius:'5px', /* border:'1px dotted #FFFFFF80', */ marginTop:'5px', userSelect:'text', fontWeight:'bold', fontSize:isSmartphone() ? '2em' : '1em'}} /* style={{color:textColor}} */>{t('Contents')} ({(props.stores.contents.all.length).toString()})
      {editing ? <Button variant="contained" size="small" color="secondary"
        style={{marginLeft:4, padding:3, height:'1.4em', fontSize:'0.8'}}
        onClick={()=>{ contents.setEditing('')}}>
          <DoneIcon style={{fontSize:'1em'}}/>&nbsp;{t('shareEditEnd')}</Button>: undefined}
    </div>
    {elements}
  </div>
}
ContentList.displayName = 'ContentList'
