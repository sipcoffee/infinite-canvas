# Responsible for raster generation based on viewport
from PIL import Image, ImageDraw
import io
import base64
FRAME_COUNTER = 0
def generate_frame(viewport, stars=None):

    global FRAME_COUNTER
    FRAME_COUNTER += 1
    w = max(64, int(viewport.get('width', 800)))
    h = max(64, int(viewport.get('height', 600)))
    img = Image.new('RGB', (w, h), (3,3,10))
    draw = ImageDraw.Draw(img)

    zoom = viewport.get('zoom', 1)
    x0 = viewport.get('x', 0)
    y0 = viewport.get('y', 0)
    # compute density from zoom
    density = int(0.0005 * w * h * min(8, zoom))
    density = max(80, min(5000, density))
    # use a simple hash to pseudo-seed
    seed = int((x0 + y0) * 13.37 + zoom * 7.91) & 0xffffffff
    import random
    rng = random.Random(seed)
    for i in range(density):
        sx = rng.uniform(-w/2, w/2)
        sy = rng.uniform(-h/2, h/2)
        # map to world coords and then to screen so the image matches vector's    mapping.
 
        world_x = x0 + sx / zoom
        world_y = y0 + sy / zoom
        screen_x = (world_x - x0) * zoom + w/2
        screen_y = (world_y - y0) * zoom + h/2
        r = rng.random()
        size = max(0.4, rng.random() * 2 * min(1, zoom/2))
        c = int(180 + rng.random()*75)
        draw.ellipse([screen_x-size, screen_y-size, screen_x+size,
        screen_y+size], fill=(c,c,c))
        
    # small center marker so we can visually test alignment
    cx = w//2
    cy = h//2
    draw.ellipse([cx-2, cy-2, cx+2, cy+2], fill=(255,0,0))
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    encoded = base64.b64encode(buffer.getvalue()).decode('ascii')
    return { 'frameId': FRAME_COUNTER, 'image': encoded }