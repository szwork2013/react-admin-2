var Header = React.createClass({
    getInitialState: function() {
        return {};
    },

    render: function() {

        return (
            <nav>
                <div className='nav-container'>
                    Header

                    <div className='nav-external'>
                        <ul>
                            <li>
                                <Dropdown />
                            </li>
                        </ul>
                    </div>
                </div>
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
          <Login />
        </div>
      </div>
    );
  }

});

var Login = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            password: ''
        };
    },

    setName: function(e) {
        this.setState({
            name: e.target.value
        });
    },

    setPassword: function(e) {
        this.setState({
            password: e.target.value
        });
    },

    login: function() {
        var data = {
            'username': this.state.name,
            'password': this.state.password
        };

        var xhr = new XMLHttpRequest();
        xhr.open('post', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if(xhr.status === 401) {
                var response = JSON.parse(xhr.responseText);
            } else {
                // var response = JSON.parse(xhr.responseText);
                window.location.replace(window.location.origin + '/profile');
            }
        }.bind(this);

        xhr.send(JSON.stringify(data));
    },

    render: function() {
        return (
            <div className='login'>
                <input type='text' name='name' value={this.state.name} onChange={this.setName} placeholder='Name' />
                <input type='password' name='password' value={this.state.password} onChange={this.setPassword} placeholder='Password' />
                <button onClick={this.login}>Login</button>
            </div>
        );
    }
});


var Content = React.createClass({
    render: function() {
        return (
            <div>
                Sign Up
                <Signup />
            </div>
        );
    }
});

// Almost identical to login. Should abstract
var Signup = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            password: '',
            group: ''
        };
    },

    setName: function(e) {
        this.setState({
            name: e.target.value
        });
    },

    setPassword: function(e) {
        this.setState({
            password: e.target.value
        });
    },

    setGroup: function(e) {
        this.setState({
            group: e.target.value
        });
    },

    signup: function() {
        var data = {
            'username': this.state.name,
            'password': this.state.password,
            'group': this.state.group
        };

        var xhr = new XMLHttpRequest();
        xhr.open('post', '/signup', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if(xhr.status === 400) {
                var response = JSON.parse(xhr.responseText);
            } else {
                window.location.replace(window.location.origin + '/profile');
            }
        }.bind(this);

        xhr.send(JSON.stringify(data));
    },

    render: function() {
        return (
            <div className='signup'>
                <input type='text' name='name' value={this.state.name} onChange={this.setName} placeholder='Name' />
                <input type='password' name='password' value={this.state.password} onChange={this.setPassword} placeholder='Password' />
                <input type='group' name='group' value={this.state.group} onChange={this.setGroup} placeholder='Group' />
                <button onClick={this.signup}>Sign Up</button>
            </div>
        );
    }
});


var Footer = React.createClass({
    render: function() {
        return (
            <div>Footer</div>
        );
    }
});


var App = React.createClass({
    render: function() {
        return (
            <div>
                <Header />
                <Content />
                <Footer />
            </div>
        );
    }
});
React.render(
    <App />,
    document.getElementById('app')
);
