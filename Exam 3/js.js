"use strict"

//filling_bar();

function filling_bar() {
  let width = 0;
  let elem = document.querySelector(".bar_container_filling");
  let interval_id = setInterval(() => {
    if (width === 100) {
      clearInterval(interval_id);
    }

    width += 0.5;
    elem.style.width = width + "%";
  }, 20);
}

