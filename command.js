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
        command: '/broadcast',
        description: 'Broadcast message to Ring 1, Ring 2 and Division Groups',
        usage: '/broadcast [message]',
        example: '/broadcast Hello World!',
    },
    {
        command: '/broadcastgroup',
        description: 'Broadcast message to specific group',
        usage: '/broadcastgroup [group codes] [message]',
        example: '/broadcastgroup <TM TA TD PM> Hello World!',
    },
    {
        command: '/groupcodes',
        description: 'List of group codes',
        usage: '/groupcodes',
    }
];

const parseCommand = async (event) => {

    const source = event.source;
    const command = event.message.text;
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand === '/help') {
        return {
            api: 'reply',
            type: 'text',
            text: `${boldSerif('[ LIST OF #BERPROSESBOT COMMAND ]')}\n` + commands.map(c => `${boldSans(c.command)}: ${c.description}\nUsage: ${c.usage}${c.example ? `\nExample: ${c.example}` : ''}${c.note ? `\nNote: ${c.note}` : ''}`).join('\n\n')
        };
    }

    if (lowerCommand === '/about') {
        return {
            api: 'reply',
            type: 'text',
            text: `${boldSerif('[ ABOUT #BERPROSESBOT ]')}\n${boldSans("#BerprosesBot")} is created by the Talent Management Division of BP HMFT-ITB 2024/2025 #RuangBerproses and Pria Misterius 👅👅. Use ${boldSans("/help")} for list of commands`
        };
    }

    if (lowerCommand.startsWith('/particheck')) {
        
        if (lowerCommand.split(' ').length !== 2) {
            return {
                api: 'reply',
                type: 'text',
                text: 'Invalid command, please use /particheck [division code]'
            };
        }
        
        const code = lowerCommand.split(' ')[1];

        if (!departments.some(department => department.code.toLowerCase() === code)) {
            return {
                api: 'reply',
                type: 'text',
                text: 'Invalid division code, please use /particheck [division code]'
            };
        }

        // TODO: Implement @all broadcast for Particheck
        if (code === '@all') {
            return {
                api: 'push',
                type: 'text',
                text: `This feature is not implemented yet`
            };
        }

        // TODO: Implement R1 Particheck
        if (code === 'r1') {
            return {
                api: 'reply',
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
                api: 'reply',
                type: 'text',
                text: `${boldSerif('[ PARTICHECK RING 2 ]')}\nTop 5 Participants:\n${bestFiveStr}\n\nBottom 5 Participants:\n${worstFiveStr}`
            };
        }

        // TODO: Implement Division Particheck
        if (departments.some(department => department.code.toLowerCase() === code)) {
            return {
                api: 'reply',
                type: 'text',
                text: `This feature is not implemented yet`
            };
        }
    }

    if (lowerCommand.startsWith('/broadcast ') || lowerCommand.startsWith('/broadcast\n')) {
        
        const groupIdSource = source.groupId;
        const groupCodeSource = departments.find(department => department.groupId === groupIdSource).code;
        const allowedGroupCode = ["AA", "GS", "TM", "R1"]
        const GeneralSecretariatId = "Cbbcc1a0fb91d5f9ebe339c7f9e15242a";

        if (!allowedGroupCode.includes(groupCodeSource) && groupIdSource !== GeneralSecretariatId) {
            return {
                api: 'reply',
                type: 'text',
                text: 'Only Ring 1, General Secretariat, and Talent Management Division can use this command'
            };
        }
        
        let message = command.replace('/broadcast', '').trim();

        while (message[0] === ' ' || message[0] === '\n') {
            message = message.slice(1);
        }

        if (!message) {
            return {
                api: 'reply',
                type: 'text',
                text: 'Please provide a message to broadcast'
            };
        }
        
        return {
            api: 'pushall',
            type: 'text',
            text: message
        };
    }

    if (lowerCommand.startsWith('/broadcastgroup')) {
        const groupIdSource = source.groupId;
        const groupCodeSource = departments.find(department => department.groupId === groupIdSource).code;
        const allowedGroupCode = ["AA", "GS", "TM", "R1"];
        const GeneralSecretariatId = "Cbbcc1a0fb91d5f9ebe339c7f9e15242a";
    
        if (!allowedGroupCode.includes(groupCodeSource) && groupIdSource !== GeneralSecretariatId) {
            return {
                api: 'reply',
                type: 'text',
                text: 'Only Ring 1, General Secretariat, and Talent Management Division can use this command'
            };
        }
        
        let commandPart = command.replace('/broadcastgroup', '').trim();
    
        if (!commandPart.includes('<') || !commandPart.includes('>')) {
            return {
                api: 'reply',
                type: 'text',
                text: 'Please provide group codes in angle brackets < >, example: /broadcastgroup <TM TA TD PM> Hello World!\nFor list of group codes, use /groupcodes'
            };
        }
        
        const groupCodePart = commandPart.match(/<([^>]+)>/)[1];
        let message = commandPart.replace(/<[^>]+>/, '').trim();
    
        while (message[0] === ' ' || message[0] === '\n') {
            message = message.slice(1);
        }
    
        if (!message) {
            return {
                api: 'reply',
                type: 'text',
                text: 'Please provide a message to broadcast'
            };
        }
        
        const groupCodes = groupCodePart.split(' ').map(code => code.trim());
        
        const validGroupCodes = departments.map(department => department.code);
        const invalidGroupCodes = groupCodes.filter(code => !validGroupCodes.includes(code));
    
        if (invalidGroupCodes.length > 0) {
            return {
                api: 'reply',
                type: 'text',
                text: `Invalid group codes: ${invalidGroupCodes.join(', ')}. For list of group codes, use /groupcodes`
            };
        }
    
        return {
            api: 'pushsome',
            groupCodes: groupCodes,
            type: "text",
            text: message
        };
    }
    
    
    if (lowerCommand === '/groupcodes') {
        return {
            api: 'reply',
            type: 'text',
            text: `${boldSerif('[ LIST OF GROUP CODES ]')}\n` + departments.filter(department => !['AA', 'AB', 'AC', 'AD'].includes(department.code)).map(department => `${department.code}: ${department.name}`).join('\n')
        };
    }
    

    if (lowerCommand === '/rispek') {
        return {
            api: 'reply',
            type: 'text',
            text: `${boldSerif('ANDA SISPEK (Suka rISPEK), KAMI RISPEK 😎🫵🫵 RAWRRR 🌋🌋💥')}`
        };
    }

    
    if (lowerCommand === '/assalamualaikum') {
        return {
            api: 'reply',
            type: 'text',
            text: 'Waalaikumsalam'
        };
    }

    return {
        api: 'reply',
        type: 'text',
        text: 'Command not found, use /help for list of commands'
    };
};

module.exports = { parseCommand };
