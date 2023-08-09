import dotenv from 'dotenv';
import express from "express"
import PlayerRouter from './routers/PlayerRouter';
import ApiFirebaseConnection from './firebase/ApiFirebaseConnection';
import JsonDatabaseManager from './skilltree/JsonDatabaseManager';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser")
app.use(bodyParser())

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.use(PlayerRouter)

app.get("*", (req, res)=>{
  console.log("404 not found")
  res.status(404).send("404 NOT FOUND!")
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    JsonDatabaseManager.getManager().loadData()
    ApiFirebaseConnection.getConnection().startConnection()
});