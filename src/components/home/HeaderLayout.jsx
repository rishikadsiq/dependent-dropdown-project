import React from "react";
import NavbarComponent from "./NavbarComponent";
import { Container } from "react-bootstrap";
const HeaderLayout = (props) => {
  return (

    <div style={{ backgroundColor: '#eaf4f4', minHeight:'100vh',height:"auto" }} >
      {/* Your code here */}
      <NavbarComponent />
      <div className="container d-flex" >
        {/* <Sidebar /> */}
        <Container className="flex-grow-1 p-3" >
          {props.children}
        </Container>
      </div>

    </div>
  );
};

export default HeaderLayout;