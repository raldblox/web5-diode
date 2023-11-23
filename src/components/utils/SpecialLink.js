import React from 'react'

const SpecialLink = ({ title, desc }) => {
    return (
        <div className='inline-flex items-center w-full p-1 pr-2 text-sm font-medium duration-150 border rounded-full border-zinc-600 gap-x-2 hover:bg-zinc-800'>
            <span className='inline-block px-3 py-1 text-black rounded-full bg-[#50ff00]'>
                {title}
            </span>
            <p className='flex items-center '>
                {desc}
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg> */}
            </p>
        </div>
    )
}

export default SpecialLink