export default function Logo () {
    return (
        <main className="absolute sm:top-[1.7rem] top-[0.95rem] left-[1.1rem] ">
            <section className="over flex items-center gap-1">
                <div className="sm:w-[1.4rem] w-[1.2rem] aspect-square flex justify-center items-center overflow-hidden rounded-full border-[1.5px] border-black ">
                   <img src="/images_assests/logo.jpeg" className="sm:w-[1.2rem] w-[1rem] scale-180 transform sm:-translate-x-[0.3px] sm:-translate-y-[0.2px] -translate-x-[0.2px] -translate-y-[0.71px] aspect-square rounded-full" alt="" /> 
                </div>
                <span className="text-black sm:text-lg text-sm funnel-semibold -tracking-wide">VYNK</span>
            </section>
        </main>
    )

}