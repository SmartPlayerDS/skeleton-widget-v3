import {WidgetOptionsEditor} from "../models/WidgetOptionsEditor";
import { Field } from "../models/Field";

export interface SettingsList {
    name: string    
    fields: Field[]
}

export type TSelection = 'default' | 'withFolders'
export type TSelectMediaOptions = {
    selection: TSelection
}

export type ChangeItemFunc = (e: any, fieldName: string) => void
export type ChangeColorFunc = (color: any, fieldName: string) => void
export type OpenSelectMediaFunc = (fieldName: string, options?: TSelectMediaOptions, type?: string) => void
export type ChangeTextFunc = (e: any, fieldName: string) => void

export interface WidgetEditorProps {
    path: string
    settings: SettingsList[]
    isNeedDownloadMedia: boolean
    widgetOptionsEditor: WidgetOptionsEditor
    onWidgetOptionsUpdated: (updatedData?: any) => void
    onMessageForApp: (type: string, data?: any) => void
    appMainProps: any
    setWidgetOptionsTemp: any
    clearWidgetOptionsTemp: any

    open?: string
    tag?: string
    enabled?: boolean,

    controlsStyle?: any | object

    onDelete: () => void
    onUpdate: () => void
    onClose: () => void
    onOpen: () => void

    className?: string
    style?: any
}

export interface WidgetEditorState {
    showModal: boolean
    modalType: string | undefined
    item: any
    view: 'column' | 'row',
    editorIsOpen: boolean
}


export const widgetEditorDefaultProps = {
    tag: 'div',
    onlyEditIcon: false,
    enabled: true,
    controlsStyle: {
        visibility: 'hidden'
    },
    onDelete: () => {},
    onUpdate: () => {},
    onClose: () => {},
    onOpen: () => {}
}