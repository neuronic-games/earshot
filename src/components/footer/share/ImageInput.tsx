import {useTranslation} from '@models/locales'
import {createContentOfImage, createContentOfImageUrl} from '@stores/sharedContents/SharedContentCreator'
import sharedContents from '@stores/sharedContents/SharedContents'
import {DropzoneArea} from 'material-ui-dropzone'
import React, {useState, useEffect} from 'react'
import {DialogPageProps} from './Step'
import {Input} from './Input'
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

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
  const [uploadType, setUploadType] = useState<"gyazo" | "gdrive">(sessionStorage.getItem("uploadTypePreferences") as "gyazo" | "gdrive" || "gyazo")

  const {t} = useTranslation()
  const field = (
    <DropzoneArea
      /* acceptedFiles={['image/*']}
      dropzoneText={t('imageDropzoneText')}
      onChange={setFiles} */
      acceptedFiles={['image/*']}
      dropzoneText={t('imageDropzoneText')}
      dropzoneClass = {classes.dZoneStyle}
      dropzoneParagraphClass = {classes.dZoneTextStyle}
      onChange={setFiles}
      previewGridProps={{container: { spacing: 1, direction: 'row' }}}
      previewChipProps={{classes: { root: classes.preview } }}
    />
  )

  /* const authGoogleDrive = ()=>{
    window.authorizeGdrive && window.authorizeGdrive((authResult: GoogleApiOAuth2TokenObject)=>{
      console.log(authResult);
      if (authResult && !authResult.error) {
        const oauthToken = authResult.access_token
        sessionStorage.setItem('gdriveToken',oauthToken)
      }
      else {
        setUploadType('gyazo')
        alert('Error authenticating Google Drive')
      }
    })
  } */

  useEffect(() => {
    sessionStorage.setItem("uploadTypePreferences", uploadType);
  }, [uploadType]);


  const map = props.stores.map

  return (
    <>
      <Box mt={0}>
        <FormControl component="fieldset">
          <FormLabel component="legend">File storage type:</FormLabel>
          <RadioGroup style={{display:"flex", flexDirection:"row"}}
            aria-label="upload-files-to"
            defaultValue="gyazo"
            value={uploadType}
            name="upload-files-to"
            onChange={(e) => {
              setUploadType(e.target.value as typeof uploadType);
              //e.target.value === "gdrve" && authGoogleDrive();
            }}
          >
            <FormControlLabel value="gyazo" control={<Radio />} label="Gyazo" />
            <FormControlLabel
              value="gdrve"
              control={<Radio />}
              label="Google Drive"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Input
        stores={props.stores}
        setStep={setStep}
        onFinishInput={(files) => {
          // TODO modify store
          if(getSelectedImage() === '') {
            files.forEach(async (file, i) => {
              const IMAGE_OFFSET_X = 30;
              const IMAGE_OFFSET_Y = -20;
              createContentOfImage(file, map, [
                IMAGE_OFFSET_X * i,
                IMAGE_OFFSET_Y * i
              ], uploadType, props.type, props.xCord, props.yCord, props.from, ''
              ).then((imageContent) =>
                sharedContents.shareContent(imageContent)
              );
            });
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
    </>
  );
}
