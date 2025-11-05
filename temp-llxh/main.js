// 全局变量定义
var maxtheard
var testurl
var lsat_date = 0
var isProgrammaticPause = false;
var Maximum = 0
var all_down_sum = 0
var run = false
var visibl = true
var thread_down = []
var lsat_all_down = 0
var now_speed = 0

async function start_thread(index) {
    try {
        const response = await fetch(testurl, { cache: "no-store", mode: 'cors', referrerPolicy: 'no-referrer' })
        const reader = response.body.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                reader.cancel()
                start_thread(index);
                break;
            }
            if (!run) {
                reader.cancel()
                break
            }
            thread_down[index] += value.length
        }
    } catch (err) {
        console.log(err)
        if (run) start_thread(index);
    }
}
async function cale() {
    var all_down_a = sum(thread_down)
    now_speed = (all_down_a - lsat_all_down) / (new Date().getTime() - lsat_date) * 1000 / 1024 / 1024;
    if (visibl) document.getElementById("speed").innerText = show((all_down_a - lsat_all_down) / (new Date().getTime() - lsat_date) * 1000, ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'], [0, 0, 1, 2, 2, 2]);

    if (!visibl) document.title = show((all_down_sum + all_down_a), ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 0, 2, 2, 2]) + ' ' + show((all_down_a - lsat_all_down) / (new Date().getTime() - lsat_date) * 1000, ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'], [0, 0, 0, 2, 2, 2]);
    lsat_all_down = all_down_a
    lsat_date = new Date().getTime();
    if (run) setTimeout(cale, 1000)
    else {
        var avg_speed = 1000 * (all_down_a) / (new Date().getTime() - start_time)
        now_speed = 0
        document.getElementById("speed").innerText = show((avg_speed), ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'], [0, 0, 1, 2, 2, 2]);

        lsat_all_down = 0
        document.getElementById('describe').innerText = '平均速度';


    }
}

async function total() {
    var all_down = sum(thread_down)
    if (visibl) document.getElementById("total").innerText = show((all_down_sum + all_down), ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2]);
    if ((all_down_sum + all_down) >= Maximum && Maximum != 0) stop()
    if (run) setTimeout(total, 16)
    else {
        all_down_sum += all_down;
        document.getElementById("total").innerText = show((all_down_sum), ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2]);
    }
}

async function start() {
    if (all_down_sum >= Maximum && Maximum != 0) {
        all_down_sum = 0
    }
    maxtheard = document.getElementById("thread").value;
    testurl = document.getElementById("link").value;
    // if (testurl.length < 10) {
    //     alert("链接不合法")
    //     return;
    // }
    // testurl = testurl.substring(0, 5).toLowerCase() + testurl.substring(5, testurl.length);
    // if (!checkURL(testurl)) {
    //     alert("链接不合法")
    //     return;
    // }
    // if (testurl.startsWith("http://")) {
    //     alert("由于浏览器安全限制，不支持http协议，请使用https协议")
    //     return;
    // }
    // if (!testurl.startsWith("https://")) {
    //     alert("链接不合法")
    //     return;
    // }
    // if (testurl.includes("lolicp.com")) {
    //     alert("包含禁止的域名");
    //     return;
    // }
    // if (testurl.includes("gov.cn")) {
    //     alert("包含禁止的域名");
    //     return;
    // }
    // document.getElementById('do').innerText = '正在检验链接...';
    document.getElementById('do').disabled = true;
    
    // 播放背景音乐（如果"保持后台运行"被选中）
    if (document.getElementById("customSwitch2").checked) {
        try {
            // 先设置音量避免静音问题
            document.getElementById("music").volume = 0.01;
            // 使用Promise处理播放，确保在用户交互后播放
            var playPromise = document.getElementById("music").play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log("音频播放成功");
                }).catch(function(error) {
                    console.log("音频播放失败:", error);
                    // 如果自动播放失败，提示用户手动点击播放
                    console.log("提示：某些浏览器需要用户手动交互后才能自动播放音频");
                });
            }
        } catch (error) {
            console.log("音频播放异常:", error);
        }
    }

    try {
        const response = await fetch(testurl, { cache: "no-store", mode: 'cors', referrerPolicy: 'no-referrer' })
        const reader = response.body.getReader();
        const { value, done } = await reader.read();
        if (value.length <= 0) throw "资源响应异常";
        reader.cancel()
    } catch (err) {
        console.warn(err)
        document.getElementById('do').innerText = '开始';
        document.getElementById('do').disabled = false;
        alert("该链接不可用，如果你能够正常访问该链接，那么很有可能是浏览器的跨域限制")
        return
    }



    document.getElementById('describe').innerText = '实时速度';
    document.getElementById('do').innerText = '停止';
    document.getElementById('do').disabled = false;
    // 添加过渡动画
    document.getElementById('do').style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    document.getElementById('do').style.backgroundColor = '#b1211a';
    document.getElementById('do').style.boxShadow = '0 4px 15px rgba(177, 33, 26, 0.3)';
    document.getElementById('do').style.borderColor = '#b1211a';
    var num = maxtheard
    lsat_all_down = 0
    start_time = new Date().getTime()
    run = true
    thread_down = []
    while (num--) {
        thread_down[num] = 0
        start_thread(num)
    }
    cale()
    total()
}

