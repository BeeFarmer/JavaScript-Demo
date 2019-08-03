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

// MVC
let pbModel = model();
let pbContainer = document.querySelector(".bar_container");
view(pbContainer, pbModel);

function view(container, model) {
  function render(data) {
    let innerElem = document.querySelector(".bar_container_filling");
    innerElem.style.width = data + "%";
  }

  container.innerHTML = "<div class='bar_container_filling'></div>";

  model.subscribe(render);

  render();
}

function model() {
  let _data = 0;
  let _subscriber;
  let _interval = 10;
  let _interval_change = 0.5;

  let intervalId = setInterval(_update, _interval);

  function _update() {
    if ( _data === 0 && _interval_change < 0 ||
         _data === 100 && _interval_change > 0 ) {
      _interval_change = -_interval_change;
    }
    _data += _interval_change;

    if (_data > 100) {
      clearInterval(intervalId);
    }

    _subscriber(_data);
  }

  return {
    subscribe: function(cb) {
      if (!_subscriber) {
        _subscriber = cb;
      }
    }
  };

}
