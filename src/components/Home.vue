<script setup lang="ts">
import { ref } from 'vue';
import { Mic, Library, User, History, ArrowRight, MicOff } from 'lucide-vue-next';

// 声明本组件会向父组件触发的自定义事件
// - 'start-analysis': 开始分析（传递音频数据）
const emit = defineEmits(['start-analysis']);

// 录音状态
const isRecording = ref(false);
const recordingDuration = ref(0);
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let durationInterval: number | null = null;

// 音频格式：优先使用 WAV（后端接口要求），其次 WebM
// 实现原理：不同浏览器支持的格式不同，需要优雅降级
const getSupportedMimeType = () => {
  const types = [
    'audio/wav',              // WAV 格式（后端支持）
    'audio/webm;codecs=opus', // Chrome 默认
    'audio/webm',
    'audio/ogg;codecs=opus'   // Firefox
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      console.log('使用的音频格式:', type);
      return type;
    }
  }
  return 'audio/webm'; // 回退
};
const MIME_TYPE = getSupportedMimeType();

/**
 * 开始录音的函数
 * 实现原理：
 * 1. 使用 navigator.mediaDevices.getUserMedia 获取麦克风权限
 * 2. 创建 MediaRecorder 实例，设置 MIME_TYPE 为 audio/webm
 * 3. 监听 dataavailable 事件，将音频数据块收集到 audioChunks 数组
 * 4. 监听 stop 事件，将所有音频块合并为一个 Blob，并通过事件发送给父组件
 */
const startRecording = async () => {
  try {
    // 请求麦克风权限，获取音频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // 创建 MediaRecorder 实例
    mediaRecorder = new MediaRecorder(stream, { mimeType: MIME_TYPE });
    audioChunks = [];
    
    // 监听音频数据可用事件（录音过程中会多次触发）
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    // 监听录音停止事件
    mediaRecorder.onstop = () => {
      // 将所有音频块合并为一个 Blob
      const audioBlob = new Blob(audioChunks, { type: MIME_TYPE });
      
      // 停止所有音轨，释放麦克风资源
      stream.getTracks().forEach(track => track.stop());
      
      // 通知父组件开始分析，传递音频 Blob 和时长
      emit('start-analysis', { audioBlob, duration: recordingDuration.value });
    };
    
    // 开始录音
    mediaRecorder.start(100); // 每 100ms 收集一次数据
    
    // 更新录音状态
    isRecording.value = true;
    recordingDuration.value = 0;
    
    // 启动计时器，显示录音时长
    durationInterval = window.setInterval(() => {
      recordingDuration.value++;
    }, 1000);
    
  } catch (error) {
    console.error('无法访问麦克风:', error);
    alert('无法访问麦克风，请检查浏览器权限设置');
  }
};

/**
 * 停止录音的函数
 * 实现原理：
 * 1. 检查 MediaRecorder 是否正在录音
 * 2. 调用 requestData() 请求最后的数据块
 * 3. 然后调用 stop() 方法停止
 * 4. 清除计时器，更新录音状态
 */
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    // 重要：先请求最后的数据块，然后再停止
    // 否则最后一个数据块可能还没被收集就被停止了
    mediaRecorder.requestData();
    mediaRecorder.stop();
    
    // 清除计时器
    if (durationInterval) {
      clearInterval(durationInterval);
      durationInterval = null;
    }
    
    isRecording.value = false;
  }
};

/**
 * 处理按钮点击事件（按下和松开）
 * 实现原理：
 * - mousedown/touchstart: 开始录音
 * - mouseup/mouseleave/touchend: 停止录音
 */
const handlePressStart = () => {
  startRecording();
};

const handlePressEnd = () => {
  stopRecording();
};

