document.getElementById('generateBtn').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const fileInput = document.getElementById('fileInput');
    const textContent = document.getElementById('textContent').value;
    const logList = document.getElementById('logList');

    function addLog(message) {
        const li = document.createElement('li');
        li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logList.appendChild(li);
    }

    if (!imageInput.files[0]) {
        alert("الرجاء اختيار صورة أولاً!");
        return;
    }

    addLog("بدء عملية المعالجة...");

    const imageBuffer = await imageInput.files[0].arrayBuffer();
    let secretBuffer;

    if (fileInput.files[0]) {
        addLog("تم اكتشاف ملف مرفق.");
        secretBuffer = await fileInput.files[0].arrayBuffer();
    } else {
        addLog("استخدام النص المكتوب يدوياً.");
        const encoder = new TextEncoder();
        secretBuffer = encoder.encode(textContent).buffer;
    }

    // دمج البيانات (الصورة أولاً ثم الكود)
    const combined = new Uint8Array(imageBuffer.byteLength + secretBuffer.byteLength);
    combined.set(new Uint8Array(imageBuffer), 0);
    combined.set(new Uint8Array(secretBuffer), imageBuffer.byteLength);

    addLog("تم الدمج بنجاح! جاري التحميل...");

    // إنشاء رابط التحميل
    const blob = new Blob([combined], { type: imageInput.files[0].type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `injected_${imageInput.files[0].name}`;
    a.click();

    addLog("تمت العملية بنجاح. الملف جاهز!");
});
