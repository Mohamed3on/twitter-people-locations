import React from 'react';
export type Location = {
  location: string;
  latestCount: number;
  oldestCount: number;
  countChange: number;
};

interface LocationListProps {
  locations: Location[];
}

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

const determineEmoji = (countChange: number | null) => {
  if (countChange === null || countChange === 0) return '';
  return countChange > 0 ? '🔥' : '❄️';
};

const formatChange = (countChange: number | null) => {
  if (countChange === null || countChange === 0) return '';
  return countChange > 0 ? `+${countChange}` : `${countChange}`;
};

export const LocationList: React.FC<LocationListProps> = ({ locations }) => {
  return (
    <div className='min-h-screen py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 dark:from-gray-700 dark:to-gray-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20'>
          <h1 className='text-4xl font-bold text-center mb-4 dark:text-gray-200'>
            Where Mohamed&apos;s Twitter Friends live
          </h1>
          <ul className='space-y-4'>
            {locations.map((location, index) => (
              <li key={index} className='flex justify-between items-center'>
                <span className='text-xl font-semibold dark:text-gray-200'>
                  {formatLocation(location.location)}
                </span>
                <div className='flex items-center space-x-2'>
                  <span className=' text-gray-600 font-semibold py-1 px-3   text-center'>
                    {location.latestCount}
                  </span>
                  <span
                    className={`font-semibold w-8 text-center ${
                      location.countChange > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {location.countChange !== null && location.countChange !== 0
                      ? formatChange(location.countChange)
                      : ''}
                  </span>
                  <span className='w-5 text-center'>{determineEmoji(location.countChange)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
