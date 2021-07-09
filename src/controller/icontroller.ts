import { NextFunction, Request, Response } from "express";

export type ControllerRequest = Request & { context: { [k: string]: string | number } }

export type ControllerFn = (req: ControllerRequest, res: Response, next: NextFunction) => Promise<void> | void

export enum ControllerFnType {
    all = "all",
    get = "get",
    post = "post",
    put = "put",
    delete = "delete"
}

export type IController = { [k: string]: Partial<{ [k in ControllerFnType]: ControllerFn }> }