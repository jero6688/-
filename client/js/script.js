document.addEventListener('DOMContentLoaded', () => {
    // 绑定文件选择显示逻辑
    bindFileDisplay('reqDocFiles', 'reqDocFilesList'); // 新增需求文档上传
    bindFileDisplay('imageFiles', 'imageFilesList');
    bindFileDisplay('imageFolders', 'imageFoldersList'); // 新增图片文件夹上传
    bindFileDisplay('refFiles', 'refFilesList');
    bindFileDisplay('videoFiles', 'videoFilesList');
    bindFileDisplay('audioFiles', 'audioFilesList');
    bindFileDisplay('docFiles', 'docFilesList');

    // 绑定生成按钮点击事件
    document.getElementById('generateBtn').addEventListener('click', handleGenerate);
});

function bindFileDisplay(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    input.addEventListener('change', () => {
        list.innerHTML = '';
        if (input.files.length > 0) {
            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];
                const item = document.createElement('div');
                item.className = 'file-list-item';
                item.textContent = `${file.name} (${formatSize(file.size)})`;
                list.appendChild(item);
            }
        }
    });
}

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function handleGenerate() {
    // 0. 基础校验
    const projectNameInput = document.getElementById('projectName');
    const projectName = projectNameInput.value.trim();
    
    if (!projectName) {
        alert('请填写【网站/系统名称】！');
        projectNameInput.focus();
        return;
    }

    const btn = document.getElementById('generateBtn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '正在打包处理中...';

    try {
        const zip = new JSZip();

        // 1. 获取表单数据并生成需求文档
        const formData = {
            projectName: projectName,
            requirementDesc: document.getElementById('requirementDesc').value || '无',
            remark: document.getElementById('remark').value || '无'
        };

        const submitTime = new Date().toLocaleString();

        // 生成 HTML 内容用于转换为 Word
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${formData.projectName} - 需求文档</title>
                <style>
                    body { font-family: 'SimSun', '宋体', serif; line-height: 1.6; }
                    h1 { text-align: center; color: #333; }
                    h2 { color: #007bff; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px; }
                    p { margin-bottom: 10px; }
                    .field-label { font-weight: bold; display: block; margin-top: 15px; }
                    .field-value { background: #f9f9f9; padding: 10px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <h1>${formData.projectName} - 需求说明书</h1>
                
                <p><strong>提交时间：</strong>${submitTime}</p>

                <h2>1. 需求详情</h2>
                <div>
                    <span class="field-label">功能需求说明：</span>
                    <div class="field-value">${formData.requirementDesc}</div>
                </div>
                <div>
                    <span class="field-label">备注说明：</span>
                    <div class="field-value">${formData.remark}</div>
                </div>
            </body>
            </html>
        `;

        // 生成 Markdown 内容 (作为备份)
        const mdContent = `
# ${formData.projectName} - 需求说明书

**提交时间**：${submitTime}

## 1. 需求详情
### 功能需求说明
${formData.requirementDesc}

### 备注说明
${formData.remark}
        `;

        // 尝试使用 html-docx-js 生成 Word 文档
        if (window.htmlDocx) {
            const converted = window.htmlDocx.asBlob(htmlContent);
            zip.file(`需求说明书.docx`, converted);
        } else {
            console.warn('html-docx-js not found, fallback to HTML file.');
            zip.file(`需求说明书.doc`, htmlContent); // 伪装成 doc，Word 也能打开
        }
        
        // 同时保存一份 Markdown 格式，方便开发人员直接查看
        zip.file(`需求说明书.md`, mdContent);

        // 2. 处理上传的文件
        const fileMappings = [
            { zipFolder: '需求文档', inputId: 'reqDocFiles' },
            { zipFolder: '图片素材', inputId: 'imageFiles' },
            { zipFolder: '图片素材', inputId: 'imageFolders' },
            { zipFolder: '参考图', inputId: 'refFiles' },
            { zipFolder: '视频素材', inputId: 'videoFiles' },
            { zipFolder: '音频素材', inputId: 'audioFiles' },
            { zipFolder: '其他文档', inputId: 'docFiles' }
        ];

        for (const mapping of fileMappings) {
            const input = document.getElementById(mapping.inputId);
            if (input && input.files.length > 0) {
                const folder = zip.folder(mapping.zipFolder);
                for (let i = 0; i < input.files.length; i++) {
                    const file = input.files[i];
                    // 处理 webkitRelativePath 以保留文件夹结构
                    // 普通文件上传 webkitRelativePath 通常为空，直接使用 file.name
                    // 文件夹上传 webkitRelativePath 为 "folder/subfolder/file.ext"
                    const fileNameInZip = file.webkitRelativePath || file.name;
                    folder.file(fileNameInZip, file);
                }
            }
        }

        // 3. 生成并下载 ZIP
        const content = await zip.generateAsync({type: "blob"});
        const fileName = `${formData.projectName}_需求包_${formatDate(new Date())}.zip`;
        saveAs(content, fileName);

        alert('打包成功！文件已开始下载。');

    } catch (error) {
        console.error('打包失败:', error);
        alert('打包过程中出现错误，请查看控制台详情。');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}${m}${d}_${h}${min}`;
}
