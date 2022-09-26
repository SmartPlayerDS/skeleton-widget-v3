import React from 'react'
import validator from 'validator'
import 'moment/locale/ru'
import { getQueryStringValue } from './widgetEditorUtils'
import { Logger, translate, setDictionary, isExist, isNotEmptyArray, isNotEmptyString, spreadToList } from "sp_widget_core";
import { widgetEditorDefaultProps, WidgetEditorProps, WidgetEditorState, SettingsList, OpenSelectMediaFunc, TSelectMediaOptions } from './widgetEditor-types'
import { WidgetUI } from "./widgetEditorUI";
import { MediaFileData, convertMediaDateToMediaFile, MediaFile } from "../models/MediaFileData";
import { Field } from "../models/Field";
import { Modal } from "../components/organisms/modal/modal";
import 'react-datetime/css/react-datetime.css'
import styles from './widgetEditor.module.scss'
import l10n from '../dictionary/l10n.json'

setDictionary(l10n)

const isMobileDevice = () => window.settings && window.settings.showSettingsOnMobile

const DEFAULT_VIEW = 'column'
const SETTINGS_VIEW_NAME = 'settingsView'
const logger = Logger()

class WidgetEditor extends React.Component<WidgetEditorProps, WidgetEditorState> {
    isEnabled: boolean
    divProps: any
    state: WidgetEditorState
    widgetUI: WidgetUI
    static defaultProps = widgetEditorDefaultProps

    constructor(p_: WidgetEditorProps) {
        super(p_)

        this.state = {
            showModal: false,
            modalType: undefined,
            item: undefined,
            view: DEFAULT_VIEW,
            editorIsOpen: false
        }
        this.widgetUI = new WidgetUI(this.changeItem, this.onChangeColor, this.openSelectMediaAdminScreen, this.changeText)
        this.isEnabled = this.enabled(p_)
        this.divProps = this.getDivProps(p_)
    }
    componentWillReceiveProps(p_: WidgetEditorProps) {
        const prevProps: WidgetEditorProps = this.props

        if (prevProps.open !== p_.open && p_.open) {
            this.editStart({ stopPropagation: () => { } })
        }

        this.isEnabled = this.enabled(p_)
        this.divProps = this.getDivProps(p_)
    }
    getItem(p_: WidgetEditorProps) {
        return p_.widgetOptionsEditor.getDataByPath(p_.path)
    }
    closeModal = () => {
        const p_ = this.props

        this.setState({
            showModal: false,
            item: undefined,
            modalType: undefined
        })

        this.props.clearWidgetOptionsTemp()
        p_.onClose()
        p_.onMessageForApp('closeModal')
    }
    editStart = (e: any) => {
        e.stopPropagation()

        const p_ = this.props
        const editableItem = this.getItem(p_)

        this.setState({
            showModal: true,
            modalType: 'edit',
            item: { ...editableItem },
            view: editableItem[SETTINGS_VIEW_NAME] || DEFAULT_VIEW
        })

        p_.onMessageForApp('editStart')
        p_.onOpen()
    }

    uploadSettings(e: any) {
        e.preventDefault()

        this.uploadFromFile(e.target.files)
    }

