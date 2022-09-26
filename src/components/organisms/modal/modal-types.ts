export interface ModalProps {
    open: boolean
    onClose: () => void
    showCloseIcon: boolean
    className?: string
    wrapperClassName?: string
    contentClassName?: string
    modalControls?: any[],
    modalTitleControls?: JSX.Element | JSX.Element[]
    title: string
    appMainProps?: any
}
