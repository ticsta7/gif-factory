// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
// 页面渲染完之后 加载
$(function () {
  var canvas = new fabric.Canvas('workSpace', {
    preserveObjectStacking: true
  }); // canvas.backgroundColor = rgba (255,255,255,1),

  document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]; // console.log('e.keycode',e.keyCode);

    if (e && e.keyCode == 46 || e.keyCode == 8) // delete 键
      {
        // 删除图层用
        var obj = canvas.getActiveObject();

        if (obj) {
          canvas.remove(obj);
        }
      }

    ;

    if (e && e.keyCode == 188) // < 键
      {
        //图层向下
        var obj = canvas.getActiveObject();

        if (obj) {
          canvas.sendBackwards(obj);
        }
      }

    ;

    if (e && e.keyCode == 190) // > 键
      {
        //图层向上
        var obj = canvas.getActiveObject();

        if (obj) {
          canvas.bringForward(obj);
        }
      }

    ;
  };

  textInit = function textInit() {
    $(canvas.getObjects()).each(function (index, item) {
      //console.log( item );
      //循环得到的type=text的时候
      if (item.type == 'text') {
        item.on("selected", function () {
          $('#theText').attr('disabled', false);
          $('#theText').val(item.text);
        });
      }
    });
  };

  update_text = function update_text() {
    var t = $("#theText").val();

    if (t.length > 0) {
      var e = canvas.getActiveObject(); //console.log(e),

      e.set("text", t), canvas.discardActiveObject(), canvas.renderAll(), $("#theText").val(""), $("#theText").attr("disabled", !0);
    }
  }; //download按钮


  downloadImg = function downloadImg() {
    //console.log(canvas.toDataURL('png'));
    download(canvas.toDataURL(), "factory-output.png", "image/png");
  }; //info按钮 


  outputInfo = function outputInfo() {
    var obj = canvas.getActiveObject();
    console.log(obj); // if(obj.type == 'image')
    // {

    console.log("top = ".concat(obj.top));
    console.log("left = ".concat(obj.left));
    console.log("angle = ".concat(obj.angle));
    console.log("scaleX = ".concat(obj.scaleX));
    console.log("scaleY = ".concat(obj.scaleY)); // }
  }; //加入gif列表    


  addToGif = function addToGif() {
    var dataUrl = canvas.toDataURL('png');
    var li = $("<li><img src='" + dataUrl + "'/></li>");
    $(".gifList").append(li);
  }; //下载Gif


  downloadGif = function downloadGif() {
    var theDelay = $("#theDelay").val();
    if ($(".gifList li img").length < 2) return alert("素材数量需≥2");
    var gif = new GIF({
      workerScript: "gif.worker.js",
      workers: 2,
      quality: 10,
      width: 460,
      height: 460
    });
    if (theDelay == 0) return alert("请设置间隔时间");
    $('.gifList li img').each(function (index, item) {
      gif.addFrame(item, {
        delay: theDelay
      });
    });
    gif.on('finished', function (blob) {
      download(blob, "test.gif", "image/gif");
    });
    gif.render();
  }; //  载入文字


  var text = new fabric.Text('又出bug了？', {
    left: 110,
    top: 350
  });
  canvas.insertAt(text, 2);
  text.set('top', 350);
  text.set('left', 145);
  text.set('angle', 0);
  text.set('scaleX', 0.68);
  text.set('scaleY', 0.68);
  text.set('fill', 'black'); // 修改颜色 http://fabricjs.com/docs/fabric.Object.html#fill

  text.set({
    cornerSize: 15,
    padding: 5,
    transparentCorners: true,
    //顶角 是否为空心
    cornerStyle: 'circle',
    cornerColor: 'red',
    borderColor: 'red',
    borderSize: 3
  }); //载入图片

  fabric.Image.fromURL('moren.jpg', function (oImg) {
    canvas.insertAt(oImg, 0);
    oImg.set('top', 104);
    oImg.set('left', 72);
    oImg.set('angle', 0);
    oImg.set('scaleX', 1);
    oImg.set('scaleY', 1);
    oImg.set({
      cornerSize: 15,
      padding: 5,
      transparentCorners: true,
      //顶角 是否为空心
      cornerStyle: 'circle',
      cornerColor: 'red',
      borderColor: 'red',
      borderSize: 3
    });
  }); // 复制图层 

  copyTuceng = function copyTuceng() {
    var oldObject = canvas.getActiveObject();

    if (oldObject) {
      // console.log(oldObject);
      var clObject = fabric.util.object.clone(oldObject); // console.log(clObject);
      //位移一点点，别重合

      clObject.set("top", clObject.top + 20);
      clObject.set("left", clObject.left + 20);
      canvas.add(clObject);
      canvas.setActiveObject(clObject);
      canvas.renderAll(); // reinit()
    } else alert("请先选中图层");
  }; // GIF序列双击，删除图层


  $(".gifList").on("dblclick", "li", function () {
    $(this).remove();
  }); // 改变字体颜色

  $('input:radio').change(function () {
    var theTextColor = $('input:radio:checked').val();
    var obj = canvas.getActiveObject();

    if (obj) {
      text.set('fill', theTextColor);
      canvas.renderAll();
    }
  });
  canvas.backgroundColor = "rgba(255,255,255,1)"; // getActiveObject(),insertAt(),sendBackwards(),bringForward
  // http://fabricjs.com/docs/fabric.Canvas.html

  textInit();
});
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65449" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map