import React, {FunctionComponent} from 'react';
import {ChangeItemFunc} from "../../widgetEditor-types";
import {ICommonUI} from "../widgetEditorUI-types";

import styles from './input.module.scss';

interface IInputComponent extends ICommonUI {
    type?: string
    onChangeItem: ChangeItemFunc
    value?: string
}

const Input: FunctionComponent<IInputComponent> = ({value, field, editableItem, onChangeItem, type = 'text'}) => {
    const fieldName = field.name
    let disabled = false
    if (field.advanced) {
        disabled = !!field.advanced.disabled
    }

    return (
        <input
            id={fieldName}
            type={type}
            value={value}
            onChange={(e) => onChangeItem(e, fieldName)}
            className={styles.input}
            disabled={disabled}
            autoComplete={'off'}
        />
    );
};

export {Input}
