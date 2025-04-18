export default function Navbar() {
    return(
        <nav className="h-full w-full flex justify-between items-center gap-2 ">
            <span className="font1 text-[1.2rem] w-1/2 ml-4" >V- YNK</span>
            <section className="flex gap-4 text-[1.2rem] font1 w-1/2 justify-between mr-4">
                <section className="font1 flex gap-6 items-center">
                    <span>career</span>
                    <span>contacts</span>
                </section>
                <button className="font1 text-[0.9rem] place-self-end px-6  py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 shadow-md ">Drift in</button>
            </section>
        </nav>
    );
  }  