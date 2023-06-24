import { Schema, type } from '@colyseus/schema';
import Stat from './Stat';
import DatabaseManager from '../../system/Database/DatabaseManager';

export default class Weapon extends Schema {
    @type(Stat) stat
    @type("string") name?: string
    @type("string") description?: string
    @type("string") sprite?: string
    @type("string") projectile?: string
    @type("string") weaponId?: string

    constructor(weaponId: string = "bow-id") {
        super(0, 0);
        this.stat = Stat.getZeroStat()

        this.setWeapon(weaponId)
    }

    setWeapon(weaponId: string){
        let weapon = DatabaseManager.getManager().getWeapon(weaponId)

        if(weapon){
            this.weaponId = weaponId
            this.name = weapon.name
            this.description = weapon.description
            this.sprite = weapon.sprite
            this.projectile = weapon.projectile
        }
        // else{
        //     throw new Error(`${weaponId} is not a valid weaponId`)
        // }
    }
}