import { motion } from "framer-motion";


export default function Footer() {

    const menuLinks = [
  { label: "About Vynk", href: "#about-vynk" },
  { label: "How It Works", href: "#How It Works" },
  { label: "Blog / Updates", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "#navbar" }
];
    const footerLinks = [
  { label: "Help Center", href: "/about" },
  { label: "Discord", href: "/how-it-works" },
  { label: "Privacy Policy", href: "/blog" },
  { label: "Terms of Service", href: "/careers" },
  { label: "FAQ", href: "/contact" }
];



    return (
        <main>
            <div className="sm:flex sm:justify-between sm:pt-10 sm:px-10 px-8 py-8 sm:rounded-t-3xl rounded-t-[1.4rem] w-full bg-[linear-gradient(158deg,_rgba(18,18,20,1)_17%,_rgba(120,28,35,1)_87%)]">
              <div className="">
                <span className='sm:text-[2.5vw] text-[1.2rem] funnel-regular'>Sync minds in real time ,</span><br />
                <span className='sm:text-[2.5vw] text-[1.2rem] funnel-regular'>or miss the moment</span><br />
                <span className='block mt-20 text-[2rem] funnel-semibold leading-0'>VYNK</span><br />
                <span className='inline mt-0 text-[12px] funnel-semibold'>© 2025 all rights reserved, Designed by vivek</span>
              </div>

              <div className="">
                <div className="flex sm:justify-start justify-between sm:items-start items-center sm:px-8 sm:gap-30 ">
                <div className="w-[50%] ">
                  <h4 className='mt-10 sm:mt-0 text-[1.3rem] funnel-regular text-[#a09797fa]  '>Explore</h4>
                  <ul className='mt-2'>
                    {
                        menuLinks.map((value , index) => {
                            return (
                                <motion.li key={index}
                                initial={{x:0 , y:0}}
                                whileHover={{
                                    x: 5,
                                    color: "#8c6951" ,
                                }}
                                transition={{
                                    x: { type: "spring", stiffness: 300 }
                                }}
                                className="mb-[0.2rem]">
                                    <a href={value.href} className="funnel-regular text-sm mt-2 ">{value.label}</a>
                                </motion.li>
                            )
                        })
                    }
                  </ul>
                </div>
                <div className="w-[50%]">
                  <h4 className='mt-10 sm:mt-0 text-[1.3rem] text-right sm:text-left text-[#a09797fa] funnel-regular'>Support</h4>
                  <ul className='mt-2'>
                    {
                        footerLinks.map((value , index) => {
                            return (
                                <motion.li key={index}
                                initial={{x:0 , y:0}}
                                whileHover={{
                                    x: 5,
                                    color: "#8c6951" ,
                                }}
                                transition={{
                                    x: { type: "spring", stiffness: 300 }
                                }}
                                className="whitespace-nowrap mb-[0.2rem]">
                                    <a href={value.href} className="funnel-regular text-sm mt-2 ">{value.label}</a>
                                </motion.li>
                            )
                        })
                    }
                  </ul>
                </div>
              </div>
                <hr className='mt-10 mx-auto border-[#a09797fa]' />
              </div>
            </div>
        </main>
    )
}