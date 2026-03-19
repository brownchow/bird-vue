<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { X, MoreHorizontal, MapPin, Activity, CheckCircle2, AlertCircle } from 'lucide-vue-next';
import axios from 'axios';

// 接收父组件传递的音频数据
// 实现原理：从 App.vue 传递过来的 { audioBlob, duration }
const props = defineProps<{
  audio?: {
    audioBlob: Blob;
    duration: number;
  } | null;
}>();

// 向父组件发送事件：
// - 'analysis-complete'：分析结束时回传结果
// - 'back'：返回上一步（Home）
const emit = defineEmits(['analysis-complete', 'back']);

// 进度条数值
const progress = ref(0);
// 状态文字
const statusText = ref('AI 正在破译这段旋律...');
// 错误信息（用于调试显示）
const errorMessage = ref<string | null>(null);

// 错误状态：是否显示错误界面
const isError = ref(false);

// 开始分析的主函数
// 实现原理：将音频 Blob 封装为 FormData，发送到后端 /analyze 接口
const startAnalysis = async () => {
  // 模拟进度条动画
  const interval = setInterval(() => {
    if (progress.value < 90 && !isError.value) {
      progress.value += Math.random() * 10;
    }
  }, 500);

  try {
    // 构建 FormData，将音频文件发送到后端
    const formData = new FormData();
    if (props.audio?.audioBlob) {
      // 根据实际录音格式设置文件扩展名
      // 实现原理：后端根据文件扩展名判断音频格式，WAV 格式需要 .wav 扩展名
      const mimeType = props.audio.audioBlob.type;
      const extension = mimeType.includes('wav') ? 'wav' : 
                       mimeType.includes('webm') ? 'webm' : 
                       mimeType.includes('ogg') ? 'ogg' : 'audio';
      const fileName = `recording.${extension}`;
      
      console.log('发送的音频:', {
        fileName,
        mimeType,
        size: props.audio.audioBlob.size,
        duration: props.audio.duration
      });
      
      formData.append('file', props.audio.audioBlob, fileName);
    } else {
      throw new Error('没有录音数据');
    }

    console.log('发送请求到 http://localhost:8000/analyze');
    
    // 调用后端接口
    const response = await axios.post('http://localhost:8000/analyze', formData, {
      timeout: 10000,
      headers: {
        // 明确指定 Content-Type，让 axios 自动处理 boundary
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 请求成功，清理定时器并返回结果
    clearInterval(interval);
    progress.value = 100;
    setTimeout(() => emit('analysis-complete', response.data), 500);
  } catch (error: any) {
    // 请求失败或超时，停止进度条并显示错误
    clearInterval(interval);
    isError.value = true;
    progress.value = 0;
    statusText.value = '后端服务调用失败';
    
    // 判断错误类型并设置友好的错误提示
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        errorMessage.value = `请求超时: 后端服务 ${error.config?.url} 无法响应，可能是后端未启动`;
      } else if (error.response) {
        errorMessage.value = `后端返回错误: ${error.response.status} ${error.response.statusText}`;
      } else if (error.message.includes('Network Error')) {
        errorMessage.value = '网络错误: 无法连接到后端服务，请确保后端已启动在 localhost:8000';
      } else {
        errorMessage.value = `请求失败: ${error.message}`;
      }
    } else {
      errorMessage.value = `未知错误: ${error}`;
    }
    
    console.error('API 调用失败:', errorMessage.value);
  }
};

// 重试函数
const retry = () => {
  isError.value = false;
  errorMessage.value = null;
  progress.value = 0;
  statusText.value = 'AI 正在破译这段旋律...';
  startAnalysis();
};

onMounted(() => {
  startAnalysis();
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-8 pt-16 pb-24 relative overflow-hidden">
    <!-- 顶部导航 -->
    <header class="fixed top-0 w-full z-50 bg-[#faf9f5]/80 backdrop-blur-md flex justify-between items-center px-8 h-16">
      <div class="flex items-center gap-4">
        <button @click="emit('back')" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#efeeea] transition-colors">
          <X class="text-[#33602d]" />
        </button>
        <h1 class="font-['Manrope'] font-bold tracking-tight text-lg text-[#33602d]">分析中</h1>
      </div>
      <div class="text-[#33602d] font-extrabold italic tracking-tighter text-2xl font-['Manrope']">闻啼鸟</div>
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#efeeea] transition-colors">
        <MoreHorizontal class="text-[#33602d]" />
      </button>
    </header>

    <!-- 背景装饰 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 -right-20 w-96 h-96 bg-[#a1d494]/20 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#cae6ff]/30 rounded-full blur-[80px]"></div>
    </div>

    <!-- 分析动画 -->
    <div class="relative w-full max-w-md aspect-square flex items-center justify-center">
      <!-- 脉冲圆环 -->
      <div class="absolute w-[90%] h-[90%] border border-[#33602d]/10 rounded-full animate-[ping_3s_infinite] opacity-20"></div>
      <div class="absolute w-[75%] h-[75%] border border-[#33602d]/20 rounded-full animate-[ping_2s_infinite] opacity-40"></div>
      <div class="absolute w-[60%] h-[60%] border border-[#33602d]/40 rounded-full"></div>

      <!-- 中心波形 -->
      <div class="relative z-10 w-48 h-48 bg-white rounded-full shadow-2xl shadow-[#33602d]/10 flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-[#33602d]/10 via-transparent to-[#90cdfd]/20"></div>
        <div class="flex items-end gap-1.5 h-16">
          <div v-for="i in 5" :key="i" 
               class="w-1.5 bg-[#33602d] rounded-full animate-pulse"
               :style="{ height: `${Math.random() * 60 + 40}%`, animationDelay: `${i * 0.1}s` }">
          </div>
        </div>
        <div class="absolute inset-0 border-[6px] border-[#33602d]/5 rounded-full ring-[20px] ring-[#33602d]/5 blur-xl"></div>
      </div>

      <!-- 悬浮标签 -->
      <div class="absolute top-[10%] right-[5%] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-[#c2c9bb]/10">
        <span class="text-xs font-medium text-[#33602d] flex items-center gap-2">
          <Activity :size="14" /> 频率: 4.2kHz
        </span>
      </div>
      <div class="absolute bottom-[20%] left-0 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-[#c2c9bb]/10">
        <span class="text-xs font-medium text-[#42493e] flex items-center gap-2">
          <MapPin :size="14" /> 森林栖息地
        </span>
      </div>
    </div>

    <!-- 文字说明 -->
    <div class="mt-12 text-center z-10">
      <h2 class="font-['Manrope'] text-3xl font-extrabold text-[#1b1c1a] tracking-tight leading-tight">
        {{ statusText }}
      </h2>
      <p v-if="!isError" class="mt-4 text-[#42493e] max-w-xs mx-auto leading-relaxed">
        正在深度神经网络中检索特征，匹配上千种鸟类鸣叫数据库。
      </p>
      <p v-else class="mt-4 text-[#42493e] max-w-xs mx-auto leading-relaxed">
        请检查后端服务是否启动，或点击重试按钮再次尝试。
      </p>
    </div>

    <!-- 状态指示器 -->
    <div class="mt-16 flex flex-col items-center gap-4">
      <!-- 错误界面 -->
      <div v-if="isError" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle class="text-red-500" :size="32" />
        </div>
        <p class="text-sm text-red-600 max-w-xs text-center">{{ errorMessage }}</p>
        <div class="flex gap-3">
          <button @click="emit('back')" class="px-6 py-2 text-sm font-medium text-[#42493e] bg-[#f4f4f0] rounded-full hover:bg-[#e8e6e0] transition-colors">
            返回首页
          </button>
          <button @click="retry" class="px-6 py-2 text-sm font-medium text-white bg-[#33602d] rounded-full hover:bg-[#2a5025] transition-colors">
            重试
          </button>
        </div>
      </div>
      
      <!-- 正常状态 -->
      <template v-else>
        <!-- 错误提示（调试用） -->
        <div v-if="errorMessage" class="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg max-w-sm">
          <AlertCircle class="text-red-500" :size="16" />
          <span class="text-xs text-red-600">{{ errorMessage }}</span>
        </div>
        
        <div class="flex items-center gap-2 px-6 py-3 bg-[#33602d]/10 rounded-full">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#33602d] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-[#33602d]"></span>
          </span>
          <span class="text-sm font-semibold tracking-wide text-[#33602d]">匹配率 {{ Math.floor(progress) }}%...</span>
        </div>

        <!-- 进度条容器 -->
        <div class="mt-8 p-6 bg-[#f4f4f0] rounded-tl-3xl rounded-tr-xl rounded-br-3xl rounded-bl-lg w-72 border border-[#c2c9bb]/5">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#42493e]/60">实时音轨</span>
            <span class="text-[10px] font-medium text-[#33602d]">00:08</span>
          </div>
          <div class="flex gap-1 items-center justify-center h-8">
            <div class="flex-1 h-2 bg-[#c2c9bb]/20 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-[#33602d] to-[#4b7a43] transition-all duration-300" :style="{ width: `${progress}%` }"></div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 底部标识 -->
    <div class="fixed bottom-12 left-1/2 -translate-x-1/2 text-[11px] font-medium text-[#73796d] flex items-center gap-2 opacity-50">
      <CheckCircle2 :size="14" /> 基于深度学习音频分析系统 v4.2
    </div>
  </div>
</template>
