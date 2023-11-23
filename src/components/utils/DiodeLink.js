import Link from 'next/link'
import React, { useState } from 'react'

const DiodeLink = () => {
    const [input, setInput] = useState("/");
    return (
        <div className='md:inline-flex w-full md:w-fit grid md:gap-x-2 items-center rounded-xl border text-sm font-medium duration-150'>
            <div className='flex items-center px-3 py-3 text-base'>
                <label>diode.digital/</label>
                <input onChange={(e) => setInput(e.target.value)} className='bg-transparent max-w-[150px] h-full border-none outline-none' />
            </div>
            <Link href={`/create/${input}`} className='md:inline-flex group px-4 py-2 flex items-center text-center md:whitespace-nowrap xbtn m-1'>
                Create DiodeLink
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
            </Link>
        </div>
    )
}

export default DiodeLink