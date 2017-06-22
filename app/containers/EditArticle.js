import React, {Component} from 'react';
import {slugify as slug} from 'transliteration';

import {grey400, darkBlack, lightBlack, blue200} from 'material-ui/styles/colors';
import ImagesDialog from '../components/ImagesDialog';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import {Tabs, Tab} from 'material-ui/Tabs';
import {getArticle, saveArticle} from '../actions/articles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUser} from '../actions/users';
import ParentBlock from '../components/ParentBlock';

class Article extends Component {
    state = {
        article: null,
        parent: {},
        lang: 'ua'
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    componentWillMount() {
        this.props.getArticle(this.props.params.id);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.id !== this.props.params.id) {
            this.props.getArticle(newProps.params.id);
        }


        this.setState({
            ...this.state,
            article: newProps.articlesList[newProps.params.id]
        });

        console.log(newProps);
    }

    handleArticleSave = (blocks) => {
        this.setState({
            ...this.state,
            article: {
                ...this.state.article,
                content: {
                    ...this.state.article.content,
                    [this.state.lang]: {
                        ...this.state.article.content[this.state.lang],
                        main: blocks
                    }
                }
            }
        }, () => {
            this.props.saveArticle(this.state.article);
        })
    }


    handleFieldChange = (prop) => (e, value) => {
        return new Promise((resolve) => {
            this.setState({
                ...this.state,
                article: {
                    ...this.state.article,
                    [prop]: value
                }
            }, () => {
                resolve();
            });
        });
    };

    handleNameFieldChange = async(e, value) => {
        await this.handleFieldChange("name")(e, value);
        this.handleFieldChange("url")(e, slug(value));
    };

    handleLangFieldChange = (prop) => (e, value) => {
        this.setState({
            ...this.state,
            page: {
                ...this.state.page,
                content: {
                    ...this.state.page.content,
                    [this.state.lang]: {
                        ...(this.state.page.content[this.state.lang] || {}),
                        [prop]: value
                    }
                }
            }
        })
    };

    handleSelectChange = (prop) => (e, index, value) => {
        this.handleFieldChange(prop)(e, value);
    };

    handlePublishDateChange = (e, date) => {
        if (date > new Date) {
            this.handleFieldChange("published")(e, false);
        }
        this.handleFieldChange("publishedOn")(e, date);
    };

    handleToggle = (prop) => (e, isChecked) => {
        this.handleFieldChange(prop)(e, isChecked);
    };

    handleMainImage = () => {
        this.setState({
            ...this.state,
            imagesDialogOpen: true
        })
    };

    onFileSelect = async(files) => {
        await this.handleFieldChange("mainImage")(null, files[0]._id);
        this.onFilesDialogClose();
    };

    onFilesDialogClose = () => {
        this.setState({
            ...this.state,
            imagesDialogOpen: false
        })
    };

    handleLangChange = (e, idx, value) => {
        this.setState({
            ...this.state,
            lang: value
        })
    };

    render() {
        var {user} = this.props;
        var {parent, article, lang} = this.state;

        article.url = article.url.replace(parent.url + '/', '');

        var fullUrl = ((parent.url ? parent.url : "") + (article.url ? `/${article.url}` : "")).replace(/\/\//g, "/");

        return (<div className="row">
            <div className="col-md-11">
                <Tabs>
                    <Tab label="Загальне">
                        <TextField
                            fullWidth={true}
                            value={article.name}
                            onChange={this.handleNameFieldChange}
                            floatingLabelText="Назва"/><br/>
                        <TextField fullWidth={true}
                                   value={article.url}
                                   onChange={this.handleFieldChange("url")}
                                   floatingLabelText="URL"
                                   errorText={fullUrl}
                                   errorStyle={{
                                       color: grey400
                                   }}
                        /><br/>
                        <SelectField
                            fullWidth={true}
                            value={article.type}
                            onChange={this.handleSelectChange("type")}
                            floatingLabelText="Тип документу"
                        >
                            <MenuItem key={1} value="news" primaryText="Новина"/>
                            <MenuItem key={2} value="page" primaryText="Сторінка"/>
                            <MenuItem key={3} value="link" primaryText="Посилання"/>
                            <MenuItem key={4} value="announce" primaryText="Анонс"/>
                        </SelectField><br/>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <DatePicker
                                    floatingLabelText="Дата публікації"
                                    fullWidth={true}
                                    autoOk={true}
                                    onChange={this.handlePublishDateChange}
                                    defaultDate={new Date()}
                                    hintText="Дата публікації"/>
                                <Toggle
                                    onToggle={this.handleToggle("published")}
                                    toggled={article.published}
                                    label="Опубліковано"
                                />
                                <Toggle
                                    onToggle={this.handleToggle("showShareButtons")}
                                    toggled={article.showShareButtons}
                                    label="Відображати в кнопки поширення"
                                />
                                <Toggle
                                    onToggle={this.handleToggle("showInRSS")}
                                    toggled={article.showInRSS}
                                    label="Відображати в RSS"
                                />
                                <Toggle
                                    onToggle={this.handleToggle("showInSiteTree")}
                                    toggled={article.showInSiteTree}
                                    label="Відображати в дереві сайту"
                                />
                            </div>
                        </div>
                    </Tab>

                    <Tab label="Наповнення">
                        <div style={{
                            textAlign: "right"
                        }}>
                            <SelectField value={lang} onChange={this.handleLangChange}>
                                <MenuItem value="ua" primaryText="Укр"/>
                                <MenuItem value="pl" primaryText="Pol"/>
                                <MenuItem value="en" primaryText="Eng"/>
                                <MenuItem value="ru" primaryText="Рус"/>
                            </SelectField>
                        </div>
                        <TextField
                            value={article.content[lang] && article.content[lang].title}
                            onChange={this.handleLangFieldChange("title")}
                            fullWidth={true}
                            floatingLabelText="Заголовок"/>
                        <br/>
                        {
                            ['link', 'news', 'announce'].includes(article.type) && (
                                <div>
                                    <TextField
                                        multiLine={true}
                                        rows={2}
                                        value={article.content[lang] && article.content[lang].introText}
                                        onChange={this.handleLangFieldChange("introText")}
                                        fullWidth={true}
                                        floatingLabelText="Короткий опис"/>
                                    <br/>
                                </div>
                            )
                        }

                        {
                            article.type !== 'page' && (
                                <div className="row">
                                    <div className="col-md-10">
                                        {
                                            article.mainImage && (
                                                <img
                                                    src={`http://localhost:3001/media/images/${article.mainImage}?w=200`}
                                                    width="200"/>
                                            )
                                        }
                                    </div>
                                    <div className="col-md-2">
                                        <RaisedButton
                                            style={{
                                                marginTop: 26
                                            }}
                                            onTouchTap={this.handleMainImage}
                                            icon={<AddAPhoto />}/>
                                    </div>
                                </div>)
                        }

                        {
                            article.type === 'link' && (<div>
                                <TextField
                                    value={article.redirect}
                                    onChange={this.handleFieldChange("redirect")}
                                    fullWidth={true}
                                    floatingLabelText="Посилання"/>
                                <br/>
                            </div>)
                        }
                        {
                            ['news', 'page'].includes(article.type) && (
                                <ParentBlock
                                    editable={true}
                                    article={article}
                                    childBlocks={article.content[lang] ? article.content[lang].main : []}/>
                            )
                        }
                    </Tab>
                </Tabs>
            </div>
        </div>)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUser,
        saveArticle,
        getArticle
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user.user,
        articlesList: state.articles.list,
        articlesIds: state.articles.ids,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Article);