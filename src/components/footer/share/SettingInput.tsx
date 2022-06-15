import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import React from 'react'
import {DialogPageProps} from './DialogPage'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { isSmartphone } from '@models/utils'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#7ececc' },
    secondary: { main: '#ef4623' }
  }
});

interface SettingInputProps<T> extends DialogPageProps{
  inputField: JSX.Element
  value: T
  onFinishInput: (text: T) => void
}

export function SettingInput<T>(props: SettingInputProps<T>) {  // tslint: disable-line
  const {
    setStep,
    value,
    onFinishInput,
    inputField,
  } = props

  return (
    <List>
      <ListItem>
        {inputField}
      </ListItem>
      <ListItem>
      <MuiThemeProvider theme={theme}>
        <Button
        style={{fontSize:isSmartphone() ? '2em' : '1em'}}
          variant="contained"
          color="primary"
          onClick={() => {
            onFinishInput(value)
            setStep('none')
          }}
        >
          Done
        </Button>
        </MuiThemeProvider>
      </ListItem>
    </List>
  )
}
SettingInput.displayName = 'SettingInput'
