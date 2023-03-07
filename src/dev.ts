// Local dev configuration
require("dotenv").config();
const PORT = Number(process.env.PORT ?? 3000);

import express from "express";
import { genToken } from "@sqrls/tokens";
import { handler } from ".";

type Handler = typeof handler;
type HandlerEvent = Parameters<Handler>[0];

const app = express();

const map = (o: any, fn: Function) => Object.entries(o).reduce((out, [k, v]) => {
    out[k] = fn(v);
    return out;
}, {} as any);
const flatten = (o: any) => map(o, (v: any) => Array.isArray(v) ? v.join(",") : v); 
const trim = (s: any) => ("" + s).trim();

app.all("*", (req, res) => {
    const now = new Date();
    const queryString = req.url.substring(req.path.length + 1); // remove "<path>?"

    const query = flatten(req.query ?? {});
    const headers = flatten(req.headers ?? {});

    const cookies = headers["cookie"]?.split(";").map(trim);
    delete headers["cookie"];

    const event: HandlerEvent = {
        version: "2.0",
        routeKey: "$default",
        rawPath: req.path,
        rawQueryString: queryString,
        cookies: cookies,
        headers: headers,
        queryStringParameters: query,
        requestContext: {
            accountId: "",
            apiId: "",
            domainName: req.hostname,
            domainPrefix: "",
            http: {
                method: req.method,
                path: req.path,
                protocol: req.protocol,
                sourceIp: req.ip,
                userAgent: headers["user-agent"] ?? ""
            },
            requestId: genToken(),
            routeKey: "$default",
            stage: "$default",
            time: now.toString(),
            timeEpoch: now.valueOf()
        },
        body: req.body,
        isBase64Encoded: false,
    };

    handler(event).then(resp => {
        // Ignore headers and cookies for now
        const body = resp.statusCode ? resp.body : JSON.stringify(resp);
        res.setHeader("content-type", "application/json")
        res.status(resp.statusCode ?? 200);
        res.send(body);
    });
});

app.listen(PORT, () => {
    console.log(`Dev server listening on port ${PORT}...`);
});
