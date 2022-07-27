import imageLine from '@iconify-icons/clarity/image-line'
import imageOutlineBadged from '@iconify-icons/clarity/image-outline-badged'
import hiMeeting from '@iconify-icons/healthicons/group-discussion-meetingx3'
import roomClosed from '@iconify-icons/healthicons/square-medium-negative'
import clipboardCopy from '@iconify-icons/heroicons-outline/clipboard-copy'
import biDashCircleDotted from '@iconify/icons-bi/dash-circle-dotted'
import biImage from '@iconify/icons-bi/image'
import biImageNoFrame from '@iconify/icons-bi/image-alt'
import roomOpen from '@iconify/icons-fluent/square-hint-24-regular'

import biPlusCircleFill from '@iconify/icons-bi/plus-circle-fill'

/* import pinIcon from '@iconify/icons-mdi/pin'
import pinOffIcon from '@iconify/icons-mdi/pin-off' */

import {Icon} from '@iconify/react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Popover, { PopoverProps } from '@material-ui/core/Popover'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import FlipToBackIcon from '@material-ui/icons/FlipToBack'
import FlipToFrontIcon from '@material-ui/icons/FlipToFront'
import {ISharedContent} from '@models/ISharedContent'
import {canContentBeAWallpaper, isContentEditable, isContentWallpaper} from '@models/ISharedContent'
import {t} from '@models/locales'
import {isSmartphone, Pose2DMap} from '@models/utils'
import {copyContentToClipboard,  makeContentWallpaper,
   moveContentToBottom, moveContentToTop} from '@stores/sharedContents/SharedContentCreator'
import {TITLE_HEIGHT} from '@stores/sharedContents/SharedContents'
import {Observer} from 'mobx-react-lite'
import React, {Fragment} from 'react'
import {contentTypeIcons, editButtonTip} from './Content'
import {RndContentProps} from './RndContent'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'


const theme = createMuiTheme({
  palette: {
    primary: { main: '#7ececc' },
    secondary: { main: '#ef4623' }
  }
});

type PopoverPropsNoOnClose = Omit<PopoverProps, 'onClose'>
export interface SharedContentFormProps extends Omit<RndContentProps, 'content'>, PopoverPropsNoOnClose{
  close: () => void,
  content?: ISharedContent
  open: boolean
}

type ContentType = JSX.Element | string

function Row(left1: ContentType, left2: ContentType, center: ContentType,
  right2: ContentType, right1: ContentType, key?: string|number){
  const cellstyle = {
    margin:0,
    padding:2,
    border:'none',
  }

  const centerCellstyle = {
    margin:0,
    padding:2,
    border:'none',
    transform: isSmartphone() ? 'scale(1.5)' : 'scale(1)'
  }

  return <TableRow key={key}>
    <TableCell align="right" style={cellstyle}>{left1}</TableCell>
    <TableCell align="right" style={cellstyle}>{left2}</TableCell>
    <TableCell align="center" style={centerCellstyle}>{center}</TableCell>
    <TableCell style={cellstyle}>{right2}</TableCell>
    <TableCell style={cellstyle}>{right1}</TableCell>
  </TableRow>
}

