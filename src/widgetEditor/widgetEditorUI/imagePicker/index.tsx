import React, {FunctionComponent} from 'react';
import {ChangeItemFunc, OpenSelectMediaFunc} from "../../widgetEditor-types";
import {ICommonUI} from "../widgetEditorUI-types";
import {DeleteButton} from "../../DeleteButton/DeleteButton";

import styles from './imagePicker.module.scss'
import {translate} from "sp_widget_core";


interface IImagePicker extends ICommonUI {
    onOpenSelectMediaAdminScreen: OpenSelectMediaFunc
    onChangeItem: ChangeItemFunc
}

const ImagePicker: FunctionComponent<IImagePicker> = ({field, editableItem, onOpenSelectMediaAdminScreen, onChangeItem}) => {
    const fieldName = field.name

    const isCollection = () =>{
        return field.type === 'images'
    }

    const openFolder = () => {
        let selection;
        if (field.advanced && field.advanced.selection) {
            selection = field.advanced.selection
        }
        onOpenSelectMediaAdminScreen(fieldName, {selection: selection}, field.type)
    }

    const getImages = (imagesList: any) => {
        const list: any = []

        imagesList.forEach((image: any, index: any) =>{
            const limit = isCollection() ? 5 : 1
            if(index < limit){
                const imageKey = 'image_' + index.toString()

                list.push((
                    <img
                        key={image.id}
                        className={`${styles.image} ${styles[imageKey]}`}
                        alt={''}
                        src={image.src}
                        onClick={() => onOpenSelectMediaAdminScreen(fieldName, undefined, field.type)}
                    />
                ))
            }
        })

        return list
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

    return (
        <div className={styles.imagePickerWrapper}>
            {editableItem[fieldName] && editableItem[fieldName].length ? (
                <div className={styles.imagesWrapper}>
                    {getImages(editableItem[fieldName])}
                </div>
            ): null}
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    if(isCollection()){
                        openFolder()
                        return
                    }

                    onOpenSelectMediaAdminScreen(fieldName, undefined, field.type)
                }}
                className={styles.button}
            >
                {translate(editableItem[fieldName] && editableItem[fieldName].length ? 'changeSelection' : isCollection() ? 'selectImages' : 'selectImage')}
            </div>
            {editableItem[fieldName] && editableItem[fieldName].length ? (
                <DeleteButton onClick={deleteItem} className={styles.deleteButtonClassName} />
            ) : null}
        </div>
    )
};

export {ImagePicker}
