interface PatternBackgroundProps {
  startColor?: string;
  endColor?: string;
  startOpacity?: number;
  endOpacity?: number;
  className?: string;
}

export const PatternBackground = ({
  startColor = 'hsl(var(--primary))',
  endColor = 'hsl(var(--primary))',
  startOpacity = 0.3,
  endOpacity = 0.05,
  className = '',
}: PatternBackgroundProps) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 1440 1440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g clipPath="url(#clip0_3549_23300)">
        <path
          d="M-688 695.879L816.694 -709M-196.26 1240.42L1308.43 -164.455M-442.13 968.151L1062.56 -436.727M49.609 1512.7L1554.3 107.818M336.459 1830.35L1841.15 425.47M-565.065 832.015L939.629 -572.864M-73.325 1376.56L1431.37 -28.3182M-319.195 1104.29L1185.5 -300.591M172.545 1648.83L1677.24 243.955M459.393 1966.48L1964.09 561.606M-647.021 741.257L857.673 -663.621M-155.282 1285.8L1349.41 -119.076M-401.152 1013.53L1103.54 -391.348M90.588 1558.08L1595.28 153.197M377.437 1875.73L1882.13 470.849M-524.087 877.394L980.607 -527.485M-32.347 1421.94L1472.35 17.0607M-278.218 1149.67L1226.48 -255.212M213.524 1694.21L1718.22 289.333M500.371 2011.86L2005.07 606.985M582.329 2102.62L2087.02 697.742M-606.044 786.636L898.65 -618.242M-114.304 1331.18L1390.39 -73.697M-360.174 1058.91L1144.52 -345.97M131.566 1603.45L1636.26 198.576M418.415 1921.11L1923.11 516.227M-483.109 922.773L1021.59 -482.106M8.63103 1467.32L1513.33 62.4394M295.48 1784.97L1800.17 380.091M-237.239 1195.05L1267.46 -209.833M254.501 1739.59L1759.2 334.712M541.35 2057.24L2046.04 652.364M623.306 2148L2128 743.122"
          stroke="url(#paint0_linear_3549_23300)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_3549_23300"
          x1="1337.5"
          y1="55.4999"
          x2="333"
          y2="941.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={startColor} stopOpacity={startOpacity} />
          <stop offset="1" stopColor={endColor} stopOpacity={endOpacity} />
        </linearGradient>
        <clipPath id="clip0_3549_23300">
          <rect width="100%" height="100%" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
