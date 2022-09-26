import React, {FC, useEffect, useState} from 'react';
import {ChangeTextFunc} from '../../widgetEditor-types';
import {ICommonUI} from "../widgetEditorUI-types";
import styles from './textEditor.module.scss'
import {ModalEditor} from "./ModalEditor";

interface ITextEditor extends ICommonUI{
    onChangeText: ChangeTextFunc
}

const TextEditor: FC<ITextEditor> = ({field, editableItem, onChangeText}) => {
    const fieldName = field.name
    const [value, setValue] = useState(editableItem[fieldName])
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleOpen = () => {
        setIsOpen(true)
    }

    useEffect(()=>{
        onChangeText(value, fieldName)
    }, [value])

    return (
        <>
            <div
                className={styles.preview}
                onClick={handleOpen}
                dangerouslySetInnerHTML={{__html: value ? value : ''}}
            />
            {isOpen && (
                <ModalEditor
                    value={value ? value : ''}
                    setValue={setValue}
                    onClose={handleClose}
                    toolbar={field.toolbar}
                />
            )}
        </>
    )
};

export {TextEditor}
