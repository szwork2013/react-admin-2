var Header = React.createClass({
    getInitialState: function() {
        return {};
    },

    logout: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/logout', true);
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            // how to set header on refresh?
            // history.pushState({login: '/'}, 'page 2', '/');
            this.props.onLogout();
        }.bind(this);

        xhr.send();
    },

    render: function() {
        var header;
        if(this.props.jwt) {
            header = (
                <div className='nav-container'>
                    <div className='nav-external'>
                        <ul>
                            <li>
                                <a href='' onClick={this.logout}>LOGOUT</a>
                            </li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            header = (
                <div className='nav-container'>
                    Header

                    <div className='nav-external'>
                        <ul>
                            <li>
                                <Dropdown onLoginSuccess={this.props.onLoginSuccess} />
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }


        return (
            <nav>
                {header}
            </nav>
        );
    }
});


var Dropdown = React.createClass({
    getInitialState: function() {
        return {
            isOpen: false
        };
    },

  componentDidMount: function() {
    document.addEventListener("click", this.documentClickHandler);
  },

  componentWillUnmount: function() {
    document.removeEventListener("click", this.documentClickHandler);
  },

  documentClickHandler: function() {
    this.setState({
      isOpen: false
    });
  },

  triggerClickHandler: function(e) {
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    this.setState({
      isOpen: this.state.isOpen ? false : true
    });
  },

  dropdownClickHandler: function(e) {
    e.nativeEvent.stopImmediatePropagation();
  },

  render: function() {

    var className = 'dropdown ';
    className += this.state.isOpen ? 'show' : 'hide';

    return (
      <div>
        <a href='' onClick={this.triggerClickHandler}>LOGIN</a>
        <div className={className} onClick={this.dropdownClickHandler}>
          <Login onLoginSuccess={this.props.onLoginSuccess} />
        </div>
      </div>
    );
  }

});

var Login = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            password: '',
            error: {
                name: null,
                password: null,
                credentials: null
            }
        };
    },

    setName: function(e) {
        var error = this.state.error;
        error.name = null;
        error.credentials = null;
        this.setState({
            name: e.target.value,
            error: error
        });
    },

    setPassword: function(e) {
        var error = this.state.error;
        error.password = null;
        error.credentials = null;
        this.setState({
            password: e.target.value,
            error: error
        });
    },

    login: function() {
        if(this.state.name === '' || this.state.password === '') {
            this.setState({
                error: {
                    name: this.state.name === '' ? 'A name is required' : null,
                    password: this.state.password === '' ? 'A password is required' : null
                }
            });
            return;
        }

        var data = {
            'name': this.state.name,
            'password': this.state.password
        };

        var xhr = new XMLHttpRequest();
        xhr.open('post', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
                var error = this.state.error;
                error.credentials = response;
                this.setState({
                    error: error
                });
            } else {
                var response = JSON.parse(xhr.responseText);
                this.props.onLoginSuccess(response);
            }
        }.bind(this);

        xhr.send(JSON.stringify(data));
    },

    inputSubmit: function(e) {
        if(e.keyCode == 13) {
            this.login();
        }
    },

    render: function() {
        var nameClass = '',
            passwordClass = '';

        if(this.state.error.name) {
            nameClass = 'error';
        }

        if(this.state.error.password) {
            passwordClass = 'error';
        }

        var CredentialsError = null;
        if(this.state.error.credentials) {
            CredentialsError = (
                <div className='credentials-error'>
                    {this.state.error.credentials}
                </div>
            );
        }


        return (
            <div className='login'>
                {CredentialsError}
                <div className='error-msg'>
                    {this.state.error.name}
                </div>
                <input className={nameClass}
                       type='text'
                       name='name'
                       value={this.state.name}
                       onChange={this.setName}
                       onKeyDown={this.inputSubmit}
                       placeholder='Name' />

                <div className='error-msg'>
                    {this.state.error.password}
                </div>
                <input className={passwordClass}
                       type='password'
                       name='password'
                       value={this.state.password}
                       onChange={this.setPassword}
                       onKeyDown={this.inputSubmit}
                       placeholder='Password' />

                <button type='submit' onClick={this.login}>Login</button>
            </div>
        );
    }
});


