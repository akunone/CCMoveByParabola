// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    ball: cc.Node = null;
    @property(cc.RigidBody)
    ballRigidBody: cc.RigidBody = null;
    @property(cc.Node)
    point1: cc.Node = null;
    @property(cc.Node)
    point2: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.ball.getComponent(cc.PhysicsCollider).friction = 0
        cc.director.getPhysicsManager().enabled = true;
    }

    getSpeedByStraight(pos1: cc.Vec2, pos2: cc.Vec2, T:number=1){
        var speed:cc.Vec2 = cc.Vec2.RIGHT;
        speed.x = 0;
        var Y = pos2.y - pos1.y;
        var A = cc.director.getPhysicsManager().gravity.y;
        speed.y = (Y - 0.5*A*T*T)/T
        return speed;
    }
    //X = Vx*T     Y=Vy*T + 0.5*A*T*T  Vy = (Y - 0.5*A*T*T)/T  T = X / Vx
    // Y = Vy*(X/Vx) + 0.5*A*(X/Vx)*(X/Vx)
    //(Vx/X)*Y = Vy + 0.5*A*(X/Vx)
    //(Vx/X1)*Y1-(Vx/X2)*Y2 = 0.5*A*(X1/Vx) - 0.5*A*(X2/Vx)
    //Vx*Vx*Y1/X1-Vx*Vx*Y2/X2 = 0.5*A*X1 - 0.5*A*X2
    //Vx*Vx = (0.5*A*X1 - 0.5*A*X2)/(Y1/X1-Y2/X2)
    //抛物线x1不能等于x2
    getSpeedByParabola(pos1: cc.Vec2, pos2: cc.Vec2, height: number = 100,straightTime:number=1) {
        if(pos1.x==pos2.x)return this.getSpeedByStraight(pos1,pos2,straightTime);
        var Vx;
        var Vy;
        var pos3 = cc.Vec2.ZERO;
        pos3.x = (pos1.x + pos2.x) * 0.5;
        pos3.y = Math.max(pos1.y,pos2.y) + height
        var X1 = pos3.x;
        var Y1 = pos3.y;
        var X2 = pos2.x;
        var Y2 = pos2.y;
        // if (X1 == 0) X1 = 0.0000001;
        // if (X2 == 0) X2 = 0.0000001;
        var A = cc.director.getPhysicsManager().gravity.y;
        var temp = (Y1 / X1 - Y2 / X2);
        // if (temp == 0) temp = 0.0000001;
        Vx = (pos2.x > pos1.x ? 1 : -1) * Math.sqrt(Math.abs((0.5 * A * X1 - 0.5 * A * X2) / temp));
        // if (X2 == 0) X2 = 0.0000001;

        var T = X2 / Vx;
        Vy = (Y2 - 0.5 * A * T * T) / T
        return cc.v2(Vx, Vy);
    }

    btnStart() {
        this.ball.setPosition(this.point1.getPosition());
        // this.scheduleOnce(() => {
        let speed = this.getSpeedByParabola(this.ball.convertToNodeSpaceAR(this.point1.convertToWorldSpaceAR(cc.Vec2.ZERO)), this.ball.convertToNodeSpaceAR(this.point2.convertToWorldSpaceAR(cc.Vec2.ZERO)))
        this.ballRigidBody.linearVelocity = speed;
        // }, 1)
    }

    start() {

    }

    // update (dt) {}
}
