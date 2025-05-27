// // // // // // // import React from "react";

// // // // // // // const Hexagon = () => {
// // // // // // //   return (
// // // // // // //     <svg
// // // // // // //       width="200"
// // // // // // //       height="200"
// // // // // // //       viewBox="0 0 100 100"
// // // // // // //       style={{
// // // // // // //         display: "block",
// // // // // // //         margin: "100px auto",
// // // // // // //       }}
// // // // // // //     >
// // // // // // //       <defs>
// // // // // // //         <linearGradient id="glowStroke" x1="0%" y1="0%" x2="100%" y2="100%">
// // // // // // //           <stop offset="0%" stopColor="rgba(0,0,255,0.1)" />
// // // // // // //           <stop offset="50%" stopColor="rgba(0,0,255,1)" />
// // // // // // //           <stop offset="100%" stopColor="rgba(0,0,255,0.1)" />
// // // // // // //         </linearGradient>

// // // // // // //         <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
// // // // // // //           <feGaussianBlur stdDeviation="1.5" result="blur" />
// // // // // // //           <feMerge>
// // // // // // //             <feMergeNode in="blur" />
// // // // // // //             <feMergeNode in="blur" />
// // // // // // //             <feMergeNode in="SourceGraphic" />
// // // // // // //           </feMerge>
// // // // // // //         </filter>
// // // // // // //       </defs>

// // // // // // //       <polygon
// // // // // // //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// // // // // // //         fill="transparent"
// // // // // // //         stroke="url(#glowStroke)"
// // // // // // //         strokeWidth="2"
// // // // // // //         filter="url(#glowFilter)"
// // // // // // //       >
// // // // // // //         <animate
// // // // // // //           attributeName="stroke-dashoffset"
// // // // // // //           from="0"
// // // // // // //           to="100"
// // // // // // //           dur="2s"
// // // // // // //           repeatCount="indefinite"
// // // // // // //         />
// // // // // // //       </polygon>
// // // // // // //     </svg>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default Hexagon;
// // // // // // import React from "react";

// // // // // // const Hexagon = () => {
// // // // // //   return (
// // // // // //     <svg
// // // // // //       width="200"
// // // // // //       height="200"
// // // // // //       viewBox="0 0 100 100"
// // // // // //       style={{
// // // // // //         display: "block",
// // // // // //         margin: "100px auto",
// // // // // //         background: "transparent",
// // // // // //       }}
// // // // // //     >
// // // // // //       <defs>
// // // // // //         {/* گرادیان برای نور آبی */}
// // // // // //         <linearGradient id="glowStroke" x1="0%" y1="0%" x2="100%" y2="100%">
// // // // // //           <stop offset="0%" stopColor="rgba(0, 153, 255, 0.2)" />
// // // // // //           <stop offset="50%" stopColor="rgba(0, 153, 255, 1)" />
// // // // // //           <stop offset="100%" stopColor="rgba(0, 153, 255, 0.2)" />
// // // // // //         </linearGradient>

// // // // // //         {/* فیلتر درخشش */}
// // // // // //         <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
// // // // // //           <feGaussianBlur stdDeviation="2" result="blur" />
// // // // // //           <feMerge>
// // // // // //             <feMergeNode in="blur" />
// // // // // //             <feMergeNode in="SourceGraphic" />
// // // // // //           </feMerge>
// // // // // //         </filter>
// // // // // //       </defs>

// // // // // //       <polygon
// // // // // //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// // // // // //         fill="transparent"
// // // // // //         stroke="url(#glowStroke)"
// // // // // //         strokeWidth="2"
// // // // // //         strokeDasharray="15"
// // // // // //         strokeDashoffset="0"
// // // // // //         filter="url(#glowFilter)"
// // // // // //       >
// // // // // //         <animate
// // // // // //           attributeName="stroke-dashoffset"
// // // // // //           values="0;30"
// // // // // //           dur="2s"
// // // // // //           repeatCount="indefinite"
// // // // // //         />
// // // // // //       </polygon>
// // // // // //     </svg>
// // // // // //   );
// // // // // // };

// // // // // // export default Hexagon;
// // // // // import React from "react";

// // // // // const Hexagon = () => {
// // // // //   return (
// // // // //     <svg
// // // // //       width="200"
// // // // //       height="200"
// // // // //       viewBox="0 0 100 100"
// // // // //       style={{
// // // // //         display: "block",
// // // // //         margin: "100px auto",
// // // // //         background: "transparent",
// // // // //       }}
// // // // //     >
// // // // //       <defs>
// // // // //         {/* گرادیان برای خط نورانی */}
// // // // //         <linearGradient id="glowStroke" x1="0%" y1="0%" x2="100%" y2="100%">
// // // // //           <stop offset="0%" stopColor="rgba(0, 153, 255, 0.2)" />
// // // // //           <stop offset="50%" stopColor="rgba(0, 153, 255, 1)" />
// // // // //           <stop offset="100%" stopColor="rgba(0, 153, 255, 0.2)" />
// // // // //         </linearGradient>

