
const input = document.getElementById('imageInput');
const status = document.getElementById('status');
const preview = document.getElementById('preview');

input.addEventListener('change', async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    status.textContent = "圧縮作業を開始しています…";
    preview.innerHTML = "";

    const downloadQueue = [];

    for (const file of files) {
    try {
        const options = {
        maxSizeMB: 0.5,
        useWebWorker: true
        };

        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
        const ratio = ((compressedFile.size / file.size) * 100).toFixed(1);
        const newFileName = `${file.name.replace(/\.[^/.]+$/, "")}_500kb.${file.name.split('.').pop()}`;

        // プレビュー作成
        const item = document.createElement('div');
        item.classList.add('preview-item');
        item.innerHTML = `
        <img src="${url}" alt="compressed image">
        <div class="file-info">
            <div><span class="label">元サイズ:</span> ${(file.size / 1024).toFixed(1)} KB</div>
            <div><span class="label">圧縮後:</span> ${(compressedFile.size / 1024).toFixed(1)} KB</div>
            <div><span class="label">圧縮率:</span> ${ratio}%</div>
            <button class="download-btn">ダウンロード</button>
        </div>
        `;
        const button = item.querySelector(".download-btn");
        button.addEventListener("click", () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = newFileName;
        link.click();
        });
        preview.appendChild(item);

        // 自動ダウンロード用にキューへ追加
        downloadQueue.push({ url, name: newFileName });

    } catch (error) {
        console.error(error);
    }
    }

    // 自動で順次ダウンロード（0.8秒間隔）
    let delay = 0;
    downloadQueue.forEach(({ url, name }) => {
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    }, delay);
    delay += 800; // 800ms間隔
    });

    status.textContent = "全ての圧縮が完了しました。";
});