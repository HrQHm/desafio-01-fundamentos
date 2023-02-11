import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);
const readStream = fs.createReadStream(csvPath);

const parser = (parse({
    fromLine: 2,
    skipEmptyLines: true,
    delimiter: ',',
}));


async function execute() {
    const registerParsed = readStream.pipe(parser);
    for await (const register of registerParsed) {
        const [title, description] = register;
        console.log(title);

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description
            })
        }).then(response => {
            response.text().then(data => {
                console.log(data)
            })
        })

    }
}


execute();
