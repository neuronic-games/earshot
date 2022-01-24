import React from 'react'
import {ImageAvatar, ImageAvatarProps} from './ImageAvatar'
import {StreamAvatarProps} from './StreamAvatar' // StreamAvatar,

type ComposedAvatarProps = ImageAvatarProps & Partial<StreamAvatarProps>

export const ComposedAvatar: React.FC<ComposedAvatarProps> = (props: ComposedAvatarProps) => {
  const {
    name,
    avatarSrc,
    colors,
    stream,
    blob,
    ...remainProps
  } = props

  //if (!stream && !blob) {
    return <ImageAvatar name={name} colors={colors}
    avatarSrc={avatarSrc} {...remainProps} />
  //}

  //return <StreamAvatar stream={stream} blob={blob} {...remainProps} />
}
ComposedAvatar.displayName = 'ComposedAvatar'
