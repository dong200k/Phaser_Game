import { Schema, type } from '@colyseus/schema';

export default class ReconciliationInfo extends Schema {
    @type("string") clientId: string;
    @type("number") adjustmentAmount: number; // number of ticks the client should adjust.
    @type("number") adjustmentId: number; // current adjustment id.
    @type("number") adjectmentConfirmId: number; // confirmed adjustment id.

    constructor(clientId: string) {
        super();
        this.adjustmentAmount = 0;
        this.adjectmentConfirmId = 0;
        this.adjustmentId = 0;
        this.clientId = clientId;
    }
}