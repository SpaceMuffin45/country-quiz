const set_score = function () {
  const score = sessionStorage.getItem("correctly_answered_questions");
  const answer_element = document.querySelector("#correct-answers");
  answer_element.textContent = score;
};

const connect_play_again_button = function () {
  const btn = document.querySelector("#play-again__button");
  btn.addEventListener("click", () => (window.location.href = "index.html"));
};

set_score();
connect_play_again_button();
