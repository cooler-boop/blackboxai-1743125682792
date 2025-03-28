import { Router } from './newRouter.js';

// Component definitions
const components = {
    header: `<header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <button onclick="toggleSidebar()" class="text-gray-700">
                    <i class="fas fa-bars text-xl"></i>
                </button>
                <h1 class="text-xl font-bold text-gray-800">百瓜</h1>
            </div>
            <div class="flex items-center space-x-4">
                <button onclick="navigateTo('search')" class="text-gray-700">
                    <i class="fas fa-search text-xl"></i>
                </button>
                <button onclick="navigateTo('profile')" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-user text-gray-600"></i>
                </button>
            </div>
        </div>
    </header>`,
    footer: `<footer class="bg-white border-t fixed bottom-0 w-full max-w-md mx-auto">
        <div class="flex justify-around items-center py-2">
            <button onclick="navigateTo('home')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500">
                <i class="fas fa-home text-xl"></i>
                <span class="text-xs mt-1">首页</span>
            </button>
            <button onclick="navigateTo('explore')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500">
                <i class="fas fa-compass text-xl"></i>
                <span class="text-xs mt-1">发现</span>
            </button>
            <button onclick="navigateTo('create')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500">
                <i class="fas fa-plus-circle text-2xl text-blue-500"></i>
            </button>
            <button onclick="navigateTo('notifications')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500">
                <i class="fas fa-bell text-xl"></i>
                <span class="text-xs mt-1">通知</span>
            </button>
            <button onclick="navigateTo('profile')" class="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500">
                <i class="fas fa-user text-xl"></i>
                <span class="text-xs mt-1">我的</span>
            </button>
        </div>
    </footer>`
};

// Load a component into the DOM
function loadComponent(componentName, parentElement, position = 'beforeend') {
    if (components[componentName]) {
        parentElement.insertAdjacentHTML(position, components[componentName]);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer
    loadComponent('header', document.getElementById('app'), 'afterbegin');
    loadComponent('footer', document.getElementById('app'), 'beforeend');
    
    // Initialize router and make navigateTo globally available
    window.router = new Router();
    window.navigateTo = (path) => window.router.navigate(path);
    
    // Load initial route
    window.router.route();
});