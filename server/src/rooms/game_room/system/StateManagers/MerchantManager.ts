import Merchant from "../../schemas/gameobjs/Merchant";
import Player from "../../schemas/gameobjs/Player";
import MerchantItem from "../../schemas/merchant_items/MerchantItem";
import DatabaseManager from "../Database/DatabaseManager";
import GameManager from "../GameManager";

export default class MerchantManager{
    private gameManager: GameManager
    private createdMerchant = false
    private merchant!: Merchant

    constructor(gameManager: GameManager){
        this.gameManager = gameManager
    }

    public handleInteractMerchant(player: Player, merchant: Merchant){
        console.log("Player interacted with merchant")
        merchant.ping++        
        let gameRoom = this.gameManager.getGameRoom()
        let client = gameRoom.clients.find(client=>client.sessionId === player.getId())
        if(client) client.send("openMerchant")
    }

    public spawnMerchant(pos = {x: 0, y: 0}){
        console.log("Spawning merchant")
        if(!this.createdMerchant){
            this.merchant = new Merchant(this.gameManager, pos)
            let body = this.merchant.getBody() as Matter.Body;
            this.gameManager.addGameObject(this.merchant.id, this.merchant, body);
        }
        this.merchant.show(pos)
        this.refillShop()
    }

    public hideMerchant(){
        console.log("Hiding merchant")
        this.merchant?.hide()
        this.clearShop()
    }

    /** This method will generate another batch of shop items replacing the old items. */
    public refillShop(){
        this.merchant.setItems(this.generateItems())
    }

    public clearShop(){
        this.merchant.setItems([])
    }

    public getMerchantItems(){
        return this.merchant.getItems()
    }

    public purchaseItem(playerId: string, choice: number){
        console.log("Purchasing item")
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId)
        if(!player) return console.log(`Player not found in method purchaseItem.`)

        let items = this.merchant.getItems()
        if(items.length <= choice) return console.log(`Player: ${player.name} failed to purchase item, choice is invalid.`)
       
        let item = items[choice]
        if(item.amount <= 0) return console.log(`Player: ${player.name} failed to purchase item ${item.name}, item out of stock`)

        let result = item.attemptPurchase(player)
        if(result === true) {
            this.merchant.ping++
            this.merchant.items = this.merchant.items.filter(merchantItem=>merchantItem !== item)
            item.consumeItem(player)
        }
        else console.log(`Player: ${player.name} failed to purchase item ${item.name}. ${result}`)
        
    }

    /**
     * This method returns a list of items that the merchant can potentially sell.
     */
    public generateItems(){
        let factory = this.gameManager.getMerchantItemFactory()
        let items: MerchantItem[] = []

        // Stat items
        let healthItem = factory.createMaxHealthItem(25, 500)
        let lifeStealItem = factory.createLifeStealItem(0.5, 10000)

        // items.push(lifeStealItem, healthItem)

        // Artifact items
        let usageMap = this.getArtifactUsageMap()
        usageMap.forEach((artifactIds, usage)=>{
            // if(Math.random()<0.5) return

            // Pick out at most 2 random artifact for each usage
            // let choosenIds = this.chooseRandomFromList(2, artifactIds)
            // choosenIds.forEach(id=>{
            //     let artifactItem = factory.createArtifactItem(id)
            //     items.push(artifactItem)
            // })

            // Testing artifacts, comment below out and remove comments above for gameplay
            if(usage === "merchant_weapon" || usage === "fruit" || usage === "special" || usage === "dash") {
                artifactIds.forEach(id=>{
                    let cost = 0
                    if(usage === "merchant_weapon") cost = 5000
                    if(usage === "fruit") cost = 500
                    if(usage === "special") cost = 2000
                    if(usage === "dash") cost = 1000

                    let artifactItem = factory.createArtifactItem(id, 0)
                    items.push(artifactItem)
                })
            }

            // let godUpgradeNames = new Set(["vampire", "devil", "assassin", "lightning", "giant", "wisdom"])
            // if(godUpgradeNames.has(usage)) {
            //     artifactIds.forEach(id=>{
            //         let artifactItem = factory.createArtifactItem(id)
            //         items.push(artifactItem)
            //     })
            // }
        })

        return [lifeStealItem, ...this.chooseRandomFromList(5, [...items, healthItem])]
        return items
    }

    /**
     * 
     * @returns a map with a string artifact usage type as the key and a list of artifact ids as the val
     */
    public getArtifactUsageMap(){
        let dbArtifacts = DatabaseManager.getManager().getAllDatabaseArtifacts()
        let myMap: Map<string, string[]> = new Map()
        dbArtifacts.forEach((dbArtifact, id)=>{
            let type = dbArtifact.usage
            if(myMap.has(type)){
                myMap.get(type)?.push(id)
            }else{
                if(type === undefined) type = "none"
                myMap.set(type, [id])
            }
        })
        return myMap
    }

    /**
     * This method will choose randomly amountToChoose number of items from the list or until the list runs out of items. 
     * The same indexed item is not choosen more than once.
     * @param amountToChoose 
     * @param list 
     */
    static chooseRandomFromList<T>(amountToChoose: number, list: T[]): T[]{
        let temp = [...list]
        let choices: T[] = []

        while(amountToChoose !== 0 && temp.length > 0){
            let choice = Math.floor(Math.random() * temp.length)
            choices.push(temp[choice])

            temp = temp.filter((val, i)=> i!==choice)
            amountToChoose--
        }

        return choices
    }

    private chooseRandomFromList<T>(amountToChoose: number, list: T[]): T[]{
        return MerchantManager.chooseRandomFromList(amountToChoose , list)
    }
}