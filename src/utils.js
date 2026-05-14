export const svgNamespace = "http://www.w3.org/2000/svg";

export const html = (() => {
    const tmp = document.createElement("div");
    return (src) => {
        tmp.innerHTML = src;
        const result = tmp.querySelector("*");
        tmp.innerHTML = "";
        return result;
    }
})();

export const svg = (() => {
    const tmp = document.createElementNS(svgNamespace, "svg");
    return (src) => {
        tmp.innerHTML = src;
        const result = tmp.querySelector("*");
        tmp.innerHTML = "";
        return result;
    }
})();
