import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { modalOpen, canAddSong, canUndo, canRedo, canClose, 
                addSongCallback, undoCallback, redoCallback, closeCallback} = this.props;
        
        let addSongClass = "toolbar-button";
        let undoClass = "toolbar-button";
        let redoClass = "toolbar-button";
        let closeClass = "toolbar-button";

        console.log(modalOpen);
        console.log(canAddSong);
        console.log(canUndo);
        console.log(canRedo);
        console.log(canClose);

        if (!canAddSong || modalOpen){
            addSongClass += " disabled";
        }
        else{
            addSongClass += "";
        } 

        if (!canUndo || modalOpen) undoClass += " disabled";
        if (!canRedo || modalOpen) redoClass += " disabled";

        if (!canClose || modalOpen){
            closeClass += " disabled";
        }else{
            closeClass += "";
        }

        return (
            <div id="edit-toolbar">
            <input 
                type="button" 
                id='add-song-button' 
                value="+" 
                className={addSongClass}
                onClick={addSongCallback}
            />
            <input 
                type="button" 
                id='undo-button' 
                value="⟲" 
                className={undoClass} 
                onClick={undoCallback}
            />
            <input 
                type="button" 
                id='redo-button' 
                value="⟳" 
                className={redoClass} 
                onClick={redoCallback}
            />
            <input 
                type="button" 
                id='close-button' 
                value="&#x2715;" 
                className={closeClass} 
                onClick={closeCallback}
            />
        </div>
        )
    }
}