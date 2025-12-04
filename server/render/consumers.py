from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .raster import generate_frame
from .protocol import REQ_RENDER, RES_FRAME


class RenderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket: client connected")
        await self.accept()

    async def disconnect(self, close_code):
        pass
    

    async def receive(self, text_data=None, bytes_data=None):
        print("WebSocket received:", json.dumps(text_data, indent=5))
        try:
            data = json.loads(text_data)
        except Exception:
            print('errrs')
            return
        
        if data.get('type') == REQ_RENDER:
            viewport = data.get('viewport', {})
            print(f'View port is x:{viewport['x']} and y:{viewport['y']}')
            
            viewport['width'] = int(viewport.get('width', 800))
            viewport['height'] = int(viewport.get('height', 600))
            frame = generate_frame(viewport)
            print('-----------------GENERATED NEW FRAME---------------------')

            await self.send(text_data=json.dumps({
                'type': RES_FRAME,
                'frameId': frame['frameId'],
                'image': frame['image'],
                'width': viewport['width'],
                'height': viewport['height'],
                'x': viewport['x'],
                'y': viewport['y'],
                'zoom': viewport['zoom']
            }))
