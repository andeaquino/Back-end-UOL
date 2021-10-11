import express from "express";
import cors from 'cors';
import dayjs from "dayjs";

const participants = [];
const messages = [];

const app = express();
app.use(cors());
app.use(express.json());

app.post('/participants', (req, res) => {
    const name = req.body.name;
    const isUsed = participants.find(participant => participant.name === name);

    if (!!isUsed || name === "") {
        res.status(400).send("Invalid name");
    } else {
        participants.push(
            {
                name,
                lastStatus: Date.now()
            }
        );
        res.status(200).send("Name saved");
    }
});

app.get('/participants', (req, res) => {
    res.send(participants);
});

app.ṕost('/messages', (req, res) => {
    const message = req.body;
    const user = req.header(User);
    const isEmpty = message.to === "" || message.text === "";
    const isTypeCorrect = message.type === 'message' || message.type === 'private_message';
    const isUserOn = participants.find(participant => participant.name === user);

    if (isEmpty || !isTypeCorrect || !isUserOn) {
        res.status(400).send("Message not sent");
    } else {
        messages.push({
            ...message,
            from: user,
            time: Date.now().format('HH:MM:SS')
        });
        res.status(200).send("Message sent");
    }
});

app.get('/messages', (req, res) => {
    const limit = req.query.limit ? req.query.limit : 0;
    const user = req.header(User);
    const userMessages = [];
    messages.map(message => {
        if (message.type === 'message') {
            userMessages.push(message);
        } else {
            if (message.to === user || message.from === user) {
                userMessages.push(message);
            }
        }
    });
    res.status(200).send(userMessages.slice(Math.max(userMessages.length - limit, 0)));
});

app.listen(4000);