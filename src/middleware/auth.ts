import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";

export const verifyToken = async (token: string) => {
    

  if (!token || token === undefined)  {
    return false;
  }

  try {
    let decoded = await jwt.verify(token, process.env.SECRET || '');
    return true;
  } catch (err) {
    return false;
  }
}