"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let Mixed = mongoose_1.Schema.Types.Mixed;
exports.MetricsMongoDbSchema = function (collection) {
    collection = collection || 'metrics';
    let schema = new mongoose_1.Schema({
        _id: { type: String },
        name: { type: String, required: true },
        timeHorizon: { type: Number, required: true },
        range: { type: Number, required: true },
        dimension1: { type: String, required: true },
        dimension2: { type: String, required: true },
        dimension3: { type: String, required: true },
        val: { type: Mixed, required: true }
    }, {
        collection: collection,
        autoIndex: true
    });
    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });
    return schema;
};
//# sourceMappingURL=MetricsMongoDbSchema.js.map