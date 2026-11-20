import { Instance } from 'cs_script/point_script';

class MathUtils {
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}

class EulerUtils {
    static equals(a, b) {
        return a.pitch === b.pitch && a.yaw === b.yaw && a.roll === b.roll;
    }
    static normalize(angle) {
        const normalizeAngle = (angle) => {
            angle = angle % 360;
            if (angle > 180)
                return angle - 360;
            if (angle < -180)
                return angle + 360;
            return angle;
        };
        return new Euler(normalizeAngle(angle.pitch), normalizeAngle(angle.yaw), normalizeAngle(angle.roll));
    }
    static forward(angle) {
        const pitchInRad = (angle.pitch / 180) * Math.PI;
        const yawInRad = (angle.yaw / 180) * Math.PI;
        const cosPitch = Math.cos(pitchInRad);
        return new Vec3(cosPitch * Math.cos(yawInRad), cosPitch * Math.sin(yawInRad), -Math.sin(pitchInRad));
    }
    static right(angle) {
        const pitchInRad = (angle.pitch / 180) * Math.PI;
        const yawInRad = (angle.yaw / 180) * Math.PI;
        const rollInRad = (angle.roll / 180) * Math.PI;
        const sinPitch = Math.sin(pitchInRad);
        const sinYaw = Math.sin(yawInRad);
        const sinRoll = Math.sin(rollInRad);
        const cosPitch = Math.cos(pitchInRad);
        const cosYaw = Math.cos(yawInRad);
        const cosRoll = Math.cos(rollInRad);
        return new Vec3(-1 * sinRoll * sinPitch * cosYaw + -1 * cosRoll * -sinYaw, -1 * sinRoll * sinPitch * sinYaw + -1 * cosRoll * cosYaw, -1 * sinRoll * cosPitch);
    }
    static up(angle) {
        const pitchInRad = (angle.pitch / 180) * Math.PI;
        const yawInRad = (angle.yaw / 180) * Math.PI;
        const rollInRad = (angle.roll / 180) * Math.PI;
        const sinPitch = Math.sin(pitchInRad);
        const sinYaw = Math.sin(yawInRad);
        const sinRoll = Math.sin(rollInRad);
        const cosPitch = Math.cos(pitchInRad);
        const cosYaw = Math.cos(yawInRad);
        const cosRoll = Math.cos(rollInRad);
        return new Vec3(cosRoll * sinPitch * cosYaw + -sinRoll * -sinYaw, cosRoll * sinPitch * sinYaw + -sinRoll * cosYaw, cosRoll * cosPitch);
    }
    static lerp(a, b, fraction, clamp = true) {
        let t = fraction;
        if (clamp) {
            t = MathUtils.clamp(t, 0, 1);
        }
        const lerpComponent = (start, end, t) => {
            let delta = end - start;
            if (delta > 180) {
                delta -= 360;
            }
            else if (delta < -180) {
                delta += 360;
            }
            return start + delta * t;
        };
        return new Euler(lerpComponent(a.pitch, b.pitch, t), lerpComponent(a.yaw, b.yaw, t), lerpComponent(a.roll, b.roll, t));
    }
    static withPitch(angle, pitch) {
        return new Euler(pitch, angle.yaw, angle.roll);
    }
    static withYaw(angle, yaw) {
        return new Euler(angle.pitch, yaw, angle.roll);
    }
    static withRoll(angle, roll) {
        return new Euler(angle.pitch, angle.yaw, roll);
    }
    static rotateTowards(current, target, maxStep) {
        const rotateComponent = (current, target, step) => {
            let delta = target - current;
            if (delta > 180) {
                delta -= 360;
            }
            else if (delta < -180) {
                delta += 360;
            }
            if (Math.abs(delta) <= step) {
                return target;
            }
            else {
                return current + Math.sign(delta) * step;
            }
        };
        return new Euler(rotateComponent(current.pitch, target.pitch, maxStep), rotateComponent(current.yaw, target.yaw, maxStep), rotateComponent(current.roll, target.roll, maxStep));
    }
    static clamp(angle, min, max) {
        return new Euler(MathUtils.clamp(angle.pitch, min.pitch, max.pitch), MathUtils.clamp(angle.yaw, min.yaw, max.yaw), MathUtils.clamp(angle.roll, min.roll, max.roll));
    }
}

