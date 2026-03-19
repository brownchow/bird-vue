<script setup lang="ts">
import { ref } from 'vue';
import Home from './components/Home.vue';
import Analyzing from './components/Analyzing.vue';
import Results from './components/Results.vue';

// 应用状态：决定当前显示哪个页面组件（home/分析中/结果页）
// 这种模式常见于“状态机式”UI：用一个状态变量切换不同视图组件。
const appState = ref<'home' | 'analyzing' | 'results'>('home');
const analysisResults = ref<any>(null);

// 当子组件（Home.vue）发出 "start-analysis" 事件时触发
// 这里将状态切换为 "analyzing"，让模板渲染 Analyzing.vue。
const handleStartAnalysis = () => {
  appState.value = 'analyzing';
};

const handleAnalysisComplete = (results: any) => {
  analysisResults.value = results;
  appState.value = 'results';
};

const handleBackToHome = () => {
  appState.value = 'home';
  analysisResults.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-[#faf9f5] font-['Work_Sans'] text-[#1b1c1a]">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
      mode="out-in"
    >
      <!--
      根据 appState 动态渲染不同页面组件：
      - home      -> Home.vue
      - analyzing -> Analyzing.vue
      - results   -> Results.vue

      这里的 @start-analysis / @analysis-complete / @back 都是子组件向父组件发出的事件。
      例如 Home.vue 点击录音按钮后会 emit('start-analysis')，就会触发 handleStartAnalysis，进而切换到 Analyzing.vue。
    -->
    <component
      :is="appState === 'home' ? Home : appState === 'analyzing' ? Analyzing : Results"
      :results="analysisResults"
      @start-analysis="handleStartAnalysis"
      @analysis-complete="handleAnalysisComplete"
      @back="handleBackToHome"
    />
    </transition>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Work+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
