import React, {FunctionComponent, useContext} from 'react';
import {Select} from "../select";
import {AppContext} from "../../../app/app";
import {Localisation} from "../../../models/localisation";
import {ICommonUI} from "../widgetEditorUI-types";
import {ChangeItemFunc} from "../../widgetEditor-types";
import {convertValueForEditorFormat} from "sp_widget_core";

interface IWidgetLocaleComponent extends ICommonUI {
    onChangeItem: ChangeItemFunc
}

type SelectOption = {
    value: Localisation
    label: string
}

const options: SelectOption[] = [
    {value: 'en', label: 'English'},
    {value: 'ru', label: 'Русский'},
    {value: 'pt', label: 'Португальский'},
    {value: 'es', label: 'Испанский'}
]

const WidgetLocale: FunctionComponent<IWidgetLocaleComponent> = ({field, editableItem, onChangeItem}) => {
    const {onLocaleChanged} = useContext(AppContext)
    const value = editableItem[field.name]

    const changeLocalisation = (option: SelectOption) => {
        onChangeItem(convertValueForEditorFormat(option.value), field.name)
        onLocaleChanged(option.value)
    }

    return (
        <div>
            <Select
                field={field}
                options={options}
                value={value}
                onChange={changeLocalisation}
                editableItem={editableItem}
            />
        </div>
    );
};

export {WidgetLocale}
