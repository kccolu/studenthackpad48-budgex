// Dashboard Data Management
// This simulates data that would typically come from a database or Excel file

class DashboardData {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Check if data exists in localStorage, otherwise use defaults
        if (!localStorage.getItem('taxMasterData')) {
            this.setDefaultData();
        }
    }

    setDefaultData() {
        const defaultData = {
            user: {
                name: "John Doe",
                email: "john@example.com",
                avatar: "JD",
                joinDate: "2024-01-15",
                lastLogin: new Date().toISOString()
            },
            stats: {
                coursesEnrolled: 8,
                coursesCompleted: 3,
                learningTimeHours: 24,
                averageScore: 85,
                streak: 7,
                totalLessons: 156,
                completedLessons: 48
            },
            courses: [
                {
                    id: "tax-fundamentals",
                    title: "Tax Fundamentals",
                    icon: "💰",
                    level: "beginner",
                    progress: 65,
                    lessonsTotal: 12,
                    lessonsCompleted: 8,
                    currentLesson: 9,
                    timeEstimate: "8 hours",
                    enrolledDate: "2024-01-15",
                    lastAccessed: "2024-11-14",
                    completed: false,
                    lessons: [
                        { id: 1, title: "Introduction to Taxation", duration: 45, completed: true, score: 92 },
                        { id: 2, title: "Understanding Tax Brackets", duration: 50, completed: true, score: 88 },
                        { id: 3, title: "Common Tax Deductions", duration: 40, completed: true, score: 95 },
                        { id: 4, title: "Filing Status Options", duration: 35, completed: true, score: 90 },
                        { id: 5, title: "Standard vs Itemized Deductions", duration: 45, completed: true, score: 87 },
                        { id: 6, title: "Tax Credits Explained", duration: 50, completed: true, score: 91 },
                        { id: 7, title: "W-2 Forms and Income Reporting", duration: 40, completed: true, score: 89 },
                        { id: 8, title: "1099 Forms for Contractors", duration: 45, completed: true, score: 85 },
                        { id: 9, title: "Tax Planning Strategies", duration: 55, completed: false, score: null },
                        { id: 10, title: "Quarterly Estimated Taxes", duration: 40, completed: false, score: null },
                        { id: 11, title: "Tax Filing Deadlines", duration: 30, completed: false, score: null },
                        { id: 12, title: "Final Review and Practice", duration: 60, completed: false, score: null }
                    ]
                },
                {
                    id: "investment-strategies",
                    title: "Investment Strategies",
                    icon: "📈",
                    level: "intermediate",
                    progress: 30,
                    lessonsTotal: 15,
                    lessonsCompleted: 4,
                    currentLesson: 5,
                    timeEstimate: "10 hours",
                    enrolledDate: "2024-02-01",
                    lastAccessed: "2024-11-13",
                    completed: false,
                    lessons: [
                        { id: 1, title: "Investment Fundamentals", duration: 55, completed: true, score: 90 },
                        { id: 2, title: "Risk vs. Reward", duration: 60, completed: true, score: 88 },
                        { id: 3, title: "Diversification Strategies", duration: 50, completed: true, score: 92 },
                        { id: 4, title: "Stock Market Basics", duration: 45, completed: true, score: 86 },
                        { id: 5, title: "Bond Investing", duration: 50, completed: false, score: null },
                        { id: 6, title: "Mutual Funds & ETFs", duration: 55, completed: false, score: null },
                        { id: 7, title: "Index Fund Investing", duration: 45, completed: false, score: null },
                        { id: 8, title: "Dollar-Cost Averaging", duration: 40, completed: false, score: null },
                        { id: 9, title: "Rebalancing Your Portfolio", duration: 50, completed: false, score: null },
                        { id: 10, title: "Tax-Efficient Investing", duration: 55, completed: false, score: null },
                        { id: 11, title: "Retirement Account Types", duration: 60, completed: false, score: null },
                        { id: 12, title: "Asset Allocation", duration: 50, completed: false, score: null },
                        { id: 13, title: "Market Analysis", duration: 55, completed: false, score: null },
                        { id: 14, title: "Investment Psychology", duration: 45, completed: false, score: null },
                        { id: 15, title: "Building a Long-term Strategy", duration: 60, completed: false, score: null }
                    ]
                },
                {
                    id: "business-finance",
                    title: "Business Finance",
                    icon: "💼",
                    level: "advanced",
                    progress: 0,
                    lessonsTotal: 18,
                    lessonsCompleted: 0,
                    currentLesson: 1,
                    timeEstimate: "12 hours",
                    enrolledDate: "2024-11-01",
                    lastAccessed: null,
                    completed: false,
                    lessons: []
                },
                {
                    id: "retirement-planning",
                    title: "Retirement Planning",
                    icon: "🏖️",
                    level: "intermediate",
                    progress: 0,
                    lessonsTotal: 10,
                    lessonsCompleted: 0,
                    currentLesson: 1,
                    timeEstimate: "6 hours",
                    enrolledDate: "2024-10-15",
                    lastAccessed: null,
                    completed: false,
                    lessons: []
                },
                {
                    id: "real-estate",
                    title: "Real Estate Investing",
                    icon: "🏠",
                    level: "advanced",
                    progress: 0,
                    lessonsTotal: 14,
                    lessonsCompleted: 0,
                    currentLesson: 1,
                    timeEstimate: "9 hours",
                    enrolledDate: "2024-11-05",
                    lastAccessed: null,
                    completed: false,
                    lessons: []
                },
                {
                    id: "crypto-taxes",
                    title: "Cryptocurrency & Taxes",
                    icon: "₿",
                    level: "intermediate",
                    progress: 0,
                    lessonsTotal: 11,
                    lessonsCompleted: 0,
                    currentLesson: 1,
                    timeEstimate: "7 hours",
                    enrolledDate: "2024-10-20",
                    lastAccessed: null,
                    completed: false,
                    lessons: []
                }
            ],
            recentActivity: [
                {
                    type: "lesson_completed",
                    courseId: "tax-fundamentals",
                    lessonId: 8,
                    title: "Completed: 1099 Forms for Contractors",
                    date: "2024-11-14T10:30:00",
                    score: 85
                },
                {
                    type: "lesson_completed",
                    courseId: "tax-fundamentals",
                    lessonId: 7,
                    title: "Completed: W-2 Forms and Income Reporting",
                    date: "2024-11-14T09:15:00",
                    score: 89
                },
                {
                    type: "lesson_completed",
                    courseId: "investment-strategies",
                    lessonId: 4,
                    title: "Completed: Stock Market Basics",
                    date: "2024-11-13T14:20:00",
                    score: 86
                },
                {
                    type: "course_enrolled",
                    courseId: "real-estate",
                    title: "Enrolled in Real Estate Investing",
                    date: "2024-11-05T16:45:00"
                },
                {
                    type: "course_enrolled",
                    courseId: "business-finance",
                    title: "Enrolled in Business Finance",
                    date: "2024-11-01T11:00:00"
                }
            ],
            achievements: [
                {
                    id: "first_course",
                    title: "First Steps",
                    description: "Enrolled in your first course",
                    icon: "🎯",
                    earned: true,
                    earnedDate: "2024-01-15"
                },
                {
                    id: "week_streak",
                    title: "Week Warrior",
                    description: "7-day learning streak",
                    icon: "🔥",
                    earned: true,
                    earnedDate: "2024-11-14"
                },
                {
                    id: "first_completion",
                    title: "Course Crusher",
                    description: "Completed your first course",
                    icon: "🏆",
                    earned: false,
                    earnedDate: null
                },
                {
                    id: "perfect_score",
                    title: "Perfectionist",
                    description: "Got 100% on a quiz",
                    icon: "⭐",
                    earned: false,
                    earnedDate: null
                }
            ],
            goals: [
                {
                    id: 1,
                    title: "Complete Tax Fundamentals",
                    targetDate: "2024-12-15",
                    progress: 65,
                    completed: false
                },
                {
                    id: 2,
                    title: "Finish 5 courses this quarter",
                    targetDate: "2024-12-31",
                    progress: 60,
                    completed: false
                },
                {
                    id: 3,
                    title: "Study 30 hours this month",
                    targetDate: "2024-11-30",
                    progress: 80,
                    completed: false
                }
            ]
        };

        localStorage.setItem('taxMasterData', JSON.stringify(defaultData));
    }

    getData() {
        return JSON.parse(localStorage.getItem('taxMasterData'));
    }

    saveData(data) {
        localStorage.setItem('taxMasterData', JSON.stringify(data));
    }

    // Update user info
    updateUser(updates) {
        const data = this.getData();
        data.user = { ...data.user, ...updates };
        this.saveData(data);
        return data.user;
    }

    // Update course progress
    updateCourseProgress(courseId, lessonId, completed, score) {
        const data = this.getData();
        const course = data.courses.find(c => c.id === courseId);

        if (course) {
            const lesson = course.lessons.find(l => l.id === lessonId);
            if (lesson) {
                lesson.completed = completed;
                if (score !== null) lesson.score = score;
            }

            // Recalculate course progress
            course.lessonsCompleted = course.lessons.filter(l => l.completed).length;
            course.progress = Math.round((course.lessonsCompleted / course.lessonsTotal) * 100);
            course.lastAccessed = new Date().toISOString();

            // Update current lesson
            const nextIncompleteLesson = course.lessons.find(l => !l.completed);
            if (nextIncompleteLesson) {
                course.currentLesson = Number(nextIncompleteLesson.id); // ensure number type
            }

            // Update stats
            const totalCompleted = data.courses.reduce((sum, c) => sum + c.lessonsCompleted, 0);
            data.stats.completedLessons = totalCompleted;

            const completedCourses = data.courses.filter(c => c.progress === 100).length;
            data.stats.coursesCompleted = completedCourses;

            // Add to recent activity
            if (completed) {
                data.recentActivity.unshift({
                    type: "lesson_completed",
                    courseId: courseId,
                    lessonId: lessonId,
                    title: `Completed: ${lesson.title}`,
                    date: new Date().toISOString(),
                    score: score
                });

                // Keep only last 10 activities
                data.recentActivity = data.recentActivity.slice(0, 10);
            }

            this.saveData(data);
        }

        return data;
    }

    // Enroll in a course
    enrollCourse(courseId) {
        const data = this.getData();
        const course = data.courses.find(c => c.id === courseId);

        if (course && !course.enrolledDate) {
            course.enrolledDate = new Date().toISOString();
            data.stats.coursesEnrolled++;

            data.recentActivity.unshift({
                type: "course_enrolled",
                courseId: courseId,
                title: `Enrolled in ${course.title}`,
                date: new Date().toISOString()
            });

            this.saveData(data);
        }

        return data;
    }

    // Get course by ID
    getCourse(courseId) {
        const data = this.getData();
        return data.courses.find(c => c.id === courseId);
    }

    // Update learning time
    addLearningTime(minutes) {
        const data = this.getData();
        const hours = minutes / 60;
        data.stats.learningTimeHours = Math.round((data.stats.learningTimeHours + hours) * 10) / 10;
        this.saveData(data);
        return data.stats;
    }

    // Calculate average score
    recalculateAverageScore() {
        const data = this.getData();
        let totalScore = 0;
        let totalLessons = 0;

        data.courses.forEach(course => {
            course.lessons.forEach(lesson => {
                if (lesson.completed && lesson.score !== null) {
                    totalScore += lesson.score;
                    totalLessons++;
                }
            });
        });

        data.stats.averageScore = totalLessons > 0 ? Math.round(totalScore / totalLessons) : 0;
        this.saveData(data);
        return data.stats;
    }

    // Export data to CSV (simulating Excel export)
    exportToCSV() {
        const data = this.getData();

        // Create CSV for courses
        let csv = "Course Progress Report\n\n";
        csv += "Course Name,Level,Progress,Lessons Completed,Total Lessons,Last Accessed\n";

        data.courses.forEach(course => {
            csv += `"${course.title}","${course.level}","${course.progress}%","${course.lessonsCompleted}","${course.lessonsTotal}","${course.lastAccessed || 'Never'}"\n`;
        });

        csv += "\n\nDetailed Lesson Progress\n\n";
        csv += "Course,Lesson,Duration (min),Completed,Score\n";

        data.courses.forEach(course => {
            course.lessons.forEach(lesson => {
                csv += `"${course.title}","${lesson.title}","${lesson.duration}","${lesson.completed ? 'Yes' : 'No'}","${lesson.score || 'N/A'}"\n`;
            });
        });

        return csv;
    }

    // Reset all data
    resetData() {
        localStorage.removeItem('taxMasterData');
        this.setDefaultData();
    }
}

// Create global instance
const dashboardData = new DashboardData();
