import Link from "next/link"

export default ({ name }) => {

    return (
        <main className="flex w-full flex-col items-center justify-center p-4 md:px-68 md:py-8 border shadow-2xl border-zinc-800 bg-[#181818] rounded-3xl">
            <div className="w-full space-y-6 sm:max-w-md">
                <div className="text-center">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-2xl font-bold sm:text-3xl">New Diode Profile</h3>
                        <p className="">Don't have an account? <a href="javascript:void(0)" className="font-medium xtext">Sign up</a></p>
                    </div>
                </div>
                <div className="p-2 py-4 space-y-8 shadow sm:p-6 sm:rounded-lg">
                    <form
                        className="space-y-5"
                    >
                        <div>
                            <div className="flex justify-between text-sm">
                                <label className="font-medium">
                                    Create Name
                                </label>
                                <Link href="/shop" className="text-gray-500 hover:underline">Shop Names</Link>
                            </div>
                            <input
                                value={name}
                                type="text"
                                required
                                className="w-full bg-[#262626] px-3 py-2 mt-2 border rounded-lg shadow-sm outline-none focus:border-[green]"
                            />
                        </div>
                        <button
                            className="w-full px-4 py-2 font-medium xbtn"
                        >
                            CREATE
                        </button>
                    </form>
                    <div className="relative">
                        <span className="block w-full h-px bg-white"></span>
                        <p className="absolute inset-x-0 inline-block px-4 mx-auto text-sm w-fit bg-[#181818] -top-2 uppercase">Or continue with</p>
                    </div>
                    <div className="grid grid-cols-3 gap-x-3">
                        <button className="flex items-center justify-center py-2 btn">
                            ENS
                        </button>
                        <button className="flex items-center justify-center py-2 btn">
                            LENS
                        </button>
                        <button className="flex items-center justify-center py-2 btn">
                            NS
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}