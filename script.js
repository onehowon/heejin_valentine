// ===== Quiz Data =====
const quizData = [
  {
    question: "어떤 게 더 나을까?",
    option1: "한약 맛 아이스 아메리카노",
    option2: "아이스 아메리카노 맛 한약",
    answer: 1,
  },
  {
    question: "이건 어떨까?",
    option1: "민트초코 맛 삼겹살",
    option2: "선지해장국 맛 마카롱",
    answer: 2,
  },
  {
    question: "평생 하나만 먹어야 한다면?",
    option1: "평생 라면만 먹기 (스프 없음)",
    option2: "평생 치킨만 먹기 (뼈만 있음)",
    answer: 2,
  },
  {
    question: "더 견딜 수 있는 건?",
    option1: "여름에 히터 틀고 자기",
    option2: "겨울에 에어컨 틀고 자기",
    answer: 2,
  },
  {
    question: "폰을 선택한다면?",
    option1: "데이터 없는 최신 아이폰",
    option2: "데이터 무제한 2G폰 (폴더폰)",
    answer: 2,
  },
  {
    question: "삼겹살을 먹을 때...",
    option1: "콜라 맛 간장으로 만든 삼겹살",
    option2: "간장 맛 콜라랑 같이 먹는 평범한 삼겹살",
    answer: 2,
  },
];

// ===== State Variables =====
let currentQuestion = 0;
let escapeAttempts = {};
let boxEscapeCount = 0;
const MAX_BOX_ESCAPES = 3;

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  createFallingHearts();
});

// ===== Falling Hearts =====
function createFallingHearts() {
  const container = document.getElementById("heartsContainer");
  const hearts = ["💕", "💖", "💗", "💓", "💝", "❤️", "🩷"];

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      createHeart(container, hearts);
    }, i * 300);
  }

  // Continuously create hearts
  setInterval(() => {
    createHeart(container, hearts);
  }, 500);
}

function createHeart(container, hearts) {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";
  heart.style.animationDuration = Math.random() * 3 + 4 + "s";
  container.appendChild(heart);

  // Remove heart after animation
  setTimeout(() => {
    heart.remove();
  }, 7000);
}

// ===== Page Navigation =====
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
}

// ===== Quiz Functions =====
function startQuiz() {
  currentQuestion = 0;
  escapeAttempts = {};
  showPage("quizPage");
  loadQuestion();
}

function loadQuestion() {
  const quiz = quizData[currentQuestion];
  document.getElementById("currentQuestion").textContent = currentQuestion + 1;
  document.getElementById("totalQuestions").textContent = quizData.length;
  document.getElementById("questionText").textContent = quiz.question;
  document.getElementById("option1Text").textContent = quiz.option1;
  document.getElementById("option2Text").textContent = quiz.option2;

  // Reset button positions
  const btn1 = document.getElementById("option1");
  const btn2 = document.getElementById("option2");
  btn1.style.transform = "";
  btn2.style.transform = "";

  // Reset escape attempts for new question
  escapeAttempts[currentQuestion] = { 1: false, 2: false };
}

// ===== Escaping Button Logic =====
function tryEscape(button, optionNum) {
  const quiz = quizData[currentQuestion];
  const correctAnswer = quiz.answer;

  // Only escape if this is the correct answer and hasn't escaped yet
  if (
    optionNum === correctAnswer &&
    !escapeAttempts[currentQuestion]?.[optionNum]
  ) {
    escapeAttempts[currentQuestion] = escapeAttempts[currentQuestion] || {};
    escapeAttempts[currentQuestion][optionNum] = true;

    // Random escape direction
    const maxX = 30;
    const maxY = 20;
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;

    button.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Show tooltip
    showTooltip(button);
  }
}

function showTooltip(button) {
  const tooltip = document.getElementById("escapingTooltip");
  const rect = button.getBoundingClientRect();

  tooltip.style.left = rect.left + "px";
  tooltip.style.top = rect.top - 50 + "px";
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 2000);
}

function selectAnswer(selected) {
  const quiz = quizData[currentQuestion];

  if (selected === quiz.answer) {
    // Correct answer
    currentQuestion++;

    if (currentQuestion >= quizData.length) {
      // All questions answered correctly
      showPage("successPage");
      startConfetti("confettiCanvas");
      boxEscapeCount = 0;
    } else {
      loadQuestion();
    }
  } else {
    // Wrong answer
    showPage("failPage");
    document.getElementById("apologyInput").value = "";
    document.getElementById("retryBtn").disabled = true;
  }
}

// ===== Apology System =====
function checkApology() {
  const input = document.getElementById("apologyInput").value;
  const target = "나는 원호를 더 공부하겠습니다";
  const retryBtn = document.getElementById("retryBtn");

  if (input === target) {
    retryBtn.disabled = false;
  } else {
    retryBtn.disabled = true;
  }
}

function restartQuiz() {
  currentQuestion = 0;
  escapeAttempts = {};
  showPage("quizPage");
  loadQuestion();
}

// ===== Random Box Game =====
function boxEscape(boxNum) {
  if (boxEscapeCount >= MAX_BOX_ESCAPES) {
    return; // No more escapes, box can be clicked
  }

  boxEscapeCount++;
  const box = document.getElementById("box" + boxNum);
  const container = document.getElementById("randomBoxes");
  const containerRect = container.getBoundingClientRect();

  // Random new position within container
  const maxX = containerRect.width - 100;
  const maxY = 50;
  const randomX = Math.random() * maxX;
  const randomY = (Math.random() - 0.5) * maxY;

  // Move all boxes to random positions
  document.querySelectorAll(".random-box").forEach((b, index) => {
    const newX = Math.random() * maxX;
    const newY = (Math.random() - 0.5) * maxY;
    b.style.position = "absolute";
    b.style.left = newX + "px";
    b.style.top = 50 + newY + "px";
  });

  // Show escape message
  const messages = [
    "어딜 보려고~? 👀",
    "호락호락하지 않지! 😏",
    "거의 다 왔어! 마지막 한 번! 💪",
  ];

  const escapeMessage = document.getElementById("escapeMessage");
  escapeMessage.textContent = messages[boxEscapeCount - 1] || "";
  escapeMessage.style.animation = "none";
  setTimeout(() => {
    escapeMessage.style.animation = "shake 0.5s ease";
  }, 10);
}

function openBox(boxNum) {
  if (boxEscapeCount < MAX_BOX_ESCAPES) {
    return; // Must escape 3 times first
  }

  // Show final coupon page
  showPage("couponPage");
  startConfetti("finalConfetti");
}

// ===== Confetti Effect =====
function startConfetti(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const confetti = [];
  const colors = [
    "#FF0054",
    "#FF6B9D",
    "#FFD700",
    "#FF69B4",
    "#FFC0CB",
    "#FF1493",
  ];
  const shapes = ["circle", "square", "heart"];

  // Create confetti particles
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((c, index) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;

      if (c.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.shape === "square") {
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      } else if (c.shape === "heart") {
        drawHeart(ctx, 0, 0, c.size);
      }

      ctx.restore();

      // Update position
      c.y += c.speedY;
      c.x += c.speedX;
      c.rotation += c.rotationSpeed;

      // Reset if off screen
      if (c.y > canvas.height) {
        c.y = -20;
        c.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(
    x - size / 2,
    y + size / 2,
    x,
    y + size * 0.75,
    x,
    y + size,
  );
  ctx.bezierCurveTo(
    x,
    y + size * 0.75,
    x + size / 2,
    y + size / 2,
    x + size / 2,
    y + size / 4,
  );
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.fill();
}
