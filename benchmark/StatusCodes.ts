import { Reference } from './Reference';

export class StatusCodes {
    public static All:Reference[] = [

        <Reference>{ id: "7", name: "G2B System Error" },
        <Reference>{ id: "201", name: "MSO: Timed out" },
        <Reference>{ id: "202", name: "MSO: Invalid response" },
        <Reference>{ id: "203", name: "MSO: System error" },
        <Reference>{ id: "204", name: "MSO: Connection error" },
        <Reference>{ id: "220", name: "MSO: Affiliate traffic not allowed" }
        //<Reference> { id:"222", name:"MSO: Invalid address - suggestions provided" },
        //<Reference> { id:"224", name:"MSO: No services available" },
        //<Reference> { id:"225", name:"MSO: Requested services not available" },
        //<Reference> { id:"226", name:"MSO: Some requested services not available" },
        //<Reference> { id:"240", name:"MSO: Invalid TrackingID" },
        //<Reference> { id:"280", name:"MSO: MSO-Defined Code" },
        //<Reference> { id:"281", name:"MSO: MSO-Defined Code" },
        //<Reference> { id:"288", name:"MSO: MSO-Defined Code" },
        //<Reference> { id:"294", name:"MSO: MSO-Defined Code" }
    ]
}
