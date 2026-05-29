/* WC 2026 ULTIMATE ENGINE - FINAL POLISHED
    Author: Gemini AI
*/

const app = (() => {
    // --- Data Definitions ---
    const TEAMS_DB = {
        // CONMEBOL
        "AR": {name: "Argentina", flag: "ar"}, "BO": {name: "Bolivia", flag: "bo"}, "BR": {name: "Brazil", flag: "br"},
        "CL": {name: "Chile", flag: "cl"}, "CO": {name: "Colombia", flag: "co"}, "EC": {name: "Ecuador", flag: "ec"},
        "PY": {name: "Paraguay", flag: "py"}, "PE": {name: "Peru", flag: "pe"}, "UY": {name: "Uruguay", flag: "uy"},
        "VE": {name: "Venezuela", flag: "ve"},
        
        // UEFA
        "FR": {name: "France", flag: "fr"}, "ES": {name: "Spain", flag: "es"}, "GB-ENG": {name: "England", flag: "gb-eng"},
        "PT": {name: "Portugal", flag: "pt"}, "DE": {name: "Germany", flag: "de"}, "NL": {name: "Netherlands", flag: "nl"},
        "IT": {name: "Italy", flag: "it"}, "HR": {name: "Croatia", flag: "hr"}, "BE": {name: "Belgium", flag: "be"},
        "DK": {name: "Denmark", flag: "dk"}, "RS": {name: "Serbia", flag: "rs"}, "CH": {name: "Switzerland", flag: "ch"},
        "PL": {name: "Poland", flag: "pl"}, "UA": {name: "Ukraine", flag: "ua"}, "SE": {name: "Sweden", flag: "se"},
        "NO": {name: "Norway", flag: "no"}, "AT": {name: "Austria", flag: "at"}, "RO": {name: "Romania", flag: "ro"},
        "TR": {name: "Türkiye", flag: "tr"}, "GB-SCT": {name: "Scotland", flag: "gb-sct"}, "GB-WLS": {name: "Wales", flag: "gb-wls"},
        "GB-NIR": {name: "N. Ireland", flag: "gb-nir"}, "IE": {name: "Ireland", flag: "ie"}, "CZ": {name: "Czechia", flag: "cz"},
        "SK": {name: "Slovakia", flag: "sk"}, "AL": {name: "Albania", flag: "al"}, "MK": {name: "N. Macedonia", flag: "mk"},
        "BA": {name: "Bosnia", flag: "ba"}, "XK": {name: "Kosovo", flag: "xk"},

        // CONCACAF
        "US": {name: "USA", flag: "us"}, "MX": {name: "Mexico", flag: "mx"}, "CA": {name: "Canada", flag: "ca"},
        "CR": {name: "Costa Rica", flag: "cr"}, "PA": {name: "Panama", flag: "pa"}, "JM": {name: "Jamaica", flag: "jm"},
        "HT": {name: "Haiti", flag: "ht"}, "CW": {name: "Curaçao", flag: "cw"}, "SR": {name: "Suriname", flag: "sr"},

        // CAF
        "SN": {name: "Senegal", flag: "sn"}, "MA": {name: "Morocco", flag: "ma"}, "TN": {name: "Tunisia", flag: "tn"},
        "EG": {name: "Egypt", flag: "eg"}, "NG": {name: "Nigeria", flag: "ng"}, "DZ": {name: "Algeria", flag: "dz"},
        "CM": {name: "Cameroon", flag: "cm"}, "GH": {name: "Ghana", flag: "gh"}, "CI": {name: "Côte d'Ivoire", flag: "ci"},
        "ZA": {name: "South Africa", flag: "za"}, "CD": {name: "DR Congo", flag: "cd"}, "CV": {name: "Cape Verde", flag: "cv"},

        // AFC
        "JP": {name: "Japan", flag: "jp"}, "IR": {name: "Iran", flag: "ir"}, "KR": {name: "South Korea", flag: "kr"},
        "AU": {name: "Australia", flag: "au"}, "QA": {name: "Qatar", flag: "qa"}, "SA": {name: "Saudi Arabia", flag: "sa"},
        "UZ": {name: "Uzbekistan", flag: "uz"}, "JO": {name: "Jordan", flag: "jo"}, "IQ": {name: "Iraq", flag: "iq"},


        // OFC
        "NZ": {name: "New Zealand", flag: "nz"}, "NC": {name: "New Caledonia", flag: "nc"}
    };

    const INITIAL_GROUPS = {
        "A": ["MX", "ZA", "KR", "CZ"],
        "B": ["CA", "BA", "QA", "CH"],
        "C": ["BR", "MA", "HT", "GB-SCT"],
        "D": ["US", "PY", "AU", "TR"],
        "E": ["DE", "CW", "CI", "EC"],
        "F": ["NL", "JP", "SE", "TN"],
        "G": ["BE", "EG", "IR", "NZ"],
        "H": ["ES", "CV", "SA", "UY"],
        "I": ["FR", "SN", "IQ", "NO"],
        "J": ["AR", "DZ", "AT", "JO"],
        "K": ["PT", "CD", "UZ", "CO"],
        "L": ["GB-ENG", "HR", "GH", "PA"]
    };


    const KEY_SCORES = "wc26_group_scores";
    const KEY_KNOCKOUT = "wc26_knockout";

    // Corrected Round-of-32 matchups using your provided R32_SLOTS mapping (73–88)
    const R32_STRUCTURE = [
        // 73–88 mapping converted to our 16 match indexes (1..16)
        {id: 1,  h: "2A", a: "2B"},
        {id: 2,  h: "1E", a: "3ABCDF"},   // 3rd best from A/B/C/D/F
        {id: 3,  h: "1F", a: "2C"},
        {id: 4,  h: "1C", a: "2F"},
        {id: 5,  h: "1I", a: "3CDFGH"},   // 3rd best from C/D/F/G/H
        {id: 6,  h: "2E", a: "2I"},
        {id: 7,  h: "1A", a: "3CEFHI"},   // 3rd best from C/E/F/H/I
        {id: 8,  h: "1L", a: "3EHIJK"},   // 3rd best from E/H/I/J/K
        {id: 9,  h: "1D", a: "3BEFIJ"},   // 3rd best from B/E/F/I/J
        {id: 10, h: "1G", a: "3AEHIJ"},   // 3rd best from A/E/H/I/J
        {id: 11, h: "2K", a: "2L"},
        {id: 12, h: "1H", a: "2J"},       // FIXED: 1H vs 2J
        {id: 13, h: "1B", a: "3EFGIJ"},   // FIXED: 1B vs 3EFGIJ
        {id: 14, h: "1J", a: "2H"},
        {id: 15, h: "1K", a: "3DEIJL"},   // 3rd best from D/E/I/J/L
        {id: 16, h: "2D", a: "2G"}
    ];



    // --- UTILS ---
    const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const load = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } };
    const getFlag = (code) => {
        if(!code || code === "TBD" || code.startsWith("Q_")) return "https://via.placeholder.com/40x30?text=?";
        return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    };

    // --- SHARED CALCULATION LOGIC ---
    const calculateAllStandings = () => {
        const scores = load(KEY_SCORES) || {};
        const groupData = JSON.parse(JSON.stringify(INITIAL_GROUPS));

        const standings = {};
        const thirds = [];
        const allGroups = {};

        Object.keys(groupData).forEach(gName => {
            const teams = groupData[gName].map(t => ({ 
                code: t, 
                name: TEAMS_DB[t]?.name || t, 
                flag: TEAMS_DB[t]?.flag || t,
                pts:0, gd:0, gf:0, w:0, d:0, l:0, p:0
            }));

            const pairs = [[0,1], [2,3], [0,2], [1,3], [0,3], [1,2]];
            
            for(let i=0; i<6; i++) {
                const mid = `${gName}-${i}`;
                if(scores[mid]) {
                    const s1 = parseInt(scores[mid].s1);
                    const s2 = parseInt(scores[mid].s2);
                    if(!isNaN(s1) && !isNaN(s2)) {
                        const t1 = teams[pairs[i][0]];
                        const t2 = teams[pairs[i][1]];
                        t1.p++; t2.p++;
                        t1.gf += s1; t1.gd += (s1-s2);
                        t2.gf += s2; t2.gd += (s2-s1);
                        if(s1 > s2) { t1.w++; t1.pts+=3; t2.l++; }
                        else if(s2 > s1) { t2.w++; t2.pts+=3; t1.l++; }
                        else { t1.d++; t1.pts++; t2.d++; t2.pts++; }
                    }
                }
            }
            teams.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
            allGroups[gName] = teams;
            standings[`1${gName}`] = teams[0];
            standings[`2${gName}`] = teams[1];
            if(teams[2]) thirds.push({ ...teams[2], group: gName });
        });

        thirds.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        return { standings, thirds, allGroups };
    };

    // --- GROUPS ---
    const initGroups = () => {
        const grid = document.getElementById('groups-grid');
        if(!grid) return;
        
        const scores = load(KEY_SCORES) || {};
        const groupData = JSON.parse(JSON.stringify(INITIAL_GROUPS));

        let html = '';
        Object.keys(groupData).forEach(gName => {
            const teams = groupData[gName];
            const pairs = [[0,1], [2,3], [0,2], [1,3], [0,3], [1,2]];
            let fixtureHtml = pairs.map((pair, idx) => {
                const t1 = TEAMS_DB[teams[pair[0]]] || {name: teams[pair[0]], flag: "TBD"};
                const t2 = TEAMS_DB[teams[pair[1]]] || {name: teams[pair[1]], flag: "TBD"};
                const id = `${gName}-${idx}`;
                const s1 = scores[id]?.s1 !== undefined ? scores[id].s1 : '';
                const s2 = scores[id]?.s2 !== undefined ? scores[id].s2 : '';

                return `<div class="match-row">
                    <div class="team-name"><img src="${getFlag(t1.flag)}" class="flag"> ${t1.name}</div>
                    <div class="inputs">
                        <input type="number" class="score-input" data-id="${id}" data-type="1" value="${s1}" oninput="app.updateGroups()">
                        -
                        <input type="number" class="score-input" data-id="${id}" data-type="2" value="${s2}" oninput="app.updateGroups()">
                    </div>
                    <div class="team-name" style="justify-content: flex-end;">${t2.name} <img src="${getFlag(t2.flag)}" class="flag"></div>
                </div>`;
            }).join('');

            html += `<div class="group-card"><div class="group-header">Group ${gName}</div><div class="fixtures">${fixtureHtml}</div>
                <table class="table"><thead><tr><th style="text-align:left; padding-left:5px;">Team</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr></thead><tbody id="tbody-${gName}"></tbody></table></div>`;
        });
        grid.innerHTML = html;
        updateGroups();
    };

    const updateGroups = () => {
        const scores = {};
        document.querySelectorAll('.score-input').forEach(i => {
            const id = i.dataset.id;
            if(!scores[id]) scores[id] = {};
            if(i.dataset.type === "1") scores[id].s1 = i.value;
            else scores[id].s2 = i.value;
        });
        save(KEY_SCORES, scores);

        const { standings, thirds, allGroups } = calculateAllStandings();
        
        // Update Group Tables
        Object.keys(allGroups).forEach(gName => {
            const tbody = document.getElementById(`tbody-${gName}`);
            if(tbody) {
                tbody.innerHTML = allGroups[gName].map((t, i) => `
                    <tr style="${i < 2 ? 'background:rgba(0, 210, 106, 0.1)' : ''}">
                        <td style="text-align:left; padding-left:5px;">
                            <img src="${getFlag(t.flag)}" class="flag"> ${t.code}
                        </td>
                        <td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td><strong>${t.pts}</strong></td>
                    </tr>
                `).join('');
            }
        });

        // Update Best 3rds Table (Removed Status Column)
        const tBody3 = document.getElementById('third-place-body');
        if(tBody3) {
            tBody3.innerHTML = thirds.map((t, i) => `
                <tr style="${i < 8 ? 'background:rgba(0, 181, 226, 0.1); font-weight:bold' : 'opacity:0.6'}">
                    <td>${i+1}</td>
                    <td><img src="${getFlag(t.flag)}" class="flag"> ${t.name}</td>
                    <td>${t.group}</td><td>${t.pts}</td><td>${t.gd}</td><td>${t.gf}</td>
                </tr>`).join('');
            
            // Fix header if status was removed but HTML header remains
            const thirdTableHead = document.querySelector('.third-table thead tr');
            if(thirdTableHead && thirdTableHead.children.length > 6) {
                thirdTableHead.lastElementChild.remove(); // Remove "Status" header cell
            }
        }
    };

    const randomizeGroups = () => {
        document.querySelectorAll('.score-input').forEach(i => i.value = Math.floor(Math.random() * 4));
        updateGroups();
    };

    // --- KNOCKOUT STAGES ---
    const initKnockoutR32 = () => {
    const root = document.getElementById('bracket-root');
    if(!root) return;

    const { standings, thirds } = calculateAllStandings();

    // --- Subset-based “best 3rd place from specific groups” support ---
    // Input format example: 3ABCDF => 3rd best among the third-place teams from groups A,B,C,D,F
    const groupThirdByCode = (groupCode) => thirds.find(t => t.group === groupCode);

    const bestThirdFromGroups = (groupCodes) => {
        const candidates = groupCodes
            .map(g => groupThirdByCode(g))
            .filter(Boolean);
        candidates.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        return candidates.length ? candidates[0] : null; // not used currently
    };

    const thirdBestFromGroups = (groupCodes) => {
        const candidates = groupCodes
            .map(g => groupThirdByCode(g))
            .filter(Boolean);
        candidates.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        return candidates.length >= 3 ? candidates[2] : (candidates.length ? candidates[candidates.length-1] : null);
    };

    // For compatibility with existing rendering, we still prepare a lookup map for slot codes.
    const thirdMap = {};

    // Fill subset third-place identifiers used by your corrected R32_STRUCTURE.
    const subsetKeys = [
        "3ABCDF","3CDFGH","3CEFHI","3EHIJK","3BEFIJ","3AEHIJ","3DEIJL"
    ];

    const subsetDef = {
        "3ABCDF": ["A","B","C","D","F"],
        "3CDFGH": ["C","D","F","G","H"],
        "3CEFHI": ["C","E","F","H","I"],
        "3EHIJK": ["E","H","I","J","K"],
        "3BEFIJ": ["B","E","F","I","J"],
        "3AEHIJ": ["A","E","H","I","J"],
        "3DEIJL": ["D","E","I","J","L"]
    };

    subsetKeys.forEach(key => {
        const groups = subsetDef[key] || [];
        const team = thirdBestFromGroups(groups);
        if(team) thirdMap[key] = team;
    });

    // Also keep old single-group third keys (3F,3G,3A,...) working for any remaining slots.
    const legacyThirdSlots = ["3F", "3G", "3A", "3C", "3H", "3B", "3E", "3I"];
    legacyThirdSlots.forEach(k => {
        const g = k.slice(1);
        const t = groupThirdByCode(g);
        if(t) thirdMap[k] = t;
    });

    const getT = (key) => {
        if(!key) return {code: "TBD", name:"TBD", flag: "TBD"};
        if(key.startsWith('3')) return thirdMap[key] || {code: "TBD", name:"TBD", flag: "TBD"};
        return standings[key] || {code: "TBD", name:"TBD", flag: "TBD"};
    };

    const bracketData = load(KEY_KNOCKOUT) || {};
    let html = `<div class="r32-columns">`;

    for(let col = 0; col < 2; col++) {
        html += `<div class="r32-column">`;

        for(let i = col * 8; i < (col + 1) * 8; i++) {
            let mId = `R32-${i}`;
            let match = bracketData[mId] || {};

            const setup = R32_STRUCTURE[i];
            const t1 = getT(setup.h);
            const t2 = getT(setup.a);

            const s1 = match.s1 || '';
            const s2 = match.s2 || '';
            const p1 = match.p1 || '';
            const p2 = match.p2 || '';
            const isDraw = (s1 !== '' && s2 !== '' && s1 == s2);

            html += `
            <div class="matchup" data-mid="${mId}" style="margin-bottom:10px;">
                <div style="font-size:0.7em; opacity:0.5; padding: 2px 4px;">M${i+1}</div>
                ${generateMatchHTML(mId,
                    {code: t1.name || t1.code, flag: t1.flag},
                    {code: t2.name || t2.code, flag: t2.flag},
                    s1, s2, p1, p2, isDraw)}
            </div>`;
        }

        html += `</div>`;
    }

    html += `</div>`;
    root.innerHTML = html;
    refreshVisuals();
};

    const initKnockoutFinals = () => {
        const root = document.getElementById('bracket-root');
        if(!root) return;

        const bracketData = load(KEY_KNOCKOUT) || {};
        const { standings, thirds } = calculateAllStandings();

        const getThirdPlace = (groupCode) => thirds.find(t => t.group === groupCode);
        const getTeamBySlot = (slot) => {
            if(!slot) return { code: "TBD", flag: "TBD" };
            if(slot.startsWith('3')) {
                const team = getThirdPlace(slot.slice(1));
                return team ? { code: team.name, flag: team.flag } : { code: "TBD", flag: "TBD" };
            }
            const team = standings[slot];
            return team ? { code: team.name, flag: team.flag } : { code: "TBD", flag: "TBD" };
        };

        const resolveWinner = (match) => {
            if(!match || match.s1 === undefined || match.s2 === undefined) return null;
            const s1 = parseInt(match.s1);
            const s2 = parseInt(match.s2);
            if(isNaN(s1) || isNaN(s2)) return null;
            if(s1 > s2) return 0;
            if(s2 > s1) return 1;
            const p1 = parseInt(match.p1);
            const p2 = parseInt(match.p2);
            if(!isNaN(p1) && !isNaN(p2)) return p1 > p2 ? 0 : p2 > p1 ? 1 : null;
            return null;
        };

        const getR32Winner = (index) => {
            const match = bracketData[`R32-${index}`] || {};
            const winner = resolveWinner(match);
            if(winner === null) return null;
            const setup = R32_STRUCTURE[index];
            const teamH = getTeamBySlot(setup.h);
            const teamA = getTeamBySlot(setup.a);
            return winner === 0 ? teamH : teamA;
        };

        const r32Winners = Array.from({ length: 16 }, (_, i) => getR32Winner(i));
        const rounds = [16, 8, 4, 2];
        let html = '';

        rounds.forEach((cnt) => {

            html += `<div class="round" id="round-${cnt}">`;
            const matchCount = cnt / 2;
            for(let i=0; i<matchCount; i++) {
                let mId = `R${cnt}-${i}`;
                let match = bracketData[mId] || {};

                let t1 = {code: "Match "+(i*2+1), flag: "TBD"};
                let t2 = {code: "Match "+(i*2+2), flag: "TBD"};

                if(cnt === 16) {
                    const winnerA = r32Winners[i*2];
                    const winnerB = r32Winners[i*2 + 1];
                    if(winnerA) t1 = winnerA;
                    if(winnerB) t2 = winnerB;
                }

                const s1 = match.s1||'', s2 = match.s2||'', p1 = match.p1||'', p2 = match.p2||'';
                const isDraw = (s1 !== '' && s2 !== '' && s1 == s2);
                
                if(cnt === 2) {
                    html += `
                    <div class="final-match-wrapper">
                        <h3>🏆 WORLD CUP FINAL 🏆</h3>
                        <div class="matchup" data-mid="${mId}">
                            ${generateMatchHTML(mId, t1, t2, s1, s2, p1, p2, isDraw)}
                        </div>
                    </div>`;
                } else {
                    html += `
                    <div class="matchup" data-mid="${mId}">
                        ${generateMatchHTML(mId, t1, t2, s1, s2, p1, p2, isDraw)}
                    </div>`;
                }
            }

            if(cnt === 2) {
                const m3 = bracketData["Match3rd"] || {};
                const s3_1=m3.s1||'', s3_2=m3.s2||'', p3_1=m3.p1||'', p3_2=m3.p2||'';
                const d3 = (s3_1!=='' && s3_2!=='' && s3_1==s3_2);
                
                html += `
                <div class="third-place-wrapper">
                    <h3>🥉 3rd Place Play-off</h3>
                    <div class="matchup" data-mid="Match3rd">
                        ${generateMatchHTML("Match3rd", {code:"TBD", flag:"TBD"}, {code:"TBD", flag:"TBD"}, s3_1, s3_2, p3_1, p3_2, d3)}
                    </div>
                </div>`;
            }
            html += `</div>`;
        });
        root.innerHTML = html;
        refreshVisuals();
    };


    // Helper for initKnockout to keep code clean
    const generateMatchHTML = (mid, t1, t2, s1, s2, p1, p2, isDraw) => {
        return `
        <div class="team-slot">
            <span><img src="${getFlag(t1.flag)}" class="flag"> ${t1.code}</span>
            <div style="display:flex; flex-direction:column; align-items:flex-end">
                <input type="number" class="score-input k-input" value="${s1}" data-mid="${mid}" data-idx="1" oninput="app.updateKnockout(this)">
                <input type="number" class="score-input k-input pen-input ${isDraw?'':'hidden'}" placeholder="P" value="${p1}" data-mid="${mid}" data-pidx="1" oninput="app.updateKnockout(this)" style="margin-top:2px;">
            </div>
        </div>
        <div class="team-slot">
            <span><img src="${getFlag(t2.flag)}" class="flag"> ${t2.code}</span>
            <div style="display:flex; flex-direction:column; align-items:flex-end">
                <input type="number" class="score-input k-input" value="${s2}" data-mid="${mid}" data-idx="2" oninput="app.updateKnockout(this)">
                <input type="number" class="score-input k-input pen-input ${isDraw?'':'hidden'}" placeholder="P" value="${p2}" data-mid="${mid}" data-pidx="2" oninput="app.updateKnockout(this)" style="margin-top:2px;">
            </div>
        </div>`;
    };

    // 2. LIVE UPDATER (Does not rebuild HTML, keeps keyboard open)
    const updateKnockout = (el) => {
    const mid = el.dataset.mid;
    const bracket = load(KEY_KNOCKOUT) || {};
    if(!bracket[mid]) bracket[mid] = {};
    
    if(el.dataset.idx === "1") bracket[mid].s1 = el.value;
    if(el.dataset.idx === "2") bracket[mid].s2 = el.value;
    if(el.dataset.pidx === "1") bracket[mid].p1 = el.value;
    if(el.dataset.pidx === "2") bracket[mid].p2 = el.value;

    save(KEY_KNOCKOUT, bracket);
    refreshVisuals();

    // Celebration — runs AFTER refreshVisuals so winner span is up to date
    if(mid === "R2-0") {
        const s1 = parseInt(bracket[mid].s1);
        const s2 = parseInt(bracket[mid].s2);
        const p1 = parseInt(bracket[mid].p1);
        const p2 = parseInt(bracket[mid].p2);

        let winnerSlot = -1;
        if(!isNaN(s1) && !isNaN(s2)) {
            if(s1 > s2) winnerSlot = 0;
            else if(s2 > s1) winnerSlot = 1;
            else if(!isNaN(p1) && !isNaN(p2) && p1 !== p2) winnerSlot = p1 > p2 ? 0 : 1;
        }

        if(winnerSlot !== -1) {
            const finalDiv = document.querySelector('div[data-mid="R2-0"]');
            if(finalDiv) {
                const winnerSpan = finalDiv.querySelectorAll('.team-slot')[winnerSlot].querySelector('span');
                celebrate({ html: winnerSpan.innerHTML });
                }
            }
        }
    };

    // 3. VISUAL REFRESHER (Updates DOM attributes only)
    const refreshVisuals = () => {
        const bracket = load(KEY_KNOCKOUT) || {};
        const rounds = [32, 16, 8, 4, 2];
        
        rounds.forEach(cnt => {
            const matchCount = cnt / 2;
            for(let i=0; i<matchCount; i++) {
                let mId = `R${cnt}-${i}`;
                let match = bracket[mId] || {};
                let div = document.querySelector(`div[data-mid="${mId}"]`);
                if(!div) continue;

                const s1 = parseInt(match.s1), s2 = parseInt(match.s2);
                const isDraw = (!isNaN(s1) && !isNaN(s2) && s1 === s2);
                
                // Show/Hide Penalty Inputs
                div.querySelectorAll('.pen-input').forEach(p => p.classList.toggle('hidden', !isDraw));

                // Determine Winner Visuals
                let wIdx = -1;
                if(!isNaN(s1) && !isNaN(s2)) {
                    if(s1 > s2) wIdx = 0; else if(s2 > s1) wIdx = 1;
                    else {
                        const p1 = parseInt(match.p1), p2 = parseInt(match.p2);
                        if(!isNaN(p1) && !isNaN(p2)) wIdx = p1 > p2 ? 0 : 1;
                    }
                }

                // Highlight Slots
                const slots = div.querySelectorAll('.team-slot');
                if(slots.length >= 2) {
                    slots[0].classList.toggle('winner', wIdx === 0);
                    slots[1].classList.toggle('winner', wIdx === 1);

                    // Push Winner Name to Next Round
                    if(wIdx !== -1 && cnt > 2) {
                        const wName = slots[wIdx].querySelector('span').innerHTML;
                        const nextDiv = document.querySelector(`div[data-mid="R${cnt/2}-${Math.floor(i/2)}"]`);
                        if(nextDiv) {
                            const nextSlot = nextDiv.querySelectorAll('.team-slot')[i%2];
                            if(nextSlot) nextSlot.querySelector('span').innerHTML = wName;
                        }
                    }
                }
            }
        });

        // 3rd Place Special Logic
        const mSemi1 = document.querySelector('div[data-mid="R4-0"]');
        const mSemi2 = document.querySelector('div[data-mid="R4-1"]');
        const m3rd = document.querySelector('div[data-mid="Match3rd"]');
        
        if(mSemi1 && mSemi2 && m3rd) {
            const getLoserHTML = (div) => {
                if(div.querySelector('.team-slot:nth-child(1)').classList.contains('winner')) 
                    return div.querySelector('.team-slot:nth-child(2) span').innerHTML;
                if(div.querySelector('.team-slot:nth-child(2)').classList.contains('winner')) 
                    return div.querySelector('.team-slot:nth-child(1) span').innerHTML;
                return `<img src="${getFlag('TBD')}" class="flag"> TBD`;
            };
            
            m3rd.querySelectorAll('.team-slot')[0].querySelector('span').innerHTML = getLoserHTML(mSemi1);
            m3rd.querySelectorAll('.team-slot')[1].querySelector('span').innerHTML = getLoserHTML(mSemi2);
            
            // Highlight 3rd Place Winner
            const m3 = bracket["Match3rd"] || {};
            const s1 = parseInt(m3.s1), s2 = parseInt(m3.s2);
            const isDraw = (!isNaN(s1) && !isNaN(s2) && s1 === s2);
            m3rd.querySelectorAll('.pen-input').forEach(p => p.classList.toggle('hidden', !isDraw));
            
            let wIdx = -1;
            if(!isNaN(s1) && !isNaN(s2)) {
                if(s1 > s2) wIdx = 0; else if(s2 > s1) wIdx = 1;
                else {
                    const p1 = parseInt(m3.p1), p2 = parseInt(m3.p2);
                    if(!isNaN(p1) && !isNaN(p2)) wIdx = p1 > p2 ? 0 : 1;
                }
            }
            m3rd.querySelectorAll('.team-slot')[0].classList.toggle('winner', wIdx===0);
            m3rd.querySelectorAll('.team-slot')[1].classList.toggle('winner', wIdx===1);
        }
    };

    const resetAll = () => { if(confirm("Reset Tournament?")) { localStorage.clear(); location.href="index.html"; } };
    const resetGroups = () => { localStorage.removeItem(KEY_SCORES); location.reload(); };
    const downloadJSON = () => {
        const d = { g: load(KEY_SCORES), k: load(KEY_KNOCKOUT) };
        const b = new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
        const a = document.createElement('a'); a.href=URL.createObjectURL(b); a.download='wc26.json'; a.click();
    };
    const downloadImage = () => {
        if(typeof html2canvas !== 'undefined') {
            // CHANGE: Capture 'bracket-root' (the inner content) instead of 'bracket-view'
            const element = document.getElementById('bracket-root');
            
            const options = {
                useCORS: true,
                allowTaint: true,
                scale: 2,
                backgroundColor: "#10162F",
                // Force full width/height capture
                width: element.offsetWidth, 
                height: element.offsetHeight,
                windowWidth: element.scrollWidth, 
                windowHeight: element.scrollHeight
            };

            html2canvas(element, options).then(canvas => {
                const a = document.createElement('a');
                a.href = canvas.toDataURL("image/png");
                a.download = 'wc26-bracket.png';
                a.click();
            });
        } else alert("html2canvas library not found");
    };
    // Add this helper function
    const celebrate = (team) => {
    let overlay = document.getElementById('celebration-overlay');
    if(!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'celebration-overlay';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div class="winner-text">
            🏆 WORLD CHAMPION 🏆
            <div class="winner-team">${team.html || team.code}</div>
        </div>`;
    overlay.classList.add('active');

    for(let i = 0; i < 100; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + '%';
        c.style.animationDuration = (Math.random() * 3 + 2) + 's';
        c.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        overlay.appendChild(c);
    }
    setTimeout(() => { overlay.classList.remove('active'); overlay.innerHTML = ''; }, 5000);
    };
    return {
        initGroups, updateGroups, randomizeGroups, resetGroups,
        initKnockoutR32, initKnockoutFinals, updateKnockout, resetAll, downloadJSON, downloadImage,
        saveAndGo: (u) => location.href=u,
        finalizeGroups: () => location.href="knockout-r32.html"
    };
})();