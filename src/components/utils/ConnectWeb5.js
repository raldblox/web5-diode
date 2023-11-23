"use client"

import { Context } from '@/providers/ContextManager';
import React, { useContext } from 'react'
import SpecialLink from './SpecialLink';

const ConnectWeb5 = () => {
    const { web5, setWeb5, userDid, connectAccount, connecting, setConnecting, disconnectAccount } = useContext(Context);

    return (
        <div className='flex'>
            {userDid ?
                <div className='flex flex-col items-center justify-between w-full gap-2 md:gap-4 md:flex-row'>
                    <div className='w-full'>
                        <SpecialLink title="WEB5" desc={`${userDid.slice(0, 15)}...${userDid.slice(-5)}`} />
                    </div>
                    <button onClick={disconnectAccount} className='text-xs uppercase hover:text-red-500'>
                        Disconnect
                    </button>
                </div> :
                <button onClick={connectAccount} className='w-full px-4 py-2 btn'>Connect to Web5</button>
            }
        </div>
    )
}

export default ConnectWeb5