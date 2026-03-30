function toggleMenu() {
    const sb = document.getElementById("sidebar");
    sb.style.width = sb.style.width === "250px" ? "0" : "250px";
}

function showSection(type) {
    document.getElementById('encrypt-section').style.display = type === 'encrypt' ? 'block' : 'none';
    document.getElementById('decrypt-section').style.display = type === 'decrypt' ? 'block' : 'none';
    toggleMenu();
}

function addLog(msg) {
    const li = document.createElement('li');
    li.textContent = `> ${msg}`;
    document.getElementById('logList').appendChild(li);
}

async function processEncrypt() {
    const imgFile = document.getElementById('imageInput').files[0];
    const text = document.getElementById('textContent').value;

    if (!imgFile || !text) return alert("اختر صورة واكتب نصاً!");

    addLog("جاري قراءة الصورة...");
    const imgBuf = await imgFile.arrayBuffer();
    const txtBuf = new TextEncoder().encode(text);

    const out = new Uint8Array(imgBuf.byteLength + txtBuf.byteLength);
    out.set(new Uint8Array(imgBuf), 0);
    out.set(new Uint8Array(txtBuf), imgBuf.byteLength);

    const blob = new Blob([out], { type: imgFile.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Crypted_${imgFile.name}`;
    a.click();
    addLog("تم التلغيم والتحميل!");
}

async function processDecrypt() {
    const file = document.getElementById('decryptInput').files[0];
    if (!file) return alert("اختر الملف!");

    addLog("جاري تحليل البيانات...");
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);

    let offset = -1;
    for (let i = 0; i < bytes.length - 1; i++) {
        if (bytes[i] === 0xFF && bytes[i+1] === 0xD9) { 
            offset = i + 2; 
            break; 
        }
    }

    if (offset !== -1 && offset < bytes.length) {
        const secret = bytes.slice(offset);
        document.getElementById('resultText').value = new TextDecoder().decode(secret);
        addLog("تم استخراج البيانات!");
    } else {
        addLog("لا توجد بيانات مخفية.");
    }
}
