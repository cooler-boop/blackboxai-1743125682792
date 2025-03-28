export class Router {
    constructor() {
        this.routes = {
            '/': { title: '百瓜 - 首页', requiresAuth: false },
            '/explore': { title: '百瓜 - 发现', requiresAuth: false },
            '/profile': { title: '百瓜 - 我的', requiresAuth: true },
            '/404': { title: '百瓜 - 页面不存在', requiresAuth: false }
        };
    }

    async route(path = window.location.pathname) {
        const route = this.routes[path] || this.routes['/404'];
        
        // Show loading spinner
        document.getElementById('content').innerHTML = `
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        `;

        if (route.requiresAuth && !this.isAuthenticated()) {
            return this.navigate('/');
        }

        try {
            const html = await fetch(`pages${path === '/' ? '/home' : path}.html`).then(r => r.text());
            document.getElementById('content').innerHTML = html;
            document.title = route.title;
        } catch {
            this.navigate('/404');
        }
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.route(path);
    }

    isAuthenticated() {
        return false;
    }
}