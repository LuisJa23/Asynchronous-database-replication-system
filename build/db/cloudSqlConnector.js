"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWithConnector = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const cloud_sql_connector_1 = require("@google-cloud/cloud-sql-connector");
const getIpType = () => {
    return process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true'
        ? 'PRIVATE'
        : 'PUBLIC';
};
const connectWithConnector = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (config = {}) {
    const { INSTANCE_CONNECTION_NAME, DB_USER, DB_PASS, DB_NAME } = process.env;
    if (!INSTANCE_CONNECTION_NAME || !DB_USER || !DB_PASS || !DB_NAME) {
        throw new Error('Missing required environment variables');
    }
    const connector = new cloud_sql_connector_1.Connector();
    const clientOpts = yield connector.getOptions({
        instanceConnectionName: INSTANCE_CONNECTION_NAME,
        ipType: getIpType()
    });
    const dbConfig = Object.assign(Object.assign(Object.assign({}, clientOpts), { user: DB_USER, password: DB_PASS, database: DB_NAME }), config);
    return promise_1.default.createPool(dbConfig);
});
exports.connectWithConnector = connectWithConnector;
