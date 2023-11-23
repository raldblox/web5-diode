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
        <Container classname="min-h-screen grid content-center">
            <section className="h-screen grid content-center">
                <div className="max-w-screen-lg grid w-full mx-auto px-4 gap-16 overflow-hidden md:px-8">
                    {checking ? "Checking..." :
                        <>
                            {validName ?
                                <div className='grid space-y-10 max-w-2xl'>
                                    <h1 className="text-xl font-bold font-mono sm:text-3xl">
                                        Name is valid.
                                    </h1>
                                </div>
                                :
                                <div className='grid space-y-10 max-w-2xl'>
                                    <h1 className="text-xl font-bold font-mono sm:text-3xl">
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