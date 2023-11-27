import { Context } from '@/providers/ContextManager';
import Link from 'next/link'
import React, { useContext, useState } from 'react'

const DiodeLink = () => {
    const { setName, name, lockedName, connectAccount, connecting, userDid } = useContext(Context);

    return (
        <div className='grid items-center w-full text-sm font-medium duration-150 border md:inline-flex md:w-fit rounded-xl'>
            <div className='flex items-center px-3 py-3 text-base'>
                <label>diode:</label>
                <input value={userDid} className='w-full h-full bg-transparent border-none outline-none' />
            </div>
            {userDid ?
                <Link href="/manage" className='flex items-center justify-center px-4 py-2 m-1 text-center uppercase md:whitespace-nowrap xbtn'>
                    Manage
                </Link> :
                <button onClick={connectAccount} className='flex items-center justify-center px-4 py-2 m-1 text-center uppercase xbtn'>
                    {connecting ? "Connecting" : "Create DID"}
                </button>}
        </div>
    )
}

export default DiodeLink