import { Context } from '@/providers/ContextManager';
import Link from 'next/link'
import React, { useContext, useState } from 'react'

const DiodeLink = () => {
    const { setName, name, lockedName } = useContext(Context);

    return (
        <div className='grid items-center w-full text-sm font-medium duration-150 border md:inline-flex md:w-fit md:gap-x-2 rounded-xl'>
            <div className='flex items-center px-3 py-3 text-base'>
                <label>diode.digital/</label>
                <input disabled={lockedName} value={name || lockedName} onChange={(e) => setName(e.target.value)} className='bg-transparent max-w-[150px] h-full border-none outline-none' />
            </div>
            {lockedName ?
                <Link href="/manage" className='flex items-center px-4 py-2 m-1 text-center md:whitespace-nowrap xbtn'>
                    Manage Diode
                </Link> :
                <Link href="/create" className='flex justify-center items-center px-4 py-2 m-1 text-center md:whitespace-nowrap xbtn'>
                    Create Diode
                </Link>}
        </div>
    )
}

export default DiodeLink