// CORE APPLICATION LOGIC & STATE

// DEFAULT STATE DATA
let currentUser = null; // { username, email, role, level, isGhost }
let activeBadgeSymbols = {
    Owner: '💎 Owner',
    Admin: '⭐ Admin',
    Moderator: '🛡️ Mod',
    Member: '🌱 Member'
};

let usersList = [
    { username: 'Torrez', role: 'Owner', level: 120, avatar: 'https://i.pravatar.cc/100?img=11', isGhost: false },
    { username: 'Vaseegaran', role: 'Admin', level: 85, avatar: 'https://i.pravatar.cc/100?img=33', isGhost: false },
    { username: 'STR', role: 'Moderator', level: 66, avatar: 'https://i.pravatar.cc/100?img=60', isGhost: false },
    { username: 'Dhinesh', role: 'Member', level: 15, avatar: 'https://i.pravatar.cc/100?img=12', isGhost: false }
];

let messages = [
    { author: 'Torrez', role: 'Owner', text: 'Bubble Ponnu hehehehe', time: '30/10 21:39', avatar: 'https://i.pravatar.cc/100?img=11', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { author: 'Vaseegaran', role: 'Admin', text: 'enaku matum than terila pola', time: '30/10 21:39', avatar: 'https://i.pravatar.cc/100?img=33' },
    { author: 'STR', role: 'Moderator', text: '😳 🎵', time: '30/10 21:39', avatar: 'https://i.pravatar.cc/100?img=60' },
    { author: 'Dhinesh', role: 'Member', text: 'Bhuvana hi vanthuten', time: '30/10 21:39', avatar: 'https://i.pravatar.cc/100?img=12' }
];

// INITIALIZATION
window.onload = function() {
    renderMessages();
    renderOnlineUsers();
};

// AUTHENTICATION LOGIC
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tabs button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if(tab === 'login') {
        document.getElementById('tabLogin').classList.add('active');
        document.getElementById('formLogin').classList.add('active');
    } else if(tab === 'register') {
        document.getElementById('tabRegister').classList.add('active');
        document.getElementById('formRegister').classList.add('active');
    } else {
        document.getElementById('tabForgot').classList.add('active');
        document.getElementById('formForgot').classList.add('active');
    }
}

document.getElementById('formLogin').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    // Auto detect Owner account for test
    if(email.includes('owner')) {
        currentUser = { username: 'OwnerUser', role: 'Owner', level: 999, isGhost: false };
    } else {
        currentUser = { username: email.split('@')[0], role: 'Member', level: 1, isGhost: false };
    }

    document.getElementById('authModal').classList.add('hidden');
    checkPermissions();
};

document.getElementById('formRegister').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('regUser').value;
    currentUser = { username: username, role: 'Member', level: 1, isGhost: false };
    usersList.push(currentUser);
    document.getElementById('authModal').classList.add('hidden');
    checkPermissions();
    renderOnlineUsers();
};

function sendOTP() {
    alert('OTP has been sent to your email address!');
    document.getElementById('otpSection').classList.remove('hidden');
}

// PERMISSIONS & OWNER PORTAL CONTROL
function checkPermissions() {
    if(currentUser && currentUser.role === 'Owner') {
        document.querySelectorAll('.owner-only').forEach(el => el.classList.remove('hidden'));
    } else {
        document.querySelectorAll('.owner-only').forEach(el => el.classList.add('hidden'));
    }
}

function openOwnerPortal() {
    document.getElementById('ownerPortalModal').classList.remove('hidden');
    renderPortalUserTable();
}

function closeOwnerPortal() {
    document.getElementById('ownerPortalModal').classList.add('hidden');
}

function showPortalTab(tabName) {
    document.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
    if(tabName === 'users') document.getElementById('pTabUsers').classList.add('active');
    if(tabName === 'badges') document.getElementById('pTabBadges').classList.add('active');
    if(tabName === 'ghost') document.getElementById('pTabGhost').classList.add('active');
    if(tabName === 'rooms') document.getElementById('pTabRooms').classList.add('active');
}

