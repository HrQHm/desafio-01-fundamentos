import { randomUUID } from 'node:crypto';
import { buildRoutePath } from '../utils/build-route-path.js';
import { Database } from "./database.js";

const database = new Database();

export const routes = [
    {
        method: 'POST',
        url: buildRoutePath('/tasks'),
        handler: ((req, res) => {
            const { title, description } = req.body;
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                update_at: new Date(),
            };

            database.insert('tasks', task);
            return res.writeHead(201).end();
        })
    },
    {
        method: 'GET',
        url: buildRoutePath('/tasks'),
        handler: ((req, res) => {
            const { filter } = req.query;
            const filterData = filter ? {
                title: filter,
                description: filter
            } : null;

            const tasks = database.select('tasks', filterData);

            return res.end(JSON.stringify(tasks))
        })
    },
    {
        method: 'DELETE',
        url: buildRoutePath('/tasks/:id'),
        handler: ((req, res) => {
            const { id } = req.params;
            const resultOperator = database.delete('tasks', id);
            if (!resultOperator) {
                return res.writeHead(404).end('Register not found');

            }
            return res.writeHead(204).end();
        })
    },
    {
        method: 'PATCH',
        url: buildRoutePath('/tasks/completed/:id'),
        handler: ((req, res) => {
            const { id } = req.params;
            const resultOperator = database.completed('tasks', id);

            if (!resultOperator) {
                return res.writeHead(404).end('Register not found');

            }
            return res.writeHead(204).end();
        })
    },
    {
        method: 'PUT',
        url: buildRoutePath('/tasks/:id'),
        handler: ((req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            const resultOperator = database.update('tasks', id, {
                title,
                description
            });

            if (!resultOperator) {
                return res.writeHead(404).end('Register not found');

            }
            return res.writeHead(204).end();
        })
    }
];