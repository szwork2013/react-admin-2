var Header = React.createClass({
    getInitialState: function() {
        return {};
    },

    logout: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/logout', true);
        xhr.setRequestHeader('x-access-token', this.props.jwt.token);
        xhr.onload = function() {
            if(xhr.status === 200) {
                this.props.onLogout();
            }
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
                this.props.onLoginSuccess(response)
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


var AdminSidebar = React.createClass({

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

var AdminContent = React.createClass({
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

var AdminPage = React.createClass({
    getInitialState: function() {
        return {
            users: null,
            groups: null
        };
    },

    getGroups: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/api/groups', true);
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
                    users: false,
                    groups: groups
                });
            }
        }.bind(this);

        xhr.send(null);
    },

    getUsers: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/api/users', true);
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
                    users: users,
                    groups: null
                });
            }
        }.bind(this);

        xhr.send(null);
    },

    showGroups: function() {
        var Groups = [];
        this.state.groups.map(function(group, index) {
            Groups.push(<li key={index}>{group.name}</li>);
        });

        return (
            <ul>
                {Groups}
            </ul>
        );
    },

    showUsers: function() {
        var Users = [];
        this.state.users.map(function(user, index) {
            Users.push(<li key={index}>{user.name}</li>);
        });

        return (
            <ul>
                {Users}
            </ul>
        );
    },

    render: function() {
        var MainContent;
        if(this.state.users) {
            MainContent = this.showUsers();
        } else if (this.state.groups) {
            MainContent = this.showGroups();
        } else {
            MainContent = (
                <div>
                    Dashboard
                </div>
            );
        }

        return (
            <div>
                <AdminSidebar showGroups={this.getGroups} showUsers={this.getUsers}/>
                <AdminContent content={MainContent}/>
            </div>
        );
    }
});


var ProfilePage = React.createClass({
    render: function() {
        return (
            <div>
                Profile Page
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
    },

    render: function() {
        var Content;
        if(this.state.jwt) {
            if(this.state.jwt.admin) {
                Content = <AdminPage jwt={this.state.jwt}/>
            } else {
                Content = <ProfilePage jwt={this.state.jwt}/>
            }
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
