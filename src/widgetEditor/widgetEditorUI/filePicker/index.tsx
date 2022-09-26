import React, {FunctionComponent} from 'react';
import {ChangeItemFunc, OpenSelectMediaFunc} from "../../widgetEditor-types";
import {ICommonUI} from "../widgetEditorUI-types";
import styles from './filePicker.module.scss'
import {translate} from "sp_widget_core";
import {DeleteButton} from "../../DeleteButton/DeleteButton";

interface IFilePickerComponent extends ICommonUI {
    onOpenSelectMediaAdminScreen: OpenSelectMediaFunc
    onChangeItem: ChangeItemFunc
}

const FilePicker: FunctionComponent<IFilePickerComponent> = ({field, editableItem, onOpenSelectMediaAdminScreen, onChangeItem}) => {
    const fieldName = field.name

    const openFolder = () => {
        let selection;
        if (field.advanced && field.advanced.selection) {
            selection = field.advanced.selection
        }
        onOpenSelectMediaAdminScreen(fieldName, {selection: selection}, field.type)
    }

    const deleteItem = (e: any) => {
        e.stopPropagation()
        const value = {
            target: {
                value: ''
            }
        }

        onChangeItem(value, fieldName)
    }

    const getImages = (imagesList: any) => {
        const list: any = []

        imagesList.forEach((image: any, index: any) =>{
            const limit = 5
            if(index < limit){
                const imageKey = 'image_' + index.toString()

                list.push((
                    <img
                        className={`${styles.image} ${styles[imageKey]}`}
                        alt={''}
                        src={'images/mixedContent.svg'}
                        onClick={() => onOpenSelectMediaAdminScreen(fieldName, undefined, field.type)}
                    />
                ))
            }
        })

        return list
    }

    return (
        <div className={styles.filePickerWrapper}>
            {editableItem[fieldName] && editableItem[fieldName].length ? (
                <div className={styles.filesPreviewWrapper}>
                    {getImages(editableItem[fieldName])}
                </div>
            ): null}
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    openFolder()
                }}
                className={styles.button}
            >
                {translate(editableItem[fieldName] && editableItem[fieldName].length ? 'changeSelection' : 'selectFolder')}
            </div>
            {editableItem[fieldName] && editableItem[fieldName].length ? (
                <DeleteButton onClick={deleteItem} className={styles.deleteButtonClassName} />
            ) : null}
        </div>
    );
};

export {FilePicker}
