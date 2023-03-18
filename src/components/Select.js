import React, { Children } from 'react'

const Select = ({ label, name, defaultValue }, children) => {
    return (
        <>
            <label htmlFor={name}>{label}</label>
            <select name={name} id={name} defaultValue={defaultValue}>
                {children}
            </select>
        </>
    )
}

export default Select
