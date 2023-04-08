import json
import operator
import re
import tweepy
import os
import webbrowser
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




def addlocations(thelist, locations, mutes):

    for member in thelist:

        if member.id in mutes:
            continue

        location = member.location
        if location != '':
            fulllocation = "\'" + location + "\'"
            all_locations = re.split(
                r', | \/ | \ | \\ | & | \+ | and |\| | ·', location)
            if len(all_locations) > 1:
                all_locations.append(fulllocation)
            for l in all_locations:
                if l is None:
                    continue
                l = l.strip()

                if len(l) > 3:
                    # if it's a full word, then standarise its case
                    l = l.lower().capitalize()
                    # else it's probably an abbreviation, so uppercase
                    # it
                else:
                    l = l.upper()

                if l in locations:
                    locations[l] += 1
                else:
                    locations[l] = 1

    return locations


def get_popular_friends_locations():
    locations = {}

    main_list = api.get_list_members(list_id=main_list_id, count=5000)

    mutes = api.get_muted_ids()

    locations = addlocations(main_list, locations, mutes)
    locations = addlocations(myfriends, locations, mutes)

    locations = {k: v for k, v in locations.items() if v >=
                 locations['Berlin']}
    mostcommon = sorted(locations.items(),
                        key=operator.itemgetter(1), reverse=True)

    return json.dumps(mostcommon)
