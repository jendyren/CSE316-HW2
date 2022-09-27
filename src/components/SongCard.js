import React from "react";

export default class SongCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
            draggedTo: false
        }
    }
    handleDragStart = (event) => {
        event.dataTransfer.setData("song", event.target.id);
        this.setState(prevState => ({
            isDragging: true,
            draggedTo: prevState.draggedTo
        }));
    }
    handleDragOver = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragEnter = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragLeave = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: false
        }));
    }
    handleDrop = (event) => {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        
        this.setState(prevState => ({
            isDragging: false,
            draggedTo: false
        }));

        // ASK THE MODEL TO MOVE THE DATA
        this.props.moveCallback(sourceId, targetId);
    }

    getItemNum = () => {
        return this.props.id.substring("playlist-song-".length);
    }

    handleRemoveSong = (event) => {
        console.log("1: handleRemoveSong...")
        event.stopPropagation();
        let songKeyPair = {
            key: this.getItemNum()-1, 
            song: this.props.song};
        console.log("****")
        console.log(songKeyPair);
        //key:
        //song{
            //title
            //artist
            //youtube
        //}
        console.log("****")
        this.props.removeSongCallback(songKeyPair);
    }

    handleEditSong = (event) =>{
        if (event.detail === 2) {
            event.stopPropagation();
            let songKeyPair = {
                key: this.getItemNum()-1, 
                song: this.props.song};
            console.log("inside handleEditSong: ");
            console.log(songKeyPair);
            console.log('double click');
            this.props.editSongCallback(songKeyPair);
        }
    }

    render() {
        const { song } = this.props;

        //console.log(this.props.song)
        let num = this.getItemNum();
        let itemClass = "playlister-song";
        if (this.state.draggedTo) {
            itemClass = "playlister-song-dragged-to";
        }
        return (
            <div
                id={'song-' + num}
                className={itemClass}
                onDragStart={this.handleDragStart}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                draggable="true"
                onClick={this.handleEditSong}
            >
                
                {num}.
            <a href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}  
            </a>
                                  
            <input
                type="button"
                id={"delete-song-" + num}
                className={"delete-song-button"}
                onClick={this.handleRemoveSong}
                value={"✕"} />
            </div>
        )
    }
}