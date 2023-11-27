"use client"

// import { Web5 } from '@web5/api/browser';
import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

export const ContextManager = (props) => {
    const [web5, setWeb5] = useState(null);
    const [userDid, setUserDid] = useState("");
    const [name, setName] = useState("")
    const [lockedName, setLockedName] = useState("")
    const [records, setRecords] = useState([]);
    const [connecting, setConnecting] = useState(false);
    const [subscribe, setSubscribe] = useState(false);

    const schema = {
        "context": 'https://schema.org/',
        "type": 'Person',
        get uri() { return this.context + this.type; }
    }

    const protocolDefinition = {
        "protocol": "https://web5.diode.digital",
        "published": true,
        "types": {
            "profile": {
                "schema": schema.uri,
                "dataFormats": ["application/json"]
            },
            "shared": {
                "schema": schema.uri,
                "dataFormats": ["application/json"]
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

            },
            "shared": {
                "$actions": [
                    {
                        "who": "anyone",
                        "can": "read"
                    },
                    {
                        "who": "anyone",
                        "can": "write"
                    }
                ]
            }
        }
    }

    const connectAccount = async () => {
        const { Web5 } = await import('@web5/api/browser');
        setConnecting(true);

        console.log("Connecting web5")
        const { web5, did } = await Web5.connect({
            sync: '5s'
        });

        console.log("userDid: ", did);

        const timestamp = new Date().getTime();
        localStorage.setItem("lastConnectionTimestamp", timestamp);

        if (web5 && did) {
            const { protocol } = await web5.dwn.protocols.configure({
                message: {
                    definition: protocolDefinition
                }
            });
            await protocol.send(did);
        }

        setWeb5(web5);
        setUserDid(did);
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

    const value = {
        web5, setWeb5, userDid, setUserDid, connectAccount, connecting, setConnecting, disconnectAccount,
        name, setName, lockedName, setLockedName, records, setRecords,
    };

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
