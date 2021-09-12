import { StatePrice } from "../../domain/statePrice";
import { StatePriceMap } from "../mappers/statePriceMap";
import { Repository } from "./abstract/repository";


export class StatePriceRepository extends Repository<StatePrice, [`productId`, `stateId`, `segmentId`]> {
    constructor() {
        const statePriceMap: StatePriceMap = new StatePriceMap();
        super(statePriceMap);
    };
};
