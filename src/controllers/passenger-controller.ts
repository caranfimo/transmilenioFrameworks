import {Request, Response, Router} from 'express';
import debugLib from 'debug';
import {IPassengerModel} from "../model/IPassengerModel";
import {DbConfig} from "../config/db-config";
import {DefaultResponse} from "../model/DefaultResponse";
import {Utils} from "../utils";
import fetch from "node-fetch";

const debug = debugLib('transmilenioframeworks:TransmilenioPassenger');
const router = Router();

const indexName = "passengers";
const default_type = "_doc";

router.post('/', async (req: Request, res: Response) => {
    const body = req.body as IPassengerModel;
    try {
        const response = await createPassenger(body);
        res.status(200).json(new DefaultResponse("pasajero creado correctamente"));
    } catch (exception) {
      res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al crear pasajero', 'ERROR'));
    }
});

router.get('/', async (req: Request, res: Response) => {
    DbConfig.getClient()
        .search({
            index: indexName,
            filterPath: 'hits.hits._source, hits.hits._id'
        })
        .then((response) => {
            const passengers: IPassengerModel[] = Utils.getListElementsElasticSearch(response);
            debug("response %j", JSON.stringify(passengers));
            res.status(200).json(passengers);
        }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al consultar pasajeros', 'ERROR'));
    });

});

router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    debug("id %j", id);
    DbConfig.getClient()
        .get({
            id: id,
            index: indexName,
            type: default_type,
            _source: true
        })
        .then((response) => {
            debug("response %j", JSON.stringify(response));
            res.status(200).json(response);
        }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al consultar pasajero', 'ERROR'));
    });
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body as IPassengerModel;
    debug("id %j", id);
    DbConfig.getClient()
        .update({
            id: id,
            index: indexName,
            type: default_type,
            body: {
                doc: body
            },
            _source: true,
            refresh: "true",
            filterPath: 'get._source'
        })
        .then((response) => {
            const passenger: IPassengerModel = response.get._source;
            debug("response %j", JSON.stringify(passenger));
            res.status(200).json(passenger);
        }).catch((exception) => {
        debug("error actualizando %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al actualizar pasajero', 'ERROR'));
    });
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    debug("id %j", id);
    DbConfig.getClient()
        .delete({
            id: id,
            index: indexName,
            type: default_type
        })
        .then((response) => {
            debug("response %j", JSON.stringify(response));
            res.status(200).json(response);
        }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al eliminar pasajero', 'ERROR'));
    });
});

router.post('/load-passenger', async (req: Request, res: Response)=> {
    fetch('http://localhost:3000/passengers')
        .then(async (respose) =>{
            const passengers: IPassengerModel[] = await respose.json() as IPassengerModel[];
            try{
                passengers.forEach((passenger) => {
                    createPassenger(passenger);
                });
                res.status(200).json({message: `se agregaron ${passengers.length} pasajeros`})
            }
            catch (e) {
                res.status(500).json({message: 'ocurrio un error'})
            }

        })
        .catch((reason => {
            res.status(500).json({message: 'ocurrio un error'})
        }));
});

const createPassenger = async (body: IPassengerModel): Promise<any> => {

    DbConfig.getClient().index<IPassengerModel>(
        {
            index: indexName,
            body: body,
            type: default_type,
        }).then((response) => {
        debug("response create %j", JSON.stringify(response));
        return Promise.resolve(response);
    }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        return Promise.reject(exception);
    });
}


export default router;