// // // // //         {/* فیلتر برای درخشش */}
// // // // //         <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
// // // // //           <feGaussianBlur stdDeviation="1.5" result="blur" />
// // // // //           <feMerge>
// // // // //             <feMergeNode in="blur" />
// // // // //             <feMergeNode in="SourceGraphic" />
// // // // //           </feMerge>
// // // // //         </filter>
// // // // //       </defs>

// // // // //       <polygon
// // // // //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// // // // //         fill="transparent"
// // // // //         stroke="url(#glowStroke)"
// // // // //         strokeWidth="1.5"
// // // // //         strokeDasharray="1, 1.5"
// // // // //         strokeDashoffset="0"
// // // // //         filter="url(#glowFilter)"
// // // // //       >
// // // // //         <animate
// // // // //           attributeName="stroke-dashoffset"
// // // // //           values="0;5"
// // // // //           dur="1.5s"
// // // // //           repeatCount="indefinite"
// // // // //         />
// // // // //       </polygon>
// // // // //     </svg>
// // // // //   );
// // // // // };

// // // // // export default Hexagon;
// // // // import React from "react";

// // // // const Hexagon = () => {
// // // //   return (
// // // //     <svg
// // // //       width="200"
// // // //       height="200"
// // // //       viewBox="0 0 100 100"
// // // //       style={{
// // // //         display: "block",
// // // //         margin: "100px auto",
// // // //         background: "transparent",
// // // //       }}
// // // //     >
// // // //       <defs>
// // // //         {/* گرادیان خط متحرک */}
// // // //         <linearGradient id="animatedStroke" x1="0%" y1="0%" x2="100%" y2="0%">
// // // //           <stop offset="0%" stopColor="#00ccff">
// // // //             <animate
// // // //               attributeName="offset"
// // // //               values="0%;100%"
// // // //               dur="2s"
// // // //               repeatCount="indefinite"
// // // //             />
// // // //           </stop>
// // // //           <stop offset="50%" stopColor="#00ccff" stopOpacity="0.2" />
// // // //           <stop offset="100%" stopColor="#00ccff">
// // // //             <animate
// // // //               attributeName="offset"
// // // //               values="100%;200%"
// // // //               dur="2s"
// // // //               repeatCount="indefinite"
// // // //             />
// // // //           </stop>
// // // //         </linearGradient>

// // // //         {/* فیلتر درخشش */}
// // // //         <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
// // // //           <feGaussianBlur stdDeviation="1.5" result="blur" />
// // // //           <feMerge>
// // // //             <feMergeNode in="blur" />
// // // //             <feMergeNode in="SourceGraphic" />
// // // //           </feMerge>
// // // //         </filter>
// // // //       </defs>

// // // //       <polygon
// // // //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// // // //         fill="transparent"
// // // //         stroke="url(#animatedStroke)"
// // // //         strokeWidth="1.5"
// // // //         filter="url(#glowFilter)"
// // // //       />
// // // //     </svg>
// // // //   );
// // // // };

// // // // export default Hexagon;
// // // import React from "react";

// // // const Hexagon = () => {
// // //   return (
// // //     <svg
// // //       width="200"
// // //       height="200"
// // //       viewBox="0 0 100 100"
// // //       style={{
// // //         display: "block",
// // //         margin: "100px auto",
// // //         background: "transparent",
// // //       }}
// // //     >
// // //       <defs>
// // //         {/* افکت نورانی */}
// // //         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// // //           <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
// // //           <feMerge>
// // //             <feMergeNode in="blur" />
// // //             <feMergeNode in="SourceGraphic" />
// // //           </feMerge>
// // //         </filter>

// // //         {/* گرادیان ساده که روی مسیر حرکت کنه */}
// // //         <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
// // //           <stop offset="0%" stopColor="#00ccff" />
// // //           <stop offset="100%" stopColor="#00ccff" />
// // //         </linearGradient>
// // //       </defs>

// // //       <polygon
// // //         id="hex"
// // //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// // //         fill="transparent"
// // //         stroke="url(#gradient)"
// // //         strokeWidth="1.5"
// // //         filter="url(#glow)"
// // //         strokeDasharray="300"
// // //         strokeDashoffset="300"
// // //       >
// // //         <animate
// // //           attributeName="stroke-dashoffset"
// // //           values="300;0"
// // //           dur="3s"
// // //           repeatCount="indefinite"
// // //         />
// // //       </polygon>
// // //     </svg>
// // //   );
// // // };

