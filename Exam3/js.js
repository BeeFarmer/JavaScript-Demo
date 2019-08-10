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
// ======================
// ==== Progress Bar ====
// ======================
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
  let _interval = 5;
  let _interval_change = 0.25;
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
// =============
// ==== END ====
// =============

// =======================================
// ==== Autocomplete (API and no API) ====
// =======================================
const TESTAPI = "https://pokeapi.co/api/v2/pokemon/?limit=70";
const OPTIONS = [
    "♥♥",
    'CA',
    'AZ',
    'WA',
    'NY',
    'OR',
    'TX',
    'TS',
    'ML',
    'MX',
  ];

let new_acModel_api = acModel(TESTAPI);
let new_acModel_no_api = acModel();
let acContainer = document.querySelectorAll(".autocom_container");
acView(acContainer[0], new_acModel_api);
acView(acContainer[1], new_acModel_no_api);

function debounce(fn, wait) {
  let _timerId;

  return function() {
    let context = this;
    let args = arguments;

    clearTimeout(_timerId);
    _timerId = setTimeout(() => {
      fn.apply(context, args)
    }, wait);
  };
}

function acModel(apiURL=null) {

  let _subscriber;
  let _cache = [];
  let _data = [];
  let _selected = -1; // current selected index
  let _pre_selected = -1; // previous selected index

  function cacheApi() {
    fetch(apiURL)
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
    if (text) {
      if (apiURL) {
        for (let i = 0; i < _cache.length; ++i) {
          if (text === _cache[i].slice(0, text.length)) {
            temp_data.push(_cache[i]);
          }
        }
      } else {
        for (let i = 0; i < _cache.length; ++i) {
          if (_cache[i].includes(text)) {
            temp_data.push(_cache[i]);
          }
        }
      }
    }

    _data = temp_data;
    _subscriber(_data, text);
  }

  function _fetchData(text) {
    if (!_cache.length) {
      if (apiURL) {
        cacheApi();
      } else {
        _cache = OPTIONS;
      }
    }

    // reinitialize selected values
    _selected = -1;
    _pre_selected = -1
    setTimeout(cacheLocal, 400, text);
  }

  function _arrowKey(kcode) {

    switch (kcode) {
      case 38:
        --_selected;
        _selected = (_selected < 0) ? _data.length-1 : _selected;
        break;
      case 40:
        ++_selected;
        _selected = (_selected >= _data.length) ? 0 : _selected;
        break;
      case 13: // press Enter
        _pre_selected = _selected;
        break;
      default: // press non-arrow keys or Enter key, exit
        return ;
    }

    _subscriber(_data, "", _pre_selected, _selected);
    if (_pre_selected === _selected) {
      // Enter key case, reinitialize selected values
      _selected = -1;
      _pre_selected = -1;
    }
    // update pre to current selected
    _pre_selected = _selected;
  }

  return {
    subscribe: function(cb) {
      if (!_subscriber) {
        _subscriber = cb;
      }
    },
    fetchData: _fetchData,
    arrowKey: _arrowKey,
    requireApi: (apiURL) ? true : false,
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

  let debouncedFetchData = debounce(model.fetchData, 100);

  _input.addEventListener("input", function(e){
    let cur_text = e.target.value;
    debouncedFetchData(cur_text);
  });

  _input.addEventListener('keydown', function(e){
    let keyCode = e.keyCode;
    model.arrowKey(keyCode);
  });

  document.addEventListener("click", function(e){
    let cur_click = e.target;
    _closeOptions(cur_click);
  });

  function _closeOptions(elem) {
    let options = _options.children;
    for (let i = 0; i < options.length; ++i) {
      if (elem !== options[i] && elem != _input) {
        _options.innerHTML = "";
      }
    }
  }

  function alterActive(data, pre, next) {
    let pre_elem = _options.querySelector(`div[data-value='${data[pre]}']`);
    let next_elem = _options.querySelector(`div[data-value='${data[next]}']`);
    if (pre_elem) {
      // no current selected element 
      pre_elem.classList.remove("autocom_list_active");
    }
    next_elem.classList.add("autocom_list_active");
  }

  function render(data, cur_text, ...args) {
    if (arguments.length > 2) { 
      // _subscriber called from _arrowKey, no re-render needed
      let pre_selected = args[0];
      let next_selected = args[1];
      if (pre_selected === next_selected) {
        // press Enter case
        let selected_elem = _options.querySelector(`div[data-value='${data[next_selected]}']`);
        selected_elem.click();
      } else {
        alterActive(data, pre_selected, next_selected);
      }
      return ;
    }
    // re-render
    _closeOptions();
    if (data.length) {
      for (let i = 0; i < data.length; ++i) {
        let cur_text_len = cur_text.length;
        let singleOption = document.createElement('div');
        singleOption.setAttribute("data-value", data[i]);
        if (model.requireApi) {
          singleOption.innerHTML = `<strong>${data[i].slice(0, cur_text_len)}</strong>`;
          singleOption.innerHTML += data[i].slice(cur_text_len);
        } else {
          singleOption.innerHTML = data[i];
        }
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
// =============
// ==== END ====
// =============

// ======================
// ==== Whack a Mole ====
// ======================
let new_gameModel = gameModel();
let gameContainer = document.querySelector(".game_container");
gameView(gameContainer, new_gameModel);

function gameModel() {
  
  let _subscriber;
  let _data = {
    fill: [],
    score: 0,
    count: 0,
    total: 10,
  };

  _data.fill = getRandom();

  let _getData = () => _data;

  function _click(addScore) {
    _data.fill = getRandom();
    _data.score += addScore ? 1 : 0;
    ++_data.count;

    _subscriber(_data);
  }

  function _initData() {
    _data.fill = getRandom();
    _data.score = 0;
    _data.count = 0;

    return _data;
  }

  return {
    subscribe: function(cb) {
      if (!_subscriber) {
        _subscriber = cb;
      }
    },
    getData: _getData,
    initData: _initData,
    click: _click,
  };
}

function gameView(container, model) {
  let grid = document.createElement("div");
  let point = document.createElement("div");

  grid.setAttribute("class", "grid");
  point.setAttribute("class", "point");

  container.appendChild(grid);
  container.appendChild(point);

  function render(data) {
    let {fill, score, count, total} = data;

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    if (count < total) {
      grid.appendChild( createGrid(fill) );
      point.innerHTML = "Current Score: " + score;
    } else {
      point.innerHTML = "<b>Final Score: " + score + "</b>";
      let restart = document.createElement("div");
      restart.setAttribute("class", "restart");
      restart.innerHTML = "Play Again";
      grid.appendChild(point);
      grid.appendChild(restart);

      restart.addEventListener("click", function(e){
        render(model.initData());
        container.appendChild(point);
        // make it one-time event listener to avoid repetition
        //e.target.removeEventListener(e.type, arguments.callee);
      });
    }
  }

  grid.addEventListener("click", function(e){
    let target = e.target;
    if (!target.className.toLowerCase().includes("cell")) return;

    model.click(target.innerHTML === "M");
  });

  model.subscribe(render);

  render(model.getData());
}

function createGrid(arr) {
  let inner = document.createElement("div");
  for (let i = 0; i < 9; ++i) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell cell2");
    if (arr[i]) {
      cell.innerHTML = "M";
    }
    inner.appendChild(cell);
  }

  return inner;
}

function getRandom() {
  let result = [];
  let num_list = [0,1,2,3,4,5,6,7,8];

  for (let i = 0; i < 3; ++i) {
    let index = getRandomByRange(0, num_list.length - 1);
    result[num_list[index]] = true;
    num_list.splice(index, 1);
  }

  return result;
}

function getRandomByRange(l, r) {
  return Math.floor(Math.random()*(r - l)) + l;
}