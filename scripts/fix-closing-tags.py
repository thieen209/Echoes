from pathlib import Path

close_div = "</" + "div>"

p = Path("src/components/detection-experience.tsx")
t = p.read_text(encoding="utf-8")
needle = (
    '              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">\n'
    "                <motion.div\n"
    '                  className="h-full rounded-full bg-gradient-to-r from-bronze via-gold to-foreground"\n'
    "                  animate={{ width: `${Math.max(confidence, progress * 0.9)}%` }}\n"
    '                  transition={{ duration: 0.35, ease: "easeOut" }}\n'
    "                />\n"
    "              </motion.div>"
)
replacement = (
    '              <motion.div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">\n'
    "                <motion.div\n"
    '                  className="h-full rounded-full bg-gradient-to-r from-bronze via-gold to-foreground"\n'
    "                  animate={{ width: `${Math.max(confidence, progress * 0.9)}%` }}\n"
    '                  transition={{ duration: 0.35, ease: "easeOut" }}\n'
    "                />\n"
    f"              {close_div}"
)
# Fix needle - outer should be div not motion
needle = (
    '              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">\n'
    "                <motion.div\n"
    '                  className="h-full rounded-full bg-gradient-to-r from-bronze via-gold to-foreground"\n'
    "                  animate={{ width: `${Math.max(confidence, progress * 0.9)}%` }}\n"
    '                  transition={{ duration: 0.35, ease: "easeOut" }}\n'
    "                />\n"
    "              </motion.div>"
)
replacement = (
    '              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">\n'
    "                <motion.div\n"
    '                  className="h-full rounded-full bg-gradient-to-r from-bronze via-gold to-foreground"\n'
    "                  animate={{ width: `${Math.max(confidence, progress * 0.9)}%` }}\n"
    '                  transition={{ duration: 0.35, ease: "easeOut" }}\n'
    "                />\n"
    f"              {close_div}"
)
if needle in t:
    t = t.replace(needle, replacement)
    p.write_text(t, encoding="utf-8")
    print("detection ok")
else:
    print("detection fail")

p2 = Path("src/components/home-scan-section.tsx")
t2 = p2.read_text(encoding="utf-8")
needle2 = (
    '                <Waveform bars={22} className="h-10" />\n'
    "              </motion.div>\n"
    "            </motion.div>\n"
    "            <motion.button"
)
replacement2 = (
    '                <Waveform bars={22} className="h-10" />\n'
    "              </motion.div>\n"
    f"            {close_div}\n"
    "            <motion.button"
)
if needle2 in t2:
    t2 = t2.replace(needle2, replacement2)
    p2.write_text(t2, encoding="utf-8")
    print("home-scan ok")
else:
    print("home-scan fail")
