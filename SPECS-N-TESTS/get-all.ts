import { CosmosClient } from "@azure/cosmos";
import Client from "../ENTITIES/client";
import { v4 } from "uuid";

// const client = new CosmosClient('AccountEndpoint=https://rpas-cosmosdb-account-ranieri.documents.azure.com:443/;AccountKey=WI6NMjGOafJE8GSebzHpDX8qjZzaVfFQ4lbBc2Ak2O4624TlNMLFVtepn5SeLpwEarm1G3GKU6xlCTzNwjGlVQ==;');
// const database = client.database('rpas-db');
// const container = database.container('Clients');

const client = new CosmosClient(process.env.AzureCosmosConnection);
const database = client.database('myFirstDB');
const container = database.container('myFirstContainer');

async function addClient(Client: Client){
    const response = await container.items.create(Client)
    const derp: string = '';
    //console.log(response);
}

const bill: Client = {fname:"Bill", lname:"Gates", accountNames: [{name: "Checking", balance: 100} , {name: "Checking", balance: 100}], id: v4()}

//addClient(bill);

async function getAllClients(){
    const response = await container.items.readAll<Client>().fetchAll(); //feedback response
    const resources = response.resources // Client array created from feedback response
    console.log(resources)
    return resources  
}

getAllClients()


