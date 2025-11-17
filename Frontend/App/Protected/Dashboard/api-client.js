// API Client for TaxMaster Frontend
// Handles all API communication with the backend

class TaxMasterAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('taxmaster_token');
    }

    // Helper method for API calls
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token && !options.skipAuth) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ========== AUTHENTICATION ==========

    async register(username, email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            skipAuth: true,
            body: JSON.stringify({ username, email, password })
        });

        if (data.token) {
            this.token = data.token;
            localStorage.setItem('taxmaster_token', data.token);
            localStorage.setItem('taxmaster_user', JSON.stringify(data.user));
        }

        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            skipAuth: true,
            body: JSON.stringify({ email, password })
        });

        if (data.token) {
            this.token = data.token;
            localStorage.setItem('taxmaster_token', data.token);
            localStorage.setItem('taxmaster_user', JSON.stringify(data.user));

            // Increment session counter
            const sessionCount = parseInt(localStorage.getItem('taxmaster_session_count') || '0') + 1;
            localStorage.setItem('taxmaster_session_count', sessionCount.toString());
        }

        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('taxmaster_token');
        localStorage.removeItem('taxmaster_user');
        window.location.href = '/Public/Auth/signin.html';
    }

    isAuthenticated() {
        return !!this.token;
    }

    getCurrentUser() {
        const user = localStorage.getItem('taxmaster_user');
        return user ? JSON.parse(user) : null;
    }

    // ========== USER ==========

    async getUserProfile() {
        return await this.request('/user/profile');
    }

    async getUserStats() {
        return await this.request('/user/stats');
    }

    async updateUserProfile(username, email) {
        return await this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ username, email })
        });
    }

    async changePassword(currentPassword, newPassword) {
        return await this.request('/user/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }

    // ========== COURSES ==========

    async getCourses() {
        return await this.request('/courses');
    }

    async enrollCourse(courseId, courseTitle, lessonsTotal) {
        return await this.request('/courses/enroll', {
            method: 'POST',
            body: JSON.stringify({ courseId, courseTitle, lessonsTotal })
        });
    }

    async completeLesson(courseId, lessonId, score, duration) {
        return await this.request(`/courses/${courseId}/lesson/${lessonId}/complete`, {
            method: 'POST',
            body: JSON.stringify({ score, duration })
        });
    }

    // ========== ACTIVITIES ==========

    async getActivities() {
        return await this.request('/activities');
    }

    // ========== DASHBOARD ==========

    async getDashboardData() {
        return await this.request('/dashboard');
    }
}

// Create global instance
const api = new TaxMasterAPI();

