import json
import operator
import re
import tweepy
import os
from dotenv import load_dotenv

load_dotenv()

consumer_key = os.getenv("CONSUMER_KEY")
consumer_secret = os.getenv("CONSUMER_SECRET")
access_token = os.getenv("ACCESS_TOKEN")
access_token_secret = os.getenv("ACCESS_TOKEN_SECRET")
main_list_id = "815723390048866304"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, wait_on_rate_limit=True)
myfriends = api.get_friends(count=200)


normalizations = {
    "CA": "California",
    "Los angeles": "Los Angeles",
    "NYC": "New York",
    "TX": "Texas",
    "UK": "United Kingdom",
    "Austin": "Austin",
    "MA": "Massachusetts",
    "FL": "Florida",
    "New york city": "New York",
    "DC": "Washington D.C.",
    "SF": "San Francisco",
    "Washington dc": "Washington D.C.",
    "US": "United States",
    "D.c.": "Washington D.C",
    "va": "Virginia",
    "TN": "Tennessee",
    "NJ": "New Jersey",
    "BC": "British Columbia",
    "Oh": "Ohio",
    "Mn": "Minnesota",
    "PA": "Pennsylvania",
    "Usa": "United States",
    "Ny": "New York",
    "Co": "Colorado",
    "IL": "Illinois",
    "Nc": "North Carolina",
    "Or": "Oregon",
    "GA": "Georgia",
    "Ut": "Utah",
    "montréal": "montreal",
    "Québec": "Quebec",
    "WA": "Washington State",
}

hierarchy = {
    "Redmond": "Washington State",
    "England": "United Kingdom",
    "Bay Area": "California",
    "Colorado": "United States",
    "Manhattan": "New York",
    "Washington State": "United States",
    "Berkeley": "California",
    "California": "United States",
    "San Francisco": "California",
    "New York": "United States",
    "Los Angeles": "California",
    "Seattle": "Washington State",
    "Austin": "Texas",
    "Berlin": "Germany",
    "London": "England",
    "Washington D.C.": "United States",
    "Brooklyn": "New York",
    "Boston": "Massachusetts",
    "Chicago": "Illinois",
    "Miami": "Florida",
    "Mountain View": "California",
    "Palo Alto": "California",
    "Sydney": "Australia",
    "Amsterdam": "The Netherlands",
    "San Diego": "California",
    "Philadelphia": "Pennsylvania",
    "Oakland": "California",
    "Stanford": "California",
    "Portland": "Oregon",
    "Silicon Valley": "California",
    "Paris": "France",
    "Salt Lake City": "Utah",
    "Texas": "United States",
    "Florida": "United States",
    "Toronto": "Ontario",
    "Ontario": "Canada",
    "Ohio": "United States",
    "Minnesota": "United States",
    "British Columbia": "Canada",
    "New Jersey": "United States",
    "Munich": "Germany",
    "Illinois": "United States",
    "Pennsylvania": "United States",
    "Utah": "United States",
    "Cairo": "Egypt",
    "Virginia": "United States",
    "Denver": "Colorado",
    "Menlo Park": "California",
    "Nashville": "Tennessee",
    "Atlanta": "Georgia",
    "Stockholm": "Sweden",
    "montreal": "Quebec",
    "Quebec": "Canada",
    "Ottawa": "Ontario",
    "bellevue": "Washington State",
}


def addlocations(thelist, locations, mutes):
    # Transform the keys and values in the normalizations dictionary to lower case.
    normalizations_lower = {k.lower(): v.lower() for k, v in normalizations.items()}
    hierarchy_lower = {k.lower(): v for k, v in hierarchy.items()}

    def increment_location(loc):
        """A helper function to increment a location and its parent."""
        if loc not in encountered_locations:
            if loc in locations:
                locations[loc] += 1
            else:
                locations[loc] = 1
            encountered_locations.add(loc)

            if loc in hierarchy_lower:
                parent_location = hierarchy_lower[loc]
                increment_location(parent_location.lower())

    for member in thelist:
        if member.id in mutes:
            continue

        location = member.location.lower()
        if location != "":
            all_locations = re.split(r", | \/ | \ | \\ | & | \+ | and |\| | ·", location)
            all_locations = [loc.strip() for loc in all_locations if loc.strip() != ""]

            encountered_locations = set()
            for loc in all_locations:
                # Normalize the location using the normalizations dictionary
                if loc in normalizations_lower:
                    loc = normalizations_lower[loc]

                increment_location(loc)

    return locations


def get_popular_friends_locations():
    locations = {}

    main_list = api.get_list_members(list_id=main_list_id, count=5000)

    mutes = api.get_muted_ids()

    locations = addlocations(main_list, locations, mutes)
    locations = addlocations(myfriends, locations, mutes)

    locations = {k.title(): v for k, v in locations.items() if v >= 5}

    mostcommon = sorted(locations.items(), key=operator.itemgetter(1), reverse=True)

    return json.dumps(mostcommon)
