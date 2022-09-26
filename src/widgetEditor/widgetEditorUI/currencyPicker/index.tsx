import React, {FC} from 'react'
import styles from './currencyPicker.module.scss'
import {Select} from "../select";
import {translate} from "sp_widget_core";

interface ICurrencyPicker {
    onChange: any
    field: any
    editableItem: any
}

export const CurrencyPicker: FC<ICurrencyPicker> = ({field, onChange, editableItem}) => {
    const list = field.currencyList
    const fieldName = field.name
    const item = editableItem[fieldName]

    const createCurrencyItem = () => {
        if(list.length < 2) return

        const updatedItem = [
            ...item,
            {
                id: item.length + 1,
                from: list[0].value,
                to: list[1].value,
            }
        ]

        onChange({
            target: {
                value: updatedItem
            }
        }, fieldName)
    }

    const getCurrencyList = (currencyType: string, id: number) => {
        if (!item) return list

        if (currencyType === 'from') {
            return list.filter((element: any) => {
                const from = element.value
                return item.find((element: any) => element.id === id).to !== from
            })
        }
        if (currencyType === 'to') {
            return list.filter((element: any) => {
                const to = element.value
                return item.find((element: any) => element.id === id).from !== to
            })
        }

        return []
    }

    const changeCurrency = (e: any, currencyType: string, id: number) => {
        let changedItem: any;

        if (currencyType === 'from'){
            changedItem = item.map((element: any) => {
                if(id === element.id){
                    return {
                        ...element,
                        from: e.value
                    }
                }

                return element
            })
        }

        if (currencyType === 'to'){
            changedItem = item.map((element: any) => {
                if(id === element.id){
                    return {
                        ...element,
                        to: e.value
                    }
                }

                return element
            })
        }

        onChange({
            target: {
                value: {
                    changedItem
                }
            }
        }, fieldName)
    }

    return (
        <div className={styles.currencyPickerWrapper}>
            {item && item.map((element: any) => (
                <div className={`${styles.currencyPair} ${styles.overlay}`} key={element.id}>
                    <Select
                        options={getCurrencyList('from', element.id)}
                        value={element.from}
                        onChange={(e: any)=> changeCurrency(e, 'from', element.id)}
                        field={{
                            type: 'multiselect',
                        }}
                        editableItem={null}
                    />
                    <img src={'/images/arrow.svg'}/>
                    <Select
                        options={getCurrencyList('to', element.id)}
                        value={element.to}
                        onChange={(e: any)=> changeCurrency(e, 'to', element.id)}
                        editableItem={null}
                        field={{
                            type: 'multiselect',
                        }}
                    />
                </div>
            ))}
            {list.length > 1 && (
                <div className={styles.currencyPair}>
                    <div
                        className={styles.fakeField}
                        onClick={createCurrencyItem}
                    >
                        <img src={'/images/plus.svg'}/>
                    </div>
                    <img src={'/images/arrow.svg'} style={{opacity: 0.3}}/>
                    <div className={styles.fakeField}/>
                </div>
            )}
        </div>
    )
}