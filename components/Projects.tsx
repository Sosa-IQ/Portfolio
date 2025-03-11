import { projects } from '@/data'
import React from 'react'
import { PinContainer } from './ui/3d-pin'

const Projects = () => {
    const titles = ["Web", "Mobile", "Game"]
  return (
    <div className="relative" id="projects">
        <h1 className="heading">
            My <span className="text-cyan-300">Projects</span>
        </h1>
        <p className="uppercase tracking-widest text-xs text-blue-100 w-full text-center py-2">
            Built across platforms
        </p>
        <div className="flex flex-wrap items-center justify-center p-4 gap-x-24">
            {projects.map(({ id, title, des, img, iconLists, link, pin }, index) => (
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-2xl font-bold pb-2'>{titles[index]}</h1>
                <div key={id} className="min-h-[55vh] sm:min-h-[30rem] md:min-h-[30rem] lg:min-h-[32rem] flex items-center justify-center sm:w-[570px] w-[80vw] mb-12">
                    <PinContainer title={pin} href={link}>
                        <div className="relative flex items-center justify-center sm:w-[570px] w-[80vw] overflow-hidden sm:h-[40vh] h-[30vh] mb-10">
                            <div className="relative w-full h-full overflow-hidden lg:rounded-3xl bg=[#13162d]">
                                <img src="/bg.png" alt="bg-img" />
                            </div>
                            <img src={img} alt={title} className="z-10 absolute bottom-0"/>
                        </div>
                        <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                            {title}
                        </h1>

                        <p className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2">
                            {des}
                        </p>

                        <div className="flex items-center justify-between mt-7 mb-3">
                            <div className="flex items-center">
                                {iconLists.map((icon, index) => (
                                    <div 
                                        className="border border-white/[0.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex items-center justify-center" 
                                        style={{
                                            transform: `translateX(-${5 * index * 2} px)`
                                        }}
                                    >
                                        <img src={icon} alt={icon} className="p-2"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PinContainer>
                </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Projects