import { LocationList } from '@/components/LocationList';
import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { addLocations, titleCaseWithAcronyms } from '@/utils/twitter';

export const revalidate = 60 * 60 * 2; // 2 hours

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

  // // log first 10 counts

  // console.log(latestCounts?.slice(0, 10));

  if (latestError) {
    console.error(latestError);
    return;
  }

  const sortedLatestCounts = await fetchMostPopularLocations();

  // make a map of location to oldest count +  oldestTimestamp

  const oldestLocationData = latestCounts?.reduce((acc, curr) => {
    acc[curr.location] = {
      oldestCount: curr.oldest_count,
      oldestTimestamp: curr.oldest_timestamp,
    };
    return acc;
  }, {});

  const processedData = sortedLatestCounts.map(([location, count]) => {
    return {
      location,
      latestCount: count || 0,
      oldestCount: oldestLocationData[location]?.oldestCount || 0,
      countChange: Number(count) - (oldestLocationData[location]?.oldestCount || 0),
      oldestTimestamp: oldestLocationData[location]?.oldestTimestamp,
    };
  });

  return processedData;
}
const bearerToken = process.env.TWITTER_BEARER_TOKEN;

const fetchListMembers = async (listId: string) => {
  const url = `https://api.twitter.com/1.1/lists/members.json?list_id=${listId}&count=5000`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

const fetchFollowingList = async (screen_name: string) => {
  const url = `https://api.twitter.com/1.1/friends/list.json?screen_name=${screen_name}&count=200`; // Adjust count as needed
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearerToken}`, // Ensure your bearerToken variable is correctly set
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

const getLatestLocations = async (username: string) => {
  const listMembers = await fetchListMembers(listId);
  console.log('fetching following list...');
  const users = await fetchFollowingList(username);

  const combinedUsers = [...users.users, ...listMembers.users];

  let rawLocations = addLocations(combinedUsers);

  // Filter locations
  let filteredLocations = Object.fromEntries(
    Object.entries(rawLocations).filter(([_, count]) => Number(count) >= 2)
  );

  // Title-case the locations
  let titledLocations = Object.fromEntries(
    Object.entries(filteredLocations).map(([k, v]) => [titleCaseWithAcronyms(k), v])
  );

  return titledLocations;
};

const fetchMostPopularLocations = async () => {
  // Title-case the locations
  let titledLocations = await getLatestLocations('mohamed3on');

  // Sort by most common
  const mostCommonLocations = Object.entries(titledLocations).sort((a, b) => b[1] - a[1]);

  await supabase
    .from('locations')
    .insert(mostCommonLocations.map(([location, count]) => ({ location, count })));

  return mostCommonLocations;
};

const listId = '815723390048866304';

export default async function Home() {
  const locationData = await fetchLocationData();

  return (
    <div className='min-h-screen bg-gradient-to-r from-cyan-400 to-light-blue-500 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 sm:p-0'>
      <LocationList locations={locationData!} />
    </div>
  );
}
