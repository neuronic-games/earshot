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
import DeleteIcon from '@material-ui/icons/Delete'



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
  const [reset, setReset] = useState(false)

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

  if(reset) {}

  //console.log(uploadedPath.toString(), " path")

  const {t} = useTranslation()
  const field = (
    <DropzoneArea
      acceptedFiles={['image/*']}
      initialFiles={[
        //uploadedPath
      ]}
      clearOnUnmount={false}
      dropzoneText={t('imageDropzoneText')}
      onChange={setFiles}
      filesLimit = {1}
      previewGridProps={{container: { spacing: 1, direction: 'row' }}}
      previewChipProps={{classes: { root: classes.preview } }}
    />
  )

  const map = props.stores.map


  function onDeleteClick() {
    //console.log("Delete Click")
    contents.all.filter(item => item.shareType==="roomimg").map(content => (
      contents.removeByLocal(content.id)
    ))
    setDesc('')
    setReset(true)
  }

  return (
    <div>
    <TextField label={t('meetingDesc')} multiline={true} rowsMax={4} defaultValue={descText}
    style={{position:'relative', marginLeft:15, width:'94%', marginTop:'-10px', fontWeight:'bold'}}
    onChange={event => {
      setDesc(event.target.value)
      event.preventDefault()
    }}/>
    <div style={uploadedPath !== '' ? {position:'absolute', height:'90px', top:'20px', right:'20px', overflow:'hidden', display:'block'} : {display:'none'}}>
      <img style={{height:'60px', position:'relative'}} src={uploadedPath} alt=''/>
        <DeleteIcon style={{position:'relative', left:'0px', width:'35', height:'35'}} color='secondary' onClick={onDeleteClick}/>
    </div>
    <div>

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
          //setReset(false)

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
