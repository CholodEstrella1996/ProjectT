import React, { Component } from 'react';
import { Database } from '../../config/config';
import Select from 'react-select';
import Button from 'components/CustomButton/CustomButton.jsx';
import { Grid, Row, Col } from "react-bootstrap";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import Card from "components/Card/Card.jsx";

moment.locale('es');
const localizer = momentLocalizer(moment);

class AltaReserva extends Component {

    constructor() {
        super();
        this.state = {
            reservaLista: [],
            servicioSeleccionado: {},
            events: [],
            alert: null,
        };
        this.addReserva = this.addReserva.bind(this);
        this.consultar = this.consultar.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.registrar = this.registrar.bind(this);
        this.hideAlert = this.hideAlert.bind(this);

    }


    async componentDidMount() {
        const {reservaLista} = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    reservaLista.push(
                        {value: doc.id, label: doc.data().Nombre}
                    );
                });
            });
        this.setState({reservaLista});
    }

    addReserva(datos) {
        //Se guarda en coleccion Servicios y en el Propietario que hace la reserva.
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.state.servicioSeleccionado.value)
            .collection('Reservas').add(datos);
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(localStorage.getItem('idPersona'))
        .collection('Reservas').add(datos);
           

    }

    async consultar(){
        var newEvents = [];
        var idPersona = localStorage.getItem('idPersona');
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Servicios').doc(this.state.servicioSeleccionado.value).collection('Reservas').get().then(querySnapshot=> {
                querySnapshot.forEach(doc=> {
                    newEvents.push({
                        title: doc.data().Nombre,
                        start: new Date(doc.data().FechaDesde.seconds * 1000),
                        end: new Date(doc.data().FechaHasta.seconds * 1000),
                        color: (idPersona === doc.data().IdPropietario.id) ? 'blue' : 'red'
                      });
                });
            });
        this.setState({events: newEvents});
    }
    
    ChangeSelect(event) {
        this.setState({servicioSeleccionado: event});
    }

    registrar() {
        console.log('Registrando....');
    }

    selectedEvent(event) {
        console.log("algo")
      }
    
      addNewEventAlert(slotInfo) {
          //agregar validaciones.
        if (slotInfo.start < new Date()){
            this.setState({
                alert: (
                  <SweetAlert
                    style={{ display: "block", marginTop: "-100px", position: "center"  }}
                    title="No se puede realizar la reserva"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                  >
                    La reserva debe ser posterior a la hora o fecha actual.
                  </SweetAlert>
                )
              });
            return; 
        }

        this.state.events.map((evento) => {
            if (evento.start.getDay() == slotInfo.start.getDay()){
                if ((evento.start <= slotInfo.start && evento.end > slotInfo.start) ||
                     (evento.start < slotInfo.end && evento.end >= slotInfo.end) ||
                     (evento.start > slotInfo.start && evento.end < slotInfo.end)){
                    this.setState({
                        alert: (
                          <SweetAlert
                            style={{ display: "block", marginTop: "-100px", position: "center"  }}
                            title="No se puede realizar la reserva"
                            onConfirm={() => this.hideAlert()}
                            onCancel={() => this.hideAlert()}
                            confirmBtnBsStyle="info"
                          >
                            No se puede resevar porque ya hay una reserva vigente en este horario.
                          </SweetAlert>
                        )
                      });
                }
            }
        });
        if(this.state.alert) return;
        if (slotInfo.slots.length > 9){
            this.setState({
                alert: (
                  <SweetAlert
                    style={{ display: "block", marginTop: "-100px", position: "center"  }}
                    title="No se puede realizar la reserva"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                  >
                    La reserva no debe durar mas de 4hs.
                  </SweetAlert>
                )
              });
            return; 
        }
        this.setState({
          alert: (
            <SweetAlert
              input
              validationMsg={'El nombre es requerido para realizar la reserva.'}
              showCancel
              style={{ display: "block", marginTop: "-100px", position: "center", left: "0%" }}
              title="Ingrese nombre del evento"
              onConfirm={e => this.addNewEvent(e, slotInfo)}
              onCancel={() => this.hideAlert()}
              confirmBtnBsStyle="info"
              cancelBtnBsStyle="danger"
            />
          )
        });
      }
    
      addNewEvent(e, slotInfo) {
        var newEvents = this.state.events;
        var datos = {
            Nombre: e,
            FechaHasta: slotInfo.end,
            FechaDesde: slotInfo.start,
            IdPropietario: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Propietarios/' + localStorage.getItem('idPersona')),
            IdServicio: Database.doc('Country/' + localStorage.getItem('idCountry') + '/Servicios/' + this.state.servicioSeleccionado.value)
            }
        newEvents.push({
          title: e,
          start: slotInfo.start,
          end: slotInfo.end,
          color: 'green'
        });
        this.setState({
          alert: null,
          events: newEvents
        });
        this.addReserva(datos);
      }
    
      eventColors(event, start, end, isSelected) {
        var backgroundColor = "rbc-event-";
        event.color
          ? (backgroundColor = backgroundColor + event.color)
          : (backgroundColor = backgroundColor + "default");
        return {
          className: backgroundColor
        };
      }

      hideAlert() {
        this.setState({
          alert: null
        });
      }

    render() {
        return (
            <div className="col-12 ">
                <legend><h3> Registrar una reserva</h3></legend>
                <div className="row">
                    <div className="col-md-6  flex-container form-group row-secction">
                        <label> Servicios del Country </label>
                        <Select
                            className="col-6"
                            classNamePrefix="select"
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            options={this.state.reservaLista}
                            onChange={this.ChangeSelect.bind(this)}
                        />
                    </div>
                    <div className="row-secction">
                        <Button bsStyle="primary" fill wd onClick={this.consultar}>
                            Consultar
                        </Button>
                    </div>
                </div>
        {this.state.alert}
        <Grid fluid>
          <Row>
            <Col md={10} mdOffset={1}>
                
                    <h3>{this.state.servicioSeleccionado?this.state.servicioSeleccionado.label:'Sin servicio seleccionado'}</h3>
               
              <Card
                calendar
                content={
                  <Calendar
                    selectable
                    step={30}
                    min={new Date(2019, 0, 1, 8, 0)}
                    max={new Date(2019, 0, 1, 17, 0)}
                    localizer={localizer}
                    events={this.state.events}
                    defaultView="week" 
                    views={['week']}
                    scrollToTime={new Date(2019, 11, 21, 6)}
                    defaultDate={new Date()}
                    onSelectEvent={event => this.selectedEvent(event)}
                    onSelectSlot={slotInfo => this.addNewEventAlert(slotInfo)}
                    eventPropGetter={this.eventColors}
                  />
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
        );
    }
}

export default AltaReserva;