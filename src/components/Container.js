import React from 'react'

const Container = ({ classname, children }) => {
    return (
        <div className={`${classname} px-2 max-w-screen-2xl mx-auto md:px-8`}>
            {children}
        </div>
    )
}

export default Container