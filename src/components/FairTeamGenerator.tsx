
import React, { useState } from 'react';
import './FairTeamGenerator.css';

type Player = {
  name: string;
  defense: number;
  attack: number;
  playmaker: number;
  position: 'D' | 'M' | 'A';
};

type FirebasePlayer = {
  id: string;
  playerName: string;
  defenseScore: number;
  offenseScore: number;
  userId: string;
  createdAt: string;
};

type Team = Player[];
type Combination = [Team, Team, Team];
type Stats = {
  avgAttack: number[];
  avgDefense: number[];
  playmaker: number[];
  positionCounts: { D: number[]; M: number[]; A: number[] };
  diffs: { attack: number; defense: number; playmaker: number };
};

interface FairTeamsGeneratorProps {
  firebasePlayers: FirebasePlayer[];
  onTeamsGenerated?: (teams: Combination | null, stats: Stats | null) => void;
}

export default function FairTeamsGenerator({ firebasePlayers, onTeamsGenerated }: FairTeamsGeneratorProps) {
  const [teams, setTeams] = useState<Combination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // Convert Firebase players to the format needed for team generation
  const convertFirebasePlayers = (fbPlayers: FirebasePlayer[]): Player[] => {
    return fbPlayers.map(p => ({
      name: p.playerName,
      defense: p.defenseScore,
      attack: p.offenseScore,
      playmaker: 0, // Default value since Firebase doesn't have this field
      position: 'M' as 'D' | 'M' | 'A', // Default to Midfielder
    }));
  };

  // Auto-generate teams on mount when players data is available
  React.useEffect(() => {
    if (firebasePlayers && firebasePlayers.length >= 12 && firebasePlayers.length <= 15) {
      const convertedPlayers = convertFirebasePlayers(firebasePlayers);
      generateFairTeams(convertedPlayers);
    }
  }, [firebasePlayers]);

  const generateFairTeams = (players: Player[]) => {
    if (players.length < 12 || players.length > 15) {
      alert(`נדרשים 12-15 שחקנים. יש לך ${players.length} שחקנים.`);
      return;
    }

    setLoading(true);

    // Run heavy computation after render to avoid blocking UI
    setTimeout(() => {
      const result = findUltimateTeams(players);
      setTeams(result.teams);
      setStats(result.stats);
      setLoading(false);
      // Notify parent component
      if (onTeamsGenerated) {
        onTeamsGenerated(result.teams, result.stats);
      }
    }, 100);
  };

  // === EXACT PORT OF YOUR PYTHON LOGIC ===
  const findUltimateTeams = (players: Player[]) => {
    const n = players.length;
    const sizes: [number, number, number] =
      n === 12 ? [4,4,4] :
      n === 13 ? [5,4,4] :
      n === 14 ? [5,5,4] : [5,5,5];

    const allCombs: any[] = [];

    // Generate combinations (same logic as Python)
    for (const team1 of combinations(players, sizes[0])) {
      const rem1 = players.filter(p => !team1.includes(p));
      for (const team2 of combinations(rem1, sizes[1])) {
        const team3 = rem1.filter(p => !team2.includes(p));

        const stats = calculateTeamStats([team1, team2, team3]);
        allCombs.push({ teams: [team1, team2, team3], stats });
      }
    }

    // Step-by-step filtering (same as your Python)
    let filtered = allCombs.filter(c => c.stats.diffs.attack < 0.25 && c.stats.diffs.defense < 0.5);
    filtered = filtered.filter(c => c.stats.diffs.attack < 0.15 && c.stats.diffs.defense < 0.25);
    filtered = filtered.filter(c => c.stats.diffs.playmaker < 5);

    // Prefer balanced positions
    const positionBalanced = filtered.filter(c => {
      const { D, M, A } = c.stats.positionCounts;
      return D.every((n: number) => n >= 1 && n <= 3) &&
             M.every((n: number) => n >= 1 && n <= 3) &&
             A.every((n: number) => n >= 1 && n <= 3);
    });

    const finalList = positionBalanced.length >= 10 ? positionBalanced : filtered;

    const best = finalList.length > 0
      ? finalList[Math.floor(Math.random() * Math.min(100, finalList.length))]
      : allCombs[0];

    return { teams: best.teams as Combination, stats: best.stats };
  };

  const calculateTeamStats = (teams: Team[]): Stats => {
    const avgAttack = teams.map(t => t.reduce((s,p) => s + p.attack, 0) / t.length);
    const avgDefense = teams.map(t => t.reduce((s,p) => s + p.defense, 0) / t.length);
    const playmaker = teams.map(t => t.reduce((s,p) => s + p.playmaker, 0));

    const pos = { D: [0,0,0], M: [0,0,0], A: [0,0,0] };
    teams.forEach((team, i) => {
      team.forEach(p => pos[p.position][i]++);
    });

    return {
      avgAttack,
      avgDefense,
      playmaker,
      positionCounts: pos,
      diffs: {
        attack: Math.max(...avgAttack) - Math.min(...avgAttack),
        defense: Math.max(...avgDefense) - Math.min(...avgDefense),
        playmaker: Math.max(...playmaker) - Math.min(...playmaker),
      }
    };
  };

  // Helper: generate combinations (same as itertools.combinations)
  function* combinations<T>(arr: T[], k: number): Generator<T[]> {
    if (k === 0) { yield []; return; }
    if (arr.length < k) return;

    for (let i = 0; i <= arr.length - k; i++) {
      const first = arr[i];
      for (const rest of combinations(arr.slice(i + 1), k - 1)) {
        yield [first, ...rest];
      }
    }
  }

  const playerCount = firebasePlayers?.length || 0;

  return (
    <div className="team-generator-container">
      <div className="team-generator-header">
        
        {loading ? (
          <p className="team-generator-loading">
            מחשב את הקבוצות ההוגנות ביותר...
          </p>
        ) : playerCount < 12 || playerCount > 15 ? (
          <p className="team-generator-error">
            נדרשים 12-15 שחקנים. יש לך {playerCount} שחקנים.
          </p>
        ) : (
          <p > </p>
        )}
      </div>

      {teams && stats && (
        <>
          <div className="teams-grid">
            {teams.map((team, i) => (
              <div key={i} className="team-card">
                <h3 className="team-card-title">
                  קבוצה {i + 1}
                </h3>
                
                <div className="team-members">
                  {team.map(p => (
                    <div key={p.name} className="team-member">
                      <div className="member-header">
                        <span className="member-name">{p.name}</span>
                        <span className={`member-position position-${p.position.toLowerCase()}`}>
                          {p.playmaker > 3 && <span className="member-star">★</span>}
                          {p.position}
                        </span>
                      </div>
                      <div className="member-stats">
                        <div className="member-stat">
                          <span className="member-stat-label">התקפה:</span>
                          <span className="member-stat-value">{p.attack}</span>
                        </div>
                        <div className="member-stat">
                          <span className="member-stat-label">הגנה:</span>
                          <span className="member-stat-value">{p.defense}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="team-stats">
                  <div className="stat-row">
                    <span className="stat-label">התקפה:</span>
                    <span className="stat-value">{stats.avgAttack[i].toFixed(2)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">הגנה:</span>
                    <span className="stat-value">{stats.avgDefense[i].toFixed(2)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">כישורי משחק:</span>
                    <span className="stat-value">{stats.playmaker[i]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="overall-stats">
            <p>
              <span className="stat-diff">הפרש התקפה: {stats.diffs.attack.toFixed(3)}</span>
              {' | '}
              <span className="stat-diff">הפרש הגנה: {stats.diffs.defense.toFixed(3)}</span>
              {' | '}
              <span className="stat-diff">הפרש כישורי משחק: {stats.diffs.playmaker}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}