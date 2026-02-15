const fileInput = document.getElementById('fileInput');
const downloadBtn = document.getElementById('downloadBtn');
let rawCode = "";
let fileName = "";

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileName = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            rawCode = event.target.result;
            downloadBtn.disabled = false;
        };
        reader.readAsText(file);
    }
});

downloadBtn.addEventListener('click', () => {
    const pres = new PptxGenJS();
    
    // Add a Title Slide
    let titleSlide = pres.addSlide();
    titleSlide.addText("Code Architecture Report", { x: 1, y: 1, fontSize: 36, color: "007bff", bold: true });
    titleSlide.addText(`File: ${fileName}`, { x: 1, y: 2, fontSize: 20 });

    // Extraction Logic: Find React Components, Interfaces, and Functions
    const lines = rawCode.split('\n');
    
    lines.forEach((line) => {
        // Regex to look for "const ComponentName = ..." or "interface Name"
        const componentMatch = line.match(/(?:const|function|interface|type)\s+([A-Z][a-zA-Z0-9_]+)/);
        
        if (componentMatch) {
            const entityName = componentMatch[1];
            let slide = pres.addSlide();
            
            // Add a header
            slide.addText("Extracted Component/Type", { x: 0.5, y: 0.5, fontSize: 12, color: "666666" });
            
            // Add the Main Title (The Component Name)
            slide.addText(entityName, { 
                x: 0.5, y: 1.5, w: 9, h: 1, 
                fontSize: 44, bold: true, color: "333333",
                align: "center", border: { pt: 2, color: "007bff" } 
            });

            // Add the snippet of code for context
            slide.addText(line.trim(), { x: 0.5, y: 3, w: 9, fontSize: 14, fontFace: "Courier New", color: "555555" });
        }
    });

    // Finalize and trigger the download
    pres.writeFile({ fileName: fileName.replace('.tsx', '') + "_Architecture" });
});
