import React, {Component, PropTypes} from 'react';
import {saveArticle, getParentArticle} from '../actions/articles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {slugify as slug} from 'transliteration';

import {grey400, darkBlack, lightBlack, blue200} from 'material-ui/styles/colors';
import ImagesDialog from './ImagesDialog';
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

class PageSettingsDialog extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    state = {
        page: {},
        parent: {},
        imagesDialogOpen: false,
        lang: "ua",
        open: false
    };

    componentDidMount() {
        this.setState({
            ...this.state,
            open: true
        });
    }

    componentWillMount() {
        this.setState({
            ...this.state,
            page: this.props.page
        });

        if (!this.props.parent._id) {
            this.props.getParentArticle(this.props.page._id);
        }
    }

    componentWillReceiveProps(newProps) {
        var parentId = newProps.articlesIds.filter(id => newProps.articlesList[id].children.includes(this.state.page._id));
        this.setState({
            ...this.state,
            parent: newProps.articlesList[parentId]
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        }, () => {
            setTimeout(() => {
                this.props.onDialogClose();
            }, 500);
        });
    };

    handleFieldChange = (prop) => (e, value) => {
        return new Promise((resolve) => {
            this.setState({
                ...this.state,
                page: {
                    ...this.state.page,
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

    handleSave = async() => {
        var {parent, page} = this.state;
        var realUrl = ((parent.url ? parent.url : "") + "/" + page.url).replace(/\/\/+/g, "/");
        var parentId = parent ? {
            parent: parent._id
        } : {};
        await this.props.saveArticle({
            ...this.state.page,
            url: realUrl,
            ...parentId
        });
        this.context.router.push(realUrl);
        this.handleClose();
    };

    render() {
        var {parent, page, lang, open} = this.state;
        page.url = page.url.replace(parent.url + '/','');

        var fullUrl = ((parent.url ? parent.url : "") + (page.url ? `/${page.url}` : "")).replace(/\/\//g, "/");

        const actions = [
            <FlatButton
                label="Cancel"
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSave}
            />,
        ];

        return (<Dialog
            contentStyle={{
                minHeight: "80%",
            }}
            actions={actions}
            modal={false}
            autoScrollBodyContent={true}
            open={open}
            onRequestClose={this.handleClose}
        >

            <Tabs>
                <Tab label="General">
                    <TextField
                        fullWidth={true}
                        value={page.name}
                        onChange={this.handleNameFieldChange}
                        floatingLabelText="Назва"/><br/>

                    <TextField fullWidth={true}
                               value={page.url}
                               onChange={this.handleFieldChange("url")}
                               floatingLabelText="URL"
                               errorText={fullUrl}
                               errorStyle={{
                                   color: grey400
                               }}
                    /><br/>
                    <SelectField
                        fullWidth={true}
                        value={page.type}
                        onChange={this.handleSelectChange("type")}
                        floatingLabelText="Тип документу"
                    >
                        <MenuItem key={1} value="news" primaryText="Новина"/>
                        <MenuItem key={2} value="page" primaryText="Сторінка"/>
                        <MenuItem key={3} value="link" primaryText="Посилання"/>
                        <MenuItem key={4} value="announce" primaryText="Анонс"/>
                    </SelectField><br/>
                    <div className="row">
                        <DatePicker

                            className="col-md-8"
                            floatingLabelText="Дата публікації"
                            fullWidth={true}
                            autoOk={true}
                            onChange={this.handlePublishDateChange}
                            value={new Date(page.publishedOn)}
                            defaultDate={new Date()}
                            hintText="Дата публікації"/>
                        <Toggle
                            className="col-md-4"
                            style={{
                                marginTop: 26
                            }}
                            onToggle={this.handleToggle("published")}
                            toggled={page.published}
                            label="Опубліковано"
                        />
                    </div>
                    <Toggle
                        onToggle={this.handleToggle("showShareButtons")}
                        toggled={page.showShareButtons}
                        label="Відображати в кнопки поширення"
                    />
                    <Toggle
                        onToggle={this.handleToggle("showInRSS")}
                        toggled={page.showInRSS}
                        label="Відображати в RSS"
                    />
                    <Toggle
                        onToggle={this.handleToggle("showInSiteTree")}
                        toggled={page.showInSiteTree}
                        label="Відображати в дереві сайту"
                    />
                </Tab>
                <Tab label="Content">
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
                    {
                        ['link', 'news', 'announce'].includes(page.type) && (
                            <div>
                                <TextField
                                    value={page.content[lang] && page.content[lang].title}
                                    onChange={this.handleLangFieldChange("title")}
                                    fullWidth={true}
                                    floatingLabelText="Заголовок"/>
                                <br/>
                            </div>
                        )
                    }
                    {
                        ['link', 'news', 'announce'].includes(page.type) && (
                            <div>
                                <TextField
                                    multiLine={true}
                                    rows={2}
                                    value={page.content[lang] && page.content[lang].introText}
                                    onChange={this.handleLangFieldChange("introText")}
                                    fullWidth={true}
                                    floatingLabelText="Короткий опис"/>
                                <br/>
                            </div>
                        )
                    }

                    {
                        page.type !== 'page' && (
                            <div className="row">
                                <div className="col-md-10">
                                    {
                                        page.mainImage && (
                                            <img src={`http://localhost:3001/media/images/${page.mainImage}?w=200`}
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
                        page.type === 'link' && (<div>
                            <TextField
                                value={page.redirect}
                                onChange={this.handleFieldChange("redirect")}
                                fullWidth={true}
                                floatingLabelText="Посилання"/>
                            <br/>
                        </div>)
                    }
                    {JSON.stringify(page)}

                </Tab>
            </Tabs>
            {
                this.state.imagesDialogOpen &&
                <ImagesDialog
                    multiple={false}
                    onSelect={this.onFileSelect}
                    onDialogClose={this.onFilesDialogClose}
                />
            }

        </Dialog>);
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
        saveArticle,
        getParentArticle
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSettingsDialog);
