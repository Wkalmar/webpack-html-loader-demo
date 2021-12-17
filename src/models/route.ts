import { Location } from './location';
import { LocalizableString } from './localizableString'

export class Route {
    id: string
    stationStartId: string
    stationEndId: string
    checkpoints: Location[]
    name: LocalizableString
    description: LocalizableString
}




