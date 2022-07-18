import { Request, Response } from "express";
import connection from "../database/connection";
import { TABLE_PRODUCTS } from "../database/tableNames";

export const deleteProduct = async (req: Request, res: Response) => {
    let errorCode = 400
    try {
        const id = req.params.id as string

        if(!id || id === ""){
            errorCode = 400
            throw new Error(`Id doesn't exist! Please, inform it!`)
        }

        if(typeof id !== "string"){
            errorCode = 400
            throw new Error(`ID must be a string!`)
        }

        const [findId] = await connection.raw(`
            SELECT * FROM ${TABLE_PRODUCTS}
            WHERE id = "${id}";
        `)

        if(!findId[0]){
            errorCode = 400
            throw new Error(`Product not found!`)
        }

        await connection.raw(`
            DELETE FROM ${TABLE_PRODUCTS}
            WHERE id = "${id}";
        `)
        return res.status(200).send({ message: "Product deleted!" })

    } catch (err) {
        res.status(errorCode).send({ message: err.message })
    }
}