import React, { Component } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

class AvatarErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Avatar 3D render recovered from error:", error, errorInfo);
    // Auto-recover after 500ms
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 500);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#ec4899", textAlign: "center" }}>
          <p>Re-centering Maya 3D Companion...</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const isEmbedded =
    typeof window !== "undefined" &&
    (window.self !== window.top || window.location.search.includes("embedded"));

  return (
    <>
      <Loader />
      <Leva hidden />
      <UI hidden={isEmbedded} />
      <AvatarErrorBoundary>
        <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
          <Experience />
        </Canvas>
      </AvatarErrorBoundary>
    </>
  );
}

export default App;
