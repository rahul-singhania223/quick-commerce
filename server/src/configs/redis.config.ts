import { config } from "dotenv";
import {Redis} from "ioredis";

config();

const redisUrl = process.env.REDIS_URL!;

const redis = new Redis(redisUrl);

export default redis;
