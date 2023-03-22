import Phaser from "phaser";
import Player from "../gameobjs/Player";
import * as Colyseus from 'colyseus.js';

export default class GameManager {
    private scene: Phaser.Scene;
    private gameRoom: Colyseus.Room;

    private gameObjects?: Phaser.GameObjects.Sprite[] = [];
    private player1?: Player;
    private players: Player[] = [];

    constructor(scene:Phaser.Scene,room:Colyseus.Room) {
        this.scene = scene;
        this.gameRoom = room;
        this.initializeListeners(); 
        
    }

    private initializeListeners() {
        this.gameRoom.state.gameObjects.onAdd = this.onAdd;
    }

    //TODO Change in future 
    private getTypeOfObject(gameObj: any): string{
        if(gameObj.hasOwnProperty('role')) return "player";
        if(gameObj.hasOwnProperty('ownerId')) return "projectile"
        else return ""
    }

    private onAdd = (gameObj:any, key:string) => {
        if(!gameObj) return;
        let objType = this.getTypeOfObject(gameObj)
        switch (objType){
            case 'player':
                this.gameObjects?.push(this.addPlayer(gameObj, key));
                break;
            case 'projectile':
                // console.log("projectile spawned")
                // console.log(gameObj)
                this.gameObjects?.push(this.addProjectile(gameObj, key));
                break;
        }   
    }

    private addProjectile(projectile: any, key: string): Phaser.GameObjects.Sprite{
        let proj =  new Phaser.GameObjects.Sprite(this.scene, projectile.x, projectile.y, "demo_hero");
        proj.scale = 0.5
        projectile.onChange = (changes:any) => {
            changes.forEach(({field, value}: any) => {
                switch(field) {
                    case "x": proj.x = value; break;
                    case "y": proj.y = value; break;
                }
            })
        }
        this.scene.add.existing(proj)
        return proj;
    }
    
    private addPlayer(player: any, key: string): Player{
        let newPlayer = new Player(this.scene, player);
        console.log(newPlayer)
        if(key === this.gameRoom.sessionId)
            this.player1 = newPlayer
        else
            this.players.push(newPlayer);
        this.scene.add.existing(newPlayer);
        newPlayer.initializeListeners(player);
        return newPlayer
    }
}