
export class Utils {
    public static getListElementsElasticSearch(value: any): any[] {
        const array: any[] = [];
        value.hits.hits.forEach((object: any)=> {
            const result = object._source;
            result.id = object._id;
            array.push(result);
        })
        return array;
    }
}