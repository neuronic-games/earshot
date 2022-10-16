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

export const BroadcastControl: React.FC<BMProps> = (props: BMProps) => {
  const local = props.stores.participants.local
  const classes = useStyles()
  const audioBroadcastSwitch = <Observer>{ () =>
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon  htmlColor="transparent"/>}
      checkedIcon={<CheckBoxIcon style={{fontSize:isSmartphone() ? '2em' : '1em'}} htmlColor="black" />}
      className={classes.root}
      checked={local.physics.onStage} name="broadcast"
      onChange={event => local.setPhysics({onStage: event.target.checked})} />
  }</Observer>
  const {t} = useTranslation()

  return <Container>
    <div style={{width:'150%', height:'1.5px', backgroundColor:'#bcbec0', marginLeft:'-40px'}}></div>
    <FormControlLabel style={{position:'relative', top:'5px', left: '-25px', fontSize:isSmartphone() ? '2em' : '1em'}}
      control={audioBroadcastSwitch}
      label={<Typography className={classes.formControlLabel}>{t('broadcastMyVoice')}</Typography>}
    />
  </Container>
}
BroadcastControl.displayName = 'BroadcastControl'
