// 帖子卡片组件
export class PostCard {
    constructor(postData) {
        this.data = postData;
    }

    render() {
        const { user, content, images, stats, timestamp, category } = this.data;
        
        return `
            <div class="bg-white rounded-lg shadow-sm mb-4 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div class="p-4">
                    <div class="flex items-center mb-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-white text-sm"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">${user.name}</p>
                            <p class="text-xs text-gray-500">${this.formatTime(timestamp)} · ${category}</p>
                        </div>
                    </div>
                    
                    <p class="mb-3 text-gray-800 leading-relaxed">${content}</p>
                    
                    ${this.renderImages(images)}
                    
                    <div class="flex justify-between items-center text-gray-500 pt-3 border-t border-gray-100">
                        <button class="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200" onclick="toggleLike(${this.data.id})">
                            <i class="far fa-heart"></i>
                            <span>${stats.likes}</span>
                        </button>
                        <button class="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200" onclick="showComments(${this.data.id})">
                            <i class="far fa-comment"></i>
                            <span>${stats.comments}</span>
                        </button>
                        <button class="flex items-center space-x-1 hover:text-yellow-500 transition-colors duration-200" onclick="toggleBookmark(${this.data.id})">
                            <i class="far fa-bookmark"></i>
                            <span>收藏</span>
                        </button>
                        <button class="flex items-center space-x-1 hover:text-green-500 transition-colors duration-200" onclick="sharePost(${this.data.id})">
                            <i class="fas fa-share"></i>
                            <span>分享</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderImages(images) {
        if (!images || images.length === 0) return '';
        
        if (images.length === 1) {
            return `<div class="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                <img src="${images[0]}" alt="Post image" class="w-full h-full object-cover" loading="lazy">
            </div>`;
        }
        
        return `<div class="grid grid-cols-3 gap-1 mb-3">
            ${images.slice(0, 3).map(img => 
                `<div class="aspect-square bg-gray-200 rounded overflow-hidden">
                    <img src="${img}" alt="Post image" class="w-full h-full object-cover" loading="lazy">
                </div>`
            ).join('')}
        </div>`;
    }

    formatTime(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return '刚刚';
        if (diffInHours < 24) return `${diffInHours}小时前`;
        if (diffInHours < 48) return '昨天';
        return postTime.toLocaleDateString('zh-CN');
    }
}