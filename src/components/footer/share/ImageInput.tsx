import {useTranslation} from '@models/locales'
import {createContentOfImage} from '@stores/sharedContents/SharedContentCreator'
import sharedContents from '@stores/sharedContents/SharedContents'
import {DropzoneArea} from 'material-ui-dropzone'
import React, {useState} from 'react'
import {DialogPageProps} from './DialogPage'
import {Input} from './Input'
import {Step} from './Step'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles({
  preview: {
    width: '100%',
    height: '100%',
  },
})

interface ImageInputProps extends DialogPageProps{
  type:Step
  xCord:number
  yCord:number
  from:string
}

export const ImageInput: React.FC<ImageInputProps> = (props) => {
  const {
    setStep,
  } = props

  const classes = useStyles()
  const [files, setFiles] = useState<File[]>([])

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

  const map = props.stores.map

  return (
    <Input stores={props.stores}
      setStep={setStep}
      onFinishInput={(files) => {
        // TODO modify store
        files.forEach(async (file, i) => {
          const IMAGE_OFFSET_X = 30
          const IMAGE_OFFSET_Y = -20
          createContentOfImage(file, map, [IMAGE_OFFSET_X * i, IMAGE_OFFSET_Y * i], props.type, props.xCord, props.yCord, props.from, '').then(
            imageContent => sharedContents.shareContent(imageContent))
        })
      }}
      value={files}
      inputField={field} />
  )
}
