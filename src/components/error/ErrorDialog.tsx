/* import {BMProps} from '@components/utils'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {t} from '@models/locales'
import errorInfo, {ErrorType} from '@stores/ErrorInfo'
import {Observer} from 'mobx-react-lite'
import React from 'react'
import {AfkDialog} from './AfkDialog'
import {TheEntrance} from './TheEntrance'

export const dialogs = new Map<ErrorType, (props:BMProps)=>JSX.Element>()
dialogs.set('entrance', (props: BMProps) => <TheEntrance {...props}/>)
dialogs.set('afk', (props: BMProps) => <AfkDialog />)

export const ErrorDialogFrame: React.FC<{onClose:(event:{}, reason:string)=>void}> = (props) => {
  return <Dialog {...props} open={errorInfo.show()}
    onClose={props.onClose} maxWidth="md" fullWidth={false} >
  {errorInfo.title ?
    <DialogTitle id="simple-dialog-title">{errorInfo.title}</DialogTitle>
    : undefined }
  {props.children}
</Dialog>
}


export const ErrorDialog: React.FC<BMProps> = (props) => {
  function close(){
    if (errorInfo.type !== 'retry'){
      errorInfo.clear()
    }
  }

  return <Observer>{
    () => {
      if (errorInfo.type){
        if (dialogs.has(errorInfo.type)) {
          return dialogs.get(errorInfo.type)!(props)
        }else{
          return <ErrorDialogFrame onClose={() => { close() }}>
            <DialogContent>{errorInfo.message}</DialogContent>
            {errorInfo.type !== 'retry' ?
              <Box mt={2} mb={2} ml={4}>
              <Button variant="contained" color="primary" style={{textTransform:'none'}}
                onClick={() => { close() }} >
                {t('emClose')}
              </Button>&nbsp;
              <Button variant="contained" color="secondary" style={{textTransform:'none'}}
                onClick={() => {
                  errorInfo.supressedTypes.add(errorInfo.type)
                  close()
                }}>
                {t('emNeverShow')}
              </Button>
              </Box>
            : undefined}
          </ErrorDialogFrame>
        }
      }

      return <></>
    }
  }</Observer>
}
ErrorDialog.displayName = 'ErrorDialog'
 */

import {BMProps} from '@components/utils'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {t} from '@models/locales'
import errorInfo, {ErrorType} from '@stores/ErrorInfo'
import {Observer} from 'mobx-react-lite'
import React from 'react'
import {AfkDialog} from './AfkDialog'
import {TheEntrance} from './TheEntrance'
import {generateRoomWithoutSeparator} from '@components/utils/roomNameGenerator'
import {isSmartphone} from '@models/utils'

// Setting default room animated names
const defaultRoom = {
  room: generateRoomWithoutSeparator()
}

export const dialogs = new Map<ErrorType, (props:BMProps)=>JSX.Element>()
dialogs.set('entrance', (props: BMProps) => <TheEntrance {...props} {...defaultRoom} />)
dialogs.set('afk', (props: BMProps) => <AfkDialog />)

export const ErrorDialogFrame: React.FC<{onClose:(event:{}, reason:string)=>void}> = (props) => {
  /* console.log(errorInfo.type, " ------ 11111 ") */
  return errorInfo.type !== 'micPermission' && errorInfo.type !== 'dataConnection' && errorInfo.type !== 'rtcConnection' ? <Dialog {...props} open={errorInfo.show()}
    onClose={props.onClose} maxWidth="xl" fullWidth={false} fullScreen={true} >
  {errorInfo.title ?
    <DialogTitle id="simple-dialog-title" disableTypography={true} style={{fontSize:isSmartphone() ? '4em' : '1em'}}>{errorInfo.title}</DialogTitle>
    : undefined }
  {props.children}
</Dialog> : <Dialog {...props} open={false}
    onClose={props.onClose} maxWidth="xl" fullWidth={false} fullScreen={true} />
}

export const ErrorDialog: React.FC<BMProps> = (props) => {
  function close(){
    if (errorInfo.type !== 'retry'){
      errorInfo.clear()
    }
  }

  return <Observer>{
    () => {
      if (errorInfo.type){
        if (dialogs.has(errorInfo.type)) {
          return dialogs.get(errorInfo.type)!(props)
        } else {
          return <ErrorDialogFrame onClose={() => { close() }}>
            <DialogContent style={{fontSize:isSmartphone() ? '3em' : '1em'}}>{errorInfo.message}</DialogContent>
            {errorInfo.type !== 'retry' ?
              <Box mt={2} mb={2} ml={4}>
              <Button variant="contained" color="primary" style={{textTransform:'none', fontSize:isSmartphone() ? '2.5em' : '1em'}}
                onClick={() => { close() }} >
                {t('emClose')}
              </Button>&nbsp;
              <Button variant="contained" color="secondary" style={{textTransform:'none', fontSize:isSmartphone() ? '2.5em' : '1em'}}
                onClick={() => {
                  errorInfo.supressedTypes.add(errorInfo.type)
                  close()
                }}>
                {t('emNeverShow')}
              </Button>
              </Box>
            : undefined}
          </ErrorDialogFrame>
        }
      }
      return <></>
    }
  }</Observer>
}
ErrorDialog.displayName = 'ErrorDialog'
