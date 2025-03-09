import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'

const Hero = () => {
  return (
    <div className="pb-20 pt-36" id="about">
        <div>
            <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
            <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
            <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
        </div>

        <div className="h-screen w-full dark:bg-black-100 bg-white  dark:bg-grid-white/[0.03] bg-grid-black/[0.2] flex items-center justify-center absolute top-0 left-0">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>

        <div className="justify-between flex relative my-20 z-10 pb-[125]">
            <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col">
                {/* <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
                    Dynamic Web Magic with Next.js
                </h2> */}

                <TextGenerateEffect
                    className="text-[40px] md:text-5xl lg:text-6xl"
                    words="Hi, I'm Jancarlos Sosa"
                />
                <p className="max-w-[40vw] mt-1">
                    Finishing my last semester at the University of Connecticut. I am a Senior, majoring in Computer Science with a focus on Software Engineering. Passionate about creating software that will make a difference in the world. I am ready to dive into the industry, using my skills to create innovative software solutions.
                </p>
            </div>
            <div>
                <img src="/profile.png" className=" max-w-[28vw]" alt="Profile Picture"/>
            </div>
        </div>
    </div>
  )
}

export default Hero