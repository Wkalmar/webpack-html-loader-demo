import { Location } from './location';
import { LocalizableString } from './localizableString'

export class Station {
    id: string
    name: LocalizableString
    location: Location
    branch: Branch
}

export const enum Branch {
    Red = "Red",
    Blue = "Blue",
    Green = "Green"
}