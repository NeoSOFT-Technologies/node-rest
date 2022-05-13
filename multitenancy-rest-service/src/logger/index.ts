import { INestApplication } from "@nestjs/common";
import { logger } from "./logger.middleware";

export function setupLogger(app: INestApplication) {
    app.use(logger);
};
