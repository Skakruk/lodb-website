import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';
import TextParser from './TextParser';
import styles from './TextBlock.css';
import TextEditor from './TextEditor';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import parentStyles from './ParentBlock.css';

export  default class TextBlock extends Component {
    render() {
        var {
            editable,
            onBlockDelete,
            onBlockChange,
            content
        } = this.props;
        return (
            <div className={classNames(editable && styles.textBlockEdit, styles.textBlock)}>
                {editable ? (<TextEditor onBlockChange={onBlockChange} content={content}/>) :
                    <div>
                        {content && TextParser(content)}
                    </div>
                }
                {editable && (
                    <div className={parentStyles["block-actions"]}>
                        <IconButton tooltip="Delete" onTouchTap={onBlockDelete}>
                            <Delete />
                        </IconButton>
                    </div>
                )}
            </div>
        )

    }
}