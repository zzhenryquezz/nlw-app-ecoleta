import knex from "./../database/connection";
import { Request, Response } from "express";

export class PointsController {
    async index(request: Request, response: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items).trim().split(",").map(Number);

        const points = await knex("points")
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", parsedItems)
            .where("city", String(city))
            .where("uf", String(uf))
            .distinct()
            .select("points.*")
        
            const serializedPoints = points.map(point => ({
                ...point,
                image_url: `http://192.168.25.29:3000/uploads/${point.image}`
            }));

        return response.json(serializedPoints);

    }
    async show(request: Request, response: Response){
        const { id } = request.params;

        const point = await knex("points").where("id", id).first();
        
        if (!point) {
            return response.status(400).json({ message: 'Point not found' });
        }

        const items = await knex("items")
            .join("point_items", "items.id", "point_items.item_id")
            .where("point_items.point_id", id);
        const serializedPoint = {
            ...point,
            image_url: `http://192.168.25.29:3000/uploads/${point.image}`,
            items
        }

        return response.json(serializedPoint);
    }
    async create(request: Request, response: Response){
        const { items, ...point } = request.body;
    
        const trx = await knex.transaction();
    
        const [point_id] = await trx("points").insert({
            ...point,
            image: request.file.filename,
        });
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => ({
                item_id,
                point_id
            })
        );
    
        await trx("point_items").insert(pointItems);

        trx.commit();
    
        return response.json({
            id: point_id,
            image: request.file.filename,
            ...point
        });
    };
}