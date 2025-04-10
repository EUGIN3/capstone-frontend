import React from "react";
import "../styles/ButtonStyle.css"

export default function ButtonElement(props) {
    const {label, variant} = props

    return (
        <>
            <button className={variant}>{label}</button>
        </>
    );
}
