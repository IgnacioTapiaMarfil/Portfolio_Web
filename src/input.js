const KEY_LEFT = 37, KEY_A = 65;
const KEY_UP = 38, KEY_W = 87;
const KEY_RIGHT = 39, KEY_D = 68;
const KEY_DOWN = 40, KEY_S = 83;
const KEY_PAUSE = 19, KEY_Q = 81;
const KEY_SPACE = 32, KEY_E = 69;
const KEY_ESCAPE = 27, KEY_F = 70;
const KEY_LSHIFT = 16;
const KEY_LCTRL = 17;

const KEY_0 = 48;
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;

let keyboardEventsInitialized = false;
let mouseEventsInitialized = false;

const Input = {
    mouse: {
        x: 0,
        y: 0,
        down: false,
        up: false,
        pressed: false
    },

    keyboard: {
        keyup: {},
        keypressed: {},
        keydown: {}
    },

    IsKeyPressed: function(keycode) {
        return this.keyboard.keypressed[keycode];
    },

    IsKeyDown: function(keycode) {
        return this.keyboard.keydown[keycode];
    },

    IsKeyUp: function (keycode) {
        return this.keyboard.keyup[keycode];
    },

    IsMousePressed: function () {
        return this.mouse.pressed;
    },

    PostUpdate: function () {
        Object.keys(this.keyboard.keydown).forEach((key) => {
            this.keyboard.keydown[key] = false;
        });

        Object.keys(this.keyboard.keyup).forEach((key) => {
            this.keyboard.keyup[key] = false;
        });

        this.mouse.down = false;
        this.mouse.up = false;
    }
};

function AddEvent(element, eventName, func)
{
    if (element.addEventListener)
        element.addEventListener(eventName, func, false);
    else if (element.attachEvent)
        element.attachEvent(eventName, func);
}

function SetupKeyboardEvents ()
{
    if (keyboardEventsInitialized) return;

    AddEvent(document, "keydown", function (e) {
        if (!e.repeat) {
            Input.keyboard.keydown[e.keyCode] = true;
            Input.keyboard.keypressed[e.keyCode] = true;
        }
    } );

    AddEvent(document, "keyup", function (e) {
        Input.keyboard.keydown[e.keyCode] = false;
        Input.keyboard.keyup[e.keyCode] = true;
        Input.keyboard.keypressed[e.keyCode] = false;
    } );

    keyboardEventsInitialized = true;
}

function SetupMouseEvents ()
{
    if (!canvas || mouseEventsInitialized) return;

    canvas.addEventListener("mousedown", MouseDown, false);
    canvas.addEventListener("mousemove", MouseMove, false);
    canvas.addEventListener("mouseup", MouseUp, false);

    mouseEventsInitialized = true;
}

function MouseDown ()
{
    Input.mouse.down = true;
    Input.mouse.pressed = true;
}

function MouseUp ()
{
    Input.mouse.up = true;
    Input.mouse.pressed = false;
}

function MouseMove (event)
{
    let rect = canvas.getBoundingClientRect();
    Input.mouse.x = event.clientX - rect.left;
    Input.mouse.y = event.clientY - rect.top;
}
