let questCont = document.getElementById("questCont");
let loadingImg = document.getElementById("loadingImg");
let errorImg = document.getElementById("errorImg");
let step = document.getElementsByClassName("step");
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let loginInput = document.getElementById("loginInput");
let startBtn = document.getElementById("startBtn");
let submitBtn = document.getElementById("submitBtn");
let line = document.getElementById("line");
let form = document.getElementsByTagName("form")[0];
let preloader = document.getElementById("preloader-wrapper");
let bodyElement = document.querySelector("body");
let leaderBoardCont = document.getElementById("leaderBoardCont");
let leaderBoard = document.getElementById("leaderBoard");
var stepsCont = document.getElementById("steps-container");

///initialize
form.onsubmit = () => {
  return false;
};
let stepNo = 0;
let current_step = 0;
let stepCount = 0;
var userName = "";
var users = getFromStorage("users") || [];
if (users?.length == 0) {
  addUsersArr(users);
}
if (current_step == 0) {
  prevBtn.classList.add("d-none");
  submitBtn.classList.add("d-none");
  nextBtn.classList.add("d-inline-block");
}
step[current_step].classList.add("d-block");
var score = 0;
var correct_answers = [];
//fetch
async function fetchFromAPI() {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=15&category=18&difficulty=medium&type=multiple",
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  ).catch((error) => {
    loadingImg.style.display = "none";
    errorImg.style.display = "block";
    console.error("There was an error!", error);
  });
  const res = await response.json();
  console.log(res);

  data = res.results;
  console.log(data);
  //modify steps
  if (res) {
    stepCount = res.results.length;
    questCont.style.display = "block";
    loading.style.display = "none";
  }
  console.log(stepCount);
  data.forEach((d, quest_key) => {
    //add step number
    stepNo++;
    correct_answers.push(d.correct_answer);
    //combining incorrect and correct answers as options
    let options = [];

    let incorrect_answers = d.incorrect_answers;
    incorrect_answers.map(function (res) {
      options.push(res);
    });
    options.push(d.correct_answer);
    //shuffle arr
    options = options.sort(() => Math.random() - 0.5);

    console.log(options);
    var stepQuestion = document.createElement("div");
    stepQuestion.classList.add("step");

    var questionCont = document.createElement("div");
    questionCont.setAttribute("class", "form-check ps-0 q-box");

    options.map((option, key) => {
      let questNo = "quest" + quest_key;

      questLetter = () => {
        if (key == 0) {
          return "A";
        } else if (key == 1) {
          return "B";
        } else if (key == 2) {
          return "C";
        } else if (key == 3) {
          return "D";
        } else if (key == 4) {
          return "E";
        }
        return;
      };

      let inputId = questNo + "_" + key;
      console.log(inputId);
      var question = document.createElement("div");
      question.classList.add("qBox");
      var inputBox = document.createElement("input");
      inputBox.setAttribute("class", "form-check-input question__input");
      inputBox.setAttribute("id", inputId);
      inputBox.setAttribute("name", questNo);
      inputBox.setAttribute("value", option);
      inputBox.setAttribute("type", "radio");
      inputBox.addEventListener("click", () => {
        checkValue(quest_key, inputId, inputBox.value, d.correct_answer);
      });
      var label = document.createElement("label");
      label.setAttribute("class", "form-check-label questionOption inputCard");
      label.setAttribute("for", inputId);
      label.innerHTML =
        "<div class='flex-center'><div class='selectCircle'>" +
        questLetter() +
        "</div><span>" +
        option +
        "</span></div>";
      question.appendChild(inputBox);
      question.appendChild(label);

      questionCont.appendChild(question);
    });

    stepQuestion.innerHTML =
      "<div><h5 class='questionNo'>Question " +
      stepNo +
      "/ " +
      stepCount +
      "</h5><h5 class='questionTxt'> " +
      d.question +
      "</h5></div>";
    stepQuestion.append(questionCont);
    stepsCont.appendChild(stepQuestion);
  });
}
fetchFromAPI();
//check input value
const result = [];

function checkValue(quest_key, key, val, correct_answer) {
  let exist = result.some((e) => {
    if (e.quest_key === quest_key) {
      return true;
    }
    return false;
  });

  if (exist) {
    console.log("exists");
    let index = result.findIndex(function (i) {
      return i.quest_key === quest_key;
    });
    if (index !== -1) {
      //remove and add new value
      result.splice(index, 1, { quest_key, val });
    }
    console.log(result);
  } else {
    console.log("doesn't exists");
    result.push({ quest_key, val });
    console.log(result);
  }
}
function calculateScore() {
  console.log(result);
  console.log(correct_answers);
  const filterCorrectAnswers = (arr1, arr2) => {
    let res = [];
    res = arr1.filter((el) => {
      return arr2.find((element) => {
        return element === el.val;
      });
    });
    score = res.length;
    console.log(score);
    setToStorage(userName, score);
    return res;
  };
  console.log(filterCorrectAnswers(result, correct_answers));
}
///
const progress = (value) => {
  document.getElementsByClassName("progress-bar")[0].style.width = `${value}%`;
};

