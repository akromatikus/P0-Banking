// DAO 
// Data Access Object, an object/class that is responsible for saving an object somewhere
// DAO should support the basic CRUD operations Create Read Update Delete

import Client from "../ENTITIES/client";
import {v4} from 'uuid';
import NotFoundError from "../ERRORS/not-found-error";

export default interface accessContract{

    //CREATE
    createClient(Client: Client): Promise<Client>;

    //READ
    getAllClients(): Promise<Client[]>;
    getClientById(id: string): Promise<Client>;
    getClientsWithBalancesGreaterThan(balance: number): Promise<Client[]>;
    
    //UPDATE
    updateClient(Client: Client): Promise<Client>;

    //DELETE
    deleteClientById(id: string): Promise<Client>;
}

