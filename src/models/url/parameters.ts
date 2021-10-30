interface Params {
  [key: string]: string | null
  room: string | null               // conference room name
  name: string | null               // user name
  headphone: headphoneType | null   // stereo headphone output
  speaker: headphoneType | null     // monaural speaker output
  cameraOn: muteType | null       // Mute the camera at start
  muteMic: muteType | null          // Mute the mic at start
  testBot: string | null            // Tester bot mode
  skipEntrance: string | null       // skip entrance
}

export function decodeGetParams(url: string): Params {
  const urlObj = new URL(decodeURI(url))
  const props = ['room', 'name', 'headphone', 'speaker', 'cameraOn', 'muteMic', 'testBot', 'skipEntrance']

  const res: Params = props.reduce(
    (pre, prop) => {
      pre[prop] = urlObj.searchParams.get(prop)

      return pre
    },
    {} as Params,
  )

  /* let _pathname = urlObj.pathname.substr(1).toLowerCase().split("/");
  let _name = _pathname[_pathname.length-1]
  urlObj.pathname = "/" + _name */

  /* 
  console.log(urlObj.pathname.substr(1).toLowerCase(), " -- ", _name)

  //let _href = urlObj.href.toLowerCase().split("/")[0];
  urlObj.href = urlObj.origin */

  res.room = urlObj.pathname.substr(1).toLowerCase().replace(/[./@]/, '_') + (res.room ? res.room.toLowerCase() : '')

  //console.log(urlObj)

  return res
}

type headphoneType = ''
type muteType = 'yes' | 'true' | 'no' | 'false'

