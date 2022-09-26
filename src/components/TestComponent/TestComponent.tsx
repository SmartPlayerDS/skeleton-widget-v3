import React from "react";
import {translate} from "sp_widget_core";
import styles from './index.module.scss';

export const TestComponent = ({settings}: any) =>{
    return (
        <div className={styles.testWrapper} style={{backgroundColor: settings.widgetBackgroundColor}}>
            {translate('helloWorld')}
        </div>
    )
}