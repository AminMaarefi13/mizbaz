import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { cn } from "../utils/cn";
import CabinetSelectionPanel from "../Panels/CabinetSelectionPanel";
import GunVotingPanel from "../Panels/GunVotingPanel";
import VoteTieBreakPanel from "../Panels/VoteTieBreakPanel";
import NavigationCardChoicePanel from "../Panels/NavigationCardChoicePanel";
import LocationEffectPanel from "../Panels/LocationEffectPanel";
import FloggingChoicePanel from "../Panels/FloggingChoicePanel";
import CultRitualChoicePanel from "../Panels/CultRitualChoicePanel";
import MermaidOrTelescopePanel from "../Panels/MermaidOrTelescopePanel";
import TelescopeCardDecisionPanel from "../Panels/TelescopeCardDecisionPanel";
import MermaidCardsViewPanel from "../Panels/MermaidCardsViewPanel";
import CultConversionPanel from "../Panels/CultConversionPanel";
import CultCabinSearchResultPanel from "../Panels/CultCabinSearchResultPanel";
import CultGunsDistributionPanel from "../Panels/CultGunDirstibutionPanel";
import PhaseInfoPanel from "../Panels/PhaseInfoPanel";
import PrivatePhaseInfoPanel from "../Panels/PrivatePhaseInfoPanel";
import ProgressBar from "../UI/ProgressBar";
import EnergyBar from "../components/Energy/EnergyBar";
import RewardedAdButton from "../components/Energy/RewardedAdButton";
import { feedTheKrakenInitialState } from "../context/feedTheKrakenInitialState";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";

