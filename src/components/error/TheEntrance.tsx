/* import { BMProps } from "@components/utils";
import usageEn from "@images/usage.en.png";
import usageJa from "@images/usage.ja.png";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import TranslateIcon from "@material-ui/icons/Translate";
import { i18nSupportedLngs, useTranslation } from "@models/locales";
import { urlParameters } from "@models/url";
import { isSmartphone } from "@models/utils";
import errorInfo from "@stores/ErrorInfo";
import React, { useState } from "react";
import { ErrorDialogFrame } from "./ErrorDialog";

export const TheEntrance: React.FC<BMProps> = (props) => {
  const { participants } = props.stores;
  const [name, setName] = useState(participants.local.information.name);
  const savedRoom = sessionStorage.getItem("room");
  const [room, setRoom] = useState(
    urlParameters.room ? urlParameters.room : savedRoom ? savedRoom : ""
  );

  const onClose = (save: boolean) => {
    if (name.length !== 0 || participants.local.information.name.length !== 0){
      if (save || participants.local.information.name.length === 0) {
        if (name.length && participants.local.information.name !== name) {
          participants.local.information.name = name
          participants.local.sendInformation()
          participants.local.saveInformationToStorage(true)
        }
      }
      if (save){
        urlParameters.room = room;
        sessionStorage.setItem("room", room)
      }
      errorInfo.clear()
    }
  };
  const onKeyPress = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") {
      onClose(true);
    } else if (ev.key === "Esc" || ev.key === "Escape") {
      onClose(false);
    }
  };

  const { t, i18n } = useTranslation();

  const tfIStyle = {
    fontSize: isSmartphone() ? "2em" : "1em",
    height: isSmartphone() ? "2em" : "1.5em",
  };
  const tfLStyle = { fontSize: isSmartphone() ? "1em" : "1em" };
  const tfDivStyle = { height: isSmartphone() ? "4em" : "3em" };

  return (
    <ErrorDialogFrame
      onClose={() => { onClose(false) }}
    >
      <DialogContent style={{ fontSize: isSmartphone() ? "2em" : "1em" }}>
        <Button
          style={{ position: "absolute", top: 30, right: 20 }}
          onClick={() => {
            const idx =
              (i18nSupportedLngs.findIndex((l:any) => l === i18n.language) + 1) %
              i18nSupportedLngs.length;
            i18n.changeLanguage(i18nSupportedLngs[idx]);
          }}
        >
          <TranslateIcon />
        </Button>
        <h2>Earshot Chat</h2>
        <p>
          <img
            style={{ float: "right", width: "28em" }}
            src={i18n.language === "ja" ? usageJa : usageEn}
            alt="usage"
          />
          {t("enAbout")}&nbsp;
          <a href={t("enTopPageUrl")}>{t("enMoreInfo")}</a>
        </p>
        <br />
        <TextField
          label={t("YourName")}
          multiline={false}
          value={name}
          style={tfDivStyle}
          inputProps={{ style: tfIStyle, autoFocus: true }}
          InputLabelProps={{ style: tfLStyle }}
          onChange={(event) => setName(event.target.value)}
          onKeyPress={onKeyPress}
          fullWidth={true}
        />
        <Box mt={4}>
          <TextField
            label={t("Venue")}
            multiline={false}
            value={room}
            style={tfDivStyle}
            inputProps={{ style: tfIStyle, autoFocus: false }}
            InputLabelProps={{ style: tfLStyle }}
            onChange={(event) => setRoom(event.target.value)}
            onKeyPress={onKeyPress}
            fullWidth={true}
          />
        </Box>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            disabled={name.length===0}
            onClick={() => onClose(true)}
            style={{ fontSize: isSmartphone() ? "1.25em" : "1em" }}
          >
            {t("EnterTheVenue")}
          </Button>
        </Box>
      </DialogContent>
    </ErrorDialogFrame>
  );
};
TheEntrance.displayName = "TheEntrance";
 */
