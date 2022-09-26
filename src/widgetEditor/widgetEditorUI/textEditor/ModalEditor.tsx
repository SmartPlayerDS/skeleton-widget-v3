import React, {FC, useEffect, useState} from 'react';
import styles from './textEditor.module.scss'
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import {translate} from "sp_widget_core";

interface IModalEditor{
    value: string
    toolbar?: object
    setValue: any
    onClose: any
}

export const ModalEditor: FC<IModalEditor> = ({value, setValue, onClose, toolbar})=>{
    const blocksFromHtml = htmlToDraft(value);
    const {contentBlocks, entityMap} = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState))

    useEffect(()=>{
        const textHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))

        setValue(textHTML)
    }, [editorState])

    return (
        <div className={styles.modalEditor}>
            <div className={styles.modalContent}>
                <Editor
                    editorState={editorState}
                    toolbarClassName={`${styles.toolbar}`}
                    wrapperClassName={`${styles.wrapper}`}
                    editorClassName={`${styles.editor}`}
                    onEditorStateChange={(e) => {
                        setEditorState(e)
                    }}
                    toolbar={toolbar}
                />
                <div className={styles.button} onClick={onClose}>
                    {translate('closeEditor')}
                </div>
            </div>
        </div>
    )
}