    editFromUpload = (data: any) => {
        const settings = data.settings
        const p_ = this.props
        const editableSettings = { ...this.getItem(p_) }

        if (!this.validate()) {
            return
        }

        for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
                editableSettings[key] = settings[key]
            }
        }

        this.closeModal()
        this.setState({ editorIsOpen: false })

        const dataForUpdating = {
            [p_.path]: editableSettings
        }
        this.updateDataByOptionsAndPassToApp({}, dataForUpdating)
    }

    uploadFromFile(files: any) {
        let file = files[0];
        let result = ''

        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = () => {
            //@ts-ignore
            const data = JSON.parse(reader.result)
            this.editFromUpload(data)
        };
    }

    edit = (e: any, action: string) => {
        e.preventDefault()

        const s_ = this.state
        const p_ = this.props
        const editableSettings = { ...this.getItem(p_) }

        if (!this.validate()) {
            return
        }

        p_.settings.forEach((settingsList) => {
            settingsList.fields.forEach((field) => {
                let newFieldValue = s_.item[field.name]
                if (p_.isNeedDownloadMedia && this._isFieldNeedDownload(field)) {
                    newFieldValue = this._addDownloading(s_.item[field.name])
                }
                editableSettings[field.name] = newFieldValue
            })
        })

        if (action === 'applyAndDownload') {
            downloadAsFile(JSON.stringify({ settings: editableSettings }))
            return
        }

        editableSettings[SETTINGS_VIEW_NAME] = s_.item[SETTINGS_VIEW_NAME]

        this.closeModal()
        const dataForUpdating = {
            [p_.path]: editableSettings
        }

        this.updateDataByOptionsAndPassToApp({}, dataForUpdating)
    }
    private _isFieldNeedDownload = (field: Field): boolean => {
        const s_ = this.state
        return isExist(s_.item[field.name]) && isNotEmptyArray(s_.item[field.name]) && this._isDownloadableFieldType(field)
    }
    private _isDownloadableFieldType = (field: Field): boolean => {
        return field.type === 'video' || field.type === 'fileFolder' || field.type === 'image'  || field.type === 'images'|| field.type === 'audio'
    }
    submitModalSettings = (e: any, action: string) => {
        const s_ = this.state

        switch (s_.modalType) {
            case 'edit':
                this.edit(e, action)
                break
            default:
                break
        }

        this.props.clearWidgetOptionsTemp()
    }
    resetModalSettings = () => {
        const editableItem = this.getItem(this.props)

        this.setState({item: { ...editableItem }})
        this.props.setWidgetOptionsTemp({ ...editableItem })
    }
    validate = (): boolean => {
        let isValid = true
        const s_ = this.state

        // if (s_.item.hasOwnProperty('url')) {
        //     if (!validator.isURL(s_.item.url, { protocols: ['http', 'https'], require_protocol: true })) {
        //         isValid = false
        //     }
        // }
        return isValid
    }
    updateDataByOptionsAndPassToApp = (options: any = {}, updatedData?: any) => {
        const p_ = this.props

        if (!options.withoutValidate && !this.validate()) {
            return
        }

        p_.onUpdate()
        this.props.onWidgetOptionsUpdated(updatedData)
        let data: any = this._makeBackendDataByWidgetOptions(updatedData)
        this._sendUpdatedDataToApp(data)
    }

    private _sendUpdatedDataToApp = (data: any) => {
        // frontend use it for sending to backend.
        // Then backend save new options/settings
        // to public/settings.json or public/data.js
        this._sendMessageToAdminPanel(JSON.stringify(data))
    }

    private _sendMessageToAdminPanel = (message: string) => {
        logger.log(`WidgetEditor#_sendMessageToAdminPanel. ${message}`)
        window.parent.postMessage(message, '*')
    }

    private _makeBackendDataByWidgetOptions = (updatedData: any) => {
        let formattedData = {}
        const key = this.props.widgetOptionsEditor.key

        if (key) {
            formattedData = {
                [key]: {
                    ...this.props.widgetOptionsEditor.data,
                    ...updatedData
                },
                ...window.events
            }
        } else {
            formattedData = {
                ...this.props.widgetOptionsEditor.data,
                ...updatedData,
                ...window.events
            }
        }

        return formattedData
    }
    enabled(p_: WidgetEditorProps): boolean {
        return !!(getQueryStringValue() && p_.enabled)
    }
    getDivProps = (p_: WidgetEditorProps) => {
        const divProps: any = { ...p_ }

        delete divProps['tag']
        delete divProps['path']
        delete divProps['columns']
        delete divProps['onlyEditIcon']
        delete divProps['onlyAddIcon']
        delete divProps['controlsStyle']
        delete divProps['enabled']

        delete divProps['onDelete']
        delete divProps['onUpdate']
        delete divProps['onOpen']
        delete divProps['onClose']

        delete divProps['isNeedDownloadMedia']
        delete divProps['widgetOptionsEditor']
        delete divProps['onMessageForApp']
        delete divProps['onWidgetOptionsUpdated']

        return divProps
    }
    changeItem = (e: any, fieldName: string) => {
        const s_ = this.state
        s_.item[fieldName] = e.target.value.changedItem ? e.target.value.changedItem : e.target.value
        this.setState(s_)
        this.props.setWidgetOptionsTemp(s_.item)
    }
    changeText = (value: any, fieldName: string) => {
        const s_ = this.state

        s_.item[fieldName] = value
        this.setState(s_)
        this.props.setWidgetOptionsTemp(s_.item)
    }
    onSelectDropdown = (e: any, fieldName: string) => {
        const s_ = this.state

        s_.item[fieldName] = e
        this.setState(s_)
    }
    onChangeColor = (color: any, fieldName: string) => {
        const s_ = this.state
        const rgb = color.rgb
        const rgbToStyle = `rgba(${rgb.r},${rgb.g},${rgb.b}, ${rgb.a})`

        s_.item[fieldName] = rgbToStyle
        this.setState(s_)
        this.props.setWidgetOptionsTemp(s_.item)
    }
    openSelectMediaAdminScreen: OpenSelectMediaFunc = (fieldName: string, options?: TSelectMediaOptions, type?: string | undefined) => {
        const p_ = this.props

        p_.widgetOptionsEditor.waitDownloadingFromAdminPanel((mediaData: MediaFileData | any) => {

            if (options && options.selection === "withFolders") {
                this._onMediaWithFoldersDownloaded(mediaData.folders, mediaData.files, fieldName)
                return
            }

            this._onMediaDownloaded(mediaData, fieldName, type)
        })

        if (options && options.selection === "withFolders") {
            this._sendMessageToAdminPanel('widgetEditor__selectMediaWithFolders')
            return
        }

        this._sendMessageToAdminPanel('widgetEditor__selectMedia')
    }

    private _filteredMedia = (mediaList: any, ext: string[]) => {
        return mediaList.filter((media: any) => {
            const mediaExt = media.src.split('.').pop()
            return ext.includes(mediaExt)
        })
    }

    private _onMediaDownloaded = (mediaData: MediaFileData, fieldName: string, type: string | undefined) => {
        logger.log(`WidgetEditor#_onMediaDownloaded. Field:${fieldName}, ${JSON.stringify(mediaData)}`)
        const mediaFilesList: MediaFileData[] = spreadToList(mediaData)
        let mediaFiles: MediaFile[] = convertMediaDateToMediaFile(mediaFilesList)

        if(type){
            let ext: string[]

            switch(type){
                case 'image':
                case 'images':
                    ext = ['jpg', 'png', 'svg', 'jpeg', 'gif']
                    break
                case 'video':
                    ext = ['mp4', 'ogv']
                    break
                case 'audio':
                    ext = ['mp3']
                    break
                default:
                    ext = []
            }

            if(ext.length){
                mediaFiles = this._filteredMedia(mediaFiles, ext)
            }
        }

        if (this.props.isNeedDownloadMedia) {
            mediaFiles = this._addDownloading(mediaFiles)
        }

        this.setState(state => ({
            ...state,
            item: {
                ...state.item,
                [fieldName]: mediaFiles
            }
        }))
    }

    private _onMediaWithFoldersDownloaded = (folders: any[], files: MediaFile[], fieldName: string) => {
        const filesWithDownloads = this._addDownloading(files)
        const foldersFiles: { folders: any[], files: MediaFile[] } = {
            folders: folders,
            files: filesWithDownloads
        }

        this.setState(state => ({
            ...state,
            item: {
                ...state.item,
                [fieldName]: foldersFiles
            }
        }))
    }

    private _addDownloading = <T extends MediaFile>(mediaFiles: T[]): T[] => {
        if (this.props.isNeedDownloadMedia) {
            return mediaFiles.map(mediaFile => {
                const withDownload: any = {
                    ...mediaFile,
                    "$download:src": mediaFile.src
                }

                let data = undefined
                if (mediaFile.data) {
                    data = this._addDownloadByField(mediaFile.data, 'thumbnailURL')
                }
                if (data) {
                    withDownload.data = data
                }

                return withDownload
            })
        }

        return mediaFiles
    }

    private _addDownloadByField = (data: any, field: string) => {
        let newData = { ...data }
        if (newData.hasOwnProperty(field)) {
            newData[`$download:${field}`] = newData[field]
        }
        return newData
    }

    chooseUIControlForField = (field: any) => {
        const s_ = this.state
        return this.widgetUI.getUIComponentByEditable(s_.item, field)
    }
    _getFieldLabel = (field: Field): string => {
        let label = field.label || ''
        if (isNotEmptyString(label)) {
            label += ':'
        }
        return label
    }

    renderSettings = (settings: SettingsList[]) => {
        const { view } = this.state;

        const className = view === 'column' ? styles.settingsList_type_column : styles.settingsList_type_row

        return settings.map(({ fields, name }, index: number) => {
            return (
                <div key={index} className={`${styles.settingsList} ${className}`}>
                    <div className={styles.itemGroup}>
                        <div className={styles.settingsListHeader}>
                            {translate(name)}
                        </div>
                        {this._renderControlsByFields(fields)}
                    </div>
                </div>
            )
        })
    }

    _renderControlsByFields = (fields: Field[]) => {
        return fields.map((field: Field, index: number) => {
            let labelName = this._getFieldLabel(field)

            return (
                <div key={index} className={styles.item}>
                    <div className={styles.label}>
                        <label htmlFor={field.name}>{translate(labelName)}</label>
                    </div>
                    {this.chooseUIControlForField(field)}
                </div>
            )
        })
    }

    getModalControls = () => {
        return [
            <div>
                <label
                    //@ts-ignore
                    htmlFor="file-upload"
                    className={styles.settingsFileAction}
                    key={'uploadSettingsButton'}
                >
                    <img src={'images/upload.svg'} />
                </label>
                <input
                    id="file-upload"
                    type="file"
                    key={'uploadSettingsInput'}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        this.uploadSettings(e)
                    }}
                />
                <div
                    className={styles.settingsFileAction}
                    key={'downloadSettingsButton'}
                    onClick={(e) => {
                        this.submitModalSettings(e, 'applyAndDownload')
                    }}
                >
                    <img src={'images/download.svg'} />
                </div>
            </div>,
            <div>
                <button
                    className={`${styles.button} ${styles.resetBtn}`}
                    type={'button'}
                    key={'resetButton'}
                    onClick={(e) => {
                        this.resetModalSettings()
                    }}
                >
                    {translate('reset')}
                </button>
                <button
                    className={`${styles.button} ${styles.applyBtn}`}
                    type={'button'}
                    key={'submitButton'}
                    onClick={(e) => {
                        this.submitModalSettings(e, 'applyOnly')
                    }}
                >
                    {translate('saveSettings')}
                </button>
            </div>
        ]
    }

    getModalTitleControls = () => {
        const { view } = this.state;

        return [
            <button
                className={styles.viewButton}
                type={'button'}
                key={'viewButton'}
                onClick={this.changeView}
            >
                <img src={`./images/${view}.svg`} />
            </button>
        ]
    }

    getWidgetVersion = () => {
        return process.env.REACT_APP_VERSION ? ` (${process.env.REACT_APP_VERSION})` : ''
    }

    getWidgetEditorTitle = () => {
        return `${translate('widgetEditorTitle')}${this.getWidgetVersion()}`
    }

    saveSettingsView = () => {
        const { item, view } = this.state

        if (!item[SETTINGS_VIEW_NAME]) return

        this.changeItem({ target: { value: view } }, SETTINGS_VIEW_NAME)
    }

    changeView = (e: React.MouseEvent) => {
        e.preventDefault();

        this.setState((prevState) => {
            return {
                ...prevState,
                view: prevState.view === 'row' ? 'column' : 'row'
            }
        }, () => {
            this.saveSettingsView()
        })
    }

    render() {
        const p_ = this.props
        const Tag = p_.tag || 'div'

        if (!this.isEnabled) {
            return (
                <Tag {...this.divProps} className={p_.className}>
                    {p_.children}
                </Tag>
            )
        }

        const isMobile = isMobileDevice()
        const s_ = this.state
        const className = s_.view === 'column' ? styles.form_type_column : styles.form_type_row

        return (
            <Tag {...this.divProps} className={styles.wrapper}>
                {p_.children}
                {this.enabled(p_) && (
                    <div className={styles.controls} style={p_.controlsStyle}>
                        <span
                            style={{
                                width: 0,
                                height: '100%',
                                display: 'inline-block'
                            }}
                        />
                    </div>
                )}

                <Modal
                    open={s_.showModal}
                    title={this.getWidgetEditorTitle()}
                    onClose={this.closeModal}
                    showCloseIcon={!isMobile}
                    className={styles.modal}
                    modalControls={this.getModalControls()}
                    modalTitleControls={this.getModalTitleControls()}
                    appMainProps={p_.appMainProps}
                >
                    <form className={`${styles.form} ${className}`}>
                        {(s_.modalType === 'add' || s_.modalType === 'edit') &&
                            this.renderSettings(p_.settings)
                        }
                    </form>
                </Modal>
            </Tag>
        )
    }
}

function downloadAsFile(data: any) {
    let a = document.createElement("a");
    let file = new Blob([data], { type: 'application/json' });
    a.href = URL.createObjectURL(file);
    a.download = "settings.json";
    a.click();
}

export { WidgetEditor }