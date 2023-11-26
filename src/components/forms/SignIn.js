"use client"

import Link from "next/link"
import { useContext, useEffect, useState } from "react";
import { Context } from "@/providers/ContextManager";
import ConnectWeb5 from "../utils/ConnectWeb5";

export default () => {
    const { userDid, name, setName, lockedName, setLockedName, connectAccount } = useContext(Context);

    const registerName = async (newName) => {
        setName(newName);
    }

    const handleLockName = async () => {
        localStorage.setItem("lockedName", name);
        setLockedName(name)
    }

    useEffect(() => {
        const getName = async () => {
            const username = localStorage.getItem("userName");
            setName(username);
        }
        getName()
    }, [])

    return (
        <main className="flex w-full flex-col items-center justify-center p-4 md:px-68 md:py-8 border shadow-2xl border-zinc-800 bg-[#181818] rounded-3xl">
            <div className="w-full space-y-6 sm:max-w-md">
                <div className="text-center">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-2xl font-bold sm:text-3xl">New Diode Profile</h3>
                        <p className="">Don't have web5 account? <button onClick={connectAccount} className="font-medium xtext">Create now</button></p>
                    </div>
                </div>
                <div className="p-2 py-4 space-y-8 shadow sm:p-6 sm:rounded-lg">
                    <form
                        className="space-y-5"
                    >
                        <div>
                            <div className="flex justify-between text-sm">
                                <label className="font-medium">
                                    Diode Name
                                </label>
                                <Link href="/shop" className="text-gray-500 hover:underline">Shop Names</Link>
                            </div>
                            <input
                                disabled={!userDid || lockedName}
                                value={name || lockedName}
                                onChange={(e) => registerName(e.target.value)}
                                type="text"
                                required
                                className="w-full bg-[#262626] px-3 py-2 mt-2 border rounded-lg shadow-sm outline-none focus:border-[green]"
                            />
                        </div>
                        {lockedName ?

                            <Link href="/manage" >
                                <button className="w-full px-4 py-2 mt-4 font-medium xbtn">
                                    DASHBOARD
                                </button>
                            </Link> :
                            <button onClick={handleLockName} className="w-full px-4 py-2 font-medium xbtn">
                                ASSIGN NAME
                            </button>}

                    </form>
                    <div className="relative">
                        <span className="block w-full h-px bg-white"></span>
                        <p className="absolute inset-x-0 inline-block px-4 mx-auto text-sm w-fit bg-[#181818] -top-2 uppercase">
                            {userDid ? "Connected to Web5" : "CONNECT YOUR ACCOUNT"}
                        </p>
                    </div>
                    <div className="grid">
                        <ConnectWeb5 />
                    </div>
                </div>
            </div>

        </main>
    )
}