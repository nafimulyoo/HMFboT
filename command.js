'use strict';

const fetch = require('node-fetch');
const { departments } = require('./utils/departments.js');
const { boldSans, boldSerif, boldItalicSans, boldItalicSerif } = require('./utils/font.js');

const commands = [
    {
        command: '/help',
        description: 'List of commands',
        usage: '/help',
    },
    {
        command: '/about',
        description: 'About this bot',
        usage: '/about',
    },
    {
        command: '/particheck',
        description: 'Check the attendance of participants in a division',
        usage: '/particheck [division code or @all for broadcast]',
        example: '/particheck TM for TM Division, /particheck @all for broadcast',
        note: 'not implemented yet for @all, R1, and other divisions'
    },
    {
        command: '/hmftthisweek',
        description: 'Check HMFT-ITB event this week',
        usage: '/hmftthisweek [optional: @all for broadcast]',
        note: 'not implemented yet'
    },
    {
        command: '/attendance',
        description: 'Show attendance record link',
        usage: '/attendance [optional: @all for broadcast]',
        note: 'not implemented yet'
    },
    {
        command: '/rsvp',
        description: 'Create RSVP for HMFT-ITB event, and broadcast to all group',
        usage: '/rsvp [Event Name - Event Description - Event Date]',
        example: '/rsvp Pengambilan Berkas SS - Sekre HMFT-ITB - Jumat, 14 Juni 2024 Pukul 13.00 WIB ',
    },
    {
        command: '/broadcast',
        description: 'Broadcast message to all group',
        usage: '/broadcast [message]',
        example: '/broadcast Jangan lupa untuk mengisi form presensi ya!',

    }
];

const parseCommand = async (command) => {
    // Convert the command to lowercase
    const lowerCommand = command.toLowerCase();
    
    // if started with "/"
    if (lowerCommand[0] === '/') {
        // if command not found
        if (!commands.some(c => c.command === lowerCommand.split(' ')[0])) {
            return {
                type: 'text',
                text: 'Command not found, use /help for list of commands'
            };
        }

        if (lowerCommand === '/help') {
            return {
                type: 'text',
                text: `${boldSerif('[ LIST OF HMFBOT COMMAND ]')}\n` + commands.map(c => `${boldSans(c.command)}: ${c.description}\nUsage: ${c.usage}${c.note ? `\nExample: ${c.example}` : ''}${c.example ? `\nNote: ${c.note}` : ''}`).join('\n\n')
            };
        }

        if (lowerCommand === '/about') {
            return {
                type: 'text',
                text: 'This bot is created by the Talent Management Division of BP HMFT-ITB 2024/2025 #RuangBerproses and Pria Misterius 👅👅, to help automate the process of checking participant attendance. Use /help for list of commands'
            };
        }

        if (lowerCommand.startsWith('/particheck')) {
          
            if (lowerCommand.split(' ').length !== 2) {
                return {
                    type: 'text',
                    text: 'Invalid command, please use /particheck [division code]'
                };
            }
            
            const code = lowerCommand.split(' ')[1];

            if (!departments.some(department => department.code.toLowerCase() === code)) {
                return {
                    type: 'text',
                    text: 'Invalid division code, please use /particheck [division code]'
                };
            }

            // TODO: Implement @all broadcast for Particheck
            if (code === '@all') {
                return {
                    type: 'text',
                    text: `This feature is not implemented yet`
                };
            }

            // TODO: Implement R1 Particheck
            if (code === 'r1') {
                return {
                    type: 'text',
                    text: `R1 is not implemented`
                };
            }

            else if (code === 'r2') {
                const response = await fetch('https://script.google.com/macros/s/AKfycbwv6vEsCwDh0gD1BBw0AUNCiNAe3Y_xdi-ZzTawDj4b76WsbssPBUEdDpDCf7MVIMoR/exec');
                const data = await response.json();
                const sortedData = data.total.slice(1).sort((a, b) => b[2] - a[2]);
                const bestFive = sortedData.slice(0, 5);
                const worstFive = sortedData.slice(-5);

                const formatEntry = (entry) => `${entry[0]}: ${entry[1]} attendance, ${(entry[2] * 100).toFixed(2)}%`;

                const bestFiveStr = bestFive.map(formatEntry).join('\n');
                const worstFiveStr = worstFive.map(formatEntry).join('\n');

                return {
                    type: 'text',
                    text: `${boldSerif('[ PARTICHECK RING 2 ]')}\nTop 5 Participants:\n${bestFiveStr}\n\nBottom 5 Participants:\n${worstFiveStr}`
                };
            }

            // TODO: Implement Division Particheck
            if (departments.some(department => department.code.toLowerCase() === code)) {
                return {
                    type: 'text',
                    text: `This feature is not implemented yet`
                };
            }
        }

        if (lowerCommand.startsWith('/hmftthisweek')) {
            // TODO: Implement @all broadcast for HMFTThisWeek
            if (lowerCommand.split(' ')[1] === '@all') {
                return {
                    type: 'text',
                    text: `This feature is not implemented yet`
                };
            }
            // TODO: Implement HMFTThisWeek default
            else {
                return {
                    type: 'text',
                    text: `This feature is not implemented yet`
                };
            }
        }

    
        if (lowerCommand.startsWith('/attendance')) {
            // TODO: Implement @all broadcast for Attendance
            if (lowerCommand.split(' ')[1] === '@all') {
                return {
                    type: 'text',
                    text: `This feature is not implemented yet`
                };

            }
            // TODO: Implement Attendance default
            else {
                return {
                    type: 'text',
                    text: `This feature is not implemented yet`
                };
            }
        }

        if (lowerCommand.startsWith('/rsvp')) {
            const event = command.split(' ').slice(1).join(' ');
            return {
                type: 'text',
                text: `${boldItalicSerif("[ RSVP KEHADIRAN ]")}\n${event}\nYang Dapat Hadir:\n1. \n2. \n3. \nYang Tidak Dapat Hadir + Alasan:\n1. \n2. \n3.\n @All`
            };
        }

        if (lowerCommand.startsWith('/broadcast')) {
            const message = command.split(' ').slice(1).join(' ');
            return {
                type: 'text',
                text: `${message}`
            };
        }
    }
};

module.exports = { parseCommand };
