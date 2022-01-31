import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import React from 'react'
import {DialogPageProps} from './DialogPage'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#7ececc' },
    secondary: { main: '#ef4623' }
  }
});

interface InputProps<T> extends DialogPageProps{
  inputField: JSX.Element
  value: T
  onFinishInput: (text: T) => void
}

export function Input<T>(props: InputProps<T>) {  // tslint: disable-line
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
Input.displayName = 'Input'
