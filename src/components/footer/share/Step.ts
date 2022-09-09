/* import {BMProps} from '@components/utils'

export type Step = 'menu' | 'none' | 'text' | 'iframe' | 'image' | 'whiteboard' | 'camera'| 'Gdrive'

export interface DialogPageProps extends BMProps {
  setStep: (step: Step) => void
}
 */

import {BMProps} from '@components/utils'

export type Step = 'menu' | 'none' | 'text' | 'iframe' | 'image' | 'zoneimage' | 'whiteboard' | 'camera' | 'Gdrive' | 'roomImage'

export interface DialogPageProps extends BMProps {
  setStep: (step: Step) => void
}



