import Head from 'next/head';
import React, { useState, useEffect, startTransition } from 'react';
type Location = [string, number];
type Locations = Location[];

const formatLocation = (location: string) => {
  let formattedLocation = location.replace(/'/g, '');
  const parts = formattedLocation.split(', ');

  if (parts.length > 1) {
    formattedLocation = parts
      .map((part, index) => {
        return index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part.toUpperCase();
      })
      .join(', ');
  }

  return formattedLocation;
};

export default function Home() {
  const [locations, setLocations] = useState<Locations | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL}/api/locations`)
      .then((response) => response.json())
      .then((locations) => {
        setLocations(locations);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Where Mohamed&apos;s Twitter network lives</title>
      </Head>
      {locations ? (
        <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
          <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
            <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
            <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
              <h1 className='text-4xl font-bold text-center mb-4'>
                Where Mohamed&apos;s Twitter Friends live
              </h1>
              <ul className='space-y-4'>
                {locations.map((location, index) => (
                  <li key={index} className='flex justify-between items-center'>
                    <span className='text-xl font-semibold'>{formatLocation(location[0])}</span>
                    <span className='bg-blue-500 text-white font-semibold py-1 px-3 rounded'>
                      {location[1]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className='text-center mt-20'>Loading...</div>
      )}
    </>
  );
}
