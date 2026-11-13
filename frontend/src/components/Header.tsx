import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import banner from '../assets/banner.png';

function Header() {
  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-4">
      <div className="flex flex-col-reverse lg:flex-row items-center mt-8 lg:mt-12 gap-12 lg:gap-24">
        <div className="flex flex-col gap-5 flex-1">
          <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-gray-800 dark:text-gray-100 leading-tight">
            Empower Your Support Experience with{' '}
            <span className="text-primary dark:text-primary">SafeSpark</span>
          </h1>
          <p className="text-lg lg:text-[20px] text-gray-600 dark:text-gray-300 leading-relaxed">
            At SafeSpark, we&apos;re dedicated to ensuring every issue gets
            the attention it deserves. Discreetly report distress situations,
            consult our 24/7 legal bot, or find solace with our confidential
            empathetic AI therapist. Your safety journey starts here.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/create-post"
              prefetch={false}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-burgundy-500 to-burgundy-400 text-lg text-beige-50 rounded-lg shadow-md transform hover:scale-105 duration-200 ease-in-out font-semibold"
            >
              Report Now (Discreet SOS)
            </Link>
            <Link
              href="/lawbot"
              prefetch={false}
              className="inline-flex items-center justify-center px-6 py-3 text-lg text-primary dark:text-primary rounded-lg border border-primary dark:border-primary shadow-md transform hover:scale-105 hover:bg-primary hover:text-white duration-200 ease-in-out font-semibold"
            >
              Ask Law Bot
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src={banner}
            width={500}
            height={500}
            alt="SafeSpark banner"
            className="scale-x-[-1] max-w-full h-auto drop-shadow-md"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
