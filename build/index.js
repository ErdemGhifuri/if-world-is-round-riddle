"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
// =================================================================================================
//                                      SERVER CONFIGURATION
// =================================================================================================
// INITIATE THE SERVER
const app = (0, express_1.default)();
// SERVER ACCEPT JSON FORMAT
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "100mb" }));
app.use((0, cors_1.default)({
    origin: ["cloud.google.com"],
}));
// =================================================================================================
//                                        SERVER ROUTING
// =================================================================================================
// CONNECT THE ROUTING TO THE SERVER
app.use(routes_1.default);
// =================================================================================================
//                                      RUNNING THE SERVER
// =================================================================================================
app.listen(process.env.PORT || 2828, () => {
    console.log(`Server running on 'http://localhost:${process.env.PORT || 2828}' !`);
});
