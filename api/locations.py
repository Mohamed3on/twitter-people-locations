from http.server import BaseHTTPRequestHandler
from .twitterLocations import get_popular_friends_locations
import json




class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Cache-Control', 'max-age=0, s-maxage=86400, stale-while-revalidate')
        self.end_headers()
        locations = get_popular_friends_locations()
        self.wfile.write(locations.encode())
        return
