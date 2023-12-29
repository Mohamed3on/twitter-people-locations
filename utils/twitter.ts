export const processLocation = (location: string, locations: { [key: string]: number }) => {
  const processedLocations = location
    .toLowerCase()
    .split(/\s*[,\/\\&\+|·]+\s*|and\s+/)
    .map((l) => l.trim())
    .filter((l) => l);

  processedLocations.forEach((l) => {
    locations[l] = (locations[l] || 0) + 1;
  });
};

export const addLocations = (
  theList: {
    location: string;
  }[]
): {
  [key: string]: number;
} => {
  const locations = {};
  theList.forEach((member) => {
    if (member.location) {
      processLocation(member.location, locations);
    }
  });
  return locations;
};

export function titleCaseWithAcronyms(str: string) {
  // If the location is an acronym, Uppercase it (SF, USA, UK, etc.)
  if (str.length <= 3) {
    return str.toUpperCase();
  }
  return str
    .split(' ')
    .map((word) => {
      // Otherwise, title case the location
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
