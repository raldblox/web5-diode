"use client"

import Container from '@/components/Container'
import React, { useContext, useEffect, useState } from 'react'
import { webcrypto } from "node:crypto";
import { Context } from '@/providers/ContextManager';

export default ({ params }) => {
    const { userDid, lockedName, web5 } = useContext(Context);
    const [newInput, setNewInput] = useState('');
    const [records, setRecords] = useState([]);
    const [fetching, setFetching] = useState(false);

    const [profile, setProfile] = useState({
        name: lockedName,
        fullName: '',
        bio: '',
        email: '',
        wallet: '',
        role: '',
        orgs: [],
        links: [],
        creds: []
    });

    const schema = {
        "context": 'https://schema.org/',
        "type": 'Person',
        get uri() { return this.context + this.type; }
    }

    // Function to fetch profile
    useEffect(() => {
        if (!web5) { return }
        const getPerson = async () => {
            setFetching(true);
            const recordID = params.recordId;
            console.log("Fetching Profile", recordID)
            try {
                const { record: profile } = await web5.dwn.records.read({
                    message: {
                        filter: {
                            recordId: recordID
                        }
                    },
                });

                const userProfile = await profile.data.json();
                console.log("record", userProfile[0]);
                setProfile({
                    email: userProfile[0].email,
                    role: userProfile[0].jobTitle,
                    fullName: userProfile[0].name,
                    bio: userProfile[0].disambiguatingDescription,
                    links: userProfile[0].url,
                    orgs: userProfile[0].affiliation,
                    wallet: userProfile[0].identifier
                });

            } catch (error) {
                console.error('Error fetching:', error);
            }
            setTimeout(() => {
                setFetching(false);
            }, 5000);
        }
        getPerson()
    }, [web5])

    return (
        <Container className="flex w-full items-center justify-center min-h-screen">
            <section className="w-full max-w-screen-md">
                <div className="min-h-screen py-10 md:py-20" id="dashboard">
                    <section className="relative ">
                        <ul className="flex items-center px-5 md:justify-center mx-auto overflow-x-auto">
                            <li className={`py-2 duration-150 border-b-4 border-[#d0ff00] text-white `}>
                                <div
                                    className={`flex uppercase items-center text-xs md:text-sm px-4 py-2 font-medium rounded-lg gap-x-2 hover:bg zinc-800 active:bg-zinc-700`}
                                >
                                    {fetching ?
                                        <div className='animate-spin text-white'>
                                            <svg className='h-8' width="20" height="20" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0FF00" d="M.348.175a.15.15 0 0 0-.296 0H.027a.175.175 0 0 1 .346 0H.348z" />
                                            </svg>
                                        </div> :
                                        <>{profile?.fullName}</>}
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </section>
        </Container>
    )
}