import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import {connection} from '@models/api'
import {MessageType} from '@models/api/MessageType'
import {isDarkColor, rgb2Color} from '@models/utils'
import roomInfo from '@stores/RoomInfo'
import contents from '@stores/sharedContents/SharedContents'
import {Observer} from 'mobx-react-lite'
import React from 'react'
import {SketchPicker} from 'react-color'
import {RemoteTrackLimitControl} from './RemoteTrackLimitControl'

export interface AdminConfigFormProps{
  close?: () => void,
}
function onKeyPress(ev:React.KeyboardEvent){
  if (ev.key === 'Enter') {
    let pass = roomInfo.roomProps.get('password')
    roomInfo.passMatched = roomInfo.password === (pass ? pass : '')
  }
}
function btnColor(){
  return roomInfo.passMatched ? 'primary' : 'default'
}
export const AdminConfigForm: React.FC<AdminConfigFormProps> = (props: AdminConfigFormProps) => {
  const [clearName, setClearName] = React.useState('')
  const [showFillPicker, setShowFillPicker] = React.useState(false)
  const [showColorPicker, setShowColorPicker] = React.useState(false)
  const fillButton = React.useRef<HTMLButtonElement>(null)
  const colorButton = React.useRef<HTMLButtonElement>(null)

  return <Observer>{()=>{
    const textForFill = isDarkColor(roomInfo.backgroundFill) ? 'white' : 'black'
    const textForColor = isDarkColor(roomInfo.backgroundColor) ? 'white' : 'black'

    return  <Box m={2}>
      <Box m={2}>
        <RemoteTrackLimitControl key="remotelimitcontrol" />
      </Box>
      <Box mt={2} mb={2}>
        <TextField autoFocus label="Admin password" type="password" style={{marginTop:-12}}
          value={roomInfo?.password} onChange={(ev)=>{ roomInfo.password=ev.currentTarget.value}}
          onKeyPress={onKeyPress}/>
        &emsp;
        <Button variant="contained" color="primary" style={{textTransform:'none'}} onClick={() => {
          let pass = roomInfo.roomProps.get('password')
          if (!pass){ pass = '' }
          roomInfo.passMatched = roomInfo?.password === pass
        }}> Check </Button>&emsp;
        {roomInfo.passMatched ? 'OK': 'Not matched'}
      </Box>
      <Box mt={2} mb={2}>
        <TextField label="New password to update" type="text" style={{marginTop:-12}}
          value={roomInfo?.newPassword} onChange={(ev)=>{roomInfo.newPassword=ev.currentTarget.value}}
        />&emsp;
        <Button variant="contained" color={btnColor()} disabled={!roomInfo.passMatched} style={{textTransform:'none'}}
          onClick={() => {
            if (roomInfo.passMatched){
              connection.conference.setRoomProp('password', roomInfo.newPassword)
            }
          }}> Update password </Button>&emsp;
      </Box>
      <Box mt={2}>
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
          if (roomInfo.passMatched) { connection.conference.sendMessage(MessageType.MUTE_VIDEO, true) }
        }}> Mute all videos </Button> &nbsp;
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
          if (roomInfo.passMatched) { connection.conference.sendMessage(MessageType.MUTE_VIDEO, false) }
        }}> Show all videos </Button>&emsp;
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
          if (roomInfo.passMatched) { connection.conference.sendMessage(MessageType.MUTE_AUDIO, true) }
        }}> Mute all mics </Button>&nbsp;
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
          if (roomInfo.passMatched) { connection.conference.sendMessage(MessageType.MUTE_AUDIO, false) }
        }}> Switch on all mics </Button>
      </Box>
      <Box mt={2}>
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
          if (roomInfo.passMatched) {
            contents.removeAllContents()
          }
        }}> Remove all Contents </Button>&emsp;
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
            if (roomInfo.passMatched){
              contents.all.filter(c => c.ownerName === clearName).forEach(c => contents.removeByLocal(c.id))
            }
        }}> Clear contents by user name </Button> &thinsp;
        <TextField label="name" type="text" style={{marginTop:-12}}
            value={clearName} onChange={(ev)=>{setClearName(ev.currentTarget.value)}} />
      </Box>
      <Box mt={2}>
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
          if (roomInfo.passMatched) {
            connection.conference.sendMessageViaJitsi(MessageType.RELOAD_BROWSER, {})
            if (connection.conference.bmRelaySocket?.readyState === WebSocket.OPEN){
              /* connection.conference.sendMessageViaRelay(MessageType.RELOAD_BROWSER, {}) */
              connection.conference.pushOrUpdateMessageViaRelay(MessageType.RELOAD_BROWSER, {})
            }
          }
        }}> Reload </Button>&emsp;

        <Button variant="contained" disabled={!roomInfo.passMatched}
          style={{backgroundColor:rgb2Color(roomInfo.backgroundFill), color:textForFill, textTransform:'none'}}
          onClick={()=>{if (roomInfo.passMatched){ setShowFillPicker(true) }}} ref={fillButton}>
          Back color</Button>
        <Popover open={showFillPicker}
          onClose={()=>{
            setShowFillPicker(false)
            connection.conference.setRoomProp('backgroundFill', JSON.stringify(roomInfo.backgroundFill))
          }}
          anchorEl={fillButton.current} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
          <SketchPicker color = {{r:roomInfo.backgroundFill[0], g:roomInfo.backgroundFill[1],
            b:roomInfo.backgroundFill[2]}} disableAlpha
            onChange={(color, event)=>{
              event.preventDefault()
              roomInfo.backgroundFill = [color.rgb.r, color.rgb.g, color.rgb.b]
            }}
          />
        </Popover>
        &nbsp;
        <Button variant="contained" disabled={!roomInfo.passMatched}
          style={{backgroundColor:rgb2Color(roomInfo.backgroundColor), color:textForColor, textTransform:'none'}}
          onClick={()=>{if (roomInfo.passMatched){ setShowColorPicker(true)} }} ref={colorButton}>
          Pattern color</Button>
        <Popover open={showColorPicker}
          onClose={()=>{
            setShowColorPicker(false)
            connection.conference.setRoomProp('backgroundColor', JSON.stringify(roomInfo.backgroundColor))
          }}
          anchorEl={colorButton.current} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
          <SketchPicker color = {{r:roomInfo.backgroundColor[0], g:roomInfo.backgroundColor[1],
            b:roomInfo.backgroundColor[2]}} disableAlpha
            onChange={(color, event)=>{
              event.preventDefault()
              roomInfo.backgroundColor = [color.rgb.r, color.rgb.g, color.rgb.b]
            }}
          />
        </Popover>&nbsp;
        <Button variant="contained" color={btnColor()} style={{textTransform:'none'}}
          disabled={!roomInfo.passMatched} onClick={() => {
          if (roomInfo.passMatched) {
            roomInfo.backgroundFill = [0xDF, 0xDB, 0xE5]
            roomInfo.backgroundColor = [0xB9, 0xB2, 0xC4]
            connection.conference.setRoomProp('backgroundFill', JSON.stringify(roomInfo.backgroundFill))
            connection.conference.setRoomProp('backgroundColor', JSON.stringify(roomInfo.backgroundColor))
          }
        }}> Default </Button>&emsp;

      </Box>

    </Box>}
  }</Observer>
}