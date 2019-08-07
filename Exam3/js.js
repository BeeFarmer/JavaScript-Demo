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

  let _subscriber;
  let _cache = [];
  let _data = [];
  let _selected = -1;

  function cacheApi() {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=70")
      .then(response => response.json())
      .then(function(json){
        let results = json.results;
        for (let item of results) {
          _cache.push(item.name);
        }
      });
  }

  function cacheLocal(text) {
    let temp_data = [];
    for (let i = 0; i < _cache.length; ++i) {
      if (text && text === _cache[i].slice(0, text.length)) {
        temp_data.push(_cache[i]);
      }
    }

    _data = temp_data;
    _subscriber(_data, text);
  }

  function _fetchData(text) {
    if (!_cache.length) {
      cacheApi();
    }

    setTimeout(cacheLocal, 300, text);
  }

  return {
    subscribe: function(cb) {
      if (!_subscriber) {
        _subscriber = cb;
      }
    },
    fetchData: _fetchData,
  };

}

function acView(container, model) {

  let _input = document.createElement('input');
  let _options = document.createElement('div');

  _input.setAttribute('type', 'text');
  _input.setAttribute('class', 'autocom_input');
  _input.setAttribute('placeholder', 'Search...');
  _options.setAttribute('class', 'autocom_list');

  container.appendChild(_input);
  container.appendChild(_options);

  _input.addEventListener("input", function(e){
    model.fetchData(e.target.value);
  });

  document.addEventListener("click", function(e){
    _closeOptions(e.target);
  });

  function _closeOptions(elem) {
    let options = _options.children;
    for (let i = 0; i < options.length; ++i) {
      if (elem !== options[i] && elem != _input) {
        _options.innerHTML = "";
      }
    }
  }

  function render(inp, cur_text) {
    _closeOptions();
    if (inp.length) {
      for (let i = 0; i < inp.length; ++i) {
        let cur_text_len = cur_text.length;
        let singleOption = document.createElement('div');
        singleOption.setAttribute("data-value", inp[i]);
        singleOption.innerHTML = `<strong>${inp[i].slice(0, cur_text_len)}</strong>`;
        singleOption.innerHTML += inp[i].slice(cur_text_len);
        singleOption.addEventListener("click", function(e){
          _input.value = this.getAttribute("data-value");
          _closeOptions();
        });
        _options.appendChild(singleOption);
      }
    }
  }

  model.subscribe(render);
}