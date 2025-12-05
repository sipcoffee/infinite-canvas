# Responsible for raster generation based on viewport
from PIL import Image, ImageDraw, ImageColor
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
    # Draw provided VECTOR stars in raster mode (scaled by zoom)
    # ---------------------------------------------------------
    for star in stars:
        worldX = star["x"]
        worldY = star["y"]

        # convert to screen coordinates
        screenX = (worldX - x) * zoom + w / 2
        screenY = (worldY - y) * zoom + h / 2

        # skip stars outside viewport
        if not (0 <= screenX <= w and 0 <= screenY <= h):
            continue

        # scaling size in raster mode
        size = star["size"] * zoom
        outer_radius = size
        inner_radius = size * 0.5

        # vector colors are hex → convert
        fill_color = ImageColor.getrgb(star["color"])

        draw_star_polygon(
            draw,
            screenX,
            screenY,
            outer_radius,
            inner_radius,
            fill_color
        )

    # encode PNG
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")

    return {"frameId": FRAME_COUNTER, "image": encoded}


