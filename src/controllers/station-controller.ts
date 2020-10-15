import {Request, Response, Router} from 'express';
import debugLib from 'debug';
import {DbConfig} from "../config/db-config";
import {DefaultResponse} from "../model/DefaultResponse";
import {IStationModel} from "../model/IStationModel";
import {Utils} from "../utils";

const debug = debugLib('transmilenioframeworks:TransmilenioStation');
const router = Router();

const indexName = "stations";
const default_type = "_doc";

router.post('/', async (req: Request, res: Response) => {
    const body = req.body as IStationModel;
    DbConfig.getClient().index<IStationModel>(
        {
            index: indexName,
            body: body,
            type: default_type,
        }).then((response) => {
        debug("response create %j", JSON.stringify(response));
        res.status(200).json(new DefaultResponse("estacion creado correctamente"));
    }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al crear estacion', 'ERROR'));
    });

});

router.get('/', async (req: Request, res: Response) => {
    DbConfig.getClient()
        .search({
            index: indexName,
            filterPath: 'hits.hits._source, hits.hits._id'
        })
        .then((response) => {
            const passengers: IStationModel[] = Utils.getListElementsElasticSearch(response);
            debug("response %j", JSON.stringify(passengers));
            res.status(200).json(passengers);
        }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al consultar estaciones', 'ERROR'));
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
            res.status(200).json(response._source);
        }).catch((exception) => {
        debug("error create %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al consultar estacion', 'ERROR'));
    });
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body as IStationModel;
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
            const passenger: IStationModel = response.get._source;
            debug("response %j", JSON.stringify(passenger));
            res.status(200).json(passenger);
        }).catch((exception) => {
        debug("error actualizando %j", JSON.stringify(exception));
        res.status(exception.status || 500).json(new DefaultResponse(exception.reason
            || 'ocurrio un error al actualizar estacion', 'ERROR'));
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
            || 'ocurrio un error al eliminar estacion', 'ERROR'));
    });
});
export default router;