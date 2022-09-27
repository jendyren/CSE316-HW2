import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, index) {
        super();
        this.app = initApp;
        this.index = index;
    }

    doTransaction() {
        console.log("Inside doTransaction: ");
        console.log(this.index);
        this.app.addNewSong(this.index);
    }
    
    undoTransaction() {
        this.app.removeLastSong(this.index);
    }
}