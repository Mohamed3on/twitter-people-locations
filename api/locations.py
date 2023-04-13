from http.server import BaseHTTPRequestHandler
from .twitterLocations import get_popular_friends_locations
import json




class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Cache-Control', 'max-age=172800, stale-while-revalidate=86400')
        self.end_headers()
        locations = get_popular_friends_locations()
        self.wfile.write(locations.encode())
        return
