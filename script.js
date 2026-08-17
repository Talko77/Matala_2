const levels = [
    {
        id: 1,
        description: "סדרו את הקוסמים במרכז הלוח לרוחב.",
        items: ["🧙‍♂️", "🧙‍♂️", "🧙‍♂️"],
        targetCSS: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap"
        }
    },
    {
        id: 2,
        description: "העבירו את כל הדרקונים לתחתית הלוח.",
        items: ["🐉", "🐉"],
        targetCSS: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            flexWrap: "nowrap"
        }
    },
    {
        id: 3,
        description: "סדרו את השיקויים בטור (מלמעלה למטה) ומרכזו אותם לרוחב הלוח.",
        items: ["🧪", "🧪", "🧪"],
        targetCSS: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "nowrap"
        }
    },
    {
        id: 4,
        description: "פזרו את הספרים ברווח שווה ביניהם (space-between) ובתחתית הלוח.",
        items: ["📜", "📜", "📜"],
        targetCSS: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "nowrap"
        }
    },
    {
        id: 5,
        description: "אפשרו לגבישים לרדת שורה (wrap) וסדרו אותם במרכז לרוחב הלוח.",
        items: ["💎", "💎", "💎", "💎", "💎", "💎", "💎"],
        targetCSS: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "wrap"
        }
    },
    {
        id: 6,
        description: "סדרו את המטבעות בטור מלמטה למעלה (column-reverse) ויישרו אותם לסוף הלוח.",
        items: ["🪙", "🪙", "🪙"],
        targetCSS: {
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            flexWrap: "nowrap"
        }
    }
];

let currentLevelIndex = 0;
let attempts = 0;
const completedLevels = new Set(JSON.parse(localStorage.getItem('flexbox-completed') || '[]'));

const levelTitle = document.getElementById("level-title");
const levelDescription = document.getElementById("level-description");
const userContainer = document.getElementById("user-container");
const targetContainer = document.getElementById("target-container");
const feedbackMessage = document.getElementById("feedback-message");
const attemptsCounter = document.getElementById("attempts-counter");

const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");

const selects = {
    flexDirection: document.getElementById("flex-direction"),
    justifyContent: document.getElementById("justify-content"),
    alignItems: document.getElementById("align-items"),
    flexWrap: document.getElementById("flex-wrap")
};

function loadLevel(index) {
    const level = levels[index];
    currentLevelIndex = index;
    attempts = 0;
    attemptsCounter.textContent = "";

    levelTitle.textContent = `שלב ${level.id} מתוך ${levels.length}`;
    levelDescription.textContent = level.description;

    userContainer.innerHTML = "";
    targetContainer.innerHTML = "";
    feedbackMessage.style.display = "none";
    feedbackMessage.className = "feedback";
    nextBtn.style.display = "none";
    checkBtn.style.display = "block";
    restartBtn.style.display = "none";
    prevBtn.style.display = index > 0 ? "inline-block" : "none";

    level.items.forEach(icon => {
        const targetItem = document.createElement("div");
        targetItem.className = "item target-item";
        targetItem.textContent = icon;
        targetContainer.appendChild(targetItem);
    });

    Object.assign(targetContainer.style, level.targetCSS);

    level.items.forEach(icon => {
        const userItem = document.createElement("div");
        userItem.className = "item";
        userItem.textContent = icon;
        userContainer.appendChild(userItem);
    });

    resetSelects();
    updateUserStyle();

    localStorage.setItem('flexbox-current', index);
}

function resetSelects() {
    selects.flexDirection.value = "row";
    selects.justifyContent.value = "flex-start";
    selects.alignItems.value = "flex-start";
    selects.flexWrap.value = "nowrap";
}

function updateUserStyle() {
    userContainer.style.display = "flex";
    userContainer.style.flexDirection = selects.flexDirection.value;
    userContainer.style.justifyContent = selects.justifyContent.value;
    userContainer.style.alignItems = selects.alignItems.value;
    userContainer.style.flexWrap = selects.flexWrap.value;
}

Object.values(selects).forEach(select => {
    select.addEventListener("change", updateUserStyle);
});

checkBtn.addEventListener("click", () => {
    attempts++;
    const currentTarget = levels[currentLevelIndex].targetCSS;

    const isCorrect =
        userContainer.style.flexDirection === currentTarget.flexDirection &&
        userContainer.style.justifyContent === currentTarget.justifyContent &&
        userContainer.style.alignItems === currentTarget.alignItems &&
        userContainer.style.flexWrap === currentTarget.flexWrap;

    // Reset class to re-trigger animation
    feedbackMessage.className = "feedback";
    feedbackMessage.style.display = "block";
    void feedbackMessage.offsetWidth;

    attemptsCounter.textContent = `ניסיונות: ${attempts}`;

    if (isCorrect) {
        feedbackMessage.className = "feedback success";
        completedLevels.add(currentLevelIndex);
        localStorage.setItem('flexbox-completed', JSON.stringify([...completedLevels]));
        checkBtn.style.display = "none";

        if (currentLevelIndex < levels.length - 1) {
            feedbackMessage.textContent = "🎉 כל הכבוד! הפתרון נכון!";
            nextBtn.style.display = "block";
        } else {
            feedbackMessage.textContent = "🏆 ברכות! סיימתם את כל השלבים במשחק!";
            restartBtn.style.display = "block";
        }
    } else {
        feedbackMessage.className = "feedback error";
        feedbackMessage.textContent = "❌ פתרון שגוי, נסו לשנות את הערכים ולנסות שוב.";
    }
});

resetBtn.addEventListener("click", () => {
    resetSelects();
    updateUserStyle();
    feedbackMessage.style.display = "none";
    feedbackMessage.className = "feedback";
    attempts = 0;
    attemptsCounter.textContent = "";
    nextBtn.style.display = "none";
    checkBtn.style.display = "block";
    restartBtn.style.display = "none";
});

prevBtn.addEventListener("click", () => {
    if (currentLevelIndex > 0) {
        loadLevel(currentLevelIndex - 1);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentLevelIndex < levels.length - 1) {
        loadLevel(currentLevelIndex + 1);
    }
});

restartBtn.addEventListener("click", () => {
    completedLevels.clear();
    localStorage.removeItem('flexbox-completed');
    localStorage.removeItem('flexbox-current');
    loadLevel(0);
});

const savedIndex = parseInt(localStorage.getItem('flexbox-current') || '0');
loadLevel(Math.min(savedIndex, levels.length - 1));
