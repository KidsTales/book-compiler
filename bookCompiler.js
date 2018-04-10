const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path');



const ImageModule = require('docxtemplater-image-module')

const sizeOf = require('image-size');

const opts = {
    centered: false,
    getImage: (tagValue, tagName) => {
        return fs.readFileSync(tagValue);
    },
    getSize: (img, tagValue, tagName) => {
        if (tagName == 'locationImage') {
            sizeObj = sizeOf(img);
            return [sizeObj.width,sizeObj.height];
        }

        return [170, 130];
    }
}

const imageModule = new ImageModule(opts);



module.exports = {
    compile: (title, subtitle, location, introduction, students) => {
        const content = fs.readFileSync(path.join(__dirname, 'template.docx'), 'binary');
        const zip = new JSZip(content);
        
        const doc = new Docxtemplater();
        doc.attachModule(imageModule);
        doc.loadZip(zip);

        const data = {
            year: new Date().getFullYear(),
            title,
            subtitle,
            location,
            introduction,
            students,
            stories: students.map(s => Object.assign(s.story, { studentName: s.name }))
        }
        console.log(data.stories);
        
        doc.setData(data);
        doc.render();
        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        //return buf;
        fs.writeFileSync(path.resolve(__dirname, 'public', 'docs', location.name + '.docx'), buf);
    }
}