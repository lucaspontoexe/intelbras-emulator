let number = 0;

export function lerpNumberAsync(limit = 100, interval = 10, increment = 1) {
    return new Promise((resolve) => {
        const handle = setInterval(() => {
            if (number >= limit) {
                clearInterval(handle);
                resolve(undefined);
            }
            console.log(number);
            number += increment;
        }, interval);
    });
}

// todo: target, interval

function lerp2(target: number, interval = 10) {
    const increment = (target - number >= 0) ? 1 : -1;
    return new Promise((resolve) => {
        const handle = setInterval(() => {
            // maior ou menor dependendo da direção
            if (number == target) {
                clearInterval(handle);
                resolve(undefined);
            }
            console.log(number);
            number += increment;
        }, interval);
    });
}

if (import.meta.main) {
    number = 100;
    console.log("will run");
    lerp2(200).then(() => console.log("foi"));
}
