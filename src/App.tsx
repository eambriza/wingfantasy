import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import TabBar from './components/TabBar';
// ============================================================================
// TYPES
// ============================================================================
type SportType = 'Football' | 'Formula 1';
type FootballPickKeys = 'matchResult' | 'firstScorer' | 'totalGoals';
type F1PickKeys = 'raceWinner' | 'fastestLap' | 'safetyCar';
type PickKeys = FootballPickKeys | F1PickKeys;
type FootballMatchResult = 'RB win' | 'Draw' | 'Opponent win';
type FirstScorer = string;
type TotalGoals = '0–1' | '2–3' | '4–5' | '6+';
type RaceWinner = string;
type FastestLap = string;
type SafetyCar = 'Yes' | 'No';
type PickOption = FootballMatchResult | FirstScorer | TotalGoals | RaceWinner | FastestLap | SafetyCar;
type Role = 'FWD' | 'MID' | 'DEF' | 'GK';
interface FootballPlayer {
  id: string;
  name: string;
  role: Role;
  club: string;
  cost: number;
}
interface F1Driver {
  id: string;
  name: string;
  team: string;
  cost: number;
}
interface F1TeamCard {
  id: string;
  name: string;
  cost: number;
}
interface FantasySquad {
  football: {
    FWD?: string;
    MID?: string;
    DEF?: string;
    FLEX?: string;
    captainId?: string;
  };
  f1: {
    driver1?: string;
    driver2?: string;
    team?: string;
    captainId?: string;
  };
}
interface Match {
  id: string;
  club: string;
  opponent: string;
  startISO: string;
}
interface Race {
  id: string;
  gpName: string;
  startISO: string;
}
interface WeeklySlate {
  weekId: string;
  lockISO: string;
  footballMatches: Match[];
  f1Race: Race | null;
}
interface FootballPlayerStats {
  playerId: string;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}
