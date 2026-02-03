// Dragon Realm - Main Application

// ===== DRAGON DATABASE =====
// ===== DRAGON DATABASE =====
const DRAGONS = [
  { id: 1, name: "Ignis il Furioso", emoji: "🐲", element: "Fuoco", elementIcon: "🔥", power: 85, defense: 70, speed: 90, color: "#ff6b35", bgClass: "bg-fire" },
  { id: 2, name: "Glacius il Gelo", emoji: "🥶", element: "Ghiaccio", elementIcon: "❄️", power: 75, defense: 95, speed: 65, color: "#06b6d4", bgClass: "bg-ice" },
  { id: 3, name: "Tempesta Nera", emoji: "⚡", element: "Fulmine", elementIcon: "⚡", power: 95, defense: 60, speed: 100, color: "#a855f7", bgClass: "bg-lightning" },
  { id: 4, name: "Terra Ancestrale", emoji: "🐢", element: "Terra", elementIcon: "🌍", power: 70, defense: 100, speed: 55, color: "#84cc16", bgClass: "bg-earth" },
  { id: 5, name: "Umbra Oscura", emoji: "👻", element: "Ombra", elementIcon: "🌑", power: 90, defense: 75, speed: 85, color: "#6366f1", bgClass: "bg-shadow" },
  { id: 6, name: "Lux Divina", emoji: "🌟", element: "Luce", elementIcon: "✨", power: 80, defense: 85, speed: 80, color: "#ffd700", bgClass: "bg-light" },
  { id: 7, name: "Aqua Regina", emoji: "🐳", element: "Acqua", elementIcon: "💧", power: 75, defense: 80, speed: 90, color: "#3b82f6", bgClass: "bg-water" },
  { id: 8, name: "Vento Eterno", emoji: "🦅", element: "Aria", elementIcon: "💨", power: 65, defense: 65, speed: 110, color: "#22c55e", bgClass: "bg-wind" },
  { id: 9, name: "Magma Infernale", emoji: "👹", element: "Lava", elementIcon: "🌋", power: 100, defense: 50, speed: 70, color: "#dc2626", bgClass: "bg-lava" }
];

const ENEMY_DRAGONS = [
  { name: "Drago Selvaggio", emoji: "🦖", power: 60, defense: 60, speed: 60 },
  { name: "Serpente Oscuro", emoji: "🐍", power: 70, defense: 50, speed: 80 },
  { name: "Bestia Antica", emoji: "🦕", power: 80, defense: 70, speed: 50 },
  { name: "Demone Alato", emoji: "🦇", power: 90, defense: 40, speed: 100 },
  { name: "Titano di Fuoco", emoji: "🦂", power: 100, defense: 80, speed: 60 }
];

// ... (states remain same)

// ...

// ===== UPDATE UI =====
function updateDragonDisplay() {
  const dragon = getCurrentDragon();
  if (!dragon) return;

  elements.dragonImage.textContent = dragon.emoji;
  elements.dragonName.textContent = dragon.name;
  // ...
  if (dragon.bgClass) {
    document.body.classList.add(dragon.bgClass);
  }
}

function updateCollection() {
  elements.collectionGrid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const slot = document.createElement('div');
    slot.className = 'collection-dragon';

    if (gameState.collection[i]) {
      const dragon = DRAGONS.find(d => d.id === gameState.collection[i]);
      if (dragon) {
        slot.innerHTML = `<span class="dragon-emoji">${dragon.emoji}</span><span class="dragon-mini-name">${dragon.name.split(' ')[0]}</span>`;
        slot.dataset.dragonId = dragon.id;
        if (dragon.id === gameState.currentDragonId) {
          slot.classList.add('active');
        }
        slot.addEventListener('click', () => selectDragon(dragon.id));
      }
    } else {
      slot.classList.add('empty');
    }

    elements.collectionGrid.appendChild(slot);
  }
}

// ...

// ===== BATTLE =====
function openBattle() {
  if (gameState.battleInProgress) return;

  gameState.battleInProgress = true;
  gameState.playerHealth = 100;
  gameState.enemyHealth = 100;
  gameState.defending = false;
  gameState.specialReady = true;

  const difficulty = Math.min(gameState.collection.length - 1, ENEMY_DRAGONS.length - 1);
  gameState.currentEnemy = { ...ENEMY_DRAGONS[Math.floor(Math.random() * (difficulty + 1))] };

  const dragon = getCurrentDragon();
  elements.playerDragonImage.textContent = dragon.emoji;
  elements.playerDragonName.textContent = dragon.name;
  elements.enemyDragonImage.textContent = gameState.currentEnemy.emoji;
  elements.enemyDragonName.textContent = gameState.currentEnemy.name;

  elements.playerHealth.style.width = '100%';
  elements.enemyHealth.style.width = '100%';
  elements.battleLog.innerHTML = '<p>La battaglia ha inizio!</p>';

  elements.battleModal.classList.add('active');
  enableBattleButtons();
}

function closeBattle() {
  elements.battleModal.classList.remove('active');
  gameState.battleInProgress = false;
}

