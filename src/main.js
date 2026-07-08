/* ★★★ 1. 核心修复：使用网络地址 (CDN)，浏览器就能看懂了 ★★★ */
// ✅ 正确的代码 (使用在线 CDN 地址)
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ==================== 0. 全局设置 ====================
const state = { 
    lang: 'cn', // 默认中文
    isTouring: false, 
    musicPlaying: false 
};

// 中英文词典
const texts = {
    cn: {
        coverTitle: "翠湖·宫灯夜赏",
        coverSubtitle: "基于WebVR的沉浸式文化遗产漫游系统",
        enter: "点击进入",
        loading: "资源加载中...",
        title: "翠湖夜游",
        instruction: "🖱️ 拖拽旋转 | 👆 点击宫灯祈福",
        btnSettings: "⚙️ 设置", btnHelp: "❓ 帮助", 
        btnTourOn: "🛑 停止巡游", btnTourOff: "🚶 自动巡游",
        settingsTitle: "系统设置", labelMusic: "背景音乐", labelLang: "语言选择",
        popupTitle: "清代·六角宫灯",
        popupContent: "宫灯是昆明翠湖夜游的标志性景观。这种六边形设计寓意'六合时邕'（天下太平）。点击灯笼祈福，愿事事顺遂。",
        close: "关闭",
        helpTitle: "操作指南",
        helpList: "<li>🖱️ <b>左键拖拽</b>：旋转视角</li><li>🖱️ <b>右键拖拽</b>：平移视角</li><li>🖱️ <b>滚轮滚动</b>：缩放距离</li>"
    },
    en: {
        coverTitle: "Green Lake Lanterns",
        coverSubtitle: "Immersive WebVR Heritage Tour",
        enter: "ENTER EXPERIENCE",
        loading: "Loading...",
        title: "Night Tour",
        instruction: "🖱️ Drag to Rotate | 👆 Click Lantern to Pray",
        btnSettings: "⚙️ Settings", btnHelp: "❓ Help", 
        btnTourOn: "🛑 Stop Tour", btnTourOff: "🚶 Auto Tour",
        settingsTitle: "Settings", labelMusic: "Background Music", labelLang: "Language",
        popupTitle: "Hexagonal Palace Lantern",
        popupContent: "The hexagonal design represents 'Universal Peace'. Light a lantern to make a wish.",
        close: "Close",
        helpTitle: "Instructions",
        helpList: "<li>🖱️ <b>Left Drag</b>: Rotate View</li><li>🖱️ <b>Right Drag</b>: Pan View</li><li>🖱️ <b>Scroll</b>: Zoom</li>"
    }
};

// ==================== 2. 界面更新逻辑 ====================
function updateInterfaceText() {
    const t = texts[state.lang];
    
    // 辅助函数：安全设置文字
    const set = (id, txt) => { const el = document.getElementById(id); if(el) el.innerHTML = txt; };

    set('cover-title', t.coverTitle);
    set('cover-subtitle', t.coverSubtitle);
    set('ui-title', t.title);
    set('ui-instruction', t.instruction);
    set('btn-menu', t.btnSettings);
    set('btn-help', t.btnHelp);
    set('settings-title', t.settingsTitle);
    set('label-music', t.labelMusic);
    set('label-lang', t.labelLang);
    set('popup-title', t.popupTitle);
    set('popup-content', t.popupContent);
    set('btn-close-detail-large', t.close);
    set('help-title', t.helpTitle);
    set('help-list', t.helpList);

    // 特殊处理：封面按钮
    const enterBtn = document.getElementById('enter-btn');
    if(enterBtn) {
        // 如果按钮已经是"ready"状态，显示进入文字，否则显示加载中
        enterBtn.innerText = enterBtn.classList.contains('ready') ? t.enter : t.loading;
    }

    // 特殊处理：封面语言按钮
    const coverLangBtn = document.getElementById('cover-lang-btn');
    if(coverLangBtn) coverLangBtn.innerText = state.lang === 'cn' ? 'English' : '中文';
    
    // 特殊处理：设置页语言按钮
    const settingLangBtn = document.getElementById('lang-toggle-btn');
    if(settingLangBtn) settingLangBtn.innerText = state.lang === 'cn' ? 'English' : '中文';
    
    // 特殊处理：巡游按钮
    const tourBtn = document.getElementById('btn-tour');
    if(tourBtn) tourBtn.innerText = state.isTouring ? t.btnTourOn : t.btnTourOff;
}

// ==================== 3. 3D 场景初始化 ====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505); // 深黑色背景
scene.fog = new THREE.FogExp2(0x050505, 0.02); // 黑色雾气

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- 创建水面 ---
const waterGeo = new THREE.PlaneGeometry(100, 100, 64, 64);
const waterMat = new THREE.MeshStandardMaterial({ 
    color: 0x001e36, roughness: 0.1, metalness: 0.8, flatShading: true 
});
const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI / 2;
water.position.y = -1.5;
scene.add(water);

