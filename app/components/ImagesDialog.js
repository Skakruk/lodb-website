import React, {Component, PropTypes} from 'react';
import {getFolderTree, addDirectory, uploadFiles, deleteFile} from '../actions/images';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {fade} from 'material-ui/utils/colorManipulator';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import muiDialogs from 'material-ui-dialogs';
import {grey400, darkBlack, lightBlack, blue200} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: "100%",
        height: 450,
        overflowY: 'auto',
    },
    imageInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0
    },
    listItem: {},
    selectedFile: {
        border: `7px solid ${blue200}`
    }
};


const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
    >
        <MoreVertIcon color={grey400}/>
    </IconButton>
);


class ImagesDialog extends Component {
    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    };

    state = {
        sorting: 'updatedOn DESC',
        structure: {},
        imagesList: [],
        selectedFiles: [],
        open: false
    };

    async componentDidMount() {
        await this.loadTree();
        this.setState({
            ...this.state,
            open: true
        });
        this.selectDirectory(this.state.structure._id)();
    };

    async loadTree() {
        var structure = await this.props.getFolderTree();
        this.setState({
            ...this.state,
            structure
        });
    }

    findDirectoryById(structure, id) {

        if (structure._id == id) {
            return structure;
        } else if (structure.children && structure.children.length > 0) {
            return structure.children.find(c => this.findDirectoryById(c, id));
        }
    }

    sortFiles(filesList) {
        if (filesList.length) {
            let [sortField, order] = this.state.sorting.split(" ");
            filesList.sort((a, b) => {
                return a[sortField].localeCompare(b[sortField]);
            });

            if (order === "ASC") {
                filesList.reverse();
            }
        }

        return filesList;
    }

    selectDirectory = (id) => () => {
        var selectedDirectory = this.findDirectoryById(this.state.structure, id),
            imagesList = selectedDirectory.children.filter(nested => !['root', 'dir'].includes(nested.type));

        this.setState({
            ...this.state,
            selectedDirectoryId: id,
            imagesList: this.sortFiles(imagesList)
        });
    };

    addSubDirectory = async() => {
        const name = await muiDialogs.prompt('New folder name', '');
        await this.props.addDirectory({
            parent: this.state.selectedDirectoryId,
            name: name
        });
        this.loadTree();
    };

    recursiveTree(entry) {
        var childrenNodes = [];
        if (entry.children.length > 0) {
            childrenNodes = entry.children.filter(nested => ['root', 'dir'].includes(nested.type)).map(nested => this.recursiveTree(nested));
        }
        return (<ListItem
            key={entry._id}
            onTouchTap={this.selectDirectory(entry._id)}
            primaryText={entry.name}
            nestedItems={childrenNodes}
            style={this.state.selectedDirectoryId == entry._id ? styles.listItem : {}}
        />);
    };

    handleChangeSorting = (e, num, value) => {
        this.setState({
            ...this.state,
            sorting: value
        }, () => {
            this.sortFiles(this.state.imagesList)
        });
    };

    handleFiles = async(e) => {
        await this.props.uploadFiles({
            files: e.target.files,
            parent: this.state.selectedDirectoryId,
        });
        await this.loadTree();
        this.selectDirectory(this.state.selectedDirectoryId)();
    };

    removeImage = (tile) => async() => {
        await this.props.deleteFile(tile._id);
        await this.loadTree();
        this.selectDirectory(this.state.selectedDirectoryId)();
    };

    selectFile = (file) => () => {
        var selected = this.state.selectedFiles;
        if (selected.includes(file)) {
            this.setState({
                ...this.state,
                selectedFiles: [
                    ...selected.slice(0, selected.indexOf(file)),
                    ...selected.slice(selected.indexOf(file) + 1)
                ]
            })
        } else {
            this.setState({
                ...this.state,
                selectedFiles: [
                    ...selected,
                    file
                ]
            })
        }
    };

    onSelect = () => {
        this.props.onSelect(this.state.selectedFiles);
    };

    handleClose = () => {
        this.setState({
            open: false
        }, () => {
            setTimeout(() => {
                this.props.onDialogClose();
            }, 500);
        });
    };

    render() {
        var {structure, imagesList, open} = this.state;
        const textColor = this.context.muiTheme.baseTheme.palette.textColor;
        styles.listItem.backgroundColor = fade(textColor, 0.2);

        const rightIconMenu = (tile) => (
            <IconMenu iconButtonElement={iconButtonElement}>
                <MenuItem>Rename</MenuItem>
                <MenuItem onTouchTap={this.removeImage(tile)}>Delete</MenuItem>
            </IconMenu>
        );

        return (<Dialog
            contentStyle={{
                maxWidth: "none",
                minHeight: "80%",
                width: "90%"
            }}
            style={{
                zIndex: "66000"
            }}
            modal={false}
            open={open}
            onRequestClose={this.handleClose}
        >
            <div className="row">
                <div className="col-md-2">
                    <div className="box">
                        <List>
                            {structure.children && this.recursiveTree(structure)}
                        </List>
                    </div>
                </div>

                <div className="col-md-10">
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <DropDownMenu value={this.state.sorting} onChange={this.handleChangeSorting}>
                                <MenuItem value={'name ASC'} primaryText="A => Z"/>
                                <MenuItem value={'name DESC'} primaryText="Z => A"/>
                                <MenuItem value={'updatedOn DESC'} primaryText="Newer => Older"/>
                                <MenuItem value={'updatedOn ASC'} primaryText="Older => Newer"/>
                            </DropDownMenu>
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            <FlatButton onTouchTap={this.addSubDirectory} label="Add Subdirectory"/>
                            <RaisedButton label="Upload"
                                          containerElement="label">
                                <input type="file"
                                       multiple="multiple"
                                       accept="image/*"
                                       onChange={this.handleFiles}
                                       style={styles.imageInput}/>
                            </RaisedButton>
                            {
                                this.state.selectedFiles.length &&
                                this.props.onSelect &&
                                (<RaisedButton primary={true} label="Select" onTouchTap={this.onSelect}/>)
                            }
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={styles.root}>

                        {imagesList.length ? (<GridList
                            cellHeight={120}
                            cols={8}
                            style={styles.gridList}
                        >
                            {imagesList.map((file) => (
                                <GridTile
                                    key={file._id}
                                    title={file.name}
                                    actionIcon={rightIconMenu(file)}
                                    style={this.state.selectedFiles.includes(file) ? styles.selectedFile : {}}
                                >
                                    <img
                                        onTouchTap={this.selectFile(file)}
                                        src={`${file.url}?h=240`}/>
                                </GridTile>
                            ))}
                        </GridList>)
                            : (<div>
                            Пусто
                        </div>)
                        }

                    </div>
                </div>
            </div>

        </Dialog>)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getFolderTree,
        addDirectory,
        uploadFiles,
        deleteFile
    }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(ImagesDialog);
