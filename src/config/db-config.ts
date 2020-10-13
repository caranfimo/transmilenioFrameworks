import { Client } from 'elasticsearch';

export class DbConfig {
    private static readonly  url: string = 'http://localhost:9200'

    public static getClient(): Client {
        return new Client({
            host: this.url
        })
    }
}