import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';

import TextBlock from '../components/TextBlock';
import ImagesBlock from '../components/ImagesBlock';
import DittoBlock from '../components/DittoBlock';
import IconButton from 'material-ui/IconButton';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton'
import styles from './ParentBlock.css';

export default class ParentBlock extends Component {
    static propTypes = {
        editable: PropTypes.bool,
        childBlocks: PropTypes.array.isRequired
    };

    state = {
        blocks: [],
        changedBlocks: []
    };

    addBlock = (event, value) => {
        var block = {};
        switch (value) {
            case 'text':
                block = {
                    type: 'text',
                    content: ''
                };
                break;
            case 'images':
                block = {
                    type: 'images',
                    images: []
                };
                break;
            case 'ditto':
                block = {
                    type: 'ditto',
                    parent: this.props.article._id,
                    template: "news"
                };
                break;
        }

        this.setState({
            ...this.state,
            changedBlocks: [
                ...this.state.changedBlocks,
                block
            ]
        })
    };

    componentWillReceiveProps(newProps) {
        if (newProps.article !== this.props.article) {
            this.setState({
                ...this.state,
                blocks: newProps.childBlocks,
                changedBlocks: newProps.childBlocks
            })
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            blocks: this.props.childBlocks,
            changedBlocks: this.props.childBlocks
        })
    }

    handleBlockChange = (idx) => (...args) => {
        this.setState({
            ...this.state,
            changedBlocks: [
                ...this.state.changedBlocks.slice(0, idx),
                ...args,
                ...this.state.changedBlocks.slice(idx + 1),
            ]
        })
    };

    handleBlockDelete = (idx) => () => {
        this.setState({
            ...this.state,
            changedBlocks: [
                ...this.state.changedBlocks.slice(0, idx),
                ...this.state.changedBlocks.slice(idx + 1),
            ],
            blocks: [
                ...this.state.blocks.slice(0, idx),
                ...this.state.blocks.slice(idx + 1),
            ]
        })
    };

    handleCancel = () => {
        this.setState({
            ...this.state,
            changedBlocks: [
                ...this.state.blocks
            ]
        })
    };

    handleSave = async() => {
        this.props.onArticleSave(this.state.changedBlocks);
    };

    render() {
        var {changedBlocks} = this.state;
        return (<div>

            {this.props.editable &&
                (<div style={{
                    textAlign: 'right'
                }}>
                    <FlatButton label="Cancel" onTouchTap={this.handleCancel}/>
                    <FlatButton label="Save" onTouchTap={this.handleSave} primary={true}/>
                </div>)
            }
            {changedBlocks && changedBlocks.map((block, idx) => {
                return (<div
                    key={idx}
                    className={styles["content-block-container"]}>
                    {block.type === 'text' &&
                    (<TextBlock
                        onBlockDelete={this.handleBlockDelete(idx)}
                        onBlockChange={this.handleBlockChange(idx)}
                        content={block.content}
                        editable={this.props.editable}
                    />)}
                    {block.type === 'images' &&
                    (<ImagesBlock
                        onBlockDelete={this.handleBlockDelete(idx)}
                        onBlockChange={this.handleBlockChange(idx)}
                        editable={this.props.editable}
                        images={block.images}
                    />)
                    }
                    {block.type === 'ditto' &&
                    (<DittoBlock
                        onBlockDelete={this.handleBlockDelete(idx)}
                        onBlockChange={this.handleBlockChange(idx)}
                        parent={block.parent}
                        editable={this.props.editable}
                        template={block.template}
                    />)}
                </div>);
            })}

            {this.props.editable && (<div className={styles["add-action"]}><IconMenu
                iconButtonElement={<IconButton><AddCircleOutline /></IconButton>}
                onChange={this.addBlock}
            >
                <MenuItem value="text" primaryText="Text"/>
                <MenuItem value="images" primaryText="Images"/>
                <MenuItem value="ditto" primaryText="Ditto"/>
            </IconMenu></div>)}
        </div>)
    }
}

