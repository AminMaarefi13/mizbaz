import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

export default function RewardedAdButton({ disabled }) {
  const { energy, rewardEnergy, subscription, adSessionCount } =
    useAppContext();
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
