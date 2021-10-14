import {Stores} from '@components/utils'
import {useStore as useMapStore} from '@hooks/MapStore'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useTranslation} from '@models/locales'
import {isSmartphone} from '@models/utils'
import {createContentOfIframe, createContentOfText} from '@stores/sharedContents/SharedContentCreator'
import sharedContents from '@stores/sharedContents/SharedContents'
import React, {useRef, useState} from 'react'
import {CameraSelector} from './CameraSelector'
import {CameraSelectorMember} from './CameraSelector'
import {ImageInput} from './ImageInput'
import {ShareMenu} from './Menu'
import {Step} from './Step'
import {TextInput} from './TextInput'

interface ShareDialogProps extends Stores{
  open: boolean
  onClose: () => void
}

export const ShareDialog: React.FC<ShareDialogProps> = (props) => {
  const {
    open,
    onClose,
  } = props

  const cameras = useRef(new CameraSelectorMember())

  const map = useMapStore()
  const [step, setStep] = useState<Step>('menu')

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
        return <TextInput
            setStep={setStep}
            onFinishInput={(value) => {
              sharedContents.shareContent(createContentOfText(value, map))
              //  console.debug(`share text: ${value}`)
            }}
            textLabel = "Text"
            multiline = {true}
          />
      case 'iframe':
        return <TextInput
            setStep={setStep}
            onFinishInput={(value) => {
              createContentOfIframe(value, map).then((c) => {
                sharedContents.shareContent(c)
              })
            }}
            textLabel = "URL"
            multiline = {false}
          />
      case 'image':
        return <ImageInput setStep={setStep} type={step} />
      case 'zoneimage':
        return <ImageInput setStep={setStep} type={step} />
      case 'camera':
        return <CameraSelector setStep={setStep} cameras={cameras.current} />
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
    none: 'None',
    camera: t('Select video camera to share'),
  }
  const title = stepTitle[step]
  const page: JSX.Element | undefined = getPage(step, wrappedSetStep)

  return  <Dialog open={open} onClose={onClose} onExited={() => setStep('menu')} maxWidth="sm" fullWidth={true}
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