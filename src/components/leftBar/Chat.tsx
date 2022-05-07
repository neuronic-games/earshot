import { ImageAvatar } from '@components/avatar/ImageAvatar'
import {formatTimestamp} from '@components/utils'
import { textToLinkedText } from '@components/utils/Text'
import {Tooltip} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
/* import SendIcon from '@material-ui/icons/Send' */
import {connection} from '@models/api/ConnectionDefs'
import {MessageType} from '@models/api/MessageType'
import {t} from '@models/locales'
import {isDarkColor} from '@models/utils'
import chat, {ChatMessage, ChatMessageToSend, ChatMessageType} from '@stores/Chat'
import {Observer} from 'mobx-react-lite'
import React from 'react'
import {BMProps} from '../utils'
import {styleForList} from '../utils/styles'
import {TextLineStyle} from './LeftBar'

import btnGo from '@images/go.png'

const colorMapBlack: { [key in ChatMessageType]: string } = {
  text: 'black',
  called: 'red',
  callTo: 'black',
  log: 'black',
  private: 'purple',
}
const colorMapWhite: { [key in ChatMessageType]: string } = {
  text: 'white',
  called: 'red',
  callTo: 'white',
  log: 'white',
  private: 'purple',
}


export const ChatLine: React.FC<BMProps & TextLineStyle &{message: ChatMessage}> = (props) => {
  /* const scale = props.message.type === 'log' || props.message.type === 'callTo' ? 0.6 : 1 */
  const scale = props.message.type === 'log' || props.message.type === 'callTo' ? 1 : 1
  const lineHeight = props.lineHeight * scale
  const fontSize = props.fontSize * scale
  const {roomInfo, participants, map} = props.stores

  //console.log(props.message.text.split(" ")[1])

  const textColor = (props.message.text.split(" ")[1] === 'joined.' ? 'green' : (props.message.text.split(" ")[1] === 'Left.' ? 'red' : 'black'))


  return <Observer>{() => {
    const timestamp = formatTimestamp(props.message.timestamp)    //  make formated timestamp for tooltip
    const colorMap = isDarkColor(roomInfo.backgroundFill) ? colorMapWhite : colorMapBlack
    /* const backColor = isDarkColor(roomInfo.backgroundFill) ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)' */
    const backColor = isDarkColor(roomInfo.backgroundFill) ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'

    const localUser = props.message.pid === participants.localId

    return <Tooltip title={
      props.message.type==='private' ?
      <>{t(props.message.pid===participants.localId ? 'cmPrivateTo' : 'cmPrivateFrom',
        {name:props.message.name})}<br/>{timestamp}</>
        : <>{props.message.name}<br/>{timestamp}</>
      } placement="right">
      {localUser ?
      <div style={{display:'flex', overflowY:'auto', overflowX:'hidden', wordWrap:'break-word', marginTop:2, marginLeft:10, fontSize, padding:'5px', /* backgroundColor:backColor,  */alignItems:'flex-end', justifyContent:'flex-start'}}>
        <span style={{marginRight:'0.3em'}} onClick={()=>{
          const from = participants.find(props.message.pid)
          if (from) { map.focusOn(from) }
        }}>
          <ImageAvatar name={props.message.name} colors={props.message.colors}
            avatarSrc={props.message.avatarUrl} size={lineHeight*1.7} border={true}
          />
        </span>
        <span style={{/* color:colorMap[props.message.type] */color:textColor, backgroundColor:backColor, border:'1px solid #ffffff', padding:'10px', marginTop:'-5px', marginLeft:'15px', borderRadius:'15px', minWidth:'10%', maxWidth:'62%', userSelect:'none'}}>
          {textToLinkedText(props.message.text)}
          <div style={{color:colorMap[props.message.type], backgroundColor:backColor, border:'1px solid #ffff00', padding:'5px', marginTop:'-17px', marginLeft:'-17px', borderRadius:'1px', borderTop:'0px solid #ffffff', borderRight:'0px solid #ffffff', borderBottom:'1px solid #ffffff', borderLeft:'1px solid #ffffff', width:'5px', height:'5px', content:'', transform:'rotate(45deg)'}}
          /* style={{content: "", position: 'relative', left: '-25px', top: '-10px', width: 0, height: 0, borderTop: '13px solid transparent', borderRight: '20px solid white', borderBottom: '1px solid transparent'}} */>
          </div>
        </span>
    </div>
    : <div style={{display:'flex', overflowY:'auto', overflowX:'hidden', wordWrap:'break-word', marginTop:2, marginLeft:10, marginRight:0, fontSize, padding:'5px', /* backgroundColor:backColor,  */alignItems:'flex-end', justifyContent:'flex-end'}}>
    <span style={{/* color:colorMap[props.message.type] */color:textColor, backgroundColor:'#B3E1EA', border:'1px solid #B3E1EA', padding:'10px', marginTop:'-5px', marginLeft:'15px', marginRight:'15px', borderRadius:'12px', minWidth:'10%', maxWidth:'62%', userSelect:'none'}}>
      {textToLinkedText(props.message.text)}
      <div style={{color:colorMap[props.message.type], backgroundColor:'#B3E1EA', border:'1px solid #B3E1EA', padding:'5px', marginTop:'-17px', marginLeft:'101%', /* marginRight:'15px', */ borderRadius:'1px', borderTop:'0px solid #B3E1EA', borderRight:'0px solid #B3E1EA', borderBottom:'1px solid #B3E1EA', borderLeft:'1px solid #B3E1EA', width:'5px', height:'5px', content:'', transform:'rotate(45deg)'}}>
      </div>
    </span>
    <span style={{marginRight:'0.3em'}} onClick={()=>{
      const from = participants.find(props.message.pid)
      if (from) { map.focusOn(from) }
    }}>

      <ImageAvatar name={props.message.name} colors={props.message.colors}
        avatarSrc={props.message.avatarUrl} size={lineHeight*1.7} border={true}
      />
    </span>
</div> }
   </Tooltip>
  }}</Observer>
}

