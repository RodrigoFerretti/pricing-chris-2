import { Client } from "../../domain/client";
import { ClientMap } from "../mappers/clientMap";
import { Repository } from "./abstract/repository";


export class ClientRepository extends Repository<Client, IStandardPK> {
    constructor() {
        const clientMap: ClientMap = new ClientMap();
        super(clientMap);
    };
};
