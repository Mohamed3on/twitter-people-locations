import { LocationList } from '@/components/LocationList';
import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL || '',
  process.env.SUPABASE_API_KEY || ''
);

async function fetchLocationData() {
  // Fetch the latest counts
  let { data: latestCounts, error: latestError } = await supabase
    .from('location_data_summary')
    .select('*')
    .order('latest_count', { ascending: false });

  console.log(latestCounts);

  if (latestError) {
    console.error(latestError);
    return;
  }

  // Combine and process the data in TypeScript
  const processedData = latestCounts?.map((latest) => {
    return {
      location: latest.location,
      latestCount: latest.latest_count,
      oldestCount: latest.oldest_count,
      countChange: latest.count_difference,
      oldestTimestamp: latest.oldest_timestamp,
    };
  });

  return processedData;
}

export default async function Home() {
  const locationData = await fetchLocationData();

  return (
    <div className='min-h-screen bg-gradient-to-r from-cyan-400 to-light-blue-500 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 sm:p-0'>
      <LocationList locations={locationData!} />
    </div>
  );
}
