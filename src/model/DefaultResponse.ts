export class DefaultResponse {
    message: string;
    type: string;

    constructor(message: string, type: string = 'INFO') {
        this.message = message;
        this.type = type;
    }
}