import {BMProps} from '@components/utils'
import {acceleratorText2El} from '@components/utils/formatter'
import windowArrowUp from '@iconify/icons-fluent/window-arrow-up-24-regular'

import {Icon} from '@iconify/react'
import {makeStyles} from '@material-ui/styles'
import {useTranslation} from '@models/locales'
import {useObserver} from 'mobx-react-lite'
import React from 'react'
import {FabWithTooltip} from '../FabEx'
import {ShareDialog} from './ShareDialog'


const useStyles = makeStyles({
  root: {
    display: 'inline-block',
  },
})
interface ShareButtonProps extends BMProps{
  showDialog:boolean
  setShowDialog(flag: boolean):void
  size?: number
  iconSize?: number
}
export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const classes = useStyles()
  const store = props.stores.contents
  const sharing = useObserver(() => store.tracks.localMains.size + store.tracks.localContents.size)
  const {t} = useTranslation()

  let upTime = 0
  let downTime = 0


  return (
    <div className={classes.root}>
      <FabWithTooltip size={props.size} color={sharing ? 'secondary' : 'primary'}
        title = {acceleratorText2El(t('ttCreateAndshare'))}
        aria-label="share"
        onClick={(ev) => {
          upTime = new Date().getSeconds()
          let timeDiff = upTime - downTime;
            if(timeDiff > 1) {
            } else {
            }
          //props.setShowDialog(true)
        }}
        onDown={(ev) => {
          downTime = new Date().getSeconds()
          const _timer = setTimeout(()=> {
            clearTimeout(_timer)
            let timeDiff = upTime - downTime;
            if(timeDiff >= 0) return
            props.setShowDialog(true)
          }, 500)
        }}
        >
        <Icon icon={windowArrowUp} style={{width:props.iconSize, height:props.iconSize, color:'white'}} />
      </FabWithTooltip>
      <ShareDialog {...props} open={props.showDialog} onClose={() => props.setShowDialog(false)} />
    </div>
  )
}

ShareButton.displayName = 'ShareButton'
