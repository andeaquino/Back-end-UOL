import express from "express";
import cors from 'cors';
import dayjs from "dayjs";

let participants = [{
    name: "Joao",
    lastStatus: 2
}];
const messages = [];

const app = express();
app.use(cors());
app.use(express.json());

const updateUsers = () => {
    const currentTime = Date.now();
    participants = participants.filter(participant => {
        if ((currentTime - participant.lastStatus) / 1000 > 10) {
            messages.push({
                from: participant.name,
                to: 'Todos',
                text: 'sai da sala...',
                type: 'status',
                time: dayjs().format("HH:mm:ss")
            });
            return;
        }
        return participant;
    });
}

setInterval(updateUsers, 15000);

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

app.post('/messages', (req, res) => {
    const message = req.body;
    const user = req.header('User');
    const isEmpty = message.to === "" || message.text === "";
    const isTypeCorrect = message.type === 'message' || message.type === 'private_message';
    const isUserOn = participants.find(participant => participant.name === user);

    if (isEmpty || !isTypeCorrect || !isUserOn) {
        res.status(400).send("Message not sent");
    } else {
        messages.push({
            ...message,
            from: user,
            time: dayjs().format("HH:mm:ss")
        });
        res.status(200).send("Message sent");
    }
});

app.get('/messages', (req, res) => {
    const limit = req.query.limit ? req.query.limit : messages.length;
    const user = req.header('User');
    const userMessages = [];
    messages.map(message => {
        if (message.to === 'Todos') {
            userMessages.push(message);
        } else {
            if (message.to === user || message.from === user) {
                userMessages.push(message);
            }
        }
    });
    res.status(200).send(userMessages.slice(Math.max(userMessages.length - limit, 0)));
});

app.post('/status', (req, res) => {
    const user = req.header('User');
    const userExist = participants.find(participant => participant.name === user);
    if (!userExist) {
        res.status(400).send("User not found");
    } else {
        participants = participants.map(participant => {
            if (participant.name === user) {
                participant.lastStatus = Date.now();
            }
            return participant;
        });
        res.status(200).send("User status updated");
    }
});

app.listen(4000);