import React from "react";
import TopNavbar from "./Logonav";
import BottomMenu from "./tpmenu";

export default function MainNavbar() {
  return (
    <>
      <TopNavbar />
      <BottomMenu />
      {/* Spacer to prevent overlap */}
      <div style={{ height: "110px" }}></div>
    </>
  );
}
