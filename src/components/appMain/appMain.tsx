import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {Auth} from "../../models/Auth";
import {DatabaseProvider} from "../../database/databaseProvider";
import {Logger} from "sp_widget_core";
import { AuthContext } from '../AuthContext';
import {TestComponent} from "../TestComponent/TestComponent";

interface IAppMainComponent {
    clientProvider?: any
    database?: DatabaseProvider
    auth?: Auth
    widgetOptions?: any
    isAdmin: boolean
    widgetOptionsTemp: any
}

const logger = Logger()

const AppMain: FunctionComponent<IAppMainComponent> = ({widgetOptionsTemp, clientProvider, database, auth, widgetOptions, isAdmin}) => {
    useEffect(() => {
        const subscribeToEvents = () => {
            if (clientProvider) {
                clientProvider.setListeners([
                    {listenerType: "timeoutCallback", listenerMethod: onTimeoutCallback}
                ])
            }
        }
        subscribeToEvents()

        return () => {
            if (clientProvider) {
                clientProvider.clearListeners()
            }
        }
    }, [clientProvider])

    const authContext = useMemo(() => {
        return {
            isAdmin
        }
    }, [isAdmin])

    if (!clientProvider) {
        return null
    }

    const onTimeoutCallback = (data: any) => {
        logger.log(data)
    }

    clientProvider.setTimeoutUser(5000)

    const isEmpty = (obj: {}) => {
        return Object.keys(obj).length === 0;
    }

    return (
        <div style={{height: '100%'}} id={'appMain'}>
            <AuthContext.Provider value={authContext}>
                <TestComponent
                    settings={!isEmpty(widgetOptionsTemp) ? widgetOptionsTemp : widgetOptions.settings}
                />
            </AuthContext.Provider>
        </div>
    );
};

export {AppMain}
