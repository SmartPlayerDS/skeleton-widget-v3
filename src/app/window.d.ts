export declare global {
    interface Window { settings: any; }

    interface Window {
        settings: any
        authorization: any
        events: any
        ['skeleton-widget-v3']: any

        DetectOS: any

        // events
        onDownload: any
        listenerBarCodeUpdated: any
        onAuthorization: any
        timeoutCallback: any

        // qt, android methods
        getAuthorization: any
        setTimeoutUser: any

        // android
        AndroidJsInterface: any
    }
}

window.settings = window.settings || {};