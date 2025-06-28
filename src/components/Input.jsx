import React from 'react'

function Input({
    placeholder="",
    className="",
    ...props
}) {
  return (
    <div>
        <input type="text" placeholder={placeholder} className={`${className}`} {...props} />
        <button></button>
    </div>
  )
}

export default Input