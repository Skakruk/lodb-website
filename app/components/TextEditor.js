import React, {Component, PropTypes} from 'react';
import ImagesDialog from './ImagesDialog';
import 'tinymce/tinymce';
import 'tinymce/themes/modern/theme'
// Plugins
import 'tinymce/plugins/paste/plugin'
import 'tinymce/plugins/imagetools/plugin'
import 'tinymce/plugins/link/plugin'
import 'tinymce/plugins/image/plugin'
import 'tinymce/plugins/code/plugin'
import 'tinymce/plugins/autoresize/plugin'
import 'tinymce/plugins/table/plugin'
import TinyMCE from 'react-tinymce';


class TinyMCEEditor extends Component {
    state = {
        content: ""
    };

    componentWillMount() {
        this.setState({
            content: this.props.content
        });
    }

    componentWillReceiveProps(newProps) {
        var prevContent = this.state.content;
        this.setState({
            content: newProps.content
        }, () => {
            if (newProps.content !== prevContent) {
                this.forceUpdate();
            }
        });
    };

    shouldComponentUpdate() {
        return false;
    };

    saveChanges() {
        this.props.onBlockChange({
            type: 'text',
            content: this.state.content
        });
    };

    handleEditorChange = (e) => {
        if (e.target.getContent() !== this.state.content) {
            this.setState({
                content: e.target.getContent()
            }, this.saveChanges)
        }
    };

    render() {
        return (
            <TinyMCE
                content={this.state.content}
                config={{
                    content_style: ".mce-edit-focus {outline: none !important}",
                    inline: true,
                    plugins: 'paste link image code table imagetools',
                    skin: false,
                    toolbar: 'undo redo | bold italic | table | alignleft aligncenter alignright | code',
                    file_picker_callback: ::this.props.onOpenFileBrowser
                }}
                onChange={this.handleEditorChange}
            />
        )
    }
}


export default class TextEditor extends Component {
    state = {
        imagesDialogOpen: false,
        content: ""
    };

    onFileSelect = (files) => {
        this.state.tinyMCEcb(files[0].url);

        this.setState({
            imagesDialogOpen: false
        })
    };

    onOpenFileBrowser = (callback, value, meta) => {
        this.setState({
            imagesDialogOpen: true,
            tinyMCEcb: callback,
            meta
        });
    };

    onFilesDialogClose = () => {
        this.setState({
            imagesDialogOpen: false
        });
    };

    render() {
        var {imagesDialogOpen} = this.state;
        return (
            <div>
                <TinyMCEEditor
                    onBlockChange={this.props.onBlockChange}
                    content={this.props.content} onOpenFileBrowser={this.onOpenFileBrowser}/>
                { imagesDialogOpen && (
                    <ImagesDialog onSelect={this.onFileSelect}
                                  multiple={false}
                                  onDialogClose={this.onFilesDialogClose}
                    />)
                }
            </div>)
    }
}