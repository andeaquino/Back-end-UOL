import express from "express";
import cors from 'cors';

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



app.listen(4000);