import { CosmosClient } from "@azure/cosmos";
import { query } from "express";
import { v4 } from "uuid";
import Client from "../ENTITIES/client";
import NotFoundError from "../ERRORS/not-found-error";
import accessContract from "./access-contract";

//Azure container
const client = new CosmosClient(process.env.DB_password ?? process.env.AzureCosmosConnection )
const database = client.database('myFirstDB');
const container = database.container('myFirstContainer');

//prepare the class which will implement runtime access objects for azure 
export default class accessAzure implements accessContract{
    //1 
    async getClientsWithBalancesGreaterThan(amount: number): Promise<Client[]> {
      
        const query = container.items.query(`SELECT * FROM Clients Client WHERE Client.accounts[0].balance > 
            ${amount} OR Client.accounts[1].balance  > ${amount}`)
        const response = await query.fetchAll();
        return response.resources
    }
    //2
    async createClient(Client: Client): Promise<Client> {
        Client.id = v4();
        const response = await container.items.create(Client);
        return response.resource
    }
    //3
    async getAllClients(): Promise<Client[]> {
        const response = await container.items.readAll<Client>().fetchAll();
        return response.resources
        // const query = await container.items.query(
        //     `SELECT [C.fname, C.lname, C.id, C.accounts] AS CLIENT FROM Clients C `);
        
        // const response = await query.fetchAll()
    }
    //4
    async getClientById(chosenID: string): Promise<Client> {
        const response = await container.item(chosenID,chosenID).read<Client>()
        
        if(!response.resource){
            throw new NotFoundError("Resource could not be found", chosenID);
        }
        const {fname,lname,accounts,id} = response.resource   
        return {fname,lname,accounts,id}
    }
    //5    
    async updateClient(Client: Client): Promise<Client> {
        const response = await container.items.upsert<Client>(Client);
        return response.resource
    }
    //6
    async deleteClientById(id: string): Promise<Client> {
        const Client = await this.getClientById(id)
        const response = await container.item(id,id).delete();
        return Client;
    }
    //7
    async deleteAllClients(): Promise<null> {
        const Clients = await this.getAllClients()
        let clients: Client
    
        //for each client object in the client array
        for (clients of Clients){
            
            //delete the client
            await container.item(clients.id,clients.id).delete();    
        }
        return null
    }
}
