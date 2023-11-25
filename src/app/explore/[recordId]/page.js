"use client"

import Container from '@/components/Container'
import React, { useContext, useEffect, useState } from 'react'
import { webcrypto } from "node:crypto";
import { Context } from '@/providers/ContextManager';
import SpecialLink from '@/components/utils/SpecialLink';

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
        <Container className="flex w-full items-center py-[10vh] justify-center min-h-[calc(100vh-120px)]">
            <section className="w-full max-w-md ">
                <div className="flex w-full aspect-square flex-col items-start justify-between px-6 p-4 md:p-8 md:px-12 border shadow-2xl border-zinc-800 bg-[#181818] rounded-3xl">
                    <div className=''>
                        {fetching && !profile.name ?
                            <div className='text-white animate-spin'>
                                <svg className='h-8' width="20" height="20" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0FF00" d="M.348.175a.15.15 0 0 0-.296 0H.027a.175.175 0 0 1 .346 0H.348z" />
                                </svg>
                            </div> :
                            <h1 className='text-2xl font-bold md:text-3xl xtext'>diode:{profile.name}</h1>
                        }

                        <h5 className='text-lg font-semibold uppercase'>{profile.fullName}</h5>
                        <h5 className='text-sm text-zinc-500'>{profile.email}</h5>

                        {profile.bio &&
                            <h5 className='inline-flex items-center gap-4 my-5 font-mono text-zinc-300'>
                                <svg className={`w-5 h-5 ${fetching && "animate-pulse"}`} width="50" height="50" viewBox="0 -0.156 0.875 0.875" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#D0FF00" d="M.313 0a.063.063 0 1 1 0 .125.184.184 0 0 0-.14.063A.188.188 0 1 1 0 .375V.313A.313.313 0 0 1 .313 0Zm.5 0a.063.063 0 0 1 0 .125.184.184 0 0 0-.14.063A.188.188 0 1 1 .5.375V.313A.313.313 0 0 1 .813 0ZM.188.313a.063.063 0 1 0 0 .125.063.063 0 0 0 0-.125Zm.5 0a.063.063 0 1 0 0 .125.063.063 0 0 0 0-.125Z" />
                                </svg>
                                {profile.bio}
                            </h5>
                        }

                    </div>

                    {profile?.links.length > 0 &&
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <p className='text-sm uppercase'>Affiliations</p>
                                <ul className='flex flex-wrap'>
                                    {profile?.orgs?.map((org, idx) => (
                                        <li key={idx} className='px-2 py-1 text-xs border rounded-full bg-zinc-900 border-zinc-700'>{org.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <ul className='flex flex-col w-full space-y-2 overflow-hidden'>
                                <p className='text-sm uppercase'>Shared Links</p>
                                {profile?.links?.map((link, idx) => (
                                    <a key={idx} href={link} target='_blank'
                                        className='inline-flex items-center p-1 pr-2 text-sm font-medium duration-150 border rounded-full w-fit group border-zinc-600 hover:bg-zinc-800'>
                                        <span className='inline-block px-3 py-1 text-black rounded-full bg-zinc-500 group-hover:bg-[#50ff00]'>
                                            <svg className='w-5 h-5' width="20" height="20" viewBox="0 0 12.8 12.8" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.2 5.65q0-.875.6-1.45.575-.6 1.45-.6h.875q.65 0 1.15.325T6 4.8H3.225q-.35 0-.575.25-.25.225-.25.575v1.55q0 .35.25.6.225.225.575.225H6q-.225.55-.725.875t-1.15.325H3.25q-.875 0-1.45-.575-.6-.6-.6-1.475v-1.5Zm10.4 1.5q0 .875-.575 1.475-.6.575-1.475.575h-.875q-.65 0-1.15-.325T6.8 8h2.775q.35 0 .6-.225.225-.25.225-.6v-1.55q0-.35-.225-.575-.25-.25-.6-.25H6.8q.225-.55.725-.875t1.15-.325h.875q.875 0 1.475.6.575.575.575 1.45v1.5Zm-8-1.35h5.6V7H3.6V5.8Z" />
                                            </svg>
                                        </span>
                                        <p className='px-4 w-fit text-start'>
                                            {link}
                                        </p>
                                    </a>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </section>
        </Container>
    )
}