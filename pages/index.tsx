import { LocationList } from '@/components/LocationList';
import Head from 'next/head';
import React from 'react';
type Locations = [string, number][];

interface HomeProps {
  locations: Locations | null;
  error: string | null;
}

export default function Home({ locations, error }: HomeProps) {
  if (error) {
    return <div className='text-center mt-20'>Error: {error}</div>;
  }

  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>Where Mohamed&apos;s Twitter network lives</title>
      </Head>
      <div className='min-h-screen bg-gradient-to-r from-cyan-400 to-light-blue-500 flex items-center justify-center'>
        {locations ? (
          <LocationList locations={locations} />
        ) : (
          <div className='text-center mt-20'>Error: {error}</div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res }: any) {
  try {
    // cache for 2 days
    res.setHeader('Cache-Control', 's-maxage=172800, stale-while-revalidate');
    const response = await fetch(`${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL}/api/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const locations = await response.json();
    return {
      props: {
        locations,
        error: null,
      },
    };
  } catch (error: any) {
    return {
      props: {
        locations: null,
        error: error.message,
      },
    };
  }
}
