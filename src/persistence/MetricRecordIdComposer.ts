
import { TimeHorizonV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';
import { TimeRangeComposer } from './TimeRangeComposer';
 
 export class  MetricRecordIdComposer {
        private static  composeTime(timeHorizon:TimeHorizonV1,
              year:number, month:number, day:number, hour:number, minute:number):string {
            var range = TimeRangeComposer.composeRange(timeHorizon, year, month, day, hour, minute);
            switch (timeHorizon)
            {
                case TimeHorizonV1.Total:
                    return "T";
                case TimeHorizonV1.Year:
                    return "Y";
                case TimeHorizonV1.Month:
                    return "M" + range;
                case TimeHorizonV1.Day:
                    return "D" + range;
                case TimeHorizonV1.Hour:
                    return "H" + range;
                case TimeHorizonV1.Minute:
                    return "Q" + range;
            }
            return "X";
        }

        public static composeId(name:string, timeHorizon:TimeHorizonV1,
            dimension1:string, dimension2:string, dimension3:string,
            year:number, month:number, day:number, hour:number, minute:number):string {
            return name
                + "_" + this.composeTime(timeHorizon, year, month, day, hour, minute)
                + "_" + dimension1
                + "_" + dimension2
                + "_" + dimension3;
        }

        public static composeIdFromUpdate(timeHorizon:TimeHorizonV1, update:MetricUpdateV1):string
        {
            return this.composeId(update.name, timeHorizon,
                 update.dimension1, update.dimension2, update.dimension3,
                             update.year, update.month, update.day, update.hour, update.minute);
        }

    }

