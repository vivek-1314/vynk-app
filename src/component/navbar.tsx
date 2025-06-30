export default function Navbar() {
    return(
        <nav id="navbar" className="bg-[#fefffe] w-full flex justify-between h-[3vw] overflow-hidden items-center px-4 py-2 ">
            <section className="over flex items-center gap-1">
                <div className="w-[1.6rem] aspect-square flex justify-center items-center overflow-hidden rounded-full border-[1.7px] border-black ">
                   <img src="/images_assests/logo.jpeg" className="w-[1.2rem] scale-180 aspect-square rounded-full" alt="" /> 
                </div>
                <span className="text-black text-lg funnel-semibold -tracking-wide">VYNK</span>
            </section>
            <section>
            <button
                onClick={() => window.open("https://mail.google.com/mail/?view=cm&to=vivek1314gurjar@gmail.com")}
                className="relative funnel-light text-white bg-black rounded-3xl px-[1.6rem] py-[0.36rem] text-[0.8rem] hover:bg-black/20 border-2 border-white hover:border-black hover:text-black"
                >
                Contact Us
                </button>
            </section>
        </nav>
    );
  }  