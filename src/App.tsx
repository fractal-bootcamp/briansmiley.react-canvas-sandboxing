import { useState } from "react";
import CalligraphyBrushSelector from "./components/BrushSelector";
import CalligraphyCanvas, {
  CalligraphyCanvasProps
} from "./components/MultiBrushCanvas";

function App() {
  const [currentBrush, setCurrentBrush] = useState("ink");

  const calligraphyCanvasProps: CalligraphyCanvasProps = {
    activeColor: "black",
    backgroundStyle: "blank",
    canvasClearSwitch: false,
    canvasUndoSwitch: false,
    currentBrush: currentBrush
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <CalligraphyBrushSelector
          currentBrush={currentBrush}
          setCurrentBrush={setCurrentBrush}
        />
        <CalligraphyCanvas {...calligraphyCanvasProps} />
        {/* <KonvaCanvas/> */}
      </div>
    </>
  );
}

export default App;
