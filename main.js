let current_level = 1;
let correctly_answered_questions = 0;

const main = async function () {
  const questions = await generate_questions();
  populate_numbers();
  populate_question(questions);
  populate_answers(questions);
};

const generate_questions = async function () {
  const url = "https://restcountries.com/v3.1/all?fields=name,flag";

  const all_countries = await fetch(url).then((response) => response.json());
  const max_index = Object.keys(all_countries).length;
  const questions = {};

  for (let i = 1; i <= 10; i++) {
    const target_country = get_random_country(max_index, all_countries);
    const target_flag = target_country.flag;
    const target_name = target_country.name.common;
    const distractors = get_distractors(max_index, all_countries, target_name);
    questions[i] = {
      target_flag: target_flag,
      target_name: target_name,
      distractors: distractors,
    };
  }
  return questions;
};

const get_random_country = function (max_index, all_countries) {
  const rand = Math.floor(Math.random() * max_index);
  return all_countries[Object.keys(all_countries)[rand]];
};

const get_distractors = function (max_index, all_countries, target_name) {
  let distractors = [];
  while (distractors.length != 3) {
    let new_name = get_random_country(max_index, all_countries).name.common;
    if (new_name != target_name && !distractors.includes(new_name)) {
      distractors.push(new_name);
    }
  }
  return distractors;
};

const populate_numbers = function () {
  const number_wrapper = document.querySelector("#number__wrapper");
  const number_template = document.querySelector("#number__template");

  number_wrapper.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const clone = number_template.content.cloneNode(true);
    const header = clone.querySelector("h3");
    header.textContent = i;

    if (i < current_level) {
      header.className = "number__item--active";
    }

    number_wrapper.appendChild(clone);
  }
};

const populate_question = function (questions) {
  const flag_element = document.querySelector("#flag");
  flag_element.textContent = questions[current_level].target_flag;
};

const populate_answers = function (questions) {
  const answer_wrapper = document.querySelector("#answer__wrapper");
  const answer_template = document.querySelector("#answer__template");

  const correct_index = Math.floor(Math.random() * 4) + 1;

  answer_wrapper.innerHTML = "";

  for (let i = 1; i <= 4; i++) {
    const clone = answer_template.content.cloneNode(true);
    const header = clone.querySelector("h3");

    header.addEventListener("mouseover", function () {
      header.className = "answer__item--active";
    });

    header.addEventListener("mouseout", function () {
      header.className = "answer__item--inactive";
    });

    header.addEventListener("click", (e) => on_answer_clicked(e, questions));

    const distractors = questions[current_level].distractors;
    // const distractors = [...questions[current_level].distractors];
    const answer = questions[current_level].target_name;

    if (i == correct_index) {
      header.textContent = answer;
    } else {
      header.textContent = distractors.pop();
    }

    answer_wrapper.appendChild(clone);
  }
};

const advance_to_next_level = function (result, questions) {
  if (result == "success") {
    const points_display = document.querySelector("#points-display");
    correctly_answered_questions++;
    points_display.textContent = correctly_answered_questions;
  } else if (result == "failure") {
  }
  current_level++;
  if (current_level <= 10) {
    populate_numbers();
    populate_question(questions);
    populate_answers(questions);
  } else {
    show_game_over_screen();
  }
};

const show_game_over_screen = function () {
  sessionStorage.setItem(
    "correctly_answered_questions",
    correctly_answered_questions,
  );
  window.location.href = "game_over.html";
};

const on_answer_clicked = function (event, questions) {
  const correct_answer = questions[current_level].target_name;
  let result = "";
  if (event.target.textContent == correct_answer) {
    result = "success";
  } else {
    result = "failure";
  }
  advance_to_next_level(result, questions);
};

main();
