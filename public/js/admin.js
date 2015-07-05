var Header = React.createClass({
    getInitialState: function() {
        return {};
    },

    logout: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/logout', true);
        xhr.send();
    },

    render: function() {

        return (
            <nav>
                <div className='nav-container'>
                    <div className='nav-external'>
                        <ul>
                            <li>
                                <a href='' onClick={this.logout}>LOGOUT</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
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
        return {
            users: null,
            groups: null
        };
    },

    getGroups: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/api/groups', true);
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

    showGroups: function() {
        var Groups = [];
        this.state.groups.map(function(group, index) {
            Groups.push(<li key={index}>{group.id}</li>);
        });

        return (
            <ul>
                {Groups}
            </ul>
        );
    },

    getUsers: function() {
        //get users
        this.setState({
            users: true,
            groups: false
        });
    },

    render: function() {
        var MainContent;
        if(this.state.users) {
            MainContent = (
                <div>
                    Users
                </div>
            );
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
                <Header />
                <Sidebar showGroups={this.getGroups} showUsers={this.getUsers}/>
                <Content content={MainContent}/>
                <Footer />
            </div>
        );
    }
});
React.render(
    <App />,
    document.getElementById('app')
);
