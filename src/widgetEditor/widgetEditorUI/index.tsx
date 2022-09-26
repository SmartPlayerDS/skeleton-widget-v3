import React from "react";
import {ChangeColorFunc, ChangeItemFunc, OpenSelectMediaFunc, ChangeTextFunc} from "../widgetEditor-types";
import {Input} from "./input";
import {ColorPicker} from "./colorPicker";
import {CheckBox} from "./checkBox";
import {FilePicker} from "./filePicker";
import {ImagePicker} from "./imagePicker";
import {VideoPicker} from "./videoPicker";
import {DateUI} from "./dateUI";
import {WidgetLocale} from "./widgetLocale";
import {Field} from "../../models/Field";
import {WidgetSelect} from "./widgetSelect/";
import {WidgetMultiselect} from "./widgetMultiselect";
import {Autocomplete} from "./autocomplete";
import {AudioPicker} from "./audioPicker";
import {TextEditor} from "./textEditor";
import {CurrencyPicker} from "./currencyPicker"
import {FontSizer} from "./fontSizer";

export class WidgetUI  {
    private readonly _onChangeItem: (e: any, fieldName: string) => void
    private readonly _onChangeColor: (color: any, fieldName: string) => void
    private readonly _onOpenSelectMediaAdminScreen: (fieldName: string) => void
    private readonly _onChangeText: (value: any, fieldName: string) => void

    constructor(
        onChangeItem: ChangeItemFunc,
        onChangeColor: ChangeColorFunc,
        onOpenSelectMediaAdminScreen: OpenSelectMediaFunc,
        onChangeText: ChangeTextFunc
    ) {
        this._onChangeItem = onChangeItem
        this._onChangeColor = onChangeColor
        this._onChangeText = onChangeText
        this._onOpenSelectMediaAdminScreen = onOpenSelectMediaAdminScreen
    }

    getUIComponentByEditable = (editable: any, field: Field) => {
        const editableItem = {...editable}

        switch (field.type) {
            case 'fontSize':
                return (
                    <FontSizer
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'color':
                return (
                    <ColorPicker
                        field={field}
                        editableItem={editableItem}
                        onChangeColor={this._onChangeColor}
                    />
                )
            case 'number':
                return (
                    <Input
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                        type={'number'}
                    />
                )
            case 'url': // now identical with default case
                return (
                    <Input
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'checkbox':
                return (
                    <CheckBox
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'fileFolder':
                return (
                    <FilePicker
                        field={field}
                        editableItem={editableItem}
                        onOpenSelectMediaAdminScreen={this._onOpenSelectMediaAdminScreen}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'image':
            case 'images':
                return (
                    <ImagePicker
                        field={field}
                        editableItem={editableItem}
                        onOpenSelectMediaAdminScreen={this._onOpenSelectMediaAdminScreen}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'video':
            case 'videos':
               return (
                    <VideoPicker
                        field={field}
                        editableItem={editableItem}
                        onOpenSelectMediaAdminScreen={this._onOpenSelectMediaAdminScreen}
                        onChangeItem={this._onChangeItem}
                    />
               )
            case 'audio':
            case 'audios':
                return (
                    <AudioPicker
                        field={field}
                        editableItem={editableItem}
                        onOpenSelectMediaAdminScreen={this._onOpenSelectMediaAdminScreen}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'date':
                return (
                    <DateUI
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'localisation':
                return (
                    <WidgetLocale
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'select':
            case 'selectWithSearch':
                return (
                    <WidgetSelect
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'multiselect':
                return (
                    <WidgetMultiselect
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'autocomplete':
                return (
                    <Autocomplete
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
            case 'textEditor':
                return (
                    <TextEditor
                        field={field}
                        editableItem={editableItem}
                        onChangeText={this._onChangeText}
                    />
                )
            case 'currency':
                return (
                    <CurrencyPicker
                        field={field}
                        editableItem={editableItem}
                        onChange={this._onChangeItem}
                    />
                )
            default:
                return (
                    <Input
                        field={field}
                        editableItem={editableItem}
                        onChangeItem={this._onChangeItem}
                    />
                )
        }
    }
}
