export default [
    {name: 'getAuthorization', method: 'getAuthorization'},
    {name: 'setTimeoutUser', method: 'setTimeoutUser', callback: (timeout: number): void => {
            window.setTimeoutUser(timeout)
        }},
    {name: 'timeoutCallback', listener: true},
    {name: 'getDeviceId'},
    {name: 'getDeviceHost'}
]