// --- 创建灯光 & 月亮 ---
scene.add(new THREE.AmbientLight(0x4040ff, 0.1)); // 幽蓝环境光
const moon = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffcc }));
moon.position.set(10, 20, -30);
scene.add(moon);
const moonLight = new THREE.DirectionalLight(0xffffff, 0.5);
moonLight.position.copy(moon.position);
scene.add(moonLight);

// --- 创建宫灯 (生成多个) ---
const lanterns = [];
function createLantern(x, z, delay) {
    const group = new THREE.Group();
    
    // 简单的灯笼造型
    const wood = new THREE.MeshStandardMaterial({ color: 0x330000 });
    const paper = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff4400, emissiveIntensity: 0.6 });
    
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 0.2, 6), wood).translateY(0.5));
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.8, 6), paper));
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.3, 0.2, 6), wood).translateY(-0.5));
    
    // 核心光源
    const light = new THREE.PointLight(0xffaa00, 1.5, 10);
    group.add(light);
    
    group.position.set(x, 0, z);
    group.userData = { originalY: 0, delay: delay, light: light, isLantern: true };
    scene.add(group);
    lanterns.push(group);
}

// 随机生成 15 个灯笼
for(let i=0; i<15; i++) {
    const x = (Math.random()-0.5) * 30;
    const z = (Math.random()-0.5) * 30;
    if(Math.abs(x) > 2) createLantern(x, z, Math.random()*10);
}

// ==================== 4. ★★★ 核心修复：强制解锁按钮 ★★★ ====================
// 不管有没有加载完，1.5秒后强制让用户能进去
setTimeout(() => {
    const btn = document.getElementById('enter-btn');
    const bar = document.getElementById('progress');
    if(btn && bar) {
        bar.style.width = '100%'; // 进度条拉满
        btn.disabled = false;     // 启用按钮
        btn.classList.add('ready'); // 变色
        btn.innerText = texts[state.lang].enter; // 显示“点击进入”
    }
}, 1500);

// ==================== 5. 交互事件 ====================

// 点击进入按钮
const enterBtn = document.getElementById('enter-btn');
if(enterBtn) {
    enterBtn.addEventListener('click', () => {
        document.getElementById('page-cover').classList.add('hidden'); // 隐藏封面
        document.getElementById('page-main').classList.remove('hidden'); // 显示主界面
    });
}

// 封面语言切换
const coverLangBtn = document.getElementById('cover-lang-btn');
if(coverLangBtn) {
    coverLangBtn.addEventListener('click', () => {
        state.lang = state.lang === 'cn' ? 'en' : 'cn';
        updateInterfaceText();
    });
}

// 弹窗控制
const toggleHidden = (id) => document.getElementById(id).classList.toggle('hidden');
const addHidden = (id) => document.getElementById(id).classList.add('hidden');
const removeHidden = (id) => document.getElementById(id).classList.remove('hidden');

document.getElementById('btn-menu')?.addEventListener('click', () => removeHidden('page-settings'));
document.getElementById('btn-help')?.addEventListener('click', () => removeHidden('page-help'));
document.getElementById('btn-close-detail')?.addEventListener('click', () => addHidden('page-detail'));
document.getElementById('btn-close-detail-large')?.addEventListener('click', () => addHidden('page-detail'));

// 设置页语言切换
document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
    state.lang = state.lang === 'cn' ? 'en' : 'cn';
    updateInterfaceText();
});

// 鼠标点击拾取 (点击灯笼)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
    if(event.target.closest('button') || event.target.closest('.modal-box')) return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    // 检查是否点到了灯笼
    const intersects = raycaster.intersectObjects(scene.children, true);
    const hit = intersects.find(obj => obj.object.parent && obj.object.parent.userData.isLantern);
    
    if(hit) {
        removeHidden('page-detail'); // 显示详情弹窗
    }
});

// ==================== 6. 动画循环 ====================
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    
    // 水面波动
    const pos = water.geometry.attributes.position;
    for(let i=0; i < pos.count; i++){
        const x = pos.getX(i);
        const y = pos.getY(i); // 注意平面旋转后坐标系变化
        const z = Math.sin(x*0.5 + t)*0.2 + Math.sin(y*0.3 + t*1.5)*0.1;
        pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    
    // 灯笼浮动
    lanterns.forEach(l => {
        l.position.y = Math.sin(t + l.userData.delay) * 0.2; // 上下浮动
        l.rotation.y += 0.005; // 缓慢自转
        // 烛光闪烁
        l.userData.light.intensity = 1.5 + Math.sin(t*8 + l.userData.delay)*0.5 + Math.random()*0.2;
    });

    renderer.render(scene, camera);
}
animate();

// 初始化文字
updateInterfaceText();

// 窗口大小调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});