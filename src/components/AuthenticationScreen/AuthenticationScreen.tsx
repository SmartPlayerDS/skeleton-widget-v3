import React, { FC, useState } from 'react'
import { Modal } from '../organisms/auth_modal/modal'
import styles from './AuthenticationScreen.module.scss'
import jsSHA from "jssha"
import { translate } from 'sp_widget_core'

export interface AuthenticationScreenProps {
    isOpen: boolean
    onClose: () => void
    onOpen: () => void
    onAuth: () => void
}

export const AuthenticationScreen: FC<AuthenticationScreenProps> = ({
    isOpen,
    onClose,
    onOpen,
    onAuth
}) => {
    const [value, setValue] = useState<string>('');
    const [isError, setError] = useState<boolean>(false)

    const clear = () => {
        setValue('')
        setError(false)
    }

    const createHash = (val: string) => {
        const shaFactory = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
        shaFactory.update(val)

        return shaFactory.getHash('HEX')
    }

    const isValidHash = (hash: string) => process.env.REACT_APP_PIN_CODE === hash

    const renderModalControls = () => {
        return (
            [
                <button
                    className={styles.AuthenticationScreen__submit}
                    type={'button'}
                    key={'submitButton'}
                    onClick={handleSubmit}
                >
                    {translate('login')}
                </button>
            ]
        )
    }

    const renderButton = () => {
        return <button className={styles.AuthenticationScreen__button} onClick={onOpen}>
            <img src="./images/user.svg" alt="" />
        </button>
    }

    const renderTitle = () => translate('authenticationScreen')
    
    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isValidHash(createHash(value))) {
            setError(true);
            return;
        }

        onAuth()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setValue(e.target.value)
    }

    const handleClose = () => {
        onClose()
        clear()
    }

    const renderModal = () => {
        return <div className={styles.AuthenticationScreen}>
            <Modal
                open={true}
                title={renderTitle()}
                showCloseIcon={true}
                onClose={handleClose}
                wrapperClassName={styles.AuthenticationScreen__modal}
                contentClassName={styles.AuthenticationScreen__content}
                modalControls={renderModalControls()}
            >
                <div className={styles.AuthenticationScreen__form}>
                    <input type="text" onChange={handleChange} value={value} className={styles.AuthenticationScreen__input} />
                    { isError && <div className={styles.AuthenticationScreen__error}>{translate('pinCodeError')}</div> }
                </div>
            </Modal>
        </div>
    }

    return isOpen ? renderModal() : renderButton()
}