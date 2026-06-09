document.addEventListener('DOMContentLoaded', () => {
    if (typeof notebookData !== 'undefined') {
        renderNotebook(notebookData);
    } else {
        console.error('Error: notebookData is not defined. Make sure data.js is loaded.');
    }
});

function renderNotebook(data) {
    const container = document.getElementById('notebook-container');

    data.forEach((cell, index) => {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        
        if (cell.type === 'markdown') {
            cellEl.classList.add('markdown-cell');
            cellEl.innerHTML = marked.parse(cell.source);
        } else if (cell.type === 'code') {
            const codeContainer = document.createElement('div');
            codeContainer.classList.add('code-cell-container');

            // Header
            const header = document.createElement('div');
            header.classList.add('code-header');
            header.innerHTML = `<span>In [${index + 1}]: Python</span>`;
            codeContainer.appendChild(header);

            // Code
            const codeBlock = document.createElement('div');
            codeBlock.classList.add('code-block');
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.classList.add('language-python');
            code.textContent = cell.source;
            pre.appendChild(code);
            codeBlock.appendChild(pre);
            codeContainer.appendChild(codeBlock);

            // Outputs
            if (cell.outputs && cell.outputs.length > 0) {
                const outputContainer = document.createElement('div');
                outputContainer.classList.add('output-container');
                
                const outHeader = document.createElement('div');
                outHeader.classList.add('output-header');
                outHeader.textContent = `Output [${index + 1}]:`;
                outputContainer.appendChild(outHeader);

                cell.outputs.forEach(out => {
                    const outEl = document.createElement('div');
                    if (out.type === 'stream' || out.type === 'text/plain' || out.type === 'error') {
                        outEl.classList.add('output-text');
                        if (out.type === 'error') outEl.style.color = '#ff4a4a';
                        outEl.textContent = out.data;
                    } else if (out.type === 'image/png') {
                        outEl.classList.add('output-image');
                        const img = document.createElement('img');
                        img.src = `data:image/png;base64,${out.data}`;
                        outEl.appendChild(img);
                    } else if (out.type === 'text/html') {
                        outEl.classList.add('output-html');
                        outEl.innerHTML = out.data;
                    }
                    outputContainer.appendChild(outEl);
                });
                
                codeContainer.appendChild(outputContainer);
            }

            cellEl.appendChild(codeContainer);
        }

        container.appendChild(cellEl);
    });

    // Apply syntax highlighting
    Prism.highlightAll();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.cell').forEach(cell => {
        observer.observe(cell);
    });
}
