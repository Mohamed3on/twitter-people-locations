import { LocationList } from '@/components/LocationList';
import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL || '',
  process.env.SUPABASE_API_KEY || ''
);

async function fetchLocationData() {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  // Fetch the latest counts
  let { data: latestCounts, error: latestError } = await supabase
    .from('locations')
    .select('location, count')
    .order('timestamp', { ascending: false });

  if (latestError) {
    console.error(latestError);
    return;
  }

  // Fetch counts from approximately a week ago
  let { data: weekAgoCounts, error: weekAgoError } = await supabase
    .from('locations')
    .select('location, count')
    .gte('timestamp', tenDaysAgo.toISOString())
    .lte('timestamp', fiveDaysAgo.toISOString())
    .order('timestamp', { ascending: false });

  if (weekAgoError) {
    console.error(weekAgoError);
    return;
  }

  // Combine and process the data in TypeScript
  const processedData = latestCounts?.map((latest) => {
    const weekAgoData = weekAgoCounts?.find((w) => w.location === latest.location);
    return {
      location: latest.location,
      latestCount: latest.count,
      weekAgoCount: weekAgoData ? weekAgoData.count : null,
      difference: weekAgoData ? latest.count - weekAgoData.count : null,
    };
  });

  // Sort by latest count
  processedData?.sort((a, b) => b.latestCount - a.latestCount);

  return processedData;
}

export default async function Home() {
  const locationData = await fetchLocationData();

  return (
    <div className='min-h-screen bg-gradient-to-r from-cyan-400 to-light-blue-500 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 sm:p-0'>
      <LocationList
        locations={locationData!.map((location) => [location.location, location.latestCount])}
      />
    </div>
  );
}
