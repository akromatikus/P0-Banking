import { CosmosClient } from "@azure/cosmos";
import Client from "../entities/client";
import { v4 } from "uuid";
import NotFoundError from "../errors/not-found-error";

const client = new CosmosClient(process.env.AzureCosmosConnection);
const database = client.database('myFirstDB');
const container = database.container('myFirstContainer');

async function addClient(Client: Client){
    const response = await container.items.create(Client)
    const derp: string = '';
    //console.log(response);
}

const bill: Client = {fname:"Bill", lname:"Gates", accounts: [{name: "Checking", balance: 100} , {name: "Checking", balance: 100}], id: v4()}

//addClient(bill);

async function getAllClients(){
    const response = await container.items.readAll<Client>().fetchAll(); //feedback response
    const resources = response.resources // Client array created from feedback response
    console.log(resources)
    return resources  
}

async function getClientById(chosenID: string): Promise<Client> {
    const response = await container.item(chosenID,chosenID).read<Client>()
    
    // if the response.resource is undefined it means you did not fetch anythng
    if(!response.resource){
        throw new NotFoundError("Resource could not be found", chosenID);
    }
    // is there a shorter syntax to get an pbject with these specific properties
    const {fname,lname,accounts,id} = response.resource   
    return {fname,lname,accounts,id}
}


async function getByAmount(){
    const Client: Client = await getClientById('972ebfa6-0f40-4cab-8a77-2cf84d7300af')
    //console.log(Client.accounts)
    let matchingAccounts = Client.accounts.filter(iterate => { if(iterate.balance < 2000 && iterate.balance > 4000) {return true} else{return false} })
    console.log(matchingAccounts.length)
    return matchingAccounts  
}

getByAmount()