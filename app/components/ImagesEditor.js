import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import update from 'react/lib/update';

import ImagesDialog from './ImagesDialog';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';

import AddImage from 'material-ui/svg-icons/image/add-to-photos';
import Check from 'material-ui/svg-icons/navigation/check';
import GridTile from './ReorderableGridTile';
import GridList from './ReorderableGridList';

export default class ImagesEditor extends Component {
    state = {
        images: [],
        imagesDialogOpen: false,
        activeImage: {},
        activeImageIndex: void 0
    };

    handleMenuItem = (image, idx) => (e, item) => {
        switch (item.props.value) {
            case "description":
                this.setState({
                    ...this.state,
                    anchorEl: findDOMNode(this.refs[`tile_${idx}`]),
                    open: true,
                    activeImage: image,
                    activeImageIndex: idx
                });
                break;
            case "delete":
                this.setState({
                    ...this.state,
                    images: [
                        ...this.state.images.slice(0, idx),
                        ...this.state.images.slice(idx + 1),
                    ],
                }, this.saveChanges);

                break;
        }
    };

    saveChanges() {
        this.props.onBlockChange({
            type: "images",
            images: this.state.images
        })
    }

    handleDescriptionClose = () => {
        this.setState({
            ...this.state,
            open: false,
            images: [
                ...this.state.images.slice(0, this.state.activeImageIndex),
                this.state.activeImage,
                ...this.state.images.slice(this.state.activeImageIndex + 1),
            ],
            activeImage: {},
            activeImageIndex: void 0
        }, this.saveChanges)
    };

    handleDescriptionChange = (e, value) => {
        this.setState({
            ...this.state,
            activeImage: {
                ...this.state.activeImage,
                description: value
            }
        })
    };

    componentWillMount() {
        this.setState({
            ...this.state,
            images: this.props.images
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            ...this.state,
            images: newProps.images
        })
    }

    moveItem = ({dragIndex, hoverIndex}) => {
        const {images} = this.state;
        const dragCard = images[dragIndex];
        this.setState(update(this.state, {
            images: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard]
                ]
            }
        }));
    };

    handleAddMore = () => {
        this.setState({
            ...this.state,
            imagesDialogOpen: true
        })
    };

    onFileSelect = (files) => {
        var newImages = files.map(file => ({
            src: file.url,
            imageId: file._id,
            fileId: file.fileId,
            description: "",
            name: file.name
        }));

        this.setState({
            ...this.state,
            images: [
                ...this.state.images,
                ...newImages
            ],
            imagesDialogOpen: false
        }, this.saveChanges)
    };

    render() {
        var {images, imagesDialogOpen} = this.state;

        const imageMenu = (image, idx) => (
            <IconMenu
                onItemTouchTap={this.handleMenuItem(image, idx)}
                iconButtonElement={<IconButton><MoreVert color="white"/></IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem value="description" primaryText="Description"/>
                <MenuItem value="delete" primaryText="Delete"/>
            </IconMenu>
        );

        return (
            <div>
                <div>
                    <IconButton tooltip="Add more" onTouchTap={this.handleAddMore}>
                        <AddImage />
                    </IconButton>
                </div>
                <GridList
                    cols={6}
                    cellHeight={100}
                >
                    {images.map((image, idx) => (
                        <GridTile
                            ref={`tile_${idx}`}
                            key={image.src}
                            title={image.name}
                            moveItem={this.moveItem}
                            actionIcon={imageMenu(image, idx)}
                        >
                            <img src={image.src + "?h=200"} height="100"/>
                        </GridTile>

                    ))}
                </GridList>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    style={{
                        width: 450
                    }}
                    onRequestClose={this.handleDescriptionClose}
                >
                    <TextField
                        hintText="Підпис до зображення"
                        multiLine={true}
                        rowsMax={4}
                        onChange={this.handleDescriptionChange}
                        value={this.state.activeImage.description}
                        style={{
                            marginLeft: 10,
                            width: 390
                        }}
                    />
                    <IconButton
                        style={{
                            verticalAlign: "middle"
                        }}
                        onTouchTap={this.handleDescriptionClose}>
                        <Check/>
                    </IconButton>
                </Popover>

                {
                    imagesDialogOpen && (
                        <ImagesDialog
                            multi={true}
                            onSelect={this.onFileSelect}
                            onDialogClose={this.onFilesDialogClose}
                        />
                    )
                }

            </div>
        )
    }
}
