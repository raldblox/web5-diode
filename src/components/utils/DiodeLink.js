import { Context } from '@/providers/ContextManager';
import Link from 'next/link'
import React, { useContext, useState } from 'react'

const DiodeLink = () => {
    const { setName } = useContext(Context);
    const [input, setInput] = useState("/");

    return (
        <div className='grid items-center w-full text-sm font-medium duration-150 border md:inline-flex md:w-fit md:gap-x-2 rounded-xl'>
            <div className='flex items-center px-3 py-3 text-base'>
                <label>diode.digital/</label>
                <input onChange={(e) => setName(e.target.value)} className='bg-transparent max-w-[150px] h-full border-none outline-none' />
            </div>
            <Link href="/create" className='flex items-center px-4 py-2 m-1 text-center md:inline-flex group md:whitespace-nowrap xbtn'>
                Create Diode
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
            </Link>
        </div>
    )
}

export default DiodeLink