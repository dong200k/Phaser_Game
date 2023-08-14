import { Server, LobbyRoom } from "colyseus";
import WaitingRoom from "./rooms/waiting_room/WaitingRoom";
import GameRoom from "./rooms/game_room/GameRoom";
import "dotenv/config";

const PORT = 3000;
const gameServer = new Server();

gameServer.define('lobby', LobbyRoom);
    
gameServer
    .define('waiting', WaitingRoom)
    .enableRealtimeListing();

gameServer.define('game', GameRoom)

gameServer.listen(PORT).then(() => {
    console.log("Game Server is listening on port: ", PORT);
});

gameServer.simulateLatency(33);