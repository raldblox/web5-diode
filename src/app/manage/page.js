"use client"

import Container from '@/components/Container'
import React, { useContext, useEffect, useState } from 'react'
import { webcrypto } from "node:crypto";
import { Context } from '@/providers/ContextManager';
import Link from 'next/link';

export default () => {
    const { userDid, lockedName, web5 } = useContext(Context);
    const [selectedTab, setSelectedTab] = useState(0);
    const [newInput, setNewInput] = useState('');
    const [records, setRecords] = useState([]);
    const [publishing, setPublishing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [sent, setSent] = useState(false);
    const [recipient, setRecipient] = useState("");
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

    const person = [
        {
            "@context": schema.context,
            "@type": schema.type,
            "identifier": userDid,
            "jobTitle": profile.role,
            "name": profile.fullName,
            "disambiguatingDescription": profile.bio,
            "affiliation": profile.orgs,
            "email": profile.email,
            "url": profile.links,
            "identifier": profile.wallet,
            "additionalName": lockedName,
        },
    ]

    const publishPerson = async () => {
        setPublishing(true);
        console.log(person);

        const response = await web5.dwn.records.create({
            data: person,
            message: {
                schema: schema.uri,
                dataFormat: 'application/json',
                published: true,
            },
        });

        console.log(response);
        if (response.status.code === 202) {
            setSuccess(true);
            console.log(`Person is published successfully`);
        } else {
            console.log(`${response.status}. Error adding person`);
        }

        setTimeout(() => {
            setSuccess(false);
            setPublishing(false);
        }, 3000);
    }

    const deleteRecord = async (recordId) => {

        let deletedRecord;
        let index = 0;

        for (let record of records) {
            if (recordId === record.id) {
                deletedRecord = record;
                break;
            }
            index++;
        }

        // Remove the record from the records array
        const updatedRecords = [...records];
        updatedRecords.splice(index, 1);
        setRecords(updatedRecords);

        const response = await web5.dwn.records.delete({
            message: {
                recordId: recordId,
            },
        });

        if (response.status.code === 202) {
            setSuccess(true)
            console.log(`Record deleted successfully`);
        } else {
            console.log(`${response.status}. Error deleting record`);
        }
        setSuccess(false)

    };

    const handleShare = async () => {
        console.log("sending profile")

        const { record } = await web5.dwn.records.write({
            data: person,
            message: {
                schema: schema.uri,
                dataFormat: 'application/json',
                published: true,
                recipient: recipient,
            },
        });

        //send record to recipient's DWN
        const { status: sendStatus } = await record.send(recipient);

        if (sendStatus.code === 202) {
            setSent(true)
            console.log(`Latest record sent successfully.`);
        } else {
            console.log(`Error sending profile: ${sendStatus.detail}`);
        }
        setTimeout(() => {
            setSent(false)
        }, 3000);
    };

    const handleMessage = async (e) => {
        console.log("Sending msg")
        const { record } = await web5.dwn.records.create({
            data: `https://web5.diode.digital/explore/${records.slice(-1)[0]?.id}`,
            message: {
                dataFormat: 'text/plain'
            }
        });

        //send record to recipient's DWN
        const { status: sendStatus } = await record.send(recipient);

        if (sendStatus.code === 202) {
            setSent(true)
            console.log(`Profile link sent successfully`);
        } else {
            console.log(`Error sending profile: ${sendStatus.detail}`);
        }
        setTimeout(() => {
            setSent(false)
        }, 3000);
    };

    // Function to fetch Person
    useEffect(() => {

        const getPerson = async () => {
            setFetching(true);
            try {
                const { records, status: recordStatus } = await web5.dwn.records.query({
                    message: {
                        filter: {
                            schema: schema.uri,
                        },
                    },
                    dateSort: 'createdAscending',
                });

                const rawdata = [];

                for (let record of records) {
                    const data = await record.data.json();
                    const newData = { data, id: record.id };
                    rawdata.push(newData);
                }

                setRecords(rawdata);
                console.log("DWN Records:", rawdata);

                try {
                    const results = await Promise.all(
                        records.map(async (record) => record.data.json())
                    );
                    const latestRecord = results[results.length - 1];
                    // console.log(latestRecord);

                    if (recordStatus.code == 200) {
                        console.log("Person records fetched.");
                        setProfile({
                            email: latestRecord[0].email,
                            role: latestRecord[0].jobTitle,
                            fullName: latestRecord[0].name,
                            bio: latestRecord[0].disambiguatingDescription,
                            links: latestRecord[0].url,
                            orgs: latestRecord[0].affiliation,
                            wallet: latestRecord[0].identifier
                        });
                    }

                } catch (error) {
                    console.error(error);
                }

            } catch (error) {
                console.error('Error fetching:', error);
            }
            setTimeout(() => {
                setFetching(false);
            }, 5000);
        }
        getPerson()
    }, [web5, success])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const addOrganization = () => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            orgs: [...(prevProfile.orgs || []), { '@type': 'Organization', 'name': newInput }]
        }));
        setNewInput("")
    };

    const addCredential = () => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            creds: [...prevProfile.creds, newInput]
        }));
        setNewInput("")
    };

    const addLink = () => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            links: [
                ...(prevProfile.links || []), newInput],
        }));
        setNewInput('');
    };

    const tabItems = [
        {
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                </svg>,
            name: "Profile",
            online: true
        },
        {
            icon:
                <svg className="w-4 h-4" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.073.406c-3.45 0-6.428 2.857-6.428 6.433 0 3.45 2.978 6.307 6.428 6.307 3.572 0 6.432-2.857 6.432-6.307A6.406 6.406 0 0 0 22.073.406Z" fill="currentColor" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.787 5.648c-2.74 0-5.121 2.26-5.121 5.118 0 1.428.597 2.74 1.428 3.571-2.38 1.311-4.047 3.93-4.047 6.788v6.31a4.133 4.133 0 0 0 2.619 3.81v6.667c0 2.026 1.787 3.81 3.81 3.81h2.501c2.143 0 3.927-1.784 3.927-3.81v-6.667a4.561 4.561 0 0 0 1.311-.952c.476.238.715.597 1.312.952v9.169c0 2.022 1.784 3.93 3.926 3.93h5.239c2.025 0 3.93-1.787 3.93-3.93v-9.169c.476-.238.952-.476 1.428-.952.36.238.715.597 1.312.952v6.667c0 2.026 1.784 3.81 3.81 3.81h2.618c2.026 0 3.81-1.784 3.81-3.81v-6.667c1.55-.593 2.502-2.025 2.502-3.81v-6.31c.117-2.858-1.429-5.36-3.81-6.788.832-.832 1.429-2.143 1.429-3.571 0-2.858-2.381-5.118-5.242-5.118-2.736 0-5.117 2.26-5.117 5.118 0 1.428.593 2.74 1.428 3.571-.835.476-1.666 1.073-2.263 1.788-.356-.953-1.19-2.026-1.905-2.858-1.308 1.429-3.095 2.143-5 2.381v6.55c0 .846-.74 1.292-1.466 1.292-.703 0-1.391-.415-1.391-1.292v-6.55c-1.905-.238-3.692-1.19-5-2.38-.953.83-1.55 1.904-2.026 2.857a7.86 7.86 0 0 0-2.143-1.788c.832-.832 1.429-2.143 1.429-3.571 0-2.858-2.381-5.118-5.238-5.118Z" fill="currentColor" />
                </svg>,
            name: "Orgs",
            online: false
        },
        // {
        //     icon:
        //         <svg className='w-4 h-4' viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        //             <path fill-rule="evenodd" clip-rule="evenodd" d="M36.797 13.412v5.238h7.857v-1.31c0-2.143-1.788-3.927-3.81-3.927h-4.047Zm-6.551-7.74c1.667 0 1.784 2.498 0 2.498h-15.48a1.223 1.223 0 0 1-.2.015c-1.474 0-1.512-2.513.2-2.513h15.48Zm0 5.238c1.667 0 1.784 2.502 0 2.502h-15.48c-1.666 0-1.784-2.502 0-2.502h15.48Zm0 5.238c1.667 0 1.784 2.502 0 2.502h-15.48c-1.666 0-1.784-2.502 0-2.502h15.48ZM12.03.434c-.714 0-1.311.593-1.311 1.428v22.026h17.86c1.191 0 1.784-2.022 2.381-2.975.594-1.194 1.784-2.025 3.096-2.146V1.862c0-.835-.594-1.428-1.312-1.428H12.03ZM4.528 8.408c-2.143 0-3.93 1.788-3.93 3.814v11.666h7.74V8.408h-3.81Z" fill="currentColor" />
        //             <path fill-rule="evenodd" clip-rule="evenodd" d="M34.414 21.27c-1.073 0-1.67 1.787-2.263 2.978-.597 1.428-1.905 2.142-3.334 2.142H.597v14.286c0 2.026 1.788 3.81 3.931 3.81h36.315c2.022 0 3.81-1.784 3.81-3.81V21.27H34.414Z" fill="currentColor" />
        //         </svg>
        //     ,
        //     name: "Creds",
        //     online: true
        // },
        {
            icon:
                <svg className="w-4 h-4" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="m28.27 15.291-4.528 4.407c-.476.476-.476 1.307 0 1.784 1.55 1.428 1.55 4.047 0 5.476l-8.454 8.454a3.922 3.922 0 0 1-2.782 1.16c-.998 0-1.98-.385-2.695-1.16-1.545-1.429-1.545-3.927 0-5.476l2.502-2.502c-1.19-2.022-1.787-4.524-1.787-6.905 0-.831.12-1.546.238-2.498l-6.308 6.428c-4.645 4.403-4.645 11.905 0 16.55 2.23 2.23 5.257 3.394 8.288 3.394 2.952 0 5.907-1.104 8.14-3.394 7.385-7.264 9.17-8.692 10.48-11.311 1.784-3.096 1.784-6.905.118-10.239-.832-2.025-1.905-3.216-3.213-4.168Z" fill="currentColor" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.418.348a11.97 11.97 0 0 0-8.364 3.393l-8.571 8.81c-5.242 5.238-4.051 13.692 1.07 17.264l4.406-4.403c.476-.476.476-1.19 0-1.788-1.073-.952-1.311-2.619-1.073-2.974 0-2.381 2.502-3.93 9.883-11.311.82-.82 1.75-1.164 2.653-1.164 3.038 0 5.76 3.885 2.823 6.64l-2.62 2.619c1.667 3.216 2.264 6.19 1.667 9.406l6.55-6.55c4.407-4.644 4.407-11.904-.238-16.549C39.4 1.478 36.426.348 33.418.348Z" fill="currentColor" />
                </svg>
            ,
            name: "Links",
            online: true
        },
        {
            icon:
                <svg className="w-4 h-4" width="10" height="10" viewBox="0 0 0.2 0.2" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M.05.113H.1v.025H.05V.113z" />
                    <path fill="currentColor" d="M.2.025H.187V0H.063v.025H.038v.016L.03.05H.013v.022L0 .088v.113h.15L.2.138V.025zM.025.063h.1v.025h-.1V.063zm.113.125H.013V.1h.125v.088zm.013-.1H.138V.05H.05V.038h.1v.05zM.176.057.163.073V.025H.075V.013h.1v.044z" />
                </svg>

            ,
            name: "Records",
            online: true
        },
        {
            icon:
                <svg className="w-4 h-4 text-[#D0FF00]" width="50" height="50" viewBox="0 0 0.938 0.938" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.281.469h.25M.688.25.531.468l.157.22M.907.157a.125.125 0 0 1-.25 0 .125.125 0 0 1 .25 0Zm0 .625a.125.125 0 0 1-.25 0 .125.125 0 0 1 .25 0ZM.282.47a.125.125 0 0 1-.25 0 .125.125 0 0 1 .25 0Z" stroke="currentColor" stroke-linecap="square" stroke-width=".063" />
                </svg>
            ,
            name: "",
            online: true
        },

    ]

    return (
        <Container className="flex items-center justify-center w-full min-h-screen">
            <section className="w-full max-w-screen-md">
                <div className="min-h-screen py-10 md:py-20" id="dashboard">
                    <section className="relative ">
                        <ul className="flex items-center px-5 mx-auto overflow-x-auto md:justify-center">
                            {
                                tabItems.map((item, idx) => {
                                    return (
                                        <li key={idx} className={`py-2 duration-150 border-b-4 ${selectedTab == idx ? "border-[#d0ff00] text-white" : "border-b-4 text-zinc-500  border-transparent"} `}>
                                            <button
                                                role="tab"
                                                aria-selected={selectedTab == idx ? true : false}
                                                aria-controls={`tabpanel-${idx + 1} `}
                                                className={`flex uppercase items-center text-xs md:text-sm px-4 py-2 font-medium rounded-lg gap-x-2 hover:bg zinc-800 active:bg-zinc-700`}
                                                onClick={() => setSelectedTab(idx)}
                                            >
                                                {item.icon}
                                                {item.name}
                                            </button>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </section>
                    <section className="bg-[#181818] py-10 rounded-2xl w-full">
                        {selectedTab == 0 &&
                            <div className="flex flex-col items-center justify-start w-full gap-10 px-5 md:px-10">
                                <div className="flex items-start justify-between w-full gap-4">
                                    <p className="inline-flex items-center gap-4 py-1 text-2xl font-bold md:text-3xl">Web5 Profile {fetching &&
                                        <div className='text-white animate-spin'>
                                            <svg className='h-8' width="20" height="20" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0FF00" d="M.348.175a.15.15 0 0 0-.296 0H.027a.175.175 0 0 1 .346 0H.348z" />
                                            </svg>
                                        </div>}
                                    </p>
                                    <div className='flex gap-2'>
                                        {records.length > 0 && !fetching &&
                                            <Link href={`/explore/${records.slice(-1)[0]?.id}`} className="px-3 py-2 border rounded-md w-fit btn border-zinc-700">
                                                View Profile
                                            </Link>
                                        }
                                        <button onClick={publishPerson} disabled={publishing} className="hidden p-2 uppercase md:px-6 md:block w-fit xbtn">
                                            {publishing ? <>{success ? "Published" : "Publishing"}</> : "Publish"}
                                        </button>
                                    </div>
                                </div>

                                <form className="grid w-full col-span-1 gap-5">

                                    <div className="grid space-y-1">
                                        <label className="text-zinc-500" htmlFor="username">Decentralized Identifier</label>
                                        <input
                                            className="w-full px-3 py-1 border rounded-md xtext border-zinc-700"
                                            disabled={true}
                                            value={userDid}
                                        />
                                    </div>
                                    <div className="grid space-y-1">
                                        <label className="text-zinc-500" htmlFor="username">Diode Account <span className='text-sm text-zinc-600'>(Reserved; Not Owned)</span></label>
                                        <input
                                            className="w-full px-3 py-1 border rounded-md xtext border-zinc-700"
                                            type="text"
                                            disabled={true}
                                            id="name"
                                            name="name"
                                            placeholder="john"
                                            value={`diode:${lockedName}`}
                                        />
                                    </div>
                                    <div className="grid space-y-1">
                                        <label className="text-zinc-500" htmlFor="givenName">Full Name</label>
                                        <input
                                            className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            placeholder="John Doe"
                                            value={profile.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid space-y-1">
                                        <label className="text-zinc-500" htmlFor="familyName">Add Bio</label>
                                        <input
                                            className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                            type="text"
                                            id="bio"
                                            name="bio"
                                            placeholder="Web5 Pioneers"
                                            value={profile.bio}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid mb-10 space-y-1">
                                        <label className="text-zinc-500" htmlFor="email">Job Title</label>
                                        <input
                                            className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                            type="text"
                                            id="role"
                                            name="role"
                                            placeholder="Founder"
                                            value={profile.role}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid space-y-1">
                                        <label className="text-zinc-500" htmlFor="email">Email Address</label>
                                        <input
                                            className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={profile.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid space-y-1">
                                        <label className="text-zinc-500" htmlFor="email">Wallet Address</label>
                                        <input
                                            className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                            type="text"
                                            id="wallet"
                                            name="wallet"
                                            placeholder="0xWalletAddress"
                                            value={profile.wallet}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </form>
                            </div>
                        }

                        {selectedTab == 1 &&
                            <div className="flex flex-col items-center justify-start w-full gap-10 px-5 md:px-10">
                                <div className="flex items-start justify-between w-full gap-4">
                                    <p className="inline-flex items-center gap-4 py-1 text-xl font-bold md:text-3xl">My Organizations {fetching &&
                                        <div className='text-white animate-spin'>
                                            <svg className='h-8' width="20" height="20" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0FF00" d="M.348.175a.15.15 0 0 0-.296 0H.027a.175.175 0 0 1 .346 0H.348z" />
                                            </svg>
                                        </div>}
                                    </p>
                                    <button onClick={publishPerson} disabled={publishing} className="hidden p-2 uppercase md:px-6 md:block w-fit xbtn">
                                        {publishing ? <>{success ? "Published" : "Publishing"}</> : "Publish"}
                                    </button>
                                </div>
                                <form className="grid w-full col-span-1 gap-5">
                                    <div className="grid space-y-1">
                                        <input
                                            className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                            placeholder="Name of Organization"
                                            name="orgs"
                                            value={newInput}
                                            onChange={(e) => setNewInput(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={addOrganization} className="w-full px-4 py-2 btn">Add Organization</button>
                                    <div className="relative">
                                        <span className="block w-full h-px bg-zinc-400"></span>
                                        {/* <p className="absolute inset-x-0 inline-block px-4 mx-auto text-sm w-fit bg-[#181818] -top-2 uppercase">
                                    ADDED ORGANIZATIONS
                                </p> */}
                                    </div>

                                    <ul className="px-5 py-5 md:px-10">
                                        {profile.orgs?.map((org, idx) => (
                                            <li key={idx} className='flex items-center gap-5'>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className="w-5 h-5 xtext"
                                                    viewBox='0 0 20 20'
                                                    fill='currentColor'>
                                                    <path
                                                        fill-rule='evenodd'
                                                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                        clip-rule='evenodd'></path>
                                                </svg>
                                                {org.name}
                                            </li>
                                        ))}
                                    </ul>
                                </form>
                            </div>
                        }
                        {selectedTab == 2 &&
                            <div className="flex flex-col items-center justify-start w-full gap-10 px-5 md:px-10">
                                <div className="flex items-start justify-between w-full gap-4">
                                    <p className="inline-flex items-center gap-4 py-1 text-xl font-bold md:text-3xl">My Shared Links {fetching &&
                                        <div className='text-white animate-spin'>
                                            <svg className='h-8' width="20" height="20" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0FF00" d="M.348.175a.15.15 0 0 0-.296 0H.027a.175.175 0 0 1 .346 0H.348z" />
                                            </svg>
                                        </div>}
                                    </p>
                                    <button onClick={publishPerson} disabled={publishing} className="hidden p-2 uppercase md:px-6 md:block w-fit xbtn">
                                        {publishing ? <>{success ? "Published" : "Publishing"}</> : "Publish"}
                                    </button>
                                </div>
                                <form className="grid w-full col-span-1 gap-5">
                                    <div className="grid space-y-1">
                                        <input
                                            className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                            placeholder="Add Link"
                                            name="links"
                                            value={newInput}
                                            onChange={(e) => setNewInput(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={addLink} className="w-full px-4 py-2 btn">Add Link</button>
                                    <div className="relative">
                                        <span className="block w-full h-px bg-zinc-400"></span>
                                    </div>

                                    <ul className="px-5 py-5 md:px-10">
                                        {profile?.links?.map((link, idx) => (
                                            <a key={idx} href={link} target='_blank' className='flex hover:text-[#D0FF00] items-center gap-5'>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className="w-5 h-5 xtext"
                                                    viewBox='0 0 20 20'
                                                    fill='currentColor'>
                                                    <path
                                                        fill-rule='evenodd'
                                                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                        clip-rule='evenodd'></path>
                                                </svg>
                                                {link}
                                            </a>
                                        ))}
                                    </ul>
                                </form>
                            </div>
                        }
                        {selectedTab == 3 &&
                            <div className="flex flex-col items-center justify-start w-full gap-10 px-5 md:px-10">
                                <div className="flex items-start justify-between w-full gap-4">
                                    <p className="py-1 text-xl font-bold md:text-3xl">My DWN Records</p>
                                </div>
                                <ul className="w-full py-5 space-y-2 text-sm divide-y md:text-base divide-zinc-800">
                                    {records?.slice().reverse().map((record, idx) => (
                                        <li key={idx} className={`flex pt-2 hover:text-[#D0FF00] rounded-xl hover:bg-zinc-800 items-center justify-between px-4 md:px-6 py-2 gap-5 ${idx === 0 ? 'bg-zinc-800' : ''
                                            }`}>
                                            <a href={`/explore/${record.id}`} target='_blank' className='gap-2 font-mono md:flex'> {record.id.slice(0, 10)}...{record.id.slice(-5)} <span className='font-semibold font-sans whitespace-nowrap text-[#D0FF00]'>{idx === 0 && "(Latest Record In Use)"}</span></a>
                                            <button onClick={() => deleteRecord(record.id)} className='py-1 text-red-900 hover:text-red-600'>Delete</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                        {selectedTab == 4 &&
                            <div className="flex flex-col items-center justify-start w-full gap-5 px-5 md:px-10">
                                <div className="flex items-start justify-between w-full">
                                    <p className="text-xl font-bold md:text-3xl">Share My Profile</p>
                                </div>
                                <div className="grid w-full mt-5 space-y-1">
                                    <input
                                        className="w-full px-3 py-1 border rounded-md border-zinc-700"
                                        placeholder="Recipient DID"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                    />
                                </div>
                                <div className='grid w-full gap-2 md:flex'>
                                    <button onClick={handleShare} className="w-full px-4 py-2 btn">Send Latest Record</button>
                                    <button onClick={handleMessage} className="w-full px-4 py-2 btn">Send Profile Link</button>
                                </div>

                                {sent && <p className='text-[#D0FF00] text-lg text-center'>Profile Sent</p>}

                                <div className="flex items-start w-full mt-10">
                                    <p className="text-xl font-bold text-left md:text-3xl">For Your Information</p>
                                </div>

                                <h5 className='w-full text-lg text-left'>Schema In Use</h5>
                                <code className='p-2 text-sm text-left md:text-base bg-zinc-800'>
                                    {JSON.stringify(
                                        {
                                            "@context": schema.context,
                                            "@type": schema.type,
                                            "identifier": `${userDid.slice(0, 15)}...${userDid.slice(-15)}`,
                                            "jobTitle": profile.role,
                                            "name": profile.fullName,
                                            "disambiguatingDescription": profile.bio,
                                            "affiliation": profile.orgs,
                                            "email": profile.email,
                                            "url": profile.links,
                                            "identifier": profile.wallet,
                                            "additionalName": lockedName,
                                        },
                                        null,
                                        2
                                    )}
                                </code>

                            </div>
                        }
                        {
                            selectedTab < 3 &&
                            <div className='px-5 pt-5'>
                                <button onClick={publishPerson} disabled={publishing} className="block w-full px-4 py-2 uppercase md:hidden xbtn">
                                    {publishing ? <>{success ? "Published" : "Publishing"}</> : "Publish"}
                                </button>
                            </div>
                        }


                    </section>
                </div>
            </section>
        </Container>
    )
}