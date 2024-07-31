let number = 0;

const _zoomMotorSteps = 2259;
const _focusMotorSteps = 2750;


function _lerp2(target: number, interval = 10, onChange: (num: number) => number) {
    const increment = (target - number >= 0) ? 1 : -1;
    return new Promise((resolve) => {
        const handle = setInterval(() => {
            // maior ou menor dependendo da direção
            if (number == target) {
                clearInterval(handle);
                resolve(undefined);
            }
            onChange(number);
            number += increment;
        }, interval);
    });
}

class _Camera {
    zoom = 0;
    focus = 0;
    constructor() {
        this.zoom = 0;
        this.focus = 0;
    }
}

// if (import.meta.main) {
//     number = 100;
//     console.log("running");
//     lerp2(200).then(() => console.log("done"));
// }
