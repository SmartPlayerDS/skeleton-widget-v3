export interface ITranslationTextModel {
    [key: string]: string
}

export interface ITranslation {
    [key: string]: ITranslationTextModel
}

export type Localisation = 'ru' | 'en' | 'pt' | 'es'