// Dragon Realm - Main Application

// ===== DRAGON DATABASE =====
const DRAGONS = [
  { id: 1, name: "Ignis il Furioso", image: "./assets/dragon_fire.png", element: "Fuoco", elementIcon: "🔥", power: 85, defense: 70, speed: 90, color: "#ff6b35", bgClass: "bg-fire" },
  { id: 2, name: "Glacius il Gelo", image: "./assets/dragon_ice.png", element: "Ghiaccio", elementIcon: "❄️", power: 75, defense: 95, speed: 65, color: "#06b6d4", bgClass: "bg-ice" },
  { id: 3, name: "Tempesta Nera", image: "./assets/dragon_lightning.png", element: "Fulmine", elementIcon: "⚡", power: 95, defense: 60, speed: 100, color: "#a855f7", bgClass: "bg-lightning" },
  { id: 4, name: "Terra Ancestrale", image: "./assets/dragon_earth.png", element: "Terra", elementIcon: "🌍", power: 70, defense: 100, speed: 55, color: "#84cc16", bgClass: "bg-earth" },
  { id: 5, name: "Umbra Oscura", image: "./assets/dragon_shadow.png", element: "Ombra", elementIcon: "🌑", power: 90, defense: 75, speed: 85, color: "#6366f1", bgClass: "bg-shadow" },
  { id: 6, name: "Lux Divina", image: "./assets/dragon_light.png", element: "Luce", elementIcon: "✨", power: 80, defense: 85, speed: 80, color: "#ffd700", bgClass: "bg-light" },
  { id: 7, name: "Aqua Regina", image: "./assets/dragon_water.png", element: "Acqua", elementIcon: "💧", power: 75, defense: 80, speed: 90, color: "#3b82f6", bgClass: "bg-water" },
  { id: 8, name: "Vento Eterno", image: "./assets/dragon_wind.png", element: "Aria", elementIcon: "💨", power: 65, defense: 65, speed: 110, color: "#22c55e", bgClass: "bg-wind" },
  { id: 9, name: "Magma Infernale", image: "./assets/dragon_lava.png", element: "Lava", elementIcon: "🌋", power: 100, defense: 50, speed: 70, color: "#dc2626", bgClass: "bg-lava" }
];

const ENEMY_DRAGONS = [
  { name: "Drago Selvaggio", image: "./assets/dragon_fire.png", power: 60, defense: 60, speed: 60 },
  { name: "Serpente Oscuro", image: "./assets/dragon_shadow.png", power: 70, defense: 50, speed: 80 },
  { name: "Bestia Antica", image: "./assets/dragon_earth.png", power: 80, defense: 70, speed: 50 },
  { name: "Demone Alato", image: "./assets/dragon_lightning.png", power: 90, defense: 40, speed: 100 },
  { name: "Titano di Fuoco", image: "./assets/dragon_lava.png", power: 100, defense: 80, speed: 60 }
];

// ===== GAME STATE =====
let gameState = {
  coins: 1000,
  collection: [1],
  currentDragonId: 1,
  battleInProgress: false,
  playerHealth: 100,
  enemyHealth: 100,
  currentEnemy: null,
  defending: false,
  specialReady: true
};

// ===== DOM ELEMENTS =====
const elements = {
  coinsCount: document.getElementById('coinsCount'),
  dragonImage: document.getElementById('dragonImage'),
  dragonName: document.getElementById('dragonName'),
  dragonElement: document.getElementById('dragonElement'),
  powerBar: document.getElementById('powerBar'),
  defenseBar: document.getElementById('defenseBar'),
  speedBar: document.getElementById('speedBar'),
  powerValue: document.getElementById('powerValue'),
  defenseValue: document.getElementById('defenseValue'),
  speedValue: document.getElementById('speedValue'),
  collectionGrid: document.getElementById('collectionGrid'),
  battleModal: document.getElementById('battleModal'),
  trainModal: document.getElementById('trainModal'),
  playerHealth: document.getElementById('playerHealth'),
  enemyHealth: document.getElementById('enemyHealth'),
  playerDragonImage: document.getElementById('playerDragonImage'),
  playerDragonName: document.getElementById('playerDragonName'),
  enemyDragonImage: document.getElementById('enemyDragonImage'),
  enemyDragonName: document.getElementById('enemyDragonName'),
  battleLog: document.getElementById('battleLog'),
  toastContainer: document.getElementById('toastContainer'),
  fireParticles: document.getElementById('fireParticles')
};

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateCoinsDisplay() {
  elements.coinsCount.textContent = gameState.coins;
}

