import React from 'react'

const SpecialLink = ({ title, desc }) => {
    return (
        <div className='inline-flex items-center w-full p-1 pr-2 text-sm font-medium duration-150 border rounded-full border-zinc-600 gap-x-2 hover:bg-zinc-800'>
            <span className='inline-block px-3 py-1 text-black rounded-full bg-[#50ff00]'>
                {title}
            </span>
            <p className='flex items-center '>
                {desc}
            </p>
        </div>
    )
}

export default SpecialLink