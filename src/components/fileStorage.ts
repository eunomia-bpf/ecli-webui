
import EmceptionWorker from "./emception.worker";
import * as Comlink from "comlink";


const emception = Comlink.wrap(new EmceptionWorker());


export class FileStorage {
    constructor() {
        this.files = [];
    }

    addFile(file: any) {
        this.files.push(file);
    }

    getFileNames() {
        return this.files.map((file: { name: any; }) => file.name);
    }

    getFileContent(fileName: any) {
        const file = this.files.find((file: { name: any; }) => file.name === fileName);
        if (file) {
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = function (event) {
                    resolve(event.target.result);
                };
                reader.onerror = function (error) {
                    reject(error);
                };

                reader.readAsText(file);
            });
        } else {
            return Promise.reject(new Error("File not found."));
        }
    }

    async writeToVirtualFS() {
        const fileNames = this.getFileNames();
        for (let i = 0; i < fileNames.length; i++) {
            let perName = fileNames[i];
            let perCtx = await this.getFileContent(perName);

            await emception.fileSystem.writeFile(`/working/${perName}`, perCtx);
        }
    }

    getRealName() {
        const fileNames = this.getFileNames();
        return fileNames[0].split(".")[0];
    }
}