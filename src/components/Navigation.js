"use client"

import { Context } from '@/providers/ContextManager'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'

export default () => {
    const { name, userDid, connecting, connectAccount, lockedName } = useContext(Context);

    const [state, setState] = useState(false)
    const [hidden, setHidden] = useState(false)

    const navigation = [
        { title: "Features", path: "" },
        { title: "DiodeNS", path: "" },
        { title: "Customers", path: "" },
        { title: "Pricing", path: "" }
    ]

    useEffect(() => {
        if (!name) { return }
        setTimeout(() => {
            setHidden(true);
        }, 6000);
    }, [name, lockedName, hidden])


    return (
        <nav className="sticky top-0 z-50 w-full uppercase h-[50px] md:text-sm">
            <div className={`items-center px-4 mx-auto max-w-screen-2xl md:flex md:px-8 ${state ? 'bg-[#161616]' : 'bg-transparent'}`}>
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <Link href="/">
                        <Image
                            src="/branding/diode_wht.svg"
                            width={90}
                            height={40}
                            alt="Diode Logo"
                        />
                    </Link>
                    <div className="md:hidden">
                        <button className="text-sm"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (
                                    "CLOSE"
                                ) : (
                                    "MENU"
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 mt-8 py-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}>
                    <ul className="items-center justify-end space-y-5 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className="">
                                        <a href={item.path} className="block">
                                            {item.title}
                                        </a>
                                    </li>
                                )
                            })
                        }
                        <span className='hidden w-px h-6 bg-gray-500 md:block'></span>
                        <div className='items-center space-y-3 gap-x-4 md:flex md:space-y-0'>
                            {name && <li>
                                <button onClick={(e) => setHidden(!hidden)} className={`block px-6 py-2 xbtn ${!hidden && "animate-pulse"}`}>
                                    {name || lockedName}
                                </button>
                            </li>}
                            {!hidden &&
                                <li>
                                    <button onClick={connectAccount} className="block px-6 py-2 btn md:inline">
                                        {userDid ? <>{userDid.slice(0, 13)}...{userDid.slice(-5)}</> : <>{connecting ? "Connecting" : "Sign In"}</>}
                                    </button>
                                </li>}
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}