import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class MetricUpdateV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty("name", TypeCode.String);
        this.withRequiredProperty("year", TypeCode.Integer);
        this.withRequiredProperty("month", TypeCode.Integer);
        this.withRequiredProperty("day", TypeCode.Integer);
        this.withRequiredProperty("hour", TypeCode.Integer);
        this.withOptionalProperty("minute", TypeCode.Integer);
        this.withOptionalProperty("dimension1", TypeCode.String);
        this.withOptionalProperty("dimension2", TypeCode.String);
        this.withOptionalProperty("dimension3", TypeCode.String);
        this.withRequiredProperty("value", TypeCode.Float);
    }
}

