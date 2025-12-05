## Orbital Navigator

## Pre-requisites
*  Python 13.13.9 or higher
*  Node v22.19.0 or higher

## 📄 Instruction to run Locally (README)

Clone the repository into your project:

Clone the repository
```
git clone https://github.com/sipcoffee/infinite-canvas.git
```

Setup the server
```
cd server
```

Install the dependency on the server
```
pip install -r -requirements.txt
```

Run the server
```
uvicorn core.asgi:application --host 0.0.0.0 --port 8000
```

Setup the client
```
cd client
```

Install dependency
```
npm install
```

Run the client
```
npm run dev
```

Access link
```
http://localhost:5173/
```

## Architecture


## Switching threshold

The client switches (Raster Mode) when the viewport's zoom level exceeds a certain value (e.g., $Zoom > 6.0$), indicating a highly detailed or "zoomed-in" view. Conversely, it switches back to (Vector) when the zoom level drops below a lower bound (e.g., $Zoom < 6$) to avoid rapid flickering.

## Handshake protocol description

The stars array is included as an additional parameter in the handshake protocol only when the viewport zoom level is greater than 6. This array provides the location of each star from the last vector, ensuring the generated raster frame is consistent with the preceding vector output under high-zoom conditions.

Client ⟶ Server

The client sends a renderRequest to the server, conditionally including star data.
```json
{
    "type": "renderRequest",
    "viewport": 
        { 
            "x": 0, 
            "y": 0, 
            "width": 1000, 
            "height": 800,
            "zoom": 6
        },
    "stars": [
        "array of stars",
        {
            "id": 18056,
            "x": 124.82331383681932,
            "y": -35.08431380469412,
            "size": 0.8551301635851278,
            "brightness": 0.6680697486082173,
            "pulsePhase": 9.505035335649447,
            "pulseSpeed": 0.02464285468762396,
            "pulseAmp": 0.25,
            "color": "#ffffff"
        }
    ]
}
```

Server ⟶ Client

The server sends the frame response, including viewport parameters for client monitoring.

Introduced x, y, height, width, and zoom to the frame response payload to communicate the current raster viewport settings to the client.
```json
{
    "type": "frame",
    "frameId": 2,
    "image": "base64",
    "width": 1040,
    "height": 750,
    "x": 111.91151323587836,
    "y": -40.98626308145075,
    "zoom": 6.866040888412039
}
```

## Smooth Transition of Vector ⟶ Raster

The rendering engine transitions between Vector Mode and Raster Mode using an intentional zero-duration hard cut. This ensures the switch happens instantly, with no fade, blending, or transitional animation.

🔒 Latency Hiding via Last-Frame Hold

To avoid visual gaps during the raster request round-trip, the system uses a Last-Frame Hold technique:

When the viewport crosses the zoom threshold, the client sends a raster request to the server.

Until the first raster frame is received, the Vector Layer stays visible and frozen (showVector = true), ensuring that the screen never flashes white or appears empty.

⚡ Hard Cut Execution

As soon as the raster frame arrives from the server, the system performs an immediate mode swap:

showVector → false

showRaster → true

Both changes occur in the same render cycle, producing an instantaneous visual jump from Vector to Raster. No animation. No crossfade. No delay.

This guarantees that content is always visible, while still achieving a clean, sharp, one-frame switch between rendering modes.

