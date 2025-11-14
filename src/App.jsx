import React from 'react'
import M from './components/header'
import A from './components/prac'

function App() {
  return (
    <>
      <M />

      {/* Wrapper to center all cards */}
      <div
        className="d-flex flex-column align-items-center"
        style={{
          width: "100%",
          marginTop: "20px",
          gap: "16px",
        }}
      >
        <A />
        <A />
        <A />
        <A />
        <A />
        <A />
        <A />
        <A />
        <A />
      </div>
    </>
  );
}

export default App;