// // // export default Hexagon;
// // import React from "react";

// // const Hexagon = () => {
// //   return (
// //     <svg
// //       width="200"
// //       height="200"
// //       viewBox="0 0 100 100"
// //       style={{
// //         display: "block",
// //         margin: "100px auto",
// //         background: "transparent",
// //       }}
// //     >
// //       <defs>
// //         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// //           <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
// //           <feMerge>
// //             <feMergeNode in="blur" />
// //             <feMergeNode in="SourceGraphic" />
// //           </feMerge>
// //         </filter>
// //       </defs>

// //       {/* شش‌ضلعی ثابت */}
// //       <polygon
// //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// //         fill="transparent"
// //         stroke="#00ccff"
// //         strokeWidth="1.5"
// //       />

// //       {/* نور متحرک روی همون مسیر */}
// //       <polygon
// //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// //         fill="transparent"
// //         stroke="#ffffff"
// //         strokeWidth="2"
// //         strokeDasharray="60 300" // 60 طول نور، 300 بقیه مسیر
// //         strokeDashoffset="360"
// //         filter="url(#glow)"
// //       >
// //         <animate
// //           attributeName="stroke-dashoffset"
// //           values="360;0"
// //           dur="4s"
// //           repeatCount="indefinite"
// //         />
// //       </polygon>
// //     </svg>
// //   );
// // };

// // export default Hexagon;
// import React from "react";
// const Hexagon = () => {
//   return (
//     <svg
//       width="75"
//       height="75"
//       viewBox="0 0 100 100"
//       style={{
//         display: "block",
//         margin: "100px auto",
//         background: "transparent",
//       }}
//     >
//       <defs>
//         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//           <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
//           <feMerge>
//             <feMergeNode in="blur" />
//             <feMergeNode in="SourceGraphic" />
//           </feMerge>
//         </filter>

//         <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%" stopColor="#a2e8ff" />
//           <stop offset="100%" stopColor="#ffffff" />
//         </linearGradient>
//       </defs>

//       {/* شش‌ضلعی با ضلع پایین افقی */}
//       <polygon
//         points="25,5 75,5 95,50 75,95 25,95 5,50"
//         fill="transparent"
//         stroke="#00ccff"
//         strokeWidth="1.5"
//       />

//       <polygon
//         points="25,5 75,5 95,50 75,95 25,95 5,50"
//         fill="transparent"
//         stroke="url(#blueGradient)"
//         strokeWidth="2"
//         strokeDasharray="60 240"
//         strokeDashoffset="0"
//         filter="url(#glow)"
//       >
//         <animate
//           attributeName="stroke-dashoffset"
//           values="0;-300"
//           dur="4s"
//           repeatCount="indefinite"
//         />
//       </polygon>
//     </svg>
//   );
// };
// // const Hexagon = ({ radius = 65, centerX = 75, centerY = 75 }) => {
// //   const getHexPoints = () => {
// //     const points = [];
// //     for (let i = 0; i < 6; i++) {
// //       // زاویه شروع: 30 درجه (برای اینکه ضلع پایین افقی باشه)
// //       const angleDeg = 60 * i + 60;
// //       const angleRad = (Math.PI / 180) * angleDeg;
// //       const x = centerX - radius * Math.cos(angleRad);
// //       const y = centerY - radius * Math.sin(angleRad);
// //       points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
// //     }
// //     return points.join(" ");
// //   };

// //   return (
// //     <svg
// //       width={2 * radius + 20}
// //       height={2 * radius + 20}
// //       viewBox={`0 0 ${2 * radius + 20} ${2 * radius + 20}`}
// //       style={{
// //         display: "block",
// //         margin: "100px auto",
// //         background: "transparent",
// //       }}
// //     >
// //       <defs>
// //         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// //           <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
// //           <feMerge>
// //             <feMergeNode in="blur" />
// //             <feMergeNode in="SourceGraphic" />
// //           </feMerge>
// //         </filter>

// //         <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
// //           <stop offset="0%" stopColor="#a2e8ff" />
// //           <stop offset="100%" stopColor="#ffffff" />
// //         </linearGradient>
// //       </defs>

// //       <polygon
// //         points={getHexPoints()}
// //         fill="transparent"
// //         stroke="#00ccff"
// //         strokeWidth="1.5"
// //       />

