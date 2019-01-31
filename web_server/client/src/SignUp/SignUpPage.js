import SignUpForm from './SignUpForm';
import React from 'react';
import PropTypes from 'prop-types';

class SignUpPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state.
    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
        confirm_password: ''
      }
    };
  }

  processForm(event) {
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;
    const confirm_password = this.state.user.confirm_password;

    console.log('email:', email);
    console.log('password', password);
    console.log('confirm_password', confirm_password);

    // post signup data.
    const url = 'http://' + window.location.hostname + ':3000' + '/auth/signup';
    const request = new Request(
      url,
      {method:'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.user.email,
        password: this.state.user.password
      })
    });

    fetch(request).then(response => {
      if (response.status === 200) {
        this.setState({
          errors: {}
        });

        // change the current URL to /login
        this.context.router.replace('/login');
      } else {
        response.json().then(json => {
          console.log(json);
          const errors = json.errors ? json.errors : {};
          errors.summary = json.message;
          console.log(this.state.errors);
          this.setState({errors});
        });
      }
    });

  }

  changeUser(event) {
    const field = event.target.name;  // email || password || confirm_password
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({user});

    const errors = this.state.errors;
    if (this.state.user.password !== this.state.user.confirm_password) {
      errors.password = "Password and Confirm Password don't match.";
    } else {
      errors.password = '';
    }
    this.setState({errors});
  }

  render() {
    return (
      <SignUpForm
       onSubmit={(e) => this.processForm(e)}
       onChange={(e) => this.changeUser(e)}
       errors={this.state.errors}
      />
    );
  }
}

// To make react-router work
SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SignUpPage;