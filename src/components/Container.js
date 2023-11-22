import React from 'react'

const Container = ({ classname, children }) => {
    return (
        <div className={`${classname} `}>
            {children}
        </div>
    )
}

export default Container