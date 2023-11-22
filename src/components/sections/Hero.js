"use client"

import DiodeLink from "../utils/DiodeLink"


const Hero = () => {
    return (
        <section className="h-screen grid content-center">
            <div className="max-w-screen-lg flex w-full mx-auto px-4 gap-16 overflow-hidden md:px-8 md:flex">
                <div className='grid space-y-10 max-w-2xl'>
                    <h1 className="text-3xl font-bold sm:text-5xl">
                        Distinguish yourself in <span className="xtext">decentralized</span> world
                    </h1>
                    <p className="text-sm md:text-lg opacity-70">
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