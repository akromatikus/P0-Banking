import express from 'express';
import accessContract from './DB-ACCESS/access-contract';
import accessAzure from './DB-ACCESS/runtime-prep-Azure';
import Client from './ENTITIES/client';
import NotFoundError from './ERRORS/not-found-error';

const app = express();
app.use(express.json())

const runtimeAccess: accessContract = new accessAzure(); 

// Get a list of all clients
app.get("/clients", async (req, res) => {   
    const clientList: Client[] = await runtimeAccess.getAllClients();
    res.send(clientList.map( thisClient => {
        return (`${thisClient.fname } ${thisClient.lname}`)
    })).status(200)
});

// Get client by ID
app.get('/clients/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const Client: Client = await runtimeAccess.getClientById(id)
        res.send(`${Client.fname } ${Client.lname}`); return Client  
    } 
    catch{       
        res.status(404).send(`The Client with that ID does not exist` )        
    }
});

// Get client accounts by ID. If a balance query is specified, 
// only accounts matching queries will be displayed.
app.get('/clients/:id/accounts', async (req, res) => {
    
    // !for destructuring, the new variable names must match the property keys
    // Record any balance amount queries made
    const {amountLessThan, amountGreaterThan} = req.query
    
    //get client by ID
    const {id} = req.params;

    try{   
        const Client: Client = await runtimeAccess.getClientById(id)
        
        //if a balance amount query was requested
        if (Object.keys(req.query).length > 0){

            //filter the accounts to see if one matches the criteria
            let matchingAccounts = Client.accounts.filter(
                iterate => { 
                    if(iterate.balance < Number(amountLessThan) && 
                        iterate.balance > Number(amountGreaterThan)) 
                    
                    {return true} else{return false} 
                }
            )
            
            //if an account was found, return it.
            if (matchingAccounts.length > 0){res.send(matchingAccounts)}
            else{res.send(`No account could be found with balances in the desired range`)} 
        }

        // if no query was made return the accounts names
        else{
            res.send(Client.accounts)
        }
    }
    catch{res.status(404).send("The Client with that ID does not exist")}              
});

// Create a new client
app.post("/clients", async (req, res) => {
    
    //adds the JSON that will make the new names and account names
    const Client: Client = req.body;
    
    //saves the client to the cloud and assigns an ID
    const newClient: Client = await runtimeAccess.createClient(Client)
    
    res.status(201).send(`Created a new client: ${newClient.fname } ${newClient.lname}`);
});

// Create a new account for an ID
app.post("/clients/:id/accounts", async (req, res) => {
    
    //get client by ID
    const {id} = req.params
    const Client: Client = await runtimeAccess.getClientById(id)
    
    //!JSON in postman did NOT like strings, so an array with a single string was needed
    let newName: string = req.body[0]
    
    Client.accounts.push({name: newName, balance: 0})
    
    try{
        await runtimeAccess.updateClient(Client)
        res.status(201).send(Client);
    }
    catch{
        res.status(404).send("The Client with that ID does not exist")
    }
    
});

// Update a client by ID. 
// !Items not included in the body will be deleted if they existed previously. 
// !New body items will be added likewise. Other values will be changed as necessary.
app.put('/Clients/:id', async (req, res) => {
    
    //the JSON info that will be applied to the update
    const Client: Client = req.body;
    
    //!req params is an object array
    //assign the ID for the the JSON to apply to
    const {id} = req.params   
    Client.id = id

    try{
        await runtimeAccess.updateClient(Client)
        res.send(`The Client info was updated`);
    }
    catch{
        res.status(404).send('A client with that ID does not exist')    
    }
});

// Delete a client by ID
app.delete('/clients/:id', async (req, res) => {
    const {id} = req.params;

    try{
        const deletedClient: Client = await runtimeAccess.deleteClientById(id)
        res.status(205).send("Deleted the Client successfully")
    }
    catch{res.status(404).send('A client with that ID does not exist')}
});

// Deposit or withdraw money by ID and account name
app.patch('/Clients/:id/:accountName/:amount', async (req, res)  => {

    //get client by ID, as well as the account and whether they want to deposit or withdraw from it
    const {id, accountName, amount} = req.params;
    const Client: Client = await runtimeAccess.getClientById(id)

    try{
        //return an array of account names and find the index of the name matching the query
        const accountID: number = Client.accounts.map(iterate  => {
            return iterate.name
        }).indexOf(accountName)
        
        //get the balance of the account and increment it
        let thisBalance = Client.accounts[accountID].balance
        thisBalance += Number(amount)
        
        // update the client's account if funds are available
        if (thisBalance < 0){res.status(422).send("You can't just steal from us you ape")}
        else{Client.accounts[accountID].balance = thisBalance; 
            await runtimeAccess.updateClient(Client); 
            res.send("Client patch successful");
        }
    }
    catch{
        res.status(404).send(`The account ${accountName} does not exist`)   
    }   
})

app.listen(4000, () => console.log("Started Application"))