import React, { Component } from 'react';
import '../Style/Alta.css';
import { Database } from '../../config/config';
import { Link } from 'react-router-dom';


class EditarCountry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barrio: [],
            nombre: '',
            calle: '',
            numero: '',
            titular: '',
            celular: '',
            descripcion: '',
            resultado: ''
        };
        this.editCountry = this.editCountry.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeCalle = this.ChangeCalle.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);
        const url = this.props.location.pathname.split('/');
        this.idBarrio = url[url.length - 1];
    }


    async componentDidMount() {
        const {barrio} = this.state;
        await Database.collection('Country').doc(this.idBarrio).get()
            .then(doc=> {
                if (doc.exists) {
                    this.state.barrio.push(doc.data());
                } else {
                    //Si no existe, hacer esto...
                }
            })
            .catch(err=> {
                //En caso de error, hacer esto...
            });
        this.setState({barrio});
        const estrella = this.state.barrio[0];
        this.setState({
            nombre: estrella.Nombre,
            calle: estrella.Calle,
            numero: estrella.Numero,
            titular: estrella.Titular,
            celular: estrella.Celular,
            descripcion: estrella.Descripcion
        });
    }

    editCountry() {
        Database.collection('Country').doc(this.idBarrio).set({
            Nombre: this.state.nombre,
            Calle: this.state.calle,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion
        });

    }

    ChangeNombre(event) {
        this.setState({nombre: event.target.value});
    }

    ChangeCalle(event) {
        this.setState({calle: event.target.value});
    }

    ChangeNumero(event) {
        this.setState({numero: event.target.value});
    }

    ChangeCelular(event) {
        this.setState({celular: event.target.value});
    }

    ChangeTitular(event) {
        this.setState({titular: event.target.value});
    }

    ChangeDescripcion(event) {
        this.setState({descripcion: event.target.value});
    }

    registrar() {
        //Agregar validaciones para no registrar cualquier gilada
        if (true) {
            this.editCountry();
            this.setState({
                nombre: '',
                calle: '',
                numero: '',
                titular: '',
                celular: '',
                descripcion: '',
                resultado: 'Se edito con exito'
            });
        }
    }


    render() {
        return (
            <div className="content">
                 <div className="form-group">
                    <label className="h2">Editar barrio</label>
                 </div>
                <div className="row">
                    <div className="col-md-6  flex-container form-group">
                        <label for="Nombre"> Nombre del Barrio </label>
                        <input type="name" className="form-control" placeholder="Name Country"
                               value={this.state.nombre}
                               onChange={this.ChangeNombre}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="Nombre"> Titular </label>
                        <input type="name" className="form-control" placeholder="Name Headline"
                               value={this.state.titular}
                               onChange={this.ChangeTitular}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="Nombre"> Calle </label>
                        <input type="name" className="form-control" placeholder="Street"
                               value={this.state.calle}
                               onChange={this.ChangeCalle}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="Nombre"> Celular </label>
                        <input type="name" className="form-control" placeholder="Mobile"
                               value={this.state.celular}
                               onChange={this.ChangeCelular}/>
                    </div>
                    <div className="col-md-6  flex-container form-group">
                        <label for="Nombre"> Numero </label>
                        <input type="name" className="form-control" placeholder="Number"
                               value={this.state.numero}
                               onChange={this.ChangeNumero}/>
                    </div>


                    <div className="col-md-6  flex-container form-group">
                        <label for="Nombre"> Descripcion </label>
                        <textarea className="form-control" id="exampleTextarea" rows="3" placeholder="Description"
                                  value={this.state.descripcion}
                                  onChange={this.ChangeDescripcion}> </textarea>
                    </div>
                </div>
                <div>
                <span>
                    <strong>{this.state.resultado}</strong>
                </span>
                </div>
                <div className="form-group izquierda">
                    <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>
                    <Link to="/admin/country" type="button" className="btn btn-primary boton">Volver</Link>
                </div>

            </div>

        );
    }
}

export default EditarCountry;