import {BMProps} from '@components/utils'
//import usageEn from '@images/usage.en.png'
//import usageJa from '@images/usage.ja.png'
import bgCircle from '@images/circle_bg.png'
import peopleLogin from '@images/people_login.png'
import btnGo from '@images/go.png'
import logo_es from '@images/logo.png'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import TranslateIcon from '@material-ui/icons/Translate'
import {i18nSupportedLngs, useTranslation} from '@models/locales'
import {urlParameters} from '@models/url'
import {isSmartphone} from '@models/utils'
import errorInfo from '@stores/ErrorInfo'
import React, {useState} from 'react'
import {ErrorDialogFrame} from './ErrorDialog'

export const TheEntrance: React.FC<BMProps> = (props) => {
  const {participants} = props.stores
  const [name, setName] = useState(participants.local.information.name)
  const savedRoom = sessionStorage.getItem('room')
  const [room, setRoom] = useState(urlParameters.room ? urlParameters.room : savedRoom ? savedRoom : '')

  const onClose = (save: boolean) => {
    if (save) {
      if (participants.local.information.name !== name){
        participants.local.information.name = name
        participants.local.sendInformation()
        participants.local.saveInformationToStorage(true)
      }
      urlParameters.room = room
      sessionStorage.setItem('room', room)
    }
    errorInfo.clear()
  }
  const onKeyPress = (ev:React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      onClose(true)
    }else if (ev.key === 'Esc' || ev.key === 'Escape') {
      onClose(false)
    }
  }

  const {t, i18n} = useTranslation()

  /* const tfIStyle = {fontSize: isSmartphone() ? '2em' : '1em',
    height: isSmartphone() ? '2em' : '1.5em'}
  const tfLStyle = {fontSize: isSmartphone() ? '1em' : '1em'}
  const tfDivStyle = {height: isSmartphone() ? '4em' : '3em'} */

  const tfIStyle = {fontSize: isSmartphone() ? '2em' : '1em',
    height: isSmartphone() ? '2em' : '1.5em', color: 'black', backgroundColor: 'white', padding: '3px'}
  const tfLStyle = {fontSize: isSmartphone() ? '1em' : '1em', color: 'white'}
  const tfDivStyle = {height: isSmartphone() ? '4em' : '3em', padding: '3px 0 0 0', width: '15em'}


  return <ErrorDialogFrame onClose={()=>{errorInfo.clear()}}>
    {/* <DialogContent style={{fontSize: isSmartphone() ? '2em' : '1em'}}>
      <Button style={{position:'absolute', top:30, right:20}} onClick = {() => {
        const idx = (i18nSupportedLngs.findIndex(l => l === i18n.language) + 1) % i18nSupportedLngs.length
        i18n.changeLanguage(i18nSupportedLngs[idx])
      }}>
        <TranslateIcon />
      </Button>
      <h2>Binaural Meet</h2>
      <p>
        <img style={{float: 'right', width:'28em'}} src={i18n.language === 'ja' ? usageJa : usageEn}
          alt="usage" />
        {t('enAbout')}&nbsp;
      <a href={t('enTopPageUrl')}>{t('enMoreInfo')}</a>
      </p>
      <br />
      <TextField label={t('YourName')} multiline={false} value={name} style={tfDivStyle}
        inputProps={{style: tfIStyle, autoFocus:true}} InputLabelProps={{style: tfLStyle}}
        onChange={event => setName(event.target.value)} onKeyPress={onKeyPress} fullWidth={true}
      />
      <Box mt={4}>
        <TextField label={t('Venue')} multiline={false} value={room} style={tfDivStyle}
        inputProps={{style: tfIStyle, autoFocus:false}} InputLabelProps={{style: tfLStyle}}
        onChange={event => setRoom(event.target.value)} onKeyPress={onKeyPress} fullWidth={true}
        />
      </Box>
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={() => onClose(true)}
          style={{fontSize:isSmartphone() ? '1.25em' : '1em'}}>
          {t('EnterTheVenue')}
        </Button>
      </Box>
    </DialogContent> */}
    <DialogContent style={{overflowY: 'hidden', backgroundColor: '#5f7ca0', fontSize: isSmartphone() ? '2em' : '1em'}}>
      <Button style={{position:'absolute', top:30, right:20, display:'none'}} onClick = {() => {
        const idx = (i18nSupportedLngs.findIndex(l => l === i18n.language) + 1) % i18nSupportedLngs.length
        i18n.changeLanguage(i18nSupportedLngs[idx])
      }}>
        <TranslateIcon />
      </Button>
     {/*  <h2>EarShot Chat</h2> */}
      <p>
        {/* <img style={{float: 'right', width:'28em', display:'none'}} src={i18n.language === 'ja' ? usageJa : usageEn}
          alt="usage" /> */}
        {/* {t('enAbout')}&nbsp; */}
      {/* <a href={t('enTopPageUrl')}>{t('enMoreInfo')}</a> */}
      </p>
      <div style={{position: 'relative', width:'100em', display:'block'}}/>
      {/* <img style={{position: 'relative', left: '21em', width:'30em', display:'block'}} src={bgCircle}
        alt="" /> */}
      <div style={{position: 'relative', top: '3em', width: '100%', textAlign:'center'}}>
        <img style={{width:'30em'}} src={bgCircle}
        alt="" />
      </div>
      <div style={{position: 'relative', top: '-23em', width: '100%', textAlign:'center'}}>
        <img style={{width:'10em'}} src={peopleLogin} alt="" />
      </div>
      <br />
      <Box mt={1}>
      <div style={{position: 'relative', top: '-24em', width: '100%', textAlign:'center'}}>
        <TextField label={t('YourName')} multiline={false} value={name} style={tfDivStyle}
          inputProps={{style: tfIStyle, autoFocus:true}} InputLabelProps={{style: tfLStyle}}
          onChange={event => setName(event.target.value)} onKeyPress={onKeyPress} fullWidth={false}
        />
      </div>
      </Box>
      <Box mt={2}>
      {/* readOnly: true */}
      <div style={{position: 'relative', top: '-24em', width: '100%', textAlign:'center'}}>
        <TextField label={t('Venue')} multiline={false} value={room} style={tfDivStyle}
        inputProps={{style: tfIStyle, autoFocus:false}} InputLabelProps={{style: tfLStyle}}
        onChange={event => setRoom(event.target.value)} onKeyPress={onKeyPress} fullWidth={false}
        />
      </div>
      </Box>
      <Box mt={2}>
      <div style={{position: 'relative', top: '-24em', width: '100%', textAlign:'center'}}>
        {/* <Button variant="contained" color="primary" onClick={() => onClose(true)}
          style={{fontSize:isSmartphone() ? '1.25em' : '1em'}}>
          {t('EnterTheVenue')}
        </Button> */}
        <img style={{width:'4em'}} src={btnGo} onClick={() => onClose(true)} alt="" />
      </div>
      </Box>
      <Box mt={7}>
      <div style={{position: 'relative', top: '-24em', width: '100%', textAlign:'center'}}>
        <img style={{width:'8em'}} src={logo_es} alt="" />
      </div>
      </Box>
    </DialogContent>
  </ErrorDialogFrame>
}
TheEntrance.displayName = 'TheEntrance'
