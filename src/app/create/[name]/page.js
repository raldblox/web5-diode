"use client"

import Container from '@/components/Container'
import IsNameRegistered from '@/components/utils/IsNameRegistered'
import React, { useEffect, useState } from 'react'

const page = ({ params }) => {
    const [validName, setValidName] = useState(false);
    const [checking, setChecking] = useState(null);

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
            }, 3000);
        }
        valid();
    }, [])

    return (
        <Container classname="grid content-center min-h-screen">
            <section className="grid content-center h-screen">
                <div className="grid w-full max-w-screen-lg gap-16 px-4 mx-auto overflow-hidden md:px-8">
                    {checking ? "Checking..." :
                        <>
                            {validName ?
                                <div className='grid max-w-2xl space-y-10'>
                                    <h1 className="font-mono text-xl font-bold sm:text-3xl">
                                        Name is valid.
                                    </h1>
                                </div>
                                :
                                <div className='grid max-w-2xl space-y-10'>
                                    <h1 className="font-mono text-xl font-bold sm:text-3xl">
                                        Name already registered.
                                    </h1>
                                </div>

                            }
                        </>
                    }

                </div>
            </section>
        </Container>
    )
    //

}

export default page