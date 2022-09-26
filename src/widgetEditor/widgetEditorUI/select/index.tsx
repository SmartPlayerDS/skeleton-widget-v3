import React, {useState, useEffect, FunctionComponent} from 'react'
import {translate, isExist} from "sp_widget_core";
import style from './select.module.scss'
import {Input} from "../input";

interface ISelectComponent {
    options: any[]
    value: any
    onChange: any
    valueName?: string
    labelName?:string
    field: any
    editableItem: any
}

const Select: FunctionComponent<ISelectComponent> = ({ field, editableItem, options, value, onChange, valueName = 'value', labelName = 'label' }) => {
    const DEFAULT_VALUE = translate('defaultValue');
    const INIT_LABEL = translate('selectValue');

    const getTitle = () => {
        let findOption = options.find(option => {
            return getOptionValueByName(option, valueName) === value
        });


        return isExist(findOption) ? getOptionValueByName(findOption, labelName) : INIT_LABEL;
    }

    const [inputValue, setInputValue] = useState(getOptionLabel(options, value))
    const [isSelectActive, setSelectStatus] = useState(false);

    const getOptionValueByName = (option: any, value: any) => {
        let valueChunks = value.split('.');
        let name;

        for (let i = 0; i < valueChunks.length; i ++) {
            let optionName: any = isExist(name) ? name[valueChunks[i]]: option[valueChunks[i]];

            if (isExist(optionName)) {
                name = optionName;
            } else {
                name = DEFAULT_VALUE;
                break;
            }
        }

        return name;
    }

    const changeOptionStatus = (val: any) => {
        let option = options.find((option: any) => getOptionValueByName(option, valueName) === val);
        setInputValue(option.label)
        setSelectStatus(false);
        onChange(option)
    }

    const handleClick = () => {
        if (!isSelectActive) {
            setSelectStatus(true);
            return;
        } 

        setSelectStatus(false);
    }

    const handleWindowClick = (e: any) => {
        let path = e.path;

        if (isExist(e.path)) {
            let isFindSelectWrapperClass = false;
            
            path.forEach((pathElement: any) => {
                let className = pathElement.className;

                if (isExist(className) && className.indexOf('selectWrapper') >= 0) {
                    isFindSelectWrapperClass = true;
                } 
            })

            if (!isFindSelectWrapperClass) {
                setSelectStatus(false);
            }
        }
    }

    function getOptionLabel(options: any, value: string){
        const option = options.find((option: any) => option.value === value)

        if(option){
            return option.label
        }

        return ''
    }

    useEffect(() => {
        window.addEventListener('click', handleWindowClick)
        return () => {
            window.removeEventListener('click', handleWindowClick)
        }
    }, [])

    const additionStyles = isSelectActive ? style.selectTitleActive : style.selectTitleDisable;

    return (
        <div
            className={`${style.selectWrapper} selectWrapper ${field.type === 'selectWithSearch' ? style.selectWithSearchWrapper : ''}`}
        >
            <div className={style.select}>
                <div className={`${style.selectTitle} ${additionStyles}`} onClick={handleClick}>
                    {field.type === 'selectWithSearch' ? (
                        <Input
                            field={field}
                            value={inputValue}
                            editableItem={editableItem}
                            onChangeItem={(e)=> {
                                setInputValue(e.target.value)
                            }}
                        />
                    ) : getTitle()}
                </div>

                {
                    isSelectActive ? 
                    (
                        <div className={style.selectOptionsWrapper}>
                            <div className={style.selectOptions}>
                                { field.type === 'selectWithSearch' ? options
                                    .filter(option => {
                                        return getOptionValueByName(option, valueName) !== DEFAULT_VALUE && option.label.toLowerCase().includes(inputValue.toLowerCase())
                                    })
                                    .map((option, index) => {
                                        return (
                                            <div
                                                key={getOptionValueByName(option, valueName)}
                                                className={style.selectOption}
                                                onClick={() => changeOptionStatus(getOptionValueByName(option, valueName))}
                                            >
                                                {getOptionValueByName(option, labelName)}
                                            </div>
                                        )
                                    }) : (
                                    options
                                        .filter(option => {
                                            return getOptionValueByName(option, valueName) !== DEFAULT_VALUE
                                        })
                                        .map((option, index) => {
                                            return (
                                                <div
                                                    key={getOptionValueByName(option, valueName)}
                                                    className={style.selectOption}
                                                    onClick={() => changeOptionStatus(getOptionValueByName(option, valueName))}
                                                >
                                                    {getOptionValueByName(option, labelName)}
                                                </div>
                                            )
                                        })
                                )
                                }
                            </div>
                        </div>
                    ): null
                }
            </div>
        </div>
    )
}

export { Select }