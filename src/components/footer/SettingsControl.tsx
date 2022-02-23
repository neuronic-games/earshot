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

import {ShareDialogItem} from './share/SharedDialogItem'
import {ISharedContent} from '@models/ISharedContent'
import {SharedContents} from '@stores/sharedContents/SharedContents'
import {createContent, extractContentData} from '@stores/sharedContents/SharedContentCreator'
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

  function importItems(ev: React.ChangeEvent<HTMLInputElement>, contents: SharedContents, name:string) {
    const files = ev.currentTarget?.files
    if (files && files.length) {
      files[0].text().then((text) => {
        const items = JSON.parse(text)
        if (isArray(items)) {
          items.forEach((item) => {
            //console.log("Loading -- ", name)

            //console.log(item, " --- item")

            item.ownerName = name
            const content = extractContentData(item as ISharedContent)
            if (content.type === 'screen' || content.type === 'camera') { return }
            const newContent = createContent()
            Object.assign(newContent, content)
            contents.addLocalContent(newContent)
          })
        }
      })
    }
  }

  function downloadItems(contents:SharedContents) {

    console.log("download")

    //console.log(props.stores.roomInfo.roomDetails)

    let contentAll = contents.all
    for(var i:number=0; i < contentAll.length; i++) {
      contentAll[i].ownerName = ""
    }


   /*  const content = JSON.stringify(extractContentDatas(contents.all))
    const blob = new Blob([content], {type: 'text/plain'}) */

    const content = JSON.stringify(contentAll)


    const blob = new Blob([content], {type: 'text/plain'})
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    a.href = url
    //a.download = 'BinauralMeetSharedItems.json'


    let roomName = sessionStorage.getItem('room')
    let details: Object|undefined = undefined
    if (roomName) { details = JSON.parse(roomName) as Object }
    const roomInDetails = details

    let saveJsonRoom = Object(roomInDetails).name

    //a.download = String(roomName) + ".json"
    a.download = String(saveJsonRoom) + ".json"

    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },         0)
  }

  const {t} = useTranslation()

 /*  icon={<UploadIcon/>}
  icon={<DownloadIcon />} */

  return <Container>

  <ShareDialogItem
      key="meetingSpace" onClick={()=>openMeetingSpaceDialog()} text={t('meetingSpace')}
    />
    <div style={{width:'140%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>

    <ShareDialogItem
    key="shareDownload" onClick={()=>openDownload()} text={t('shareDownload')}
  />



  <ShareDialogItem
      key="shareImport" onClick={()=>openImport()} text={t('shareImport')}
    />
    <input type="file" accept="application/json" ref={fileInput} style={{display:'none'}}
      onChange={
        (ev) => {
          importItems(ev, contents, participants.local.information.name)
        }
      }
    />

  <div style={{width:'140%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>
  {/* <ShareDialogItem
  key="settingPreference" onClick={()=>showAdmin()} text={t('settingPreference')} icon={<RoomPreferencesIcon />}
/>*/}
  {/* <Dialog open={show} onClose={()=>setShow(false)} onExited={() => setShow(false)} maxWidth="sm" fullWidth={true}>
       <DialogTitle id="simple-dialog-title" style={{fontSize: isSmartphone() ? '2.5em' : '1em'}}>
      {t('meetingSpace')}</DialogTitle>
    <DialogContent>{<SettingImageInput setStep={setStep} stores={props.stores} type={step} xCord={0} yCord={0} from={''}/>}</DialogContent>
  </Dialog> */}
  <ShareDialog {...props} open={show} onClose={() => setShow(false)} cordX={0} cordY={0} origin={''} _type={'roomImage'} />
  </Container>
}
SettingsControl.displayName = 'SettingsControl'
