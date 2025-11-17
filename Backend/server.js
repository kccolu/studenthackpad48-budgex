// TaxMaster Backend Server
// Run with: node server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;
// ========== SCHEMAS ==========

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: function() {
            return this.username.substring(0, 2).toUpperCase();
        }
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Course Progress Schema
const courseProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    courseTitle: String,
    progress: {
        type: Number,
        default: 0
    },
    lessonsCompleted: {
        type: Number,
        default: 0
    },
    lessonsTotal: Number,
    currentLesson: {
        type: Number,
        default: 1
    },
    enrolledDate: {
        type: Date,
        default: Date.now
    },
    lastAccessed: Date,
    completed: {
        type: Boolean,
        default: false
    },
    lessons: [{
        lessonId: Number,
        title: String,
        duration: Number,
        completed: {
            type: Boolean,
            default: false
        },
        score: Number,
        completedDate: Date
    }]
}, { timestamps: true });

// Activity Schema
const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['lesson_completed', 'course_enrolled', 'course_completed', 'achievement_earned'],
        required: true
    },
    courseId: String,
    lessonId: Number,
    title: String,
    score: Number,
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Stats Schema
const statsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    coursesEnrolled: {
        type: Number,
        default: 0
    },
    coursesCompleted: {
        type: Number,
        default: 0
    },
    learningTimeHours: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    totalLessons: {
        type: Number,
        default: 0
    },
    completedLessons: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
const Activity = mongoose.model('Activity', activitySchema);
const Stats = mongoose.model('Stats', statsSchema);

const courseCatalog = [
    { id: "tax-fundamentals", title: "Tax Fundamentals", icon: "💰", level: "beginner", lessonsTotal: 12, timeEstimate: "8 hours" },
    { id: "investment-strategies", title: "Investment Strategies", icon: "📈", level: "intermediate", lessonsTotal: 15, timeEstimate: "10 hours" },
    { id: "business-finance", title: "Business Finance", icon: "💼", level: "advanced", lessonsTotal: 18, timeEstimate: "12 hours" },
    { id: "retirement-planning", title: "Retirement Planning", icon: "🏖️", level: "intermediate", lessonsTotal: 10, timeEstimate: "6 hours" },
    { id: "real-estate", title: "Real Estate Investing", icon: "🏠", level: "advanced", lessonsTotal: 14, timeEstimate: "9 hours" },
    { id: "crypto-taxes", title: "Cryptocurrency & Taxes", icon: "₿", level: "intermediate", lessonsTotal: 11, timeEstimate: "7 hours" }
];
// ========== MIDDLEWARE ==========

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// ========== AUTH ROUTES ==========

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create initial stats
        const stats = new Stats({ userId: user._id });
        await stats.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                joinDate: user.joinDate
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                joinDate: user.joinDate
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ========== USER ROUTES ==========

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Get user stats
app.get('/api/user/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await Stats.findOne({ userId: req.user.userId });
        res.json(stats || {});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// ========== COURSE ROUTES ==========

// Get all courses for user
app.get('/api/courses', authenticateToken, async (req, res) => {
    try {
        const courses = await CourseProgress.find({ userId: req.user.userId });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Enroll in course
app.post('/api/courses/enroll', authenticateToken, async (req, res) => {
    try {
        const { courseId, courseTitle, lessonsTotal } = req.body;

        // Check if already enrolled
        let course = await CourseProgress.findOne({
            userId: req.user.userId,
            courseId
        });

        if (course) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        // Create course progress
        course = new CourseProgress({
            userId: req.user.userId,
            courseId,
            courseTitle,
            lessonsTotal
        });

        await course.save();

        // Update stats
        await Stats.findOneAndUpdate(
            { userId: req.user.userId },
            { $inc: { coursesEnrolled: 1 } }
        );

        // Add activity
        const activity = new Activity({
            userId: req.user.userId,
            type: 'course_enrolled',
            courseId,
            title: `Enrolled in ${courseTitle}`
        });
        await activity.save();

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
});

// Update lesson progress
app.post('/api/courses/:courseId/lesson/:lessonId/complete', authenticateToken, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const { score, duration } = req.body;

        const course = await CourseProgress.findOne({
            userId: req.user.userId,
            courseId
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Update or add lesson
        const lessonIndex = course.lessons.findIndex(l => l.lessonId === parseInt(lessonId));

        if (lessonIndex >= 0) {
            course.lessons[lessonIndex].completed = true;
            course.lessons[lessonIndex].score = score;
            course.lessons[lessonIndex].completedDate = new Date();
        } else {
            course.lessons.push({
                lessonId: parseInt(lessonId),
                completed: true,
                score,
                duration,
                completedDate: new Date()
            });
        }

        // Update progress
        course.lessonsCompleted = course.lessons.filter(l => l.completed).length;
        course.progress = Math.round((course.lessonsCompleted / course.lessonsTotal) * 100);
        course.lastAccessed = new Date();

        if (course.progress === 100) {
            course.completed = true;
        }

        // ===== Unlock next lesson automatically =====
        const nextLesson = parseInt(lessonId) + 1;
        if (nextLesson <= course.lessonsTotal && course.currentLesson < nextLesson) {
            course.currentLesson = nextLesson;
        }
        await course.save();
            // ============================================

        // Update stats
        const stats = await Stats.findOne({ userId: req.user.userId });
        stats.completedLessons = (stats.completedLessons || 0) + 1;

        // Recalculate average score
        const allCourses = await CourseProgress.find({ userId: req.user.userId });
        let totalScore = 0;
        let totalScoredLessons = 0;

        allCourses.forEach(c => {
            c.lessons.forEach(l => {
                if (l.completed && l.score) {
                    totalScore += l.score;
                    totalScoredLessons++;
                }
            });
        });

        stats.averageScore = totalScoredLessons > 0 ? Math.round(totalScore / totalScoredLessons) : 0;

        if (course.completed) {
            stats.coursesCompleted = (stats.coursesCompleted || 0) + 1;
        }

        await stats.save();

        // Add activity
        const activity = new Activity({
            userId: req.user.userId,
            type: 'lesson_completed',
            courseId,
            lessonId: parseInt(lessonId),
            title: `Completed lesson ${lessonId}`,
            score
        });
        await activity.save();

        res.json({ course, stats });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update lesson progress' });
    }
});

// ========== ACTIVITY ROUTES ==========

// Get recent activities
app.get('/api/activities', authenticateToken, async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user.userId })
            .sort({ date: -1 })
            .limit(20);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// ========== DASHBOARD DATA ==========

// Get complete dashboard data
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const [user, stats, enrolledCourses, activities] = await Promise.all([
            User.findById(req.user.userId).select('-password'),
            Stats.findOne({ userId: req.user.userId }),
            CourseProgress.find({ userId: req.user.userId }),
            Activity.find({ userId: req.user.userId }).sort({ date: -1 }).limit(10)
        ]);

        // Merge enrolled data with full catalog
        const courses = courseCatalog.map(course => {
            const enrolled = enrolledCourses.find(c => c.courseId === course.id);
            return {
                ...course,
                progress: enrolled ? enrolled.progress : 0,
                lessonsCompleted: enrolled ? enrolled.lessonsCompleted : 0,
                currentLesson: enrolled ? enrolled.currentLesson : 1,
                enrolledDate: enrolled ? enrolled.enrolledDate : null
            };
        });

        res.json({
            user,
            stats,
            courses,
            activities
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// ========== START SERVER ==========

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
    console.log(`🔐 Auth endpoints: /api/auth/register and /api/auth/login`);
});

module.exports = app;