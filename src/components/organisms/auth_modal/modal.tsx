import React, {FunctionComponent} from 'react';
import { ModalProps } from './modal-types';

import styles from './modal.module.scss'

const Modal: FunctionComponent<ModalProps> = ({ 
    open, 
    children, 
    onClose, 
    showCloseIcon, 
    modalControls, 
    title, 
    modalTitleControls, 
    wrapperClassName, 
    contentClassName 
}) => {
    if (!open) {
        return null
    }

    return (
        <div className={`${styles.modalWrapper} ${wrapperClassName}`}>
            <div className={styles.modal}>
                <div className={styles.modalTitle}>
                    {title}
                    
                    {
                        modalTitleControls && <div className={styles.modalTitleControls}>
                            {modalTitleControls}
                        </div>
                    }

                    {showCloseIcon &&
                        <div className={styles.modalClose} onClick={onClose}>×</div>
                    }
                </div>

                <div className={`${styles.modalContent} ${contentClassName}`}>
                    {children}
                </div>

                <div className={styles.modalControls}>
                    {modalControls}
                </div>
            </div>
        </div>
    );
};

export {Modal}
