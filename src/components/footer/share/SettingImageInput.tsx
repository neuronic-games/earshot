import {useTranslation} from '@models/locales'
import {createContentOfImage} from '@stores/sharedContents/SharedContentCreator' // createRoomImageDesc,
import sharedContents from '@stores/sharedContents/SharedContents'
import {DropzoneArea} from 'material-ui-dropzone'
import React, {useState} from 'react'
import {DialogPageProps} from './DialogPage'
import {SettingInput} from './SettingInput'
import {Step} from './Step'
import {makeStyles} from '@material-ui/styles'
import TextField from '@material-ui/core/TextField'
import contents from '@stores/sharedContents/SharedContents'

const useStyles = makeStyles({
  preview: {
    width: '100%',
    height: '100%',
    top: '-20em',
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

  // Filtering the imagepath
  //console.log(contents.all)
  let uploadedPath:string = ''
  let descText:string = ''

  contents.all.filter(item => item.shareType==="roomimg").map(content => (
    uploadedPath = content.url
  ))
  contents.all.filter(item => item.shareType==="roomimg").map(content => (
    descText = content.contentDesc
  ))

  //console.log(uploadedPath.toString(), " path")

  const {t} = useTranslation()
  const field = (
    <DropzoneArea
      acceptedFiles={['image/*']}
      initialFiles={
        files
      }
      clearOnUnmount={false}
      dropzoneText={t('imageDropzoneText')}
      onChange={setFiles}
      filesLimit = {1}
      previewGridProps={{container: { spacing: 1, direction: 'row' }}}
      previewChipProps={{classes: { root: classes.preview } }}
    />
  )

  const map = props.stores.map

  return (
    <div>
    <TextField label={t('meetingDesc')} multiline={true} rowsMax={2} defaultValue={descText}
    style={{position:'relative',marginLeft:15, width:'94%', marginTop:'-10px', fontWeight:'bold'}}
    onChange={event => {
      setDesc(event.target.value)
      event.preventDefault()
    }}/>
    <div style={{position:'absolute', height:'90px', top:'20px', right:'30px', overflow:'hidden'}}>
      <img style={{height:'70px', position:'relative'}} src={uploadedPath} alt=''/>
    </div>
    <SettingInput stores={props.stores}
      setStep={setStep}
      onFinishInput={(files) => {
        // TODO modify store
        files.forEach(async (file, i) => {

          //console.log("done", desc)
          const IMAGE_OFFSET_X = 30
          const IMAGE_OFFSET_Y = -20

          // Set desc and image for the room
          //createRoomImageDesc(file, desc)

          //console.log("DESC in upload - ", desc)

          createContentOfImage(file, map, [IMAGE_OFFSET_X * i, IMAGE_OFFSET_Y * i], props.type, props.xCord, props.yCord, props.from, desc).then(
            imageContent => sharedContents.shareContent(imageContent))
        })
      }}
      value={files}
      inputField={field}
      />
      </div>
  )
}
