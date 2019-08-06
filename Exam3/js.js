"use strict"

//filling_bar();
// function filling_bar() {
//   let width = 0;
//   let elem = document.querySelector(".bar_container_filling");
//   let interval_id = setInterval(() => {
//     if (width === 100) {
//       clearInterval(interval_id);
//     }

//     width += 0.5;
//     elem.style.width = width + "%";
//   }, 20);
// }

// MVC
let new_pbModel = pbModel();
let pbContainer = document.querySelector(".bar_container");
pbView(pbContainer, new_pbModel);

function pbView(container, model) {

  let btnElem = document.querySelector(".stop_btn");
  btnElem.textContent = "STOP";
  container.innerHTML = "<div class='bar_container_filling'></div>";

  btnElem.addEventListener("click", function(e) {
    model.action();
    btnElem.textContent = (btnElem.textContent === "STOP") ? "RESUME" : "STOP";
  });

  function render(data) {
    let innerElem = document.querySelector(".bar_container_filling");
    innerElem.style.width = data + "%";
  }

  model.subscribe(render);

  render();
}

function pbModel() {

  let _data = 0;
  let _subscriber;
  let _interval = 10;
  let _interval_change = 0.5;
  let _interval_status = true;

  let intervalId = setInterval(_update, _interval);

  function _update() {
    if ( _data === 0 && _interval_change < 0 ||
         _data === 100 && _interval_change > 0 ) {
      _interval_change = -_interval_change;
    }
    _data += _interval_change;

    _subscriber(_data);
  }

  function _action() {
    if (_interval_status) {
      clearInterval(intervalId);
    } else {
      intervalId = setInterval(_update, _interval);
    }
    _interval_status = _interval_status ? false : true;
  }

  return {
    subscribe: function(cb) {
      if (!_subscriber) {
        _subscriber = cb;
      }
    },
    action: _action,
  };
}


let new_acModel = acModel();
let acContainer = document.querySelector(".autocom_container");
acView(acContainer, new_acModel);

function acModel() {
  return {
    a:999,
  };
}

function acView(container, model) {

  let _input = document.createElement('input');

  _input.setAttribute('type', 'text');
  _input.setAttribute('class', 'autocom_input');
  _input.setAttribute('placeholder', 'Search...');

  container.appendChild(_input);

}