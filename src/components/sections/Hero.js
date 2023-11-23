"use client"

import DiodeLink from "../utils/DiodeLink"


const Hero = () => {
    return (
        <section className="grid content-center min-h-[calc(100vh-50px)]">
            <div className="flex w-full max-w-screen-lg gap-16 px-2 mx-auto overflow-hidden md:px-8 md:flex">
                <div className='grid max-w-xl space-y-10'>
                    <h1 className="text-3xl font-bold sm:text-5xl">
                        Distinguish yourself in a <span className="xtext">decentralized</span> world
                    </h1>
                    <p className="text-sm md:text-base opacity-70">
                        Forge a circuit of trust in a world where data and identity are the currency. Break free from traditional constraints, showcase your diverse interests, unfold your vibrant and dynamic contribution in decentralized world with digital diodes.
                    </p>
                    <div className='flex items-center pt-4 sm:text-sm'>
                        <DiodeLink />
                    </div>
                </div>
                {/* <div className='flex-1 w-[20vw] hidden md:block'>
                    <img src="" alt="image" className="max-w-xl" />
                </div> */}
            </div>
        </section>
    )
}

export default Hero