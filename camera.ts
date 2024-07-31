let zoom = 1200;
let focus = 1800;
export const zoomMotorSteps = 2259;
export const focusMotorSteps = 2750;
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
                zoom -= increment; // fix off-by-one;
            }

            handles.add(handle);

            if (isOutOfBounds) {
                handles.forEach((handle) => clearInterval(handle));
                handles.clear();
                isFocusing = false;
            }

            zoom += increment;
            // função quadrática enquanto a logarítmica não sai
            const zoom01 = zoom / zoomMotorSteps;
            focus = (2 * zoom01 * (1 - 0.5 * zoom01)) * focusMotorSteps;
        }, interval);
    });
}