//localStorage
function addUsersArr(users) {
  window.localStorage.setItem("users", JSON.stringify(users));
}
function setToStorage(name, score) {
  const user = {
    name: name,
    score: score,
  };
  users.push(user);
  addUsersArr(users);
}
function getFromStorage(key) {
  return JSON.parse(window.localStorage.getItem(key));
}
//
function nextStep() {
  current_step = current_step + 1;
  console.log(current_step);
  let previous_step = current_step - 1;
  if (current_step > 0 && current_step <= stepCount) {
    prevBtn.classList.remove("d-none");
    prevBtn.classList.add("d-inline-block");
    step[current_step]?.classList.remove("d-none");
    step[current_step]?.classList.add("d-block");
    step[previous_step]?.classList.remove("d-block");
    step[previous_step]?.classList.add("d-none");
    if (current_step == stepCount) {
      submitBtn.classList.remove("d-none");
      submitBtn.classList.add("d-inline-block");
      nextBtn.classList.remove("d-inline-block");
      nextBtn.classList.add("d-none");
    }
  } else {
    if (current_step > stepCount) {
      form.onsubmit = () => {
        return true;
      };
    }
  }
  progress((100 / stepCount) * current_step);
}
startBtn.addEventListener("click", () => {
  userName = loginInput.value;
  const userExists = () => {
    if (users.some((e) => e.name === userName)) {
      return true;
    }
    return false;
  };
  console.log(userExists());
  if (userName == "") {
    loginInput.style.border = "1px solid #fd7833";
    loginInput.style.boxShadow = "rgba(0, 0, 0, 0.18) 0px 2px 4px";
    loginInput.setAttribute("placeholder", "eg. viczdera - required!");
  } else if (userExists()) {
    loginInput.value = "";
    loginInput.style.border = "1px solid #fd7833";
    loginInput.style.boxShadow = "rgba(0, 0, 0, 0.18) 0px 2px 4px";
    loginInput.setAttribute("placeholder", "Username already used !");
  } else {
    nextStep();
    prevBtn.style.visibility = "visible";
    nextBtn.style.visibility = "visible";
    submitBtn.style.visibility = "visible";
    line.style.visibility = "visible";

    if (current_step == 1) {
      prevBtn.classList.remove("d-inline-block");
      prevBtn.classList.add("d-none");
    }
  }
});
nextBtn.addEventListener("click", () => {
  nextStep();
});

prevBtn.addEventListener("click", () => {
  console.log(current_step);
  if (current_step > 0) {
    current_step = current_step - 1;
    let previous_step = current_step + 1;
    prevBtn.classList.add("d-none");
    prevBtn.classList.add("d-inline-block");
    step[current_step]?.classList.remove("d-none");
    step[current_step]?.classList.add("d-block");
    step[previous_step]?.classList.remove("d-block");
    step[previous_step]?.classList.add("d-none");
    if (current_step < stepCount) {
      submitBtn.classList.remove("d-inline-block");
      submitBtn.classList.add("d-none");
      nextBtn.classList.remove("d-none");
      nextBtn.classList.add("d-inline-block");
      prevBtn.classList.remove("d-none");
      prevBtn.classList.add("d-inline-block");
    }
  }

  if (current_step == 1) {
    prevBtn.classList.remove("d-inline-block");
    prevBtn.classList.add("d-none");
  }
  progress((100 / stepCount) * current_step);
});

function showRank() {
  let highTolow = users.sort((a, b) => b.score - a.score);
  let topThree = highTolow.slice(0, 3);
  let result = highTolow;
  topThree.map((m) => {
    if (m.name == userName) result = topThree;
  });
  console.log(result);

  result.forEach((m, key) => {
    let rank = key + 1;
    const row = document.createElement("div");
    row.setAttribute("class", "row rankCard");
    row.innerHTML =
      "<div class='col-sm'>" +
      rank +
      "</div><div class='col-sm'> " +
      m.name +
      "</div><div class='col-sm'> " +
      m.score +
      "</div>";
    const iconDiv = document.createElement("div");
    iconDiv.classList.add("iconDiv");
    if (rank == 1) {
      row.classList.add("rankGold");
      iconDiv.innerHTML =
        "<img class='awardIcon' src='./assets/goldMedal.png' alt='gold' />";
    } else if (rank === 2) {
      row.classList.add("rankSilver");
      iconDiv.innerHTML =
        "<img class='awardIcon' src='./assets/silverMedal.png' alt='silver' />";
    } else if (rank === 3) {
      row.classList.add("rankBronze");
      iconDiv.innerHTML =
        "<img class='awardIcon' src='./assets/bronzeMedal.png' alt='bronze' />";
    } else if (userName == m.name) {
      row.classList.add("rankUser");
    }
    row.appendChild(iconDiv);
    leaderBoard.appendChild(row);
  });
}
submitBtn.addEventListener("click", () => {
  calculateScore();
  showRank();
  line.style.visibility = "hidden";

  preloader.classList.add("d-block");

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  timer(500)
    .then(() => {
      step[stepCount].classList.remove("d-block");
      step[stepCount].classList.add("d-none");
      prevBtn.classList.remove("d-inline-block");
      prevBtn.classList.add("d-none");
      submitBtn.classList.remove("d-inline-block");
      submitBtn.classList.add("d-none");
      leaderBoardCont.classList.remove("d-none");
      leaderBoardCont.classList.add("d-block");
    });
});
