const fs = require('fs');
let c = fs.readFileSync('src/components/upload-dropzone.tsx', 'utf8');
c = c.replace(/setMessage\([\s\S]*?locale === "vi"[\s\S]*?Hãy chọn ảnh trước khi quét\.[\s\S]*?Choose an image before scanning\.[\s\S]*?\);/, 'setMessage("Hãy chọn ảnh trước khi quét.");');
fs.writeFileSync('src/components/upload-dropzone.tsx', c);
console.log("Done");
