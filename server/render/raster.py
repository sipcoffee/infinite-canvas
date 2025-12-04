# Responsible for raster generation based on viewport
from PIL import Image, ImageDraw
import io
import base64
import random
import math
from .utils import lerp, lerp_color

FRAME_COUNTER = 0

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

def generate_frame(viewport, stars):
    global FRAME_COUNTER
    FRAME_COUNTER += 1

    w = int(viewport.get("width", 800))
    h = int(viewport.get("height", 600))
    x = float(viewport.get("x", 0))
    y = float(viewport.get("y", 0))
    zoom = float(viewport.get("zoom", 1))

    # print(f'stars data len {len(stars)} and {stars}')
    num_vector_stars = len(stars)
    num_random_stars = int(num_vector_stars * 0.2)

    palette = [
        (0, 0, 53),
        (0, 0, 66),
        (0, 0, 83),
        (0, 0, 104),
        (28, 28, 132),
    ]
    black = (0, 0, 0)

    # -----------------------------
    # Compute the background color
    # -----------------------------
    if zoom <= 6:
        bg_color = (3, 3, 10)
    else:
        z = min(zoom, 10) - 6
        i = int(z)
        t = z - i

        if i >= len(palette) - 1:
            base_color = palette[-1]
        else:
            base_color = lerp_color(palette[i], palette[i+1], t)

        blend_to_black = min(max((zoom - 6) / 4, 0), 1)
        bg_color = lerp_color(base_color, black, blend_to_black)

    # -----------------------------
    # ALWAYS create image + draw
    # -----------------------------
    img = Image.new("RGB", (w, h), bg_color)
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


