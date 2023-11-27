"use client"

import DiodeLink from "../utils/DiodeLink"


const Hero = () => {
    return (
        <section className="grid content-center min-h-[calc(100vh-120px)]">
            <div className="flex w-full max-w-screen-lg gap-16 px-2 mx-auto overflow-hidden md:px-8 md:flex">
                <div className='grid max-w-2xl space-y-10'>
                    <p className="text-4xl font-bold sm:text-5xl">
                        Setup your <span className="xtext">self-sovereign</span> identity with diode
                    </p>
                    <p className="text-sm md:text-base opacity-70">
                        Forge a circuit of trust in a world where data and identity are the currency. Break free from traditional constraints, control your digital identity, showcase your diverse interests, unfold your vibrant and dynamic contribution with diode.
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