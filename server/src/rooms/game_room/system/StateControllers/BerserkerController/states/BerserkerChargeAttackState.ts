import ChargeAttack from "../../PlayerControllers/CommonStates/ChargeAttack";

export default class BerserkerChargeAttackState extends ChargeAttack{
    protected attackDuration: number = 0.5
    protected triggerPercent: number = 0
}