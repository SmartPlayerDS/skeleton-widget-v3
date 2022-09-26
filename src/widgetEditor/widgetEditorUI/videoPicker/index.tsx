import React, {FunctionComponent} from 'react';
import {ChangeItemFunc, OpenSelectMediaFunc} from '../../widgetEditor-types';
import {ICommonUI} from "../widgetEditorUI-types";

import styles from './videoPicker.module.scss'
import {translate, convertValueForEditorFormat, isNotEmptyArray} from "sp_widget_core";
import {DeleteButton} from "../../DeleteButton/DeleteButton";


interface IVideoPicker extends ICommonUI {
    onOpenSelectMediaAdminScreen: OpenSelectMediaFunc
    onChangeItem: ChangeItemFunc
}

const VideoPicker: FunctionComponent<IVideoPicker> = (
    {
        field,
        editableItem,
        onOpenSelectMediaAdminScreen,
        onChangeItem
    }
) => {
    const fieldName = field.name
    let video: any = ''

    if (isNotEmptyArray(editableItem[fieldName])) {
        video = editableItem[fieldName][0]
    }

    const isCollection = () =>{
        return field.type === 'videos'
    }

    const getVideos = (videosList: any) => {
        const list: any = []

        videosList.forEach((video: any, index: any) =>{
            const limit = isCollection() ? 5 : 1
            if(index < limit){
                const imageKey = 'video_' + index.toString()

                list.push((
                    <img
                        key={video.id}
                        className={`${styles.video} ${styles[imageKey]}`}
                        alt={''}
                        src={video.thumbnail}
                        onClick={() => onOpenSelectMediaAdminScreen(fieldName, undefined, field.type)}
                    />
                ))
            }
        })

        return list
    }

    const deleteItem = (e: any) => {
        e.stopPropagation()

        const value = convertValueForEditorFormat('')
        onChangeItem(value, fieldName)
    }

    return (
        <div className={styles.videoPickerWrapper}>
            {editableItem[fieldName] && editableItem[fieldName].length ? (
                <div className={styles.videoWrapper}>
                    {getVideos(editableItem[fieldName])}
                </div>
            ) : null}
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    onOpenSelectMediaAdminScreen(fieldName, undefined, field.type)
                }}
                className={styles.button}
            >
                {translate(isCollection() ? 'selectVideoFolder' : 'selectVideo')}
            </div>
            {editableItem[fieldName] && editableItem[fieldName].length ? (
                <DeleteButton onClick={deleteItem} className={styles.deleteButtonClassName}/>
            ) : null}
        </div>
    )
};

export {VideoPicker}
