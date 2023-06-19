import { LocationList } from '@/components/LocationList';
import Head from 'next/head';
import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import locationData from './locations.json';

const locations = locationData as [string, number][];

export default function Home() {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>Where Mohamed&apos;s Twitter network lives</title>
      </Head>
      <div className='min-h-screen bg-gradient-to-r from-cyan-400 to-light-blue-500 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 sm:p-0'>
        <div className='fixed top-4 right-4'>
          <ThemeToggle />
        </div>
        <LocationList locations={locations} />
      </div>
    </>
  );
}
