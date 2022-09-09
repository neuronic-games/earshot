
import {makeStyles} from '@material-ui/core/styles'

const buttonStyle = {
  '&': {
    color:'lightgrey',
  },
  '&:hover': {
    color:'lightgreen',
  },
  '&:active': {
    color:'lightgreen',
  },
}

export const styleCommon = makeStyles({
  back:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#DFDBE5',
  },
  fill:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  previous : {
    width:'50px',
    height:'50px',
    position:'absolute',
    left:'0px',
    color:'lightgrey',
    cursor:'default',
    ...buttonStyle,
  },

  next : {
    width:'50px',
    height:'50px',
    position:'absolute',
    right:'-12px',
    color:'lightgrey',
    ...buttonStyle,
  },

  activeSlide : {
    opacity: 1,
    transition: 'opacity 1000ms',
  },

  slide: {
    opacity: 0,
    transition: 'opacity1000ms',
  }
})

export const styleForSplit = makeStyles({
  /* resizerVertical: {
    background: '#000',
    zIndex: 1,
    boxSizing: 'border-box',
    backgroundClip: 'padding-box',
    width: 11,
    margin: '0 -10px 0 0',
    borderLeft: '1px solid gray',
    borderRight: 'transparent 10px solid',
    cursor: 'col-resize',
  },
  resizerHorizontal: {
    background: 'gray',
    zIndex: 1,
    boxSizing: 'border-box',
    backgroundClip: 'padding-box',
    height: 10.5,
    margin: '-5px 0 -5px 0',
    borderTop: '5px transparent solid',
    borderBottom: '5px transparent solid',
    cursor: 'row-resize',
  }, */
  resizerVertical: {
    background: '#0f5c81',
    zIndex: 1,
    boxSizing: 'border-box',
    backgroundClip: 'padding-box',
    width: 11,
    margin: '0 -10px 0 0',
    borderLeft: '0px solid white'/* '1px solid gray' */,
    borderRight: 'transparent 10px solid',
    cursor: 'col-resize',
  },
  resizerHorizontal: {
    background: '#85AEE060'/* 'gray' */,
    zIndex: 1,
    boxSizing: 'border-box',
    backgroundClip: 'padding-box',
    height: 10.5,
    width: '80%',
    marginLeft: '10%',
    margin: '-5px 0 -5px 0',
    borderTop: '5px transparent solid',
    borderBottom: '5px transparent solid',
    cursor: 'row-resize',
    textAlign: 'center',
  },
})

export interface ListLineProps{
  height:number
  fontSize:number
}

export const styleForList = makeStyles({
  container: {
    width:'100%',
  },
  title: (props: ListLineProps) => ({
    //fontSize: props.fontSize, // * 0.8,
    justifyContent: 'start',
    justifyItems: 'start',
    alignItems: 'center',
    userSelect: 'none',
    userDrag: 'none',
    whiteSpace: 'nowrap',
    width: '100%',
  }),
  outer: {
    display: 'flex',
    whiteSpace: 'nowrap',
    padding: 0,
    margin: 0,
    width: '100%',
  },
  line: (props: ListLineProps) => ({
    display: 'flex',
    justifyContent: 'start',
    justifyItems: 'start',
    alignItems: 'center',
    userSelect: 'none',
    userDrag: 'none',
    whiteSpace: 'nowrap',
    fontSize: props.fontSize,
    height: props.height,
    width: '100%',
    padding: 0,
  }),
})
