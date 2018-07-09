<template>
    <div id="app" class="full">
        <div class="ui modal new folder">
            <div class="header">Add New Folder</div>
            <div class="content">
                <div class="ui input">
                    <input v-model="newFolderName" title=""/>
                </div>
            </div>
            <div class="actions">
                <div class="ui approve button" @click="saveNewFolder">Create</div>
            </div>
        </div>
        <div class="ui modal new file">
            <div class="header">Add New File</div>
            <div class="content">
                <div class="ui input">
                    <input v-model="newFileName" title=""/>
                </div>
            </div>
            <div class="actions">
                <div class="ui approve button" @click="saveNewFile">Create</div>
            </div>
        </div>
        <div class="ui grid full" v-if="!logined && !signUp">
            <div class="ui middle aligned center aligned grid masthead">
                <div class="column">
                    <h2 class="ui teal image header">
                        <div class="content">
                            Log-in to your account
                        </div>
                    </h2>
                    <div class="ui large form">
                        <div class="ui stacked segment">
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="user icon"></i>
                                    <input type="text" name="user_id" v-model="user_id" placeholder="username">
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="lock icon"></i>
                                    <input type="password" name="password" @keypress.enter="login" v-model="password"
                                           placeholder="Password"
                                    >
                                </div>
                            </div>
                            <div class="ui fluid large teal button" @click="login">Login</div>
                        </div>

                        <div class="ui error message"></div>

                    </div>
                    <div class="ui bottom attached warning message">
                        <i class="icon help"></i>
                        New to us? <a @click.prevent="signUp = true" style="cursor: pointer;">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui grid full" v-if="signUp">
            <div class="ui middle aligned center aligned grid masthead">
                <div class="column">
                    <h2 class="ui teal image header">
                        <div class="content">
                            Register
                        </div>
                    </h2>
                    <div class="ui large form">
                        <div class="ui stacked segment">
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="user icon"></i>
                                    <input type="text" name="user_id" v-model="user_id" placeholder="username">
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="envelope icon"></i>
                                    <input type="text" name="email" v-model="email" placeholder="E-mail">
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="lock icon"></i>
                                    <input type="password" name="password" v-model="password" @keypress.enter="register"
                                           placeholder="Password"
                                    >
                                </div>
                            </div>
                            <div class="ui fluid large teal button" @click="register">Register</div>
                        </div>

                        <div class="ui error message"></div>

                    </div>
                </div>
            </div>
        </div>
        <div class="ui grid full" v-if="logined">
            <div class="row">
                <div class="ui eight item secondary menu">
                    <a class="item" @click="saveCurrentFile">Save File</a>
                    <a :class="'item '+(showSideBar ? 'active':'')" @click="backToShowSideBar">Edit Mode</a>
                    <a :class="'item '+(historyShow ? 'active':'')" @click="showHistory">History</a>
                    <a class="item" @click="syncToServer">Sync to server</a>
                    <a class="item" @click="downloadFromServer">Download from server</a>
                </div>
            </div>
            <div class="row">
                <div class="two wide column full">
                    <div class="sidebar" v-if="showSideBar">
                        <div class="ui vertical menu full">
                            <div class="item">
                                <span>Length:{{content.length}}</span>
                            </div>
                            <div class="item">
                                <div class="ui icon buttons">
                                    <button class="ui mini icon button" @click="createNewFile"><i class="file icon"></i>
                                    </button>
                                    <button class="ui mini icon button" @click="createNewFolder"><i
                                            class="folder icon"></i>
                                    </button>
                                    <button class="ui mini icon button" @click="removeMode = !removeMode">
                                        <i class="trash icon"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="item" v-for="(val,idx) in folder">
                                <div class="header" @click="focusFolder(idx)">
                                    {{ removeMode ? "-":""}}
                                    {{val.name}}
                                    <i class="hand pointer icon" v-if="current_folder === idx"></i>
                                </div>
                                <div class="menu">
                                    <div v-for="(v,id) in val.file">
                                        <a v-show="modifyTitle !== v.fileId" @click.right="modifyTitle = v.fileId"
                                           :class="(current_file === v.fileId && current_folder === idx ? 'active':'')+' item'"
                                           @click.left="focusFile(idx,id)">
                                            {{ removeMode ? "-":""}}
                                            {{v.title}}
                                            <i class="hand pointer icon" v-if="current_file === v.fileId"></i>
                                        </a>
                                        <input v-if="modifyTitle === v.fileId" v-model="v.title"
                                               @blur="modifyTitle = -1">
                                    </div>
                                </div>
                            </div>
                            <!--<div class="item">
                                <div class="header">Introduction</div>
                                <div class="menu">

                                    <a class="item" href="/introduction/integrations.html">
                                        Integrations
                                    </a>

                                    <a class="item" href="/introduction/build-tools.html">
                                        Build Tools
                                    </a>

                                    <a class="item" href="/introduction/advanced-usage.html">
                                        Recipes
                                    </a>

                                    <a class="item" href="/introduction/glossary.html">
                                        Glossary
                                    </a>

                                </div>
                            </div>-->
                        </div>
                    </div>
                    <div class="sidebar" v-if="historyShow">
                        <div class="ui vertical menu full">
                            <div class="item">
                                <div class="ui left labeled icon buttons">
                                    <button class="ui mini icon button" @click="backToShowSideBar">
                                        <i class="left arrow icon"></i>
                                        返回列表
                                    </button>
                                </div>
                            </div>
                            <div class="item">
                                <div class="header">
                                    Current File History
                                </div>
                                <div class="menu">
                                    <div v-for="row in currentFileHistoryList">
                                        <a class="item" @click="rollBackToHistory(row)">
                                            {{row.title}}
                                            <br>
                                            {{row.updateTime}}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!--<div class="item">
                                <div class="header">Introduction</div>
                                <div class="menu">

                                    <a class="item" href="/introduction/integrations.html">
                                        Integrations
                                    </a>

                                    <a class="item" href="/introduction/build-tools.html">
                                        Build Tools
                                    </a>

                                    <a class="item" href="/introduction/advanced-usage.html">
                                        Recipes
                                    </a>

                                    <a class="item" href="/introduction/glossary.html">
                                        Glossary
                                    </a>

                                </div>
                            </div>-->
                        </div>
                    </div>
                </div>
                <div class="fourteen wide column full">
                    <mavon-editor v-model="content"></mavon-editor>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    const sqlite3 = require("sqlite3").verbose();
    const path = require("path");
    const fs = require("fs");
    const $ = require("jquery");
    const jQuery = $;
    if (window) {
        window.$ = window.jQuery = require("jquery");
    }
    const DEFAULT_WIDTH = 1300;
    const DEFAULT_HEIGHT = 650;

    let db;
    let filePath;

    function init(app) {
        let databaseInit = false;
        let _currentPath = app.getPath("home");
        filePath = path.join(_currentPath, "data.db");

        if (!fs.existsSync(filePath)) {
            databaseInit = true;
        }
        db = new sqlite3.Database(filePath);
        if (databaseInit) {
            db.exec(`
create table user
(
	UserId VARCHAR(50) not null
		primary key
		unique,
	UserPassword VARCHAR(50) not null,
	Mail VARCHAR(50) not null
		unique
)
;

create table folder
(
	FolderId INTEGER
		primary key
		 autoincrement
		unique,
	UserId VARCHAR(50) not null
		references user
			on update cascade on delete cascade,
	FolderName VARCHAR(50) not null,
	ColorLabel VARCHAR(50),
	LastFolderId INT default -1
)
;

create table file
(
	FileId INTEGER not null
		primary key
		 autoincrement
		unique,
	FolderId INTEGER not null
		references folder
			on update cascade on delete cascade,
	Title VARCHAR(50) not null,
	Password VARCHAR(50),
	Length INT,
	Markdown TEXT not null,
	CreateTime DATE,
	UpdateTime TIME
)
;

CREATE TRIGGER CreateTime1
  AFTER INSERT
  ON file
  BEGIN update file
set CreateTime = datetime('now') where FileId = new.FileId;
END;

CREATE TRIGGER Length1
  AFTER INSERT
  ON file
  BEGIN update file
set Length = length(Markdown)
  where FileId = new.FileId;
END;

CREATE TRIGGER UpdateContentLengthAfterUpdate
  AFTER UPDATE
  ON file
BEGIN
  update file set Length = Length(new.Markdown) where new.FileId = FileId;
END;

CREATE TRIGGER UpdateTime1
  AFTER INSERT
  ON file
  BEGIN update file
set UpdateTime = datetime('now')
  where FileId = new.FileId;
END;

CREATE TRIGGER UpdateTimeAfterUpdate
  AFTER UPDATE
  ON file
BEGIN
  update file set UpdateTime = datetime('now') where FileId = new.FileId;
END;

CREATE TRIGGER addFileRecover
  AFTER INSERT
  ON file
BEGIN
  insert into filerecover (FileId, Length, Markdown, UpdateTime)
  VALUES (new.FileId,Length(new.Markdown),new.Markdown,datetime('now'));
END;

create table filerecover
(
	FileId INTEGER not null
		primary key
		unique
		references file
			on update cascade on delete cascade,
	Length INT,
	Markdown TEXT not null,
	UpdateTime TIME
)
;

CREATE TRIGGER Length3
  AFTER INSERT
  ON filerecover
  BEGIN update filerecover
set Length = length(Markdown)
  where FileId = new.FileId and UpdateTime = new.UpdateTime;
END;

CREATE TRIGGER Length4
  AFTER UPDATE OF Markdown
  ON filerecover
  BEGIN update filerecover
set Length = length(Markdown)
  where FileId = new.FileId and UpdateTime = new.UpdateTime;
END;

create table historicversion
(
	FileId INTEGER not null
		references file
			on update cascade on delete cascade,
	UpdateTime TIME,
	Title VARCHAR(50) not null,
	Length INTEGER,
	Markdown TEXT not null
)
;

CREATE TRIGGER Length5
  AFTER INSERT
  ON historicversion
  BEGIN update historicversion
set Length = length(Markdown)
  where FileId = new.FileId and Markdown = new.Markdown and Title = new.Title
  ;
END;

CREATE TRIGGER UpdateTime5
  AFTER INSERT
  ON historicversion
  BEGIN
  update historicversion
set UpdateTime = datetime('now') where UpdateTime is null and Markdown = new.Markdown;
END;

CREATE TRIGGER updateFileRecover
  AFTER INSERT
  ON historicversion
BEGIN
  update filerecover set Markdown = new.Markdown,UpdateTime = new.UpdateTime where FileId = new.FileId;
END;


`);
        }
    }

    function query(sql) {
        return new Promise((resolve, reject) => {
            db.all(sql, function (err, allRows) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(allRows);
                }
            })
        })
    }


    require("semantic-ui-offline");
    import _ from "lodash";

    export default {
        name: 'markdownEditor',
        data: function () {
            return {
                content: "",
                title: "",
                showSideBar: true,
                user_id: "",
                password: "",
                email: "",
                signUp: false,
                logined: false,
                folder: [],
                current_folder: -1,
                current_file: -1,
                current_file_id: -1,
                newFolderName: "",
                newFileName: "",
                modifyTitle: -1,
                historyShow: false,
                removeMode: false,
                currentFileHistoryList: []
            }
        },
        mounted: function () {
            this.$electron.ipcRenderer.send("resize", 400, 400);
            window.thisVue = this;
            init(this.$electron.remote.app);
        },
        watch: {
            content: function (newVal, oldVal) {
                this.notModify = 3;
                if (!this.delaySaveHistoryInterval) {
                    this.delaySaveHistoryInterval = setInterval(() => {
                        if (this.notModify) {
                            --this.notModify;
                        }
                        if (this.notModify <= 0) {
                            clearInterval(this.delaySaveHistoryInterval);
                            this.delaySaveHistoryInterval = false;
                            _.debounce(this.saveHistoryVersion, 1000)();
                        }
                    }, 1000);
                }
            }
        },
        methods: {
            saveHistoryVersion: function () {
                if (this.current_file === -1 || this.current_folder === -1 || this.content.trim().length === 0) {
                    return;
                }
                const currentContent = this.content;
                query(`insert into historicversion (FileId,  Title,  Markdown) VALUES
                        (${this.current_file},'${this.title}','${currentContent}')`)
                    .then(() => {
                        this.initHistoryVersion();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            register: function () {
                const that = this;
                query(`select count(1)cnt from user where UserId = '${this.user_id}'`)
                    .then(resolve => {
                        if (resolve[0] && resolve[0].cnt > 0) {
                            that.$electron.remote.dialog.showMessageBox({
                                type: "none",
                                message: "This account has been registered!"
                            });
                        }
                        else {
                            query(`insert into user (UserId, UserPassword, Mail) VALUES ('${that.user_id}','${that.password}','${that.email}')`)
                                .then(() => {
                                    that.logined = true;
                                    that.$electron.ipcRenderer.send("resize", DEFAULT_WIDTH, DEFAULT_HEIGHT);
                                    that.signUp = false;
                                    that.init();
                                })
                                .catch(err => {
                                    that.$electron.remote.dialog.showMessageBox({
                                        type: "none",
                                        message: `Catch error during registering:${err}`
                                    });
                                })
                        }
                    })
            },
            login: function () {
                const user_id = this.user_id;
                const password = this.password;
                const that = this;
                query(`select * from user where UserId = '${user_id}'`)
                    .then(allRows => {
                        if (allRows) {
                            allRows.forEach(el => {
                                if (el.UserPassword === password) {
                                    that.logined = true;
                                    that.email = el.Mail;
                                    that.$electron.ipcRenderer.send("resize", DEFAULT_WIDTH, DEFAULT_HEIGHT);
                                    that.init();
                                }
                            });
                            if (!that.logined) {
                                that.$electron.remote.dialog.showMessageBox({
                                    type: "none",
                                    message: "This account doesn't exist or password not match."
                                })
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            init: async function () {
                await this.initFolder();
                await this.initFile();
            },
            initFolder: async function () {
                const _folders = await query(`select * from folder where UserId = '${this.user_id}'`);
                let folders = {};
                _folders.forEach(el => {
                    el.LastFolderId = parseInt(el.LastFolderId);
                    el.FolderId = parseInt(el.FolderId);
                    folders[el.FolderId] = {
                        folderId: el.FolderId,
                        next: [],
                        user_id: el.UserId,
                        name: el.FolderName,
                        color: el.ColorLabel,
                        parent: el.LastFolderId,
                        file: []
                    };
                });
                _folders.forEach(el => {
                    if (el.LastFolderId !== -1) {
                        folder[el.LastFolderId].next.push(folder[el.folderId]);
                    }
                });
                _.forEach(folders, (val, index) => {
                    if (val.parent !== -1) {
                        delete folders[index];
                    }
                });
                this.folder = folders;
                console.log(folders);
            },
            initFile: async function () {
                const _files = await query(`select * from file where FolderId in (
                 select FolderId from folder where UserId = '${this.user_id}')`);
                let files = [];
                _files.forEach(el => {
                    files.push({
                        fileId: el.FileId,
                        folderId: el.FolderId,
                        title: el.Title,
                        password: el.Password,
                        length: el.length,
                        content: el.Markdown,
                        createTime: el.CreatTime,
                        updateTime: el.updateTime
                    })
                });
                const that = this;
                files.forEach(el => {
                    that.folder[el.folderId].file.push(el);
                });
                console.log(that.folder);
            },
            createNewFolder: function () {
                this.newFolderName = "";
                $(".ui.modal.new.folder").modal("show");
            },
            saveNewFolder: async function () {
                await query(`insert into folder
(UserId, FolderName, ColorLabel, LastFolderId) VALUES
  ('${this.user_id}','${this.newFolderName}','blue',-1)`);
                this.init();
            },
            createNewFile: function () {
                this.newFileName = "";
                if (this.current_folder === -1) {
                    this.$electron.remote.dialog.showMessageBox({
                        type: "none",
                        message: "Please click one of the folder you want to save to!"
                    });
                    return;
                }
                $(".ui.modal.new.file").modal("show");
            },
            saveNewFile: async function () {
                let maxFileId = 0;
                const _maxFileId = await query(`select max(FileId)fid from file`);
                maxFileId = parseInt(_maxFileId[0].fid) + 1;
                console.log(`insert into
file (FolderId, Title, Password, Markdown) VALUES
  ('${this.current_folder}','${this.newFileName}','','')`);
                const fb = await query(`insert into
file (FolderId, Title, Password, Markdown) VALUES
  ('${this.current_folder}','${this.newFileName}','','')`);
                //await query(`insert into `)
                console.log(fb);
                this.init();
            },
            saveCurrentFile: function () {
                console.log(`update file set Markdown = '${this.content}',title = '${this.title}' where FileId = ${this.current_file}`);
                query(`update file set Markdown = '${this.content}',title = '${this.title}' where FileId = ${this.current_file}`)
                    .then(() => {
                        this.$electron.remote.dialog.showMessageBox({
                            type: "none",
                            message: "Your file has saved into database."
                        });
                    })
                    .catch(err => {
                        this.$electron.remote.dialog.showMessageBox({
                            type: "none",
                            message: "Error caused when saving to database.Error log:" + err
                        })
                    });
                query(`update filerecover set Markdown = '' where FileId = ${this.current_file}`)
                    .then(() => {
                    }).catch(err => {
                    console.log(err);
                })
            },
            focusFolder: function (folderId) {
                if (this.removeMode) {
                    this.removeFolder(folderId);
                    return;
                }
                if (this.current_folder !== -1 && this.current_file_id !== -1 && this.current_file_id && this.current_folder) {
                    this.folder[this.current_folder].file[this.current_file_id].content = this.content;
                }
                this.current_folder = folderId;
                this.current_file = -1;
                this.current_file_id = -1;
            },
            initHistoryVersion: async function () {
                const fileId = this.current_file;
                const _historyVersionList = await query(`select * from historicversion where FileId = ${fileId} order by UpdateTime desc`);
                this.currentFileHistoryList = [];
                _historyVersionList.forEach(el => {
                    this.currentFileHistoryList.push({
                        title: el.Title,
                        content: el.Markdown,
                        updateTime: el.UpdateTime
                    })
                })
            },
            focusFile: async function (folderId, fileId) {
                if (~this.current_folder && ~this.current_file_id) {
                    this.folder[this.current_folder].file[this.current_file_id].content = this.content;
                }
                if (this.removeMode) {
                    this.removeFile(...arguments);
                    return;
                }
                this.current_folder = folderId;
                this.current_file = this.folder[folderId].file[fileId].fileId;
                this.current_file_id = fileId;
                this.title = this.folder[folderId].file[fileId].title;
                this.content = this.folder[folderId].file[fileId].content;
                this.initHistoryVersion();
            },
            removeFile: async function (folderId, fileId) {
                console.log(arguments);
                fileId = this.folder[folderId].file[fileId].fileId;
                Promise.all([
                    query(`delete from file where FileId = ${fileId}`),
                    query(`delete from historicversion where FileId = ${fileId}`),
                    query(`delete from filerecover where FileId = ${fileId}`)
                ])
                    .then(() => {
                        this.$electron.remote.dialog.showMessageBox({
                            type: "none",
                            message: `FileId:${fileId} has deleted from your database!`
                        });
                        this.init();
                    })
                    .catch(err => {
                        this.$electron.remote.dialog.showMessageBox({
                            type: "none",
                            message: `Error caused when deleting your file.Error detail:${err}`
                        });
                        this.init();

                    });
            },
            removeFolder: function (folderId) {
                Promise.all([
                    query(`delete from file where FileId in (select FileId from folder where FolderId = ${folderId})`),
                    query(`delete from historicversion where FileId in (select FileId from folder where FolderId = ${folderId})`),
                    query(`delete from filerecover where FileId in (select FileId from folder where FolderId = ${folderId})`),
                    query(`delete from folder where FolderId = ${folderId}`)
                ])
                    .then(() => {
                        this.$electron.remote.dialog.showMessageBox({
                            type: "none",
                            message: `FolderId:${folderId} has been deleted from your database!`
                        })
                    })
                    .catch(err => {
                        this.$electron.remote.dialog.showMessageBox({
                            type: "none",
                            message: `Error caused when deleting your folder.Error detail:${err}`
                        });
                    });
                this.init();
            },
            backToShowSideBar: function () {
                this.showSideBar = true;
                this.historyShow = false;
            },
            showHistory: async function () {
                await this.initHistoryVersion();
                this.historyShow = true;
                this.showSideBar = false;
            },
            rollBackToHistory: function (row) {
                this.title = row.title;
                this.content = row.content;
            },
            syncToServer: async function () {
                this.saveCurrentFile();
                const file = await query(`select * from file where FolderId in
                (select FolderId from folder where UserId = '${this.user_id}')`);
                const folder = await query(`select * from folder where UserId = '${this.user_id}'`);
                let send_data = {
                    user_id: this.user_id,
                    password: this.password,
                    email: this.email,
                    data: JSON.stringify({
                        folder: folder,
                        file: file
                    })
                };
                this.$http({url: "http://localhost:3000/data", method: 'post', data: send_data}).then(cb => {
                    console.log(cb);
                });
            },
            downloadFromServer: function () {
                let send_data = {
                    user_id: this.user_id,
                    password: this.password,
                    email: this.email
                };
                this.$http({url: "http://localhost:3000/get", method: 'post', data: send_data}).then(async rows => {
                    const data = rows.data.data;
                    const file = data.file;
                    const folder = data.folder;
                    console.log(data);
                    console.log(file);
                    console.log(folder);
                    await query(`delete from file where FolderId in (select FolderId from folder
                    where UserId = '${this.user_id}')`);
                    console.log("finished one");
                    await query(`delete from folder where UserId = '${this.user_id}'`);
                    for (let i of folder) {
                        await query(`insert into folder (FolderId, UserId, FolderName, ColorLabel)
                        VALUES ('${i.FolderId}','${i.UserId}','${i.FolderName}','${i.ColorLabel}')`)
                    }
                    for (let i of file) {
                        await query(`insert into file
                        (FolderId, Title, Password, Length, Markdown, CreateTime, UpdateTime) VALUES
                        ('${i.FolderId}','${i.Title}','${i.Password}','${i.Length}','${i.Markdown}','${i.CreateTime}'
                        ,'${i.UpdateTime}')`);
                    }
                    this.init();
                })
            }
        }
    }
</script>

<style>
    /* CSS */
    .v-note-wrapper {
        min-height: 500px !important;
        height: 100% !important;
        z-index: 0 !important;
    }

    .full {
        height: 100% !important;
    }

    .ui.middle.aligned.center {
        margin: auto;
    }
</style>
