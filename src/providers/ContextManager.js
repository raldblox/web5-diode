"use client"

// import { Web5 } from '@web5/api/browser';
import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

export const ContextManager = (props) => {
    const [web5, setWeb5] = useState(null);
    const [userDid, setUserDid] = useState("");
    const [name, setName] = useState("")
    const [lockedName, setLockedName] = useState("")
    const [connecting, setConnecting] = useState(false);

    const connectAccount = async () => {
        const { Web5 } = await import('@web5/api/browser');
        
        setConnecting(true);
        const lockedname = localStorage.getItem("lockedName");
        setLockedName(lockedname);

        console.log("Connecting web5")
        const { web5, did } = await Web5.connect({
            sync: '5s'
        });
        console.log(web5)
        console.log("did: ", did);
        const timestamp = new Date().getTime();
        localStorage.setItem("lastConnectionTimestamp", timestamp);

        setTimeout(() => {
            setWeb5(web5);
            setUserDid(did);
            setName(lockedname);
            setConnecting(false);
        }, 1000);
    }

    const disconnectAccount = async () => {
        localStorage.setItem("lastConnectionTimestamp", null);
        console.log("Disconnect")
        setWeb5("");
        setLockedName("");
        setUserDid("");
        setName("");
    }

    useEffect(() => {
        // Check if there's a stored timestamp
        const lastConnectionTimestamp = localStorage.getItem(
            "lastConnectionTimestamp"
        );

        if (lastConnectionTimestamp) {
            // Check if the last connection was more than 30 minutes ago
            const thirtyMinutesInMillis = 30 * 60 * 1000;
            const currentTime = new Date().getTime();
            const timeSinceLastConnection = currentTime - lastConnectionTimestamp;

            if (timeSinceLastConnection < thirtyMinutesInMillis) {
                // Perform automatic connection if within 30 minutes after first connection
                connectAccount();
            }
        }
        return () => {
            console.log("Getting account")
            // connectAccount();
        }
    }, [])

    useEffect(() => {
        if (!userDid) { return }
        const setName = async () => {
            if (!lockedName) {
                localStorage.setItem("userName", name);
                // console.log("name set")
            }
        }
        setName();
    }, [name])


    const value = {
        web5, setWeb5, userDid, setUserDid, connectAccount, connecting, setConnecting, disconnectAccount,
        name, setName, lockedName, setLockedName
    };

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
