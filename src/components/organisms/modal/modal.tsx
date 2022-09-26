import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import { ModalProps } from './modal-types';

import styles from './modal.module.scss'
import {AppMain} from "../../appMain/appMain";

const Modal: FunctionComponent<ModalProps> = ({ 
    open, 
    children, 
    onClose, 
    showCloseIcon, 
    modalControls, 
    title, 
    modalTitleControls, 
    wrapperClassName, 
    contentClassName ,
    appMainProps
}) => {
    const [scaleValue, setScaleValue] = useState(0)
    const previewContentRef = useRef<any>(null)

    useEffect(()=> {
        const element = document.getElementById('appMain')

        if(element && previewContentRef){
            const child = element.firstChild

            if(child && previewContentRef.current){
                //@ts-ignore
                const childWidth: number = child.offsetWidth
                const previewWidth: number = previewContentRef.current.offsetWidth

                if(childWidth > previewWidth){
                    const scaleValue = (previewWidth - 40) / childWidth

                    setScaleValue(scaleValue)
                }
            }
        }
    })

    if (!open) {
        return null
    }

    return (
        <div className={`${styles.modalWrapper} ${wrapperClassName}`}>
            <div className={styles.modal}>
                {showCloseIcon &&
                    <div className={styles.modalClose} onClick={onClose}>
                        <img src={'images/modal_close.svg'} />
                    </div>
                }
                <div className={styles.leftBlock}>
                    <div className={`${styles.modalContent} ${contentClassName}`}>
                        {children}
                    </div>
                </div>
                <div
                    className={styles.rightBlock}
                >
                    <div
                        ref={previewContentRef}
                        className={styles.previewContainer}
                    >
                        <div

                            className={styles.previewContent}
                            style={{zoom: scaleValue}}
                        >
                            <AppMain
                                {...appMainProps}
                            />
                        </div>
                    </div>
                    <div className={styles.modalControls}>
                        {modalControls}
                    </div>
                </div>
            </div>
        </div>
    );
};

export {Modal}
