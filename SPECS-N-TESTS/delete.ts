import { CosmosClient, FeedResponse } from "@azure/cosmos";
import Client from "../ENTITIES/client";
import { v4 } from "uuid";
import NotFoundError from "../ERRORS/not-found-error";

const client = new CosmosClient(process.env.AzureCosmosConnection);
const database = client.database('myFirstDB');
const container = database.container('myFirstContainer');

async function getAllClients(show: boolean){
    const response = await container.items.readAll<Client>().fetchAll(); //feedback response
    const resources = response.resources // Client array created from feedback response
    if (show){console.log(resources)}
    return resources  
}

async function deleteClientByName(name: string): Promise<Client[]> { //wait what, return does not match function type?
    const Clients = await getAllClients(false) //does this actually wait without an await? NOO IT DOES NOT! await removes the promise type part
    let clients: Client
    for (clients of Clients){
        //console.log(clients.fname)
        if (clients.fname === name){
            await container.item(clients.id,clients.id).delete();
        }
    }

    //const response = await container.item(id,id).delete();
    return Clients
}

async function deleteAllClients(): Promise<Client[]> { //wait what, return does not match function type?
    const Clients = await getAllClients(false) //does this actually wait without an await? NOO IT DOES NOT! await removes the promise type part
    let clients: Client

    //for each client object in the client array
    for (clients of Clients){
        
        //delete the client
        await container.item(clients.id,clients.id).delete();    
    }
    return Clients
}

//getAllClients()
// deleteClientByName("Freddie")
// deleteClientByName("Krees")
// deleteClientByName("Jimmy")

deleteAllClients()


