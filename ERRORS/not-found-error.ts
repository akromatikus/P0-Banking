
export default class NotFoundError extends Error{

    resourceId: string

    constructor(message: string, resourceId: string){
        super(message) //super is used to access parent methods
        this.resourceId = resourceId
    }
}