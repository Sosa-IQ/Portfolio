"use client";
import React from 'react'
import { InfiniteMovingCards } from './ui/InfiniteMovingCards'
import { techStack, workExperience } from '@/data'
import { Button } from './ui/MovingBorder'
import MagicButton from './ui/MagicButton'
import { FaFileDownload } from 'react-icons/fa'

const Resume = () => {
  return (
    <div className="flex flex-col pt-12 pb-5" id="resume">
        <div className="flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
              Always trying to improve
          </p>
          <h1 className="heading mb-2">
              My <span className=" text-cyan-300">Tech Stack</span>
          </h1>
        </div>
        <InfiniteMovingCards
            items={techStack}
            direction="left"
            speed="slow"
            pauseOnHover={false}
        />
        <div className="py-6 flex flex-col items-center justify-center">
          <h1 className="heading">
            My Recent <span className="text-cyan-300">Work Experience</span>
          </h1>

          <div className="w-full mt-6 grid lg:grid-cols-4 grid-cols-1 gap-10">
            {workExperience.map((card) => (
              <Button 
                key={card.id}
                duration={Math.floor(Math.random() * 10000) + 10000}
                borderRadius='1.75rem'
                className="flex-1 text-white border-neutral-200 dark:border-slate-800"
              >
                <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
                  <img src={card.thumbnail} alt={card.thumbnail} className="lg:w-32 md:w-20 w-16" />
                  <div className="lg:ms-5">
                    <h1 className="text-start text-xl md:text-2xl font-bold">
                      {card.title}
                    </h1>
                    <p className="text-start text-white-100 mt-3 font-semibold">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          <a href="/Jancarlos_Sosa_Resume.pdf" download>
            <MagicButton
              title="Download Resume"
              icon={<FaFileDownload />}
              position="right"
            />
          </a>
        </div>
    </div>
  )
}

export default Resume