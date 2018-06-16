import * as React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import '../../styles/login/Login.css';
import { ChooseRouterPathComponent } from '../ChooseRouterPathComponent';

interface LoginState {
    email: string;
    password: string;
    logged: boolean;

}
export default class Login extends React.Component<any, LoginState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            logged: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange( event: any) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit(event: any ) {
        console.log('submit');
        event.preventDefault();
    }

    render() {

        if (this.state.logged) {
            return (
                <ChooseRouterPathComponent/>
            );
        } else {
            return (
                <div>
                    <form className={'loginForm'} onSubmit={this.handleSubmit}>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                autoFocus={true}
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </FormGroup>
                        <Button
                            block={true}
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            onClick={this.handleLogin}
                        >
                            Login
                        </Button>
                    </form>
                </div>
            );
        }
    }

    handleLogin() {
        this.setState({logged: true});
    }
}