function renderPortalUserTable() {
    const tbody = document.getElementById('portalUserTable');
    tbody.innerHTML = '';
    usersList.forEach((u, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${u.username}</td>
                <td>
                    <select onchange="changeUserRole(${index}, this.value)">
                        <option value="Member" ${u.role === 'Member' ? 'selected' : ''}>Member</option>
                        <option value="Moderator" ${u.role === 'Moderator' ? 'selected' : ''}>Moderator</option>
                        <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        <option value="Owner" ${u.role === 'Owner' ? 'selected' : ''}>Owner</option>
                    </select>
                </td>
                <td>Lv. ${u.level}</td>
                <td>
                    <button onclick="banUser(${index})" style="color:red;">Ban / Kick</button>
                </td>
            </tr>
        `;
    });
}

function changeUserRole(index, newRole) {
    usersList[index].role = newRole;
    renderOnlineUsers();
    renderMessages();
}

function banUser(index) {
    alert(`${usersList[index].username} has been banned.`);
    usersList.splice(index, 1);
    renderPortalUserTable();
    renderOnlineUsers();
}

function toggleGhostMode(enabled) {
    if(currentUser) {
        currentUser.isGhost = enabled;
        renderOnlineUsers();
    }
}

// RENDER CHAT MESSAGES
function renderMessages() {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '';

    messages.forEach(msg => {
        const badgeTag = activeBadgeSymbols[msg.role] || '';
        const roleClass = `role-${msg.role.toLowerCase()}`;

        container.innerHTML += `
            <div class="message-item">
                <img src="${msg.avatar}" class="msg-avatar">
                <div class="msg-content">
                    <div class="msg-header">
                        <span class="badge badge-${msg.role.toLowerCase()}-tag">${badgeTag}</span>
                        <span class="msg-author ${roleClass}">${msg.author}</span>
                        <span class="msg-time">${msg.time}</span>
                    </div>
                    <div class="msg-text">${msg.text}</div>
                    ${msg.image ? `<img src="${msg.image}" class="msg-image">` : ''}
                </div>
            </div>
        `;
    });
    container.scrollTop = container.scrollHeight;
}

// SEND MESSAGE LOGIC
function sendMessage() {
    const input = document.getElementById('chatMessageInput');
    const text = input.value.trim();
    if(!text) return;

    const newMsg = {
        author: currentUser ? currentUser.username : 'GuestUser',
        role: currentUser ? currentUser.role : 'Member',
        text: text,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        avatar: 'https://i.pravatar.cc/100?img=12'
    };

    messages.push(newMsg);
    input.value = '';
    renderMessages();
}

function sendImageMessage(imageUrl) {
    const newMsg = {
        author: currentUser ? currentUser.username : 'GuestUser',
        role: currentUser ? currentUser.role : 'Member',
        text: '',
        image: imageUrl,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        avatar: 'https://i.pravatar.cc/100?img=12'
    };
    messages.push(newMsg);
    renderMessages();
}

function handleKeyPress(e) {
    if(e.key === 'Enter') sendMessage();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            sendImageMessage(evt.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// RENDER ONLINE USERS LIST
function renderOnlineUsers() {
    const list = document.getElementById('onlineUserList');
    list.innerHTML = '';

    const visibleUsers = usersList.filter(u => !u.isGhost);
    document.getElementById('onlineCount').innerText = visibleUsers.length;

    visibleUsers.forEach(u => {
        list.innerHTML += `
            <div class="user-row">
                <img src="${u.avatar}" class="user-avatar">
                <div class="user-info">
                    <span class="user-name ${'role-' + u.role.toLowerCase()}">${u.username}</span>
                </div>
                <div class="user-level">
                    <span>${activeBadgeSymbols[u.role] || ''}</span>
                    <span class="lvl-num">Lv. ${u.level}</span>
                </div>
            </div>
        `;
    });
}

// FM AUDIO PLAYER LOGIC
function toggleFM() {
    const audio = document.getElementById('fmAudio');
    const icon = document.getElementById('fmPlayIcon');
    const status = document.getElementById('fmStatus');

    if(audio.paused) {
        audio.play();
        icon.className = 'fa-solid fa-pause';
        status.innerText = 'Playing Live Streaming...';
    } else {
        audio.pause();
        icon.className = 'fa-solid fa-play';
        status.innerText = 'Paused';
    }
}
