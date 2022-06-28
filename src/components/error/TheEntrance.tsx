import {BMProps} from '@components/utils'
//import usageEn from '@images/usage.en.png'
//import usageJa from '@images/usage.ja.png'
import bgCircle from '@images/whoo-screen_chat.png'
import peopleLogin from '@images/people_login.png'
import btnGo from '@images/go.png'
import logo_es from '@images/logo.png'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
//import TextField from '@material-ui/core/TextField'
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

//import {rgb2Color} from '@models/utils'
//import contents from '@stores/sharedContents/SharedContents'
//import { useObserver } from 'mobx-react-lite'
//import { SharedContentInfo } from '@models/ISharedContent'
//import contents from '@stores/sharedContents/SharedContents'
//import { connection } from '@models/api'
//import { useObserver } from 'mobx-react-lite'



//import {connection} from '@models/api'


let nameStr:string = ''
let loginClick:boolean = false
let _roomName:string = ''
export function userName(): string {
  return nameStr
}
export function getLoginClick(): boolean {
  return loginClick
}
export function getRoomName(): string {
  return _roomName
}


export const TheEntrance: React.FC<BMProps> = (props) => {
  const {participants} = props.stores
  const [name, setName] = useState(participants.local.information.name)
  const savedRoom = sessionStorage.getItem('room')
  const [active, setActive] = useState(false)

/*
  // Get Store values
  const roomDetails = sessionStorage.getItem('room')
  let details: Object|undefined = undefined
  if (roomDetails) { details = JSON.parse(roomDetails) as Object }
  const roomInDetails = details
  const savedRoom = Object(roomInDetails).name
  //console.log("ROOM DETAILS - ", roomDetails)
  // Update conf
  connection.conference.setRoomProp('roomDetails', JSON.stringify(roomDetails))
  //const rname = useObserver(() => (props.stores.roomInfo.roomProps))
  //const rnameValue = useObserver(() => (props.stores.roomInfo.roomProps.get('roomDetails')))
  //console.log(rname, " STORES ")
 */

  const mapData = props.stores.map
  let roomURL = String(urlParameters.room).split("_");
  //console.log(window.location.href.indexOf('u'), " Index")
  //console.log(window.location.href.split('?')[1].split("&")[0].split('=')[1], " >>> roomURL")


  //console.log(roomURL.length, " ----- ", urlParameters.room)



  let num = (Number(roomURL?.length) - 1)
  //console.log(urlParameters.room, " room")
  let concatURL = ''

  if(Number(roomURL?.length) > 1) {
    concatURL = String(urlParameters.room).split("_")[0]
  }

  //console.log(concatURL, " iper")
  //console.log("Room -", roomURL[num])
  //const [room, setRoom] = useState(urlParameters.room ? urlParameters.room : savedRoom ? savedRoom : '')
  //const [room, setRoom] = useState(savedRoom ? savedRoom : '')
  //console.log(roomURL[num], " room- ", savedRoom, name, participants.local.information.name)

  //const [room, setRoom] = useState(urlParameters.room ? roomURL[num] : savedRoom ? savedRoom : '')
  const [room, setRoom] = useState(urlParameters.room ? roomURL[num] : '')

  //console.log(urlParameters, " --- ")
  //console.log(room, " room")

  /* const [nameArr, setNameArr] = useState([String(Object(props).room).toLocaleLowerCase()]) */
  const [nameArr, setNameArr] = useState([String(Object(props).room)])
  //const [nameArr, setNameArr] = useState([(room)])
  //const [index, setIndex] = useState(0);
  const passedPlaceholder = nameArr[0]
  const [placeholder, setPlaceholder] = useState(passedPlaceholder.slice(0, 0));
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // setting default room

  //const urlRoom = String(urlParameters.room)

  //const rgb = participants.local.getColorRGB()

  /* // Get Store values
  const roomDetails = sessionStorage.getItem('room')
  let details: Object|undefined = undefined
  if (roomDetails) { details = JSON.parse(roomDetails) as Object }
  const roomInDetails = details */

  /*
  //console.log(urlRoom, " urlname ", roomURL[1])
  //console.log('2 ', savedRoom)
  //console.log(props.stores.roomInfo.roomDetails, " Details of the room start path")
  const storeRoom = (props.stores.roomInfo.roomDetails)
  let detailsStore: Object|undefined = undefined
  if (storeRoom) { detailsStore = JSON.parse(storeRoom) as Object }
  const roomInStore = detailsStore

  //console.log(savedRoom, " --- ", room, " ====== ", props.stores.roomInfo.roomDetails) */
  // Showing Room Image and its values
  /* let roomImage = 'https://i.gyazo.com/eced85aecb2b5242dad432ad5eb83766.jpg'
  let roomDesc = 'This is my desc test' */
  /* let roomImage = ''
  let roomDesc = '' */
  //const contentsAll = useObserver(() => (props.stores.contents))
  //console.log(contentsAll.all, " AAAAA")
  /* contentsAll.all.filter(item => item.shareType==="roomimg").map(content => (
    roomImage = content.url
  ))
  contentsAll.all.filter(item => item.shareType==="roomimg").map(content => (
    roomDesc = content.contentDesc
  )) */


  /* if(savedRoom === room) {
    if(Object(roomInStore).image !== '') {
      roomImage = Object(roomInStore).image
    }
    if(Object(roomInStore).desc !== '') {
      roomDesc = Object(roomInStore).desc
    }
  } */

  //console.log(props.stores.roomInfo.roomDetails, " roomDetails")
  //console.log(Object(roomInStore).name, " SR ", Object(roomInStore).image, " ---- ", room)
  // console.log(Object(roomInStore).image.toString(), " >>> IMAGE AFTER LOAD")
  /* let storeDetails: Object|undefined = undefined
  if (storeRoom) { details = JSON.parse(storeRoom) as Object }
  const roomInStore = storeDetails
  console.log("IIIIIIIIIIIII - ", roomInStore) */
  //console.log(savedRoom, " --- ", room)

  /**
   *
   * @param _name
   */
  function setUserNameFromWeb(_name:string) {
    setName(_name)
    let roomNameIndex = window.location.href.indexOf('&room=')
    //console.log(roomNameIndex, " ---- ROOM FROM ")
    if(roomNameIndex !== -1) {
      onErrorClose()
    }
  }

  useEffect(() => {
    // New Changes for Website
    // User
    let userNameIndex = window.location.href.indexOf('?u=')
    //console.log(userNameIndex, " >>userNameIndex")
    if(userNameIndex !== -1) {
      let uName = window.location.href.split('?')[1].split("&")[0].split('=')[1]
      /* setName(uName)
      onErrorClose() */
      setUserNameFromWeb(uName)
    }
    const onKeyDown = (e: KeyboardEvent) => {
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
             /*  setNameArr([generateRoomWithoutSeparator().toLocaleLowerCase()]) */
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
    //console.log(sessionStorage.getItem("room"), " Stored name ", room)

    // get the value
    //console.log(sessionStorage.getItem('room'))

    if (save) {
        if (participants.local.information.name !== name) {
          nameStr = name
          participants.local.information.name = name
          participants.local.sendInformation()
          participants.local.saveInformationToStorage(true)
        }
        if( room === "") {
          //console.log(room, " ---- ")
          //console.log('1 - ', savedRoom, )
          urlParameters.room = nameArr[0]
          /////////////////////////////////////
          if(savedRoom !== room) {
            /* const roomDetails:Object = {
              name: nameArr[0],
              image: '',
              desc: '',
            } */

            //_roomName = nameArr[0]
            sessionStorage.setItem('room', nameArr[0])
            //sessionStorage.setItem('room', JSON.stringify(roomDetails))
          }
          /////////////////////////////////////

          setRoom(nameArr[0])
        } else {
          urlParameters.room = room
          //console.log("2 - ", savedRoom, " -- ", room)
          /////////////////////////////////////
          if(savedRoom !== room) {
            /* const roomDetails:Object = {
              name: room,
              image: '',
              desc: '',
            } */
            //_roomName = room
            sessionStorage.setItem('room', room)
            //sessionStorage.setItem('room', JSON.stringify(roomDetails))
            /////////////////////////////////////
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
    //window.setTimeout(() => {
      clearTimeout(endScreen)

      _roomName = room
      loginClick = true

      //console.log(props.stores.roomInfo.roomProps)
      /* for ([i] in props.stores.roomInfo.roomProps.entries()) {
        console.log(props.stores.roomInfo.roomProps.get(i).value)
      } */
      //console.log(props.stores.roomInfo.roomProps, " updated rooms")

      //for (const [i] of props.stores.roomInfo.roomProps.entries()) {
        //console.log(i, " key ", props.stores.roomInfo.roomProps.get('roomDetails'))
        //let map = {props.stores.roomInfo.roomProps}
        //console.log(props.stores.roomInfo.roomProps)
      //}

      //console.log(props.stores.contents)




      errorInfo.clear()


      /* setTimeout(function() {
        props.stores.contents.all.filter(item => item.shareType==="roomimg").map(content => (
          console.log(content.url)
        ))
      }, 3000) */


     // updating room url
     /* if(room !== "") {
      window.history.replaceState({}, "null", ("/" + room))
     } else {
      window.history.replaceState({}, "null", ("/" + nameArr[0]))
     } */

     // Show Description here
     //console.log(connection.conference.name, " room name")

     // Update conf
    //connection.conference.setRoomProp('roomDetails', JSON.stringify(roomDetails))

    },10)
  }

  const onErrorClose = () => {
    //console.log("close click - ")
    //onClose(true)
    //if(active) {return}


    setActive(true)


    //console.log("called- Error")
    /*
    //console.log(props.stores.roomInfo.roomProps.entries, " SS")
    //console.log(props.stores.roomInfo.password, " ------------- ", room);
    //props.stores.roomInfo.onUpdateProp('password', 'abcd')
    //connection.conference.setRoomProp('password', 'abcd')
    //console.log(props.stores.roomInfo.password, " password")
    //console.log(connection.conference._jitsiConference?.isModerator, " room name")
    //props.stores.roomInfo.roomName = room
    */




    // Also update the data to connection
    //console.log(roomDetails, " roomDetails")


    /* if(savedRoom !== room) {
      Object(roomInDetails).name = room
      Object(roomInDetails).image = ''
      Object(roomInDetails).desc = ''
    }
    connection.conference.setRoomProp('roomDetails', JSON.stringify(roomDetails)) */

    //console.log(props.stores.roomInfo.roomDetails, " Details of the room")

    const cTimer = setTimeout(function() {
    //window.setTimeout(function() {
      clearTimeout(cTimer)
      // Here
      let scaleVal = isSmartphone() ? [2,2,2] : [1,1,1]

      const changeMatrix = (new DOMMatrix()).scaleSelf(scaleVal[0], scaleVal[1], scaleVal[2])
      mapData.setMatrix(changeMatrix)
      mapData.setCommittedMatrix(changeMatrix)

      // Position Avatar at center of stage
      // Default Setting
      /* mapData.setMouse([mapData.screenSize[0]/2, mapData.screenSize[1]/2])
      participants.local.pose.position = Object.assign({}, mapData.mouseOnMap) */

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
        /* mapData.setMouse([randX, randY])
        let mouseX = mapData.mouseOnMap[0]
        let mouseY = mapData.mouseOnMap[1] */
        if(randX >= (remoteX-60) && randX <= (remoteX+60) && randY >= (remoteY-60) && randY <= (remoteY+60)) {
          placeUserAtBlank()
          return
        } else {
          if(remoteX >= -60 && remoteX <=60 && remoteY >= -60 && remoteY <= 60) {
            found = true
           /*  mapData.setMouse([randX, randY])
            participants.local.pose.position = Object.assign({}, mapData.mouseOnMap) */
          } else {

            /* mapData.setMouse([mapData.screenSize[0]/2, mapData.screenSize[1]/2])
            participants.local.pose.position = Object.assign({}, mapData.mouseOnMap) */
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

  /* const onKeyPress = (ev:React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      onClose(true)
    }else if (ev.key === 'Esc' || ev.key === 'Escape') {
      onClose(false)
    }
  } */




  const {t, i18n} = useTranslation()



  /* const tfIStyle = {fontSize: isSmartphone() ? '2em' : '1em',
    height: isSmartphone() ? '2em' : '1.5em'}
  const tfLStyle = {fontSize: isSmartphone() ? '1em' : '1em'}
  const tfDivStyle = {height: isSmartphone() ? '4em' : '3em'} */

  const tfIStyle = {fontSize: isSmartphone() ? '2.5em' : '1em',
    height: isSmartphone() ? '2em' : '1.5em', color: 'black', backgroundColor: 'white', padding: '3px', width: isSmartphone() ? '14.5em' : '15em'}
  const tfLStyle = {fontSize: isSmartphone() ? '1.2em' : '1em',color: 'white', padding:'0.5em 0 0.2em 0', marginLeft:'-7em'}
  const tfLNStyle = {fontSize: isSmartphone() ? '1.2em' : '1em',color: 'white', padding:'0.2em 0 0.2em 0', marginLeft:'-10.5em'}
  //const tfDivStyle = {height: isSmartphone() ? '4em' : '3em', padding: '3px 0 0 0', width: '15em'}

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
    <DialogContent onClick={() => active ? errorInfo.clear() : ''} style={active ? {overflowY: 'hidden', overflowX:'hidden', backgroundColor: '#5f7ca0', fontSize: isSmartphone() ? '2em' : '1em', transition: '0.3s ease-out'} : {overflowY: 'hidden', overflowX:'hidden', backgroundColor: '#5f7ca0', fontSize: isSmartphone() ? '2em' : '1em', transition: '0s ease-out'}}>
    {/* <DialogContent style={{overflowY: 'hidden', backgroundColor: '#5f7ca0', fontSize: isSmartphone() ? '2em' : '1em'}}> */}
      <p style={{textAlign:'right', color: 'white', fontSize: isSmartphone() ? '1.2em' : '1em'}}>Version 1.8.5</p>
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
      <div style={active ? {position: 'relative', width:'100em', display:'none'} : {position: 'relative', width:'100em', display:'block'}}/>
      {/* <img style={{position: 'relative', left: '21em', width:'30em', display:'block'}} src={bgCircle}
        alt="" /> */}
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
        {/* <TextField label={t('YourName')} multiline={false} value={name} style={tfDivStyle}
          inputProps={{style: tfIStyle, autoFocus:true}} InputLabelProps={{style: tfLStyle}}
          onChange={event => setName(event.target.value)} onKeyPress={onKeyPress} fullWidth={false}
        /> */}
        <InputLabel style={tfLNStyle}> {t('YourName')} </InputLabel>
        <Input value={name} autoFocus={true} disableUnderline={true} inputProps={{style: tfIStyle}} onChange={event => (setName(event.target.value))} /* onKeyPress={onKeyPress} */ />
      </div>
      </Box>
      <Box mt={2}>
      {/* readOnly: true */}
      <div style={active ? {position: 'relative', top: '-26em', width: '100%', textAlign:'center', display:'none'} : {position: 'relative', top: '-26em', width: '100%', textAlign:'center'}}>
        {/* <TextField label={t('Venue')} multiline={false}  value={room} placeholder={placeholder} style={tfDivStyle}
        inputProps={{style: tfIStyle, autoFocus:false}} InputLabelProps={{style: tfLStyle}}
        onChange={event => (setRoom(event.target.value))} onKeyPress={onKeyPress} fullWidth={false}
        /> */}
        <InputLabel style={tfLStyle}> {t('Venue')} </InputLabel>
        {/* <Input value={room} readOnly={(urlRoom !== '' || urlRoom !== undefined) ? true : false} autoFocus={false} disableUnderline={true} placeholder={placeholder} inputProps={{style: tfIStyle}} onChange={event => (setRoom(event.target.value))} onKeyPress={onKeyPress} />  readOnly={roomURL[0] !== '' ? true : false}  */}
        <Input value={room} autoFocus={false} disableUnderline={true} placeholder={placeholder} inputProps={{style: tfIStyle}} onChange={event => (setRoom(event.target.value))} /* onKeyPress={onKeyPress} */ />
      </div>
      </Box>
      <Box mt={2}>
      <div style={active ? {position: 'relative', top: isSmartphone() ? '-25.5em' : '-25em', width: '100%', textAlign:'center', display:'none'} : {position: 'relative', top:isSmartphone() ? '-25.5em' : '-25em', width: '100%', textAlign:'center'}}>
        {/* <Button variant="contained" color="primary" onClick={() => onClose(true)}
          style={{fontSize:isSmartphone() ? '1.25em' : '1em'}}>
          {t('EnterTheVenue')}
        </Button> */}
        {/* <img style={{width:'4em'}} src={btnGo} onClick={() => onClose(true)} alt="" /> */}
        <img style={{width:'4em', userSelect:'none'}} src={btnGo} draggable={false} onClick={() => onErrorClose()} alt="" />
      </div>
      </Box>
      <Box mt={7}>
      <div style={active ? {position: 'relative', top: isSmartphone() ? '8.6em' : '8.5em', width: '100%', height: '100%', textAlign:'center', display:'block'} : {position: 'relative', top: isSmartphone() ? '-23em' : '-24em', width: '100%', textAlign:'center'}}>
        <img style={{width:isSmartphone() ? '9.5em' : '8em', userSelect:'none'}} src={logo_es} draggable={false} alt="" />
      </div>
      </Box>

      {/*
      Display Screen
      This is my dummy room desc
      https://i.gyazo.com/eced85aecb2b5242dad432ad5eb83766.jpg
      */}

      {/* <div style={active ? {position: 'relative', top: ((roomImage === '') ? '-30.5em' : '-40.5em'), width: '100%', textAlign:'center', transform: "scale(1)", transition: '0.3s ease-out', display:'block'} : {position: 'relative', top: '-59em', width: '100%', textAlign:'center', display:'none'}}>
        <p style={{textAlign:'center', color: 'white', marginTop:'2.5em',fontSize:'1.2em'}}>Welcome To</p>
        <p style={{textAlign:'center', color: 'white', marginTop:'-0.8em', fontSize:'1.2em', fontWeight:'bold'}}>{room}</p>
        <div style={{width: '100%', height: '300px', overflow:'hidden', alignItems:'center', display: 'flex', justifyContent: 'center'}}>
          <img src={roomImage} style={{width: '600px'}}  alt=''/>
        </div>
        <div style={{width: '100%', height: '100px', overflow:'hidden', alignItems:'center', display: 'flex', justifyContent: 'center', marginTop:'0.5em'}}>
        <p style={{textAlign:'center', color: '#cdcdcd', fontSize:'1em', width:'600px', height: '100px', position:'absolute', overflow:'hidden'}}>{roomDesc}</p>
        </div>
      </div>

      <div style={active ? {position: 'relative', top: ((roomImage === '') ? '-63.5em' : '-52.7em'), width: '100%', textAlign:'center', transform: "scale(0.15)", transition: '0.3s ease-out', opacity:'1'} : {display:'none', position: 'relative', top: '-59em', width: '100%', textAlign:'center', opacity:'0', transform: "scale(0)"}}>
          <img style={{width:'30em', backgroundColor:rgb2Color(rgb), borderRadius: '50%'}} src={participants.local.information.avatarSrc}
        alt="" />
      </div>
      <div style={active ? {position: 'relative', top: ((roomImage === '') ? '-75.5em' : '-65em'), width: '100%', textAlign:'center', transform: "scale(1)", transition: '0.3s ease-out', display:'block'} : {position: 'relative', top: '-59em', width: '100%', textAlign:'center', display:'none'}}>
        <p style={{textAlign:'center', color: 'black', marginTop:'0.2em', fontSize:'1.2em'}}>{name}</p>

      </div>

      <div style={active ? {position: 'relative', top:  ((roomImage === '') ? '-70em' : '-64em'), width: '100%', textAlign:'center', transform: "scale(1)", transition: '0.3s ease-out', display:'block'} : {position: 'relative', top: '-59em', width: '100%', textAlign:'center', display:'none'}}>
        <p style={{textAlign:'center', color: 'black', marginTop:'1.5em',fontSize:'1.2em'}}>Give your web browser permissions</p>
        <p style={{textAlign:'center', color: 'black', marginTop:'-0.9em',fontSize:'1.2em'}}>to access the mic and camera if necessary.</p>
      </div> */}

    </DialogContent>
  </ErrorDialogFrame>


}
TheEntrance.displayName = 'TheEntrance'
