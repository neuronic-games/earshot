import {useTranslation} from '@models/locales'
import {createContentOfImage, createContentOfImageUrl} from '@stores/sharedContents/SharedContentCreator'
import sharedContents from '@stores/sharedContents/SharedContents'
import {DropzoneArea} from 'material-ui-dropzone'
import React, {useState} from 'react'
import {DialogPageProps} from './DialogPage'
import {Input} from './Input'
import {Step} from './Step'
import {makeStyles} from '@material-ui/styles'
import { getSelectedImage } from './Input'
import { ResetSelectedImage } from './Input'




const useStyles = makeStyles({
  preview: {
    width: '100%',
    height: '100%',
  },
  dZoneStyle : {
    minHeight: '300px',
  },
  dZoneTextStyle: {
    minHeight: '90px',
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
      dropzoneClass = {classes.dZoneStyle}
      dropzoneParagraphClass = {classes.dZoneTextStyle}
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
          if(getSelectedImage() === '') {
            files.forEach(async (file, i) => {
              const IMAGE_OFFSET_X = 30
              const IMAGE_OFFSET_Y = -20
              createContentOfImage(file, map, [IMAGE_OFFSET_X * i, IMAGE_OFFSET_Y * i], props.type, props.xCord, props.yCord, props.from, '').then(
                imageContent => sharedContents.shareContent(imageContent))
            })
          } else {
            createContentOfImageUrl(getSelectedImage(), map, [0, 0], props.type, props.xCord, props.yCord, props.from, '').then(
              imageContent => sharedContents.shareContent(imageContent))
            ResetSelectedImage()
          }
        }}
        value={files}
        inputField={field}
        type={props.type}
        />
  )
}
