let zoom = 1200;
let focus = 1800;
const zoomMotorSteps = 2259;
const _focusMotorSteps = 2750;
let isFocusing = false;

const handles = new Set<number>();

export function getCameraData() {
    return { zoom, focus, isFocusing };
}

export function setZoom(value: number) {
    const target = value * zoomMotorSteps;
    isFocusing = true;
    interpolateZoom(target).then(() => (isFocusing = false));
}

function interpolateZoom(target: number, interval = 1) {
    const increment = target - zoom >= 0 ? 1 : -1;
    const isOutOfBounds = zoom < 0 || zoom > zoomMotorSteps;
    console.log("interpolate from", zoom, "to", target);
    return new Promise((resolve) => {
        const handle = setInterval(() => {
            // maior ou menor dependendo da direção
            if (zoom == Math.round(target)) {
                clearInterval(handle);
                resolve(undefined);
                handles.delete(handle);
            }

            handles.add(handle);

            if (isOutOfBounds) {
                handles.forEach((handle) => clearInterval(handle));
                handles.clear();
                isFocusing = false;
            }

            zoom += increment;
            focus = zoom * 0.8; // log function aqui
        }, interval);
    });
}
