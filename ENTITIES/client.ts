// an entity in programming is any object designed to be saved/persisted somewhere
// DON'T forget to EXPORT anything you want to use in another file
//the Client interface does NOT enforce attribute assignment. 
//In other words, a new client with no name can be created, 
//and their DB record will contain no name attributes. The exception are IDs.

export default interface Client{ //an interface is like a new "datatype"
    id: string 
    fname: string 
    lname: string 
    accounts: Array<{ name: string, balance: number }>
}