class Euler {
    pitch;
    yaw;
    roll;
    static Zero = new Euler(0, 0, 0);
    constructor(pitchOrAngle, yaw, roll) {
        if (typeof pitchOrAngle === 'object') {
            this.pitch = pitchOrAngle.pitch;
            this.yaw = pitchOrAngle.yaw;
            this.roll = pitchOrAngle.roll;
        }
        else {
            this.pitch = pitchOrAngle;
            this.yaw = yaw;
            this.roll = roll;
        }
    }
    get normal() {
        return EulerUtils.normalize(this);
    }
    get forward() {
        return EulerUtils.forward(this);
    }
    get backward() {
        return this.forward.inverse;
    }
    get right() {
        return EulerUtils.right(this);
    }
    get left() {
        return this.right.inverse;
    }
    get up() {
        return EulerUtils.up(this);
    }
    get down() {
        return this.up.inverse;
    }
    toString() {
        return `Euler: [${this.pitch}, ${this.yaw}, ${this.roll}]`;
    }
    equals(angle) {
        return EulerUtils.equals(this, angle);
    }
    lerp(angle, fraction, clamp = true) {
        return EulerUtils.lerp(this, angle, fraction, clamp);
    }
    withPitch(pitch) {
        return EulerUtils.withPitch(this, pitch);
    }
    withYaw(yaw) {
        return EulerUtils.withYaw(this, yaw);
    }
    withRoll(roll) {
        return EulerUtils.withRoll(this, roll);
    }
    rotateTowards(angle, maxStep) {
        return EulerUtils.rotateTowards(this, angle, maxStep);
    }
    clamp(min, max) {
        return EulerUtils.clamp(this, min, max);
    }
}

const RAD_TO_DEG = 180 / Math.PI;

