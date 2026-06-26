"""Génère les icônes PNG de l'extension (sans dépendance externe)."""
import os
import struct
import zlib

BG = (34, 113, 177)        # bleu WordPress #2271b1
FG = (255, 255, 255)       # blanc


def rounded(x, y, size, radius):
    if x < radius and y < radius:
        return (x - radius) ** 2 + (y - radius) ** 2 <= radius ** 2
    if x >= size - radius and y < radius:
        return (x - (size - radius - 1)) ** 2 + (y - radius) ** 2 <= radius ** 2
    if x < radius and y >= size - radius:
        return (x - radius) ** 2 + (y - (size - radius - 1)) ** 2 <= radius ** 2
    if x >= size - radius and y >= size - radius:
        return (x - (size - radius - 1)) ** 2 + (y - (size - radius - 1)) ** 2 <= radius ** 2
    return True


def make(size):
    radius = max(2, size // 6)
    bar_h = max(1, size // 7)
    gap = max(1, size // 9)
    margin = max(2, size // 4)
    # trois "barres" stylisées évoquant des champs/labels
    bars = []
    top = (size - (3 * bar_h + 2 * gap)) // 2
    for i in range(3):
        y0 = top + i * (bar_h + gap)
        width = size - 2 * margin - (i * size // 8)
        bars.append((margin, y0, margin + width, y0 + bar_h))

    rows = []
    for y in range(size):
        row = bytearray()
        row.append(0)  # filtre PNG: none
        for x in range(size):
            if not rounded(x, y, size, radius):
                row += bytes((0, 0, 0, 0))
                continue
            color = BG
            for bx0, by0, bx1, by1 in bars:
                if bx0 <= x < bx1 and by0 <= y < by1:
                    color = FG
                    break
            row += bytes((color[0], color[1], color[2], 255))
        rows.append(bytes(row))
    return b"".join(rows)


def png_chunk(tag, data):
    return (struct.pack(">I", len(data)) + tag + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff))


def write_png(path, size):
    raw = make(size)
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = (b"\x89PNG\r\n\x1a\n"
           + png_chunk(b"IHDR", ihdr)
           + png_chunk(b"IDAT", zlib.compress(raw, 9))
           + png_chunk(b"IEND", b""))
    with open(path, "wb") as fh:
        fh.write(png)


here = os.path.join(os.path.dirname(os.path.abspath(__file__)), "icons")
os.makedirs(here, exist_ok=True)
for s in (16, 48, 128):
    write_png(os.path.join(here, f"icon{s}.png"), s)
    print(f"icon{s}.png généré")
