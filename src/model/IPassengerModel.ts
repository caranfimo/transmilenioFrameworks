import {ITravelModel} from "./ITravelModel";

export interface IPassengerModel {
    id?: string;
    name: string,
    document_number: string;
    document_type: string;
    travels?: ITravelModel[];

}