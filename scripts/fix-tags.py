from pathlib import Path

path = Path("src/components/detection-experience.tsx")
text = path.read_text(encoding="utf-8")
old = (
    'min-h-[22rem] place-items-center text-muted">\n'
    "                  …\n"
    "                </motion.div>"
)
new = (
    'min-h-[22rem] place-items-center text-muted">\n'
    "                  …\n"
    "                </div>"
)
if old not in text:
    raise SystemExit("pattern not found")
path.write_text(text.replace(old, new), encoding="utf-8")
print("fixed")
