import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import {getArticlesByParentIdAndType} from '../actions/articles';
import DittoEditor from './DittoEditor';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Edit from 'material-ui/svg-icons/image/edit';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import {Link} from 'react-router';
import TextParser from './TextParser';
import styles from './DittoBlock.css';
import parentStyles from './ParentBlock.css';

console.log(styles);
export const templates = {
    'news': {
        name: "Новини",
        render: (article, idx) => (
            <div styleName="ditto-entry-news" key={idx}>
                <h2 styleName="ditto-entry-news-title">
                    <Link styleName="ditto-entry-news-title-link" to={article.url}>{article.content.ua.title}</Link>
                </h2>
                <span styleName="ditto-entry-news-date">{article.updatedOn}</span>
                <div styleName="ditto-entry-news-intro">
                    {
                        article.mainImage && (<span data-fullimg={article.mainImage}>
                            <img styleName="ditto-entry-news-main-image"
                                 src={`http://localhost:3001/media/images/${article.mainImage}?w=200`}/>
                        </span>)
                    }
                    {
                        article.content.ua.introText && (<div styleName="ditto-entry-news-content">
                            {TextParser(article.content.ua.introText)}</div>)
                    }
                </div>
                {
                    ['news', 'link'].includes(article.type) && (<div styleName="ditto-entry-news-footer">
                            {article.type == 'news' && <Link to={article.url}>Читати далі</Link>}
                            {article.type == 'link' && <a href={article.url} target="_blank">Читати далі</a>}
                    </div>)
                }
            </div>
        )
    }
};

class DittoBlock extends Component {
    static propTypes = {
        parent: PropTypes.string.isRequired,
        template: PropTypes.string.isRequired
    };

    state = {
        showEditor: false
    };

    async componentWillReceiveProps(newProps) {
        if (newProps.parent !== this.props.parent) {
            this.loadArticles(newProps.parent);
        }
    }

    componentDidMount() {
        this.loadArticles(this.props.parent);
    };

    async loadArticles(parent) {
        this.props.getArticlesByParentIdAndType(parent, ["news", 'announce', 'link']);
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
            onBlockDelete,
            template,
            parent,
            articlesList,
            articlesParents
        } = this.props;

        var {showEditor} = this.state;
        var dittoArticles = [];

        if (articlesParents[parent] && articlesParents[parent].length) {
            dittoArticles = articlesParents[parent].map(id => articlesList[id]);
        }

        return (
            <div className={classNames(editable && styles.dittoBlockEdit, styles.dittoBlock)}>
                { showEditor ? (
                    <DittoEditor onBlockChange={onBlockChange} parent={parent} template={template}/>
                ) : ""}

                {dittoArticles.map(templates[template].render)}

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

function mapStateToProps(state) {
    return {
        articlesList: state.articles.list,
        articlesIds: state.articles.ids,
        articlesParents: state.articles.parents,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getArticlesByParentIdAndType
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(DittoBlock, styles));