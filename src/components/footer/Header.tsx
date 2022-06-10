import {BMProps} from '@components/utils'
/* import {useTranslation} from '@models/locales' */
import {useObserver} from 'mobx-react-lite'
import React, {useEffect, useRef} from 'react'
import {FabMain} from './FabEx'
import {makeStyles} from '@material-ui/core/styles'
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import ExitIcon from '@material-ui/icons/ExitToApp';
import { Button, Dialog, DialogActions, DialogContent/* , DialogTitle */ } from '@material-ui/core'
import { isSmartphone } from '@models/utils'
import { useTranslation } from '@models/locales'


const theme = createMuiTheme({
  palette: {
    primary: { main: '#bcbec0'},
    secondary: { main: '#7ececc'}
  }
});

const useStyles = makeStyles({

  container:{
    position: 'absolute',
    width: '100%',
    top: 0,
    padding: 0,
    left: 10,
    outline: 'none',
    minWidth : 530,
    pointerEvents: 'none',
  },
  wrapper:{width:'100%'},
  wrapperInner:{width:'100%',  display:'flex', alignItems:'flex-end'},
})

class Member{
  timeoutOut:NodeJS.Timeout|undefined = undefined
  touched = false
   // For canvas context menu
   downTime = 0
   upTime = 0
}

let buttonClickStatus:boolean = false
export function getVideoButtonStatus():boolean {
  return buttonClickStatus
}

export const Header: React.FC<BMProps&{height?:number}> = (props) => {
  const {map/* , participants */} = props.stores
  //  showor not
  const [show, setShow] = React.useState<boolean>(false)

  const memberRef = useRef<Member>(new Member())
  const member = memberRef.current

  //const store = props.stores.participants


  //  Fab state and menu
  const {t} = useTranslation()
  const classes = useStyles()
  const containerRef = useRef<HTMLDivElement>(null)

  //  Footer collapse conrtrol
  function checkMouseOnBottom() {
    return map.screenSize[1] - (map.mouse[1] - map.offset[1]) < 90
  }
  const mouseOnBottom = useObserver(checkMouseOnBottom)


  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [mouseOnBottom, member.touched])
  //  keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      //  console.log(`onKeyDown: code: ${e.code}`)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },        [])

  //  render footer
  return React.useMemo(() => {
    function showMainMenu() {
      //console.log("ENTER in SHOW menu")
      if(show) {
        setShow(false)
      } else {
        setShow(true)
      }
    }

    //  Device list update when the user clicks to show the menu
    const fabSize = props.height
    const iconSize = props.height ? props.height * 0.7 : 36


    return <div ref={containerRef} className={classes.container}>
      <MuiThemeProvider theme={theme}>
        <FabMain size={fabSize} color='primary' style={{width: '43%', float: 'left'}}
          onClick = { () => {
            window.open('https://www.earshot.chat/', '_self')
          }}>
          <ExitIcon style={{width:iconSize, height:iconSize, color:'white', transform:'rotate(180deg)'}} />
        </FabMain>

        <FabMain size={fabSize} color='primary'
          onClick = { () => {
            navigator.clipboard.writeText(window.location.href)
            showMainMenu()
          }}>
          <ExitIcon style={{width:iconSize, height:iconSize, color:'white', transform:'rotate(270deg)'}} />
        </FabMain>
        </MuiThemeProvider>
{/* {console.log(show)} */}
        <Dialog open={true} onClose={() => setShow(false)} onExited={() => setShow(false)}
        keepMounted
        style={show ? {zIndex:9999, transform:isSmartphone() ? 'scale(2)' : 'scale(1)'} : {zIndex:-9999, transform:isSmartphone() ? 'scale(2)' : 'scale(1)'}}
        BackdropProps={{ invisible: true }}
        >
          {/* <DialogTitle style={{userSelect: 'none', fontSize:isSmartphone() ? '20px' : '18px', fontWeight:'bold'}}>{t('copyClipboard')}</DialogTitle> */}
          <DialogContent style={{userSelect: 'none', fontSize:isSmartphone() ? '22px' : '20px', fontWeight:'normal'}}>
            {
               t('copyClipboard')
            }
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="secondary" style={{textTransform:'none', marginTop:'0.1em', marginRight:'0.5em', /* backgroundColor:'orange',  */height:'35px', fontSize:'18px', fontWeight:'normal'}}
            onClick={(ev) => {
              setShow(false)
              //_contentDeleteDialogOpen = false
            }}>{t('Ok')}</Button>

          </DialogActions>
        </Dialog>

    </div >
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show]

    )
}
Header.displayName = 'Header'
