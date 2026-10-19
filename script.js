// DATA TABEL KEBENARAN
const truthTables = {
  AND: {
    inputs: ["A", "B"],
    rows: [
      [0, 0, 0],
      [0, 1, 0],
      [1, 0, 0],
      [1, 1, 1]
    ]
  },
  OR: {
    inputs: ["A", "B"],
    rows: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 1]
    ]
  },
  NOT: {
    inputs: ["A"],
    rows: [
      [0, 1],
      [1, 0]
    ]
  },
  NAND: {
    inputs: ["A", "B"],
    rows: [
      [0, 0, 1],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0]
    ]
  },
  NOR: {
    inputs: ["A", "B"],
    rows: [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
      [1, 1, 0]
    ]
  },
  XOR: {
    inputs: ["A", "B"],
    rows: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0]
    ]
  },
  XNOR: {
    inputs: ["A", "B"],
    rows: [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
      [1, 1, 1]
    ]
  }
};

// MENGHITUNG OUTPUT GERBANG LOGIKA
function calculateGate(gate, a, b) {
  switch (gate) {
    case "AND":
      return a & b;
    case "OR":
      return a | b;
    case "NOT":
      return a === 1 ? 0 : 1;
    case "NAND":
      return (a & b) === 1 ? 0 : 1;
    case "NOR":
      return (a | b) === 1 ? 0 : 1;
    case "XOR":
      return a !== b ? 1 : 0;
    case "XNOR":
      return a === b ? 1 : 0;
    default:
      return 0;
  }
}

// MENAMPILKAN TABEL KEBENARAN
const gateSelect = document.getElementById("gateSelect");
const truthHead = document.getElementById("truthHead");
const truthBody = document.getElementById("truthBody");

function renderTruthTable() {
  const gate = gateSelect.value;
  const table = truthTables[gate];

  truthHead.innerHTML = `
    <tr>
      ${table.inputs.map(input => `<th>${input}</th>`).join("")}
      <th>Y (${gate})</th>
    </tr>
  `;

  truthBody.innerHTML = table.rows.map(row => {
    const output = row[row.length - 1];

    return `
      <tr>
        ${row.map(value => `<td>${value}</td>`).join("")}
        <td class="${output === 1 ? "output-one" : "output-zero"}">
          <strong>${output}</strong>
        </td>
      </tr>
    `;
  }).join("");
}

gateSelect.addEventListener("change", renderTruthTable);
renderTruthTable();

// SIMULATOR INTERAKTIF
const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const simGate = document.getElementById("simGate");
const calculateBtn = document.getElementById("calculateBtn");
const outputValue = document.getElementById("outputValue");
const outputExplanation = document.getElementById("outputExplanation");

function explainResult(gate, a, b, output) {
  const explanations = {
    AND: "Output 1 hanya jika kedua input bernilai 1.",
    OR: "Output 1 jika minimal satu input bernilai 1.",
    NOT: "Output adalah kebalikan dari input A.",
    NAND: "Output 0 hanya jika kedua input bernilai 1.",
    NOR: "Output 1 hanya jika kedua input bernilai 0.",
    XOR: "Output 1 jika kedua input berbeda.",
    XNOR: "Output 1 jika kedua input sama."
  };

  return `${explanations[gate]} Hasil untuk input ini adalah ${output}.`;
}

function runSimulator() {
  const a = Number(inputA.value);
  const b = Number(inputB.value);
  const gate = simGate.value;

  const output = calculateGate(gate, a, b);

  outputValue.textContent = output;
  outputValue.className = output === 1 ? "output-one" : "output-zero";

  outputExplanation.textContent =
    gate === "NOT"
      ? `Input A = ${a}. ${explainResult(gate, a, b, output)}`
      : `Input A = ${a}, B = ${b}. ${explainResult(gate, a, b, output)}`;
}

calculateBtn.addEventListener("click", runSimulator);
inputA.addEventListener("change", runSimulator);
inputB.addEventListener("change", runSimulator);
simGate.addEventListener("change", runSimulator);
runSimulator();

// KUIS SINGKAT
const questions = [
  {
    question: "Jika A = 1 dan B = 0, berapakah output AND?",
    options: ["0", "1"],
    answer: "0",
    explanation: "AND menghasilkan 1 hanya jika kedua input bernilai 1."
  },
  {
    question: "Jika A = 0 dan B = 1, berapakah output OR?",
    options: ["0", "1"],
    answer: "1",
    explanation: "OR menghasilkan 1 jika minimal satu input bernilai 1."
  },
  {
    question: "Jika A = 1, berapakah output NOT?",
    options: ["0", "1"],
    answer: "0",
    explanation: "NOT membalik nilai input 1 menjadi 0."
  },
  {
    question: "Gerbang mana yang menghasilkan 1 jika kedua input berbeda?",
    options: ["XNOR", "XOR"],
    answer: "XOR",
    explanation: "XOR menghasilkan 1 jika input A dan B berbeda."
  }
];

let currentQuestion = 0;
let answered = false;

const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestion = document.getElementById("nextQuestion");

function renderQuestion() {
  const question = questions[currentQuestion];

  answered = false;
  quizQuestion.textContent = question.question;
  quizFeedback.textContent = "";
  nextQuestion.hidden = true;
  quizOptions.innerHTML = "";

  question.options.forEach(option => {
    const button = document.createElement("button");

    button.className = "quiz-option";
    button.textContent = option;
    button.dataset.answer = option;

    button.addEventListener("click", () => checkAnswer(option));

    quizOptions.appendChild(button);
  });
}

function checkAnswer(answer) {
  if (answered) return;

  answered = true;

  const question = questions[currentQuestion];
  const correct = answer === question.answer;

  quizFeedback.textContent = correct
    ? `Benar! ${question.explanation}`
    : `Belum tepat. Jawaban yang benar adalah ${question.answer}. ${question.explanation}`;

  quizFeedback.className = correct ? "output-one" : "output-zero";

  quizOptions.querySelectorAll("button").forEach(button => {
    button.disabled = true;
  });

  nextQuestion.hidden = false;
  nextQuestion.textContent =
    currentQuestion === questions.length - 1
      ? "Ulangi Kuis ↻"
      : "Soal Berikutnya →";
}

nextQuestion.addEventListener("click", () => {
  currentQuestion = (currentQuestion + 1) % questions.length;
  renderQuestion();
});

renderQuestion();

// EFEK ANIMASI SAAT BAGIAN HALAMAN DIBUKA
const sections = document.querySelectorAll(".section");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(section => observer.observe(section));
}