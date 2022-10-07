import {BMProps} from '@components/utils'
import Container from '@material-ui/core/Container'
//import FormControlLabel from '@material-ui/core/FormControlLabel'
//import Switch from '@material-ui/core/Switch'
//import Checkbox from '@material-ui/core/Checkbox'
import {useTranslation} from '@models/locales'
//import {Observer} from 'mobx-react-lite'
//import {useObserver} from 'mobx-react-lite'
// useEffect,
import React, {useRef, useState} from 'react'
//import UploadIcon from '@material-ui/icons/Publish'
//import DownloadIcon from '@material-ui/icons/GetApp'
//import RoomPreferencesIcon from '@material-ui/icons/Settings'

/* import {ShareDialogItem} from './share/SharedDialogItem' */
import {DialogIconItem} from '@components/utils/DialogIconItem'

/* import {ISharedContent} from '@models/ISharedContent' */
import {SharedContents} from '@stores/sharedContents/SharedContents'
import {createContent/* , extractContentData */} from '@stores/sharedContents/SharedContentCreator'

import {contentsToSave, loadToContents} from '@models/ISharedContent'

//createContentFromText, createContentOfIframe, createContentOfText, createContentOfVideo,
import {isArray} from 'lodash'
/* import {SettingImageInput} from '@components/footer/share/SettingImageInput'
import {Step} from '@components/footer/share/Step'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {isSmartphone} from '@models/utils'
import sharedContents from '@stores/sharedContents/SharedContents' */
import {ShareDialog} from '@components/footer/share/ShareDialog'


export const SettingsControl: React.FC<BMProps> = (props: BMProps) => {
  //const local = props.stores.participants.local
  // , map
  const {contents, participants} = props.stores
  const fileInput = useRef<HTMLInputElement>(null)

 // const [step, setStep] = useState<Step>('image')
  const [show, setShow] = useState<boolean>(false)


  function openImport() {
    console.log("open Import ", fileInput.current?.clientHeight)
    fileInput.current?.click()
  }

  function openDownload() {
    console.log("open download")
    downloadItems(contents)
  }

  function openMeetingSpaceDialog() {
    //console.log(props.stores.roomInfo, " stores")
    setShow(true)
  }

  function importItems(ev: React.ChangeEvent<HTMLInputElement>, contents: SharedContents, name:string, url:string) {
    const files = ev.currentTarget?.files
    if (files && files.length) {
      files[0].text().then((text) => {
        const itemsRecv = JSON.parse(text)
        if(itemsRecv[0].ResetRoomElements !== undefined && itemsRecv[0].ResetRoomElements[0].status === "true") {
          contents.removeAllContents()
        }
        if (isArray(itemsRecv)) {
          /* itemsRecv[0].RoomElements.forEach((item:any) => {
            item.ownerName = name
            item.ownerURL = url */
            const items = loadToContents(itemsRecv[0].RoomElements)
            //loadToContents(itemsRecv[0].RoomElements)
            items.forEach(content => {
              if (content.type === 'screen' || content.type === 'camera') { return }
             /*  if (item.type === 'screen' || item.type === 'camera') { return } */
             content.ownerName = name
             content.ownerURL = url
              const newContent = createContent()
              Object.assign(newContent, content)
              /* Object.assign(newContent, item) */
              contents.addLocalContent(newContent)
            })
          //})
        }
      })
    }
  }

  /* function importItems1(ev: React.ChangeEvent<HTMLInputElement>, contents: SharedContents, name:string, url:string) {
    const files = ev.currentTarget?.files

    // Remove All previous loaded contents
    //contents.removeAllContents()

    if (files && files.length) {
      files[0].text().then((text) => {
        const items = JSON.parse(text)

        // For Checking whether to Reset the contents or not
        //console.log(items[0].Reset, " ----- ")
        if(items[0].ResetRoomElements !== undefined && items[0].ResetRoomElements[0].status === "true") {
          contents.removeAllContents()
        }

        // For Elements
        //console.log(items[0].Elements, " Elements")

        ////////////////////////////////////////////////////////////
        if (isArray(items)) {
          items[0].RoomElements.forEach((item:any) => {
            //console.log("Loading -- ", name)
            //console.log(item, " --- item")
            item.ownerName = name
            item.ownerURL = url
            const content = extractContentData(item as ISharedContent)
            if (content.type === 'screen' || content.type === 'camera') { return }
            const newContent = createContent()
            Object.assign(newContent, content)
            contents.addLocalContent(newContent)
          })
        }
        ////////////////////////////////////////////////////////////

      })
    }
  } */

  function downloadItems(contents:SharedContents) {

    let contentAll = contentsToSave(contents.all)
    for(var i:number=0; i < contentAll.length; i++) {
      contentAll[i].ownerName = ""
      contentAll[i].ownerURL = ""
    }

    //const content = JSON.stringify(contentsToSave(contents.all))

    const content = JSON.stringify(contentAll)

     // Added Reset Flag to JSON
     let ResetFlag = {status: "true"}
     const Reset = JSON.stringify(ResetFlag)
     let contentElement = '[{"ResetRoomElements" : [' + Reset + '],"RoomElements" : ' + content + '}]'


    /* const blob = new Blob([content], {type: 'text/plain'}) */
    const blob = new Blob([contentElement], {type: 'text/plain'})
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    a.href = url
    //a.download = `BMC_${conference.room}_${dateTimeString()}.json`
    let roomName = sessionStorage.getItem('room')
    a.download = String(roomName) + ".json"
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },         0)
  }

  /* function downloadItems(contents:SharedContents) {

    console.log("download")

    //console.log(props.stores.roomInfo.roomDetails)

    let contentAll = contents.all
    for(var i:number=0; i < contentAll.length; i++) {
      contentAll[i].ownerName = ""
      contentAll[i].ownerURL = ""
    }
    const content = JSON.stringify(contentAll)
    //////////////////////////////////////////////////////////////////////////
    // Added Reset Flag to JSON
    let ResetFlag = {status: "true"}
    const Reset = JSON.stringify(ResetFlag)
    let contentElement = '[{"ResetRoomElements" : [' + Reset + '],"RoomElements" : ' + content + '}]'
    //////////////////////////////////////////////////////////////////////////
    const blob = new Blob([contentElement], {type: 'text/plain'}) // new Blob([content], {type: 'text/plain'})
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    a.href = url
    //a.download = 'BinauralMeetSharedItems.json'
    let roomName = sessionStorage.getItem('room')
    a.download = String(roomName) + ".json"
    //a.download = String(saveJsonRoom) + ".json"
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },         0)
  } */

  const {t} = useTranslation()

 /*  icon={<UploadIcon/>}
  icon={<DownloadIcon />} */

  return <Container>
  <DialogIconItem
      key="meetingSpace" onClick={()=>openMeetingSpaceDialog()} text={t('meetingSpace')}
    />
    <div style={{width:'140%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>

    <DialogIconItem
    key="shareDownload" onClick={()=>openDownload()} text={t('shareDownload')}
  />
  <DialogIconItem
      key="shareImport" onClick={()=>openImport()} text={t('shareImport')}
    />
    <input type="file" accept="application/json" ref={fileInput} style={{display:'none'}}
      onChange={
        (ev) => {
          importItems(ev, contents, participants.local.information.name, participants.local.information.avatarSrc)
        }
      }
    />

  <div style={{width:'140%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>
  <ShareDialog {...props} open={show} onClose={() => setShow(false)} cordX={0} cordY={0} origin={''} _type={'roomImage'} />
  </Container>
}
SettingsControl.displayName = 'SettingsControl'
