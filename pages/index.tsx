import React from 'react';

type Props = {
  locations: Array<[string, number]>;
};

export default function Home({ locations }: Props) {
  if (locations) {
    return (
      <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
        <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
          <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
          <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
            <h1 className='text-4xl font-bold text-center mb-4'>
              Popular Twitter Friends Locations
            </h1>
            <ul className='space-y-4'>
              {locations.map((location, index) => (
                <li key={index} className='flex justify-between items-center'>
                  <span className='text-xl font-semibold'>{location[0]}</span>
                  <span className='bg-blue-500 text-white font-semibold py-1 px-3 rounded'>
                    {location[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export async function getServerSideProps() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL}/api/locations`);
    const locations = await response.json();

    return {
      props: {
        locations,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        locations: null,
      },
    };
  }
}
