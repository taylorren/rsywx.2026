#!/usr/bin/env python3
"""Render the site's default Open Graph card (1200x630), in the house style.

This is the image every page falls back to when it has no artwork of its own —
book pages pass their own cover instead (see <Seo image={coverUrl(...)} />).

The card is deliberately typographic and carries no volatile data (no issue
number, no book counts), so it never goes stale: it is a static file.

    python3 scripts/make-og-card.py [out.png|out.jpg]

Requires: Pillow + numpy, the Noto Serif/Sans CJK fonts, and ImageMagick's
`convert` to rasterise static/images/logo.svg (the house seal). Colours are the
sRGB conversions of the design tokens in src/app.css.
"""

from __future__ import annotations

import math
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

# --- design tokens (src/app.css, converted from OKLCH) ---------------------


def gamma_encode(x: float) -> float:
    x = min(max(x, 0.0), 1.0)
    return 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055


def oklch(L: float, C: float, h: float) -> tuple[int, int, int]:
    """OKLCH -> sRGB (8-bit), i.e. what the browser paints for that token."""
    a = C * math.cos(math.radians(h))
    b = C * math.sin(math.radians(h))

    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_**3, m_**3, s_**3

    lin = (
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )
    r, g, bl = (round(gamma_encode(v) * 255) for v in lin)
    return (r, g, bl)


PAPER = oklch(0.976, 0.009, 90)  # --paper
INK = oklch(0.216, 0.014, 75)  # --ink
INK_SOFT = oklch(0.45, 0.014, 75)  # --ink-soft
INK_FAINT = oklch(0.545, 0.013, 78)  # --ink-faint
RULE = oklch(0.835, 0.014, 88)  # --rule
RULE_STRONG = oklch(0.52, 0.016, 80)  # --rule-strong
SPOT = oklch(0.5, 0.146, 32)  # --spot (朱砂)

# --- geometry: laid out at 1200x630, drawn at 2x for clean glyph edges -----

W, H = 1200, 630
SCALE = 2


def px(v: float) -> int:
    return round(v * SCALE)


SERIF_BOLD = ("/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc", 2)  # index 2 = SC face
SERIF = ("/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc", 2)
SANS = ("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 2)


def font(spec: tuple[str, int], size: float) -> ImageFont.FreeTypeFont:
    path, index = spec
    return ImageFont.truetype(path, px(size), index=index)


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    tracking: float,
    center_x: float,
    baseline_y: float,
    fill: tuple[int, int, int],
) -> None:
    """Draw `text` with letter-spacing (tracking), centred on `center_x`."""
    gap = px(tracking)
    width = sum(fnt.getlength(ch) for ch in text) + gap * max(0, len(text) - 1)
    x = center_x - width / 2
    for ch in text:
        draw.text((x, baseline_y), ch, font=fnt, fill=fill, anchor="ls")
        x += fnt.getlength(ch) + gap



def blend_multiply(under: Image.Image, over: Image.Image) -> Image.Image:
    """CSS `mix-blend-mode: multiply` of an RGBA layer onto an RGB backdrop."""
    base = np.asarray(under.convert("RGB"), dtype=np.float32)
    top = np.asarray(over.convert("RGBA"), dtype=np.float32)
    rgb, alpha = top[..., :3], top[..., 3:4] / 255.0
    out = base * (1 - alpha) + (base * rgb / 255.0) * alpha
    return Image.fromarray(out.round().clip(0, 255).astype("uint8"))


def render() -> Image.Image:
    img = Image.new("RGB", (px(W), px(H)), PAPER)
    draw = ImageDraw.Draw(img)

    margin = 72

    # Ears — the thin strip above the nameplate, closed by a hairline.
    ear = font(SANS, 20)
    draw.text((px(margin), px(58)), "个人数字图书馆", font=ear, fill=INK_SOFT, anchor="ls")
    draw.text((px(W - margin), px(58)), "rsywx.net", font=ear, fill=INK_FAINT, anchor="rs")
    draw.text((px(W / 2), px(58)), "每日一期 · 线上发行", font=ear, fill=INK_FAINT, anchor="ms")
    draw.line([(px(margin), px(72)), (px(W - margin), px(72))], fill=RULE, width=max(1, px(0.75)))

    # House seal, above the wordmark — same order as the masthead. The site
    # prints it with mix-blend-multiply so the red sinks into the newsprint;
    # multiply against the paper here to match.
    seal_svg = Path(__file__).resolve().parent.parent / "static" / "images" / "logo.svg"
    seal_size = px(78)
    seal_x = round(px(W / 2) - seal_size / 2)
    box = (seal_x, px(104), seal_x + seal_size, px(104) + seal_size)
    if shutil.which("convert") and seal_svg.exists():
        with tempfile.TemporaryDirectory() as tmp:
            seal_png = Path(tmp) / "seal.png"
            subprocess.run(
                ["convert", "-background", "none", str(seal_svg), "-resize", "256x256", str(seal_png)],
                check=True,
                capture_output=True,
            )
            seal = Image.open(seal_png).convert("RGBA").resize((seal_size, seal_size), Image.LANCZOS)
        img.paste(blend_multiply(img.crop(box), seal), box[:2])
    else:  # the seal is decorative; the card still works without it
        print("warning: convert/logo.svg unavailable — rendering without the seal", file=sys.stderr)

    # Nameplate.
    draw_tracked(draw, "任氏有无轩", font(SERIF_BOLD, 104), 14, px(W / 2), px(300), INK)

    # Epigraph and its attribution.
    draw_tracked(draw, "有之以为利，无之以为用。", font(SERIF, 34), 2, px(W / 2), px(366), INK_SOFT)
    draw_tracked(draw, "《道德经》第十一章", font(SERIF, 23), 1, px(W / 2), px(410), INK_FAINT)

    # Double rule, as under the dateline.
    draw.line([(px(margin), px(468)), (px(W - margin), px(468))], fill=RULE_STRONG, width=px(2.5))
    draw.line([(px(margin), px(477)), (px(W - margin), px(477))], fill=RULE_STRONG, width=max(1, px(1)))

    # Colophon line.
    draw_tracked(
        draw, "创刊 1989 · 藏书 · 读书 · 博客 · 维客", font(SANS, 20), 3, px(W / 2), px(540), INK_SOFT
    )

    # One cinnabar tick at the foot, the only colour on the card.
    draw.line([(px(W / 2 - 40), px(586)), (px(W / 2 + 40), px(586))], fill=SPOT, width=px(2))

    return img.resize((W, H), Image.LANCZOS)


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("static/images/og-default.png")
    card = render()
    out.parent.mkdir(parents=True, exist_ok=True)

    if out.suffix.lower() in {".jpg", ".jpeg"}:
        card.save(out, "JPEG", quality=92, optimize=True, progressive=True)
    else:
        # Flat artwork and text: an adaptive palette is visually lossless here
        # and avoids the ringing JPEG puts around glyph edges.
        card.convert("P", palette=Image.ADAPTIVE, colors=128).save(out, "PNG", optimize=True)

    print(f"wrote {out} ({out.stat().st_size / 1024:.1f} KB, {card.width}x{card.height})")


if __name__ == "__main__":
    main()
