import { useState } from "react";
import CalligraphyBrushSelector from "./components/BrushSelector";
import MultiBrushCanvas, {
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
        <div className="flex justify-between w-full items-center">
          <div className="w-[150px]"> </div>
          <div className="w-fit">
            <CalligraphyBrushSelector
              currentBrush={currentBrush}
              setCurrentBrush={setCurrentBrush}
            />
          </div>
          <div className="w-[150px] m-2">C: Clear U: Undo</div>
        </div>
        <MultiBrushCanvas {...calligraphyCanvasProps} />
        {/* <KonvaCanvas/> */}
      </div>
    </>
  );
}

export default App;
