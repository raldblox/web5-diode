import React from 'react'

const Container = ({ className, children }) => {
    return (
        <div className={`${className} px-2 max-w-screen-2xl mx-auto md:px-8`}>
            {children}
        </div>
    )
}

export default Container