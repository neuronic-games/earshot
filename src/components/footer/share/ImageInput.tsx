import {useStore as useMapStore} from '@hooks/MapStore'
import {useTranslation} from '@models/locales'
import {createContentOfImage} from '@stores/sharedContents/SharedContentCreator'
import sharedContents from '@stores/sharedContents/SharedContents'
import {DropzoneArea} from 'material-ui-dropzone'
import React, {useState} from 'react'
import {DialogPageProps} from './DialogPage'
import {Input} from './Input'
import {Step} from './Step'


interface ImageInputProps extends DialogPageProps{
  type:Step
}

export const ImageInput: React.FC<ImageInputProps> = (props) => {
  
  const {
    setStep,
    type,
  } = props


  const [files, setFiles] = useState<File[]>([])


  const {t} = useTranslation()
  const field = (
    <DropzoneArea
      acceptedFiles={['image/*']}
      dropzoneText={t('imageDropzoneText')}
      onChange={setFiles}
    />
  )

  const map = useMapStore()

  return (
    <Input
      setStep={setStep}
      onFinishInput={(files) => {
        // TODO modify store
        files.forEach((file, i) => {
          const IMAGE_OFFSET_X = 30
          const IMAGE_OFFSET_Y = -20
          
          createContentOfImage(file, map, [IMAGE_OFFSET_X * i, IMAGE_OFFSET_Y * i], props.type).then(
            imageContent => sharedContents.shareContent(imageContent))
        })
      }}
      value={files}
      inputField={field} />
  )
}
