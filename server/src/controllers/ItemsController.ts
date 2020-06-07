import knex from "./../database/connection";
import { Request, Response } from "express";

export class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex("items").select("*");
        const serializedItems = items.map(item => {
            return {
                ...item,
                image_url: `http://192.168.25.29:3000/uploads/${item.image}`
            }
        });
        return response.json(serializedItems);
    }
}