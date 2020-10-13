import {IRouteModel} from "./IRouteModel";

export interface ITravelModel {
    id?: string;
    travel_date: any;
    start_time: number;
    end_time: number;
    routes: IRouteModel[];
}