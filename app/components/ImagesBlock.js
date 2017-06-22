import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';
import ImagesEditor from './ImagesEditor';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Edit from 'material-ui/svg-icons/image/edit';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import styles from './ImagesBlock.css';
import parentStyles from './ParentBlock.css';
import ImageGallery from 'react-image-gallery';

export  default class ImagesBlock extends Component {
    state = {
        showEditor: false,
        images: []
    };

    componentWillMount(){
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

    handleToggleEditor = () => {
        this.setState({
            ...this.state,
            showEditor: !this.state.showEditor
        })
    };

    render() {
        var {
            editable,
            onBlockChange,
            onBlockDelete
        } = this.props;

        var {images, showEditor} = this.state;

        return (
            <div className={classNames(this.props.editable && styles.imageBlockEdit, styles.imageBlock)}>
                {
                    showEditor ?
                        (<ImagesEditor
                            onBlockChange={onBlockChange}
                            images={images}/>) :
                        (images.length ? (
                                <ImageGallery
                                    ref={i => this._imageGallery = i}
                                    items={images.map((image, idx) => (
                                        {
                                            original: image.src + "?h=1000",
                                            thumbnail: image.src + "?wh=100x100",
                                            originalAlt: image.name,
                                            thumbnailAlt: image.name,
                                            description: image.description
                                        })
                                    )}
                                    showThumbnails={images.length > 1}
                                    showPlayButton={false}
                                    slideInterval={2000}/>
                            ) : ""
                        )

                }
                {editable && (
                    <div className={parentStyles["block-actions"]}>
                        {showEditor ? (
                            <IconButton tooltip="Normal view" onTouchTap={this.handleToggleEditor}>
                                <Dashboard />
                            </IconButton>
                        ) : (<IconButton tooltip="Edit" onTouchTap={this.handleToggleEditor}>
                            <Edit />
                        </IconButton>)
                        }
                        <IconButton tooltip="Delete block" onTouchTap={onBlockDelete}>
                            <Delete />
                        </IconButton>
                    </div>
                )}
            </div>
        )

    }
}