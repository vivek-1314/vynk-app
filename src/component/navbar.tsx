export default function Navbar() {
    return(
        <nav className="bg-[#fefffe] w-full flex justify-between items-center px-4 py-2 ">
            <section className=" flex items-center gap-1">
                <div className="w-[0.9rem] h-[0.9rem] rounded-full bg-black"></div>
                <span className="text-black text-lg funnel-semibold -tracking-wide">VYNK</span>
            </section>
            <section>
            <button
                onClick={() => window.open("https://mail.google.com/mail/?view=cm&to=vivek1314gurjar@gmail.com")}
                className="funnel-light text-white bg-black rounded-3xl px-3 py-[0.3rem] text-[0.8rem]"
                >
                Contact
                </button>
            </section>
        </nav>
    );
  }  