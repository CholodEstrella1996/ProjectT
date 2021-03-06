import React, { Component } from 'react';
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import Card from 'components/Card/Card.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import Checkbox from 'components/CustomCheckbox/CustomCheckbox.jsx';
import logo from '../../logoLiveSafe.png';
import { Database, Firebase } from '../../config/config';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import AuthNavbar from 'components/Navbars/AuthNavbar.jsx';
import bgImage from '../../assets/img/fondoLogin.jpg';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardHidden: true,
            log: false,
            email: '',
            password: '',
            user: null,
            result: false,
            tipo: false,
            tipoUsuario: '',
            resultado: '',
            usuarioNuevo: null,
            nuevaPass: '',
            nuevaPassTwo: '',
            login: false
        };
        this.crearUsuarioNuevo = this.crearUsuarioNuevo.bind(this);
        this.ChangeEmail = this.ChangeEmail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.ChangeNuevaPass = this.ChangeNuevaPass.bind(this);
        this.ChangeNuevaPassTwo = this.ChangeNuevaPassTwo.bind(this);
        this.onButtonPress = this.onButtonPress.bind(this);
        this.obtenerValoresUsuario = this.obtenerValoresUsuario.bind(this);
    }

    componentDidMount() {
        setTimeout(function () { this.setState({cardHidden: false}) }.bind(this), 700);
    }

    ChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    ChangePass(event) {
        this.setState({password: event.target.value});
    }

    ChangeNuevaPass(event) {
        this.setState({nuevaPass: event.target.value});
    }

    ChangeNuevaPassTwo(event) {
        this.setState({nuevaPassTwo: event.target.value});
    }

    async obtenerValoresUsuario() {
        await Database.collection('Usuarios').doc(this.state.email).get()
            .then(doc=> {
                if (doc.exists) {
                    this.setState({tipo: true});
                    this.setState({tipoUsuario: doc.data().TipoUsuario.id});
                    localStorage.setItem('tipoUsuario', this.state.tipoUsuario);
                    localStorage.setItem('idCountry', doc.data().IdCountry.id);
                    localStorage.setItem('idPersona', doc.data().IdPersona.id);
                    localStorage.setItem('mail', doc.data().NombreUsuario);
                    localStorage.setItem('userName', doc.data().UserName);
                }
            });
    }

    consultarUsuarioTemporal() {
        Database.collection('UsuariosTemp').doc(this.state.email).get().then(doc=> {
            if (doc.exists) {
                this.setState({usuarioNuevo: doc.data()});
            }
        });
    }

    async onButtonPress() {
        await this.obtenerValoresUsuario();

        if (!this.state.tipoUsuario) {
            await this.consultarUsuarioTemporal();
        } else {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(()=> {
                    this.setState({result: true});
                    this.setState({resultado: 'Fallo de autentificacion'});
                });
        }
    }

    async crearUsuarioNuevo() {
        const {email, nuevaPass, usuarioNuevo} = this.state;
        await Firebase.auth().createUserWithEmailAndPassword(email, nuevaPass).then(
            Database.collection('Usuarios').doc(email).set(usuarioNuevo));
        await this.obtenerValoresUsuario();
        Database.collection('UsuariosTemp').doc(this.state.email).delete();
        this.setState({user: true});
    }

    redirect() {
        if (this.state.result) {
            return <Redirect to="/"/>;
        }
    }

    render() {
        return (
            <div>
                <AuthNavbar/>
                <div className="wrapper wrapper-full-page">
                    <div className={'full-page login-page'} data-color="black" data-image={bgImage}>
                        <div className="content">
                            <Grid>
                                <Row>
                                    <Col>
                                        <form>
                                            <Card
                                                hidden={this.state.cardHidden}
                                                textCenter
                                                content={
                                                    <div>
                                                        <FormGroup>
                                                            <img src={logo} width="190" height="150"></img>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <ControlLabel>Email</ControlLabel>
                                                            <FormControl placeholder="Ingrese mail" type="email"
                                                                         value={this.state.email}
                                                                         onChange={this.ChangeEmail}/>
                                                        </FormGroup>
                                                        <FormGroup hidden={this.state.usuarioNuevo}>
                                                            <ControlLabel>Contraseña</ControlLabel>
                                                            <FormControl placeholder="Contraseña"
                                                                         type="password"
                                                                         value={this.state.password}
                                                                         onChange={this.ChangePass}/>
                                                        </FormGroup>
                                                        <FormGroup hidden={!this.state.usuarioNuevo}>
                                                            <ControlLabel>Nueva Contraseña</ControlLabel>
                                                            <FormControl placeholder="Contraseña"
                                                                         type="password"
                                                                         value={this.state.nuevaPass}
                                                                         onChange={this.ChangeNuevaPass}
                                                                         autoComplete="off"/>
                                                        </FormGroup>
                                                        <FormGroup hidden={!this.state.usuarioNuevo}>
                                                            <ControlLabel>Confirmar Nueva
                                                                Contraseña</ControlLabel>
                                                            <FormControl placeholder="Contraseña"
                                                                         type="password"
                                                                         value={this.state.nuevaPassTwo}
                                                                         onChange={this.ChangeNuevaPassTwo}
                                                                         autoComplete="off"/>
                                                        </FormGroup>
                                                    </div>
                                                }
                                                legend={
                                                    <Button bsStyle="info" fill wd
                                                            onClick={this.state.usuarioNuevo ?
                                                                this.crearUsuarioNuevo :
                                                                this.onButtonPress
                                                            }>
                                                        Iniciar Sesion
                                                    </Button>
                                                }
                                                ftTextCenter
                                            />
                                        </form>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                        <div
                            className="full-page-background"
                            style={{backgroundImage: 'url(' + bgImage + ')'}}
                        />
                    </div>
                </div>
                {this.redirect()}
            </div>
        );
    }
}

export default LoginPage;