function getCurrentDragon() {
  return DRAGONS.find(d => d.id === gameState.currentDragonId);
}

function saveGame() {
  localStorage.setItem('dragonRealm', JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem('dragonRealm');
  if (saved) {
    gameState = { ...gameState, ...JSON.parse(saved) };
  }
}

// ===== FIRE PARTICLES =====
function createFireParticles() {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = (3 + Math.random() * 2) + 's';
    elements.fireParticles.appendChild(particle);
  }
}

// ===== UPDATE UI =====
function updateDragonDisplay() {
  const dragon = getCurrentDragon();
  if (!dragon) return;

  elements.dragonImage.innerHTML = `<img src="${dragon.image}" alt="${dragon.name}" class="dragon-img">`;
  elements.dragonName.textContent = dragon.name;
  elements.dragonElement.innerHTML = `<span class="element-icon">${dragon.elementIcon}</span><span>${dragon.element}</span>`;

  elements.powerBar.style.width = dragon.power + '%';
  elements.defenseBar.style.width = dragon.defense + '%';
  elements.speedBar.style.width = dragon.speed + '%';
  elements.powerValue.textContent = dragon.power;
  elements.defenseValue.textContent = dragon.defense;
  elements.speedValue.textContent = dragon.speed;

  document.documentElement.style.setProperty('--dragon-color', dragon.color);

  // Update themed background
  document.body.classList.remove('bg-fire', 'bg-ice', 'bg-lightning', 'bg-earth', 'bg-shadow', 'bg-light', 'bg-water', 'bg-wind', 'bg-lava');
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
        slot.innerHTML = `<img src="${dragon.image}" alt="${dragon.name}" class="collection-dragon-img"><span class="dragon-mini-name">${dragon.name.split(' ')[0]}</span>`;
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

function selectDragon(dragonId) {
  gameState.currentDragonId = dragonId;
  updateDragonDisplay();
  updateCollection();
  saveGame();
  showToast('Drago selezionato!', 'success');
}

// ===== SUMMON =====
function summonDragon() {
  if (gameState.coins < 100) {
    showToast('Non hai abbastanza gemme!', 'error');
    return;
  }

  const unowned = DRAGONS.filter(d => !gameState.collection.includes(d.id));

  if (unowned.length === 0) {
    showToast('Hai già tutti i draghi!', 'info');
    return;
  }

  gameState.coins -= 100;
  const newDragon = unowned[Math.floor(Math.random() * unowned.length)];
  gameState.collection.push(newDragon.id);
  gameState.currentDragonId = newDragon.id;

  updateCoinsDisplay();
  updateDragonDisplay();
  updateCollection();
  saveGame();

  showToast(`Hai evocato ${newDragon.name}!`, 'success');
}

// ===== TRAINING =====
function openTraining() {
  elements.trainModal.classList.add('active');
}

function closeTraining() {
  elements.trainModal.classList.remove('active');
}

function trainStat(stat) {
  const dragon = getCurrentDragon();
  if (!dragon) return;

  const statMap = { power: 'power', defense: 'defense', speed: 'speed' };
  const currentValue = dragon[statMap[stat]];

  if (currentValue >= 100) {
    showToast('Questa statistica è già al massimo!', 'info');
    return;
  }

  dragon[statMap[stat]] = Math.min(100, currentValue + 5);
  updateDragonDisplay();
  saveGame();

  showToast(`${stat.charAt(0).toUpperCase() + stat.slice(1)} aumentata!`, 'success');
  closeTraining();
}

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
  elements.playerDragonImage.innerHTML = `<img src="${dragon.image}" alt="${dragon.name}" class="battle-dragon-img">`;
  elements.playerDragonName.textContent = dragon.name;
  elements.enemyDragonImage.innerHTML = `<img src="${gameState.currentEnemy.image}" alt="${gameState.currentEnemy.name}" class="battle-dragon-img">`;
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

// ===== INITIALIZATION =====
function init() {
  loadGame();
  createFireParticles();
  updateCoinsDisplay();
  updateDragonDisplay();
  updateCollection();
}

init();
