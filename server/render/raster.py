# Responsible for raster generation based on viewport
from PIL import Image, ImageDraw
import io
import base64
import random
import math


CHUNK_SIZE = 512             # world units
STARS_PER_CHUNK = 40         # adjustable
FRAME_COUNTER = 0

def mulberry32(seed):
    def rng():
        nonlocal seed
        seed = (seed + 0x6D2B79F5) & 0xffffffff
        t = seed
        t = (t ^ (t >> 15)) * (t | 1)
        t &= 0xffffffff
        t ^= t + (t ^ (t >> 7)) * (t | 61)
        return ((t ^ (t >> 14)) & 0xffffffff) / 2**32
    return rng

def get_chunk_seed(cx, cy):
    return ((cx * 73856093) ^ (cy * 19349663)) & 0xffffffff


def generate_chunk_stars(cx, cy):
    seed = get_chunk_seed(cx, cy)
    rng = mulberry32(seed)

    stars = []
    for _ in range(STARS_PER_CHUNK):
        x = cx * CHUNK_SIZE + rng() * CHUNK_SIZE
        y = cy * CHUNK_SIZE + rng() * CHUNK_SIZE
        brightness = rng()
        size = 0.8 + brightness * 1.5

        stars.append({
            "x": x,
            "y": y,
            "size": size,
            "brightness": brightness
        })
    
    return stars

def get_stars_for_viewport(viewport):
    x = viewport["x"]
    y = viewport["y"]
    zoom = viewport["zoom"]
    width = viewport["width"]
    height = viewport["height"]

    world_w = width / zoom
    world_h = height / zoom

    left = x - world_w / 2
    right = x + world_w / 2
    top = y - world_h / 2
    bottom = y + world_h / 2

    cx0 = int(left // CHUNK_SIZE)
    cx1 = int(right // CHUNK_SIZE)
    cy0 = int(top // CHUNK_SIZE)
    cy1 = int(bottom //CHUNK_SIZE)

    stars = []
    for cx in range(cx0, cx1+1):
        for cy in range(cy0, cy1+1):
            stars.extend(generate_chunk_stars(cx, cy))

    return stars


def draw_star_polygon(draw, center_x, center_y, outer_radius, inner_radius, fill_color):
    """Calculates and draws a 5-pointed star polygon."""
    num_points = 5
    
    # Start angle: 270 degrees (3 * PI / 2) for an upright star
    rot = (math.pi / 2) * 3 
    step = math.pi / num_points # Angle step between points (36 degrees)

    points = []
    for i in range(num_points):
        # Outer point
        x_out = center_x + math.cos(rot) * outer_radius
        y_out = center_y + math.sin(rot) * outer_radius
        points.append((x_out, y_out))
        rot += step

        # Inner point
        x_in = center_x + math.cos(rot) * inner_radius
        y_in = center_y + math.sin(rot) * inner_radius
        points.append((x_in, y_in))
        rot += step

    # draw.polygon expects a list of (x, y) tuples
    draw.polygon(points, fill=fill_color)

def generate_frame(viewport):
    global FRAME_COUNTER
    FRAME_COUNTER += 1
    print(f'generating new frame and viewport value is {viewport}')
    # ---------------------------------------------------------
    # Extract viewport params
    # ---------------------------------------------------------
    w = int(viewport.get("width", 800))
    h = int(viewport.get("height", 600))
    print(f'wid: {w} and hei: {h}')
    print(type(viewport.get("x", 0)), type(viewport.get("y", 0)))
    x = float(viewport.get("x", 0))      # world X
    y = float(viewport.get("y", 0))      # world Y
    zoom = float(viewport.get("zoom", 1))

    # Create canvas
    img = Image.new("RGB", (w, h), (3, 3, 10))
    draw = ImageDraw.Draw(img)

    # ---------------------------------------------------------
    # Define the WORLD BOUNDS shown in this viewport
    # ---------------------------------------------------------
    world_w = w / zoom
    world_h = h / zoom

    world_left = x
    world_top = y
    world_right = x + world_w
    world_bottom = y + world_h

    # ---------------------------------------------------------
    # Deterministic seed so stars do not change on each pan
    # ---------------------------------------------------------
    seed = (int(x * 31) ^ int(y * 131) ^ int(zoom * 977)) & 0xffffffff
    rng = random.Random(seed)

    # Density scaled by zoom
    density = int(min(5000, max(15, (world_w * world_h) * 0.0004 * zoom)))

    # ---------------------------------------------------------
    # Generate stars INSIDE the world rectangle
    # ---------------------------------------------------------
    for _ in range(density):
        # pick a world coordinate inside viewport world-rect
        worldX = rng.uniform(world_left, world_right)
        worldY = rng.uniform(world_top, world_bottom)

        # convert world -> screen coords
        screenX = (worldX - world_left) * zoom
        screenY = (worldY - world_top) * zoom

        # star size scales with zoom
        size = max(0.9, rng.random() * (2.4 * zoom))
        outer_radius = size
        inner_radius = size * 0.5

        c = int(180 + rng.random() * 75)
        fill_color = (c, c, c)

        draw_star_polygon(draw, screenX, screenY, outer_radius, inner_radius, fill_color)

    # ---------------------------------------------------------
    # Draw center dot for testing alignment
    # ---------------------------------------------------------
    cx = w // 2
    cy = h // 2
    draw.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=(255, 0, 0))

    # encode PNG
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")

    return {"frameId": FRAME_COUNTER, "image": encoded}