import { Field } from "../../models/Field";

export interface ICommonUI {
    field: Field
    editableItem: any
    className?: 'string'
    style?: object
    toolbar?: object
}