// 格式化录音时长显示
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<template>
  <div class="flex flex-col min-h-screen pb-32">
    <!-- 顶部导航栏 -->
    <nav class="fixed top-0 w-full z-50 bg-[#faf9f5]/80 backdrop-blur-md flex justify-between items-center px-8 h-16">
      <div class="flex items-center gap-4">
        <div class="p-2 rounded-full hover:bg-[#efeeea] cursor-pointer">
          <div class="w-6 h-0.5 bg-[#42493e] mb-1.5"></div>
          <div class="w-6 h-0.5 bg-[#42493e] mb-1.5"></div>
          <div class="w-4 h-0.5 bg-[#42493e]"></div>
        </div>
        <h1 class="font-['Manrope'] font-extrabold italic tracking-tighter text-2xl text-[#33602d]">闻啼鸟</h1>
      </div>
      <div class="flex items-center gap-2">
        <User class="text-[#33602d] w-8 h-8 cursor-pointer hover:bg-[#efeeea] p-1 rounded-full" />
      </div>
    </nav>

    <!-- 主体内容 -->
    <main class="flex-grow pt-16 px-8 flex flex-col items-center justify-center relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 -z-10 pointer-events-none opacity-40">
        <div class="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-[#a1d494]/20 blur-[80px]"></div>
        <div class="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-[#cae6ff]/20 blur-[100px]"></div>
      </div>

      <!-- 标题 -->
      <header class="text-center mb-16 max-w-md">
        <h2 class="font-['Manrope'] font-extrabold text-4xl lg:text-5xl text-[#33602d] tracking-tight leading-tight mb-4">
          听，那是谁在唱歌？
        </h2>
        <p class="text-[#42493e] font-medium text-lg leading-relaxed">让 AI 帮您识别周围的鸟鸣声</p>
      </header>

      <!-- 录音界面 -->
      <div class="w-full max-w-xl flex flex-col items-center">
        <!-- 模拟波形 -->
        <div class="w-full h-32 flex items-center justify-center gap-1 mb-12 bg-[#f4f4f0]/50 backdrop-blur-sm rounded-[2rem] rounded-tr-md rounded-bl-sm p-8 shadow-sm">
          <div v-for="i in 20" :key="i" 
               class="w-1 bg-[#3b6934] rounded-full mx-0.5"
               :style="{ height: `${Math.random() * 80 + 20}%` }">
          </div>
        </div>

        <!-- 录音按钮：支持按住录音 -->
        <!-- 实现原理：使用 mousedown/mouseup（桌面）和 touchstart/touchend（移动端）事件 -->
        <!-- 按下按钮开始录音，松开按钮停止录音并发送给后端 -->
        <div class="relative group">
          <div class="absolute inset-0 bg-[#33602d]/10 rounded-full scale-125 blur-2xl group-active:scale-110 transition-transform duration-500"
               :class="{ 'animate-pulse scale-150': isRecording }"></div>
          <button 
            @mousedown="handlePressStart"
            @mouseup="handlePressEnd"
            @mouseleave="handlePressEnd"
            @touchstart.prevent="handlePressStart"
            @touchend.prevent="handlePressEnd"
            class="relative w-48 h-48 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
            :class="isRecording 
              ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30' 
              : 'bg-gradient-to-br from-[#33602d] to-[#4b7a43] shadow-[#33602d]/30'"
          >
            <!-- 录音中显示停止图标 + 时长 -->
            <div v-if="isRecording" class="flex flex-col items-center">
              <MicOff :size="48" fill="currentColor" />
              <span class="text-white text-lg font-bold mt-2">{{ formatDuration(recordingDuration) }}</span>
            </div>
            <!-- 未录音显示麦克风图标 -->
            <Mic v-else :size="64" fill="currentColor" class="text-white" />
          </button>
          <!-- 提示文字 -->
          <p class="text-center mt-4 text-sm text-[#42493e]">
            {{ isRecording ? '松开停止录音' : '按住开始录音' }}
          </p>
        </div>

        <!-- 历史记录 -->
        <a class="mt-16 flex items-center gap-2 text-[#33602d] font-semibold group cursor-pointer">
          <History :size="20" />
          <span class="border-b border-transparent group-hover:border-[#33602d] transition-all">查看历史记录</span>
        </a>
      </div>

      <!-- 每日推荐 -->
      <section class="mt-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-4 rounded-[1.5rem] shadow-sm flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
          <div class="relative rounded-xl overflow-hidden mb-4 h-48">
            <img src="https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&q=80&w=400" 
                 alt="普通翠鸟" 
                 class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute top-3 left-3 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold text-[#33602d]">每日推荐</div>
          </div>
          <div class="px-2">
            <h3 class="font-['Manrope'] font-bold text-xl text-[#1b1c1a]">普通翠鸟</h3>
            <p class="text-[#42493e] italic text-sm mb-2">Alcedo atthis</p>
            <p class="text-[#42493e] text-sm line-clamp-2">翠鸟体型较小，羽色艳丽，常出没于水边捕食小鱼。其叫声清脆短促...</p>
          </div>
        </div>
        <div class="bg-[#efeeea] p-8 rounded-[1.5rem] flex flex-col justify-center">
          <h3 class="font-['Manrope'] font-bold text-2xl text-[#33602d] mb-4">您知道吗？</h3>
          <p class="text-[#42493e] leading-relaxed">清晨的鸟鸣交响乐被称为“黎明大合唱”。这是鸟类通过歌声宣告领地并吸引伴侣的最佳时刻，此时空气清新，声音传播效果最好。</p>
          <button class="mt-6 flex items-center text-[#33602d] font-bold gap-2 group">
            探索更多百科 <ArrowRight :size="20" class="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </main>

    <!-- 底部导航栏 -->
    <footer class="fixed bottom-0 left-0 w-full z-50">
      <div class="bg-[#faf9f5]/80 backdrop-blur-md rounded-t-[1.5rem] shadow-2xl shadow-[#33602d]/5 flex justify-around items-center px-6 pb-8 pt-4">
        <a class="flex flex-col items-center justify-center bg-[#3b6934] text-white rounded-full px-6 py-2 shadow-lg shadow-[#33602d]/20 scale-90 transition-transform duration-300 ease-out" href="#">
          <Mic :size="24" />
          <span class="text-[11px] font-medium leading-tight">Home</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#42493e] px-4 py-2 hover:text-[#33602d] transition-colors" href="#">
          <Library :size="24" />
          <span class="text-[11px] font-medium leading-tight">Library</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#42493e] px-4 py-2 hover:text-[#33602d] transition-colors" href="#">
          <User :size="24" />
          <span class="text-[11px] font-medium leading-tight">Profile</span>
        </a>
      </div>
    </footer>
  </div>
</template>
