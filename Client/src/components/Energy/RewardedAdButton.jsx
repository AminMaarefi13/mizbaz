import React, { useState } from "react";
import { useGameContext } from "../../context/GameContext";

export default function RewardedAdButton({ disabled }) {
  const { energy, rewardEnergy, subscription, adSessionCount } =
    useGameContext();
  const [loading, setLoading] = useState(false);

  const MAX_ADS_PER_SESSION = 5;

  const showAd = () => {
    if (subscription) return;
    if (adSessionCount >= MAX_ADS_PER_SESSION) {
      alert("محدودیت تبلیغ در این جلسه به پایان رسیده است.");
      return;
    }
    setLoading(true);

    // شبیه‌سازی نمایش تبلیغ
    setTimeout(() => {
      rewardEnergy((result) => {
        setLoading(false);
        if (result?.error) {
          alert("محدودیت تبلیغ در این جلسه به پایان رسیده است.");
        }
        // نیازی به setAdSessionCount نیست، چون context خودش مقدار را آپدیت می‌کند
      });
    }, 4000);
  };

  if (subscription) return null;

  return (
    <button
      disabled={
        energy >= 10 ||
        loading ||
        adSessionCount >= MAX_ADS_PER_SESSION ||
        disabled
      }
      onClick={showAd}
      style={{
        opacity:
          energy >= 10 || loading || adSessionCount >= MAX_ADS_PER_SESSION
            ? 0.5
            : 1,
        cursor:
          energy >= 10 || loading || adSessionCount >= MAX_ADS_PER_SESSION
            ? "not-allowed"
            : "pointer",
        marginTop: 8,
      }}
    >
      {loading ? "در حال نمایش تبلیغ..." : "دریافت انرژی با تماشای تبلیغ"}
    </button>
  );
}
// import React, { useState } from "react";
// import { useGameContext } from "../../context/GameContext";

// export default function RewardedAdButton({ disabled }) {
//   const {
//     energy,
//     rewardEnergy,
//     subscription,
//     adSessionCount,
//     setAdSessionCount,
//   } = useGameContext();
//   const [loading, setLoading] = useState(false);

//   const MAX_ADS_PER_SESSION = 5;

//   const showAd = () => {
//     if (subscription) return;
//     if (adSessionCount >= MAX_ADS_PER_SESSION) {
//       alert("محدودیت تبلیغ در این جلسه به پایان رسیده است.");
//       return;
//     }
//     setLoading(true);

//     // شبیه‌سازی نمایش تبلیغ
//     setTimeout(() => {
//       // فرض: کاربر تبلیغ را کامل دیده
//       //   rewardEnergy(); // انرژی را از سرور بگیر و ست کن
//       //   setLoading(false);
//       //   setAdSessionCount(adSessionCount + 1);
//       rewardEnergy((result) => {
//         setLoading(false);
//         if (result?.error) {
//           alert("محدودیت تبلیغ در این جلسه به پایان رسیده است.");
//         }
//         if (typeof result?.adSessionCount === "number") {
//           setAdSessionCount(result.adSessionCount);
//         }
//       });
//     }, 4000);
//   };

//   if (subscription) return null;

//   return (
//     <button
//       disabled={
//         energy >= 10 ||
//         loading ||
//         adSessionCount >= MAX_ADS_PER_SESSION ||
//         disabled
//       }
//       onClick={showAd}
//       style={{
//         opacity:
//           energy >= 10 || loading || adSessionCount >= MAX_ADS_PER_SESSION
//             ? 0.5
//             : 1,
//         cursor:
//           energy >= 10 || loading || adSessionCount >= MAX_ADS_PER_SESSION
//             ? "not-allowed"
//             : "pointer",
//         marginTop: 8,
//       }}
//     >
//       {adSessionCount}
//       {loading ? "در حال نمایش تبلیغ..." : "دریافت انرژی با تماشای تبلیغ"}
//     </button>
//   );
// }

// // import React, { useState } from "react";
// // import { useGameContext } from "../context/GameContext";

// // export default function RewardedAdButton({ disabled }) {
// //   const { energy, updateEnergy, subscription } = useGameContext();
// //   const [loading, setLoading] = useState(false);
// //   const [adShown, setAdShown] = useState(false);
// //   const [adSessionCount, setAdSessionCount] = useState(0);

// //   // محدودیت نمایش تبلیغ در هر session
// //   const MAX_ADS_PER_SESSION = 5;

// //   const showAd = () => {
// //     if (subscription) return;
// //     if (adSessionCount >= MAX_ADS_PER_SESSION) {
// //       alert("محدودیت تبلیغ در این جلسه به پایان رسیده است.");
// //       return;
// //     }
// //     setLoading(true);
// //     setAdShown(true);

// //     // شبیه‌سازی نمایش تبلیغ
// //     setTimeout(() => {
// //       // فرض: کاربر تبلیغ را کامل دیده
// //       window.dispatchEvent(new CustomEvent("onUserEarnedReward"));
// //       setLoading(false);
// //       setAdSessionCount(adSessionCount + 1);
// //       setAdShown(false);
// //     }, 4000); // 4 ثانیه تبلیغ فرضی
// //   };

// //   // هندل رویداد پاداش
// //   React.useEffect(() => {
// //     const onReward = () => {
// //       if (energy < 10) {
// //         updateEnergy(energy + 1);
// //         alert("🎉 انرژی شما افزایش یافت!");
// //       }
// //     };
// //     window.addEventListener("onUserEarnedReward", onReward);
// //     return () => window.removeEventListener("onUserEarnedReward", onReward);
// //   }, [energy, updateEnergy]);

// //   if (subscription) return null;

// //   return (
// //     <button
// //       disabled={
// //         energy >= 10 ||
// //         loading ||
// //         adSessionCount >= MAX_ADS_PER_SESSION ||
// //         disabled
// //       }
// //       onClick={showAd}
// //       style={{
// //         opacity:
// //           energy >= 10 || loading || adSessionCount >= MAX_ADS_PER_SESSION
// //             ? 0.5
// //             : 1,
// //         cursor:
// //           energy >= 10 || loading || adSessionCount >= MAX_ADS_PER_SESSION
// //             ? "not-allowed"
// //             : "pointer",
// //         marginTop: 8,
// //       }}
// //     >
// //       {loading ? "در حال نمایش تبلیغ..." : "دریافت انرژی با تماشای تبلیغ"}
// //     </button>
// //   );
// // }
