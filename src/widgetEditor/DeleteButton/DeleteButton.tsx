import React from "react";

export const DeleteButton = ({onClick, className}: any) =>{
    return (
        <div
            className={className}
            onClick={onClick}
        >
            <img src={'images/delete_icon.svg'} />
        </div>
    )
}