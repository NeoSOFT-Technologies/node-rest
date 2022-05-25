import { Request, Response, NextFunction } from 'express';
import SystemLogger from './system.logger';

export function logger(req: Request, res: Response, next: NextFunction) {
    const logger = new SystemLogger('HTTP');

    const startAt = Date.now();
    const { ip, method, path: url } = req;
    const userAgent = req.get("user-agent") || "";

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length") || 0;
      const message = `${method} ${url} ${statusCode} ${Date.now() - startAt}ms ${contentLength} - ${userAgent} ${ip}`;

      if (statusCode >= 400) {
        return logger.error(message);
      }
      return logger.log(message);
    });

    next();
};