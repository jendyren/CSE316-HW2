import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, songKeyPair, newSongKeyPair) {
        super();
        this.app = initApp;
        this.songKeyPair = songKeyPair;
        this.newSongKeyPair = newSongKeyPair;
    }

    doTransaction() {
        console.log("--- start editSong doTransaction ---");
        console.log("OLD: ");
        console.log(this.songKeyPair);
        console.log("NEW: ");
        console.log(this.newSongKeyPair);
        this.app.editMarkedSong(this.songKeyPair, this.newSongKeyPair);
        console.log("--- end doTransaction ---");
    }
    
    undoTransaction() {
        console.log("--- start editSong undoTransaction ---");
        this.app.editMarkedSong(this.newSongKeyPair, this.songKeyPair);
        console.log("--- end undoTransaction ---");
    }
}