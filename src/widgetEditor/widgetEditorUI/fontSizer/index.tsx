import React, {FunctionComponent} from 'react';
import styles from "./fontSizer.module.scss";

const FontSizer: FunctionComponent<any> = ({field, editableItem, onChangeItem}) => {
    const fieldName = field.name;
    const value = editableItem[fieldName];

    return (
        <div className={styles.fontSizer}>
            <input
                id={fieldName}
                type={'range'}
                value={value}
                min={0}
                max={100}
                step={1}
                onChange={(e) => onChangeItem(e, fieldName)}
                className={styles.input}
            />
            <input
                id={fieldName}
                type={'number'}
                value={value}
                onChange={(e) => onChangeItem(e, fieldName)}
                className={styles.input}
            />
        </div>
    );
};

export {FontSizer}
