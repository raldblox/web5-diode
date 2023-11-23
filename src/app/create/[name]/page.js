"use client"

import Container from '@/components/Container'
import SignIn from '@/components/forms/SignIn'
import IsNameRegistered from '@/components/utils/IsNameRegistered'
import React, { useEffect, useState } from 'react'

const page = ({ params }) => {
    const [validName, setValidName] = useState(false);
    const [checking, setChecking] = useState(null);
    const [signIn, showSignIn] = useState(false);

    useEffect(() => {
        setChecking(true);
        const registeredNames = ["raldblox"];
        const valid = async () => {
            if (registeredNames.includes(params.name)) {
                setValidName(false);
            } else {
                setValidName(true);
            }

            setTimeout(() => {
                setChecking(false);
                setTimeout(() => {
                    showSignIn(true);
                }, 3000);
            }, 1000);
        }
        valid();
    }, [])

    return (
        <Container classname="flex items-center justify-center min-h-screen">
            {signIn ? <section className="w-full max-w-md"><SignIn name={validName ? params.name : ""} /> </section> :
                <div className="grid w-full max-w-screen-lg gap-16 px-4 mx-auto overflow-hidden font-mono text-xl text-white md:text-3xl md:px-8">
                    {checking ? "Checking names..." :
                        <>
                            {validName ?
                                <div className='grid max-w-2xl space-y-10'>
                                    <h1 className="font-bold text-green-500">
                                        Name is valid. Let's own it!
                                    </h1>
                                </div>
                                :
                                <div className='grid max-w-2xl space-y-10'>
                                    <h1 className="font-bold text-red-500">
                                        Name already registered.
                                    </h1>
                                </div>

                            }
                        </>
                    }
                </div>
            }
        </Container>
    )
    //

}

export default page