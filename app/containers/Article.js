import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getArticleByUrl, saveArticle} from '../actions/articles';
import TextBlock from '../components/TextBlock';
import ImagesBlock from '../components/ImagesBlock';
import DittoBlock from '../components/DittoBlock';
import HeadCover from '../assets/images/head_logo_uk.png';
import AdminBar from '../components/AdminBar';
class App extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    state = {
        article: {},
        editable: false
    };

    componentWillUnmount() {
        this.context.router.unregisterTransitionHook(this.locationHasChanged)
    }

    componentDidMount() {
        this.locationHasChanged = (function (ev) {
            var url = (ev.pathname.charAt(0) !== "/" ? "/" : "") + ev.pathname;

            this.props.getArticleByUrl(url).then((articleId) => {
                this.setState({
                    ...this.state,
                    article: this.props.articlesList[articleId]
                });
            })
        }).bind(this);

        this.context.router.listen(this.locationHasChanged)
    }

    render() {
        var {article} = this.state;
        return (
            <div className="root-container">
                <Helmet
                    title={article.name}
                    titleTemplate="%s - ЛОДБ"
                />
                {this.state.editable && <AdminBar activePage={this.state.article}/>}
                <header>
                    <div>Header</div>
                </header>
                <div className="lb-main-container container-fluid">
                    <div className="lb-cover">
                        <img src={HeadCover}/>
                    </div>
                    <div className="row">
                        <div className="col-md-2">
                            <div className="box">
                                Left column
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="box">
                                {
                                    article.type === "news" && (
                                        <h1>{article.content.ua.title}</h1>
                                    )
                                }
                                {
                                    article.type === "news" && (<div>
                                        <div className="addthis_sharing_toolbox"></div>
                                    </div>)
                                }

                                {article.content && article.content.ua.main.map((block, idx) =>
                                    (<div
                                        key={idx}>
                                        {block.type === 'text' &&
                                        (<TextBlock
                                            content={block.content}
                                            editable={this.props.editable}
                                        />)}
                                        {block.type === 'images' &&
                                        (<ImagesBlock
                                            images={block.images}
                                        />)
                                        }
                                        {block.type === 'ditto' &&
                                        (<DittoBlock
                                            parent={block.parent}
                                            template={block.template}
                                        />)}
                                    </div>)
                                )}
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="box">
                                Right column
                            </div>
                        </div>
                    </div>
                </div>
                <footer>
                    <div>&copy;2008-2016 Львівська обласна бібліотека для дітей</div>
                </footer>
                {this.props.children}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        articlesList: state.articles.list,
        articlesIds: state.articles.ids,
        user: state.user.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getArticleByUrl
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);