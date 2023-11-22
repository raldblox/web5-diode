"use client"

import Image from 'next/image'
import { useState } from 'react'

export default () => {

    const [state, setState] = useState(false)

    const navigation = [
        { title: "Features", path: "" },
        { title: "Integrations", path: "" },
        { title: "Customers", path: "" },
        { title: "Pricing", path: "" }
    ]

    return (
        <nav className="border-b z-50 max-h-16 sticky top-0 w-full md:text-sm md:border-none uppercase">
            <div className="items-center px-4 max-w-screen-2xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <a href="">
                        <Image
                            src="/branding/diode_wht.svg"
                            width={90}
                            height={40}
                            alt="Diode Logo"
                        />
                    </a>
                    <div className="md:hidden">
                        <button className=""
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
                <div className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}>
                    <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
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
                        <div className='space-y-3 items-center gap-x-4 md:flex md:space-y-0'>
                            <li>
                                <button href="" className="block px-6 py-2 btn">
                                    Log in
                                </button>
                            </li>
                            <li>
                                <button href="" className="block px-6 py-2 xbtn md:inline">
                                    Sign in
                                </button>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}