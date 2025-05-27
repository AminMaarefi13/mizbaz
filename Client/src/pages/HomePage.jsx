import ShipStatusBar from "../components/GameStatus/ShipStatusBar";
import CrewRolesDisplay from "../components/GameStatus/CrewRolesDisplay";
import PhaseIndicator from "../components/GameStatus/PhaseIndicator";
import CabinetUI from "../components/GameStatus/CabinetUI";

const HomePage = () => {
  const isCaptain = false;

  const onConfirmCabinet = (cabinet) => {
    console.log("✅ کابینه تأیید شد:", cabinet);
  };

  return (
    <div className="space-y-4">
      <ShipStatusBar />
      <PhaseIndicator />
      {/* <pre>{JSON.stringify(setup, null, 2)}</pre> */}
      <CabinetUI isCaptain={isCaptain} onConfirmCabinet={onConfirmCabinet} />
    </div>
  );
};

export default HomePage;
