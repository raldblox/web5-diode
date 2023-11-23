"use client"

import { Web5 } from "@web5/api";
import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

export const ContextManager = (props) => {
    const [web5, setWeb5] = useState(null);
    const [userDid, setUserDid] = useState("");

    const [connecting, setConnecting] = useState(false);

    const connectAccount = async () => {
        setConnecting(true);
        console.log("Connecting...")
        const { web5, did } = await Web5.connect();
        console.log("web5: ", web5);
        console.log("did: ", did);
        setWeb5(web5);
        setUserDid(did);

        // Store the timestamp of the last connection in localStorage
        const timestamp = new Date().getTime();
        localStorage.setItem("lastConnectionTimestamp", timestamp);
        setConnecting(false);
    }

    const disconnectAccount = async () => {
        console.log("Disconnect")
        setWeb5("");
        setUserDid("");
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

    const value = {
        web5, setWeb5, userDid, setUserDid, connectAccount, connecting, setConnecting, disconnectAccount
    };

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