// //       <polygon
// //         points={getHexPoints()}
// //         fill="transparent"
// //         stroke="url(#blueGradient)"
// //         strokeWidth="2"
// //         strokeDasharray="60 240"
// //         strokeDashoffset="0"
// //         filter="url(#glow)"
// //       >
// //         <animate
// //           attributeName="stroke-dashoffset"
// //           values="0;-300"
// //           dur="4s"
// //           repeatCount="indefinite"
// //         />
// //       </polygon>
// //     </svg>
// //   );
// // };

// // const Hexagon = () => {
// //   return (
// //     <svg
// //       width="75"
// //       height="75"
// //       viewBox="0 0 100 100"
// //       style={{
// //         display: "block",
// //         margin: "100px auto",
// //         background: "transparent",
// //       }}
// //     >
// //       <defs>
// //         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// //           <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
// //           <feMerge>
// //             <feMergeNode in="blur" />
// //             <feMergeNode in="SourceGraphic" />
// //           </feMerge>
// //         </filter>

// //         <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
// //           <stop offset="0%" stopColor="#a2e8ff" />
// //           <stop offset="100%" stopColor="#ffffff" />
// //         </linearGradient>
// //       </defs>

// //       {/* شش‌ضلعی با ضلع پایین افقی */}
// //       <polygon
// //         points="25,5 75,5 95,50 75,95 25,95 5,50"
// //         fill="transparent"
// //         stroke="#00ccff"
// //         strokeWidth="1.5"
// //       />

// //       <polygon
// //         points="25,5 75,5 95,50 75,95 25,95 5,50"
// //         fill="transparent"
// //         stroke="url(#blueGradient)"
// //         strokeWidth="2"
// //         strokeDasharray="60 240"
// //         strokeDashoffset="0"
// //         filter="url(#glow)"
// //       >
// //         <animate
// //           attributeName="stroke-dashoffset"
// //           values="0;-300"
// //           dur="4s"
// //           repeatCount="indefinite"
// //         />
// //       </polygon>
// //     </svg>
// //   );
// // };

// // const Hexagon = () => {
// //   return (
// //     <svg
// //       width="75"
// //       height="75"
// //       viewBox="0 0 100 100"
// //       style={{
// //         display: "block",
// //         margin: "100px auto",
// //         background: "transparent",
// //       }}
// //     >
// //       <defs>
// //         {/* فیلتر نورانی */}
// //         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
// //           <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
// //           <feMerge>
// //             <feMergeNode in="blur" />
// //             <feMergeNode in="SourceGraphic" />
// //           </feMerge>
// //         </filter>

// //         {/* گرادیان رنگ آبی روشن */}
// //         <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
// //           <stop offset="0%" stopColor="#a2e8ff" />
// //           <stop offset="100%" stopColor="#ffffff" />
// //         </linearGradient>
// //       </defs>

// //       {/* شش‌ضلعی اصلی با خط ثابت */}
// //       <polygon
// //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// //         fill="transparent"
// //         stroke="#00ccff"
// //         strokeWidth="1.5"
// //       />

// //       {/* نور متحرک با گرادیان رنگی */}
// //       <polygon
// //         points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
// //         fill="transparent"
// //         stroke="url(#blueGradient)"
// //         strokeWidth="2"
// //         strokeDasharray="60 240" // مجموع = 300
// //         strokeDashoffset="0"
// //         filter="url(#glow)"
// //       >
// //         <animate
// //           attributeName="stroke-dashoffset"
// //           values="0;-300"
// //           dur="4s"
// //           repeatCount="indefinite"
// //         />
// //       </polygon>
// //     </svg>
// //   );
// // };

const Hexagon = () => {
  const size = 52; // اندازه شعاع دایره‌ی محاطی
  const centerX = 70;
  const centerY = 70;

  const points = [...Array(6)]
    .map((_, i) => {
      const angle_deg = 60 * i + 60; // شروع از -30 تا ضلع بالا افقی باشه
      const angle_rad = (Math.PI / 180) * angle_deg;
      const x = centerX + size * Math.cos(angle_rad);
      const y = centerY + size * Math.sin(angle_rad);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      style={{
        display: "block",
        margin: "100px auto",
        background: "transparent",
        // background: "black",
      }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a2e8ff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      <polygon
        points={points}
        fill="transparent"
        stroke="#00ccff"
        strokeWidth="1.5"
      />

      <polygon
        points={points}
        fill="transparent"
        stroke="url(#blueGradient)"
        strokeWidth="2"
        strokeDasharray="60 240"
        strokeDashoffset="0"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-300"
          dur="4s"
          repeatCount="indefinite"
        />
      </polygon>
    </svg>
  );
};

export default Hexagon;
