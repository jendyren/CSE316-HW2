import React, { Component } from 'react';

export default class EditSongModal extends Component {
    render() {
        const { songKeyPair, editSongCallback, hideEditSongModalCallback } = this.props;
        let name, artist, youTubeId = "";

        if(songKeyPair){
            document.getElementById("edit-song-title").value = songKeyPair.song.title;
            document.getElementById("edit-song-artist").value = songKeyPair.song.artist;
            document.getElementById("edit-song-youtubeId").value = songKeyPair.song.youTubeId;
        }
        
        return (
            <div 
                className="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-edit-song-root'>
                        <div className="modal-north">
                            Edit Song
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                                <p>Title: <input type="text" id="edit-song-title"></input></p>
                                <p>Artist: <input type="text" id="edit-song-artist"></input></p>
                                <p>YoutubeId: <input type="text" id="edit-song-youtubeId"></input></p>
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                className="modal-button" 
                                onClick={editSongCallback}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                className="modal-button" 
                                onClick={hideEditSongModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}