import React from "react";
import TopNavbar from "../components/Logonav";
import BottomMenu from "../components/tpmenu";

export default function MainNavbar() {
  return (
    <>
      <TopNavbar />
      <BottomMenu />

      {/* Gap so content does not go behind navbars */}
      {/* <div style={{ height: "110px" }}></div> */}
    </>
  );
}
