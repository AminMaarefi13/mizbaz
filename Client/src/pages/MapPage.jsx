import { journeyMapNodes, JOURNEY_TYPES } from "../config/journeyMapNodes";
import { quickJourneyLayout, longJourneyLayout } from "../config/journeyLayout";
import { useGameContext } from "../context/GameContext";
import Hexagon from "./Hexagon";

const MapPage = () => {
  const { gameState } = useGameContext();
  const { journeyType, mapPosition } = gameState;
  // انتخاب نوع نقشه (کوییک یا لانگ)
  // const [journeyType, setJourneyType] = useState(JOURNEY_TYPES.QUICK);

  // انتخاب نودهای نقشه و تصویر پس‌زمینه بر اساس نوع نقشه
  const nodes = journeyMapNodes[journeyType];
  const layout =
    journeyType === JOURNEY_TYPES.QUICK
      ? quickJourneyLayout
      : longJourneyLayout;
  const mapBackground =
    journeyType === JOURNEY_TYPES.QUICK
      ? "/quick-map-bg.png"
      : "/long-map-bg.png";

  // موقعیت کشتی (مثال برای تست)
  const shipPosition = layout[mapPosition]; // می‌توان این را به‌طور داینامیک تنظیم کرد
  // const shipPosition = layout[mapPosition]; // می‌توان این را به‌طور داینامیک تنظیم کرد

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <div className="relative w-full max-w-[1000px] aspect-[1/1]">
        {/* <div className="relative w-[500px] h-[500px]"> */}
        {/* تصویر پس‌زمینه - کشیده نشه، دقیق قرار بگیره */}
        <img
          src={mapBackground}
          alt="Map Background"
          className="absolute w-full h-full object-cover"
        />

        {/* نودها با مختصات درصدی نسبت به تصویر */}
        {Object.entries(nodes).map(([id]) => {
          const pos = layout[id];
          if (!pos) return null;

          return (
            <div
              key={id}
              className="absolute w-3 h-3 rounded-full bg-blue-300 text-blue-900  text-[0.55em] font-semibold flex items-center justify-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              {id}
            </div>
          );
        })}

        {/* کشتی با موقعیت و چرخش */}
        {/* {shipPosition && (
          <div
            className="absolute"
            style={{
              width: "20%",
              height: "20%",
              left: `${shipPosition.x}%`,
              top: `${shipPosition.y}%`,
              transform: `translate(-50%, -50%) rotate(${
                shipPosition.rotate || 0
              }deg)`, // چرخش کشتی
              zIndex: 20,
            }}
          >
            <img
              src="/ship.png" // این آدرس تصویر کشتی است
              alt="Ship"
              className="w-full h-full object-contain"
            />
            <Hexagon size={10} glowColor="#00ffff" />
          </div>
        )} */}
        {shipPosition && (
          <div
            className="absolute"
            style={{
              width: "20%",
              height: "20%",
              left: `${shipPosition.x}%`,
              top: `${shipPosition.y}%`,
              transform: `translate(-50%, -50%) rotate(${
                shipPosition.rotate || 0
              }deg)`,
              zIndex: 20,
            }}
          >
            <div className="relative w-full h-full">
              <img
                src="/ship.png"
                alt="Ship"
                className="absolute w-full h-full object-contain"
                style={{ top: 0, left: 0 }}
              />
              <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center"></div>
            </div>
          </div>
        )}
        {shipPosition && (
          <div
            className="absolute"
            style={{
              width: "20%",
              height: "20%",
              left: `${shipPosition.x}%`,
              top: `${shipPosition.y}%`,
              transform: `translate(-50%, -50%)`,
              zIndex: 18,
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center">
                <Hexagon />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* دکمه تغییر نقشه */}
      {/* <div className="absolute top-5 right-5">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() =>
            setJourneyType((prevType) =>
              prevType === JOURNEY_TYPES.QUICK
                ? JOURNEY_TYPES.LONG
                : JOURNEY_TYPES.QUICK
            )
          }
        >
          Change Map Type
        </button>
      </div> */}
    </div>
  );
};

export default MapPage;
