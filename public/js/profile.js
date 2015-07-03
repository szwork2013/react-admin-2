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
                    Header

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

var Content = React.createClass({
    render: function() {
        return (
            <div>Content</div>
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