export default function FeedTheKrakenPage() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameContext();
  const {
    userState,
    setUserState,
    connectionState,
    setConnectionState,
    energy,
    setEnergy,
    subscription,
  } = useAppContext();

  useEffect(() => {
    // اگر state بازی ست نشده بود، مقدار اولیه را ست کن
    if (!gameState || gameState.type !== "feedTheKraken") {
      setGameState(feedTheKrakenInitialState);
    }
  }, [gameState, gameState.type, setGameState]);

  const {
    journeyType,
    mapPosition,
    currentPhase,
    players,
    captainId,
    firstOfficerId,
    navigatorId,
    logs,
    currentVoteSessionId,
    phaseData,
  } = gameState;

  const { role, knownRoles, eliminated, characterCard, privatePhaseData } =
    userState;
  const { playerId, currentRoomId, currentGameId } = connectionState;
  // ⛵ جلوگیری از ورود بدون انتخاب بازی
  useEffect(() => {
    if (!currentGameId) {
      alert("لطفاً ابتدا یک بازی را انتخاب کنید.");
      navigate("/lobby");
      return;
    }

    if (currentRoomId && playerId && currentGameId) {
      // socket.emit("join_game", {
      //   gameId: currentGameId,
      //   roomId: currentRoomId,
      //   playerId,
      // });
      console.log("درخواست وضعیت بازی برای:", currentGameId);
      socket.emit(
        "request_game_state",
        currentGameId,
        (gameStateFromServer) => {
          console.log("📥 وضعیت بازی دریافتی:", gameStateFromServer);
          console.log(gameStateFromServer.publicState);
          console.log(gameStateFromServer.privateState);
          if (gameStateFromServer) {
            setGameState(gameStateFromServer.publicState);
            setUserState((prev) => ({
              ...prev,
              ...gameStateFromServer.privateState,
            }));
            setConnectionState((prev) => ({
              ...prev,
              currentRoomId: gameStateFromServer.publicState.roomId,
              currentGameId: gameStateFromServer.publicState.gameId,
            }));
            localStorage.setItem(
              "currentGameId",
              gameStateFromServer.publicState.gameId
            );
            // navigate("/game");
          } else {
            alert("❌ دریافت اطلاعات بازی ممکن نشد.");
          }
        }
      );
    }
  }, [currentRoomId, currentGameId, playerId, navigate]);
  // نمایش مناسب هنگام عدم دریافت اطلاعات یا ورود زودهنگام
  if (!currentGameId || !players || players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        لطفاً ابتدا یک بازی را از لابی انتخاب کنید.
      </div>
    );
  }
  // ...existing code...
  return (
    <div>
      <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen text-gray-800 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          🧭 سفر در حال جریان: {journeyType}
        </h1>
        <div className="bg-white shadow rounded-md p-2 sm:p-4 mb-4 sm:mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">وضعیت کشتی</h2>
          <p>📍 موقعیت نقشه: {mapPosition}</p>
          <p>🧩 فاز فعلی: {currentPhase}</p>
        </div>
        <EnergyBar />
        {!subscription && energy < 1 && <RewardedAdButton />}
        <button
          onClick={() => {
            const amount = 1;
            socket.emit("consume_energy", { amount }, (data) => {
              if (typeof data.energy === "number") setEnergy(data.energy);
            });
          }}
        >
          کاهش انرژی (تست)
        </button>
        {phaseData?.total &&
          phaseData?.current &&
          typeof phaseData.current === "number" &&
          typeof phaseData.total === "number" &&
          phaseData.total > 0 && (
            <ProgressBar current={phaseData.current} total={phaseData.total} />
          )}
        {privatePhaseData?.message && <PrivatePhaseInfoPanel />}
        {phaseData?.title && <PhaseInfoPanel />}
        {currentPhase === "cabinet_formation" &&
          captainId === playerId &&
          privatePhaseData?.selectablePlayers && <CabinetSelectionPanel />}
        {currentPhase === "start_voting" &&
          !eliminated &&
          playerId !== captainId && (
            <GunVotingPanel key={currentVoteSessionId} />
          )}
        {
          // currentPhase === "vote_tie_break_start" &&
          privatePhaseData?.eliminatorId === playerId &&
            privatePhaseData?.tiedPlayers && <VoteTieBreakPanel />
        }
        {currentPhase === "navigation_cards_draw" &&
          privatePhaseData?.cards &&
          (playerId === captainId || playerId === firstOfficerId) && (
            <NavigationCardChoicePanel />
          )}
        {currentPhase === "navigator_choose_card" &&
          privatePhaseData?.cards &&
          playerId === navigatorId && <NavigationCardChoicePanel />}
        {(currentPhase === "cabin_search" ||
          currentPhase === "feed_the_kraken" ||
          currentPhase === "off_with_tongue" ||
          currentPhase === "flogging") &&
          playerId === captainId &&
          privatePhaseData?.selectablePlayers && (
            <LocationEffectPanel className="mb-4 sm:mb-6 p-2 sm:p-4 border border-yellow-500 rounded-md bg-yellow-50 shadow" />
          )}
        {currentPhase === "select_flogging_card" &&
          playerId === captainId &&
          privatePhaseData?.options && <FloggingChoicePanel />}
        {(currentPhase === "telescope" || currentPhase === "mermaid") &&
          playerId === captainId && <MermaidOrTelescopePanel />}
        {privatePhaseData?.type === "telescope_choice" && (
          <TelescopeCardDecisionPanel />
        )}
        {privatePhaseData?.type === "mermaid_choice" && (
          <MermaidCardsViewPanel />
        )}
        {currentPhase === "cult_uprising" && playerId === captainId && (
          <CultRitualChoicePanel />
        )}
        {currentPhase === "cult_guns_stash_choice" &&
          playerId === privatePhaseData.cultLeaderId && (
            <CultGunsDistributionPanel />
          )}
        {currentPhase === "cult_cabin_search_result" &&
          playerId === privatePhaseData.cultLeaderId && (
            <CultCabinSearchResultPanel />
          )}
        {currentPhase === "cult_conversion_choice" &&
          playerId === privatePhaseData.cultLeaderId && <CultConversionPanel />}
        {currentPhase === "cult_ritual_resolved" &&
          privatePhaseData?.type === "cult_info" && (
            <div className="mb-4 sm:mb-6 p-2 sm:p-4 border border-yellow-500 rounded-md bg-yellow-50 shadow">
              {privatePhaseData?.text}
            </div>
          )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full">
          <div className="bg-white shadow rounded-md p-2 sm:p-4 w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              👥 بازیکنان
            </h2>
            <ul className="space-y-2">
              {[...players]
                .sort((a, b) => a.seat - b.seat)
                .map((p) => (
                  <li
                    key={p.id}
                    className={cn(
                      "p-2 rounded-md border",
                      p.id === playerId && "border-green-600 bg-green-50"
                    )}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">
                      صندلی #{p.seat + 1}
                      {p.id === captainId && " | 🎖️ کاپیتان"}
                      {p.id === firstOfficerId && " | 👨‍✈️ افسر اول"}
                      {p.id === navigatorId && " | 🧭 کشتیران"}
                      {(() => {
                        const known = knownRoles.find(
                          (k) => k.playerId === p.id
                        );
                        return known ? ` | 🎭 ${known.role}` : null;
                      })()}
                      {p.isNotARole && ` | نیست ${p.isNotARole}`}
                      {p.guns > 0 && (
                        <div className="inline ml-2 text-red-500">
                          {Array(p.guns).fill("🔫").join("")}
                        </div>
                      )}
                      {p.resume.length > 0 && (
                        <div className="inline ml-2 text-red-500">
                          {Array(p.resume.length).fill("🃏").join("")}
                        </div>
                      )}
                      {p.eliminated && " | ❌ از بازی حذف شد."}
                      {p.tongueOff && " | 👅 زبانش بریده شده"}
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-md p-2 sm:p-4 w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              🕵️ اطلاعات مخفی شما
            </h2>
            <p>
              <strong>نقش من:</strong>{" "}
              <span className="text-indigo-700">{role}</span>
            </p>
            {characterCard && (
              <p className="mt-2">
                <strong>کارت‌ شخصیت:</strong> {characterCard}
              </p>
            )}
          </div>
        </div>
        <div className="bg-white shadow rounded-md p-2 sm:p-4 w-full">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">📜 وقایع</h2>
          <ul className="space-y-1 text-sm text-gray-700">
            {[...logs].reverse().map((log, idx) => (
              <li key={idx}>• {log.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  // ...existing code...
  // return (
  //   <div>
  //     <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen text-gray-800">
  //       <h1 className="text-3xl font-bold mb-4">
  //         🧭 سفر در حال جریان: {journeyType}
  //       </h1>
  //       <div className="bg-white shadow rounded p-4 mb-6">
  //         <h2 className="text-xl font-semibold mb-2">وضعیت کشتی</h2>
  //         <p>📍 موقعیت نقشه: {mapPosition}</p>
  //         <p>🧩 فاز فعلی: {currentPhase}</p>
  //       </div>
  //       <EnergyBar />
  //       {!subscription && energy < 1 && <RewardedAdButton />}
  //       <button
  //         onClick={() => {
  //           const amount = 1;
  //           socket.emit("consume_energy", { amount }, (data) => {
  //             if (typeof data.energy === "number") setEnergy(data.energy);
  //           });
  //         }}
  //       >
  //         کاهش انرژی (تست)
  //       </button>
  //       {phaseData?.total &&
  //         phaseData?.current &&
  //         typeof phaseData.current === "number" &&
  //         typeof phaseData.total === "number" &&
  //         phaseData.total > 0 && (
  //           <ProgressBar current={phaseData.current} total={phaseData.total} />
  //         )}
  //       {privatePhaseData?.message && <PrivatePhaseInfoPanel />}
  //       {phaseData?.title && <PhaseInfoPanel />}
  //       {currentPhase === "cabinet_formation" &&
  //         captainId === playerId &&
  //         privatePhaseData?.selectablePlayers && <CabinetSelectionPanel />}
  //       {currentPhase === "start_voting" &&
  //         !eliminated &&
  //         playerId !== captainId && (
  //           <GunVotingPanel key={currentVoteSessionId} />
  //         )}
  //       {
  //         // currentPhase === "vote_tie_break_start" &&
  //         privatePhaseData?.eliminatorId === playerId &&
  //           privatePhaseData?.tiedPlayers && <VoteTieBreakPanel />
  //       }
  //       {currentPhase === "navigation_cards_draw" &&
  //         privatePhaseData?.cards &&
  //         (playerId === captainId || playerId === firstOfficerId) && (
  //           <NavigationCardChoicePanel />
  //         )}
  //       {currentPhase === "navigator_choose_card" &&
  //         privatePhaseData?.cards &&
  //         playerId === navigatorId && <NavigationCardChoicePanel />}
  //       {(currentPhase === "cabin_search" ||
  //         currentPhase === "feed_the_kraken" ||
  //         currentPhase === "off_with_tongue" ||
  //         currentPhase === "flogging") &&
  //         playerId === captainId &&
  //         privatePhaseData?.selectablePlayers && (
  //           <LocationEffectPanel className="mb-6 p-4 border border-yellow-500 rounded bg-yellow-50 shadow" />
  //         )}
  //       {currentPhase === "select_flogging_card" &&
  //         playerId === captainId &&
  //         privatePhaseData?.options && <FloggingChoicePanel />}
  //       {(currentPhase === "telescope" || currentPhase === "mermaid") &&
  //         playerId === captainId && <MermaidOrTelescopePanel />}
  //       {privatePhaseData?.type === "telescope_choice" && (
  //         <TelescopeCardDecisionPanel />
  //       )}
  //       {privatePhaseData?.type === "mermaid_choice" && (
  //         <MermaidCardsViewPanel />
  //       )}
  //       {currentPhase === "cult_uprising" && playerId === captainId && (
  //         <CultRitualChoicePanel />
  //       )}
  //       {currentPhase === "cult_guns_stash_choice" &&
  //         playerId === privatePhaseData.cultLeaderId && (
  //           <CultGunsDistributionPanel />
  //         )}
  //       {currentPhase === "cult_cabin_search_result" &&
  //         playerId === privatePhaseData.cultLeaderId && (
  //           <CultCabinSearchResultPanel />
  //         )}
  //       {currentPhase === "cult_conversion_choice" &&
  //         playerId === privatePhaseData.cultLeaderId && <CultConversionPanel />}
  //       {currentPhase === "cult_ritual_resolved" &&
  //         privatePhaseData?.type === "cult_info" && (
  //           <div className="mb-6 p-4 border border-yellow-500 rounded bg-yellow-50 shadow">
  //             {privatePhaseData?.text}
  //           </div>
  //         )}
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  //         <div className="bg-white shadow rounded p-4">
  //           <h2 className="text-xl font-semibold mb-2">👥 بازیکنان</h2>
  //           <ul className="space-y-2">
  //             {[...players]
  //               .sort((a, b) => a.seat - b.seat)
  //               .map((p) => (
  //                 <li
  //                   key={p.id}
  //                   className={cn(
  //                     "p-2 rounded border",
  //                     p.id === playerId && "border-green-600 bg-green-50"
  //                   )}
  //                 >
  //                   <div className="font-medium">{p.name}</div>
  //                   <div className="text-sm text-gray-600">
  //                     صندلی #{p.seat + 1}
  //                     {p.id === captainId && " | 🎖️ کاپیتان"}
  //                     {p.id === firstOfficerId && " | 👨‍✈️ افسر اول"}
  //                     {p.id === navigatorId && " | 🧭 کشتیران"}
  //                     {(() => {
  //                       const known = knownRoles.find(
  //                         (k) => k.playerId === p.id
  //                       );
  //                       // console.log(p);
  //                       return known ? ` | 🎭 ${known.role}` : null;
  //                     })()}
  //                     {p.isNotARole && ` | نیست ${p.isNotARole}`}
  //                     {p.guns > 0 && (
  //                       <div className="inline ml-2 text-red-500">
  //                         {Array(p.guns).fill("🔫").join("")}
  //                       </div>
  //                     )}
  //                     {p.resume.length > 0 && (
  //                       <div className="inline ml-2 text-red-500">
  //                         {Array(p.resume.length).fill("🃏").join("")}
  //                       </div>
  //                     )}
  //                     {p.eliminated && " | ❌ از بازی حذف شد."}
  //                     {p.tongueOff && " | 👅 زبانش بریده شده"}
  //                   </div>
  //                 </li>
  //               ))}
  //           </ul>
  //         </div>

  //         <div className="bg-white shadow rounded p-4">
  //           <h2 className="text-xl font-semibold mb-2">🕵️ اطلاعات مخفی شما</h2>
  //           <p>
  //             <strong>نقش من:</strong>{" "}
  //             <span className="text-indigo-700">{role}</span>
  //           </p>
  //           {characterCard && (
  //             <p className="mt-2">
  //               <strong>کارت‌ شخصیت:</strong> {characterCard}
  //             </p>
  //           )}
  //         </div>
  //       </div>
  //       <div className="bg-white shadow rounded p-4">
  //         <h2 className="text-xl font-semibold mb-2">📜 وقایع</h2>
  //         <ul className="space-y-1 text-sm text-gray-700">
  //           {[...logs].reverse().map((log, idx) => (
  //             <li key={idx}>• {log.text}</li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   </div>
  // );
}
