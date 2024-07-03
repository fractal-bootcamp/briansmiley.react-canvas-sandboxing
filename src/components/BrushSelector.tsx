import brush1 from "../assets/brushes/brush1.png";
import spray from "../assets/brushes/spray.png";
import lines from "../assets/brushes/lines.png";
import streak from "../assets/brushes/streak.png";
import ink from "../assets/brushes/ink.png";
const brushOptions: Record<string, string> = {
  streak: streak,
  lines: lines,
  ink: ink,
  brush1: brush1,
  spray: spray
};
type CalligraphyBrush = keyof typeof brushOptions;
interface CalligraphyBrushSelectorProps {
  currentBrush: CalligraphyBrush;
  setCurrentBrush: (brush: CalligraphyBrush) => void;
}
const CalligraphyBrushSelector = (props: CalligraphyBrushSelectorProps) => {
  return (
    <div className="flex flex-1 flex-row gap-3 justify-start border-2 p-2 rounded-md bg-[#fbfbfb] overflow-x-auto">
      {Object.entries(brushOptions).map(([brush, imgPath]) => (
        <img
          key={brush}
          src={imgPath}
          className={`border-[#d903ff] object-cover rounded-lg h-[125px] ${
            props.currentBrush === brush ? "border-2" : "border-0"
          } `}
          onClick={() => props.setCurrentBrush(brush)}
          alt={`Brush selector: ${brush}`}
        />
      ))}
    </div>
  );
};

export default CalligraphyBrushSelector;
