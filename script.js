const buttons = document.querySelectorAll(".buttons > button");
const contents = document.querySelectorAll(
  ".content-1, .content-2, .content-3, .content-4, .content-5"
);

buttons[0].classList.add("active");

buttons.forEach((button, index) => {
  button.addEventListener("click", (event) => {
    buttons.forEach((button) => button.classList.remove("active"));
    event.target.classList.add("active");

    contents.forEach((content) => (content.style.display = "none"));
    contents[index].style.display = "flex";
  });
});

/*-------------------------------------------------------------*/
/*-----------------------Wzory---------------------------------*/
/*-------------------------------------------------------------*/

const minus = document.querySelector(".minus");
const plus = document.querySelector(".plus");

const rect1 = document.querySelector(".rectangle.blank-left-down.last");
const rect2 = document.querySelector(".rectangle.rectangle-ba.last");
rect2.style.transform = "rotate(0deg)";
const rect3 = document.querySelector(".rectangle.blank-right-top.last");
const rect4 = document.querySelector(".rectangle.blank-left-up.last");

rect2.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  rect2.style.transform =
    rect2.style.transform === "rotate(0deg)" ? "rotate(90deg)" : "rotate(0deg)";
});

function moveObject(object) {
  let isDown = false;
  let startX;
  let startY;
  let x;
  let y;

  object.addEventListener("mousedown", (event) => {
    isDown = true;
    startX = event.clientX - object.offsetLeft;
    startY = event.clientY - object.offsetTop;
    object.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (event) => {
    if (isDown) {
      x = event.clientX - startX;
      y = event.clientY - startY;
      object.style.top = `${y}px`;
      object.style.left = `${x}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDown = false;
    object.style.cursor = "grab";
  });
}

moveObject(rect1);
moveObject(rect2);
moveObject(rect3);
moveObject(rect4);

function duplicateObject(object) {
  const clone = object.cloneNode(true);
  clone.classList.add("last");
  object.parentNode.appendChild(clone);
  clone.style.zIndex = 10;
  return clone;
}

let plusDuplicate;
let minusDuplicate;

plus.addEventListener("click", () => {
  plusDuplicate = duplicateObject(plus);
  moveObject(plusDuplicate);

  plusDuplicate.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    removeObject(plusDuplicate);
  });
});

minus.addEventListener("click", () => {
  minusDuplicate = duplicateObject(minus);
  moveObject(minusDuplicate);

  minusDuplicate.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    removeObject(minusDuplicate);
  });
});

function removeObject(object) {
  object.parentNode.removeChild(object);
}

/*-------------------------------------------------------------*/
/*-----------------------Quiz-0--------------------------------*/
/*-------------------------------------------------------------*/

const createQuiz = (questions, container, gifUrl) => {
  const help = document.createElement("div");
  help.classList.add("help");
  help.innerHTML += `<span>\\( (a + b)^2 = a^2 + 2ab + b^2 \\)</span><br>
                    <span>\\( (a - b)^2 = a^2 - 2ab + b^2 \\)</span><br>
                    <span>\\( (a + b)(a - b) = a^2 - b^2 \\)</span>`;

  moveObject(help);

  const gif = document.createElement("img");
  gif.classList.add("gif");
  gif.src = gifUrl;

  let questionIndex = 0;

  const choices = document.createElement("div");
  choices.classList.add("choices");

  const questionSpan = document.createElement("span");
  questionSpan.classList.add("question");

  const counterSpan = document.createElement("span");
  counterSpan.classList.add("counter");

  const previousButton = document.createElement("button");
  previousButton.classList.add("previous");
  previousButton.innerHTML = "<";

  const nextButton = document.createElement("button");
  nextButton.classList.add("next");
  nextButton.innerHTML = ">";

  const shuffleButton = document.createElement("button");
  shuffleButton.classList.add("shuffle");
  shuffleButton.innerHTML = "Losuj";

  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop");
  backdrop.style.display = "none";
  container.appendChild(backdrop);

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function loadQuestion() {
    const currentQuestion = questions[questionIndex];
    questionSpan.innerHTML = `${questionIndex + 1}. ${
      currentQuestion.question
    }`;
    counterSpan.innerHTML = `${questionIndex + 1}/${questions.length}`;
    choices.innerHTML = "";
    shuffle(currentQuestion.answers);

    currentQuestion.answers.forEach((answer) => {
      const choice = document.createElement("div");
      choice.classList.add("choice");
      choice.innerHTML = answer.value;
      choice.setAttribute("data-correct", answer.correct);
      choices.appendChild(choice);
    });
  }

  previousButton.addEventListener("click", () => {
    questionIndex = (questionIndex - 1 + questions.length) % questions.length;
    loadQuestion();
    MathJax.typesetPromise();
  });

  nextButton.addEventListener("click", () => {
    questionIndex = (questionIndex + 1) % questions.length;
    loadQuestion();
    MathJax.typesetPromise();
  });

  shuffleButton.addEventListener("click", () => {
    loadQuestion();
    MathJax.typesetPromise();
  });

  choices.addEventListener("click", (event) => {
    const target = event.target.closest(".choice");
    if (!target) return;

    const correct = target.getAttribute("data-correct") === "true";
    if (!correct) {
      target.style.backgroundColor = "tomato";
      setTimeout(() => {
        target.style.backgroundColor = "";
        shuffle(questions[questionIndex].answers);
        loadQuestion();
        MathJax.typesetPromise();
      }, 1000);
    } else {
      const correctDiv = document.createElement("div");
      correctDiv.classList.add("correct");
      correctDiv.innerHTML = `${questionSpan.innerHTML} = ${target.innerHTML}`;
      choices.appendChild(correctDiv);
      backdrop.style.display = "flex";

      setTimeout(() => {
        correctDiv.remove();
        questionIndex = (questionIndex + 1) % questions.length;
        if (questionIndex === 0) {
          backdrop.style.display = "flex";
          container.appendChild(gif);
        } else {
          backdrop.style.display = "none";
        }
        loadQuestion();
        MathJax.typesetPromise();
      }, 1000);
    }
  });

  choices.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const target = event.target.closest(".choice");
    if (!target) return;

    if (target.style.backgroundColor === "") {
      target.style.backgroundColor = "plum";
    } else {
      target.style.backgroundColor = "";
    }
  });

  container.appendChild(help);
  container.appendChild(shuffleButton);
  container.appendChild(questionSpan);
  container.appendChild(previousButton);
  container.appendChild(counterSpan);
  container.appendChild(nextButton);
  container.appendChild(choices);

  loadQuestion();
  MathJax.typesetPromise();
};

/*-------------------------------------------------------------*/
/*-----------------------Quiz Setup----------------------------*/
/*-------------------------------------------------------------*/

import { questions1 } from "./questions-1.js";
import { questions2 } from "./questions-2.js";

createQuiz(
  questions1,
  contents[1],
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzlkMzZmNjFkM3U3Nm5jZjl1MXZsdmg4M3JhZGhxanBvZnJsY21sMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/8xgqLTTgWqHWU/giphy.gif?loop=infinite"
);

createQuiz(
  questions2,
  contents[2],
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3F3bzVld2NwdHo2YTF2MnFzYTd3ZTk0ZWRxMWRhaDRjYWl4MXh3eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oBPOP48aQpIxq/giphy.gif?loop=infinite"
);
