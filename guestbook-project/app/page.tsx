'use client';

import { useState, useEffect, useCallback } from 'react';

// --- 1. 스토리 데이터 (아이템 조건 추가) ---
const STORY_DATA = {
  start: {
    text: "성문 앞에 서 있구리. 문이 굳게 잠겨 있구리.",
    options: [
      { label: "동굴로 가서 열쇠를 찾는다", to: "cave_in" },
      { label: "문 뒤로 몰래 들어간다", to: "secret_path", requiredItem: "녹슨 열쇠" }
    ]
  },
  cave_in: {
    text: "동굴 슬라임을 처치하면 열쇠를 얻을 수 있을 것 같구리!",
    isBattle: true,
    monster: { 
      name: "동굴 슬라임", level: 2, hp: 40, atk: 12, def: 5, exp: 30,
      dropItem: "녹슨 열쇠", dropRate: 0.8 // 80% 확률로 드롭
    },
    winTo: "start", // 다시 성문 앞으로 돌아감
    loseTo: "game_over"
  },
  secret_path: {
    text: "열쇠로 문을 열고 들어왔구리! 당신은 전설의 도둑이구리.",
    options: [{ label: "마을로 이동", to: "village" }]
  },
  game_over: { text: "눈앞이 캄캄해졌구리...", options: [{ label: "다시 시작", to: "start" }] }
};

export default function RPGEngine() {
  const [user, setUser] = useState({
    level: 1, hp: 100, maxHp: 100, atk: 15, def: 8, exp: 0,
    inventory: [] as string[] // 아이템 보관함
  });

  const [currentScene, setCurrentScene] = useState('start');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isInBattle, setIsInBattle] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const scene = STORY_DATA[currentScene as keyof typeof STORY_DATA];

  // --- 2. 아이템 소지 여부에 따른 선택지 필터링 ---
  const availableOptions = scene.options?.filter(opt => {
    if (!opt.requiredItem) return true;
    return user.inventory.includes(opt.requiredItem);
  }) || [];

  // --- 3. 전투 및 보상 로직 ---
  const handleBattle = useCallback((monster: any) => {
    setIsInBattle(true);
    let uHp = user.hp;
    let mHp = monster.hp;
    const logs = [`⚔️ ${monster.name}와(과) 전투 시작!`];

    // (주사위 및 턴 로직은 이전과 동일하구리...)
    while (uHp > 0 && mHp > 0) {
      const d = Math.floor(Math.random() * 32) + 1;
      const dmg = Math.max(1, (user.atk - monster.def) + (d - 16));
      mHp -= dmg;
      logs.push(`적에게 ${dmg}의 피해! (남은 HP: ${Math.max(0, mHp)})`);
      if (mHp <= 0) break;
      uHp -= Math.max(1, (monster.atk - user.def));
      logs.push(`적의 반격! ${uHp} 남았구리.`);
    }

    if (uHp > 0) {
      logs.push(`🎊 승리! 경험치 ${monster.exp} 획득!`);
      let updatedInventory = [...user.inventory];
      
      // 아이템 드롭 체크
      if (monster.dropItem && Math.random() < monster.dropRate) {
        logs.push(`🎁 [${monster.dropItem}]을(를) 획득했구리!`);
        updatedInventory.push(monster.dropItem);
      }

      setUser(prev => ({
        ...prev,
        hp: uHp,
        exp: prev.exp + monster.exp,
        inventory: updatedInventory
      }));
    }
    setBattleLog(logs);
  }, [user]);

  // --- 4. 조작 로직 ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInBattle || !availableOptions.length) return;

      if (e.key === 'ArrowUp') setSelectedIdx(p => (p > 0 ? p - 1 : availableOptions.length - 1));
      if (e.key === 'ArrowDown') setSelectedIdx(p => (p < availableOptions.length - 1 ? p + 1 : 0));
      if (e.key === 'Enter') {
        const nextSceneKey = availableOptions[selectedIdx].to;
        const nextScene = STORY_DATA[nextSceneKey as keyof typeof STORY_DATA];
        if (nextScene?.isBattle) handleBattle(nextScene.monster);
        setCurrentScene(nextSceneKey);
        setSelectedIdx(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [availableOptions, selectedIdx, isInBattle, handleBattle]);

  return (
    <main className="min-h-screen bg-black text-green-500 p-10 font-mono">
      <div className="max-w-2xl mx-auto border-2 border-green-500 p-6">
        {/* 인벤토리 표시 */}
        <div className="mb-4 text-xs text-yellow-500">
          가방: {user.inventory.length > 0 ? user.inventory.join(', ') : '비어있음'}
        </div>
        
        <p className="text-xl mb-8">{scene.text}</p>

        {!isInBattle && availableOptions.map((opt, i) => (
          <div key={i} className={`${selectedIdx === i ? 'bg-green-900 text-white' : ''} p-2`}>
            {selectedIdx === i ? '> ' : '  '} {opt.label}
          </div>
        ))}

        {isInBattle && (
          <div className="mt-4 bg-gray-900 p-2 h-40 overflow-y-auto">
            {battleLog.map((l, i) => <p key={i}>{l}</p>)}
            <button onClick={() => setIsInBattle(false)} className="mt-2 border p-1">[ 확인 ]</button>
          </div>
        )}
      </div>
    </main>
  );
}