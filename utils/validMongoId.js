import createHttpError from "http-errors";
import { Schema, Types } from "mongoose";

export const validateMongoDbId = (id => {
    const isValid = Types.ObjectId.isValid(id)

    if (!isValid) throw createHttpError.NotFound(' This is not valid or not found')
})