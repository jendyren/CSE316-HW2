import React from "react";

export default class SidebarHeading extends React.Component {
    handleClick = (event) => {
        const { createNewListCallback} = this.props;
        createNewListCallback();
    };
    render() {
        const {canAddList, modalOpen} = this.props;
        let addListClass = "toolbar-button";
        if(!canAddList || modalOpen){
            addListClass += " disabled"
        }else{
            addListClass = "toolbar-button"
        }
        console.log(addListClass)

        return (
            <div id="sidebar-heading">
                <input 
                    type="button" 
                    id="add-list-button" 
                    className={addListClass}
                    onClick={this.handleClick}
                    value="+" />
                Your Playlists
            </div>
        );
    }
}