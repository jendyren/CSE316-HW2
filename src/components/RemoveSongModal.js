import React, { Component } from 'react';

export default class RemoveSongModal extends Component {
    handleRemoveSong = () => {
        console.log(this.props.songKeyPair);
        this.props.removeSongCallback(this.props.songKeyPair);
    }

    render() {
        const { songKeyPair, hideRemoveSongModalCallback } = this.props;
        let name = "";

        if(songKeyPair){
            name = songKeyPair.song.title;
        }
        
        return (
            <div 
                className="modal" 
                id="remove-song-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-remove-song-root'>
                        <div className="modal-north">
                            Remove Song
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                                Are you sure you wish to permanently remove {name} from the playlist?
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="remove-song-confirm-button" 
                                className="modal-button" 
                                onClick={this.handleRemoveSong}
                                value='Confirm' />
                            <input type="button" 
                                id="remove-song-cancel-button" 
                                className="modal-button" 
                                onClick={hideRemoveSongModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}