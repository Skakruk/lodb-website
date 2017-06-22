import React, {Component, PropTypes} from 'react';
import {getArticlesTree} from '../actions/articles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import ArrowDropRight from 'material-ui/svg-icons/navigation/subdirectory-arrow-right';
import Link from 'material-ui/svg-icons/content/link';
import Description from 'material-ui/svg-icons/action/description';
import {fade} from 'material-ui/utils/colorManipulator';

const styles = {
    listItem: {}
}

class SiteStructureDialog extends Component {
    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    };
    state = {
        selectedArticle: {},
        structure: {},
        open: false
    };

    async componentDidMount() {
        this.setState({
            ...this.state,
            open: true
        });
        await this.loadTree();
    };

    async loadTree() {
        var structure = await this.props.getArticlesTree();
        this.setState({
            ...this.state,
            structure
        });
    };

    selectArticle = (entry) => (e) => {
        if (e.target.nodeName === "DIV") {
            this.setState({
                ...this.state,
                selectedArticleId: entry._id
            });
            this.context.router.push(`/admin/article/${entry._id}`);
        }
    };

    recursiveTree(entry) {
        var childrenNodes = [];
        if (entry.children.length > 0) {
            childrenNodes = entry.children.map(nested => this.recursiveTree(nested));
        }
        return (<ListItem
            leftIcon={entry.type === 'link' ? <Link/> : <Description/>}
            key={entry._id}
            primaryText={entry.name}
            onTouchTap={this.selectArticle(entry)}
            nestedItems={childrenNodes}
        />);
    };

    render() {
        var {structure} = this.state;
        const textColor = this.context.muiTheme.baseTheme.palette.textColor;
        styles.listItem.backgroundColor = fade(textColor, 0.2);

        return (
            <List>
                {structure.children && this.recursiveTree(structure.children[0])}
            </List>
        )

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getArticlesTree
    }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(SiteStructureDialog);
