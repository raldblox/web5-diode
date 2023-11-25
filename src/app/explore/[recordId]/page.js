"use client"

import Container from '@/components/Container'
import React, { useContext, useEffect, useState } from 'react'
import { webcrypto } from "node:crypto";
import { Context } from '@/providers/ContextManager';

export default ({ params }) => {
    const { userDid, web5 } = useContext(Context);
    const [newInput, setNewInput] = useState('');
    const [records, setRecords] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [profile, setProfile] = useState({
        name: '',
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
        setFetching(true);
        if (!web5) { return }
        const getPerson = async () => {
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
                    wallet: userProfile[0].identifier,
                    name: userProfile[0].additionalName
                });

            } catch (error) {
                console.error('Error fetching:', error);
            }
            // setTimeout(() => {
            //     setFetching(false);
            // }, 5000);
            setFetching(false);
        }
        getPerson()
    }, [web5])

    return (
        <Container className="flex w-full items-center py-[15vh] justify-center min-h-[calc(100vh-120px)]">
            <section className="w-full max-w-md ">
                <div className="flex w-full flex-col items-start justify-between px-6 p-4 md:p-8 md:px-12 border shadow-2xl border-zinc-800 bg-[#181818] rounded-3xl">
                    <div className=''>
                        {fetching && !profile.name ?
                            <div className='animate-spin text-white'>
                                <svg className='h-8' width="20" height="20" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0FF00" d="M.348.175a.15.15 0 0 0-.296 0H.027a.175.175 0 0 1 .346 0H.348z" />
                                </svg>
                            </div> :
                            <h1 className='text-3xl xtext text-bold'>diode:{profile.name}</h1>
                        }
                        <h5 className='font-bold text-lg'>{profile.fullName}</h5>
                        <h5>{profile.email}</h5>
                        <ul className='flex flex-wrap gap-2 mt-5'>
                            {profile?.orgs?.map((org, idx) => (
                                <li key={idx} className='rounded-full text-xs bg-zinc-800 py-1 border border-zinc-700 px-2'>{org.name}</li>
                            ))}
                        </ul>
                    </div>

                    <ul className='flex flex-col gap-2 mt-10 w-full'>
                        {profile?.links?.map((link, idx) => (
                            <a key={idx} href={link} target='_blank'
                                className='rounded-md text-center w-full p-2 text-sm py-2 border border-zinc-700 px-2'>
                                {link}
                            </a>
                        ))}
                    </ul>
                </div>
            </section>
        </Container>
    )
}