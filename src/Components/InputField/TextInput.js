import React from "react";
import classes from './TextInput.module.css'

import PropTypes from 'prop-types';
const TextInput=(props)=>{
    // const [showMessage, setShowMessage]=React.useState(false)
    const handleChange=(e)=>{
        console.log(e.target.value)
        const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (e.target.value === '' ||floatRegExp.test(e.target.value)) {
            
            
        
            props.setChange(e.target.value)
         }
         

        // setChange(e.target.value)
        
    }
   
    return(
        <div>
        <div className={`${classes.inputContainer}`}>
      <input
        type={props.type}
        value={props.value}
        onChange={handleChange}
        disabled={props.disabled&&props.disabled}
        onkeypress="return isNumberKey(event);"
         />
      <label className='filled' htmlFor={props.label}>
        {props.label}
      </label>
      
    </div>
    {!props.disabled &&
    <div>
    {/* {parseInt(value)>=0 ?<></>:<p>Enter only numbers</p>} */}
    <p>Enter only numbers</p>
    </div>
        }
    </div>

    )
}
TextInput.propTypes={
    type:PropTypes.string,
    label:PropTypes.string,
    value:PropTypes.number,
    setChange:PropTypes.func,
    disabled:PropTypes.bool,
}
export default TextInput