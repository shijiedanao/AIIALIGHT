const brightnessSlider = document.getElementById('brightness');
const temperatureSlider = document.getElementById('temperature');
const brightnessValue = document.getElementById('brightnessValue');
const tempValue = document.getElementById('tempValue');
const lightScreen = document.getElementById('lightScreen');

function updateLight() {
    const brightness = brightnessSlider.value;
    const temperature = temperatureSlider.value;
    
    const rgb = kelvinToRGB(temperature);
    lightScreen.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    lightScreen.style.opacity = brightness / 100;
    
    brightnessValue.textContent = `${brightness}%`;
    tempValue.textContent = `${temperature}K`;
}

function kelvinToRGB(kelvin) {
    const temp = kelvin / 100;
    let r, g, b;

    if (temp <= 66) {
        r = 245;
        g = 108.4708025861 * Math.log(temp) - 140.1195681661;
        b = temp <= 19 ? 50 : 120.5177312231 * Math.log(temp - 10) - 280.0447927307;
        
        r = Math.min(255, r * 1.0);
        g = Math.min(255, g * 1.0);
        b = Math.min(255, b * 0.9);
    } else {
        r = 339.698727446 * Math.pow(temp - 60, -0.1332047592);
        g = 315.4221695283 * Math.pow(temp - 60, -0.0755148492);
        b = 245;
        
        r = Math.min(255, r * 0.98);
        g = Math.min(255, g * 1.0);
        b = Math.min(255, b * 1.0);
    }

    return {
        r: clamp(r),
        g: clamp(g),
        b: clamp(b)
    };
}

function clamp(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
}

// 优化移动端触摸事件处理
function handleTouchMove(e) {
    // 只有在滑动控制条时才阻止默认行为
    if (e.target.type === 'range') {
        e.preventDefault();
    }
}

// 移除全局触摸事件阻止
document.removeEventListener('touchmove', e => e.preventDefault());

// 为控制面板添加触摸事件处理
const controls = document.querySelector('.controls');
controls.addEventListener('touchmove', handleTouchMove, { passive: false });

// 添加移动端事件监听
brightnessSlider.addEventListener('touchstart', () => {}, { passive: true });
brightnessSlider.addEventListener('touchmove', () => {}, { passive: true });
temperatureSlider.addEventListener('touchstart', () => {}, { passive: true });
temperatureSlider.addEventListener('touchmove', () => {}, { passive: true });

// 添加输入事件监听
brightnessSlider.addEventListener('input', updateLight);
temperatureSlider.addEventListener('input', updateLight);

// 防止双指缩放
document.addEventListener('gesturestart', e => e.preventDefault());

// 初始化
updateLight();

// 保持屏幕常亮
if (navigator.wakeLock) {
    try {
        navigator.wakeLock.request('screen').catch(err => {
            console.log('Screen wake lock error:', err.message);
        });
    } catch (err) {
        console.log('Wake lock error:', err.message);
    }
} 