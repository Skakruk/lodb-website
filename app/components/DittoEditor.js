import React, {Component, PropTypes} from 'react';
import {getArticlesTree} from '../actions/articles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {templates} from './DittoBlock';
import styles from './DittoBlock.css';

class DittoEditor extends Component {
    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    };

    state = {
        template: "",
        articlesList: []
    };

    async componentWillMount() {
        var structure = await this.props.getArticlesTree({
            type: "page"
        });
        var articlesList = [];
        this.recursiveTree(structure, 0, articlesList);
        this.setState({
            ...this.state,
            parent: this.props.parent,
            template: this.props.template,
            articlesList
        })
    };

    saveChanges = () => {
        this.props.onBlockChange({
            type: "ditto",
            template: this.state.template,
            parent: this.state.parent,
        })
    };

    handleChange = (e, ind, value) => {
        this.setState({
            ...this.state,
            template: value
        }, this.saveChanges);
    };

    handleChangeParent = (e, idx, value) => {
        this.setState({
            ...this.state,
            parent: value
        }, this.saveChanges);
    };

    recursiveTree(entry, level = 0, list) {
        list.push(<MenuItem
            key={entry._id}
            value={entry._id}
            primaryText={`${'—'.repeat(level)} ${entry.name}`}
        />);

        if (entry.children && entry.children.length > 0) {
            list.concat(entry.children.map(e => this.recursiveTree(e, level + 1, list)));
        }
    };

    render() {
        var {template, articlesList, parent} = this.state;
        return (
            <div className={styles.editorHeader}>
                <div className="row">
                    <div className="col-md-6">
                        <SelectField
                            floatingLabelText="Шаблон"
                            fullWidth={true}
                            value={template}
                            onChange={this.handleChange}
                        >
                            {
                                Object.keys(templates).map(key => (
                                    <MenuItem
                                        key={key}
                                        value={key}
                                        primaryText={templates[key].name}/>
                                ))
                            }
                        </SelectField>
                    </div>
                    <div className="col-md-6">
                        <SelectField
                            floatingLabelText="Батьківський ресурс"
                            fullWidth={true}
                            value={parent}
                            onChange={this.handleChangeParent}
                        >
                            {articlesList}
                        </SelectField>
                    </div>
                </div>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getArticlesTree
    }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(DittoEditor);
