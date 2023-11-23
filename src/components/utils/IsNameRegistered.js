"use server"

const IsNameRegistered = async ({ name }) => {
    const registeredNames = ["raldblox"];
    return registeredNames.includes(name);
}

export default IsNameRegistered