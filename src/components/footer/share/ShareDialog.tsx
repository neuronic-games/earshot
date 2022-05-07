import {BMProps} from '@components/utils'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useTranslation} from '@models/locales'
import {isSmartphone} from '@models/utils'
import {createContentOfIframe, createContentOfTextOnly} from '@stores/sharedContents/SharedContentCreator'
import sharedContents from '@stores/sharedContents/SharedContents'
import React, {useRef, useState} from 'react'
import {CameraSelector} from './CameraSelector'
import {CameraSelectorMember} from './CameraSelector'
import { GoogleDriveImport } from './GoogleDrive'
import {ImageInput} from './ImageInput'
import {SettingImageInput} from './SettingImageInput'
import {ShareMenu} from './Menu'
import {Step} from './Step'
import {TextInput} from './TextInput'

interface ShareDialogProps extends BMProps{
  _type: string
  cordX: number
  cordY:number
  origin:string
  open: boolean
  onClose: () => void
}

let isOpen:boolean = false
export function isDialogOpen():boolean {
  return isOpen
}

export const ShareDialog: React.FC<ShareDialogProps> = (props) => {
  const {open, onClose, cordX, cordY, origin, _type} = props
  const {map} = props.stores

  //console.log("type ::: ", _type)

  const cameras = useRef(new CameraSelectorMember())

  //const [step, setStep] = useState<Step>('menu')



  let assignType:Step
  if(_type === "roomImage") {
    assignType = 'roomImage'
  } else {
    assignType = 'menu'
  }

  const [step, setStep] = useState<Step>(assignType)

  const wrappedSetStep = (step: Step) => {
    if (step === 'none') {
      onClose()
    } else {
      setStep(step)
    }
  }
  function getPage(step: Step, setStep: (step: Step) => void): JSX.Element | undefined {
    switch (step) {
      case 'menu':
        return <ShareMenu {...props} setStep={setStep} cameras={cameras.current} />
      case 'text':
        return <TextInput stores={props.stores}
            setStep={setStep}
            onFinishInput={(value) => {
              sharedContents.shareContent(createContentOfTextOnly(value, map, cordX, cordY, origin))
              //  console.debug(`share text: ${value}`)
            }}
            textLabel = "Text"
            multiline = {true}
            type={step}
          />
      case 'iframe':
        return <TextInput stores={props.stores}
            setStep={setStep}
            onFinishInput={(value) => {
              createContentOfIframe(value, map, cordX, cordY, origin).then((c) => {
                sharedContents.shareContent(c)
              })
            }}
            textLabel = "URL"
            multiline = {false}
            type={step}
          />
      case 'image':
        return <ImageInput setStep={setStep} stores={props.stores} type={step} xCord={cordX} yCord={cordY} from={origin}/>
      case 'zoneimage':
        return <ImageInput setStep={setStep} stores={props.stores} type={step} xCord={cordX} yCord={cordY} from={origin} />
      case 'roomImage':
        return <SettingImageInput setStep={setStep} stores={props.stores} type={step} xCord={cordX} yCord={cordY} from={origin} />
      case 'camera':
        return <CameraSelector setStep={setStep} stores={props.stores} cameras={cameras.current} xCord={cordX} yCord={cordY} from={origin}/>
      case 'Gdrive':
        return <GoogleDriveImport
        stores={props.stores}
        setStep={setStep} onSelectedFile={(value) => {
          createContentOfIframe(value, map, cordX, cordY, origin).then((c) => {
            sharedContents.shareContent(c)
          })
        }} />
      default:
        throw new Error(`Unknown step: ${step}`)
    }
  }

  //  console.debug(`step=${step}, pasteEnabled=${sharedContents.pasteEnabled}`)
  sharedContents.pasteEnabled = step === 'none' || step === 'menu'

  const {t} = useTranslation()
  const stepTitle: {
    [key: string]: string,
  } = {
    menu: t('Create and Share'),
    text: t('Share Text'),
    iframe: t('Share iframe'),
    image: t('Share image'),
    zoneimage: t('Share zone image'),
    roomImage: t('Meeting Space'),
    none: 'None',
    camera: t('Select video camera to share'),
  }
  const title = stepTitle[step]
  const page: JSX.Element | undefined = getPage(step, wrappedSetStep)

  isOpen = open

  return  <Dialog open={open} onClose={onClose} onExited={() => setStep(assignType)} maxWidth="sm" fullWidth={true}
      onPointerMove = {(ev) => {
        map.setMouse([ev.clientX, ev.clientY])
      }}
    >
    <DialogTitle id="simple-dialog-title" style={{fontSize: isSmartphone() ? '2.5em' : '1em'}}>
      {title}</DialogTitle>
    <DialogContent>{page}</DialogContent>
  </Dialog>
}

ShareDialog.displayName = 'ShareDialog'
