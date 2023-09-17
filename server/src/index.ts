import { Server, LobbyRoom } from "colyseus";
import WaitingRoom from "./rooms/waiting_room/WaitingRoom";
import GameRoom from "./rooms/game_room/GameRoom";
import "dotenv/config";

const PORT = parseInt(process.env.PORT || "3000");
const gameServer = new Server();
const simulateLatency = parseInt(process.env.SIMULATE_LATENCY || "0");

gameServer.define('lobby', LobbyRoom);
    
gameServer
    .define('waiting', WaitingRoom)
    .enableRealtimeListing();

gameServer.define('game', GameRoom)

gameServer.listen(PORT).then(() => {
    console.log("Game Server is listening on port: ", PORT);
});

if(simulateLatency > 0)
    gameServer.simulateLatency(simulateLatency);