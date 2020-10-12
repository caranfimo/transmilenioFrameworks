import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';

const app = express();

app.use(logger('dev', {
    skip: (rq) => rq.url === '/health'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/', (req, res) => {
    res.status(200).json({response: 'ok'});
});

app.use((err: any, req: any, res: any, next: any) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            data: err.data,
            message: err.message,
            name: err.name,
        },
    });
});

app.use((req, res) => {
    return res.status(404).send({ message: `Route '${req.url}' Not found.` });
});

export default app;
