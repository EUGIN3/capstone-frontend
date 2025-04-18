import React from "react";
import "../styles/ButtonStyle.css"

export default function ButtonElement(props) {
    const {label, variant, type} = props

    return (
        <>
            <button className={variant} type={type}>{label}</button>
        </>
    );
}
