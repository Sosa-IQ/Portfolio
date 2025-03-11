"use client";
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'

const Contact = () => {
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value
        };
        const JSONdata = JSON.stringify(data);
        const endpoint = "api/send";

        // Form the request for sending data to the user
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSONdata
        };

        const response = await fetch(endpoint, options);
        const resData = await response.json();
        console.log(resData);

        if (response.status === 200) {
            console.log("Message sent successfully");
            setEmailSubmitted(true);
        }
    };
  return (
    <section className="grid md:grid-cols-2 mt-12 md:mt-12 md:pt-10 lg:pt-10 gap-4 relative overflow-y-clip" id="contact">
        <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500 to-transparent rounded-full h-60 w-60 md:h-96 md:w-96 lg:h-96 lg:w-96 z-0 blur-lg absolute -bottom-[96] md:-bottom-[150] lg:-bottom-[150] left-5 md:left-14 lg:left-8 transform -translate-x-1/2 -translate-1/2"></div>
        <div className='z-10 mb-6'>
            <h5 className="text-xl font-bold text-white my-2">
                Let&apos;s <span className="text-cyan-300">Connect</span>
            </h5>
            <p className="text-slate-300 mb-4 max-w-md">
                I&apos;m always open to new opportunities and collaborations. Feel free to reach out to me or just to say hi. Let&apos;s build something great together!
            </p>
            <div className="flex flex-row gap-2">
                <Link href="https://github.com/Sosa-IQ">
                    <Image src="GitHub.svg" alt="Github Icon" width={32} height={32} />
                </Link>
                <Link href="https://www.linkedin.com/in/jancarlos-sosa/">
                    <Image src="LinkedIn.svg" alt="LinkedIn Icon" width={32} height={32} />
                </Link>
            </div>
        </div>
        <div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="email" className="text-white block text-sm font-medium mb-2">Your email</label>
                    <input 
                        name='email'
                        type='email' 
                        id="email" 
                        required 
                        className=" bg-black-200 border border-white/[0.2] placeholder-slate-400 text-gray-100 text-sm rounded-lg block w-full p-2.5"
                        placeholder='abc123@gmail.com'
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="subject" className="text-white block text-sm font-medium mb-2">Subject</label>
                    <input 
                        name='subject'
                        type='text' 
                        id="subject" 
                        required 
                        className=" bg-black-200 border border-white/[0.2] placeholder-slate-400 text-gray-100 text-sm rounded-lg block w-full p-2.5"
                        placeholder='Interested in collaborating'
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor='message' className='text-white block text-sm mb-2 font-medium'>Message</label>
                    <textarea
                        name='message'
                        id='message'
                        required
                        className='bg-black-200 border border-white/[0.2] placeholder-slate-400 text-gray-100 text-sm rounded-lg block w-full p-2.5'
                        placeholder='Your message here...'
                    />
                </div>
                <button
                    type='submit'
                    className='bg-cyan-300 text-black-100 text-sm font-semibold rounded-lg p-2.5 w-full'
                >
                    Send Message
                </button>
                {
                    // if email is submitted, show this message
                    emailSubmitted && (
                        <p className='text-green-500 text-sm mt-2'>
                            Email sent successfully!
                        </p>
                    )
                }
            </form>
        </div>
        <div></div>
        <div className='flex md:flex-row flex-col justify-center items-center md:justify-end lg:justify-end mt-28 md:mt-60'>
            <p className='md:text-base text-small md:font-normal font-light text-gray-400'>Copyright © 2025 Jancarlos</p>
        </div>
    </section>
  )
}

export default Contact