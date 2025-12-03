# Simple constants / helpers for the handshake
REQ_RENDER = 'renderRequest'
RES_FRAME = 'frame'
# Example: request format
# {
# "type": "renderRequest",
# "viewport": { "x": 0, "y": 0, "zoom": 3, "width": 1024, "height": 768 }
# }
# Response format
# {
# "type": "frame",
# "frameId": 1,
# "image": "<base64 PNG>"
# }