class Vector3Utils {
    static equals(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
    static add(a, b) {
        return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static subtract(a, b) {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static scale(vector, scale) {
        return new Vec3(vector.x * scale, vector.y * scale, vector.z * scale);
    }
    static multiply(a, b) {
        return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    static divide(vector, divider) {
        if (typeof divider === 'number') {
            return new Vec3(vector.x / divider, vector.y / divider, vector.z / divider);
        }
        else {
            return new Vec3(vector.x / divider.x, vector.y / divider.y, vector.z / divider.z);
        }
    }
    static length(vector) {
        return Math.sqrt(Vector3Utils.lengthSquared(vector));
    }
    static lengthSquared(vector) {
        return vector.x ** 2 + vector.y ** 2 + vector.z ** 2;
    }
    static length2D(vector) {
        return Math.sqrt(Vector3Utils.length2DSquared(vector));
    }
    static length2DSquared(vector) {
        return vector.x ** 2 + vector.y ** 2;
    }
    static normalize(vector) {
        const length = Vector3Utils.length(vector);
        return length ? Vector3Utils.divide(vector, length) : Vec3.Zero;
    }
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    static cross(a, b) {
        return new Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }
    static inverse(vector) {
        return new Vec3(-vector.x, -vector.y, -vector.z);
    }
    static distance(a, b) {
        return Vector3Utils.subtract(a, b).length;
    }
    static distanceSquared(a, b) {
        return Vector3Utils.subtract(a, b).lengthSquared;
    }
    static floor(vector) {
        return new Vec3(Math.floor(vector.x), Math.floor(vector.y), Math.floor(vector.z));
    }
    static vectorAngles(vector) {
        let yaw = 0;
        let pitch = 0;
        if (!vector.y && !vector.x) {
            if (vector.z > 0)
                pitch = -90;
            else
                pitch = 90;
        }
        else {
            yaw = Math.atan2(vector.y, vector.x) * RAD_TO_DEG;
            pitch = Math.atan2(-vector.z, Vector3Utils.length2D(vector)) * RAD_TO_DEG;
        }
        return new Euler({
            pitch,
            yaw,
            roll: 0,
        });
    }
    static lerp(a, b, fraction, clamp = true) {
        let t = fraction;
        if (clamp) {
            t = MathUtils.clamp(t, 0, 1);
        }
        return new Vec3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
    }
    static directionTowards(a, b) {
        return Vector3Utils.subtract(b, a).normal;
    }
    static lookAt(a, b) {
        return Vector3Utils.directionTowards(a, b).eulerAngles;
    }
    static withX(vector, x) {
        return new Vec3(x, vector.y, vector.z);
    }
    static withY(vector, y) {
        return new Vec3(vector.x, y, vector.z);
    }
    static withZ(vector, z) {
        return new Vec3(vector.x, vector.y, z);
    }
}

class Vec3 {
    x;
    y;
    z;
    static Zero = new Vec3(0, 0, 0);
    constructor(xOrVector, y, z) {
        if (typeof xOrVector === 'object') {
            this.x = xOrVector.x;
            this.y = xOrVector.y;
            this.z = xOrVector.z;
        }
        else {
            this.x = xOrVector;
            this.y = y;
            this.z = z;
        }
    }
    get length() {
        return Vector3Utils.length(this);
    }
    get lengthSquared() {
        return Vector3Utils.lengthSquared(this);
    }
    get length2D() {
        return Vector3Utils.length2D(this);
    }
    get length2DSquared() {
        return Vector3Utils.length2DSquared(this);
    }
    get normal() {
        return Vector3Utils.normalize(this);
    }
    get inverse() {
        return Vector3Utils.inverse(this);
    }
    get floored() {
        return Vector3Utils.floor(this);
    }
    get eulerAngles() {
        return Vector3Utils.vectorAngles(this);
    }
    toString() {
        return `Vec3: [${this.x}, ${this.y}, ${this.z}]`;
    }
    equals(vector) {
        return Vector3Utils.equals(this, vector);
    }
    add(vector) {
        return Vector3Utils.add(this, vector);
    }
    subtract(vector) {
        return Vector3Utils.subtract(this, vector);
    }
    divide(vector) {
        return Vector3Utils.divide(this, vector);
    }
    scale(scaleOrVector) {
        return typeof scaleOrVector === 'number'
            ? Vector3Utils.scale(this, scaleOrVector)
            : Vector3Utils.multiply(this, scaleOrVector);
    }
    multiply(scaleOrVector) {
        return typeof scaleOrVector === 'number'
            ? Vector3Utils.scale(this, scaleOrVector)
            : Vector3Utils.multiply(this, scaleOrVector);
    }
    dot(vector) {
        return Vector3Utils.dot(this, vector);
    }
    cross(vector) {
        return Vector3Utils.cross(this, vector);
    }
    distance(vector) {
        return Vector3Utils.distance(this, vector);
    }
    distanceSquared(vector) {
        return Vector3Utils.distanceSquared(this, vector);
    }
    lerpTo(vector, fraction, clamp = true) {
        return Vector3Utils.lerp(this, vector, fraction, clamp);
    }
    directionTowards(vector) {
        return Vector3Utils.directionTowards(this, vector);
    }
    lookAt(vector) {
        return Vector3Utils.lookAt(this, vector);
    }
    withX(x) {
        return Vector3Utils.withX(this, x);
    }
    withY(y) {
        return Vector3Utils.withY(this, y);
    }
    withZ(z) {
        return Vector3Utils.withY(this, z);
    }
}
let idPool = 0;
let tasks = [];

function setTimeout(callback, ms) {
    const id = idPool++;
    tasks.unshift({
        id,
        atSeconds: Instance.GetGameTime() + ms / 1000,
        callback,
    });
    return id;
}

function runSchedulerTick() {
    for (let i = tasks.length - 1; i >= 0; i--) {
        const task = tasks[i];
        if (Instance.GetGameTime() < task.atSeconds)
            continue;

        if (task.everyNSeconds === undefined)
            tasks.splice(i, 1);
        else
            task.atSeconds = Instance.GetGameTime() + task.everyNSeconds;

        try {
            task.callback();
        }
        catch (err) {
            Instance.Msg('An error occurred inside a scheduler task');
            if (err instanceof Error) {
                Instance.Msg(err.message);
                Instance.Msg(err.stack ?? '<no stack>');
            }
        }
    }
}

const CSInputs = {
    NONE: 0,
    FORWARD: 1 << 0,
    BACK: 1 << 1,
    LEFT: 1 << 2,
    RIGHT: 1 << 3,
    WALK: 1 << 4,
    DUCK: 1 << 5,
    JUMP: 1 << 6,
    USE: 1 << 7,
    ATTACK: 1 << 8,
    ATTACK2: 1 << 9,
    RELOAD: 1 << 10,
    SHOW_SCORES: 1 << 11,
    LOOK_AT_WEAPON: 1 << 12
};

/*
    By xen
    Various custom functions for use in surf maps

    Usage: Add a point_script and point it to this script, and add an empty logic_case named script_relay.
    On any trigger you can then do "OnWhatever > script_relay > InValue > [custom_function]", where custom_function is any of the following:

    targetname <newname> : Changes player's targetname.
    basevelocity <x y z> : Applies a basevelocity boost.
    landmark_teleport <destination> <landmark> : Teleports the player relative to a landmark.
    gravity <x> : Sets the player's gravity scale.
    nojump <0/1> : Toggles nojump.

    Added by Faux:
    setvelocity <x y z>
    velocity <x y z>
    collect <#>
    collect_reset <>
*/

const RELAY_NAME = "script_relay";
let relayOutput = undefined;

function Init() {
    Instance.Msg("[Surf Script] Script loaded");
    setTimeout(() => { InitScriptRelay(); }, 500);
}

Instance.OnActivate(Init);
Instance.OnScriptReload({ after: Init });
Instance.OnRoundStart(Init);

Instance.SetThink(() => {
    Instance.SetNextThink(Instance.GetGameTime());
    runSchedulerTick();
    GravityThink();

    /*
    ButtonsThink();
    */
});

Instance.SetNextThink(Instance.GetGameTime());

function InitScriptRelay() {
    let relayEnt = Instance.FindEntityByName(RELAY_NAME);

    if (!relayEnt) {
        Instance.Msg(`[Surf Script] Could not find relay entity (it must be an empty logic_case called ${RELAY_NAME}!)`);
        return;
    }

    if (relayOutput && relayOutput != 0)
        Instance.DisconnectOutput(relayOutput);

    Instance.Msg("[Surf Script] Found relay entity");

    relayOutput = Instance.ConnectOutput(
        relayEnt,
        "OnDefault",
        OnRunScriptFunction
    );
}

function OnRunScriptFunction(inputData) {
    if (!inputData.activator || !inputData.activator.IsValid())
        return;

    const pawn = inputData.activator;
    const inputString = inputData.value;

    if (!inputString || !pawn || typeof inputString !== 'string')
        return;

    const tokens = inputString.split(" ");

    switch (tokens[0]) {

        case "targetname":
        {
            if (tokens[1] != undefined)
                pawn.SetEntityName(tokens[1]);
            break;
        }

        case "basevelocity":
        {
            const curVelocity = pawn.GetAbsVelocity();

            let newVelocity = new Vec3(
                parseFloat(tokens[1]),
                parseFloat(tokens[2]),
                parseFloat(tokens[3])
            );

            newVelocity = newVelocity.add(curVelocity);
            pawn.Teleport({ velocity: newVelocity });
            break;
        }

        case "gravity":
        {
            pawn.gravity = parseFloat(tokens[1]);
            break;
        }

        case "nojump":
        {
            pawn.nojump = parseInt(tokens[1]);
            break;
        }

        case "landmark_teleport":
        {
            const destination = Instance.FindEntityByName(tokens[1]);
            const landmark = Instance.FindEntityByName(tokens[2]);

            if (landmark == null || destination == null) {
                Instance.Msg(`[Surf Script] Invalid destination and/or landmark for "${inputString}"`);
                break;
            }

            const pawnOrigin = new Vec3(pawn.GetAbsOrigin());
            const landmarkOrigin = new Vec3(landmark.GetAbsOrigin());

            let landmarkOffset = pawnOrigin.subtract(landmarkOrigin);
            const newOrigin = landmarkOffset.add(destination.GetAbsOrigin());

            pawn.Teleport({ position: newOrigin });
            break;
        }

        case "setvelocity":
        {
            let curVelocity = pawn.GetAbsVelocity();

            let targetVelocity = new Vec3(
                parseFloat(tokens[1]),
                parseFloat(tokens[2]),
                parseFloat(tokens[3])
            );

            const newVelocity = new Vec3(
                Math.abs(curVelocity.x) > Math.abs(targetVelocity.x) ? curVelocity.x : targetVelocity.x,
                Math.abs(curVelocity.y) > Math.abs(targetVelocity.y) ? curVelocity.y : targetVelocity.y,
                Math.abs(curVelocity.z) > Math.abs(targetVelocity.z) ? curVelocity.z : targetVelocity.z
            );

            pawn.Teleport({ velocity: newVelocity });

            break;
        }

        case "velocity":
        {
            let targetVelocity = new Vec3(
                parseFloat(tokens[1]),
                parseFloat(tokens[2]),
                parseFloat(tokens[3])
            );

            pawn.Teleport({ velocity: targetVelocity });
            break;
        }

        // SIX-KEY COLLECTION SYSTEM
        case "collect":
        {
            let name = pawn.GetEntityName();
            let forkID = Number(tokens[1]);

            if (name.length !== 12) {
                Instance.Msg("[Collect] ERROR: name length is not 12 -> " + name);
                return;
            }

            Instance.Msg("[Collect] BEFORE: " + name + " | forkID: " + forkID);

            let chars = name.split('');

            if (forkID === 0) {
                Instance.Msg("[Collect] Applying fork 0 (a1 at 0-1)");
                chars.splice(0, 2, 'a', '1');
            }
            else if (forkID === 1) {
                Instance.Msg("[Collect] Applying fork 1 (b1 at 2-3)");
                chars.splice(2, 2, 'b', '1');
            }
            else if (forkID === 2) {
                Instance.Msg("[Collect] Applying fork 2 (c1 at 4-5)");
                chars.splice(4, 2, 'c', '1');
            }
            else if (forkID === 3) {
                Instance.Msg("[Collect] Applying fork 3 (d1 at 6-7)");
                chars.splice(6, 2, 'd', '1');
            }
            else if (forkID === 4) {
                Instance.Msg("[Collect] Applying fork 4 (e1 at 8-9)");
                chars.splice(8, 2, 'e', '1');
            }
            else if (forkID === 5) {
                Instance.Msg("[Collect] Applying fork 5 (f1 at 10-11)");
                chars.splice(10, 2, 'f', '1');
            }
            else {
                Instance.Msg("[Collect] ERROR: invalid forkID -> " + forkID);
                return;
            }

            let finalString = chars.join('');

            Instance.Msg("[Collect] AFTER: " + finalString);

            pawn.SetEntityName(finalString);

            Instance.Msg("[Collect] VERIFY: " + pawn.GetEntityName());

            break;
        }

        case "collect_reset":
        {
            pawn.SetEntityName("a0b0c0d0e0f0");

            Instance.Msg(
                "[Collect_reset] Reset name to: " +
                pawn.GetEntityName()
            );

            break;
        }

        case "setcamera":
        {
            const camera = pawn.GetCustomCamera();

            const target = Instance.FindEntityByName(tokens[1]);

            if (!target) {
                Instance.Msg(`[IO Script] ERROR, no camera target found with name in "${inputString}"`);
                break;
            }

            camera.SetFollowConfig({
                followEntity: target
            });

            camera.Teleport({
                position: target.GetAbsOrigin(),
                angles: target.GetAbsAngles()
            });

            camera.SetMode(1);

            break;
        }

        case "resetcamera":
        {
            const camera = pawn.GetCustomCamera();
            camera.SetMode(0);
            break;
        }

        default:
            Instance.Msg(`[Surf Script] Invalid custom script function "${inputString}"`);
    }
}

Instance.OnPlayerJump((event) => {
    const pawn = event.player;

    if (pawn.nojump === 0)
        return;

    setTimeout(() => {
        pawn.Teleport({ velocity: { x: 0, y: 0, z: 0 } });
    }, 0);
});

Instance.OnPlayerReset((event) => {
    event.player.gravity = 1.0;
    event.player.nojump = 0;
});

// hopefully no server is insane enough to change sv_gravity
const GRAVITY = 800 / 64;

function GravityThink() {
    for (let i = 0; i < 64; i++) {
        let controller = Instance.GetPlayerController(i);

        if (!controller || !controller.IsValid() || controller.IsObserving())
            continue;

        let pawn = controller.GetPlayerPawn();

        if (!pawn || !pawn.IsValid() || !pawn.IsAlive() || pawn.gravity == 1.0)
            continue;

        let impulse = GRAVITY * pawn.gravity;

        if (impulse > GRAVITY)
            impulse = impulse - GRAVITY;
        else
            impulse = -(GRAVITY - impulse);

        let newVelocity = new Vec3(pawn.GetAbsVelocity());

        newVelocity.z = newVelocity.z - impulse;

        pawn.Teleport({ velocity: newVelocity });
    }
}

// For maps that make use of +use.
// Existing flip/flop functionality preserved.
function ButtonsThink() {
    for (let i = 0; i < 64; i++) {
        let controller = Instance.GetPlayerController(i);

        if (!controller || !controller.IsValid() || controller.IsObserving())
            continue;

        let pawn = controller.GetPlayerPawn();

        if (!pawn || !pawn.IsValid() || !pawn.IsAlive())
            continue;

        let name = pawn.GetEntityName();

        if (name !== "flip" && name !== "flop")
            continue;

        const curVelocity = pawn.GetAbsVelocity();

        let flipVelocity = new Vec3(0, 0, 0);
        let flopVelocity = new Vec3(0, 0, 0);

        if (pawn.WasInputJustPressed(CSInputs.USE)) {
            if (name === "flip") {
                flipVelocity = flipVelocity.add(curVelocity);

                pawn.Teleport({
                    velocity: flipVelocity
                });

                pawn.SetEntityName("flop");

                Instance.Msg("[IO Script] applied flip velocity");
            }
            else if (name === "flop") {
                flopVelocity = flopVelocity.add(curVelocity);

                pawn.Teleport({
                    velocity: flopVelocity
                });

                pawn.SetEntityName("flip");

                Instance.Msg("[IO Script] applied flop velocity");
            }
        }
    }
}