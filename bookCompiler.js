const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const base64 = require('node-base64-image');

const fs = require('fs');
const path = require('path');

const ImageModule = require('docxtemplater-image-module')
const sizeOf = require('image-size');

const opts = {
    centered: false,
    getImage: (tagValue, tagName) => {
        console.log(tagValue + " | " + tagName);
        return fs.readFileSync(tagValue);
    },
    getSize: (img, tagValue, tagName) => {
        if (tagName == 'locationImage') {
            sizeObj = sizeOf(img);
            if (sizeObj.width > 600) {
                sizeObj.width *= 0.5;
                sizeObj.height *= 0.5;
            }
            return [sizeObj.width, sizeObj.height];
        }

        return [170, 130];
    }
}

const imageModule = new ImageModule(opts);
const content = fs.readFileSync(path.join(__dirname, 'template.docx'), 'binary');
const zip = new JSZip(content);

const doc = new Docxtemplater();
doc.attachModule(imageModule);
doc.loadZip(zip);

const subtitle = 'An Anthology of Short Stories';

module.exports = {
    compile: (book, workshop, students) => {
        students.forEach(s => {
            s.image = 'pictures/' + s.imageName;
        });

        console.log(book);
        console.log(workshop);
        console.log(students);

        const data = {
            year: new Date().getFullYear(),
            title: book.title,
            subtitle,
            teacherNames: workshop.teachers.join(', '),
            programDirector: workshop.programDirector,
            location: workshop.location,
            introduction: book.introduction,
            students,
            stories: students.map(s => Object.assign(s.story, {
                studentName: s.name,
                page: students.indexOf(s) + 7
            }))
        }

        doc.setData(data);

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
        } catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({
                error: e
            }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
        }

        const buf = doc.getZip().generate({
            type: 'nodebuffer'
        });
        //return buf;
        fs.writeFileSync(path.resolve(__dirname, 'public', 'docs', book.title + '.docx'), buf);
    }
}