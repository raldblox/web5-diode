export async function EncodeProfile(name) {

    const addressBase58 = `xxxxxx${name}xxxxxx`;
    const controller = `did:diode:${name}xxxxxx`;
    const owner = `did:diode:${name}xxxxxx`;

    const resolveDID = {
        "id": `did:diode:${name}`,
        "authentication": [{
            "id": "did:example:123456789abcdefghi#keys-1",
            "type": "Ed25519VerificationKey2018",
            "controller": controller,
            "publicKeyBase58": addressBase58
        }],
        "credentialSubject": {
            "id": owner,
            "type": [
                "Profile",
                "Person"
            ],
            "givenName": "RALD",
            "familyName": "BLOX",
            "gender": "Male",
            "image": "https://diode.digital/icons/alpaca.png",
            "birthCountry": "Philippines",
            "organizations": [
                "polygon", "gpt", "eth", "quantum", "nft", "apt", "neo", "art", "defi"
            ]
        },
    };

    return { resolveDID };
}