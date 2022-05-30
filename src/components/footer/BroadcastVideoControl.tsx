import {BMProps} from '@components/utils'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
//import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox'
import {useTranslation} from '@models/locales'
import {Observer} from 'mobx-react-lite'
import React from 'react'
import CheckBoxIcon from '@material-ui/icons/Done';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { makeStyles } from '@material-ui/core/styles'
import {useObserver} from 'mobx-react-lite'
import { isSmartphone } from '@models/utils'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    padding: 2,
  },
  formControlLabel: {
    fontSize: isSmartphone() ? '2.5em' : "1em"
  }
})

export const BroadcastVideoControl: React.FC<BMProps> = (props: BMProps) => {
  const local = props.stores.participants.local
  const muteVideo = useObserver(() => local.muteVideo)
  const classes = useStyles()

  const videoBroadcastSwitch = <Observer>{ () =>
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon  htmlColor="transparent" />}
      checkedIcon={<CheckBoxIcon style={{fontSize:isSmartphone() ? '2em' : '1em'}}  htmlColor="black" />}
      className={classes.root}
      checked={!local.muteVideo} name="broadcastVideo"
      onChange={() => {
        local.muteVideo = muteVideo === true ? false : true
        //local.muteVideo = muteVideo
        local.saveMediaSettingsToStorage()
      }} />
  }</Observer>
  const videoBroadcastSpeakSwitch = <Observer>{ () =>
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon  htmlColor="transparent" />}
      checkedIcon={<CheckBoxIcon style={{fontSize:isSmartphone() ? '2em' : '1em'}}  htmlColor="black" />}
      className={classes.root}
      checked={false} name="broadcastSpeakVideo"
      onChange={() => {
        //local.muteVideo = muteVideo === true ? false : true
        //local.muteVideo = muteVideo
        //local.saveMediaSettingsToStorage()
      }} />
  }</Observer>
  const {t} = useTranslation()

  return <Container>
    <div style={{width:'150%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>
    <FormControlLabel style={{position:'relative', top:'5px', left: '-25px'}}
      control={videoBroadcastSwitch}
      label={<Typography className={classes.formControlLabel}>{t('broadcastMyVideo')}</Typography>}
    />
    <div style={{width:'130%', height:'1.5px', backgroundColor:'#ffffff', marginLeft:'-40px'}}></div>
    <FormControlLabel style={{position:'relative', top:'5px', left: '-25px'}}
      control={videoBroadcastSpeakSwitch}
      label={<Typography className={classes.formControlLabel}>{t('broadcastMySpeakVideo')}</Typography>}
    />

  </Container>
}
BroadcastVideoControl.displayName = 'BroadcastVideoControl'
