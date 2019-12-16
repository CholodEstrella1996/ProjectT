import React, { Component } from "react";
import Firebase from "firebase";
import {Redirect} from "react-router-dom"
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  FormGroup,
  FormControl,
  InputGroup
} from "react-bootstrap";

class HeaderLinks extends Component {

    constructor(){
        super();
        this.state={
            redirect: false
        };
        this.logout = this.logout.bind(this);
    }

    setRedirect = () => {
        Firebase.auth().signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('mail');
        this.setState({
            redirect: true
        })
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    };

    logout() {
        Firebase.auth().signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('mail');
    };

    render() {
    return (
      <div>
        <Nav pullRight>
          {/*<NavItem eventKey={3} href="#">*/}
            {/*<i className="fa fa-line-chart" />*/}
            {/*<p>Stats</p>*/}
          {/*</NavItem>*/}
          {/*<NavDropdown*/}
            {/*eventKey={2}*/}
            {/*title={*/}
              {/*<div>*/}
                {/*<i className="fa fa-gavel" />*/}
                {/*<p className="hidden-md hidden-lg">*/}
                  {/*Actions*/}
                  {/*<b className="caret" />*/}
                {/*</p>*/}
              {/*</div>*/}
            {/*}*/}
            {/*noCaret*/}
            {/*id="basic-nav-dropdown-1"*/}
          {/*>*/}
            {/*<MenuItem eventKey={2.1}>Create New Post</MenuItem>*/}
            {/*<MenuItem eventKey={2.2}>Manage Something</MenuItem>*/}
            {/*<MenuItem eventKey={2.3}>Do Nothing</MenuItem>*/}
            {/*<MenuItem eventKey={2.4}>Submit to live</MenuItem>*/}
            {/*<MenuItem divider />*/}
            {/*<MenuItem eventKey={2.5}>Another action</MenuItem>*/}
          {/*</NavDropdown>*/}
          {/*<NavDropdown*/}
            {/*eventKey={3}*/}
            {/*title={*/}
              {/*<div>*/}
                {/*<i className="fa fa-bell-o" />*/}
                {/*<span className="notification">5</span>*/}
                {/*<p className="hidden-md hidden-lg">*/}
                  {/*Notifications*/}
                  {/*<b className="caret" />*/}
                {/*</p>*/}
              {/*</div>*/}
            {/*}*/}
            {/*noCaret*/}
            {/*id="basic-nav-dropdown-2"*/}
          {/*>*/}
            {/*<MenuItem eventKey={3.1}>Notification 1</MenuItem>*/}
            {/*<MenuItem eventKey={3.2}>Notification 2</MenuItem>*/}
            {/*<MenuItem eventKey={3.3}>Notification 3</MenuItem>*/}
            {/*<MenuItem eventKey={3.4}>Notification 4</MenuItem>*/}
            {/*<MenuItem eventKey={3.5}>Another notifications</MenuItem>*/}
          {/*</NavDropdown>*/}
          <NavDropdown
            eventKey={4}
            title={
              <div>
                <i className="fa fa-list" />
                <p className="hidden-md hidden-lg">
                  More
                  <b className="caret" />
                </p>
              </div>
            }
            noCaret
            id="basic-nav-dropdown-3"
            bsClass="dropdown-with-icons dropdown"
          >
            <MenuItem eventKey={4.1}>
              <i className="pe-7s-mail" /> Mi Perfil
            </MenuItem>
            <MenuItem eventKey={4.2}>
              <i className="pe-7s-help1" /> Editar Perfil
            </MenuItem>
            <MenuItem eventKey={4.3}>
              <i className="pe-7s-tools" /> Configuraciones
            </MenuItem>
            <MenuItem divider />
              {this.renderRedirect()}
            <MenuItem eventKey={4.5} onClick={this.setRedirect}>
              <div className="text-danger">
                <i className="pe-7s-close-circle" /> Log out
              </div>
            </MenuItem>
          </NavDropdown>
        </Nav>
      </div>
    );
  }
}
export default HeaderLinks;