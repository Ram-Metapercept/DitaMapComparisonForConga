const fs = require('fs');
const { DOMParser, XMLSerializer } = require('xmldom');
const path=require('path');
const xpath = require('xpath');
const ditamapFilePath=path.join(__dirname, "CPQ.ditamap")
const ditaFilePath=path.join(__dirname, "cpq.dita")
function addAudienceAttributes() {
    const ditamapContent = fs.readFileSync(ditamapFilePath, 'utf-8');
    const ditaContent = fs.readFileSync(ditaFilePath, 'utf-8');
    const ditamapDoc = new DOMParser().parseFromString(ditamapContent, 'text/xml');
    const ditaDoc = new DOMParser().parseFromString(ditaContent, 'text/xml');
    const xrefNodes = xpath.select("//xref", ditaDoc);
    xrefNodes.forEach(xrefNode => {
        const navtitle = xrefNode.textContent.trim();
        const audience = xrefNode.getAttribute('audience');
        if (navtitle && audience) {
            const topicrefNodes = xpath.select(`//topicref[@navtitle="${navtitle}"]`, ditamapDoc);
            topicrefNodes.forEach(topicrefNode => {
                topicrefNode.setAttribute('audience', audience);
            });
        }
    });

    const modifiedDitamapContent = new XMLSerializer().serializeToString(ditamapDoc);

    fs.writeFileSync("./output/modified.ditamap", modifiedDitamapContent, 'utf-8');

    console.log('DITAMAP modification complete.');
}

addAudienceAttributes();
