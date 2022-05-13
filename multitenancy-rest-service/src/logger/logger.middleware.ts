import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger('HTTP');

    const startAt = Date.now();
    const { ip, method, path: url } = req;
    const userAgent = req.get("user-agent") || "";

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");

      logger.log(
        `${method} ${url} ${statusCode} ${Date.now() - startAt}ms ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
};