import {IServiceModel} from "./IServiceModel";
import {IStationModel} from "./IStationModel";

export interface IRouteModel {
    id?: string;
    service: IServiceModel;
    origin_station: IStationModel;
    destination_station: IStationModel;
    order: number;
}