const SECRET_TAG = "---START_SECRET---";

function toggleMenu() {
    const sb = document.getElementById("sidebar");
    sb.style.width = sb.style.width === "250px" ? "0" : "250px";
}

function showSection(type) {
    document.getElementById('encrypt-section').style.display = type === 'encrypt' ? 'block' : 'none';
    document.getElementById('decrypt-section').style.display = type === 'decrypt' ? 'block' : 'none';
    if(window.innerWidth < 600) toggleMenu();
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

    addLog("جاري تحضير الصورة...");
    const imgBuf = await imgFile.arrayBuffer();
    // ندمج العلامة السرية مع النص لضمان سهولة الاستخراج
    const fullText = SECRET_TAG + text;
    const txtBuf = new TextEncoder().encode(fullText);

    const out = new Uint8Array(imgBuf.byteLength + txtBuf.byteLength);
    out.set(new Uint8Array(imgBuf), 0);
    out.set(new Uint8Array(txtBuf), imgBuf.byteLength);

    const blob = new Blob([out], { type: imgFile.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `injected_${imgFile.name}`;
    a.click();
    addLog("تم التلغيم بنجاح! حمل الملف الجديد.");
}

async function processDecrypt() {
    const file = document.getElementById('decryptInput').files[0];
    if (!file) return alert("اختر الملف الملغم!");

    addLog("جاري البحث عن البيانات المخفية...");
    const buf = await file.arrayBuffer();
    const decoder = new TextDecoder();
    const fullContent = decoder.decode(buf);

    // البحث عن العلامة السرية داخل محتوى الملف
    const index = fullContent.indexOf(SECRET_TAG);

    if (index !== -1) {
        const secretText = fullContent.substring(index + SECRET_TAG.length);
        document.getElementById('resultText').value = secretText;
        addLog("تم استخراج 'مرحبا' بنجاح! ✅");
    } else {
        document.getElementById('resultText').value = "لم يتم العثور على نص مخفي.";
        addLog("فشل الاستخراج: الصورة غير ملغمة أو البيانات تالفة.");
    }
}
