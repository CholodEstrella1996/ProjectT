
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
// this is used to create scrollbars on windows devices like the ones from apple devices
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// react component that creates notifications (like some alerts with messages)
import NotificationSystem from "react-notification-system";

import Sidebar from "components/Sidebar/Sidebar.jsx";
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";

// dinamically create dashboard routes
import routes from "routes.js";

// style for notifications
import { style } from "variables/Variables.jsx";

import image from "../assets/img/sidebar-2.jpg";

var ps;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      navbar: false,
      mini: false,
      fixedClasses: "dropdown",
      usuario: ""
    };
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleColorClick = this.handleColorClick.bind(this);
    this.handleHasImage = this.handleHasImage.bind(this);
    this.handleNavbarClick = this.handleNavbarClick.bind(this);
    this.handleMiniClick = this.handleMiniClick.bind(this);
    this.handleFixedClick = this.handleFixedClick.bind(this);

    
    if(localStorage.getItem('tipoUsuario') === 'Root'){
      this.state.usuario = '/root'
    } else if(localStorage.getItem('tipoUsuario') === 'Administrador'){
      this.state.usuario = '/admin'
    } else if(localStorage.getItem('tipoUsuario') === 'Encargado'){
      this.state.usuario = '/encargado'
    } else if(localStorage.getItem('tipoUsuario') === 'Propietario'){
      this.state.usuario = '/propietario'
    }
  }
  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  componentDidUpdate(e) {
    if (navigator.platform.indexOf("Win") > -1) {
      setTimeout(() => {
        ps.update();
      }, 350);
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
    if (
      window.innerWidth < 993 &&
      e.history.action === "PUSH" &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  componentWillMount() {
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  // function that shows/hides notifications - it was put here, because the wrapper div has to be outside the main-panel class div
  handleNotificationClick = position => {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
          every web developer.
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleNavbarClick = navbar => {
    this.setState({ navbar: navbar });
  };
  handleMiniClick = () => {
    this.setState({ mini: !this.state.mini });
    document.body.classList.toggle("sidebar-mini");
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show-dropdown open" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }

      if (prop.layout === this.state.usuario) {
        return (
          <Route
            path={prop.layout + prop.path}
            key={key}
            render={routeProps => (
              <prop.component
                {...routeProps}
                handleClick={this.handleNotificationClick}
              />
            )}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage}
          mini={this.state.mini}
          layoutUser = { this.state.usuario }
        />
        <div
          className={
            "main-panel" +
            (this.props.location.pathname === "/maps/full-screen-maps"
              ? " main-panel-maps"
              : "")
          }
          ref="mainPanel"
        >
          <AdminNavbar
            {...this.props}
            handleMiniClick={this.handleMiniClick}
            navbar={this.state.navbar}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          {/* <Footer fluid/> */}
          {/*<FixedPlugin*/}
            {/*handleImageClick={this.handleImageClick}*/}
            {/*handleColorClick={this.handleColorClick}*/}
            {/*handleHasImage={this.handleHasImage}*/}
            {/*handleNavbarClick={this.handleNavbarClick}*/}
            {/*handleMiniClick={this.handleMiniClick}*/}
            {/*bgColor={this.state["color"]}*/}
            {/*bgImage={this.state["image"]}*/}
            {/*mini={this.state["mini"]}*/}
            {/*handleFixedClick={this.handleFixedClick}*/}
            {/*fixedClasses={this.state.fixedClasses}*/}
          {/*/>*/}
        </div>
      </div>
    );
  }
}

export default Dashboard;
