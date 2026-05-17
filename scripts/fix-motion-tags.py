from pathlib import Path

for path in Path("src").rglob("*.tsx"):
    text = path.read_text(encoding="utf-8")
    if "framer-motion" in text:
        continue
    if "<motion." in text or "</motion." in text:
        new = text.replace("<motion.div", "<div")
        new = new.replace("</motion.div>", "</div>")
        new = new.replace("<motion.button", "<button")
        new = new.replace("</motion.button>", "</button>")
        path.write_text(new, encoding="utf-8")
        print("fixed", path)
