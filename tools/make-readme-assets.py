#!/usr/bin/env python3
"""
Generates the animated SVG assets used by README.md.

GitHub strips <style> blocks and `style` attributes from Markdown, but it
*serves* SVG files through camo as real SVG documents — which means SMIL
animations inside them still run. Every animated piece in the README is
therefore a standalone .svg file with its own <animate> elements.

Run:  python3 tools/make-readme-assets.py
"""

import os
import textwrap

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "readme")
os.makedirs(OUT, exist_ok=True)

SANS = "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
MONO = "'SFMono-Regular', ui-monospace, Menlo, Consolas, monospace"

RAINBOW = [
    "#ff3b3b",
    "#ff9500",
    "#ffd60a",
    "#34c759",
    "#00c7be",
    "#0a84ff",
    "#5e5ce6",
    "#bf5af2",
    "#ff375f",
]


def rainbow_gradient(gid, dur=6, rotate=False):
    """A hue-rotating rainbow gradient."""
    extra = ""
    if rotate:
        extra = (
            f'<animateTransform attributeName="gradientTransform" type="rotate" '
            f'from="0 0.5 0.5" to="360 0.5 0.5" dur="{dur * 4}s" repeatCount="indefinite"/>'
        )
    stops = "".join(
        f'<stop offset="{i / (len(RAINBOW) - 1) * 100:.1f}%" stop-color="{c}">'
        f'<animate attributeName="stop-color" values="'
        + ";".join(RAINBOW[i:] + RAINBOW[:i])
        + f'" dur="{dur}s" repeatCount="indefinite"/>'
        f'</stop>'
        for i, c in enumerate(RAINBOW)
    )
    return (
        f'<linearGradient id="{gid}" x1="0%" y1="0%" x2="100%" y2="0%">'
        f'{stops}{extra}</linearGradient>'
    )


def title_svg(text, sub, width=1200, height=190, font=84, subfont=26):
    """Big animated rainbow title, centred, with a mono subtitle."""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{text}">
  <defs>
    {rainbow_gradient("rg", 7)}
    <filter id="soft" x="-10%" y="-30%" width="120%" height="160%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="{width}" height="{height}" fill="none"/>
  <text x="50%" y="{height * 0.56}" text-anchor="middle"
        font-family="{SANS}" font-size="{font}" font-weight="800" letter-spacing="-2.5"
        fill="url(#rg)" filter="url(#soft)">{text}</text>
  <text x="50%" y="{height * 0.82}" text-anchor="middle"
        font-family="{MONO}" font-size="{subfont}" letter-spacing="4"
        fill="url(#rg)" opacity="0.92">{sub}</text>
</svg>
"""


def section_svg(text, width=760, height=86, font=52):
    """Animated rainbow section heading, left aligned."""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{text}">
  <defs>
    {rainbow_gradient("rg", 8)}
  </defs>
  <text x="2" y="{height * 0.72}" font-family="{SANS}" font-size="{font}" font-weight="800"
        letter-spacing="-1.6" fill="url(#rg)">{text}</text>
  <rect x="2" y="{height * 0.86}" width="{width - 4}" height="3" fill="url(#rg)" opacity="0.55">
    <animate attributeName="width" values="0;{width - 4};0" dur="6s" repeatCount="indefinite"/>
  </rect>
</svg>
"""


def wave_svg(width=1200, height=110):
    """Animated rainbow wave divider."""
    pts = []
    import math

    for i in range(121):
        x = i / 120 * width
        y = height / 2 + math.sin(i / 120 * math.pi * 4) * (height * 0.22)
        pts.append(f"{x:.1f},{y:.1f}")

    d = "M " + " L ".join(pts)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="presentation">
  <defs>
    {rainbow_gradient("rg", 5)}
  </defs>
  <path d="{d}" fill="none" stroke="url(#rg)" stroke-width="5" stroke-linecap="round" opacity="0.9">
    <animateTransform attributeName="transform" type="translate"
                      from="-40 0" to="0 0" dur="9s" repeatCount="indefinite"/>
  </path>
  <path d="{d}" fill="none" stroke="url(#rg)" stroke-width="2" stroke-linecap="round" opacity="0.45"
        transform="translate(0 14)">
    <animateTransform attributeName="transform" type="translate"
                      values="0 14; -40 14" dur="9s" repeatCount="indefinite"/>
  </path>
</svg>
"""


def badge_svg(text, colour="#f7c02f", fg="#202020", width=None, height=28):
    w = width or int(len(text) * 8.2 + 26)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{height}" viewBox="0 0 {w} {height}" role="img" aria-label="{text}">
  <rect width="{w}" height="{height}" rx="7" fill="{colour}"/>
  <text x="{w / 2}" y="{height / 2 + 4.5}" text-anchor="middle" font-family="{SANS}"
        font-size="13" font-weight="700" fill="{fg}">{text}</text>
</svg>
"""


def cursor_svg(size=150):
    """The site's own custom cursor, as an animated loop."""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" role="img" aria-label="custom cursor">
  <defs>
    {rainbow_gradient("rg", 3)}
  </defs>
  <path d="M2 1.4 22.6 11.1l-9 1.5 4.9 8.3-2.9 1.7-4.9-8.4-5.7 6.6L2 1.4Z"
        fill="url(#rg)" stroke="#202020" stroke-width="1.4" stroke-linejoin="round">
    <animateTransform attributeName="transform" type="translate"
                      values="0 0; 6 6; 0 0" dur="2.4s" repeatCount="indefinite"/>
  </path>
</svg>
"""


FILES = {
    "banner.svg": title_svg(
        "HALDEN STUDIO", "AWARD-WINNING CREATIVE &amp; DIGITAL STUDIO  ·  NEXT.JS TEMPLATE"
    ),
    "section-features.svg": section_svg("Features"),
    "section-stack.svg": section_svg("The Stack"),
    "section-getting-started.svg": section_svg("Getting Started"),
    "section-structure.svg": section_svg("Project Structure"),
    "section-customising.svg": section_svg("Customising"),
    "section-pages.svg": section_svg("Pages"),
    "section-deploy.svg": section_svg("Deploy"),
    "section-license.svg": section_svg("License"),
    "wave.svg": wave_svg(),
    "badge-nextjs.svg": badge_svg("Next.js 15"),
    "badge-tailwind.svg": badge_svg("Tailwind CSS 4", "#38bdf8", "#082f49"),
    "badge-gsap.svg": badge_svg("GSAP 3", "#ea5e9c", "#2b0a1d"),
    "badge-three.svg": badge_svg("Three.js", "#ffffff", "#111111"),
    "badge-lenis.svg": badge_svg("Lenis", "#c084fc", "#1b0b2e"),
    "badge-license.svg": badge_svg("MIT License", "#34d399", "#04241a"),
    "badge-typescript.svg": badge_svg("TypeScript", "#3178c6", "#ffffff"),
    "cursor.svg": cursor_svg(),
}

for name, content in FILES.items():
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)
    print(f"wrote docs/readme/{name}  ({len(content):,} bytes)")

print(f"\n{len(FILES)} assets generated in {OUT}")
