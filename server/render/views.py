from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
import string

# ------------------------------------------------
# SPACE-THEMED VIBE FUNCTIONS
# ------------------------------------------------

def echo_vibe(s):
    return f"[COMMS LINK ESTABLISHED] {s}"

def glitch_vibe(s):
    # Replace ~20% chars with cosmic static glyphs
    static = ['░', '▒', '▓', '█', '✦', '✧', '⋇']
    return "[STATIC] " + ''.join(
        ch if random.random() > 0.2 else random.choice(static)
        for ch in s
    )

def poetic_vibe(s):
    return f"🌌 \"{s}\" drifts across the void, trailing stardust in its wake."

def echo_loop_vibe(s):
    # Like a long-range signal bouncing between satellites
    return f"[ECHO] {s} … {s[:max(1,len(s)//2)]} … {s[:max(1,len(s)//4)]} …"

def cosmic_vibe(s):
    return f"✨ Galactic Intel: \"{s}\" detected. A distant nebula pulses in response."

def broken_oracle_vibe(s):
    # Ancient alien transmission
    runes = ["⊙", "⟑", "⟒", "⧉", "✷", "☼"]
    return f"{random.choice(runes)} Archaic star-oracle reverses your signal: '{s[::-1]}'"

def procedural_mutate_vibe(s):
    # Mutated like a corrupted warp-recording
    mutated = []
    cosmic_noise = "~*^%$#✦✧"
    for ch in s:
        r = random.random()
        if r < 0.10:
            mutated.append(random.choice(string.ascii_letters))
        elif r < 0.15:
            mutated.append(random.choice(cosmic_noise))
        else:
            mutated.append(ch)
    if random.random() < 0.3:
        mutated.append(" // drift anomaly detected")
    return ''.join(mutated)

def gremlin_vibe(s):
    # Mischievous alien stowaway
    return f"👾 heh… you broadcast '{s}'? brave human. noted in the cosmic logs."

def wave_distortion_vibe(s):
    # Like a message bent by a gravitational wave
    distorted = []
    for ch in s:
        if random.random() < 0.15:
            distorted.append(" " * random.randint(1,3) + ch)
        else:
            distorted.append(ch)
    return "[GRAV-WAVE] " + ''.join(distorted)

def captain_log_vibe(s):
    # Starship captain narrating your message
    return f"🛸 Captain’s Log: Received transmission — \"{s}\". Plotting star-map adjustments."

def rogue_pilot_vibe(s):
    # Cool outlaw pilot replying over a beat-up ship radio
    return f"🚀 Yo, message '{s}' came through on the dark-band channel. Keep your thrusters warm."

def starship_ai_vibe(s):
    # Calm, sterile AI aboard a mega-cruiser
    return f"[AURORA-AI] Input '{s}' confirmed. Optimizing quantum pathways."

def wormhole_whisper_vibe(s):
    # Spooky cosmic whisper from beyond known space
    return f"🌀 Through the wormhole, a faint voice echoes your words: “{s}…”"

def asteroid_miner_vibe(s):
    # Rough miner in the Belt hearing your message
    return f"⛏️ Belt Miner: Got your ping — '{s}'. Rocks been louder, but I hear ya."

# ------------------------------------------------
# VIBES LIST
# ------------------------------------------------
VIBES = [
    echo_vibe,
    glitch_vibe,
    poetic_vibe,
    echo_loop_vibe,
    cosmic_vibe,
    broken_oracle_vibe,
    procedural_mutate_vibe,
    gremlin_vibe,
    wave_distortion_vibe,
    captain_log_vibe,
    rogue_pilot_vibe,
    starship_ai_vibe,
    wormhole_whisper_vibe,
    asteroid_miner_vibe,
]

# ------------------------------------------------
# API VIEW
# ------------------------------------------------
@api_view(['POST'])
def chat_reply(request):
    message = request.data.get('message', '')
    if not isinstance(message, str):
        message = str(message)

    reply_func = random.choice(VIBES)
    reply = reply_func(message)

    return Response({'reply': reply})
