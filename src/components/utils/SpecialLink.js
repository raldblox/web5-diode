import React from 'react'

const SpecialLink = () => {
    return (
        <a href="" className='inline-flex gap-x-6 items-center rounded-full p-1 pr-6 border text-sm font-medium duration-150 hover:bg-white'>
            <span className='inline-block rounded-full px-3 py-1 bg-indigo-600 text-white'>
                News
            </span>
            <p className='flex items-center'>
                Read the launch post from here
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
            </p>
        </a>
    )
}

export default SpecialLink