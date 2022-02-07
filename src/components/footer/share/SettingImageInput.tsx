import {useTranslation} from '@models/locales'
import {createRoomImageDesc} from '@stores/sharedContents/SharedContentCreator'
//import sharedContents from '@stores/sharedContents/SharedContents'
import {DropzoneArea} from 'material-ui-dropzone'
import React, {useState} from 'react'
import {DialogPageProps} from './DialogPage'
import {SettingInput} from './SettingInput'
import {Step} from './Step'
import {makeStyles} from '@material-ui/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
  preview: {
    width: '100%',
    height: '100%',
  },
})

interface SettingImageInputProps extends DialogPageProps{
  type:Step
  xCord:number
  yCord:number
  from:string
}

export const SettingImageInput: React.FC<SettingImageInputProps> = (props) => {
  const {
    setStep,
  } = props

  const classes = useStyles()
  const [files, setFiles] = useState<File[]>([])
  const [desc, setDesc] = useState<string>('')



  const {t} = useTranslation()
  const field = (
    <DropzoneArea
      acceptedFiles={['image/*']}
      dropzoneText={t('imageDropzoneText')}
      onChange={setFiles}

      previewGridProps={{container: { spacing: 1, direction: 'row' }}}
      previewChipProps={{classes: { root: classes.preview } }}
    />
  )

  //const map = props.stores.map

  return (
    <div>
    <TextField label={'Descriptipn'} multiline={true} rowsMax={2}
    style={{position:'relative',marginLeft:15, width:'94%', marginTop:'-10px', fontWeight:'bold'}}
    onChange={event => {
      setDesc(event.target.value)
    }}/>
    <SettingInput stores={props.stores}
      setStep={setStep}
      onFinishInput={(files) => {
        // TODO modify store
        files.forEach(async (file, i) => {
          console.log("done", desc)
          //const IMAGE_OFFSET_X = 30
          //const IMAGE_OFFSET_Y = -20

          // Set desc and image for the room
          createRoomImageDesc(file, desc)

         /*  createContentOfImage(file, map, [IMAGE_OFFSET_X * i, IMAGE_OFFSET_Y * i], props.type, props.xCord, props.yCord, props.from).then(
            imageContent => sharedContents.shareContent(imageContent)) */
        })
      }}
      value={files}
      inputField={field}
      />
      </div>
  )
}
