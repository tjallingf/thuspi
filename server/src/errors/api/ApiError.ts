export interface ApiErrorJSON {
    type: string;
    status: number;
    message: string;
    [key: string]: any;
}

export default class ApiError extends Error {
    status: number;
    meta: any;

    constructor(type: string, message: string, status: number, meta: any = {}) {
        super(message);
        this.name = type;
        this.status = status;
        this.meta = meta;
    }

    toJSON(): ApiErrorJSON {
        return {
            type: this.name,
            status: this.status,
            message: this.message,
            ...this.meta,
        };
    }
}
