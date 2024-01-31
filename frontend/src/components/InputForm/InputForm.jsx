import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    const { ...rests } = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return (
        <WrapperInputStyle value={props.value} {...rests} onChange={handleOnchangeInput} />
    )
}

export default InputForm