class SharedContentFormMember{
  zorder!: number
  pinned!: boolean
  showTitle!: boolean
  editing!: string
  name!: string
  pose!: Pose2DMap
  constructor(props: SharedContentFormProps){
    this.save(props)
  }
  save(props: SharedContentFormProps){
    if (!props.content) { return }
    this.zorder = props.content.zorder
    this.pinned = props.content.pinned
    this.name = props.content.name
    this.pose = props.content.pose
    this.editing = props.stores.contents.editing
    this.showTitle = props.content.showTitle
  }
  restore(props: SharedContentFormProps){
    if (!props.content) { return }
    props.content.zorder = this.zorder
    props.content.pinned = this.pinned
    props.content.name = this.name
    props.content.pose = this.pose
    props.content.showTitle = this.showTitle
    props.stores.contents.setEditing(this.editing)
  }
}
export const SharedContentForm: React.FC<SharedContentFormProps> = (props: SharedContentFormProps) => {
  const memberRef = React.useRef(new SharedContentFormMember(props))
  const member = memberRef.current


  //const tfIStyle = {fontSize: isSmartphone() ? '2em' : '1em',
  //height: isSmartphone() ? '2em' : '1.5em'}
  //const tfDivStyle = {height: isSmartphone() ? '4em' : '3em'}
  const tfLStyle = {fontSize: isSmartphone() ? '2em' : '1em'}
  //const iStyle = {fontSize: isSmartphone() ? '2.5rem' : '1rem'}


  function closeForm(ev:Object, reason:string) {
    if (reason === 'enter' || reason==='backdropClick'){
      member.save(props)
      if (props.content){
        props.updateAndSend(props.content)
      }
    }
    props.close()
  }
  const onKeyPress = (ev:React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      closeForm(ev, 'enter')
    }
  }

  const extractPopoverProps = ({onClose, autoHideTitle, updateAndSend, updateOnly, close, ...reminder}
    : SharedContentFormProps) => reminder
    const {contents, map} = props.stores
    const popoverProps:PopoverPropsNoOnClose = extractPopoverProps(props)

  return <Popover onClose={closeForm} {...popoverProps} onMouseDown={(ev)=>{
    ev.stopPropagation()
  }}>
    <Observer>{()=>
      <DialogContent>
        <table><tbody><tr><td>
       {contentTypeIcons(props.content ? props.content.type : '', TITLE_HEIGHT)}
       </td><td>
        <TextField label={t('ctName')} multiline={false} value={props.content ? props.content.name : ''}
          style={{marginLeft:20, width:'100%'}}
          inputProps={{autoFocus:true, style:tfLStyle}}
          InputLabelProps={{style:tfLStyle}}
          onChange={event => {
            //setName(event.target.value)
            if (!props.content) { return }
            props.content.name = event.target.value
            props.updateOnly(props.content)
          }}
          onKeyPress={onKeyPress} fullWidth={true}
        />
        </td></tr></tbody></table>
        <MuiThemeProvider theme={theme}>
        <Box mt={2} mb={2}>
          <Button variant="contained" style={{textTransform:'none', fontSize:isSmartphone() ? '2em' : '1em'}}
            onClick={()=>{
              if (!props.content) { return }
              moveContentToTop(props.content)
              props.updateOnly(props.content)
            }}><FlipToFrontIcon style={tfLStyle} />&nbsp; {t('ctMoveTop')}</Button> &nbsp;
          <Button variant="contained" style={{textTransform:'none', fontSize:isSmartphone() ? '2em' : '1em'}}
            onClick={()=>{
              if (!props.content) { return }
              moveContentToBottom(props.content)
              props.updateOnly(props.content)
            }}><FlipToBackIcon style={tfLStyle} />&nbsp; {t('ctMoveBottom')}</Button> &nbsp;
        </Box>
        <Box mt={2} mb={2}>
          <Button variant="contained" style={{textTransform:'none', fontSize:isSmartphone() ? '2em' : '1em'}}
            onClick={()=>{
              if (!props.content) { return }
              copyContentToClipboard(props.content)
            }}><Icon style={tfLStyle} icon={clipboardCopy} height={TITLE_HEIGHT}/>&nbsp; {t('ctCopyToClipboard')}</Button> &nbsp;
          <Button variant="contained" style={{textTransform:'none', fontSize:isSmartphone() ? '2em' : '1em'}}
            onClick={()=>{
              if (!props.content) { return }
              map.focusOn(props.content)
            }}>{t('ctFocus')}</Button>
        </Box>
        <Table size="small"><TableBody>{[
           Row(<span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctUnTitle')}</span>,<Icon icon={biImage} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT} />,
           <Switch color="secondary" checked={props.content?.showTitle} onChange={(ev, checked)=>{
             if (!props.content) { return }
             props.content.showTitle = checked
             props.updateOnly(props.content)
           }}/>, <Icon icon={biImage} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT} />, <span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctTitle')}</span>, 'title'),

          /* Row(t('ctUnpin'),<Icon icon={pinOffIcon} height={TITLE_HEIGHT} />,
            <Switch color="secondary" checked={props.content?.pinned} onChange={(ev, checked)=>{
              if (!props.content) { return }
              props.content.pinned = checked
              props.updateOnly(props.content)
            }}/>, <Icon icon={pinIcon} height={TITLE_HEIGHT} />, t('ctPin'), 'pin') ,*/

          <Fragment key="edit">{isContentEditable(props.content) ?
            Row(editButtonTip(true, props.content),<DoneIcon />,
            <Switch color="secondary" checked={props.content?.id === contents.editing} onChange={(ev, checked)=>{
              if (!props.content) { return }
              contents.setEditing(checked ? props.content.id : '')
            }}/>, <EditIcon />, editButtonTip(false, props.content)) : undefined}</Fragment>,
          <Fragment key="wall">{canContentBeAWallpaper(props.content) ?
            Row(<span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctUnWallpaper')}</span>, <Icon icon={imageLine} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>,
            <Switch color="secondary" checked={isContentWallpaper(props.content)} onChange={(ev, checked)=>{
              if (!props.content) { return }
              makeContentWallpaper(props.content, checked)
              props.updateOnly(props.content)
            }}/>, <Icon icon={imageOutlineBadged} height={isSmartphone() ? (TITLE_HEIGHT*1.2) : TITLE_HEIGHT}/>, <span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctWallpaper')}</span>) : undefined}</Fragment>,
          <Fragment key="noFrame">{
            Row(<span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctFrameVisible')}</span>, <Icon icon={biImage} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>,
            <Switch color="secondary" checked={props.content?.noFrame ? true : false} onChange={(ev, checked)=>{
              if (!props.content) { return }
              props.content.noFrame = checked ? true : undefined
              props.updateOnly(props.content)
            }}/>, <Icon icon={biImageNoFrame} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>, <span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctFrameInvisible')}</span>) }</Fragment>,
          <Fragment key="zone">{
            props.content?.type === 'img' ?
            Row(<span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctNotAudioZone')}</span>, <Icon icon={imageLine} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>,
              <Switch color="secondary" checked={props.content?.zone!==undefined} onChange={(ev, checked)=>{
                if (!props.content) { return }
                props.content.zone = checked ? (props.content.zone ? props.content.zone : 'open') : undefined
                props.updateOnly(props.content)
                }}/>, <Icon icon={hiMeeting} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>,
              <>
                { props.content.zone ? <IconButton size={'small'} style={{fontSize: isSmartphone() ? '2em' : '1em'}} onClick={()=>{
                  if (!props.content){ return }
                  props.content.zone = props.content.zone === 'close' ? 'open' : 'close'
                  props.updateOnly(props.content)}}>
                  <Icon icon={props.content.zone==='close' ? roomClosed : roomOpen} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>
                </IconButton> : undefined}
                {props.content.zone === 'close' ? <span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctClosedAudioZone')}</span> : <span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctOpenAudioZone')}</span>}
              </>) : undefined }</Fragment>,
          <Fragment key="opacity">{
            Row(<span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctTransparent')}</span>, <Icon icon={biDashCircleDotted} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>,
            <Slider color="secondary" value={props.content?.opacity===undefined ? 1000 : props.content.opacity*1000}
              min={0} max={1000}
              style={{width:isSmartphone() ? '2em' : '6em', marginLeft:isSmartphone() ? '4em' : '0.4em', marginRight:isSmartphone() ? '4em' : '0.4em', transform:isSmartphone() ? 'scale(2)' : 'scale(1'}}
              onChange={(ev, value) => {
                if (!props.content) { return }
                props.content.opacity = value === 1000 ? undefined : (value as number) / 1000
                props.updateOnly(props.content)
            }} />, <Icon icon={biPlusCircleFill} height={isSmartphone() ? (TITLE_HEIGHT * 1.2) : TITLE_HEIGHT}/>, <span style={{fontSize:isSmartphone() ? '2em' : '1em'}}>{t('ctOpaque')}</span>) }</Fragment>,
            ]}</TableBody></Table>
        <Box mt={2} mb={2}>

          <Button variant="contained" color="primary" style={{textTransform:'none', fontSize:isSmartphone() ? '2em' : '1em'}}
            onClick={()=>{
              closeForm({}, 'enter')
            }}>{t('btSave')}</Button>
          <Button variant="contained" color="secondary" style={{textTransform:'none', marginLeft:15, fontSize:isSmartphone() ? '2em' : '1em'}}
            onClick={()=>{
              if (!props.content) { return }
              member.restore(props)
              props.updateOnly(props.content)
            }}>{t('btCancel')}</Button>
          <Button variant="contained" color="secondary" style={{textTransform:'none', marginLeft:60, fontSize:isSmartphone() ? '2em' : '1em'}}
            onClick={(ev)=>{
              props.onClose(ev)
            }}><CloseRoundedIcon /> &nbsp; {t('ctDelete')}</Button> &nbsp;&nbsp;

        </Box>
        </MuiThemeProvider>
      </DialogContent>}
    </Observer>
  </Popover>
}
