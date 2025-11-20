import { useState } from 'react';
import FairTeamsGenerator from "./FairTeamGenerator";
import copyIconUrl from '../assets/copy.svg';
import whatsappIconUrl from '../assets/whatsapp.svg';

type FirebasePlayer = {
  id: string;
  playerName: string;
  defenseScore: number;
  offenseScore: number;
  userId: string;
  createdAt: string;
};

type Player = {
  name: string;
  defense: number;
  attack: number;
  playmaker: number;
  position: 'D' | 'M' | 'A';
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

interface GenerateTeamModalProps {
  onClose: () => void;
  players: FirebasePlayer[];
}

function GenerateTeamModal({ onClose, players }: GenerateTeamModalProps) {
  const [teams, setTeams] = useState<Combination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const handleTeamsGenerated = (generatedTeams: Combination | null, generatedStats: Stats | null) => {
    setTeams(generatedTeams);
    setStats(generatedStats);
  };

  const formatTeamsText = () => {
    if (!teams || !stats) return '';

    let text = '🏆 הרכבי קבוצות 🏆\n\n';
    
    teams.forEach((team, i) => {
      text += `קבוצה ${i + 1}:\n`;
      team.forEach(player => {
        text += `  • ${player.name} - התקפה: ${player.attack}, הגנה: ${player.defense}\n`;
      });
      text += `  ממוצע התקפה: ${stats.avgAttack[i].toFixed(2)}\n`;
      text += `  ממוצע הגנה: ${stats.avgDefense[i].toFixed(2)}\n\n`;
    });

    text += `📊 הפרשים:\n`;
    text += `התקפה: ${stats.diffs.attack.toFixed(3)} | `;
    text += `הגנה: ${stats.diffs.defense.toFixed(3)} | `;
    text += `כישורי משחק: ${stats.diffs.playmaker}`;

    return text;
  };

  const handleCopy = async () => {
    const text = formatTeamsText();
    try {
      await navigator.clipboard.writeText(text);
      alert('הועתק ללוח!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('שגיאה בהעתקה');
    }
  };

  const handleWhatsAppShare = () => {
    const text = formatTeamsText();
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-players-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>×</button>
          <h2 className="modal-title">הרכב קבוצות</h2>
          <div className="modal-actions">
            {teams && <img className="share-icon" src={copyIconUrl} alt="העתק" onClick={handleCopy} />}
            {teams && <img className="share-icon" src={whatsappIconUrl} alt="וואטסאפ" onClick={handleWhatsAppShare} />}
          </div>
        </div>
        <FairTeamsGenerator firebasePlayers={players} onTeamsGenerated={handleTeamsGenerated} />
      </div>
    </div>
  );
}

export default GenerateTeamModal;
