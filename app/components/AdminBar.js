import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ImagesDialog from './ImagesDialog';
import PageSettingsDialog from './PageSettingsDialog';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AddIcon from 'material-ui/svg-icons/content/add'
import Settings from 'material-ui/svg-icons/action/settings'
import Reorder from 'material-ui/svg-icons/action/reorder'

export default class AdminBar extends Component {
    state = {
        imagesDialogOpen: false,
        pageSettingsDialogOpen: false,
        siteStructureDialogOpen: false,
        pageObject: {},
        parentPage: {}
    };
    openImages = () => {
        this.setState({
            ...this.state,
            imagesDialogOpen: true
        })
    };

    onFilesDialogClose = () => {
        this.setState({
            ...this.state,
            imagesDialogOpen: false
        });
    };

    handleCreateNew = (e, item) => {
        this.setState({
            ...this.state,
            pageSettingsDialogOpen: true,
            parentPage: this.props.activePage,
            pageObject: {
                type: item.props.value,
                publishedOn: new Date(),
                published: true,
                content: {},
                showInRSS: true,
                showInSiteTree: true,
                showShareButtons: item.props === 'news'
            }
        });

    };

    handleExistingPageSettings = () => {
        this.setState({
            ...this.state,
            pageSettingsDialogOpen: true,
            pageObject: this.props.activePage
        });
    };

    handlePageSettingsDialogClose = () => {
        this.setState({
            ...this.state,
            pageSettingsDialogOpen: false,
            pageObject: {}
        });
    };

    handleSiteStructure = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            siteStructureDialogOpen: true,
            siteStructureAnchor: e.currentTarget,
        });
    };
    handleSiteStructureDialogClose = () => {
        this.setState({
            ...this.state,
            siteStructureDialogOpen: false
        });
    };

    render() {
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup>
                        <IconMenu
                            iconButtonElement={<IconButton><AddIcon /></IconButton>}
                            onItemTouchTap={this.handleCreateNew}
                        >
                            <MenuItem value="page" primaryText="Page"/>
                            <MenuItem value="link" primaryText="Link"/>
                        </IconMenu>
                        <IconButton onTouchTap={this.handleExistingPageSettings}>
                            <Settings/>
                        </IconButton>
                        <ToolbarSeparator />
                        <IconButton onTouchTap={this.handleSiteStructure}>
                            <Reorder/>
                        </IconButton>
                        <FlatButton label="Images" onTouchTap={this.openImages}/>
                    </ToolbarGroup>
                </Toolbar>


                {
                    this.state.pageSettingsDialogOpen &&
                    <PageSettingsDialog
                        parent={this.state.parentPage}
                        page={this.state.pageObject}
                        onDialogClose={this.handlePageSettingsDialogClose}
                    />
                }

                {
                    this.state.imagesDialogOpen &&
                    <ImagesDialog
                        onSelect={this.state.onFileSelect}
                        onFilesDialogClose={this.onFilesDialogClose}
                    />
                }

            </div>
        )

    }
}