import {BMProps} from '@components/utils'
import bgCircle from '@images/whoo-screen_chat.png'
import peopleLogin from '@images/people_login.png'
import btnGo from '@images/go.png'
import logo_es from '@images/logo.png'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import TranslateIcon from '@material-ui/icons/Translate'
import {i18nSupportedLngs, useTranslation} from '@models/locales'
import {urlParameters} from '@models/url'
import {isSmartphone} from '@models/utils'
import errorInfo from '@stores/ErrorInfo'
import React, {useState, useEffect} from 'react'
import {ErrorDialogFrame} from './ErrorDialog'
import {generateRoomWithoutSeparator} from '@components/utils/roomNameGenerator'

let nameStr:string = ''
let loginClick:boolean = false
let _roomName:string = ''
let userType:string = ''

export function userName(): string {
  return nameStr
}
export function getLoginClick(): boolean {
  return loginClick
}
export function getRoomName(): string {
  return _roomName
}

export function getUserType(): string {
  return userType
}


export const TheEntrance: React.FC<BMProps> = (props) => {
  const {participants} = props.stores
  const [name, setName] = useState(participants.local.information.name)
  const savedRoom = sessionStorage.getItem('room')
  const [active, setActive] = useState(false)

  const mapData = props.stores.map
  let roomURL = String(urlParameters.room).split("_");
  let num = (Number(roomURL?.length) - 1)
  let concatURL = ''

  if(Number(roomURL?.length) > 1) {
    concatURL = String(urlParameters.room).split("_")[0]
  }

  const [room, setRoom] = useState(urlParameters.room ? roomURL[num] : '')

  const [nameArr, setNameArr] = useState([String(Object(props).room)])
  const passedPlaceholder = nameArr[0]
  const [placeholder, setPlaceholder] = useState(passedPlaceholder.slice(0, 0));
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  /**
   *
   * @param _name
   */
  function setUserNameFromWeb(_name:string) {
    setName(_name)
    let roomNameIndex = window.location.href.indexOf('&room=')
    if(roomNameIndex !== -1) {
      onErrorClose()
    }
  }

  useEffect(() => {
    // New Changes for Website
    // User
    let userNameIndex = window.location.href.indexOf('?u=')
    if(userNameIndex !== -1) {
      let uName = window.location.href.split('?')[1].split("&")[0].split('=')[1]
      setUserNameFromWeb(uName)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.ctrlKey) {return}
      if(e.key === "Enter") {
        window.removeEventListener('keydown', onKeyDown)
        onErrorClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    if(room !== "") {
      return
    }
    const intr = setTimeout(() => {
        clearTimeout(intr)
        setPlaceholder(passedPlaceholder.slice(0, placeholderIndex));
        if (placeholderIndex + 1 > passedPlaceholder.length) {
          clearTimeout(intr)
            const inner = setTimeout(() => {
              clearTimeout(inner)
              setPlaceholderIndex(0)
             setNameArr([generateRoomWithoutSeparator()])
            },4000)
        } else {
            setPlaceholderIndex(placeholderIndex + 1)
        }
    }, 30);
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(intr)
    }
  },);

  /**
   *
   * @param save
   */
  const onClose = (save: boolean) => {
    // get the value
    if (save) {
        if (participants.local.information.name !== name || participants.local.information.name === "Anonymous") {
          userType = "N"
          nameStr = name
          participants.local.information.name = name
          participants.local.information.randomAvatar = []
          participants.local.sendInformation()
          participants.local.saveInformationToStorage(true)
        } else {
          userType = "O"
        }
        if( room === "") {
          urlParameters.room = nameArr[0]
          if(savedRoom !== room) {
            sessionStorage.setItem('room', nameArr[0])
          }
          setRoom(nameArr[0])
        } else {
          urlParameters.room = room
          if(savedRoom !== room) {
            sessionStorage.setItem('room', room)
          }
          setRoom(room)
        }
      }

    //console.log(room, " --- ", nameArr[0])

    if(room !== "") {
      if(concatURL === '') {
        window.history.replaceState({}, "null", ("/?room=" + room))
      } else {
        window.history.replaceState({}, "null", ("/" + concatURL + "/?room=" + room))
      }
    } else {
      if(concatURL === '') {
        window.history.replaceState({}, "null", ("/?room=" + nameArr[0]))
      } else {
        window.history.replaceState({}, "null", ("/" + concatURL + "/?room=" + nameArr[0]))
      }
    }

    // setTimer to clear
    //errorInfo.clear()
    const endScreen = setTimeout(() => {
      clearTimeout(endScreen)
      _roomName = room
      loginClick = true
      errorInfo.clear()
    },10)
  }

  const onErrorClose = () => {
    setActive(true)
    const cTimer = setTimeout(function() {
    //window.setTimeout(function() {
      clearTimeout(cTimer)

      // Here
      let scaleVal = isSmartphone() ? [2,2,2] : [1,1,1]
      const changeMatrix = (new DOMMatrix()).scaleSelf(scaleVal[0], scaleVal[1], scaleVal[2])
      mapData.setMatrix(changeMatrix)
      mapData.setCommittedMatrix(changeMatrix)
      const _timerUserPlace = setTimeout(() =>{
        clearTimeout(_timerUserPlace)
        placeUserAtBlank()
      }, 3000)
      onClose(true)
    },100)
  }
  function placeUserAtBlank() {
    let found:boolean = false
    let randX:number = 0
    let randY:number = 0
    const remotes = Array.from(participants.remote.keys()).filter(key => key !== participants.localId)
    if(remotes.length > 0) {
      for (const [i] of remotes.entries()) {
        let remoteX = Number(participants.remote.get(remotes[i])?.pose.position[0])
        let remoteY = Number(participants.remote.get(remotes[i])?.pose.position[1])
        randX = Number(Math.random() * mapData.screenSize[0]) + 60
        randY = Number(Math.random() * mapData.screenSize[1]) + 60
        if(randX >= (remoteX-60) && randX <= (remoteX+60) && randY >= (remoteY-60) && randY <= (remoteY+60)) {
          placeUserAtBlank()
          return
        } else {
          if(remoteX >= -60 && remoteX <=60 && remoteY >= -60 && remoteY <= 60) {
            found = true
          } else {
          }
        }
      }
    } else {
      mapData.setMouse([mapData.screenSize[0]/2, mapData.screenSize[1]/2])
      participants.local.pose.position = Object.assign({}, mapData.mouseOnMap)
    }

    if(found) {
      mapData.setMouse([randX, randY])
      participants.local.pose.position = Object.assign({}, mapData.mouseOnMap)

      // Place user at the center Location of their own canvas
      mapData.focusOn(participants.local)


    } else {
      mapData.setMouse([mapData.screenSize[0]/2, mapData.screenSize[1]/2])
      participants.local.pose.position = Object.assign({}, mapData.mouseOnMap)
    }

  }

  const {t, i18n} = useTranslation()
  const tfIStyle = {fontSize: isSmartphone() ? '2.5em' : '1em',
    height: isSmartphone() ? '2em' : '1.5em', color: 'black', backgroundColor: 'white', padding: '3px', width: isSmartphone() ? '14.5em' : '15em'}
  const tfLStyle = {fontSize: isSmartphone() ? '1.2em' : '1em',color: 'white', padding:'0.5em 0 0.2em 0', marginLeft:'-7em'}
  const tfLNStyle = {fontSize: isSmartphone() ? '1.2em' : '1em',color: 'white', padding:'0.2em 0 0.2em 0', marginLeft:'-10.5em'}

  return <ErrorDialogFrame onClose={()=>{errorInfo.clear()}}>
    <DialogContent onClick={() => active ? errorInfo.clear() : ''} style={active ? {overflowY: 'hidden', overflowX:'hidden', backgroundColor: '#5f7ca0', fontSize: isSmartphone() ? '2em' : '1em', transition: '0.3s ease-out'} : {overflowY: 'hidden', overflowX:'hidden', backgroundColor: '#5f7ca0', fontSize: isSmartphone() ? '2em' : '1em', transition: '0s ease-out'}}>
      <p style={{textAlign:'right', color: 'white', fontSize: isSmartphone() ? '1.2em' : '1em'}}>Version 3.0.2</p>
      <Button style={{position:'absolute', top:30, right:20, display:'none'}} onClick = {() => {
        const idx = (i18nSupportedLngs.findIndex(l => l === i18n.language) + 1) % i18nSupportedLngs.length
        i18n.changeLanguage(i18nSupportedLngs[idx])
      }}>
        <TranslateIcon />
      </Button>
      <p>
      </p>
      <div style={active ? {position: 'relative', width:'100em', display:'none'} : {position: 'relative', width:'100em', display:'block'}}/>
      <div style={active ? {position: 'relative', top: '3em' /* '2em' */, width: '100%', textAlign:'center', opacity:'0', transform: "scale(0.10)", transition: '0.3s ease-out', left: isSmartphone() ? "-0.5em" : '0em'} : {position: 'relative', top: '4em', width: '100%', textAlign:'center', left: isSmartphone() ? "-0.5em" : '0em'}}>
        <img style={{width:'30em', userSelect:'none'}} draggable={false} src={bgCircle}
        alt="" />
      </div>

      <div style={active ? {position: 'relative', top: '-25em', width: '100%', textAlign:'center', display:'none'} : {position: 'relative', top: '-25em', width: '100%', textAlign:'center'}}>
        <img style={{width:'10em', userSelect:'none'}} src={peopleLogin} draggable={false} alt="" />
      </div>
      <br />
      <Box mt={1}>
      <div style={active ? {position: 'relative', top: '-26em', width: '100%', textAlign:'center', display:'none'} : {position: 'relative', top: '-26em', width: '100%', textAlign:'center'}}>
        <InputLabel style={tfLNStyle}> {t('YourName')} </InputLabel>
        <Input value={name} autoFocus={true} disableUnderline={true} inputProps={{style: tfIStyle}} onChange={event => (setName(event.target.value))} />
      </div>
      </Box>
      <Box mt={2}>
      <div style={active ? {position: 'relative', top: '-26em', width: '100%', textAlign:'center', display:'none'} : {position: 'relative', top: '-26em', width: '100%', textAlign:'center'}}>
        <InputLabel style={tfLStyle}> {t('Venue')} </InputLabel>
        <Input value={room} autoFocus={false} disableUnderline={true} placeholder={placeholder} inputProps={{style: tfIStyle}} onChange={event => (setRoom(event.target.value))} /* onKeyPress={onKeyPress} */ />
      </div>
      </Box>
      <Box mt={2}>
      <div style={active ? {position: 'relative', top: isSmartphone() ? '-25.5em' : '-25em', width: '100%', textAlign:'center', display:'none'} : {position: 'relative', top:isSmartphone() ? '-25.5em' : '-25em', width: '100%', textAlign:'center'}}>
        <img style={{width:'4em', userSelect:'none'}} src={btnGo} draggable={false} onClick={() => onErrorClose()} alt="" />
      </div>
      </Box>
      <Box mt={7}>
      <div style={active ? {position: 'relative', top: isSmartphone() ? '8.6em' : '8.5em', width: '100%', height: '100%', textAlign:'center', display:'block'} : {position: 'relative', top: isSmartphone() ? '-23em' : '-24em', width: '100%', textAlign:'center'}}>
        <img style={{width:isSmartphone() ? '9.5em' : '8em', userSelect:'none'}} src={logo_es} draggable={false} alt="" />
      </div>
      </Box>
    </DialogContent>
  </ErrorDialogFrame>
}
TheEntrance.displayName = 'TheEntrance'
