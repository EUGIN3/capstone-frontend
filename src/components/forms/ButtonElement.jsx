import React from "react";
import "../styles/ButtonStyle.css"

export default function ButtonElement(props) {
    const {label, variant, type, onClick } = props

    return (
        <>
            <button className={variant} type={type} onClick={onClick || undefined}>{label}</button>
        </>
    );
}