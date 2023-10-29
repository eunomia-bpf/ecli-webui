export default class Process {
    constructor({
        onrunprocess = () => ({ returncode: 1, stdout: "", stderr: "Not implemented" }),
        onprint = () => { },
        onprintErr = () => { },
    }) {
        Object.assign(this, { onrunprocess, onprint, onprintErr });
    }

    onrunprocess = () => { };
    onprint = () => { };
    onprintErr = () => { };
};
