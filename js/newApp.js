import { Router } from './newRouter.js';
import { StorageManager } from './utils/storage.js';
import { ApiClient } from './utils/api.js';
import { PostCard } from './components/PostCard.js';

// 全局应用状态
class AppState {
    constructor() {
        this.user = null;
        this.posts = [];
        this.notifications = [];
        this.isOnline = navigator.onLine;
        this.theme = StorageManager.getItem('theme') || 'light';
    }

    setUser(user) {
        this.user = user;
        StorageManager.setItem('user', user);
    }

    setPosts(posts) {
        this.posts = posts;
        StorageManager.setItem('posts', posts);
    }

    addPost(post) {
        this.posts.unshift(post);
        StorageManager.setItem('posts', this.posts);
    }
}

// 组件定义
const components = {
    header: `
        <header class="bg-white shadow-sm sticky top-0 z-10">
            <div class="container mx-auto px-4 py-3 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <button onclick="toggleSidebar()" class="text-gray-700 hover:text-blue-500 transition-colors duration-200">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold text-gray-800">百瓜</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="navigateTo('search')" class="text-gray-700 hover:text-blue-500 transition-colors duration-200">
                        <i class="fas fa-search text-xl"></i>
                    </button>
                    <button onclick="navigateTo('profile')" class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center hover:shadow-lg transition-shadow duration-200">
                        <i class="fas fa-user text-white text-sm"></i>
                    </button>
                </div>
            </div>
            
            <!-- 侧边栏 -->
            <div id="sidebar" class="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform -translate-x-full transition-transform duration-300 z-20">
                <div class="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                            <i class="fas fa-user text-white"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-white">用户昵称</h2>
                            <p class="text-blue-100 text-sm">欢迎回来！</p>
                        </div>
                    </div>
                </div>
                <nav class="p-2">
                    <ul class="space-y-1">
                        <li><a href="#" onclick="navigateTo('home'); closeSidebar(); return false;" class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <i class="fas fa-home text-gray-600"></i>
                            <span>首页</span>
                        </a></li>
                        <li><a href="#" onclick="navigateTo('explore'); closeSidebar(); return false;" class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <i class="fas fa-compass text-gray-600"></i>
                            <span>发现</span>
                        </a></li>
                        <li><a href="#" onclick="navigateTo('messages'); closeSidebar(); return false;" class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <i class="fas fa-envelope text-gray-600"></i>
                            <span>消息</span>
                        </a></li>
                        <li><a href="#" onclick="navigateTo('notifications'); closeSidebar(); return false;" class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <i class="fas fa-bell text-gray-600"></i>
                            <span>通知</span>
                        </a></li>
                        <li><a href="#" onclick="navigateTo('settings'); closeSidebar(); return false;" class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <i class="fas fa-cog text-gray-600"></i>
                            <span>设置</span>
                        </a></li>
                    </ul>
                </nav>
            </div>
            
            <!-- 侧边栏遮罩 -->
            <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-15 hidden" onclick="closeSidebar()"></div>
        </header>
    `,
    
    footer: `
        <footer class="bg-white border-t fixed bottom-0 w-full max-w-md mx-auto shadow-lg">
            <div class="flex justify-around items-center py-2">
                <button onclick="navigateTo('/')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                    <i class="fas fa-home text-xl"></i>
                    <span class="text-xs mt-1">首页</span>
                </button>
                
                <button onclick="navigateTo('explore')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                    <i class="fas fa-compass text-xl"></i>
                    <span class="text-xs mt-1">发现</span>
                </button>
                
                <button onclick="navigateTo('create')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <i class="fas fa-plus text-white text-xl"></i>
                    </div>
                </button>
                
                <button onclick="navigateTo('notifications')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                    <i class="fas fa-bell text-xl"></i>
                    <span class="text-xs mt-1">通知</span>
                </button>
                
                <button onclick="navigateTo('profile')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                    <i class="fas fa-user text-xl"></i>
                    <span class="text-xs mt-1">我的</span>
                </button>
            </div>
        </footer>
    `
};

// 全局函数
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
};

window.closeSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
};

window.toggleLike = function(postId) {
    console.log('点赞帖子:', postId);
    // 实现点赞逻辑
};

window.showComments = function(postId) {
    console.log('查看评论:', postId);
    // 实现评论逻辑
};

window.toggleBookmark = function(postId) {
    console.log('收藏帖子:', postId);
    // 实现收藏逻辑
};

window.sharePost = function(postId) {
    console.log('分享帖子:', postId);
    // 实现分享逻辑
};

// 加载组件到DOM
function loadComponent(componentName, parentElement, position = 'beforeend') {
    if (components[componentName]) {
        parentElement.insertAdjacentHTML(position, components[componentName]);
    }
}

// 网络状态监听
function setupNetworkListeners() {
    window.addEventListener('online', () => {
        window.appState.isOnline = true;
        console.log('网络已连接');
    });

    window.addEventListener('offline', () => {
        window.appState.isOnline = false;
        console.log('网络已断开');
    });
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化应用状态
    window.appState = new AppState();
    window.apiClient = new ApiClient();
    
    // 加载头部和底部组件
    const app = document.getElementById('app');
    loadComponent('header', app, 'afterbegin');
    loadComponent('footer', app, 'beforeend');
    
    // 初始化路由器
    window.router = new Router();
    window.navigateTo = (path) => window.router.navigate(path);
    
    // 设置网络监听
    setupNetworkListeners();
    
    // 加载初始路由
    window.router.route();
    
    console.log('🚀 百瓜应用初始化完成');
});

// 导出供其他模块使用
export { AppState, components };