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

## Architecture overview

The system is a distributed application based on a Client-Server architecture designed for high-performance, adaptive rendering of an Infinite Canvas. The central challenge is maintaining a single, consistent Viewport State across both rendering modes.

1. Core Compnoents
* React JS - Client
* Python - Server
* Websocket - Communication

2. Adaptive Rendering Pipeline
The system uses a threshold to fluidly transition between two distinct rendering paths:

Vector Rendering (Client-Side)
* Purpose: Used for low complexity and high interactivity.
* Logic: When the zoom level is below the switching threshold ($\text{zoom} \le 5.9$).
* Process: The client renders star points and coordinates directly onto an HTML <canvas> element. This utilizes the client’s GPU/CPU for instant feedback during panning and zooming.

Raster Rendering (Server-Side)
* Purpose: Used for high detail and high complexity.
* Logic: When the zoom level is at or above the switching threshold ($\text{zoom} \ge 6$).
* Process: The client streams its current Viewport State to the server. The server generates a single, high-resolution image (raster frame) for that exact viewport area and streams it back. This offloads heavy computation and drawing (e.g., millions of overlapping points) from the client browser.

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

## Thoughts

I choose the star map for ease of implementation and familiarize the concept of infinite canvas and this way i can implement it faster. After going through to development it just popup on mind since i'm doing the star map might as well have the concept of space adventure. I've added a rocket ship into the center of the canvas and it follows to the direction on where you navigate/pan to make this experience little immersive.

Now here comes to the core part of the project, the generating of random stars. At first i thought making an API from my server to generate this initial stars to the vector but that beats the purpose of the client side rendering and also this may cause performance issue since it will be requesting star on every pan. And now I'm struggling on the right approach on generating the stars but at the end it just hit me "hey why not send just send the current stars that are on the viewport I can just generate them on the image as long i have their coordinates". Then came a new problem the when generating the raster frame the alignment of the stars were way way too off. The problem is the Vector space is at the center of the and my Raster space is using the top-left corner of the screen and the final result is? they are not on the same coordinate system. To solve this I've just match the Raster to my Vector coordinate system.

It's a great test project, I really enjoyed building it. I've learn a lot of skills on this test. 

## Author

[Eduardo Bautista](https://www.linkedin.com/in/bautistaeduardo/)