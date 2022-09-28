import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * RemoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, songKeyPair) {
        super();
        this.app = initApp;
        this.songKeyPair = songKeyPair;
        //this.undoSongsArray = (this.app.getUndoSongsArray() === undefined) ? [] : this.app.getUndoSongsArray();
    }

    doTransaction() {
        // console.log("--- start doTransaction ---");
        this.app.removeMarkedSong(this.songKeyPair);
        // console.log("--- end doTransaction ---");
    }
    
    undoTransaction() {
        // console.log("--- start undoTransaction ---");
        this.app.addMarkedSong(this.songKeyPair);
        // console.log("--- end undoTransaction ---");
    }
}