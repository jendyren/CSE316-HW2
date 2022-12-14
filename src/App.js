import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './common/jsTPS.js';

// OUR TRANSACTIONS
import MoveSong_Transaction from './transactions/MoveSong_Transaction.js';
import AddSong_Transaction from './transactions/AddSong_Transaction';
import RemoveSong_Transaction from './transactions/RemoveSong_Transaction';
import EditSong_Transaction from './transactions/EditSong_Transaction';

// THESE REACT COMPONENTS ARE MODALS
import DeleteListModal from './components/DeleteListModal.js';
import RemoveSongModal from './components/RemoveSongModal';
import EditSongModal from './components/EditSongModal';

// THESE REACT COMPONENTS ARE IN OUR UI
import Banner from './components/Banner.js';
import EditToolbar from './components/EditToolbar.js';
import PlaylistCards from './components/PlaylistCards.js';
import SidebarHeading from './components/SidebarHeading.js';
import SidebarList from './components/SidebarList.js';
import Statusbar from './components/Statusbar.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS IS OUR TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            modalOpen: false,
            songKeyPairMarkedForRemoval : null,
            listKeyPairMarkedForDeletion : null,
            currentList : null,
            sessionData : loadedSessionData
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }

    addNewSong = () => {
        if(this.state.currentList){
            let lastElementIndex = this.getPlaylistSize();
            let newSong = {
                title : "Untitled",
                artist : "Unknown",
                youTubeId : "dQw4w9WgXcQ"
            }
            this.state.currentList.songs.splice(lastElementIndex, 0, newSong);
            this.setStateWithUpdatedList(this.state.currentList);
        }

    }

    removeLastSong = () => {
        if(this.state.currentList){
            let lastElementIndex = this.getPlaylistSize();
            console.log(lastElementIndex);
            this.state.currentList.songs.splice(lastElementIndex-1, 1);
            this.setStateWithUpdatedList(this.state.currentList);
        }
    }

    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            songs: []
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST.
    deleteList = (key) => {
        // IF IT IS THE CURRENT LIST, CHANGE THAT
        let newCurrentList = null;
        if (this.state.currentList) {
            if (this.state.currentList.key !== key) {
                // THIS JUST MEANS IT'S NOT THE CURRENT LIST BEING
                // DELETED SO WE'LL KEEP THE CURRENT LIST AS IT IS
                newCurrentList = this.state.currentList;
            }
        }

        let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
            return (keyNamePair.key === key);
        });
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        if (keyIndex >= 0)
            newKeyNamePairs.splice(keyIndex, 1);

        // AND FROM OUR APP STATE
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            currentList: newCurrentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // DELETING THE LIST FROM PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationDeleteList(key);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    deleteMarkedList = () => {
        this.deleteList(this.state.listKeyPairMarkedForDeletion.key);
        this.hideDeleteListModal();

    }

    removeSong = (keyPair) => {     
        console.log("4: removeSong...");   
        let list = this.state.currentList;
        list.songs.splice(keyPair.key, 1);

        this.hideRemoveSongModal();
        this.setStateWithUpdatedList(list);
    }

    removeMarkedSong = (songKeyPair) => {
        console.log("3: removeMarkedSong...");
        console.log("keyPair in removeSongSong");
        console.log(songKeyPair);
        this.removeSong(songKeyPair);
    }

    addPreviousSong = (keyPair) => {
        if(this.state.currentList){
            let list = this.state.currentList;
            list.songs.splice(keyPair.key, 0, keyPair.song);
            this.setStateWithUpdatedList(list);
        }
    }

    addMarkedSong = (songKeyPair) => {
        console.log("keyPair in addMarkedSong");
        console.log(songKeyPair);
        this.addPreviousSong(songKeyPair);
        
    }

    editSong = (oldSongKeyPair, newSongKeyPair) => {
        let list = this.state.currentList;

        let editedSongName = newSongKeyPair.song.title;
        let editedSongArtist = newSongKeyPair.song.artist;
        let editedSongYoutubeId = newSongKeyPair.song.youTubeId;

        let editedSongDetails = {
            title : editedSongName,
            artist : editedSongArtist,
            youTubeId : editedSongYoutubeId
        }

        console.log("******");
        console.log(editedSongDetails);
        console.log("******");

        list.songs.splice(oldSongKeyPair.key, 1, editedSongDetails);
        console.log("List after splicing edit song: ");
        console.log(list);

        this.hideEditSongModal();
        this.setStateWithUpdatedList(list);        
    }

    editMarkedSong = (oldSongKeyPair, newSongKeyPair) => {
        this.editSong(oldSongKeyPair, newSongKeyPair);
        // this.hideEditSongModal();
    }

    // THIS FUNCTION SPECIFICALLY DELETES THE CURRENT LIST
    deleteCurrentList = () => {
        if (this.state.currentList) {
            this.deleteList(this.state.currentList.key);
        }
    }

    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newCurrentList,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: null,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
        });
    }
    setStateWithUpdatedList(list) {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList : list,
            sessionData : this.state.sessionData
        }), () => {
            // UPDATING THE LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationUpdateList(this.state.currentList);
        });
    }
    getPlaylistSize = () => {
        return this.state.currentList.songs.length;
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    moveSong(start, end) {
        let list = this.state.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        this.setStateWithUpdatedList(list);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(this, start, end);
        this.tps.addTransaction(transaction);
    }

    // THIS FUNCTION ADDS A AddSong_Transaction TO THE TRANSACTION STACK
    addAddSongTransaction = () => {
        let transaction = new AddSong_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    addRemoveSongTransaction = (songKeyPair) => {
        let transaction = new RemoveSong_Transaction(this, songKeyPair);
        this.tps.addTransaction(transaction);
    }

    // THIS FUNCTION ADDS A EditSong_Transaction TO THE TRANSACTION STACK
    addEditSongTransaction = (songKeyPair, newSongKeyPair) => {
        let transaction = new EditSong_Transaction(this, songKeyPair, newSongKeyPair);
        this.tps.addTransaction(transaction);
    }

    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING AN UNDO
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    markListForDeletion = (keyPair) => {
        this.setState(prevState => ({
            modalOpen: true,
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion : keyPair,
            sessionData: prevState.sessionData
        }), () => {
            // PROMPT THE USER
            this.showDeleteListModal();
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal = () => {
        this.setState(prevState => ({
            modalOpen: false
        }));
        console.log(this.state.modalOpen)
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    markSongForRemoval = (keyPair) => {
        this.setState(prevState => ({
            modalOpen: true,
            currentList: prevState.currentList,
            songKeyPairMarkedForRemoval : keyPair,
        }), () => {
            // PROMPT THE USER
            console.log("2: Opening remove Song Modal...")
            this.showRemoveSongModal();
        });
    }
    
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO REMOVE THE SONG
    showRemoveSongModal() {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.add("is-visible");
        console.log(this)
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideRemoveSongModal = () => {
        this.setState(prevState => ({
            modalOpen: false
        }), () => {
            let modal = document.getElementById("remove-song-modal");
            modal.classList.remove("is-visible");
        });
        // console.log(this)
        // this.setState(prevState => ({
        //     modalOpen: false
        // }));
    }

    markSongForEdit = (keyPair) => {
        this.setState(prevState => ({
            modalOpen: true,
            currentList: prevState.currentList,
            songKeyPairMarkedForRemoval : keyPair,
        }), () => {
            // PROMPT THE USER
            this.showEditSongModal();
        });
    }

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO EDIT THE SONG
    showEditSongModal() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideEditSongModal = () =>{
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");

        // console.log(this)
        this.setState(prevState => ({
            modalOpen: false
        }));
        // console.log(this.state.modalOpen)
    }

    handleKeyDown = event => {
        if (event.ctrlKey && event.key === 'z') {
            this.undo();
        }
        if (event.ctrlKey && event.key === 'y') {
            this.redo();
        }
    };

    render() {
        let canAddList = this.state.currentList === null; 
        let canAddSong = this.state.currentList !== null; //if true, current list is open and song can be added
        let canUndo = this.tps.hasTransactionToUndo();
        let canRedo = this.tps.hasTransactionToRedo();
        let canClose = this.state.currentList !== null;
        console.log("modalOpen:" + this.state.modalOpen)

        return (
            <div id="root-inner" tabIndex={-1} onKeyDown={this.handleKeyDown}>
                <Banner />
                <SidebarHeading
                    createNewListCallback={this.createNewList}
                    canAddList={canAddList}
                    modalOpen={this.state.modalOpen}
                />
                <SidebarList
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    deleteListCallback={this.markListForDeletion}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <EditToolbar
                    modalOpen={this.state.modalOpen}
                    canAddSong={canAddSong}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    canClose={canClose} 
                    addSongCallback={this.addAddSongTransaction}
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    closeCallback={this.closeCurrentList}
                />
                <PlaylistCards
                    currentList={this.state.currentList}
                    moveSongCallback={this.addMoveSongTransaction} 
                    removeSongCallback={this.markSongForRemoval}
                    editSongCallback={this.markSongForEdit}/>
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteListModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallback={this.deleteMarkedList}
                />
                <RemoveSongModal
                    songKeyPair={this.state.songKeyPairMarkedForRemoval}
                    removeSongCallback={this.addRemoveSongTransaction}
                    hideRemoveSongModalCallback={this.hideRemoveSongModal}
                />
                <EditSongModal
                    songKeyPair={this.state.songKeyPairMarkedForRemoval}
                    editSongCallback={this.addEditSongTransaction}
                    hideEditSongModalCallback={this.hideEditSongModal}
                />
            </div>
        );
    }
}

export default App;
