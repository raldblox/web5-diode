"use client"

import Container from '@/components/Container';
import { Context } from '@/providers/ContextManager';
import React, { useContext, useEffect, useState } from 'react'

export default ({ params }) => {
    const { userDid, records, web5, connectAccount } = useContext(Context);
    const [recipientDid, setRecipientDid] = useState("");
    const [sent, setSent] = useState(false);
    const [profileRecords, setProfileRecords] = useState([]);
    const [fetching, setFetching] = useState(true);

    const protocolDefinition = {
        "protocol": "https://web5.diode.digital",
        "published": true,
        "types": {
            "profile": {
                "schema": "https://web5.diode.digital/schemas/profile",
                "dataFormats": ["application/json"]
            },
            "link": {
                "schema": "https://web5.diode.digital/schemas/link",
                "dataFormats": ["text/plain"]
            },
        },
        "structure": {
            "profile": {
                "$actions": [
                    {
                        "who": "anyone",
                        "can": "read"
                    },
                    {
                        "who": "anyone",
                        "can": "write"
                    }
                ],
                "link": {
                    "$actions": [
                        {
                            "who": "recipient",
                            "of": "profile",
                            "can": "write"
                        },
                        {
                            "who": "author",
                            "of": "profile",
                            "can": "write"
                        }
                    ]
                }
            },
        }
    }

    const subscribeProtocol = async () => {
        if (!web5) { return }
        const { protocol, status } = await web5.dwn.protocols.configure({
            message: {
                definition: protocolDefinition
            }
        });

        const { status: sendStatus } = await protocol.send(userDid);
        console.log(`Protocol config status: ${status.detail}`);
        console.log(`Sending protocol status: ${sendStatus.detail}`);
    }

    const sendProfile = async () => {
        if (!web5) { return }
        console.log(`Sending profile...`);
        const recordID = params.profileId;
        console.log("Fetching profile: ", recordID)
        const { record: profile } = await web5.dwn.records.read({
            message: {
                filter: {
                    recordId: recordID
                }
            },
        });

        const userProfile = await profile.data.json();
        console.log("Fetched Record:", userProfile[0]);

        const person = [
            {
                "@context": "https://schema.org/",
                "@type": "Person",
                "identifier": userProfile[0].identifier,
                "jobTitle": userProfile[0].jobTitle,
                "name": userProfile[0].name,
                "disambiguatingDescription": userProfile[0].disambiguatingDescription,
                "affiliation": userProfile[0].affiliation,
                "email": userProfile[0].email,
                "url": userProfile[0].url,
                "additionalName": userProfile[0].additionalName
            },
        ]

        const { record: sendRecord, status: createStatus } = await web5.dwn.records.create({
            data: person,
            message: {
                recipient: recipientDid,
                schema: 'https://web5.diode.digital/schemas/profile',
                dataFormat: 'application/json',
                protocol: protocolDefinition.protocol,
                protocolPath: 'profile'
            }
        });



        console.log(`Create status: ${createStatus?.detail}`);
        const { status: sendStatus } = await sendRecord.send(recipientDid);
        console.log(`Send status: ${sendStatus?.detail}`);

        if (sendStatus.status.code === 202) {
            setSent(true);
            console.log(`Profile sent successfully`);
        }
        setTimeout(() => {
            setSent(false)
        }, 3000);
    }

    const deleteRecord = async (recordId) => {

        let deletedRecord;
        let index = 0;

        for (let record of profileRecords) {
            if (recordId === record.id) {
                deletedRecord = record;
                break;
            }
            index++;
        }

        const updatedRecords = [...profileRecords];
        updatedRecords.splice(index, 1);
        setProfileRecords(updatedRecords);

        const response = await web5.dwn.records.delete({
            message: {
                recordId: recordId,
            },
        });

        if (response.status.code === 202) {
            console.log(`Record deleted successfully`);
        } else {
            console.log(`${response.status}. Error deleting record`);
        }
    };

    useEffect(() => {
        const query = async () => {
            setFetching(true);
            const { protocol } = await web5.dwn.protocols.configure({
                message: {
                    definition: protocolDefinition
                }
            });
            const { status: sendStatus } = await protocol.send(userDid);
            console.log(`Protocol config status: ${sendStatus.detail}`);

            console.log("Getting profiles...")
            const { records: profiles } = await web5.dwn.records.query({
                message: {
                    filter: {
                        dataFormat: 'application/json'
                    }
                },
                dateSort: 'createdAscending',
            });

            const profileData = [];

            for (let profile of profiles) {
                const data = await profile.data.json();
                const newData = { data, id: profile.id };
                profileData.push(newData);
            }

            setProfileRecords(profileData);
            console.log("Profile Records:", profileData);
            setFetching(false);
        }

        if (!web5) {
            connectAccount();
        } else {
            query();
        }
    }, [web5])

    return (
        <Container className="flex flex-col py-[10vh] items-center justify-start w-full min-h-screen">
            <section className="w-full max-w-2xl px-2 space-y-10">
                <div className="flex items-start justify-between w-full gap-4">
                    <p className="py-1 text-xl font-bold md:text-3xl">Share My Profile</p>
                    {sent && <p className='text-[#D0FF00] text-lg text-center'>Profile Sent</p>}
                </div>
                <div className='flex gap-2'>
                    <input
                        className="w-full px-3 py-1 border rounded-md bg-zinc-800 border-zinc-700"
                        placeholder="Recipient DID"
                        value={recipientDid}
                        onChange={(e) => setRecipientDid(e.target.value)}
                    />
                    <button className='p-2 btn' onClick={sendProfile}>Send</button>
                </div>
                <div className="relative">
                    <span className="block w-full h-px bg-zinc-400"></span>
                </div>
                <div className="flex flex-col items-start justify-start w-full gap-5">
                    <div className="flex items-center justify-start w-full gap-4">
                        <p className="inline-flex gap-4 py-1 text-xl font-bold md:text-3xl">Profiles Received

                        </p>
                        {fetching &&
                            <div className='text-white animate-spin'>
                                <svg className='h-8' width="20" height="20" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0FF00" d="M.348.175a.15.15 0 0 0-.296 0H.027a.175.175 0 0 1 .346 0H.348z" />
                                </svg>
                            </div>}
                    </div>
                    <ul className="w-full py-5 space-y-2 text-sm divide-y md:text-base divide-zinc-800">
                        {profileRecords?.slice().reverse().map((record, idx) => (
                            <li key={idx} className={`w-full flex pt-2 hover:text-[#D0FF00] rounded-xl hover:bg-zinc-800 items-center justify-between px-4 md:px-6 py-2 gap-5`}>
                                <a href={`/profile/${record.id}`} target='_blank' className='gap-2 font-mono md:flex'> {record.id.slice(0, 10)}...{record.id.slice(-10)}</a>
                                <button onClick={() => deleteRecord(record.id)} className='py-1 text-red-900 hover:text-red-600'>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </Container>
    )
}