function stop() {
    run = false
    document.getElementById('do').innerText = '开始';
    // 添加过渡动画
    document.getElementById('do').style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    document.getElementById('do').style.backgroundColor = '#1ab15c';
    document.getElementById('do').style.boxShadow = '0 4px 15px rgba(26, 177, 92, 0.3)';
    document.getElementById('do').style.borderColor = '#1ab15c';
    
    // 设置程序暂停标志，避免触发勾选取消
    if (typeof isProgrammaticPause !== 'undefined') {
        isProgrammaticPause = true;
    }
    
    // 暂停背景音乐
    document.getElementById("music").pause();
}

function sum(arr) {
    var s = 0;
    for (var i = 0; i < arr.length; i++) {
        s += arr[i];
    }
    return s;
}

function botton_clicked() {
    if (run) {
        stop();
    } else {
        start();
    }
}

function checkURL(URL) {
    var str = URL;
    var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(Expression);
    if (objExp.test(str) == true) {
        return true;
    } else {
        return false;
    }
}

// 工具函数 - 显示格式化
function show(num, des, flo) {
    var cnum = num;
    var total_index = 0;
    while (cnum >= 1024) {
        if (total_index == des.length - 1) break;
        cnum = cnum / 1024;
        total_index++;
    }
    return cnum.toFixed(flo[total_index]) + des[total_index];
}

// 音乐控制函数
function musiccontrol(botton) {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        if (document.getElementById("customSwitch2").checked) document.getElementById("music").play()
        else document.getElementById("music").pause()
    }
}

// Cookie操作函数
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// 设置流量上限
function setMax(inputMax) {
    if (inputMax > 0) {
        setCookie("Max", inputMax, 365)
        Maximum = inputMax * 1073741824
        document.getElementById("showMax").innerText = show(Maximum, ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], [0, 0, 1, 2, 2, 2])
    } else {
        Maximum = 0
        document.getElementById("showMax").innerText = '不限制'
        setCookie("Max", 0, 365)
    }
}

// 页面加载初始化
function initializePage() {
    // 禁用双击放大(防止按加减按钮误触)
    var lastTouchEnd = 0
    if (!!('ontouchstart' in window || navigator.maxTouchPoints)) {
        document.documentElement.addEventListener(
            'touchend',
            function(event) {
                var now = Date.now()
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault()
                }
                lastTouchEnd = now
            }, {
                passive: false
            }
        )
    }
    
    // 初始化设置
    document.getElementById("customSwitch2").checked = true
    
    // 音频事件监听
    document.getElementById("music").addEventListener("pause", function() {
        if (run && !visibl) botton_clicked()
        if (!isProgrammaticPause) {
            document.getElementById("customSwitch2").checked = false
        }
        isProgrammaticPause = false;
    })
    
    document.getElementById("music").addEventListener("play", function() {
        if (!(run || visibl)) botton_clicked()
        document.getElementById("customSwitch2").checked = true
    })
    
    // 恢复Cookie设置
    document.getElementById('url_diy').value = getCookie("url_diy");
    if (getCookie("select")) document.getElementById('select').selectedIndex = getCookie("select");
    var selector = document.getElementById("select");
    document.getElementById('link').value = selector.options[selector.selectedIndex].value;
    setMax(getCookie('Max'))
      
    // 页面可见性变化监听
    document.addEventListener("visibilitychange", function() {
        var string = document.visibilityState
        if (string === 'hidden') {
            visibl = false
            if (run && !document.getElementById("customSwitch2").checked) botton_clicked();
        }
        if (string === 'visible') {
            visibl = true
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage);
