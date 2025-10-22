import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Plus, Sun, Cloud } from 'lucide-react';

const Calendar = () => {
    const [currentView, setCurrentView] = useState('Week');

    // Mock data for events
    const events = {
        '2021-02-22': [
            { time: '8:00 AM', title: 'Monday Wake-Up Hour', type: 'blue', duration: 1 },
            { time: '9:00 AM', title: 'All-Team Kickoff', type: 'blue', duration: 1 },
            { time: '10:00 AM', title: 'Financial Update', type: 'blue', duration: 1, icon: '💰' },
            { time: '11:00 AM', title: 'New Employee Welcome Lunch!', type: 'purple', duration: 1, icon: '🍕' },
            { time: '1:00 PM', title: 'Design Review', type: 'blue', duration: 1 },
            { time: '2:00 PM', title: '1:1 with Jon', type: 'orange', duration: 1 },
        ],
        '2021-02-23': [
            { time: '9:00 AM', title: 'Design Review: Acme Marketing...', type: 'blue', duration: 2 },
            { time: '12:00 PM', title: 'Design System Kickoff Lunch', type: 'teal', duration: 1, icon: '🍽️' },
            { time: '1:00 PM', title: 'MVP Prioritization Workshop', type: 'blue', duration: 1 },
            { time: '2:00 PM', title: 'Concept Design Review II', type: 'blue', duration: 1, icon: '💡' },
            { time: '4:00 PM', title: 'Design Team Happy Hour', type: 'pink', duration: 1, icon: '🍻' },
        ],
        '2021-02-24': [
            { time: '9:00 AM', title: 'Webinar: Figma ...', type: 'blue', duration: 1 },
            { time: '9:00 AM', title: 'Coffee Chat', type: 'blue', duration: 1, icon: '☕' },
            { time: '11:00 AM', title: 'Onboarding Presentation', type: 'purple', duration: 1 },
            { time: '1:00 PM', title: 'Design Review', type: 'blue', duration: 1 },
        ],
        '2021-02-25': [
            { time: '10:00 AM', title: 'Health Benefits Walkthrough', type: 'purple', duration: 1, icon: '💊' },
        ],
        '2021-02-26': [
            { time: '9:00 AM', title: 'Coffee Chat', type: 'blue', duration: 1, icon: '☕' },
            { time: '12:00 PM', title: 'Marketing Meet-and-Greet', type: 'teal', duration: 1, icon: '🤝' },
            { time: '2:00 PM', title: '1:1 with Heather', type: 'orange', duration: 1 },
            { time: '4:00 PM', title: 'Happy Hour', type: 'pink', duration: 1, icon: '♥️' },
        ]
    };

    const sidebarEvents = [
        {
            date: 'TODAY 2/27/2021',
            weather: '55°/40° ☀️',
            events: [
                { time: '8:30 - 9:00 AM', title: 'Monthly catch-up', type: 'purple' },
                { time: '8:30 - 9:00 AM', title: 'Quarterly review', type: 'blue', link: 'https://zoom.us/j/19834752B1' }
            ]
        },
        {
            date: 'TOMORROW 2/28/2021',
            weather: '55°/40° ☀️',
            events: [
                { time: '8:30 - 9:00 AM', title: 'Visit to discuss improvements', type: 'pink', link: 'https://zoom.us/j/19834752B1' },
                { time: '8:30 - 9:00 AM', title: 'Presentation of new products and cost structure', type: 'blue' }
            ]
        },
        {
            date: 'MONDAY 3/1/2021',
            weather: '55°/40° 🌧️',
            events: [
                { time: '8:30 - 9:00 AM', title: 'City Sales Pitch', type: 'pink', link: 'https://zoom.us/j/19834752B1' }
            ]
        },
        {
            date: 'TUESDAY 3/2/2021',
            weather: '55°/40° 🌧️',
            events: [
                { time: '8:30 - 9:00 AM', title: 'Visit to discuss improvements', type: 'yellow' }
            ]
        },
        {
            date: 'WEDNESDAY 3/3/2021',
            weather: '55°/40° 🌧️',
            events: [
                { time: '8:30 - 9:00 AM', title: 'Meeting to talk about Ross contract.', type: 'blue' },
                { time: '8:30 - 9:00 AM', title: 'Meeting to discuss the new proposal', type: 'blue' }
            ]
        }
    ];

    const timeSlots = [
        '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
    ];

    const weekDays = [
        { day: 'SUN', date: '21' },
        { day: 'MON', date: '22' },
        { day: 'TUE', date: '23' },
        { day: 'WED', date: '24' },
        { day: 'THU', date: '25' },
        { day: 'FRI', date: '26' },
        { day: 'SAT', date: '27' }
    ];

    const monthDays = [
        [31, 1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12, 13],
        [14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27],
        [28, 1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12, 13]
    ];

    const getEventColor = (type) => {
        const colors = {
            blue: 'bg-blue-100 border-l-4 border-blue-400 text-blue-800',
            purple: 'bg-purple-100 border-l-4 border-purple-400 text-purple-800',
            pink: 'bg-pink-100 border-l-4 border-pink-400 text-pink-800',
            orange: 'bg-orange-100 border-l-4 border-orange-400 text-orange-800',
            teal: 'bg-teal-100 border-l-4 border-teal-400 text-teal-800',
            yellow: 'bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800'
        };
        return colors[type] || colors.blue;
    };

    const getSidebarEventColor = (type) => {
        const colors = {
            blue: 'w-3 h-3 rounded-full bg-blue-400',
            purple: 'w-3 h-3 rounded-full bg-purple-400',
            pink: 'w-3 h-3 rounded-full bg-pink-400',
            yellow: 'w-3 h-3 rounded-full bg-yellow-400'
        };
        return colors[type] || colors.blue;
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-80 bg-gray-900 text-white p-4 overflow-y-auto">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <Plus className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                </div>

                {/* Month/Year Display */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-light">
                        February <span className="text-red-400">2021</span>
                    </h1>
                    <div className="flex space-x-2">
                        <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                        <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                    </div>
                </div>

                {/* Mini Calendar */}
                <div className="mb-8">
                    <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-400">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                            <div key={day} className="text-center py-1">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-sm">
                        {monthDays.map((week, weekIndex) => (
                            week.map((day, dayIndex) => (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={`text-center py-1 cursor-pointer rounded ${day === 27 ? 'bg-blue-600 text-white' :
                                        day > 27 || (weekIndex >= 4 && day < 15) ? 'text-gray-500' : 'hover:bg-gray-700'
                                        }`}
                                >
                                    {day}
                                </div>
                            ))
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="space-y-6">
                    {sidebarEvents.map((dayData, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-blue-400">{dayData.date}</span>
                                <span className="text-sm text-gray-400">{dayData.weather}</span>
                            </div>
                            <div className="space-y-3">
                                {dayData.events.map((event, eventIndex) => (
                                    <div key={eventIndex} className="flex items-start space-x-3">
                                        <div className={getSidebarEventColor(event.type)}></div>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-300">{event.time}</div>
                                            <div className="text-sm text-white mb-1">{event.title}</div>
                                            {event.link && (
                                                <div className="text-xs text-blue-400">{event.link}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                                <span className="text-lg font-medium">Today</span>
                                <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {['Day', 'Week', 'Month', 'Year'].map(view => (
                                    <button
                                        key={view}
                                        onClick={() => setCurrentView(view)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentView === view
                                            ? 'bg-red-500 text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div className="text-sm text-gray-500">EST GMT-5</div>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto">
                    {/* Week Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-0 z-10">
                        <div className="p-4"></div>
                        {weekDays.map((day, index) => (
                            <div key={index} className="p-4 text-center border-l border-gray-200">
                                <div className="text-sm text-gray-500 mb-1">{day.day}</div>
                                <div className={`text-2xl font-light ${day.date === '27' ? 'text-blue-600' : 'text-gray-900'}`}>
                                    {day.date}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-8">
                        {timeSlots.map((time, timeIndex) => (
                            <React.Fragment key={timeIndex}>
                                <div className="p-4 text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
                                    {time}
                                </div>
                                {weekDays.map((day, dayIndex) => {
                                    const dateKey = `2021-02-${day.date}`;
                                    const dayEvents = events[dateKey] || [];
                                    const timeEvents = dayEvents.filter(event => event.time.includes(time.split(' ')[0]));

                                    return (
                                        <div key={dayIndex} className="min-h-20 p-2 border-b border-l border-gray-100 relative">
                                            {timeEvents.map((event, eventIndex) => (
                                                <div
                                                    key={eventIndex}
                                                    className={`${getEventColor(event.type)} p-2 rounded mb-1 text-xs cursor-pointer hover:shadow-md transition-shadow`}
                                                    style={{ minHeight: `${event.duration * 60}px` }}
                                                >
                                                    <div className="font-medium flex items-center">
                                                        {event.icon && <span className="mr-1">{event.icon}</span>}
                                                        {event.time}
                                                    </div>
                                                    <div className="mt-1 leading-tight">{event.title}</div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;