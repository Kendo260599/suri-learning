export const getRankInfo = (xp: number) => {
  // Formula: level = floor(sqrt(xp / 50)) + 1
  // L1: 0-49 XP
  // L2: 50-199 XP
  // L3: 200-449 XP
  // L10: 4050 XP
  // L40: 76050 XP
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 50;
  const nextLevelBaseXP = Math.pow(level, 2) * 50;
  const xpIntoLevel = xp - currentLevelBaseXP;
  const xpNeededForLevel = nextLevelBaseXP - currentLevelBaseXP;
  const progress = (xpIntoLevel / xpNeededForLevel) * 100;

  let rankName = "Đồng";
  let rankColor = "text-amber-600";
  let rankBg = "bg-amber-600/10";
  let rankSolid = "bg-amber-600";
  let rankBorder = "border-amber-600";
  let icon = "Shield";

  if (level >= 40) {
    rankName = "Huyền Thoại";
    rankColor = "text-fuchsia-500";
    rankBg = "bg-fuchsia-500/10";
    rankSolid = "bg-fuchsia-500";
    rankBorder = "border-fuchsia-500";
    icon = "Crown";
  } else if (level >= 30) {
    rankName = "Cao Thủ";
    rankColor = "text-red-500";
    rankBg = "bg-red-500/10";
    rankSolid = "bg-red-500";
    rankBorder = "border-red-500";
    icon = "Swords";
  } else if (level >= 25) {
    rankName = "Tinh Anh";
    rankColor = "text-orange-500";
    rankBg = "bg-orange-500/10";
    rankSolid = "bg-orange-500";
    rankBorder = "border-orange-500";
    icon = "Star";
  } else if (level >= 20) {
    rankName = "Kim Cương";
    rankColor = "text-cyan-500";
    rankBg = "bg-cyan-500/10";
    rankSolid = "bg-cyan-500";
    rankBorder = "border-cyan-500";
    icon = "Diamond";
  } else if (level >= 15) {
    rankName = "Bạch Kim";
    rankColor = "text-teal-500";
    rankBg = "bg-teal-500/10";
    rankSolid = "bg-teal-500";
    rankBorder = "border-teal-500";
    icon = "Medal";
  } else if (level >= 10) {
    rankName = "Vàng";
    rankColor = "text-yellow-500";
    rankBg = "bg-yellow-500/10";
    rankSolid = "bg-yellow-500";
    rankBorder = "border-yellow-500";
    icon = "Trophy";
  } else if (level >= 5) {
    rankName = "Bạc";
    rankColor = "text-slate-400";
    rankBg = "bg-slate-400/10";
    rankSolid = "bg-slate-400";
    rankBorder = "border-slate-400";
    icon = "Award";
  }

  return { 
    level, 
    rankName, 
    rankColor, 
    rankBg, 
    rankSolid, 
    rankBorder, 
    icon, 
    currentXP: xpIntoLevel, 
    nextLevelXP: xpNeededForLevel, 
    progress, 
    totalXP: xp 
  };
};