interface FootballMatchStats {
  matchId: string;
  club: string;
  won: boolean;
  cleanSheet: boolean;
  goalsScored: number;
  playerStats: FootballPlayerStats[];
}
interface F1DriverStats {
  driverId: string;
  gridPos: number;
  finishPos: number;
  fastestLap: boolean;
  dnf: boolean;
}
interface F1RaceStats {
  raceId: string;
  driverStats: F1DriverStats[];
}
interface SimulatedStats {
  footballMatches: FootballMatchStats[];
  f1Race: F1RaceStats | null;
}
interface LeaderboardEntry {
  userId: string;
  name: string;
  country: string;
  points: number;
}
interface UserProfile {
  userId: string;
  name: string;
  country: string;
  handle: string;
}
interface LeaderboardData {
  weeklySportBoards: Record<string, LeaderboardEntry[]>;
  monthlySportBoards: Record<string, LeaderboardEntry[]>;
  globalSeasonBoard: LeaderboardEntry[];
}
interface FootballMeta {
  opponent: string;
  scorers: string[];
}
interface F1Meta {
  location: string;
}
type EventMeta = FootballMeta | F1Meta;
interface Event {
  id: string;
  title: string;
  sport: SportType;
  startTime: number;
  pickKeys: PickKeys[];
  meta: EventMeta;
  isLocked: boolean;
  results?: Record<PickKeys, PickOption>;
}
interface UserPick {
  eventId: string;
  picks: Record<PickKeys, PickOption>;
}
interface PassportProgress {
  watched: number;
  predicted: number;
  created: number;
  badge?: string;
}
interface WeekHistory {
  weekId: string;
  points: number;
}
interface AppState {
  picks: UserPick[];
  results: Record<string, Record<PickKeys, PickOption>>;
  points: Record<string, number>;
  passport: PassportProgress;
  streakDays: number;
  wingTokens: number;
  fantasySquad: FantasySquad;
  weeklySlate: WeeklySlate | null;
  simulatedStats: SimulatedStats | null;
  weeklyPoints: number;
  seasonPoints: number;
  weekHistory: WeekHistory[];
  rngSeed: number;
  demoMode: boolean;
  lastLeaderboardFilters: {
    sport: SportType;
    timeframe: 'Weekly' | 'Monthly';
    scope: 'Country' | 'Global';
    country: string;
  };
}
// ============================================================================
// DATA POOLS
// ============================================================================
const FOOTBALL_PLAYERS: FootballPlayer[] = [{
  id: 'p1',
  name: 'Openda',
  role: 'FWD',
  club: 'RB Leipzig',
  cost: 12
}, {
  id: 'p2',
  name: 'Olmo',
  role: 'MID',
  club: 'RB Leipzig',
  cost: 11
}, {
  id: 'p3',
  name: 'Xavi Simons',
  role: 'MID',
  club: 'RB Leipzig',
  cost: 10
}, {
  id: 'p4',
  name: 'Henrichs',
  role: 'DEF',
  club: 'RB Leipzig',
  cost: 8
}, {
  id: 'p5',
  name: 'Blaswich',
  role: 'GK',
  club: 'RB Leipzig',
  cost: 7
}, {
  id: 'p7',
  name: 'Konaté',
  role: 'FWD',
  club: 'Red Bull Salzburg',
  cost: 10
}, {
  id: 'p8',
  name: 'Šeško',
  role: 'MID',
  club: 'Red Bull Salzburg',
  cost: 9
}, {
  id: 'p9',
  name: 'Sucic',
  role: 'MID',
  club: 'Red Bull Salzburg',
  cost: 9
}, {
  id: 'p10',
  name: 'Dedić',
  role: 'DEF',
  club: 'Red Bull Salzburg',
  cost: 8
}, {
  id: 'p11',
  name: 'Köhn',
  role: 'GK',
  club: 'Red Bull Salzburg',
  cost: 7
}, {
  id: 'p12',
  name: 'Morgan',
  role: 'MID',
  club: 'New York Red Bulls',
  cost: 9
}, {
  id: 'p13',
  name: 'Barlow',
  role: 'FWD',
  club: 'New York Red Bulls',
  cost: 7
}, {
  id: 'p14',
  name: 'Manoel',
  role: 'FWD',
  club: 'New York Red Bulls',
  cost: 8
}, {
  id: 'p15',
  name: 'Tolkin',
  role: 'DEF',
  club: 'New York Red Bulls',
  cost: 7
}, {
  id: 'p16',
  name: 'Coronel',
  role: 'GK',
  club: 'New York Red Bulls',
  cost: 6
}, {
  id: 'p17',
  name: 'Helinho',
  role: 'MID',
  club: 'Red Bull Bragantino',
  cost: 9
}, {
  id: 'p18',
  name: 'Sasha',
  role: 'FWD',
  club: 'Red Bull Bragantino',
  cost: 8
}, {
  id: 'p19',
  name: 'Vitinho',
  role: 'MID',
  club: 'Red Bull Bragantino',
  cost: 8
}, {
  id: 'p20',
  name: 'Luan Cândido',
  role: 'DEF',
  club: 'Red Bull Bragantino',
  cost: 7
}, {
  id: 'p21',
  name: 'Cleiton',
  role: 'GK',
  club: 'Red Bull Bragantino',
  cost: 6
}];
const F1_DRIVERS: F1Driver[] = [{
  id: 'd1',
  name: 'Max Verstappen',
  team: 'Red Bull Racing',
  cost: 16
}, {
  id: 'd2',
  name: 'Sergio Pérez',
  team: 'Red Bull Racing',
  cost: 12
}, {
  id: 'd3',
  name: 'Yuki Tsunoda',
  team: 'Visa Cash App RB',
  cost: 10
}, {
  id: 'd4',
  name: 'Daniel Ricciardo',
  team: 'Visa Cash App RB',
  cost: 9
}];
const F1_TEAMS: F1TeamCard[] = [{
  id: 't1',
  name: 'Red Bull Racing',
  cost: 18
}, {
  id: 't2',
  name: 'Visa Cash App RB',
  cost: 12
}];
const FOOTBALL_SALARY_CAP = 40;
const F1_SALARY_CAP = 40;
const COUNTRIES = ['US', 'AT', 'DE', 'BR', 'ZA'];
const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸',
  AT: '🇦🇹',
  DE: '🇩🇪',
  BR: '🇧🇷',
  ZA: '🇿🇦'
};
// ============================================================================
// MOCK EVENTS
// ============================================================================
const now = Date.now();
const MOCK_EVENTS: Event[] = [{
  id: 'f1-abu-dhabi',
  title: 'F1 Abu Dhabi Grand Prix',
  sport: 'Formula 1',
  startTime: now + 120 * 60 * 1000,
  pickKeys: ['raceWinner', 'fastestLap', 'safetyCar'],
  meta: {
    location: 'Yas Marina Circuit'
  } as F1Meta,
  isLocked: false
}, {
  id: 'f1-austin',
  title: 'F1 Austin Grand Prix',
  sport: 'Formula 1',
  startTime: now - 180 * 60 * 1000,
  pickKeys: ['raceWinner', 'fastestLap', 'safetyCar'],
  meta: {
    location: 'Circuit of the Americas'
  } as F1Meta,
  isLocked: true
}, {
  id: 'f1-mexico',
  title: 'F1 Mexico City Grand Prix',
  sport: 'Formula 1',
  startTime: now - 7 * 24 * 60 * 60 * 1000,
  pickKeys: ['raceWinner', 'fastestLap', 'safetyCar'],
  meta: {
    location: 'Autódromo Hermanos Rodríguez'
  } as F1Meta,
  isLocked: true
}, {
  id: 'rb-leipzig-bayern',
  title: 'RB Leipzig vs Bayern Munich',
  sport: 'Football',
  startTime: now + 240 * 60 * 1000,
  pickKeys: ['matchResult', 'firstScorer', 'totalGoals'],
  meta: {
    opponent: 'Bayern Munich',
    scorers: ['Openda', 'Olmo', 'Xavi Simons']
  } as FootballMeta,
  isLocked: false
}, {
  id: 'salzburg-rapid',
  title: 'Red Bull Salzburg vs Rapid Wien',
  sport: 'Football',
  startTime: now - 2 * 24 * 60 * 60 * 1000,
  pickKeys: ['matchResult', 'firstScorer', 'totalGoals'],
  meta: {
    opponent: 'Rapid Wien',
    scorers: ['Konaté', 'Šeško', 'Sucic']
  } as FootballMeta,
  isLocked: true
}, {
  id: 'nyrb-lafc',
  title: 'New York Red Bulls vs LAFC',
  sport: 'Football',
  startTime: now - 14 * 24 * 60 * 60 * 1000,
  pickKeys: ['matchResult', 'firstScorer', 'totalGoals'],
  meta: {
    opponent: 'LAFC',
    scorers: ['Morgan', 'Barlow', 'Manoel']
  } as FootballMeta,
  isLocked: true
}];
// ============================================================================
// PURE FUNCTIONS
// ============================================================================
function seededRandom(seed: number): () => number {
  let currentSeed = seed;
  return () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
}
function isLocked(lockISO: string): boolean {
  return new Date(lockISO).getTime() < Date.now();
}
function calcFootballPlayerPoints(playerId: string, stats: FootballPlayerStats, teamWon: boolean, cleanSheet: boolean): number {
  const player = FOOTBALL_PLAYERS.find(p => p.id === playerId);
  if (!player) return 0;
  let points = 0;
  if (stats.minutesPlayed >= 60) points += 1;
  if (player.role === 'FWD') points += stats.goals * 5;else if (player.role === 'MID') points += stats.goals * 6;else if (player.role === 'DEF') points += stats.goals * 7;
  points += stats.assists * 3;
  if ((player.role === 'GK' || player.role === 'DEF') && cleanSheet && stats.minutesPlayed >= 60) {
    points += 4;
  }
  if (teamWon) points += 2;
  points -= stats.yellowCards * 1;
  points -= stats.redCards * 3;
  return points;
}
function calcF1DriverPoints(driverId: string, finishPos: number, gridPos: number, fastestLap: boolean, dnf: boolean): number {
  let points = 0;
  if (dnf) {
    points -= 5;
  } else {
    const finishPoints: Record<number, number> = {
      1: 25,
      2: 18,
      3: 15,
      4: 12,
      5: 10,
      6: 8,
      7: 6,
      8: 4,
      9: 2,
      10: 1
    };
    points += finishPoints[finishPos] || 0;
    if (fastestLap) points += 1;
    const positionsGained = Math.max(0, gridPos - finishPos);
    points += Math.min(5, positionsGained);
  }
  return points;
}
function calcFootballTeamCardPoints(matchStats: FootballMatchStats): number {
  let points = 0;
  if (matchStats.won) points += 3;
  if (matchStats.cleanSheet) points += 2;
  if (matchStats.goalsScored >= 2) points += 1;
  return points;
}
function calcF1TeamCardPoints(teamId: string, raceStats: F1RaceStats): number {
  const team = F1_TEAMS.find(t => t.id === teamId);
  if (!team) return 0;
  const teamDrivers = F1_DRIVERS.filter(d => d.team === team.name);
  const teamDriverIds = teamDrivers.map(d => d.id);
  let points = 0;
  let hasFastestLap = false;
  teamDriverIds.forEach(driverId => {
    const driverStat = raceStats.driverStats.find(ds => ds.driverId === driverId);
    if (driverStat) {
      const finishPoints: Record<number, number> = {
        1: 25,
        2: 18,
        3: 15,
        4: 12,
        5: 10,
        6: 8,
        7: 6,
        8: 4,
        9: 2,
        10: 1
      };
      points += finishPoints[driverStat.finishPos] || 0;
      if (driverStat.fastestLap) hasFastestLap = true;
    }
  });
  if (hasFastestLap) points += 2;
  return points;
}
function applyCaptainMultiplier(points: number): number {
  return Math.floor(points * 1.5);
}
function calcSquadPoints(squad: FantasySquad, stats: SimulatedStats): {
  football: number;
  f1: number;
  total: number;
} {
  let footballPoints = 0;
  let f1Points = 0;
  const footballSlots = [squad.football.FWD, squad.football.MID, squad.football.DEF, squad.football.FLEX];
  footballSlots.forEach(playerId => {
    if (!playerId) return;
    const player = FOOTBALL_PLAYERS.find(p => p.id === playerId);
    if (!player) return;
    stats.footballMatches.forEach(matchStats => {
      if (matchStats.club === player.club) {
        const playerStat = matchStats.playerStats.find(ps => ps.playerId === playerId);
        if (playerStat) {
          let pts = calcFootballPlayerPoints(playerId, playerStat, matchStats.won, matchStats.cleanSheet);
          if (playerId === squad.football.captainId) {
            pts = applyCaptainMultiplier(pts);
          }
          footballPoints += pts;
        }
      }
    });
  });
  if (stats.f1Race) {
    ;
    [squad.f1.driver1, squad.f1.driver2].forEach(driverId => {
      if (!driverId) return;
      const driverStat = stats.f1Race!.driverStats.find(ds => ds.driverId === driverId);
      if (driverStat) {
        let pts = calcF1DriverPoints(driverId, driverStat.finishPos, driverStat.gridPos, driverStat.fastestLap, driverStat.dnf);
        if (driverId === squad.f1.captainId) {
          pts = applyCaptainMultiplier(pts);
        }
        f1Points += pts;
      }
    });
    if (squad.f1.team) {
      f1Points += calcF1TeamCardPoints(squad.f1.team, stats.f1Race);
    }
  }
  return {
    football: footballPoints,
    f1: f1Points,
    total: footballPoints + f1Points
  };
}
function simulateFootballWeek(seed: number, slate: WeeklySlate): FootballMatchStats[] {
  const rng = seededRandom(seed);
  const results: FootballMatchStats[] = [];
  slate.footballMatches.forEach(match => {
    const clubPlayers = FOOTBALL_PLAYERS.filter(p => p.club === match.club);
    const won = rng() > 0.5;
    const cleanSheet = rng() > 0.6;
    const goalsScored = Math.floor(rng() * 4);
    const playerStats: FootballPlayerStats[] = clubPlayers.map(player => {
      const minutesPlayed = rng() > 0.2 ? 90 : Math.floor(rng() * 90);
      const goals = player.role === 'FWD' && rng() > 0.7 ? 1 : 0;
      const assists = rng() > 0.8 ? 1 : 0;
      const yellowCards = rng() > 0.9 ? 1 : 0;
      const redCards = rng() > 0.97 ? 1 : 0;
      return {
        playerId: player.id,
        minutesPlayed,
        goals,
        assists,
        yellowCards,
        redCards
      };
    });
    results.push({
      matchId: match.id,
      club: match.club,
      won,
      cleanSheet,
      goalsScored,
      playerStats
    });
  });
  return results;
}
function simulateF1Race(seed: number, slate: WeeklySlate): F1RaceStats | null {
  if (!slate.f1Race) return null;
  const rng = seededRandom(seed + 1000);
  const driverStats: F1DriverStats[] = F1_DRIVERS.map((driver, idx) => {
    const gridPos = idx + 1;
    const dnf = rng() > 0.85;
    const finishPos = dnf ? 20 : Math.max(1, Math.floor(rng() * 10) + 1);
    const fastestLap = !dnf && rng() > 0.75;
    return {
      driverId: driver.id,
      gridPos,
      finishPos,
      fastestLap,
      dnf
    };
  });
  return {
    raceId: slate.f1Race.id,
    driverStats
  };
}
function generateWeeklySlate(events: Event[]): WeeklySlate {
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.startTime);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
  const footballMatches: Match[] = upcomingEvents.filter(e => e.sport === 'Football').map(e => ({
    id: e.id,
    club: e.title.split(' vs ')[0],
    opponent: e.title.split(' vs ')[1] || 'Opponent',
    startISO: new Date(e.startTime).toISOString()
  }));
  const f1Events = upcomingEvents.filter(e => e.sport === 'Formula 1');
  const f1Race = f1Events.length > 0 ? {
    id: f1Events[0].id,
    gpName: f1Events[0].title,
    startISO: new Date(f1Events[0].startTime).toISOString()
  } : null;
  const earliestStart = upcomingEvents.reduce((earliest, e) => {
    return e.startTime < earliest ? e.startTime : earliest;
  }, Infinity);
  const lockTime = earliestStart === Infinity ? new Date(weekEnd).toISOString() : new Date(earliestStart - 15 * 60 * 1000).toISOString();
  const weekId = `week_${weekStart.getFullYear()}_${weekStart.getMonth() + 1}_${weekStart.getDate()}`;
  return {
    weekId,
    lockISO: lockTime,
    footballMatches,
    f1Race
  };
}
function generateDemoUsers(seed: number, count: number): UserProfile[] {
  const rng = seededRandom(seed);
  const users: UserProfile[] = [];
  const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson'];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(rng() * firstNames.length)];
    const lastName = lastNames[Math.floor(rng() * lastNames.length)];
    const country = COUNTRIES[Math.floor(rng() * COUNTRIES.length)];
    users.push({
      userId: `demo_user_${i}`,
      name: `${firstName} ${lastName}`,
      country,
      handle: `@${firstName.toLowerCase()}${i}`
    });
  }
  return users;
}
function generateDemoLeaderboards(seed: number, users: UserProfile[]): LeaderboardData {
  const rng = seededRandom(seed + 5000);
  const weeklySportBoards: Record<string, LeaderboardEntry[]> = {};
  const monthlySportBoards: Record<string, LeaderboardEntry[]> = {};
  const globalSeasonBoard: LeaderboardEntry[] = [];
  const sports: SportType[] = ['Football', 'Formula 1'];
  const weeks = ['week_2025_1_6', 'week_2025_1_13', 'week_2025_1_20', 'week_2025_1_27'];
  const months = ['2024-12', '2025-01'];
  sports.forEach(sport => {
    weeks.forEach(week => {
      const key = `${sport}:${week}`;
      const entries = users.map(user => ({
        userId: user.userId,
        name: user.name,
        country: user.country,
        points: Math.floor(rng() * 150) + 20
      }));
      // Add Eric Ambriza with points to place in top 10-15
      entries.push({
        userId: 'user_eric_ambriza',
        name: 'Eric Ambriza',
        country: 'ZA',
        points: Math.floor(rng() * 30) + 130 // 130-160 points (top 10-15 range)
      });
      weeklySportBoards[key] = entries.sort((a, b) => b.points - a.points);
    });
    months.forEach(month => {
      const key = `${sport}:${month}`;
      const entries = users.map(user => ({
        userId: user.userId,
        name: user.name,
        country: user.country,
        points: Math.floor(rng() * 600) + 100
      }));
      // Add Eric Ambriza with points to place in top 10-15
      entries.push({
        userId: 'user_eric_ambriza',
        name: 'Eric Ambriza',
        country: 'ZA',
        points: Math.floor(rng() * 100) + 550 // 550-650 points (top 10-15 range)
      });
      monthlySportBoards[key] = entries.sort((a, b) => b.points - a.points);
    });
  });
  users.forEach(user => {
    globalSeasonBoard.push({
      userId: user.userId,
      name: user.name,
      country: user.country,
      points: Math.floor(rng() * 2000) + 500
    });
  });
  // Add Eric Ambriza to global season board
  globalSeasonBoard.push({
    userId: 'user_eric_ambriza',
    name: 'Eric Ambriza',
    country: 'ZA',
    points: Math.floor(rng() * 400) + 2000 // 2000-2400 points (top 10-15 range)
  });
  globalSeasonBoard.sort((a, b) => b.points - a.points);
  return {
    weeklySportBoards,
    monthlySportBoards,
    globalSeasonBoard
  };
}
// ============================================================================
// CONTEXT
// ============================================================================
const AppContext = createContext<{
  state: AppState;
  userProfile: UserProfile;
  leaderboards: LeaderboardData;
  events: Event[];
  saveState: () => Promise<void>;
  makePick: (eventId: string, key: PickKeys, value: PickOption) => void;
  simulateResults: (event: Event) => void;
  revealResults: (event: Event) => void;
  updateFantasySquad: (squad: FantasySquad) => void;
  simulateWeek: () => void;
  calculateFantasyPoints: () => void;
  toggleDemoMode: () => void;
  resetDemoData: () => void;
  updateUserCountry: (country: string) => void;
  updateLeaderboardFilters: (filters: any) => void;
}>({
  state: {
    picks: [],
    results: {},
    points: {},
    passport: {
      watched: 0,
      predicted: 0,
      created: 0
    },
    streakDays: 0,
    wingTokens: 0,
    fantasySquad: {
      football: {},
      f1: {}
    },
    weeklySlate: null,
    simulatedStats: null,
    weeklyPoints: 0,
    seasonPoints: 0,
    weekHistory: [],
    rngSeed: Math.floor(Math.random() * 1000000),
    demoMode: false,
    lastLeaderboardFilters: {
      sport: 'Football',
      timeframe: 'Weekly',
      scope: 'Country',
      country: 'ZA'
    }
  },
  userProfile: {
    userId: 'user_' + Math.random().toString(36).substr(2, 9),
    name: 'Player',
    country: 'ZA',
    handle: '@player'
  },
  leaderboards: {
    weeklySportBoards: {},
    monthlySportBoards: {},
    globalSeasonBoard: []
  },
  events: [],
  saveState: async () => {},
  makePick: () => {},
  simulateResults: () => {},
  revealResults: () => {},
  updateFantasySquad: () => {},
  simulateWeek: () => {},
  calculateFantasyPoints: () => {},
  toggleDemoMode: () => {},
  resetDemoData: () => {},
  updateUserCountry: () => {},
  updateLeaderboardFilters: () => {}
});
// ============================================================================
// APP COMPONENT
// ============================================================================
export function App() {
  const [state, setState] = useState<AppState>({
    picks: [],
    results: {},
    points: {},
    passport: {
      watched: 0,
      predicted: 0,
      created: 0
    },
    streakDays: 0,
    wingTokens: 0,
    fantasySquad: {
      football: {},
      f1: {}
    },
    weeklySlate: null,
    simulatedStats: null,
    weeklyPoints: 0,
    seasonPoints: 0,
    weekHistory: [],
    rngSeed: Math.floor(Math.random() * 1000000),
    demoMode: false,
    lastLeaderboardFilters: {
      sport: 'Football',
      timeframe: 'Weekly',
      scope: 'Country',
      country: 'ZA'
    }
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    userId: 'user_eric_ambriza',
    name: 'Eric Ambriza',
    country: 'ZA',
    handle: '@ericambriza'
  });
  const [leaderboards, setLeaderboards] = useState<LeaderboardData>({
    weeklySportBoards: {},
    monthlySportBoards: {},
    globalSeasonBoard: []
  });
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = localStorage.getItem('wingfantasy_v1');
        if (storedState) {
          setState(JSON.parse(storedState));
        }
        const storedUser = localStorage.getItem('wingfantasy_user');
        if (storedUser) {
          setUserProfile(JSON.parse(storedUser));
        }
        const storedLeaderboards = localStorage.getItem('wingfantasy_leaderboards_v1');
        if (storedLeaderboards) {
          setLeaderboards(JSON.parse(storedLeaderboards));
        }
        const storedSeed = localStorage.getItem('wingfantasy_rng_seed');
        if (storedSeed) {
          setState(prev => ({
            ...prev,
            rngSeed: parseInt(storedSeed)
          }));
        }
      } catch (error) {
        console.error('Failed to load state', error);
      }
    };
    loadState();
    const updatedEvents = events.map(event => ({
      ...event,
      isLocked: event.startTime - Date.now() < 15 * 60 * 1000
    }));
    setEvents(updatedEvents);
  }, []);
  useEffect(() => {
    const slate = generateWeeklySlate(events);
    setState(prev => {
      if (prev.weeklySlate?.weekId !== slate.weekId) {
        return {
          ...prev,
          weeklySlate: slate,
          weeklyPoints: 0,
          simulatedStats: null
        };
      }
      return {
        ...prev,
        weeklySlate: slate
      };
    });
  }, [events]);
  const saveState = async () => {
    try {
      localStorage.setItem('wingfantasy_v1', JSON.stringify(state));
      localStorage.setItem('wingfantasy_user', JSON.stringify(userProfile));
      localStorage.setItem('wingfantasy_leaderboards_v1', JSON.stringify(leaderboards));
      localStorage.setItem('wingfantasy_rng_seed', state.rngSeed.toString());
    } catch (error) {
      console.error('Failed to save state', error);
    }
  };
  useEffect(() => {
    saveState();
  }, [state, userProfile, leaderboards]);
  const makePick = (eventId: string, key: PickKeys, value: PickOption) => {
    const event = events.find(e => e.id === eventId);
    if (event?.isLocked) return;
    setState(prev => {
      const existingPickIndex = prev.picks.findIndex(p => p.eventId === eventId);
      let newPicks = [...prev.picks];
      if (existingPickIndex >= 0) {
        newPicks[existingPickIndex] = {
          ...newPicks[existingPickIndex],
          picks: {
            ...newPicks[existingPickIndex].picks,
            [key]: value
          }
        };
      } else {
        newPicks.push({
          eventId,
          picks: {
            [key]: value
          } as Record<PickKeys, PickOption>
        });
      }
      const passport = {
        ...prev.passport
      };
      if (newPicks.length > prev.picks.length) {
        passport.predicted = Math.min(3, passport.predicted + 1);
      }
      return {
        ...prev,
        picks: newPicks,
        passport
      };
    });
  };
  const simulateResults = (event: Event) => {
    let results: Record<PickKeys, PickOption> = {} as Record<PickKeys, PickOption>;
    if (event.sport === 'Football') {
      const matchResults: FootballMatchResult[] = ['RB win', 'Draw', 'Opponent win'];
      const totalGoals: TotalGoals[] = ['0–1', '2–3', '4–5', '6+'];
      const meta = event.meta as FootballMeta;
      results = {
        matchResult: matchResults[Math.floor(Math.random() * matchResults.length)],
        firstScorer: meta.scorers[Math.floor(Math.random() * meta.scorers.length)],
        totalGoals: totalGoals[Math.floor(Math.random() * totalGoals.length)]
      } as Record<PickKeys, PickOption>;
    } else {
      const safetyCar: SafetyCar[] = ['Yes', 'No'];
      results = {
        raceWinner: F1_DRIVERS[Math.floor(Math.random() * F1_DRIVERS.length)].name,
        fastestLap: F1_DRIVERS[Math.floor(Math.random() * F1_DRIVERS.length)].name,
        safetyCar: safetyCar[Math.floor(Math.random() * safetyCar.length)]
      } as Record<PickKeys, PickOption>;
    }
    setState(prev => ({
      ...prev,
      results: {
        ...prev.results,
        [event.id]: results
      }
    }));
  };
  const revealResults = (event: Event) => {
    const userPick = state.picks.find(p => p.eventId === event.id);
    const results = state.results[event.id];
    if (!userPick || !results) {
      alert('No picks or results. Make picks and simulate results first.');
      return;
    }
    let points = 0;
    const userPicks = userPick.picks;
    event.pickKeys.forEach(key => {
      if (userPicks[key] && userPicks[key] === results[key]) {
        points += 10;
      }
    });
    setState(prev => ({
      ...prev,
      points: {
        ...prev.points,
        [event.id]: points
      },
      passport: {
        ...prev.passport,
        watched: Math.min(1, prev.passport.watched + 1),
        badge: prev.passport.watched >= 1 && prev.passport.predicted >= 3 && prev.passport.created >= 1 ? 'season_pass_001' : prev.passport.badge
      },
      streakDays: prev.streakDays + 1,
      wingTokens: prev.streakDays + 1 >= 7 ? prev.wingTokens + 1 : prev.wingTokens
    }));
    alert(`Results: You scored ${points} points!`);
  };
  const updateFantasySquad = (squad: FantasySquad) => {
    setState(prev => ({
      ...prev,
      fantasySquad: squad
    }));
  };
  const simulateWeek = () => {
    if (!state.weeklySlate) return;
    const footballStats = simulateFootballWeek(state.rngSeed, state.weeklySlate);
    const f1Stats = simulateF1Race(state.rngSeed, state.weeklySlate);
    setState(prev => ({
      ...prev,
      simulatedStats: {
        footballMatches: footballStats,
        f1Race: f1Stats
      }
    }));
    console.log('Simulated Football:', footballStats);
    console.log('Simulated F1:', f1Stats);
  };
  const calculateFantasyPoints = () => {
    if (!state.simulatedStats || !state.weeklySlate) {
      alert('Simulate week first');
      return;
    }
    const squadPoints = calcSquadPoints(state.fantasySquad, state.simulatedStats);
    const weekKey = `Football:${state.weeklySlate.weekId}`;
    const f1WeekKey = `Formula 1:${state.weeklySlate.weekId}`;
    const eventDate = new Date();
    const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
    const footballMonthKey = `Football:${monthKey}`;
    const f1MonthKey = `Formula 1:${monthKey}`;
    setLeaderboards(prev => {
      const newLeaderboards = {
        ...prev
      };
      const updateBoard = (key: string, points: number) => {
        if (!newLeaderboards.weeklySportBoards[key]) {
          newLeaderboards.weeklySportBoards[key] = [];
        }
        const existing = newLeaderboards.weeklySportBoards[key].find(e => e.userId === userProfile.userId);
        if (existing) {
          existing.points += points;
        } else {
          newLeaderboards.weeklySportBoards[key].push({
            userId: userProfile.userId,
            name: userProfile.name,
            country: userProfile.country,
            points
          });
        }
        newLeaderboards.weeklySportBoards[key].sort((a, b) => b.points - a.points);
      };
      const updateMonthBoard = (key: string, points: number) => {
        if (!newLeaderboards.monthlySportBoards[key]) {
          newLeaderboards.monthlySportBoards[key] = [];
        }
        const existing = newLeaderboards.monthlySportBoards[key].find(e => e.userId === userProfile.userId);
        if (existing) {
          existing.points += points;
        } else {
          newLeaderboards.monthlySportBoards[key].push({
            userId: userProfile.userId,
            name: userProfile.name,
            country: userProfile.country,
            points
          });
        }
        newLeaderboards.monthlySportBoards[key].sort((a, b) => b.points - a.points);
      };
      if (squadPoints.football > 0) {
        updateBoard(weekKey, squadPoints.football);
        updateMonthBoard(footballMonthKey, squadPoints.football);
      }
      if (squadPoints.f1 > 0) {
        updateBoard(f1WeekKey, squadPoints.f1);
        updateMonthBoard(f1MonthKey, squadPoints.f1);
      }
      const globalExisting = newLeaderboards.globalSeasonBoard.find(e => e.userId === userProfile.userId);
      if (globalExisting) {
        globalExisting.points += squadPoints.total;
      } else {
        newLeaderboards.globalSeasonBoard.push({
          userId: userProfile.userId,
          name: userProfile.name,
          country: userProfile.country,
          points: squadPoints.total
        });
      }
      newLeaderboards.globalSeasonBoard.sort((a, b) => b.points - a.points);
      return newLeaderboards;
    });
    setState(prev => ({
      ...prev,
      weeklyPoints: squadPoints.total,
      seasonPoints: prev.seasonPoints + squadPoints.total,
      weekHistory: [...prev.weekHistory, {
        weekId: state.weeklySlate!.weekId,
        points: squadPoints.total
      }].slice(-4)
    }));
    alert(`Fantasy Points: ${squadPoints.total} (Football: ${squadPoints.football}, F1: ${squadPoints.f1})`);
  };
  const toggleDemoMode = () => {
    setState(prev => {
      const newDemoMode = !prev.demoMode;
      if (newDemoMode) {
        const demoUsers = generateDemoUsers(prev.rngSeed, 300);
        const demoLeaderboards = generateDemoLeaderboards(prev.rngSeed, demoUsers);
        setLeaderboards(demoLeaderboards);
      } else {
        setLeaderboards({
          weeklySportBoards: {},
          monthlySportBoards: {},
          globalSeasonBoard: []
        });
      }
      return {
        ...prev,
        demoMode: newDemoMode
      };
    });
  };
  const resetDemoData = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setState(prev => ({
      ...prev,
      rngSeed: newSeed
    }));
    if (state.demoMode) {
      const demoUsers = generateDemoUsers(newSeed, 300);
      const demoLeaderboards = generateDemoLeaderboards(newSeed, demoUsers);
      setLeaderboards(demoLeaderboards);
    }
  };
  const updateUserCountry = (country: string) => {
    setUserProfile(prev => ({
      ...prev,
      country
    }));
  };
  const updateLeaderboardFilters = (filters: any) => {
    setState(prev => ({
      ...prev,
      lastLeaderboardFilters: {
        ...prev.lastLeaderboardFilters,
        ...filters
      }
    }));
  };
  return <AppContext.Provider value={{
    state,
    userProfile,
    leaderboards,
    events,
    saveState,
    makePick,
    simulateResults,
    revealResults,
    updateFantasySquad,
    simulateWeek,
    calculateFantasyPoints,
    toggleDemoMode,
    resetDemoData,
    updateUserCountry,
    updateLeaderboardFilters
  }}>
      <Router>
        <div className="rb-bg min-h-screen text-rb-text font-ui">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomeScreen />} />
              <Route path="events" element={<EventsScreen />} />
              <Route path="live" element={<LiveScreen />} />
              <Route path="search" element={<SearchScreen />} />
              <Route path="fantasy" element={<FantasyScreen />} />
              <Route path="boards" element={<BoardsScreen />} />
            </Route>
            <Route path="/pick/:eventId" element={<PickSheetScreen />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>;
}
// ============================================================================
// MAIN LAYOUT
// ============================================================================
function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<HomeScreen />} />
          <Route path="events" element={<EventsScreen />} />
          <Route path="live" element={<LiveScreen />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="fantasy" element={<FantasyScreen />} />
          <Route path="boards" element={<BoardsScreen />} />
        </Routes>
        {/* Bottom spacer to prevent content from being hidden under tab bar */}
        <div className="h-[84px]" />
      </div>
      <TabBar />
    </div>
  );
}
// ============================================================================
// FANTASY SCREEN
// ============================================================================
function FantasyScreen() {
  const {
    state,
    updateFantasySquad
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'football' | 'f1'>('football');
  const [pickerSlot, setPickerSlot] = useState<string>('');
  const footballCost = [state.fantasySquad.football.FWD, state.fantasySquad.football.MID, state.fantasySquad.football.DEF, state.fantasySquad.football.FLEX].filter(Boolean).reduce((sum, id) => {
    const player = FOOTBALL_PLAYERS.find(p => p.id === id);
    return sum + (player?.cost || 0);
  }, 0);
  const f1Cost = [state.fantasySquad.f1.driver1, state.fantasySquad.f1.driver2, state.fantasySquad.f1.team].filter(Boolean).reduce((sum, id) => {
    const driver = F1_DRIVERS.find(d => d.id === id);
    const team = F1_TEAMS.find(t => t.id === id);
    return sum + (driver?.cost || team?.cost || 0);
  }, 0);
  const locked = state.weeklySlate ? isLocked(state.weeklySlate.lockISO) : false;
  const openPicker = (mode: 'football' | 'f1', slot: string) => {
    console.log('openPicker called:', { mode, slot, locked });
    alert(`Opening picker for ${mode} - ${slot}. Locked: ${locked}`);
    if (locked) {
      console.log('Squad is locked, cannot open picker');
      alert('Squad is locked!');
      return;
    }
    setPickerMode(mode);
    setPickerSlot(slot);
    setShowPicker(true);
    console.log('Picker should now be visible. showPicker state:', true);
  };
  
  const removePlayer = () => {
    const newSquad = {
      ...state.fantasySquad
    };
    if (pickerMode === 'football') {
      newSquad.football = {
        ...newSquad.football,
        [pickerSlot]: undefined
      };
      if (newSquad.football.captainId === state.fantasySquad.football[pickerSlot as keyof typeof state.fantasySquad.football]) {
        newSquad.football.captainId = undefined;
      }
    } else {
      newSquad.f1 = {
        ...newSquad.f1,
        [pickerSlot]: undefined
      };
      if (newSquad.f1.captainId === state.fantasySquad.f1[pickerSlot as keyof typeof state.fantasySquad.f1]) {
        newSquad.f1.captainId = undefined;
      }
    }
    updateFantasySquad(newSquad);
    setShowPicker(false);
  };
  const selectPlayer = (id: string) => {
    const newSquad = {
      ...state.fantasySquad
    };
    if (pickerMode === 'football') {
      newSquad.football = {
        ...newSquad.football,
        [pickerSlot]: id
      };
    } else {
      newSquad.f1 = {
        ...newSquad.f1,
        [pickerSlot]: id
      };
    }
    updateFantasySquad(newSquad);
    setShowPicker(false);
  };
  const setCaptain = (mode: 'football' | 'f1', playerId: string) => {
    const newSquad = {
      ...state.fantasySquad
    };
    if (mode === 'football') {
      newSquad.football.captainId = playerId;
    } else {
      newSquad.f1.captainId = playerId;
    }
    updateFantasySquad(newSquad);
  };
  
  const simulateSquad = () => {
    const newSquad = {
      football: {
        FWD: FOOTBALL_PLAYERS.find(p => p.role === 'FWD')?.id,
        MID: FOOTBALL_PLAYERS.find(p => p.role === 'MID')?.id,
        DEF: FOOTBALL_PLAYERS.find(p => p.role === 'DEF')?.id,
        FLEX: FOOTBALL_PLAYERS.find(p => p.role === 'FWD' && p.id !== FOOTBALL_PLAYERS.find(p => p.role === 'FWD')?.id)?.id || FOOTBALL_PLAYERS[3]?.id,
        captainId: FOOTBALL_PLAYERS.find(p => p.role === 'FWD')?.id
      },
      f1: {
        driver1: F1_DRIVERS[0]?.id,
        driver2: F1_DRIVERS[1]?.id,
        team: F1_TEAMS[0]?.id,
        captainId: F1_DRIVERS[0]?.id
      }
    };
    updateFantasySquad(newSquad);
  };
  
  const lockTime = state.weeklySlate ? new Date(state.weeklySlate.lockISO) : null;
  const timeToLock = lockTime ? Math.max(0, lockTime.getTime() - Date.now()) : 0;
  const hoursToLock = Math.floor(timeToLock / (1000 * 60 * 60));
  const minutesToLock = Math.floor(timeToLock % (1000 * 60 * 60) / (1000 * 60));
  return <div className="min-h-screen fade-in">
      <div className="container mx-auto max-w-[432px]">
        <div className="p-4">
          <h1 className="text-3xl font-semibold tracking-tight text-rb-text mb-2">FANTASY SQUAD</h1>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-rb-subtext text-sm">
                  Week: {state.weeklySlate?.weekId || 'N/A'}
                </p>
                {!locked && <p className="text-white text-sm font-semibold">
                    Lock in: {hoursToLock}h {minutesToLock}m
                  </p>}
                {locked && <p className="text-white text-sm font-semibold">LOCKED</p>}
              </div>
              <button 
                onClick={() => navigate('/boards')} 
                className="h-12 px-5 rounded-full bg-rb-pill text-rb-text font-semiboldborder-rb-line active:scale-[0.98] transition"
              >
                Leaderboards
              </button>
            </div>
            {!locked && (
              <button 
                onClick={simulateSquad} 
                className="w-full h-12 px-5 rounded-full bg-rb-red text-white font-semibold shadow-soft active:scale-[0.98] transition"
              >
                Auto-Fill Squad (Simulate)
              </button>
            )}
          </div>
        </div>
        {/* Football Squad */}
        <div className="mx-4 mb-4 rb-card rounded-2xl shadow-cardborder-rb-line p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-rb-text">Football Squad</h2>
            <p className={`text-sm ${footballCost > FOOTBALL_SALARY_CAP ? 'text-[#FFB4B4]' : 'text-rb-subtext'}`}>
              Used {footballCost} / {FOOTBALL_SALARY_CAP}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['FWD', 'MID', 'DEF', 'FLEX'] as const).map(slot => {
              const playerId = state.fantasySquad.football[slot];
              const player = playerId ? FOOTBALL_PLAYERS.find(p => p.id === playerId) : null;
              const isCaptain = playerId === state.fantasySquad.football.captainId;
              
              return (
                <div key={slot} className="rb-card rounded-xlborder-rb-line p-3">
                  <p className="text-rb-muted text-xs mb-2">{slot}</p>
                  {player ? (
                    <div 
                      onClick={() => !locked && openPicker('football', slot)}
                      className={!locked ? "cursor-pointer hover:bg-white/5 -m-3 p-3 rounded-xl transition" : ""}
                    >
                      <p className="text-rb-text text-sm font-semibold mb-1">
                        {player.name}
                      </p>
                      <div className="inline-block px-2 py-0.5 rounded bg-rb-pill text-rb-subtext text-xs mb-1">
                        {player.role}
                      </div>
                      <p className="text-rb-muted text-xs mb-2">
                        ${player.cost}
                      </p>
                      {!locked && playerId && (
                        <div className="flex gap-1">
                          {!isCaptain && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCaptain('football', playerId);
                              }} 
                              className="text-xs px-2 py-1 rounded bg-rb-pill text-rb-subtextborder-rb-line"
                            >
                              Set Captain
                            </button>
                          )}
                          {isCaptain && (
                            <div className="text-xs px-2 py-1 rounded bg-rb-red text-white font-semibold">
                              Captain
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => openPicker('football', slot)} 
                      disabled={locked} 
                      className="w-full h-20 border-2 border-dashed border-rb-line rounded-lg flex items-center justify-center text-rb-muted disabled:opacity-50"
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* F1 Squad */}
        <div className="mx-4 mb-4 rb-card rounded-2xl shadow-cardborder-rb-line p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-rb-text">F1 Squad</h2>
            <p className={`text-sm ${f1Cost > F1_SALARY_CAP ? 'text-[#FFB4B4]' : 'text-rb-subtext'}`}>
              Used {f1Cost} / {F1_SALARY_CAP}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['driver1', 'driver2'] as const).map(slot => {
              const driverId = state.fantasySquad.f1[slot];
              const driver = driverId ? F1_DRIVERS.find(d => d.id === driverId) : null;
              const isCaptain = driverId === state.fantasySquad.f1.captainId;
              
              return (
                <div key={slot} className="rb-card rounded-xlborder-rb-line p-3">
                  <p className="text-rb-muted text-xs mb-2">
                    {slot === 'driver1' ? 'DRIVER 1' : 'DRIVER 2'}
                  </p>
                  {driver ? (
                    <div 
                      onClick={() => !locked && openPicker('f1', slot)}
                      className={!locked ? "cursor-pointer hover:bg-white/5 -m-3 p-3 rounded-xl transition" : ""}
                    >
                      <p className="text-rb-text text-sm font-semibold mb-1">
                        {driver.name}
                      </p>
                      <p className="text-rb-muted text-xs mb-2">
                        ${driver.cost}
                      </p>
                      {!locked && driverId && (
                        <div className="flex gap-1">
                          {!isCaptain && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCaptain('f1', driverId);
                              }} 
                              className="text-xs px-2 py-1 rounded bg-rb-pill text-rb-subtextborder-rb-line"
                            >
                              Set Captain
                            </button>
                          )}
                          {isCaptain && (
                            <div className="text-xs px-2 py-1 rounded bg-rb-red text-white font-semibold">
                              Captain
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => openPicker('f1', slot)} 
                      disabled={locked} 
                      className="w-full h-20 border-2 border-dashed border-rb-line rounded-lg flex items-center justify-center text-rb-muted disabled:opacity-50"
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  )}
                </div>
              );
            })}
            <div className="rb-card rounded-xlborder-rb-line p-3 col-span-2">
              <p className="text-rb-muted text-xs mb-2">TEAM</p>
              {state.fantasySquad.f1.team ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rb-text text-sm font-semibold">
                      {F1_TEAMS.find(t => t.id === state.fantasySquad.f1.team)?.name}
                    </p>
                    <p className="text-rb-muted text-xs">
                      ${F1_TEAMS.find(t => t.id === state.fantasySquad.f1.team)?.cost}
                    </p>
                  </div>
                  {!locked && (
                    <button 
                      onClick={() => openPicker('f1', 'team')} 
                      className="text-xs px-3 py-1 rounded bg-rb-pill text-rb-subtextborder-rb-line"
                    >
                      Change
                    </button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => openPicker('f1', 'team')} 
                  disabled={locked} 
                  className="w-full h-20 border-2 border-dashed border-rb-line rounded-lg flex items-center justify-center text-rb-muted disabled:opacity-50"
                >
                  <span className="text-2xl">+</span>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Dev Panel */}
        <DevPanel />
        
        {/* Player Picker Modal */}
        {showPicker && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50">
            <div className="rb-card w-full rounded-t-2xl max-h-[70vh] overflow-auto border-t border-rb-line">
              <div className="p-4 border-b border-rb-line flex justify-between items-center sticky top-0 glass-header">
                <h3 className="text-rb-text font-semibold">
                  {pickerMode === 'football' ? 'Select Player' : 'Select Driver/Team'}
                </h3>
                <button 
                  onClick={() => setShowPicker(false)} 
                  className="text-rb-text text-2xl w-10 h-10 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                {/* Show Remove button if slot is filled */}
                {((pickerMode === 'football' && state.fantasySquad.football[pickerSlot as keyof typeof state.fantasySquad.football]) ||
                  (pickerMode === 'f1' && state.fantasySquad.f1[pickerSlot as keyof typeof state.fantasySquad.f1])) && (
                  <button 
                    onClick={removePlayer} 
                    className="w-full mb-4 h-12 px-5 rounded-full bg-red-600 text-white font-semibold active:scale-[0.98] transition"
                  >
                    Remove Player
                  </button>
                )}
                
                {pickerMode === 'football' && (
                  <div className="space-y-2">
                    {FOOTBALL_PLAYERS.filter(p => {
                      if (pickerSlot === 'FLEX') return true;
                      return p.role === pickerSlot;
                    }).map(player => (
                      <button 
                        key={player.id} 
                        onClick={() => selectPlayer(player.id)} 
                        className="w-full rb-cardborder-rb-line p-4 rounded-xl text-left active:scale-[0.98] transition"
                      >
                        <p className="text-rb-text font-semibold mb-1">{player.name}</p>
                        <p className="text-rb-subtext text-sm">
                          {player.role} • {player.club} • ${player.cost}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {pickerMode === 'f1' && pickerSlot !== 'team' && (
                  <div className="space-y-2">
                    {F1_DRIVERS.map(driver => (
                      <button 
                        key={driver.id} 
                        onClick={() => selectPlayer(driver.id)} 
                        className="w-full rb-cardborder-rb-line p-4 rounded-xl text-left active:scale-[0.98] transition"
                      >
                        <p className="text-rb-text font-semibold mb-1">{driver.name}</p>
                        <p className="text-rb-subtext text-sm">
                          {driver.team} • ${driver.cost}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {pickerMode === 'f1' && pickerSlot === 'team' && (
                  <div className="space-y-2">
                    {F1_TEAMS.map(team => (
                      <button 
                        key={team.id} 
                        onClick={() => selectPlayer(team.id)} 
                        className="w-full rb-cardborder-rb-line p-4 rounded-xl text-left active:scale-[0.98] transition"
                      >
                        <p className="text-rb-text font-semibold mb-1">{team.name}</p>
                        <p className="text-rb-subtext text-sm">${team.cost}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>;
}
// ============================================================================
// LEADERBOARDS SCREEN
// ============================================================================
function BoardsScreen() {
  const {
    state,
    leaderboards,
    userProfile,
    toggleDemoMode,
    resetDemoData,
    updateUserCountry,
    updateLeaderboardFilters
  } = useContext(AppContext);
  const [sport, setSport] = useState<SportType>(state.lastLeaderboardFilters.sport);
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly'>(state.lastLeaderboardFilters.timeframe);
  const [scope, setScope] = useState<'Country' | 'Global'>(state.lastLeaderboardFilters.scope);
  const [selectedCountry, setSelectedCountry] = useState(state.lastLeaderboardFilters.country);
  const [showSettings, setShowSettings] = useState(false);
  const eventDate = new Date();
  const weekId = state.weeklySlate?.weekId || 'week_2025_1_13';
  const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
  const sportWeekKey = `${sport}:${weekId}`;
  const sportMonthKey = `${sport}:${monthKey}`;
  const getFilteredBoard = (board: LeaderboardEntry[]) => {
    if (scope === 'Country') {
      return board.filter(entry => entry.country === selectedCountry);
    }
    return board;
  };
  const weeklyBoard = getFilteredBoard(leaderboards.weeklySportBoards[sportWeekKey] || []);
  const monthlyBoard = getFilteredBoard(leaderboards.monthlySportBoards[sportMonthKey] || []);
  const globalBoard = getFilteredBoard(leaderboards.globalSeasonBoard);
  const renderLeaderboard = (title: string, board: LeaderboardEntry[], showCountryFlag: boolean) => {
    const top20 = board.slice(0, 20);
    const userRank = board.findIndex(e => e.userId === userProfile.userId) + 1;
    const userEntry = board.find(e => e.userId === userProfile.userId);
    
    return (
      <div className="rb-card rounded-2xl shadow-cardborder-rb-line p-4 mb-4">
        <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide break-words">{title}</h3>
        {top20.length === 0 ? (
          <p className="text-rb-subtext text-sm text-center py-4">
            No data available
          </p>
        ) : (
          <>
            {top20.map((entry, index) => (
              <div 
                key={entry.userId} 
                className={`flex items-center justify-between py-3 border-b border-rb-line/60 last:border-b-0 ${
                  entry.userId === userProfile.userId ? 'bg-white/5 -mx-2 px-4 rounded-lg' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-semibold w-6 ${entry.userId === userProfile.userId ? 'text-rb-red' : 'text-rb-text'}`}>{index + 1}</span>
                  <div>
                    <p className={`font-semibold text-sm ${entry.userId === userProfile.userId ? 'text-rb-red' : 'text-rb-text'}`}>{entry.name}</p>
                    {showCountryFlag && (
                      <p className="text-rb-muted text-xs">
                        {COUNTRY_FLAGS[entry.country] || ''}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rb-subtext text-sm">
                    {entry.points} pts
                  </span>
                  {index < 3 && (
                    <span className="text-xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {userEntry && userRank > 20 && (
              <div className="flex items-center justify-between py-3 mt-2 bg-white/5 px-4 rounded-lg border-t-2 border-rb-red">
                <div className="flex items-center gap-3">
                  <span className="text-rb-red font-semibold w-6">{userRank}</span>
                  <div>
                    <p className="text-rb-red font-semibold text-sm">
                      {userEntry.name}
                    </p>
                    {showCountryFlag && (
                      <p className="text-rb-muted text-xs">
                        {COUNTRY_FLAGS[userEntry.country] || ''}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-rb-subtext text-sm">
                  {userEntry.points} pts
                </span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  return <div className="min-h-screen fade-in">
      <div className="container mx-auto max-w-[432px]">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold tracking-tight text-rb-text">LEADERBOARDS</h1>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="text-rb-text text-xl w-10 h-10 flex items-center justify-center"
            >
              ⚙
            </button>
          </div>
          
          {showSettings && (
            <div className="rb-card rounded-2xl shadow-cardborder-rb-line p-4 mb-4">
              <h3 className="text-rb-text font-semibold mb-3">SETTINGS</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-rb-text">Demo Mode</span>
                <button 
                  onClick={toggleDemoMode} 
                  className={`px-4 h-10 rounded-full font-semibold ${
                    state.demoMode ? 'bg-rb-red text-white' : 'bg-rb-pill text-rb-subtextborder-rb-line'
                  }`}
                >
                  {state.demoMode ? 'ON' : 'OFF'}
                </button>
              </div>
              <button 
                onClick={resetDemoData} 
                className="h-12 px-5 rounded-full bg-rb-pill text-rb-text font-semiboldborder-rb-line w-full"
              >
                Reset Demo Data
              </button>
            </div>
          )}
          
          {/* Filter Pills Container */}
          <div className="rb-card rounded-2xlborder-rb-line p-3 mb-4">
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => {
                  setSport('Football');
                  updateLeaderboardFilters({ sport: 'Football' });
                }} 
                className={`px-3 h-8 rounded-full text-sm font-semibold transition ${
                  sport === 'Football' 
                    ? 'bg-rb-red text-white' 
                    : 'bg-rb-pill text-rb-textborder-rb-line'
                }`}
              >
                Football
              </button>
              <button 
                onClick={() => {
                  setSport('Formula 1');
                  updateLeaderboardFilters({ sport: 'Formula 1' });
                }} 
                className={`px-3 h-8 rounded-full text-sm font-semibold transition ${
                  sport === 'Formula 1' 
                    ? 'bg-rb-red text-white' 
                    : 'bg-rb-pill text-rb-textborder-rb-line'
                }`}
              >
                F1
              </button>
            </div>
            
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => {
                  setTimeframe('Weekly');
                  updateLeaderboardFilters({ timeframe: 'Weekly' });
                }} 
                className={`px-3 h-8 rounded-full text-sm font-semibold transition ${
                  timeframe === 'Weekly' 
                    ? 'bg-rb-red text-white' 
                    : 'bg-rb-pill text-rb-textborder-rb-line'
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => {
                  setTimeframe('Monthly');
                  updateLeaderboardFilters({ timeframe: 'Monthly' });
                }} 
                className={`px-3 h-8 rounded-full text-sm font-semibold transition ${
                  timeframe === 'Monthly' 
                    ? 'bg-rb-red text-white' 
                    : 'bg-rb-pill text-rb-textborder-rb-line'
                }`}
              >
                Monthly
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setScope('Country');
                  updateLeaderboardFilters({ scope: 'Country' });
                }} 
                className={`px-3 h-8 rounded-full text-sm font-semibold transition ${
                  scope === 'Country' 
                    ? 'bg-rb-red text-white' 
                    : 'bg-rb-pill text-rb-textborder-rb-line'
                }`}
              >
                Country
              </button>
              <button 
                onClick={() => {
                  setScope('Global');
                  updateLeaderboardFilters({ scope: 'Global' });
                }} 
                className={`px-3 h-8 rounded-full text-sm font-semibold transition ${
                  scope === 'Global' 
                    ? 'bg-rb-red text-white' 
                    : 'bg-rb-pill text-rb-textborder-rb-line'
                }`}
              >
                Global
              </button>
            </div>
          </div>
          
          {scope === 'Country' && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {COUNTRIES.map(country => (
                <button 
                  key={country} 
                  onClick={() => {
                    setSelectedCountry(country);
                    updateUserCountry(country);
                    updateLeaderboardFilters({ country });
                  }} 
                  className={`px-3 h-8 rounded-full text-sm font-semibold transition ${
                    selectedCountry === country 
                      ? 'bg-rb-red text-white' 
                      : 'bg-rb-pill text-rb-textborder-rb-line'
                  }`}
                >
                  {COUNTRY_FLAGS[country]} {country}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4">
          {timeframe === 'Weekly' && renderLeaderboard(`${sport} - Weekly (${weekId})`, weeklyBoard, scope === 'Global')}
          {timeframe === 'Monthly' && renderLeaderboard(`${sport} - Monthly (${monthKey})`, monthlyBoard, scope === 'Global')}
          {renderLeaderboard('Global Overall - Season', globalBoard, scope === 'Global')}
        </div>
      </div>
    </div>;
}
// ============================================================================
// DEV PANEL
// ============================================================================
function DevPanel() {
  const {
    state,
    simulateWeek,
    calculateFantasyPoints,
    toggleDemoMode,
    resetDemoData,
    updateUserCountry,
    updateLeaderboardFilters
  } = useContext(AppContext);
  const [showPanel, setShowPanel] = useState(false);
  // Only show in dev mode (check for localhost or dev flag)
  const isDev = window.location.hostname === 'localhost' || window.location.search.includes('dev=true');
  if (!isDev) return null;
  
  return (
    <div className="mx-4 mb-4">
      <button 
        onClick={() => setShowPanel(!showPanel)} 
        className="h-12 px-5 rounded-full bg-rb-red text-white font-semibold shadow-soft active:scale-[0.98] transition w-full"
      >
        {showPanel ? 'Hide Dev Panel' : 'Show Dev Panel'}
      </button>
      {showPanel && (
        <div className="rb-card rounded-2xl shadow-cardborder-rb-line p-4 mt-3">
          <h3 className="text-rb-text font-semibold mb-3 uppercase tracking-wide">DEVELOPER PANEL</h3>
          <div className="space-y-2">
            <button 
              onClick={simulateWeek} 
              className="h-10 px-4 rounded-full bg-rb-pill text-rb-text font-semiboldborder-rb-line w-full active:scale-[0.98] transition"
            >
              Simulate Week
            </button>
            <button 
              onClick={calculateFantasyPoints} 
              className="h-10 px-4 rounded-full bg-rb-pill text-rb-text font-semiboldborder-rb-line w-full active:scale-[0.98] transition"
            >
              Calculate Fantasy Points
            </button>
            <button 
              onClick={toggleDemoMode} 
              className="h-10 px-4 rounded-full bg-rb-pill text-rb-text font-semibold border-rb-line w-full active:scale-[0.98] transition"
            >
              Toggle Demo Mode
            </button>
            <button 
              onClick={resetDemoData} 
              className="h-10 px-4 rounded-full bg-rb-pill text-rb-text font-semibold border-rb-line w-full active:scale-[0.98] transition"
            >
              Reset Demo Data
            </button>
            <div className="bg-rb-navy p-3 rounded-xl mt-3 border-rb-line">
              <p className="text-rb-muted text-xs mb-1">RNG Seed</p>
              <p className="text-rb-text text-sm font-mono">{state.rngSeed}</p>
            </div>
            {state.simulatedStats && (
              <div className="bg-rb-navy p-3 rounded-xl mt-2 border-rb-line">
                <p className="text-rb-muted text-xs mb-1">Simulated</p>
                <p className="text-rb-text text-sm">
                  Football: {state.simulatedStats.footballMatches.length} matches
                </p>
                <p className="text-rb-text text-sm">
                  F1: {state.simulatedStats.f1Race ? 'Yes' : 'No'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// --- Home Screen ---
function HomeScreen() {
  const {
    state,
    userProfile,
    updateUserCountry,
    events
  } = useContext(AppContext);
  const navigate = useNavigate();
  const upcomingEvents = events.filter(e => e.startTime > Date.now()).slice(0, 3);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const cardWidth = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentEventIndex(index);
  };
  
  const currentEvent = upcomingEvents[currentEventIndex];
  
  return <div className="min-h-screen fade-in">
      {/* Hero Carousel - Full width from top */}
      <div className="relative mb-6">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide" 
          onScroll={handleScroll}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id}
                className="flex-shrink-0 w-full snap-center"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div
                  className="relative h-[70vh] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/pick/${event.id}`)}
                  style={{
                    backgroundImage: event.sport === 'Football' 
                      ? 'url(/rb.png)' 
                      : event.sport === 'Formula 1' 
                      ? 'url(/F1.png)' 
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  
                  {/* Hero Content */}
                  <div className="container mx-auto max-w-[432px] h-full relative">
                    <div className="absolute bottom-10 left-0 right-0 p-6">
                      <div className="-mt-32 mb-8">
                        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
                          PREDICT. WIN. REPEAT.
                        </h2>
                        <p className="text-[13px] leading-6 text-white/80">
                          Ready to put your Red Bull sports knowledge to the test?
                          Tap to start and see how well you really know Red Bull teams, athletes, and their most iconic moments.  
                        </p>
                      </div>

                       
                      
                      <div className="mb-1 mt-1 p-4">
                        {/* Event Info */}
                        <div className="mb-1 mt-2">
                          <h4 className="flex justify-center text-xl font-semibold text-white mb-1">{event.title}</h4>
                          <p className="flex justify-center text-sm text-white/70 mb-3">{event.sport} - {event.isLocked ? 'LOCKED' : `Starts in ${Math.floor((event.startTime - Date.now()) / (60 * 1000))} mins`}</p>
                        </div>
                        
                        <div className="flex justify-center">
                          <button 
                            className="h-12 px-8 rounded-full bg-white text-black font-semibold shadow-soft active:scale-[0.98] transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/pick/${event.id}`);
                            }}
                          >
                            Predict Now
                          </button>
                        </div>
                        
                        {/* Scroll indicator - only show if there are multiple events */}
                        {upcomingEvents.length > 1 && (
                          <div className="flex justify-center items-center gap-1 mt-2">
                            <div className="flex gap-1.5">
                              {upcomingEvents.map((_, index) => (
                                <div 
                                  key={index}
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentEventIndex 
                                      ? 'bg-white w-6' 
                                      : 'bg-white/40 w-2'
                                  }`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        )}               </div>
                     
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fade transition overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-rb-navy to-transparent pointer-events-none"></div>
      </div>
      
      <div className="container mx-auto max-w-[432px] -mt-16">

        {/* Passport Section */}
        {state.passport.badge && (
          <div className="mx-4 mb-4 rb-card rounded-2xl shadow-card p-4">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              SEASON PASSPORT
            </h3>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-rb-red rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <p className="text-rb-text font-semibold mb-1">Season Pass Unlocked!</p>
                <p className="text-rb-subtext text-sm">
                  Badge: {state.passport.badge}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Streak Section */}
        <div className="mx-2 mb-2 rounded-2xl p-4 text-center">
          <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">
            CURRENT STREAK
          </h3>
          <div className="flex items-baseline justify-center mb-1">
            <span className="text-2xl font-semibold text-rb-text mr-2">
              {state.streakDays}
            </span>
            <span className="text-sm text-rb-text">DAYS</span>
          </div>
          <p className="text-rb-subtext text-xs mb-1">
            {state.streakDays >= 7 ? 'You earned a Wing Token!' : `${7 - state.streakDays} more days until you earn a Wing Token`}
          </p>
          <p className="text-white text-sm font-semibold">
            Wing Tokens: {state.wingTokens}
          </p>
        </div>
      </div>
    </div>;
}
// --- Events Screen ---
function EventsScreen() {
  const {
    events
  } = useContext(AppContext);
  const navigate = useNavigate();
  const upcomingEvents = events.filter(event => event.startTime > Date.now());
  const pastEvents = events.filter(event => event.startTime <= Date.now());
  
  const renderEventItem = (item: Event) => {
    const minsToStart = Math.floor((item.startTime - Date.now()) / (60 * 1000));
    
    return (
      <div 
        key={item.id} 
        className="rb-card rounded-2xl shadow-card border-rb-line mx-4 mb-3 p-4 cursor-pointer active:scale-[0.98] transition flex items-center" 
        onClick={() => navigate(`/pick/${item.id}`)}
      >
        <div className="flex-1">
          <h3 className="text-base font-semibold text-rb-text mb-1">{item.title}</h3>
          <p className="text-xs text-rb-muted mb-2">{item.sport}</p>
          {item.isLocked ? (
            <div className="inline-block px-3 h-8 rounded-full bg-rb-pill text-[#FF6464]border-rb-line text-sm flex items-center">
              LOCKED
            </div>
          ) : (
            <div className="inline-block px-3 h-8 rounded-full bg-rb-pill text-rb-text border-rb-line text-sm flex items-center">
              Starts in {minsToStart}m
            </div>
          )}
        </div>
        <div className="ml-2">
          <span className="text-2xl text-rb-muted">›</span>
        </div>
      </div>
    );
  };
  
  return <div className="min-h-screen fade-in">
      <div className="container mx-auto max-w-[432px]">
        <div className="p-4">
          <h1 className="text-3xl font-semibold tracking-tight text-rb-text">EVENTS</h1>
        </div>
        <div className="mb-6">
          <h2 className="text-white font-semibold text-sm ml-4 mb-3 uppercase tracking-wide">
            UPCOMING
          </h2>
          <div>{upcomingEvents.map(renderEventItem)}</div>
        </div>
        <div className="mb-6">
          <h2 className="text-white font-semibold text-sm ml-4 mb-3 uppercase tracking-wide">PAST</h2>
          <div>{pastEvents.map(renderEventItem)}</div>
        </div>
      </div>
    </div>;
}
// --- Pick Sheet Screen ---
function PickSheetScreen() {
  const {
    events,
    state,
    makePick,
    simulateResults,
    revealResults
  } = useContext(AppContext);
  const {
    eventId
  } = useParams<{
    eventId: string;
  }>();
  const navigate = useNavigate();
  
  if (!eventId) return <div>Event not found</div>;
  
  const event = events.find(e => e.id === eventId);
  if (!event) return <div>Event not found</div>;
  const userPick = state.picks.find(p => p.eventId === eventId);
  const results = state.results[eventId];
  const points = state.points[eventId];
  const renderPickOptions = (key: PickKeys) => {
    let options: PickOption[] = [];
    if (event.sport === 'Football') {
      if (key === 'matchResult') {
        options = ['RB win', 'Draw', 'Opponent win'];
      } else if (key === 'firstScorer') {
        const meta = event.meta as FootballMeta;
        options = meta.scorers;
      } else if (key === 'totalGoals') {
        options = ['0–1', '2–3', '4–5', '6+'];
      }
    } else if (event.sport === 'Formula 1') {
      if (key === 'raceWinner' || key === 'fastestLap') {
        options = ['Max Verstappen', 'Sergio Pérez', 'Yuki Tsunoda', 'Daniel Ricciardo'];
      } else if (key === 'safetyCar') {
        options = ['Yes', 'No'];
      }
    }
    
    const keyLabel = key === 'matchResult' ? 'Match Result' 
      : key === 'firstScorer' ? 'First RB Scorer' 
      : key === 'totalGoals' ? 'Total Goals' 
      : key === 'raceWinner' ? 'Race Winner' 
      : key === 'fastestLap' ? 'Fastest Lap' 
      : key === 'safetyCar' ? 'Safety Car' 
      : '';
    
    return (
      <div key={key} className="mb-4">
        <h3 className="text-base font-semibold text-rb-text ml-4 mb-3">
          {keyLabel}
        </h3>
        <div className="px-4 overflow-x-auto -mx-4">
          <div className="flex px-4 py-2 gap-2 snap-x snap-mandatory">
            {options.map(option => (
              <button 
                key={option} 
                className={`px-4 h-8 rounded-full text-sm whitespace-nowrap font-semibold transition snap-start
                  ${userPick?.picks[key] === option 
                    ? 'bg-rb-red text-white' 
                    : 'bg-rb-pill text-rb-textborder-rb-line'
                  } 
                  ${results && results[key] === option ? 'bg-green-600 text-white' : ''}
                  ${event.isLocked ? 'opacity-60' : 'active:scale-[0.98]'}
                `} 
                onClick={() => !event.isLocked && makePick(eventId, key, option)} 
                disabled={event.isLocked}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  return <div className="min-h-screen fade-in">
      <div className="container mx-auto max-w-[432px]">
        {/* Hero Header */}
        <div className="relative h-[300px] mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rb-red/20 to-rb-navy"></div>
          <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-rb-navy via-rb-navy/80 to-transparent"></div>
          <button 
            className="absolute top-4 left-4 text-rb-text w-10 h-10 flex items-center justify-center" 
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          {event.isLocked && (
            <div className="absolute top-4 right-4 px-3 h-8 rounded-full bg-rb-pill text-[#FF6464]border-rb-line text-sm flex items-center font-semibold">
              LOCKED
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-semibold tracking-tight text-rb-text mb-2">
              {event.title}
            </h1>
            <p className="text-[15px] leading-6 text-rb-subtext">{event.sport}</p>
          </div>
        </div>
        
        <div className="mb-6">{event.pickKeys.map(renderPickOptions)}</div>
        
        {points !== undefined && (
          <div className="mx-4 p-5 rb-card rounded-2xl shadow-cardborder-rb-line mb-4 text-center">
            <h3 className="text-white font-semibold text-sm mb-2 uppercase tracking-wide">RESULTS</h3>
            <p className="text-rb-text font-semibold text-3xl">{points} POINTS</p>
          </div>
        )}
        
        <div className="flex px-4 gap-3 mb-6">
          <button 
            className="flex-1 h-12 px-4 rounded-full bg-rb-red text-white font-semibold shadow-soft active:scale-[0.98] transition" 
            onClick={() => revealResults(event)}
          >
            {points !== undefined ? 'Reveal results' : 'Predict now'}
          </button>
          <button 
            className="h-12 px-4 rounded-full bg-rb-pill text-rb-text font-semiboldborder-rb-line active:scale-[0.98] transition whitespace-nowrap" 
            onClick={() => simulateResults(event)}
            title="Simulate Results"
            aria-label="Simulate Results"
          >
            Simulate
          </button>
        </div>
      </div>
    </div>;
}
// --- Live Screen ---
function LiveScreen() {
  const {
    events,
    state
  } = useContext(AppContext);
  const liveEvents = events.filter(event => event.startTime <= Date.now());
  const renderLiveEvent = (event: Event) => {
    const userPick = state.picks.find(p => p.eventId === event.id);
    const results = state.results[event.id];
    const points = state.points[event.id];
    if (!userPick) return null;
    
    return (
      <div className="rb-card mx-4 mb-4 rounded-2xl shadow-cardborder-rb-line overflow-hidden" key={event.id}>
        <div className="p-4 border-b border-rb-line flex justify-between items-center">
          <h3 className="text-rb-text font-semibold">{event.title}</h3>
          <span className="px-3 h-6 rounded-full bg-rb-red text-white text-xs font-semibold flex items-center">
            {Date.now() - event.startTime < 2 * 60 * 60 * 1000 ? 'LIVE' : 'COMPLETED'}
          </span>
        </div>
        <div className="p-4 flex gap-4">
          <div className="flex-1">
            <h4 className="text-rb-muted text-sm font-semibold mb-2 uppercase tracking-wide">
              YOUR PICKS
            </h4>
            {Object.entries(userPick.picks).map(([key, value]) => (
              <div className="mb-2" key={key}>
                <p className="text-rb-muted text-xs mb-0.5">
                  {key === 'matchResult' ? 'Match Result' 
                    : key === 'firstScorer' ? 'First Scorer' 
                    : key === 'totalGoals' ? 'Total Goals' 
                    : key === 'raceWinner' ? 'Race Winner' 
                    : key === 'fastestLap' ? 'Fastest Lap' 
                    : key === 'safetyCar' ? 'Safety Car' 
                    : ''}
                </p>
                <p className={`text-sm ${
                  results && results[key as PickKeys] === value 
                    ? 'text-green-500 font-semibold' 
                    : 'text-rb-text'
                }`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          {results && (
            <div className="flex-1">
              <h4 className="text-rb-muted text-sm font-semibold mb-2 uppercase tracking-wide">RESULTS</h4>
              {Object.entries(results).map(([key, value]) => (
                <div className="mb-2" key={key}>
                  <p className="text-rb-muted text-xs mb-0.5">
                    {key === 'matchResult' ? 'Match Result' 
                      : key === 'firstScorer' ? 'First Scorer' 
                      : key === 'totalGoals' ? 'Total Goals' 
                      : key === 'raceWinner' ? 'Race Winner' 
                      : key === 'fastestLap' ? 'Fastest Lap' 
                      : key === 'safetyCar' ? 'Safety Car' 
                      : ''}
                  </p>
                  <p className="text-rb-text text-sm">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {points !== undefined && (
          <div className="p-4 bg-rb-panel2 text-center border-t border-rb-line">
            <p className="text-rb-text font-semibold">{points} POINTS</p>
          </div>
        )}
      </div>
    );
  };
  return <div className="min-h-screen fade-in">
      <div className="container mx-auto max-w-[432px]">
        <div className="p-4">
          <h1 className="text-3xl font-semibold tracking-tight text-rb-text">LIVE RESULTS</h1>
        </div>
        
        {/* Passport Card */}
        {state.passport.badge && (
          <div className="rb-card mx-4 mb-4 rounded-2xl shadow-cardborder-rb-line overflow-hidden">
            <div className="p-4 border-b border-rb-line">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                SEASON PASSPORT
              </h3>
            </div>
            <div className="p-4">
              <p className="text-rb-text text-sm mb-2">
                Badge: {state.passport.badge}
              </p>
              <div className="flex justify-between">
                <p className="text-rb-subtext text-xs">
                  Watched: {state.passport.watched}/1
                </p>
                <p className="text-rb-subtext text-xs">
                  Predicted: {state.passport.predicted}/3
                </p>
                <p className="text-rb-subtext text-xs">
                  Created: {state.passport.created}/1
                </p>
              </div>
            </div>
          </div>
        )}
        
        {liveEvents.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-rb-subtext">No live events at the moment</p>
          </div>
        ) : (
          liveEvents.map(renderLiveEvent)
        )}
      </div>
    </div>;
}
// --- Search Screen ---
function SearchScreen() {
  const navigate = useNavigate();
  
  return <div className="min-h-screen fade-in">
      <div className="container mx-auto max-w-[432px]">
        <div className="p-4">
          <h1 className="text-3xl font-semibold tracking-tight text-rb-text mb-4">SEARCH</h1>
          <div className="rb-card rounded-2xlborder-rb-line p-4 mb-4">
            <p className="text-rb-muted">Search for events...</p>
          </div>
        </div>
        
        <div className="px-4 grid grid-cols-2 gap-3">
          <div 
            className="rb-card rounded-2xl shadow-cardborder-rb-line h-40 cursor-pointer active:scale-[0.98] transition overflow-hidden" 
            onClick={() => navigate('/events')}
          >
            <div 
              className="h-24 bg-cover bg-center"
              style={{ backgroundImage: 'url(/search/futebol.png)' }}
            ></div>
            <div className="p-3">
              <h2 className="text-base font-semibold text-rb-text mb-1">Football</h2>
              <p className="text-xs text-rb-muted">
                RB Leipzig, Salzburg
              </p>
            </div>
          </div>
          
          <div 
            className="rb-card rounded-2xl shadow-cardborder-rb-line h-40 cursor-pointer active:scale-[0.98] transition overflow-hidden" 
            onClick={() => navigate('/events')}
          >
            <div 
              className="h-24 bg-cover bg-center"
              style={{ backgroundImage: 'url(/search/formula1.jpg)' }}
            ></div>
            <div className="p-3">
              <h2 className="text-base font-semibold text-rb-text mb-1">Formula 1</h2>
              <p className="text-xs text-rb-muted">
                Red Bull Racing
              </p>
            </div>
          </div>
          
          <div 
            className="rb-card rounded-2xl shadow-cardborder-rb-line h-40 cursor-pointer active:scale-[0.98] transition overflow-hidden" 
            onClick={() => navigate('/events')}
          >
            <div 
              className="h-24 bg-cover bg-center"
              style={{ backgroundImage: 'url(/search/motor.jpeg)' }}
            ></div>
            <div className="p-3">
              <h2 className="text-base font-semibold text-rb-text mb-1">Motor</h2>
              <p className="text-xs text-rb-muted">
                Racing events
              </p>
            </div>
          </div>
          
          <div 
            className="rb-card rounded-2xl shadow-cardborder-rb-line h-40 cursor-pointer active:scale-[0.98] transition overflow-hidden" 
            onClick={() => navigate('/events')}
          >
            <div 
              className="h-24 bg-cover bg-center"
              style={{ backgroundImage: 'url(/search/surfing.png)' }}
            ></div>
            <div className="p-3">
              <h2 className="text-base font-semibold text-rb-text mb-1">Surfing</h2>
              <p className="text-xs text-rb-muted">
                Extreme sports
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}