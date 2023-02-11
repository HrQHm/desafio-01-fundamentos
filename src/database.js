import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist
        });
    };

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }

        this.#persist();
        return data;
    }

    select(table, filter) {
        let data = this.#database[table] ?? [];
        if (filter) {
            data = data.filter(row => {
                return Object.entries(filter).some(([key, value]) => {
                    return row[key].includes(value)
                })
            });
        }

        return data;
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id);
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
            return true;
        } else {
            return false;
        }
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id);
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                id,
                title: data.title ? data.title : this.#database[table][rowIndex].title,
                description: data.description ? data.description : this.#database[table][rowIndex].description,
                completed_at: this.#database[table][rowIndex].completed_at,
                created_at: this.#database[table][rowIndex].created_at,
                updated_at: new Date()
            };
            this.#persist();
            return true;
        } else {
            return false;
        }
    }

    completed(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id);
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                ...this.#database[table][rowIndex],
                completed_at: this.#database[table][rowIndex].completed_at ? null : new Date(),
            };
            this.#persist();
            return true;
        } else {
            return false;
        }
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    };
}