function sendChatMessage(text: string, sendTo: string, props: BMProps){
  const msg:ChatMessageToSend = {msg:text, ts: Date.now(), to: sendTo}
  connection.conference.sendMessage(MessageType.CHAT_MESSAGE, msg, sendTo)
  const local = props.stores.participants.local
  if (sendTo) {
    const remote = props.stores.participants.remote.get(sendTo)
    if (remote){
      chat.addMessage(new ChatMessage(text, local.id, remote.information.name,
        local.information.avatarSrc, local.getColor(), Date.now(), 'private'))
    }
  }else{
    chat.addMessage(new ChatMessage(text, local.id, local.information.name,
      local.information.avatarSrc, local.getColor(), Date.now(), 'text'))
  }
}

export const ChatInBar: React.FC<BMProps&TextLineStyle>  = (props) => {
  //  console.log('Render RawContentList')
  const {chat, roomInfo, participants, map} = props.stores
  const classes = styleForList({height:props.lineHeight, fontSize:props.fontSize})
  const [text, setText] = React.useState('')

  return <div className={classes.container}
    style={{height:'100%', display:'flex', flexDirection: 'column-reverse',
    overflowY:'auto', overflowX:'hidden',/* overflowX:'clip',  */whiteSpace: 'pre-line', resize:'horizontal', minWidth:'290px'}} >
    <form noValidate autoComplete="off">
      <Tooltip title={t('cmSend')} placement="right">
        <div style={{position:'relative', top:15, /* marginTop:-26,  */textAlign:'right'/* , zIndex:1000 */}}>
          <IconButton size={'small'} onClick={()=>{
            const nameTo = chat.sendTo ?
              participants?.find(chat.sendTo)?.information?.name : undefined
            sendChatMessage(text, nameTo ? chat.sendTo : '', props)
            setText('')
          }}>
           {/*  <SendIcon color="primary" /> */}

            <img style={{width:'2.9em', /* position:'relative',  */bottom:'1px'/* , right:'3px' */, position:'relative' , left:'1px'}} src={btnGo} draggable={false} alt="" />

          </IconButton>
        </div>
      </Tooltip>
      <Observer>{()=>{
        const nameTo = chat.sendTo ? participants?.find(chat.sendTo)?.information?.name : undefined
        const textColor = isDarkColor(roomInfo.backgroundFill) ? 'white' : 'black'

        return <TextField variant='outlined' label={''/* nameTo ? t('cmToName', {name: nameTo}) : t('cmToAll') */} multiline={true} value={text} rowsMax={2}
          style={{width:'77%', minWidth:'30%', userSelect:'none', marginTop:'-38px', marginLeft:'15px', right:'3px'/* , border:'1px solid yellow', bottom:'20px' */, resize:'horizontal'}} /* size={props.lineHeight > 20 ? 'medium' : 'small'}
 */          InputProps={{style:{color:textColor, backgroundColor: 'white', borderRadius:'8px', height:'50px'}}}
          InputLabelProps={{style:{color:'black'}}}
          onFocus={()=>{map.keyInputUsers.add('chat')}}
          onBlur={()=>{map.keyInputUsers.delete('chat')}}
          onKeyDown={(ev)=>{
            //console.log(`key = ${ev.key}`, ev)

            if (ev.key === 'Escape' || ev.key === 'Esc'){ //  Esc key
              chat.sendTo = ''
            }
          }}
          onKeyPress={(ev)=>{
            //console.log(ev.ctrlKey, " key ", ev.keyCode)
            //  if (ev.key === 'Enter'){  }
            /* if (ev.key === '\n'){ //  CTRL + Enter
              sendChatMessage(text, nameTo ? chat.sendTo : '', props)
              setText('')
            } */

            if(ev.ctrlKey && (ev.keyCode === 0 || ev.keyCode === 76)) {
              sendChatMessage(text, nameTo ? chat.sendTo : '', props)
              setText('')
            }
          }}
          onChange={(ev)=>{ setText(ev.target.value) }}
        />
      }}</Observer>
    </form>
    <div>{  /* for indent: style={{marginLeft: '0.5em', textIndent: '-0.5em'}} */}
      <Observer>{()=><>{
        chat.messages.map((m, idx) =>
          <ChatLine key={idx} message={m} {...props} /> )
        }</>}</Observer>
    </div>
  </div>
}
ChatInBar.displayName = 'Chat'

