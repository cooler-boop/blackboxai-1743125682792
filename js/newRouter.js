export class Router {
    constructor() {
        this.routes = {
            '/': { title: '百瓜 - 首页', requiresAuth: false },
            '/explore': { title: '百瓜 - 发现', requiresAuth: false },
            '/create': { title: '百瓜 - 发布', requiresAuth: false },
            '/notifications': { title: '百瓜 - 通知', requiresAuth: false },
            '/profile': { title: '百瓜 - 我的', requiresAuth: false },
            '/search': { title: '百瓜 - 搜索', requiresAuth: false },
            '/messages': { title: '百瓜 - 消息', requiresAuth: false },
            '/settings': { title: '百瓜 - 设置', requiresAuth: false },
            '/404': { title: '百瓜 - 页面不存在', requiresAuth: false }
        };
        
        this.currentRoute = '/';
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('popstate', () => {
            this.route(window.location.pathname);
        });
    }

    async route(path = window.location.pathname) {
        // 标准化路径
        path = path === '' ? '/' : path;
        
        const route = this.routes[path] || this.routes['/404'];
        this.currentRoute = path;
        
        // 显示加载状态
        this.showLoading();

        // 检查认证
        if (route.requiresAuth && !this.isAuthenticated()) {
            return this.navigate('/');
        }

        try {
            // 构建页面文件路径
            const pagePath = path === '/' ? '/home' : path;
            const response = await fetch(`pages${pagePath}.html`);
            
            if (!response.ok) {
                throw new Error(`页面不存在: ${response.status}`);
            }
            
            const html = await response.text();
            
            // 更新页面内容
            document.getElementById('content').innerHTML = html;
            document.title = route.title;
            
            // 更新导航状态
            this.updateNavigation(path);
            
            // 触发页面加载完成事件
            this.triggerPageLoadEvent(path);
            
        } catch (error) {
            console.error('路由错误:', error);
            if (path !== '/404') {
                this.navigate('/404');
            } else {
                document.getElementById('content').innerHTML = this.get404Page();
            }
        }
    }

    navigate(path) {
        if (path !== this.currentRoute) {
            window.history.pushState({}, '', path);
            this.route(path);
        }
    }

    showLoading() {
        document.getElementById('content').innerHTML = `
            <div class="flex justify-center items-center h-64">
                <div class="flex flex-col items-center space-y-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p class="text-gray-500 text-sm">加载中...</p>
                </div>
            </div>
        `;
    }

    updateNavigation(currentPath) {
        // 更新底部导航栏的活跃状态
        const navButtons = document.querySelectorAll('footer button');
        navButtons.forEach(button => {
            button.classList.remove('text-blue-500');
            button.classList.add('text-gray-600');
        });

        // 根据当前路径高亮对应按钮
        const pathToButtonMap = {
            '/': 0,
            '/explore': 1,
            '/create': 2,
            '/notifications': 3,
            '/profile': 4
        };

        const activeIndex = pathToButtonMap[currentPath];
        if (activeIndex !== undefined && navButtons[activeIndex]) {
            navButtons[activeIndex].classList.remove('text-gray-600');
            navButtons[activeIndex].classList.add('text-blue-500');
        }
    }

    triggerPageLoadEvent(path) {
        const event = new CustomEvent('pageLoaded', { 
            detail: { path, timestamp: Date.now() } 
        });
        window.dispatchEvent(event);
    }

    get404Page() {
        return `
            <div class="flex flex-col items-center justify-center h-64 text-center px-4">
                <div class="text-6xl mb-4">🤔</div>
                <h2 class="text-xl font-semibold text-gray-800 mb-2">页面走丢了</h2>
                <p class="text-gray-600 mb-6">抱歉，您访问的页面不存在</p>
                <button onclick="navigateTo('/')" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    回到首页
                </button>
            </div>
        `;
    }

    isAuthenticated() {
        // 暂时返回 true，后续可以实现真实的认证逻辑
        return true;
    }
}