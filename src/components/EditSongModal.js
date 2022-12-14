import React, { Component } from 'react';

export default class EditSongModal extends Component {
    handleEditSong = () =>{
        let songDetails = {
            title : document.getElementById("edit-song-title").value,
            artist : document.getElementById("edit-song-artist").value,
            youTubeId : document.getElementById("edit-song-youtubeId").value};

        let newSongKeyPair = {
            key : this.props.songKeyPair.key,
            song : songDetails
        }
        this.props.editSongCallback(this.props.songKeyPair, newSongKeyPair);
    }

    render() {
        const { songKeyPair, hideEditSongModalCallback } = this.props;

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
                                onClick={this.handleEditSong}
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