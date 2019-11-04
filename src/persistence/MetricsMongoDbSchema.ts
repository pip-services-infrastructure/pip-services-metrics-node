import { Schema } from 'mongoose';
let Mixed = Schema.Types.Mixed;

export let MetricsMongoDbSchema = function (collection?: string) {
    collection = collection || 'metrics';

    let schema = new Schema(
        {
            _id: { type: String },
            name: { type: String, required: true },
            timeHorizon: { type: Number, required: true },
            range: { type: Number, required: true },
            dimension1: { type: String, required: true },
            dimension2: { type: String, required: true },
            dimension3: { type: String, required: true },
            val: { type: Mixed, required: true }
        },
        {
            collection: collection,
            autoIndex: true
        }
    );

    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return schema;
}