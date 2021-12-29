import accessContract from "../DB-ACCESS/access-contract"
import accessAzure from "../DB-ACCESS/runtime-prep-Azure";
import Client from "../ENTITIES/client";
import NotFoundError from "../ERRORS/not-found-error"; 

describe("Client DAO Tests", () => {

    //needed to prep the database for successive jest runs
    const accessContract: accessContract = new accessAzure()

    //used to create the 3 clients which will be used for all the jest tests
    let savedClient: Client = null

    //1 (first two clients created here)
    it("Should get a Client with a balance meeting the minimum amount", async () => {
        savedClient = {
            fname:"Tom", lname:"Jones", accounts: [{name: "checking" , balance: 500}], id:''
        }
        await accessContract.createClient(savedClient)
        savedClient = {
            fname:"Ron", lname:"Swanson", accounts: [{name: "checking" , balance: 200}], id:''
        }
        await accessContract.createClient(savedClient)
        
        const filteredClientList =  await accessContract.getClientsWithBalancesGreaterThan(400);
        
        //expect 1 client to match the query
        expect(filteredClientList).not.toBeFalsy();
        expect(filteredClientList.length).toBe(1);
    });
             
    //2 (3rd client created here)
    it("Should create an Client", async () => {
        const noob: Client = {
            fname:"Jimmy", lname:"JavaScript", accounts: [{name: "checking" , balance: 0}], id:''
        }
        savedClient =  await accessContract.createClient(noob);
        
        expect(savedClient.id).not.toBeFalsy();
    });

    //3
    it("Should get all Clients", async () => {
        const fullClientList = await accessContract.getAllClients()
        
        expect(fullClientList).not.toBeFalsy();
        expect(fullClientList.length).toBe(3)
    });

    //4
    it("Should get a Client by ID", async () => {
        const retrievedClient: Client = await accessContract.getClientById(savedClient.id);
        
        expect(retrievedClient.fname).toBe("Jimmy");
        expect(retrievedClient.lname).toBe("JavaScript");
    });

    //5
    it("Should update a Client", async () => {
        const updatedClient: Client = {
            fname:"James", lname:"Taylor", 
            accounts: [{name: "checking" , balance: 0}] , id: savedClient.id
        }
        await accessContract.updateClient(updatedClient);
        const retrievedClient: Client = await accessContract.getClientById(updatedClient.id);
        
        expect(retrievedClient.fname).toBe("James")
    })

    //6
    it("should delete a Client", async () => {
        await accessContract.deleteClientById(savedClient.id)

        expect(async () => {
            await accessContract.getClientById(savedClient.id)
        }).rejects.toThrowError(NotFoundError)     
    })

    accessContract.deleteAllClients()
})
