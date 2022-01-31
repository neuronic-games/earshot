import {BMProps} from '@components/utils'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
//import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox'


import {useTranslation} from '@models/locales'
import {Observer} from 'mobx-react-lite'
import {useObserver} from 'mobx-react-lite'
import React from 'react'

import CheckBoxIcon from '@material-ui/icons/Done';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    padding: 2,
  },
})

export const StereoSwitchControl: React.FC<BMProps> = (props: BMProps) => {
  const local = props.stores.participants.local
  const soundLocalizationBase = useObserver(() => local.soundLocalizationBase)
  const stereo = useObserver(() => local.useStereoAudio)
  const classes = useStyles()

  //console.log(soundLocalizationBase)

  const switchStereo = () => {
    local.useStereoAudio = !stereo
    local.saveMediaSettingsToStorage()

  }

  const headsetBroadcastSwitch = <Observer>{ () =>
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon  htmlColor="transparent" />}
      checkedIcon={<CheckBoxIcon htmlColor="black" />}
      className={classes.root} checked={local.useStereoAudio} onChange={() => {
      local.soundLocalizationBase = soundLocalizationBase === 'avatar' ? 'user' : 'avatar'
      switchStereo()
    }} name="settingLoc" />
  }</Observer>
  const {t} = useTranslation()

  return <Container>
    <div style={{width:'130%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>
    <FormControlLabel style={{position:'relative', top:'5px', left: '-25px'}}
      control={headsetBroadcastSwitch}
      label={t('stereoswitch')}
    />
  </Container>
}
StereoSwitchControl.displayName = 'StereoSwitchControl'
