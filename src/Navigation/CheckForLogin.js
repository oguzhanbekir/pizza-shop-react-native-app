import React from 'react';
import {connect} from 'react-redux';

class CheckForLogin extends React.Component {
    componentDidMount() {
        const loggedIn = this.props.loggedIn;
        const name = this.props.name;

        this.props.navigation.navigate(loggedIn ? 'Home' : 'Auth');
        if (loggedIn) {
            this.props.navigation.navigate('Home', {
                title: 'Hoş Geldin ' + name.split(' ')[0],
            });
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.AuthReducer.loggedIn,
        name: state.AuthReducer.name,
    };
};


export default connect(
    mapStateToProps,
    null,
)(CheckForLogin);