function enableBattleButtons() {
  document.getElementById('attackBtn').disabled = false;
  document.getElementById('defendBtn').disabled = false;
  document.getElementById('specialBtn').disabled = !gameState.specialReady;
}

function disableBattleButtons() {
  document.getElementById('attackBtn').disabled = true;
  document.getElementById('defendBtn').disabled = true;
  document.getElementById('specialBtn').disabled = true;
}

function addBattleLog(message) {
  const p = document.createElement('p');
  p.textContent = message;
  elements.battleLog.appendChild(p);
  elements.battleLog.scrollTop = elements.battleLog.scrollHeight;
}

function playerAttack() {
  if (!gameState.battleInProgress) return;
  disableBattleButtons();

  const dragon = getCurrentDragon();
  const baseDamage = dragon.power * 0.3;
  const damage = Math.floor(baseDamage + Math.random() * 10);

  gameState.enemyHealth = Math.max(0, gameState.enemyHealth - damage);
  elements.enemyHealth.style.width = gameState.enemyHealth + '%';

  addBattleLog(`${dragon.name} attacca per ${damage} danni!`);

  if (gameState.enemyHealth <= 0) {
    endBattle(true);
  } else {
    setTimeout(enemyTurn, 800);
  }
}

function playerDefend() {
  if (!gameState.battleInProgress) return;
  disableBattleButtons();

  gameState.defending = true;
  addBattleLog('Ti prepari a difendere il prossimo attacco!');

  setTimeout(enemyTurn, 800);
}

function playerSpecial() {
  if (!gameState.battleInProgress || !gameState.specialReady) return;
  disableBattleButtons();

  const dragon = getCurrentDragon();
  const damage = Math.floor(dragon.power * 0.6 + dragon.speed * 0.2);

  gameState.enemyHealth = Math.max(0, gameState.enemyHealth - damage);
  elements.enemyHealth.style.width = gameState.enemyHealth + '%';
  gameState.specialReady = false;

  addBattleLog(`${dragon.name} usa l'attacco speciale per ${damage} danni!`);

  if (gameState.enemyHealth <= 0) {
    endBattle(true);
  } else {
    setTimeout(enemyTurn, 800);
  }
}

function enemyTurn() {
  if (!gameState.battleInProgress) return;

  const enemy = gameState.currentEnemy;
  let baseDamage = enemy.power * 0.25;

  if (gameState.defending) {
    const dragon = getCurrentDragon();
    baseDamage = baseDamage * (1 - dragon.defense / 200);
    gameState.defending = false;
    addBattleLog('La tua difesa riduce il danno!');
  }

  const damage = Math.floor(baseDamage + Math.random() * 8);
  gameState.playerHealth = Math.max(0, gameState.playerHealth - damage);
  elements.playerHealth.style.width = gameState.playerHealth + '%';

  addBattleLog(`${enemy.name} attacca per ${damage} danni!`);

  if (gameState.playerHealth <= 0) {
    endBattle(false);
  } else {
    enableBattleButtons();
  }
}

function endBattle(victory) {
  gameState.battleInProgress = false;
  disableBattleButtons();

  if (victory) {
    const reward = 50 + Math.floor(Math.random() * 50);
    gameState.coins += reward;
    updateCoinsDisplay();
    saveGame();
    addBattleLog(`VITTORIA! Hai guadagnato ${reward} gemme!`);
    showToast(`Vittoria! +${reward} gemme`, 'success');
  } else {
    addBattleLog('SCONFITTA! Il tuo drago è stato sconfitto.');
    showToast('Il tuo drago è stato sconfitto...', 'error');
  }

  setTimeout(closeBattle, 2000);
}

// ===== EVENT LISTENERS =====
document.getElementById('summonBtn').addEventListener('click', summonDragon);
document.getElementById('trainBtn').addEventListener('click', openTraining);
document.getElementById('battleBtn').addEventListener('click', openBattle);
document.getElementById('closeBattle').addEventListener('click', closeBattle);
document.getElementById('closeTrain').addEventListener('click', closeTraining);
document.getElementById('attackBtn').addEventListener('click', playerAttack);
document.getElementById('defendBtn').addEventListener('click', playerDefend);
document.getElementById('specialBtn').addEventListener('click', playerSpecial);

document.querySelectorAll('.training-option').forEach(option => {
  option.querySelector('.train-stat-btn').addEventListener('click', () => {
    trainStat(option.dataset.stat);
  });
});

// Close modals on backdrop click
elements.battleModal.addEventListener('click', (e) => {
  if (e.target === elements.battleModal) closeBattle();
});
elements.trainModal.addEventListener('click', (e) => {
  if (e.target === elements.trainModal) closeTraining();
});

import { SplashScreen } from '@capacitor/splash-screen';

// ===== INITIALIZATION =====
async function init() {
  loadGame();
  createFireParticles();
  updateCoinsDisplay();
  updateDragonDisplay();
  updateCollection();

  try {
    await SplashScreen.hide();
  } catch (err) {
    console.log('Splash screen hide failed (normal in browser)', err);
  }
}

init();
