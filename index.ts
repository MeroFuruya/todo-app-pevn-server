import express, { Request, Response } from 'express';
import { TodoTask, TodoTasks } from './TodoTask';
import { Client } from 'pg';

const client = new Client({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
});
client.connect();

const app = express();
const port = 3000;

app.use(express.json());

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
    console.log(err ? err.stack : res.rows[0].message) // Hello World!
    client.end()
  })

const todoTasks: TodoTasks = {
    tasks: []
};

let id_counter = 0;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
    });

app.get('/tasks', (req: Request, res: Response) => {
    res.send(todoTasks);
    });

app.post('/tasks', (req: Request, res: Response) => {
    const newTask: TodoTask = {
        id: id_counter++,
        title: req.body.title,
        completed: false
    };
    todoTasks.tasks.push(newTask);
    res.send(newTask);
    });

app.put('/tasks/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = todoTasks.tasks.find(task => task.id === id);
    if (task) {
        task.completed = req.body.completed;
        res.send(task);
    } else {
        res.status(404).send();
    }
    });

app.delete('/tasks/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = todoTasks.tasks.find(task => task.id === id);
    if (task) {
        todoTasks.tasks = todoTasks.tasks.filter(task => task.id !== id);
        res.send(task);
    } else {
        res.status(404).send();
    }
    });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
