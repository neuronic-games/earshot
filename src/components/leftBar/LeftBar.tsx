import React, {useState} from 'react'
import SplitPane from 'react-split-pane'
import {useGesture} from 'react-use-gesture'
import {BMProps} from '../utils'
import {styleForSplit} from '../utils/styles'
import {ChatInBar} from './Chat'
import {ContentList} from './ContentList'
import {ParticipantList} from './ParticipantList'

import { getAbleStatus, getSelectedMenuPos } from '@components/App'
import { getSelectedMenuType } from '@components/App'
import { useObserver } from 'mobx-react-lite'

//declare const config:any             //  from ../../config.js included from index.html

export interface TextLineStyle {
  lineHeight: number
  fontSize: number
}
const defaultTextLineHeight = {
  lineHeight:20,
  fontSize:16,
}

function limitScale(currentScale: number, scale: number): number {
  const targetScale = currentScale * scale
  const maxScale = 4
  const minScale = 0.5

  if (targetScale > maxScale) { return maxScale }
  if (targetScale < minScale) { return minScale }

  return targetScale
}
const textLineStyle = Object.assign({}, defaultTextLineHeight)

export const LeftBar: React.FC<BMProps> = (props) => {
  const classes = styleForSplit()
  const [scale, doSetScale] = useState<number>(1)

  const cContent = useObserver(() => props.stores.contents.all)


  const setScale = (scale:number) => {
    Object.assign(textLineStyle, defaultTextLineHeight)
    textLineStyle.fontSize *= scale
    textLineStyle.lineHeight *= scale
    doSetScale(scale)
  }

  const bind = useGesture(
    {
      onPinch: ({da: [d, a], origin, event, memo}) => {
        if (memo === undefined) {
          return [d, a]
        }
        const [md] = memo

        const MIN_D = 10
        const scaleChange = d > MIN_D ? d / md : d <  -MIN_D ? md / d : (1 + (d - md) / MIN_D)
        setScale(limitScale(scale, scaleChange))
        //  console.log(`Pinch: da:${[d, a]} origin:${origin}  memo:${memo}  scale:${scale}`)

        return [d, a]
      },
    },
    {
      eventOptions:{passive:false}, //  This prevents default zoom by browser when pinch.
    },
  )


  const _status = useObserver(() => getAbleStatus())
  const _menuSelected = useObserver(() => getSelectedMenuType())
  console.log(_status, " status ", _menuSelected)

  const _menuSelectedPos = useObserver(() => getSelectedMenuPos())




  return (
    <div {...bind()}>
      {_menuSelected === 'chat' ?
      <SplitPane split="horizontal" /* defaultSize="80%" */ defaultSize="50%" resizerClassName = {classes.resizerHorizontal}
        paneStyle = {{overflowY: 'auto', overflowX: 'hidden', width:'100%', minWidth:'280px'}} >
        {/* <SplitPane split="horizontal" defaultSize="50%" resizerClassName = {classes.resizerHorizontal}
          paneStyle = {{overflowY: 'auto', overflowX: 'hidden', width:'100%'}} > */}
          <ParticipantList {...props} {...textLineStyle} />
         {/*  <ContentList {...props}  {...textLineStyle} /> */}
        {/* </SplitPane > */}
        <ChatInBar {...props}  {...textLineStyle} />
      </SplitPane >
      : (_menuSelected === 'content') ?
      <SplitPane split="horizontal" defaultSize="100%" resizerClassName = {classes.resizerHorizontal}
        paneStyle = {{overflowY: 'auto', overflowX: 'hidden', width:'100%', minWidth:'280px'}} >
          <ContentList {...props}  {...textLineStyle} />
      </SplitPane >
      :
      <>
      {cContent.filter(item => item.shareType === "appimg").map(content => (
        (_menuSelected === content.type && _menuSelectedPos === -2) ?
        <SplitPane split="horizontal" defaultSize="100%" resizerClassName = {classes.resizerHorizontal}
          paneStyle = {{overflowY: 'auto', overflowX: 'hidden', width:'100%', minWidth:'280px'}} >
            <iframe src= {content.url} title={content.type} allowTransparency={true} frameBorder={0} style={{width:'100%', height:'100%'}}></iframe>
        </SplitPane >
        : <></>
       ))}
      </>
      }
    </div>
  )
}
LeftBar.displayName = 'LeftBar'
