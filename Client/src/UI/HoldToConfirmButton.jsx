import React, { useRef, useState, useEffect } from "react";
import "./HoldToConfirmButton.css";

export default function HoldToConfirmButton({
  onConfirm,
  label,
  disabled = false,
}) {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [shaking, setShaking] = useState(false);
  const intervalRef = useRef(null);
  const holdDuration = 30; // میلی‌ثانیه
  const step = 10; // هر 10ms، progress افزایش می‌یابد

  const startHold = () => {
    if (disabled || confirmed) return;

    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += step;
      const percentage = (currentProgress / holdDuration) * 100;
      setProgress(percentage);

      if (currentProgress >= holdDuration) {
        clearInterval(intervalRef.current);
        setConfirmed(true);
        onConfirm?.();
      }
    }, step);
  };

  const cancelHold = () => {
    clearInterval(intervalRef.current);
    if (!confirmed && progress > 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
    setProgress(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className={`
        relative w-full max-w-3xl mx-auto h-14 rounded-xl overflow-hidden shadow-lg select-none
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-800 cursor-pointer"
        }
        ${shaking ? "shake" : ""}
      `}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
    >
      {/* لایه پرشدن */}
      <div
        className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-50 ease-linear"
        style={{ width: `${progress}%` }}
      />

      {/* متن روی دکمه */}
      <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-bold text-lg">
        {confirmed ? "تأیید شد ✅" : label}
      </div>
    </div>
  );
}

// import React, { useRef, useState, useEffect } from "react";
// import "./HoldToConfirmButton.css";

// export default function HoldToConfirmButton({
//   onConfirm,
//   label = "تأیید کابینه",
//   disabled = false,
// }) {
//   const [progress, setProgress] = useState(0);
//   const [confirmed, setConfirmed] = useState(false);
//   const [holding, setHolding] = useState(false);
//   const [shake, setShake] = useState(false);
//   const animationRef = useRef(null);
//   const startTimeRef = useRef(null);
//   const holdDuration = 3000;

//   const animateProgress = (timestamp) => {
//     if (!startTimeRef.current) startTimeRef.current = timestamp;
//     const elapsed = timestamp - startTimeRef.current;
//     const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
//     setProgress(newProgress);

//     if (elapsed >= holdDuration) {
//       setConfirmed(true);
//       setHolding(false);
//       onConfirm?.();
//       cancelHold();
//     } else {
//       animationRef.current = requestAnimationFrame(animateProgress);
//     }
//   };

//   const startHold = () => {
//     if (confirmed || disabled) return;
//     setHolding(true);
//     startTimeRef.current = null;
//     animationRef.current = requestAnimationFrame(animateProgress);
//   };

//   const cancelHold = () => {
//     cancelAnimationFrame(animationRef.current);
//     animationRef.current = null;
//     startTimeRef.current = null;

//     if (!confirmed && progress > 0) {
//       setShake(true);
//       setTimeout(() => setShake(false), 500);
//     }

//     if (!confirmed) setProgress(0);
//     setHolding(false);
//   };

//   useEffect(() => {
//     return () => cancelHold();
//   }, []);

//   return (
//     <div
//       className={`relative w-full max-w-3xl mx-auto h-14 rounded-xl overflow-hidden shadow-lg select-none
//         ${
//           disabled
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-green-800 cursor-pointer"
//         }
//         ${shake ? "shake" : ""}
//       `}
//       onMouseDown={startHold}
//       onMouseUp={cancelHold}
//       onMouseLeave={cancelHold}
//       onTouchStart={startHold}
//       onTouchEnd={cancelHold}
//       onTouchCancel={cancelHold}
//     >
//       {/* progress fill */}
//       <div
//         className="absolute top-0 left-0 h-full bg-green-400 z-0 transition-[width] ease-linear"
//         style={{
//           width: `${progress}%`,
//           transitionDuration: holding ? "100ms" : "0ms",
//         }}
//       />

//       {/* Label */}
//       <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-bold text-lg">
//         {confirmed ? "تأیید شد ✅" : label}
//       </div>
//     </div>
//   );
// }

// // import React, { useRef, useState, useEffect } from "react";
// // import "./HoldToConfirmButton.css"; // برای کلاس‌های CSS خاص مثل shake

// // export default function HoldToConfirmButton({
// //   onConfirm,
// //   label = "تأیید کابینه",
// //   disabled = false,
// // }) {
// //   const [progress, setProgress] = useState(0);
// //   const [confirmed, setConfirmed] = useState(false);
// //   const [holding, setHolding] = useState(false);
// //   const [shake, setShake] = useState(false);
// //   const animationRef = useRef(null);
// //   const startTimeRef = useRef(null);
// //   const holdDuration = 3000;

// //   const animateProgress = (timestamp) => {
// //     if (!startTimeRef.current) startTimeRef.current = timestamp;
// //     const elapsed = timestamp - startTimeRef.current;
// //     const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
// //     setProgress(newProgress);

// //     if (elapsed >= holdDuration) {
// //       setConfirmed(true);
// //       setHolding(false);
// //       onConfirm?.();
// //       cancelHold();
// //     } else {
// //       animationRef.current = requestAnimationFrame(animateProgress);
// //     }
// //   };

// //   const startHold = () => {
// //     if (confirmed || disabled) return;
// //     setHolding(true);
// //     startTimeRef.current = null;
// //     animationRef.current = requestAnimationFrame(animateProgress);
// //   };

// //   const cancelHold = () => {
// //     cancelAnimationFrame(animationRef.current);
// //     animationRef.current = null;
// //     startTimeRef.current = null;

// //     if (!confirmed && progress > 0) {
// //       setShake(true); // لرزش هنگام لغو قبل از تأیید
// //       setTimeout(() => setShake(false), 500);
// //     }

// //     if (!confirmed) setProgress(0);
// //     setHolding(false);
// //   };

// //   useEffect(() => {
// //     return () => cancelHold(); // Cleanup
// //   }, []);

// //   return (
// //     <div
// //       className={`relative w-full max-w-3xl mx-auto h-14 rounded-xl overflow-hidden shadow-lg select-none touch-none
// //         ${
// //           disabled
// //             ? "bg-gray-400 cursor-not-allowed"
// //             : "bg-green-800 cursor-pointer"
// //         }
// //         ${shake ? "shake" : ""}
// //       `}
// //       onMouseDown={startHold}
// //       onMouseUp={cancelHold}
// //       onMouseLeave={cancelHold}
// //       onTouchStart={startHold}
// //       onTouchEnd={cancelHold}
// //       onTouchCancel={cancelHold}
// //     >
// //       {/* Progress fill */}
// //       <div
// //         className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-100 ease-linear z-0"
// //         style={{ width: `${progress}%` }}
// //       />

// //       {/* Spinner / Tick */}
// //       <div className="absolute inset-0 flex items-center justify-center z-10">
// //         {confirmed ? (
// //           <span className="text-white text-xl font-bold">✔️</span>
// //         ) : holding ? (
// //           <svg
// //             className="animate-spin h-6 w-6 text-white opacity-80"
// //             xmlns="http://www.w3.org/2000/svg"
// //             fill="none"
// //             viewBox="0 0 24 24"
// //           >
// //             <circle
// //               className="opacity-25"
// //               cx="12"
// //               cy="12"
// //               r="10"
// //               stroke="currentColor"
// //               strokeWidth="4"
// //             />
// //             <path
// //               className="opacity-75"
// //               fill="currentColor"
// //               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
// //             />
// //           </svg>
// //         ) : null}
// //       </div>

// //       {/* Label */}
// //       <div className="relative z-20 w-full h-full flex items-center justify-center text-white font-semibold text-lg">
// //         {!confirmed && label}
// //       </div>
// //     </div>
// //   );
// // }

// // // import React, { useRef, useState, useEffect } from "react";

// // // export default function HoldToConfirmButton({
// // //   onConfirm,
// // //   label = "تأیید کابینه",
// // // }) {
// // //   const [progress, setProgress] = useState(0);
// // //   const [confirmed, setConfirmed] = useState(false);
// // //   const [holding, setHolding] = useState(false);
// // //   const animationRef = useRef(null);
// // //   const startTimeRef = useRef(null);
// // //   const holdDuration = 3000;

// // //   const animateProgress = (timestamp) => {
// // //     if (!startTimeRef.current) startTimeRef.current = timestamp;
// // //     const elapsed = timestamp - startTimeRef.current;
// // //     const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
// // //     setProgress(newProgress);

// // //     if (elapsed >= holdDuration) {
// // //       setConfirmed(true);
// // //       setHolding(false);
// // //       onConfirm?.();
// // //       cancelHold();
// // //     } else {
// // //       animationRef.current = requestAnimationFrame(animateProgress);
// // //     }
// // //   };

// // //   const startHold = () => {
// // //     if (confirmed) return;
// // //     setHolding(true);
// // //     startTimeRef.current = null;
// // //     animationRef.current = requestAnimationFrame(animateProgress);
// // //   };

// // //   const cancelHold = () => {
// // //     cancelAnimationFrame(animationRef.current);
// // //     animationRef.current = null;
// // //     startTimeRef.current = null;
// // //     if (!confirmed) setProgress(0);
// // //     setHolding(false);
// // //   };

// // //   useEffect(() => {
// // //     return () => cancelHold(); // Cleanup on unmount
// // //   }, []);

// // //   return (
// // //     <div
// // //       className="relative w-full max-w-3xl mx-auto h-14 bg-green-800 rounded-xl overflow-hidden shadow-lg cursor-pointer select-none touch-none"
// // //       onMouseDown={startHold}
// // //       onMouseUp={cancelHold}
// // //       onMouseLeave={cancelHold}
// // //       onTouchStart={startHold}
// // //       onTouchEnd={cancelHold}
// // //       onTouchCancel={cancelHold}
// // //     >
// // //       {/* Progress fill */}
// // //       <div
// // //         className="absolute top-0 left-0 h-full bg-green-400 transition-all"
// // //         style={{ width: `${progress}%` }}
// // //       />

// // //       {/* Spinner یا تیک در وسط دکمه */}
// // //       <div className="absolute inset-0 flex items-center justify-center z-10">
// // //         {confirmed ? (
// // //           <span className="text-white text-xl font-bold">✔️</span>
// // //         ) : holding ? (
// // //           <svg
// // //             className="animate-spin h-6 w-6 text-white opacity-80"
// // //             xmlns="http://www.w3.org/2000/svg"
// // //             fill="none"
// // //             viewBox="0 0 24 24"
// // //           >
// // //             <circle
// // //               className="opacity-25"
// // //               cx="12"
// // //               cy="12"
// // //               r="10"
// // //               stroke="currentColor"
// // //               strokeWidth="4"
// // //             />
// // //             <path
// // //               className="opacity-75"
// // //               fill="currentColor"
// // //               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
// // //             />
// // //           </svg>
// // //         ) : null}
// // //       </div>

// // //       {/* Text */}
// // //       <div className="relative z-0 w-full h-full flex items-center justify-center text-white font-semibold text-lg">
// // //         {!confirmed && label}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // import React, { useRef, useState } from "react";

// // // export default function HoldToConfirmButton({
// // //   onConfirm,
// // //   label = "تأیید کابینه",
// // // }) {
// // //   const [progress, setProgress] = useState(0);
// // //   const intervalRef = useRef(null);
// // //   const holdDuration = 3000; // میلی‌ثانیه
// // //   const step = 5;

// // //   const startHold = () => {
// // //     let currentProgress = 0;

// // //     intervalRef.current = setInterval(() => {
// // //       currentProgress += step;
// // //       setProgress((currentProgress / holdDuration) * 100);

// // //       if (currentProgress >= holdDuration) {
// // //         clearInterval(intervalRef.current);
// // //         onConfirm?.();
// // //       }
// // //     }, step);
// // //   };

// // //   const cancelHold = () => {
// // //     clearInterval(intervalRef.current);
// // //     setProgress(0);
// // //   };

// // //   return (
// // //     <div
// // //       className="relative w-full max-w-3xl mx-auto h-14 bg-green-800 rounded-xl overflow-hidden shadow-lg cursor-pointer select-none"
// // //       onMouseDown={startHold}
// // //       onMouseUp={cancelHold}
// // //       onMouseLeave={cancelHold}
// // //     >
// // //       <div
// // //         className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-50"
// // //         style={{ width: `${progress}%` }}
// // //       />
// // //       <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-semibold text-lg">
// // //         {label}
// // //       </div>
// // //     </div>
// // //   );
// // // }