var SignupPage = React.createClass({
    render: function() {
        return (
            <div>
                Sign Up
            </div>
        );
    }
});


var Sidebar = React.createClass({

    showGroups: function() {
        this.props.showGroups();
    },

    showUsers: function() {
        this.props.showUsers();
    },

    render: function() {
        return (
            <div className='sidebar'>
                <ul>
                    <li onClick={this.showGroups}>
                        Manage Groups
                    </li>
                    <li onClick={this.showUsers}>
                        Manage Users
                    </li>
                </ul>
            </div>
        );
    }
});

var Content = React.createClass({
    render: function() {
        return (
            <div className='page'>
                <div className='main-content'>
                    {this.props.content}
                </div>
            </div>
        );
    }
});

var ProfilePage = React.createClass({
    getInitialState: function() {
        return {
            user: null,
            users: null,
            group: null,
            groups: null,
            newGroupName: ''
        };
    },

    getGroups: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/api/groups?include=user', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
                var error = this.state.error;
                error.credentials = response;
                this.setState({
                    error: error
                });
            } else {
                var groups = JSON.parse(xhr.responseText);
                //get groups
                this.setState({
                    user: null,
                    users: null,
                    group: null,
                    groups: groups,
                    newGroupName: ''
                });
            }
        }.bind(this);

        xhr.send(null);
    },

    getUsers: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/api/users?include=group', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
                var error = this.state.error;
                error.credentials = response;
                this.setState({
                    error: error
                });
            } else {
                var users = JSON.parse(xhr.responseText);
                //get groups
                this.setState({
                    user: null,
                    users: users,
                    group: null,
                    groups: null,
                    newGroupName: ''
                });
            }
        }.bind(this);

        xhr.send(null);
    },

    getGroup: function(groupId) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/api/groups/' + groupId + '?include=user', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
                var error = this.state.error;
                error.credentials = response;
                this.setState({
                    error: error
                });
            } else {
                var group = JSON.parse(xhr.responseText);
                //get groups
                this.setState({
                    user: null,
                    users: null,
                    group: group[0],
                    groups: null,
                    newGroupName: ''
                });
            }
        }.bind(this);

        xhr.send(null);

    },

    postGroup: function() {
        var group = {
            name: this.state.newGroupName
        };
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/api/groups/', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
                var error = this.state.error;
                error.credentials = response;
                this.setState({
                    error: error
                });
            } else {
                this.getGroups();
            }
        }.bind(this);

        xhr.send(JSON.stringify(group));
    },

    putGroup: function(group) {
        var xhr = new XMLHttpRequest();
        xhr.open('put', '/api/groups/' + group._id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
                var error = this.state.error;
                error.credentials = response;
                this.setState({
                    error: error
                });
            } else {
                this.getGroup(group._id);
            }
        }.bind(this);

        xhr.send(JSON.stringify(group));

    },

    deleteGroup: function(group) {
        var xhr = new XMLHttpRequest();
        xhr.open('delete', '/api/groups/' + group._id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
                var error = this.state.error;
                error.credentials = response;
                this.setState({
                    error: error
                });
            } else {
                this.getGroups();
            }
        }.bind(this);

        xhr.send(JSON.stringify(group));

    },

    setNewGroupName: function(e) {
        this.setState({
            newGroupName: e.target.value
        });
    },

    showGroups: function() {
        var Groups = [];
        var self = this;
        this.state.groups.map(function(group, index) {
            Groups.push(
                <li onClick={self.getGroup.bind(self, group._id)}
                    className='group-item'
                    key={index}>

                    {group.name}
                </li>
            );
        });

        Groups.push(
            <li className='group-item-new'
                key={'new-group'}>


                New Group

                <input type='text'
                       name='name'
                       value={this.state.newGroupName}
                       onChange={this.setNewGroupName}
                       placeholder='Name' />

               <button type='submit' onClick={this.createGroup}>Create</button>

            </li>
        );

        return (
            <ul className='group-list'>
                {Groups}
            </ul>
        );
    },

    createGroup: function() {
        if(this.state.newGroupName) {
            this.postGroup();
        }
    },


    showUsers: function() {
        var Users = [];
        this.state.users.map(function(user, index) {
            Users.push(
                <div className='list-item' key={index}>
                    <div key={user.name} className='name'>
                        <div className='item-header'>User Name</div>
                        <div className='item-content'>{user.name}</div>
                    </div>
                    <div key={user.group.id} className='name'>
                        <div className='item-header'>Group Name</div>
                        <div className='item-content'>{user.group.name}</div>
                    </div>
                </div>
            );
        });

        return (
            <ul>
                {Users}
            </ul>
        );
    },

    removeFromGroup: function(userId) {
        var users = [];
        this.state.group.users.map(function(user, index) {
            if(user._id !== userId) {
                users.push(user._id);
            }
        });
        var updatedGroup = this.state.group;
        updatedGroup.users = users;

        this.putGroup(updatedGroup);
    },

    removeGroup: function(event) {
        event.preventDefault();
        if(this.state.group.users.length === 0) {
            this.deleteGroup(this.state.group);
        }
    },

    showGroup: function() {
        var userTable = [];

        var self = this;
        var groupId = this.state.group._id;
        this.state.group.users.map(function(user, index) {
            userTable.push(
                <tr>
                    <td>{user.name}</td>
                    <td onClick={self.removeFromGroup.bind(self, user._id)}><i className="fa fa-times"></i></td>
                </tr>
            );
        });


        return (
            <div>
                {this.state.group.name}
                 <a href='' onClick={this.removeGroup}>delete group</a>
                <table className='user-table'>
                    <thead>
                        <tr>
                            <td>User</td>
                            <td>Remove from Group</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userTable}
                    </tbody>
                </table>

            </div>
        );
    },

    render: function() {
        var MainContent;
        if(this.state.users) {
            MainContent = this.showUsers();
        } else if (this.state.groups) {
            MainContent = this.showGroups();
        } else if (this.state.user) {

        } else if (this.state.group) {
            MainContent = this.showGroup();
        } else {
            MainContent = (
                <div>
                    Dashboard
                </div>
            );
        }

        return (
            <div>
                <Sidebar showGroups={this.getGroups} showUsers={this.getUsers}/>
                <Content content={MainContent}/>
            </div>
        );
    }
});

var Footer = React.createClass({
    render: function() {
        return (
            <div className='footer'>
                <div className='copyright'>
                    Admin 2015
                </div>
            </div>
        );
    }
});


var App = React.createClass({
    getInitialState: function() {
        var jwt = null;
        if(localStorage.jwt) {
            jwt = JSON.parse(localStorage.jwt);
        }
        return {
            jwt: jwt
        };
    },

    setToken: function(jwt) {
        localStorage.jwt = JSON.stringify(jwt);
        this.setState({
            jwt: jwt
        });
    },

    removeToken: function() {
        delete localStorage.jwt;
        // history.pushState({login: '/'}, 'page 2', '/');
    },

    render: function() {
        var Content;
        if(this.state.jwt) {
            Content = <ProfilePage jwt={this.state.jwt}/>
        } else {
            Content = <SignupPage />
        }

        return (
            <div>
                <Header jwt={this.state.jwt}
                        onLoginSuccess={this.setToken}
                        onLogout={this.removeToken} />
                {Content}
                <Footer />
            </div>
        );
    }
});
React.render(
    <App />,
    document.getElementById('app')
);
