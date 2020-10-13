import {Request, Response, Router} from 'express';
import debugLib from 'debug';
import {IPassengerModel} from "../model/IPassengerModel";
import {DbConfig} from "../config/db-config";
import {DefaultResponse} from "../model/DefaultResponse";
import {Utils} from "../utils";

const debug = debugLib('transmilenioframeworks:TransmilenioPassenger');
const router = Router();

const indexName = "passengers";
const default_type = "_doc";

router.post('/', async (req: Request, res: Response) => {
    const body = req.body as IPassengerModel;
    DbConfig.getClient().index<IPassengerModel>(
        {
            index: indexName,
            body: body,
            type: default_type,
        }).then((response) => {
        debug("response create %j", JSON.stringify(response));
        res.status(200).json(new DefaultResponse("pasajero creado correctamente"));
    }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al crear pasajero', 'ERROR'));
    });

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
        .getSource({
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

export default router;