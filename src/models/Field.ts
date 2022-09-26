import { WidgetControlType } from "./WidgetControlType";

export type Field = {
    name: string
    label?: string
    type?: WidgetControlType
    toolbar?: object
    currencyList?: any

    selectOptions?: any[]
    advanced?: any
}