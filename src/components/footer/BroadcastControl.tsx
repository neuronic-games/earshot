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

const useStyles = makeStyles({
  root: {
    padding: 2,
  },
})

export const BroadcastControl: React.FC<BMProps> = (props: BMProps) => {
  const local = props.stores.participants.local
  const classes = useStyles()

  const audioBroadcastSwitch = <Observer>{ () =>
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon  htmlColor="transparent" />}
      checkedIcon={<CheckBoxIcon htmlColor="black" />}
      className={classes.root}
      checked={local.physics.onStage} name="broadcast"
      onChange={event => local.setPhysics({onStage: event.target.checked})} />
  }</Observer>
  const {t} = useTranslation()

  return <Container>
    <div style={{width:'130%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>
    <FormControlLabel style={{position:'relative', top:'5px', left: '-25px'}}
      control={audioBroadcastSwitch}
      label={t('broadcastMyVoice')}
    />
  </Container>
}
BroadcastControl.displayName = 'BroadcastControl'
