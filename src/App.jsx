import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════ */
const G = () => (
  <style>{`
    body {
  margin: 0;
  padding: 0;
}
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
}
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#FFF3E6;font-family:'DM Sans',sans-serif;min-height:100vh}
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
    input[type=number]{-moz-appearance:textfield}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-thumb{background:#C8A89A;border-radius:4px}

    /* ══ TAB NAVIGATION ══ */
    .tab-shell{
      width:100%;
    }

    /*
      KEY FIX: justify-content:center causes flex children to compress
      instead of overflow. On wide screens we centre via a wrapper trick.
      On narrow screens (<700px) we switch to flex-start so the row scrolls.
    */
    .tab-row{
      overflow-x:auto;
      scrollbar-width:none;
      -webkit-overflow-scrolling:touch;
      display:flex;
      justify-content:center;
      padding:0 8px;
    }
    .tab-row::-webkit-scrollbar{display:none}

    .tab-btn{
      /* flex-shrink:0 is CRITICAL — prevents buttons compressing on small screens */
      flex-shrink:0;
      padding:10px 20px;
      border:none;
      cursor:pointer;
      font-family:'DM Sans',sans-serif;
      font-size:13.5px;
      font-weight:600;
      white-space:nowrap;
      min-width:max-content;
      background:transparent;
      color:rgba(255,243,230,0.52);
      border-radius:8px 8px 0 0;
      transition:color .15s,background .15s;
    }
    .tab-btn:hover{color:rgba(255,243,230,0.92);background:rgba(255,243,230,0.09)}
    .tab-btn.active{background:#FFF3E6;color:#381932;font-weight:700}

    /* Switch to left-start when tabs overflow so scroll actually works */
    @media(max-width:700px){
      .tab-row{justify-content:flex-start}
    }

    /* ── CUSTOM SCROLLBAR (the only one — ind-track removed entirely) ── */
    .scrollbar-track{
      height:7px;
      background:rgba(255,243,230,0.15);
      margin:4px 12px 10px;
      border-radius:4px;
      position:relative;
      cursor:pointer;
      user-select:none;
      touch-action:none;
    }
    .scrollbar-thumb{
      position:absolute;
      top:0;
      height:100%;
      background:rgba(255,243,230,0.5);
      border-radius:4px;
      cursor:grab;
      transition:background .15s;
      min-width:32px;
    }
    .scrollbar-thumb:hover,
    .scrollbar-thumb.dragging{
      background:rgba(255,243,230,0.92);
      cursor:grabbing;
    }

    /* ── LAYOUT ── */
    .header-inner{
     width: 100%;
max-width: 100%;
padding: 2rem 0 0;
text-align: center;
box-sizing: border-box;
margin-left: 0;
margin-right: 0;
  

    }

    @media(max-width:768px){
      .header-inner{padding:1.6rem 1.5rem 0}
    }
    .main-wrap{max-width:900px;margin:0 auto;padding:1.75rem 1.25rem 5rem}
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}

    @media(max-width:640px){
      .grid-2{grid-template-columns:1fr}
      .grid-3{grid-template-columns:1fr 1fr}
      .merit-banner{flex-direction:column!important;align-items:flex-start!important}
      .merit-right{text-align:left!important}
      .bd3{grid-template-columns:1fr 1fr!important}
      .seat-stats{flex-direction:column!important}
    }
    @media(max-width:480px){
      .header-inner{padding:1.4rem 1rem 0}
      .tab-btn{font-size:13px;padding:9px 14px}
    }
    @media(max-width:380px){
      .tab-btn{font-size:12px;padding:8px 12px}
    }

    /* ── CARDS & INPUTS ── */
    .card{background:#fff;border-radius:14px;border:1px solid #EAD9CC}
    .inp{
      width:100%;background:#FFFAF6;border:1.5px solid #DEC9B8;
      border-radius:10px;padding:10px 14px;color:#1A0B15;
      font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;outline:none;
      transition:border-color .2s,box-shadow .2s;
    }
    .inp:focus{border-color:#381932;box-shadow:0 0 0 3px rgba(56,25,50,0.09)}
    select.inp{
      cursor:pointer;appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%23381932' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
      background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;
    }

    /* ── PROGRAM BAR ── */
    .mbar{height:3px;border-radius:2px;background:#EAD9CC;position:relative;margin-top:10px}
    .mbar-fill{position:absolute;left:0;top:0;height:100%;border-radius:2px}
    .mbar-pin{position:absolute;top:-4px;width:2px;height:11px;background:#381932;border-radius:1px;transform:translateX(-1px)}

    /* ── COMPONENT STYLES ── */
    .prog-card{background:#fff;border:1px solid #EAD9CC;border-radius:12px;padding:12px 16px;transition:box-shadow .15s}
    .prog-card:hover{box-shadow:0 2px 12px rgba(56,25,50,0.07)}
    .prog-card.ok{border-color:#9DD6B3}
    .pill{display:inline-flex;align-items:center;font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px}
    .p-ok{background:#E8F5EE;color:#1F6E41}
    .p-err{background:#FBEDEC;color:#A93226}
    .tog{padding:6px 15px;border-radius:8px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:background .15s}
    .tog.on{background:#381932;color:#FFF3E6}
    .tog.off{background:#F5EAE2;color:#7B4A66}
    .qbtn{padding:4px 11px;border-radius:6px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600}
    .qbtn.on{background:#381932;color:#FFF3E6}
    .qbtn.off{background:#F5EAE2;color:#7B4A66}
    .sdiv{display:flex;align-items:center;gap:10px;margin-bottom:10px}
    .sdiv span{font-size:11px;font-weight:700;color:#9A7088;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap}
    .sdiv hr{flex:1;border:none;border-top:1px solid #EAD9CC}
    .grp-hdr{padding:7px 16px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #EAD9CC}
    .srow{display:flex;justify-content:space-between;align-items:center;padding:9px 16px 9px 26px;border-bottom:1px solid #F5EAE2}
    .srow:last-child{border-bottom:none}
    .sbadge{font-size:14px;font-weight:800;padding:3px 13px;border-radius:20px}
    .tbl{width:100%;border-collapse:collapse;font-size:13px}
    .tbl thead tr{background:#F5EAE2}
    .tbl th{padding:9px 13px;font-weight:700;color:#381932;font-size:12px;white-space:nowrap}
    .tbl td{padding:9px 13px;border-bottom:1px solid #F5EAE2;color:#1A0B15}
    .tbl tbody tr:nth-child(even){background:#FFFAF6}
    .tbl tbody tr:hover{background:#F5EAE2}
    .sdot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#FFF3E6;flex-shrink:0}
    .result-card{border-radius:16px;overflow:hidden;border:1px solid #EAD9CC}
    .rbody{background:#fff;padding:1.75rem}
    @media(max-width:500px){.rbody{padding:1.25rem}}
    .twrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
  `}</style>
);

/* ══ STATIC DATA ══ */
const CAT_DOT = {
  "CS / IT":"#5B3FD6",
  "Electrical / Mechanical":"#381932",
  "Engineering / Tech":"#0F7EC0",
  "Management / Social":"#0B8F6A"
};
const GRP_S = {
  "Karachi Board":  {bg:"#EEF2FF",text:"#3730A3",dot:"#4F46E5"},
  "Interior Sindh": {bg:"#FEFCE8",text:"#713F12",dot:"#CA8A04"},
  "Other Boards":   {bg:"#F0FDF4",text:"#14532D",dot:"#16A34A"},
  "A-Levels":       {bg:"#FDF4FF",text:"#6B21A8",dot:"#9333EA"},
  "Overseas":       {bg:"#FFF7ED",text:"#7C2D12",dot:"#EA580C"},
  "Special":        {bg:"#FFF1F2",text:"#9F1239",dot:"#E11D48"},
};
const CATS = ["CS / IT","Electrical / Mechanical","Engineering / Tech","Management / Social"];

const PROGS = [
  {name:"Software Engineering",                     merit:87.53,cat:"CS / IT",                idx:18,code:"SE"},
  {name:"Computer Systems Engineering",              merit:85.84,cat:"CS / IT",                idx:10,code:"CS"},
  {name:"Computer Science & Information Technology", merit:85.82,cat:"CS / IT",                idx:19,code:"CT"},
  {name:"Electronic Engineering",                    merit:80.25,cat:"Electrical / Mechanical",idx:11,code:"EL"},
  {name:"Electrical Engineering",                    merit:80.02,cat:"Electrical / Mechanical",idx:8, code:"EE"},
  {name:"Mechanical Engineering",                    merit:78.30,cat:"Electrical / Mechanical",idx:4, code:"ME"},
  {name:"Industrial & Manufacturing Engineering",    merit:77.43,cat:"Electrical / Mechanical",idx:6, code:"IM"},
  {name:"Chemical Engineering",                      merit:76.00,cat:"Electrical / Mechanical",idx:12,code:"CH"},
  {name:"Computational Finance",                     merit:78.98,cat:"Engineering / Tech",      idx:22,code:"CF"},
  {name:"Telecommunication Engineering",             merit:76.40,cat:"Engineering / Tech",      idx:9, code:"TC"},
  {name:"Automotive Engineering",                    merit:74.54,cat:"Engineering / Tech",      idx:7, code:"ME(AU)"},
  {name:"Biomedical Engineering",                    merit:73.88,cat:"Engineering / Tech",      idx:17,code:"BM"},
  {name:"Civil Engineering",                         merit:72.34,cat:"Engineering / Tech",      idx:0, code:"CE"},
  {name:"Management Sciences",                       merit:72.58,cat:"Management / Social",     idx:25,code:"MG"},
  {name:"Textile Engineering",                       merit:71.30,cat:"Engineering / Tech",      idx:5, code:"TE"},
  {name:"Food Engineering",                          merit:70.32,cat:"Engineering / Tech",      idx:16,code:"FD"},
  {name:"Petroleum Engineering",                     merit:70.20,cat:"Engineering / Tech",      idx:2, code:"PE"},
  {name:"Economics & Finance",                       merit:69.98,cat:"Management / Social",     idx:28,code:"EC"},
  {name:"Architecture",                              merit:69.60,cat:"Engineering / Tech",      idx:26,code:"B.Arch"},
  {name:"Construction Engineering",                  merit:69.56,cat:"Engineering / Tech",      idx:3, code:"CE(CN)"},
  {name:"Urban Engineering",                         merit:68.83,cat:"Engineering / Tech",      idx:1, code:"CE(UE)"},
  {name:"Materials Engineering",                     merit:68.12,cat:"Engineering / Tech",      idx:14,code:"MM"},
  {name:"Metallurgical Engineering",                 merit:66.33,cat:"Management / Social",     idx:13,code:"MY"},
  {name:"Polymer & Petroleum Engineering",           merit:65.32,cat:"Management / Social",     idx:15,code:"PP"},
  {name:"Industrial Chemistry",                      merit:64.19,cat:"Management / Social",     idx:21,code:"IC"},
  {name:"Textile Sciences",                          merit:63.89,cat:"Management / Social",     idx:24,code:"TS"},
  {name:"Applied Physics",                           merit:63.65,cat:"Management / Social",     idx:20,code:"PH"},
  {name:"English Linguistics",                       merit:62.65,cat:"Management / Social",     idx:27,code:"EG"},
  {name:"Civil Engineering (Thar Campus)",           merit:62.00,cat:"Management / Social",     idx:30,code:"TCE"},
  {name:"Computer Science (Thar Campus)",            merit:62.00,cat:"Management / Social",     idx:29,code:"TCT"},
  {name:"Development Studies",                       merit:59.22,cat:"Management / Social",     idx:23,code:"DS"},
];

const REG = [
  {id:"R1a",g:"Karachi Board",  l:"Karachi Board — Pre-Engineering / CS",    d:[105,49,25,22,135,47,72,28,127,56,77,94,46,28,35,36,28,30,46,60,49,49,64,2,48,34,16,6,45,3,2]},
  {id:"R1b",g:"Karachi Board",  l:"Karachi Board — Pre-Medical",             d:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,17,3,4,0,1,3,7,3,4,3,2,0]},
  {id:"R1c",g:"Karachi Board",  l:"Karachi Board — Commerce",                d:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,3,13,0,0]},
  {id:"R1d",g:"Karachi Board",  l:"Karachi Board — Arts",                    d:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,3,0,3,6,0,0]},
  {id:"R1e",g:"Karachi Board",  l:"Sindh Tech Board — DAE",                  d:[2,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {id:"R2a",g:"Interior Sindh", l:"Hyderabad Board",                         d:[3,2,1,1,1,1,1,0,2,1,1,1,1,2,1,0,0,0,1,2,1,1,2,0,1,1,1,0,1,3,1]},
  {id:"R2b",g:"Interior Sindh", l:"Mirpurkhas Board",                        d:[3,1,0,1,2,0,1,0,2,1,1,0,1,2,1,0,0,0,1,1,1,2,2,0,2,1,1,0,1,10,3]},
  {id:"R2c",g:"Interior Sindh", l:"Sukkur Board",                            d:[3,0,0,1,1,0,1,0,2,1,1,1,1,2,0,0,0,0,1,1,1,1,2,1,1,1,1,0,1,3,1]},
  {id:"R2d",g:"Interior Sindh", l:"Larkana Board",                           d:[3,1,0,1,1,0,1,0,1,1,1,1,1,2,0,0,0,0,1,1,1,1,2,1,1,1,1,0,1,3,1]},
  {id:"R2e",g:"Interior Sindh", l:"Nawabshah Board",                         d:[1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,1,1,1,1,1,1,0,0,1,3,1]},
  {id:"R3a",g:"Other Boards",   l:"Federal Board — Islamabad",               d:[4,2,1,1,4,3,1,1,3,1,2,2,4,2,1,1,1,0,2,8,2,2,6,1,2,2,1,1,3,2,1]},
  {id:"R3b",g:"Other Boards",   l:"Aga Khan Board — Pre-Eng / CS",           d:[3,3,0,1,7,2,2,3,3,2,1,3,4,3,1,3,2,0,2,7,2,1,8,1,2,5,2,1,3,4,1]},
  {id:"R3d",g:"Other Boards",   l:"Aga Khan Board — Pre-Medical",            d:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,5,0,0,0,2,1,4,1,1,1,1,0]},
  {id:"R3e",g:"Other Boards",   l:"Ziauddin Board",                          d:[1,1,1,0,1,0,0,0,1,0,0,0,0,1,1,0,0,1,0,2,1,1,1,1,0,1,1,1,1,1,1]},
  {id:"R4a",g:"A-Levels",       l:"A-Levels — Pre-Engineering / CS",         d:[3,4,3,3,10,4,5,3,8,3,2,5,6,2,2,4,2,5,7,10,4,4,13,4,5,8,2,2,4,1,1]},
  {id:"R4d",g:"A-Levels",       l:"A-Levels — Pre-Medical",                  d:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,6,0,0,0,1,0,3,2,1,2,2,0]},
  {id:"R5", g:"Other Boards",   l:"Other Boards & Foreign Exams",            d:[1,1,1,0,1,1,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,1,0,0,1,0]},
  {id:"R7", g:"Special",        l:"NED Staff / Faculty Children",            d:[2,3,2,0,4,3,4,0,4,2,2,2,2,2,2,2,2,3,2,10,1,1,2,1,2,2,2,2,2,0,1]},
  {id:"RNOM",g:"Special",       l:"Regional & Government Nominees",          d:[16,0,0,0,8,1,1,0,14,0,6,4,0,0,0,0,0,0,1,1,0,1,5,3,0,5,0,0,3,9,7]},
];
const SF = [
  {id:"SF1a", g:"Karachi Board",  l:"Karachi Board — Pre-Engineering / CS",  d:[4,6,0,2,35,6,16,2,44,3,19,19,3,0,0,0,2,2,10,18,0,0,4,0,0,2,2,0,0,0,0]},
  {id:"SF1b", g:"Karachi Board",  l:"Karachi Board — Pre-Medical",           d:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,8,0,0,0,0,0,0,1,0,0,0,0]},
  {id:"SF2",  g:"Interior Sindh", l:"Interior Sindh Boards (Combined)",      d:[22,0,0,0,7,2,2,0,6,0,4,4,2,0,0,0,0,0,4,7,0,0,0,0,0,0,1,0,0,0,0]},
  {id:"SF3a", g:"Other Boards",   l:"Federal Board",                         d:[2,0,0,0,2,0,1,0,2,0,1,2,2,0,0,0,0,0,0,6,0,0,1,0,0,2,1,0,0,0,0]},
  {id:"SF3b", g:"Other Boards",   l:"Aga Khan Board",                        d:[2,0,0,0,4,0,1,0,4,0,2,0,3,0,0,0,0,0,1,7,0,0,2,0,0,2,1,0,0,0,0]},
  {id:"SF3e", g:"Other Boards",   l:"Ziauddin Board",                        d:[0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {id:"SF4a", g:"A-Levels",       l:"A-Levels (Pakistan-based)",             d:[3,3,2,2,10,2,4,0,12,2,3,4,5,0,0,0,0,2,3,16,0,0,3,0,0,2,4,0,0,0,0]},
  {id:"SF4b", g:"Overseas",       l:"Overseas / Foreign Candidates",         d:[3,1,1,0,2,1,2,0,4,2,2,2,0,0,0,0,0,1,0,8,0,0,0,0,0,0,0,0,0,0,0]},
  {id:"SF8",  g:"Special",        l:"NEDAN Alumni / Professional Children",  d:[5,0,0,0,1,0,1,0,1,1,1,1,1,0,0,0,0,0,0,3,0,0,0,0,0,0,2,0,0,0,0]},
  {id:"SF11", g:"Special",        l:"Sponsored Seats",                       d:[17,0,0,0,15,0,0,0,15,0,20,0,0,0,0,0,0,0,15,82,0,0,0,0,0,0,0,0,0,0,0]},
];

const regGrand = REG.reduce((s,r)=>s+r.d.reduce((a,b)=>a+b,0),0);
const sfGrand  = SF.reduce((s,r)=>s+r.d.reduce((a,b)=>a+b,0),0);
const gs = (rows,idx) => rows.reduce((s,r)=>s+(r.d[idx]||0),0);

function getSeatData(progName) {
  if (!progName) return null;
  const prog = PROGS.find(p => p.name === progName);
  if (!prog) return null;
  const i = prog.idx;
  const regR = REG.map(r=>({...r,seats:r.d[i]||0})).filter(r=>r.seats>0);
  const sfR  = SF.map(r =>({...r,seats:r.d[i]||0})).filter(r=>r.seats>0);
  return { prog, regR, sfR,
    totReg: regR.reduce((s,r)=>s+r.seats,0),
    totSF:  sfR.reduce((s,r)=>s+r.seats,0) };
}

/* ── NED Logo ── */
const NEDLogo = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="rgba(255,243,230,0.07)" stroke="rgba(255,243,230,0.4)" strokeWidth="1.3"/>
    <circle cx="32" cy="32" r="23" fill="rgba(255,243,230,0.04)" stroke="rgba(255,243,230,0.2)" strokeWidth="0.8"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
      const rad=a*Math.PI/180;
      return <line key={i}
        x1={32+30*Math.cos(rad)} y1={32+30*Math.sin(rad)}
        x2={32+26*Math.cos(rad)} y2={32+26*Math.sin(rad)}
        stroke="rgba(255,243,230,0.28)" strokeWidth="2.2" strokeLinecap="round"/>;
    })}
    <text x="32" y="30" textAnchor="middle" fontFamily="'Playfair Display',serif"
      fontWeight="800" fontSize="14.5" fill="#FFF3E6" letterSpacing="-0.3">NED</text>
    <text x="32" y="39.5" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
      fontWeight="600" fontSize="4.8" fill="rgba(255,243,230,0.6)" letterSpacing="0.9">UNIVERSITY</text>
    <text x="32" y="46" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
      fontWeight="400" fontSize="3.9" fill="rgba(255,243,230,0.38)" letterSpacing="0.5">EST. 1921</text>
  </svg>
);

/* ══════════════════════════════════════════
   TAB NAVIGATION  — centred + custom scrollbar only
══════════════════════════════════════════ */
const TabNav = ({ tabs, active, onSelect }) => {
  const rowRef    = useRef(null);
  const thumbRef  = useRef(null);
  const trackRef  = useRef(null);
  const btnRefs   = useRef({});
  const dragState = useRef(null);

  const [thumbStyle, setThumbStyle] = useState({ left:"0%", width:"100%" });

  /* sync scrollbar thumb position to tab-row scroll state */
  const syncThumb = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const visible  = row.clientWidth;
    const total    = row.scrollWidth;
    const scrolled = row.scrollLeft;
    if (total <= visible + 1) {
      /* content fits — hide thumb by filling full width */
      setThumbStyle({ left:"0%", width:"100%", opacity:"0", pointerEvents:"none" });
      return;
    }
    const thumbPct = Math.max(20, (visible / total) * 100);
    const maxLeft  = 100 - thumbPct;
    const leftPct  = (scrolled / (total - visible)) * maxLeft;
    setThumbStyle({ left:`${leftPct.toFixed(2)}%`, width:`${thumbPct.toFixed(2)}%`, opacity:"1", pointerEvents:"auto" });
  }, []);

  /* scroll active button into view whenever active tab changes */
  useEffect(() => {
    const btn = btnRefs.current[active];
    if (btn) btn.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"center" });
    syncThumb();
  }, [active, syncThumb]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    row.addEventListener("scroll", syncThumb, { passive:true });
    window.addEventListener("resize", syncThumb);
    /* run once after paint so scrollWidth is accurate */
    requestAnimationFrame(syncThumb);
    return () => {
      row.removeEventListener("scroll", syncThumb);
      window.removeEventListener("resize", syncThumb);
    };
  }, [syncThumb]);

  /* drag the thumb */
  const onThumbPointerDown = (e) => {
    e.preventDefault();
    const row = rowRef.current;
    if (!row) return;
    dragState.current = { startX: e.clientX, startScrollLeft: row.scrollLeft };
    thumbRef.current?.classList.add("dragging");

    const onMove = (ev) => {
      const ds = dragState.current;
      if (!ds) return;
      const track = trackRef.current;
      const r     = rowRef.current;
      if (!track || !r) return;
      const dx        = ev.clientX - ds.startX;
      const trackW    = track.clientWidth;
      const total     = r.scrollWidth;
      const visible   = r.clientWidth;
      const scrollMax = total - visible;
      const thumbW    = (visible / total) * trackW;
      const ratio     = scrollMax / (trackW - thumbW);
      r.scrollLeft    = Math.max(0, Math.min(scrollMax, ds.startScrollLeft + dx * ratio));
    };

    const onUp = () => {
      dragState.current = null;
      thumbRef.current?.classList.remove("dragging");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
  };

  /* click on track to jump */
  const onTrackClick = (e) => {
    if (e.target === thumbRef.current) return;
    const track = trackRef.current;
    const row   = rowRef.current;
    if (!track || !row) return;
    const rect = track.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    row.scrollLeft = pct * (row.scrollWidth - row.clientWidth);
  };

  return (
    <div className="tab-shell">
      {/* tab buttons row */}
      <div ref={rowRef} className="tab-row">
        {tabs.map(t => (
          <button
            key={t.key}
            ref={el => { if (el) btnRefs.current[t.key] = el; }}
            className={`tab-btn${active === t.key ? " active" : ""}`}
            onClick={() => onSelect(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* custom draggable scrollbar — only visible indicator */}
      <div
        ref={trackRef}
        className="scrollbar-track"
        onClick={onTrackClick}
      >
        <div
          ref={thumbRef}
          className="scrollbar-thumb"
          style={thumbStyle}
          onPointerDown={onThumbPointerDown}
        />
      </div>
    </div>
  );
};

/* ════════════════════════════════════
   MAIN APP
════════════════════════════════════ */
export default function App() {
  const [tab,      setTab]      = useState("goal");
  const [inter,    setInter]    = useState("");
  const [entry,    setEntry]    = useState("");
  const [search,   setSearch]   = useState("");
  const [gMode,    setGMode]    = useState("pct");
  const [gPct,     setGPct]     = useState("");
  const [gObt,     setGObt]     = useState("");
  const [gTot,     setGTot]     = useState("1100");
  const [gProg,    setGProg]    = useState("");
  const [seatProg, setSeatProg] = useState("");

  const iV  = parseFloat(inter) || 0;
  const eV  = parseFloat(entry) || 0;
  const myM = +((eV * 0.6) + (iV * 0.4)).toFixed(2);
  const hasIn = inter !== "" && entry !== "";

  const results = PROGS.map(p => ({
    ...p,
    reqE: +((p.merit - iV * 0.4) / 0.6).toFixed(2),
    elig: hasIn && myM >= p.merit,
    gap:  +(p.merit - myM).toFixed(2),
  }));
  const eligC = results.filter(p => p.elig).length;
  const filt  = results.filter(p => {
    const m = p.name.toLowerCase().includes(search.toLowerCase());
    return tab === "eligible" ? m && p.elig : m;
  });

  const gIP = gMode === "pct"
    ? (parseFloat(gPct) || 0)
    : +((parseFloat(gObt)||0) / Math.max(parseFloat(gTot)||1, 1) * 100).toFixed(2);
  const selP   = PROGS.find(p => p.name === gProg);
  const gHasIn = gMode === "pct" ? gPct !== "" : gObt !== "" && gTot !== "";
  const gRes   = (selP && gIP > 0) ? (() => {
    const req = (selP.merit - gIP * 0.4) / 0.6;
    return { req:+req.toFixed(2), imp:req>100, easy:req<=0,
      ic:+(gIP*0.4).toFixed(2), maxM:+(gIP*0.4+60).toFixed(2) };
  })() : null;

  const SD = getSeatData(seatProg);
  const clampOk = v => v === "" || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100);

  const Divider = ({cat}) => (
    <div className="sdiv">
      <div style={{width:8,height:8,borderRadius:"50%",background:CAT_DOT[cat],flexShrink:0}}/>
      <span>{cat}</span><hr/>
    </div>
  );

  const ProgRow = ({p}) => (
    <div className={`prog-card${p.elig && hasIn ? " ok" : ""}`}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:9}}>
            <span style={{fontSize:13,fontWeight:600,color:"#1A0B15"}}>{p.name}</span>
            {hasIn && (
              <span className={`pill ${p.elig ? "p-ok" : "p-err"}`}>
                {p.elig ? "✓ Eligible" : `Need +${p.gap.toFixed(2)}%`}
              </span>
            )}
          </div>
          <div className="mbar">
            <div className="mbar-fill" style={{width:`${p.merit}%`,background:p.elig&&hasIn?"#1F6E41":CAT_DOT[p.cat],opacity:0.4}}/>
            {hasIn && <div className="mbar-pin" style={{left:`${Math.min(100,myM)}%`}}/>}
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0,paddingLeft:14}}>
          <div style={{fontSize:17,fontWeight:800,color:"#1A0B15"}}>{p.merit}%</div>
          <div style={{fontSize:10,color:"#9A7088"}}>cutoff</div>
        </div>
      </div>
    </div>
  );

  /* Full-word tab labels (no abbreviations) */
  const TABS = [
    {key:"goal",     label:"🎯 Goal Calculator"},
    {key:"results",  label:"All Programs"},
    {key:"eligible", label: hasIn ? `✓ Eligible (${eligC})` : "Eligible Programs"},
    {key:"seats",    label:"🪑 Seat Distribution"},
    {key:"needed",   label:"Required Scores"},
  ];

  const changeTab = (key) => { setTab(key); setSearch(""); };

  /* ════════════════ RENDER ════════════════ */
  return (
    <div style={{minHeight:"100vh",background:"#FFF3E6",fontFamily:"'DM Sans',sans-serif"}}>
      <G/>

      {/* ═══ HEADER — full viewport width ═══ */}
      <header style={{background:"#381932",width:"100%",boxSizing:"border-box"}}>
        <div className="header-inner">

          {/* Logo + Title */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",
            gap:16,marginBottom:"1rem",flexWrap:"wrap"}}>
            <NEDLogo/>
            <div style={{textAlign:"left"}}>
              <p style={{fontSize:10.5,fontWeight:700,color:"rgba(255,243,230,0.45)",
                letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>
                NED University of Engineering &amp; Technology
              </p>
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(19px,4vw,30px)",fontWeight:800,color:"#FFF3E6",
                letterSpacing:"-0.01em",lineHeight:1.25}}>
                Undergraduate Admission<br/>Merit Calculator
              </h1>
            </div>
          </div>

          {/* Formula */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",
            gap:8,marginBottom:"1.4rem",flexWrap:"wrap"}}>
            <span style={{fontSize:11.5,color:"rgba(255,243,230,0.4)"}}>Merit Formula:</span>
            {[["60%","Entry Test"],["40%","Intermediate"]].map(([pct,lbl],i) => (
              <span key={pct} style={{display:"inline-flex",alignItems:"center",gap:5,
                background:"rgba(255,243,230,0.1)",border:"1px solid rgba(255,243,230,0.15)",
                borderRadius:6,padding:"3px 11px",fontSize:12}}>
                {i > 0 && <span style={{marginLeft:-3,marginRight:3,color:"rgba(255,243,230,0.3)"}}>+</span>}
                <strong style={{color:"#FFF3E6"}}>{pct}</strong>
                <span style={{color:"rgba(255,243,230,0.45)"}}>{lbl}</span>
              </span>
            ))}
            <span style={{fontSize:11,color:"rgba(255,243,230,0.25)"}}>· 2024–25 data</span>
          </div>

          {/* ── TAB NAVIGATION — centred with full labels + visible scrollbar ── */}
          <TabNav tabs={TABS} active={tab} onSelect={changeTab} />

        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="main-wrap">

        {/* ─── GOAL CALCULATOR ─── */}
        {tab === "goal" && (
          <div>
            <div style={{marginBottom:"1.4rem"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(17px,3.5vw,22px)",
                fontWeight:700,color:"#381932",marginBottom:4}}>What score do I need?</h2>
              <p style={{fontSize:13.5,color:"#7B4A66",lineHeight:1.6}}>
                Enter your intermediate result and pick a program — get the exact minimum entry test score required.
              </p>
            </div>

            {/* Step 1 */}
            <div className="card" style={{marginBottom:12,padding:"1.35rem 1.4rem 1.35rem 1.7rem",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:"#381932",borderRadius:"14px 0 0 14px"}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:13}}>
                <div className="sdot" style={{background:"#381932"}}>1</div>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#1A0B15"}}>Intermediate Result</span>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:13,flexWrap:"wrap"}}>
                {["pct","marks"].map(m => (
                  <button key={m} className={`tog ${gMode===m?"on":"off"}`} onClick={()=>setGMode(m)}>
                    {m==="pct"?"Enter as Percentage":"Enter as Marks"}
                  </button>
                ))}
              </div>
              {gMode === "pct" ? (
                <div style={{display:"flex",alignItems:"center",gap:10,maxWidth:260}}>
                  <input type="number" min="0" max="100" placeholder="e.g. 84.5" value={gPct}
                    className="inp" style={{fontSize:22,fontWeight:800}}
                    onChange={e=>{if(clampOk(e.target.value))setGPct(e.target.value);}}/>
                  <span style={{fontSize:20,fontWeight:800,color:"#381932"}}>%</span>
                </div>
              ) : (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,maxWidth:320,marginBottom:10}}>
                    <input type="number" min="0" placeholder="Obtained" value={gObt}
                      className="inp" style={{fontSize:18,fontWeight:800,textAlign:"center"}}
                      onChange={e=>setGObt(e.target.value)}/>
                    <span style={{fontSize:18,color:"#9A7088",flexShrink:0}}>/</span>
                    <input type="number" min="1" placeholder="Total" value={gTot}
                      className="inp" style={{fontSize:18,fontWeight:800,textAlign:"center"}}
                      onChange={e=>setGTot(e.target.value)}/>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[["550","1st Year"],["1100","FSc Full"],["1650","Matric+FSc"]].map(([v,l])=>(
                      <button key={v} className={`qbtn ${gTot===v?"on":"off"}`} onClick={()=>setGTot(v)}>{l} ({v})</button>
                    ))}
                  </div>
                  {gObt && gTot && parseFloat(gTot)>0 && (
                    <p style={{marginTop:9,fontSize:13,color:"#7B4A66"}}>Equivalent: <strong style={{color:"#381932",fontSize:15}}>{gIP.toFixed(2)}%</strong></p>
                  )}
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="card" style={{marginBottom:14,padding:"1.35rem 1.4rem 1.35rem 1.7rem",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:"#7B3F6A",borderRadius:"14px 0 0 14px"}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:13}}>
                <div className="sdot" style={{background:"#7B3F6A"}}>2</div>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#1A0B15"}}>Select Your Program</span>
              </div>
              <select value={gProg} onChange={e=>setGProg(e.target.value)} className="inp" style={{fontSize:14}}>
                <option value="">— Choose a program —</option>
                {CATS.map(cat => (
                  <optgroup key={cat} label={cat}>
                    {PROGS.filter(p=>p.cat===cat).map(p => (
                      <option key={p.name} value={p.name}>{p.name}  ·  cutoff {p.merit}%</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {selP && (
                <div style={{display:"flex",gap:8,alignItems:"center",marginTop:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:"#9A7088"}}>Last year cutoff:</span>
                  <strong style={{fontSize:15,fontWeight:800,color:"#381932"}}>{selP.merit}%</strong>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"#F5EAE2",color:"#381932",fontWeight:600}}>{selP.code}</span>
                </div>
              )}
            </div>

            {/* Result */}
            {gHasIn && selP && gRes ? (
              <div className="result-card">
                <div style={{height:5,background:gRes.imp?"#A93226":gRes.easy?"#1F6E41":"#381932"}}/>
                <div className="rbody">
                  {gRes.imp ? (
                    <>
                      <p style={{fontSize:12,fontWeight:700,color:"#A93226",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>⚠ Not Achievable</p>
                      <p style={{fontSize:14,color:"#5A4A5A",lineHeight:1.75,marginBottom:14}}>
                        With intermediate <strong style={{color:"#1A0B15"}}>{gIP.toFixed(2)}%</strong>, a perfect 100% entry test gives a max merit of only <strong style={{color:"#A93226"}}>{gRes.maxM}%</strong> — below the <strong style={{color:"#1A0B15"}}>{selP.merit}%</strong> cutoff for {selP.name}.
                      </p>
                      <div style={{background:"#FBEDEC",borderRadius:10,padding:"12px 16px",fontSize:13,color:"#A93226"}}>
                        Maximum achievable merit: <strong>{gRes.maxM}%</strong>
                      </div>
                    </>
                  ) : gRes.easy ? (
                    <>
                      <p style={{fontSize:12,fontWeight:700,color:"#1F6E41",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>✓ Already Qualified</p>
                      <p style={{fontSize:14,color:"#5A4A5A"}}>Your intermediate score alone clears the cutoff. You need <strong style={{color:"#1F6E41"}}>0% or above</strong> in the entry test.</p>
                    </>
                  ) : (
                    <>
                      <p style={{fontSize:11,color:"#9A7088",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Minimum Entry Test Score Required</p>
                      <div style={{display:"flex",alignItems:"flex-end",gap:4,marginBottom:22}}>
                        <span style={{fontSize:"clamp(44px,10vw,60px)",fontWeight:800,color:"#381932",lineHeight:1}}>{gRes.req.toFixed(1)}</span>
                        <span style={{fontSize:24,fontWeight:800,color:"#381932",marginBottom:5}}>%</span>
                      </div>
                      <div className="bd3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
                        {[
                          {l:"Cutoff Merit",      v:`${selP.merit}%`,                       s:"target"},
                          {l:"Inter Contributes", v:`${gRes.ic}%`,                          s:"your 40%"},
                          {l:"Still Needed",      v:`${(selP.merit-gRes.ic).toFixed(2)}%`,  s:"via entry test"},
                        ].map(s => (
                          <div key={s.l} style={{background:"#F5EAE2",borderRadius:10,padding:"12px 14px"}}>
                            <div style={{fontSize:18,fontWeight:800,color:"#381932"}}>{s.v}</div>
                            <div style={{fontSize:11,color:"#7B4A66",marginTop:3,fontWeight:600}}>{s.l}</div>
                            <div style={{fontSize:10,color:"#9A7088"}}>{s.s}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{background:"#F5EAE2",borderRadius:10,padding:"13px 16px",fontSize:13,color:"#5A1A3A",lineHeight:2,marginBottom:18}}>
                        <strong style={{color:"#1A0B15"}}>Calculation:</strong><br/>
                        {selP.merit} = (Entry Test × 0.60) + ({gIP.toFixed(2)} × 0.40)<br/>
                        Entry Test = ({selP.merit} − {gRes.ic}) ÷ 0.60 = <strong style={{color:"#381932"}}>{gRes.req}%</strong>
                      </div>
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#9A7088",marginBottom:5}}>
                          <span>Difficulty</span>
                          <strong style={{color:gRes.req>=85?"#A93226":gRes.req>=70?"#B45309":"#1F6E41"}}>
                            {gRes.req>=85?"Very High":gRes.req>=70?"Moderate":"Achievable"} — {gRes.req.toFixed(1)}%
                          </strong>
                        </div>
                        <div style={{height:6,background:"#EAD9CC",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${Math.min(100,gRes.req)}%`,transition:"width .4s",
                            background:gRes.req>=85?"#A93226":gRes.req>=70?"#D97706":"#1F6E41",borderRadius:3}}/>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="card" style={{textAlign:"center",padding:"2.5rem 1.5rem",borderStyle:"dashed"}}>
                <div style={{fontSize:36,marginBottom:10}}>🎯</div>
                <p style={{fontSize:13.5,color:"#9A7088"}}>
                  {!gHasIn && !selP ? "Complete both steps above to see your required score"
                    : !gHasIn       ? "Enter your intermediate result to continue"
                    :                 "Select a program to see the required entry test score"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── ALL PROGRAMS / ELIGIBLE ─── */}
        {(tab === "results" || tab === "eligible") && (
          <div>
            <div className="grid-2" style={{marginBottom:12}}>
              {[
                {label:"Intermediate %",weight:"40%",val:inter,set:setInter,accent:"#381932"},
                {label:"Entry Test %",  weight:"60%",val:entry,set:setEntry,accent:"#7B3F6A"},
              ].map(f => (
                <div className="card" key={f.label} style={{padding:"1.1rem 1.25rem",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:f.accent}}/>
                  <label style={{fontSize:11,color:"#9A7088",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:9}}>{f.label}</label>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <input type="number" min="0" max="100" placeholder="e.g. 82" value={f.val}
                      className="inp" style={{fontSize:22,fontWeight:800}}
                      onChange={e=>{if(clampOk(e.target.value))f.set(e.target.value);}}/>
                    <span style={{fontSize:18,fontWeight:800,color:f.accent}}>%</span>
                  </div>
                  <p style={{marginTop:6,fontSize:11.5,color:"#9A7088"}}>Weight: <strong style={{color:f.accent}}>{f.weight}</strong> of merit</p>
                </div>
              ))}
            </div>
            {hasIn && (
              <div className="card merit-banner" style={{display:"flex",justifyContent:"space-between",
                alignItems:"center",marginBottom:14,padding:"1.2rem 1.5rem",
                borderLeft:"4px solid #381932",flexWrap:"wrap",gap:10}}>
                <div>
                  <p style={{fontSize:11,color:"#9A7088",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Your Calculated Merit</p>
                  <div style={{fontSize:"clamp(34px,8vw,48px)",fontWeight:800,color:"#381932",lineHeight:1}}>{myM}%</div>
                  <p style={{fontSize:12,color:"#9A7088",marginTop:5}}>({eV} × 0.60) + ({iV} × 0.40)</p>
                </div>
                <div className="merit-right" style={{textAlign:"right"}}>
                  <div style={{fontSize:34,fontWeight:800,color:eligC>0?"#1F6E41":"#A93226"}}>
                    {eligC}<span style={{fontSize:14,color:"#9A7088",fontWeight:400}}>/{PROGS.length}</span>
                  </div>
                  <p style={{fontSize:12,color:"#9A7088"}}>programs eligible</p>
                </div>
              </div>
            )}
            <input placeholder="Search program…" value={search} onChange={e=>setSearch(e.target.value)}
              className="inp" style={{marginBottom:16,fontSize:14,fontWeight:500}}/>
            {CATS.map(cat => {
              const list = filt.filter(p=>p.cat===cat);
              if (!list.length) return null;
              return (
                <div key={cat} style={{marginBottom:"1.5rem"}}>
                  <Divider cat={cat}/>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {list.map(p=><ProgRow key={p.name} p={p}/>)}
                  </div>
                </div>
              );
            })}
            {filt.length===0 && <p style={{textAlign:"center",padding:"3rem",color:"#9A7088",fontSize:14}}>No programs found.</p>}
          </div>
        )}

        {/* ─── SEAT DISTRIBUTION ─── */}
        {tab === "seats" && (
          <div>
            <div style={{marginBottom:"1.4rem"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(17px,3.5vw,22px)",fontWeight:700,color:"#381932",marginBottom:4}}>Seat Distribution</h2>
              <p style={{fontSize:13,color:"#7B4A66",lineHeight:1.6}}>Official data — NED University Distribution of Seats, Admissions 2025</p>
            </div>
            <div className="grid-3" style={{marginBottom:16}}>
              {[
                {l:"Regular Seats",      v:regGrand,         s:"All boards · all programs"},
                {l:"Self-Finance Seats", v:sfGrand,          s:"All categories combined"},
                {l:"Grand Total",        v:regGrand+sfGrand, s:"Total UG intake 2025"},
              ].map(s => (
                <div key={s.l} style={{background:"#381932",borderRadius:12,padding:"1rem 1.1rem"}}>
                  <div style={{fontSize:"clamp(20px,5vw,28px)",fontWeight:800,color:"#FFF3E6"}}>{s.v}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,243,230,0.55)",marginTop:3}}>{s.l}</div>
                  <div style={{fontSize:11,color:"rgba(255,243,230,0.3)",marginTop:2}}>{s.s}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{marginBottom:16,padding:0,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid #EAD9CC",background:"#F5EAE2",
                display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:"#381932"}}>All Programs — Seat Summary</span>
                <span style={{fontSize:11,color:"#9A7088"}}>Regular + Self-Finance</span>
              </div>
              <div className="twrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th style={{textAlign:"left"}}>Program</th>
                      <th>Code</th>
                      <th style={{textAlign:"center"}}>Regular</th>
                      <th style={{textAlign:"center"}}>Self-Finance</th>
                      <th style={{textAlign:"center"}}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...PROGS].sort((a,b)=>b.merit-a.merit).map(p => {
                      const r=gs(REG,p.idx), s=gs(SF,p.idx);
                      return (
                        <tr key={p.name}>
                          <td style={{fontWeight:600}}>{p.name}</td>
                          <td style={{textAlign:"center"}}>
                            <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"#F5EAE2",color:"#381932",fontWeight:700}}>{p.code}</span>
                          </td>
                          <td style={{textAlign:"center",fontWeight:800,fontSize:15,color:"#381932"}}>{r}</td>
                          <td style={{textAlign:"center",fontWeight:600,color:"#7B4A66"}}>{s||"—"}</td>
                          <td style={{textAlign:"center",fontWeight:800,fontSize:15,color:"#1A0B15"}}>{r+s}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{marginBottom:14,padding:"1.25rem"}}>
              <label style={{fontSize:11,fontWeight:700,color:"#9A7088",textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:10}}>
                Board-wise Breakdown — Select a Program
              </label>
              <select value={seatProg} onChange={e=>setSeatProg(e.target.value)} className="inp" style={{fontSize:14}}>
                <option value="">— Select a program to view board allocation —</option>
                {CATS.map(cat => (
                  <optgroup key={cat} label={cat}>
                    {PROGS.filter(p=>p.cat===cat).map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {SD ? (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:10}}>
                  <div>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:"#1A0B15"}}>{SD.prog.name}</h3>
                    <p style={{fontSize:12,color:"#9A7088",marginTop:3}}>
                      Cutoff: <strong style={{color:"#381932"}}>{SD.prog.merit}%</strong> &nbsp;·&nbsp; Code: <strong style={{color:"#381932"}}>{SD.prog.code}</strong>
                    </p>
                  </div>
                  <div className="seat-stats" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[
                      {l:"Regular",      v:SD.totReg,           bg:"#F5EAE2",c:"#381932"},
                      {l:"Self-Finance", v:SD.totSF,            bg:"#FEFCE8",c:"#713F12"},
                      {l:"Total",        v:SD.totReg+SD.totSF,  bg:"#E8F5EE",c:"#1F6E41"},
                    ].map(s => (
                      <div key={s.l} style={{background:s.bg,borderRadius:10,padding:"8px 16px",textAlign:"center",minWidth:78}}>
                        <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
                        <div style={{fontSize:11,color:s.c,opacity:.75,fontWeight:600}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {SD.regR.length > 0 && (
                  <div className="card" style={{marginBottom:12,overflow:"hidden",padding:0}}>
                    <div style={{padding:"11px 16px",background:"#F5EAE2",borderBottom:"1px solid #EAD9CC"}}>
                      <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13.5,color:"#381932"}}>
                        Regular Scheme — {SD.totReg} seats
                      </span>
                    </div>
                    {Object.keys(GRP_S).map(grp => {
                      const rows = SD.regR.filter(r=>r.g===grp);
                      if (!rows.length) return null;
                      const g = GRP_S[grp];
                      return (
                        <div key={grp}>
                          <div className="grp-hdr" style={{background:g.bg}}>
                            <div style={{width:7,height:7,borderRadius:"50%",background:g.dot}}/>
                            <span style={{fontSize:11,fontWeight:700,color:g.text,textTransform:"uppercase",letterSpacing:"0.08em"}}>{grp}</span>
                          </div>
                          {rows.map(r => (
                            <div className="srow" key={r.id}>
                              <span style={{fontSize:13,color:"#1A0B15"}}>{r.l}</span>
                              <span className="sbadge" style={{background:"#F5EAE2",color:"#381932"}}>{r.seats}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
                {SD.sfR.length > 0 && (
                  <div className="card" style={{overflow:"hidden",padding:0}}>
                    <div style={{padding:"11px 16px",background:"#FEFCE8",borderBottom:"1px solid #EAD9CC"}}>
                      <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13.5,color:"#713F12"}}>
                        Self-Finance Scheme — {SD.totSF} seats
                      </span>
                    </div>
                    {Object.keys(GRP_S).map(grp => {
                      const rows = SD.sfR.filter(r=>r.g===grp);
                      if (!rows.length) return null;
                      const g = GRP_S[grp];
                      return (
                        <div key={grp}>
                          <div className="grp-hdr" style={{background:g.bg}}>
                            <div style={{width:7,height:7,borderRadius:"50%",background:g.dot}}/>
                            <span style={{fontSize:11,fontWeight:700,color:g.text,textTransform:"uppercase",letterSpacing:"0.08em"}}>{grp}</span>
                          </div>
                          {rows.map(r => (
                            <div className="srow" key={r.id}>
                              <span style={{fontSize:13,color:"#1A0B15"}}>{r.l}</span>
                              <span className="sbadge" style={{background:"#FEFCE8",color:"#713F12"}}>{r.seats}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
                {SD.totReg===0 && SD.totSF===0 && (
                  <div className="card" style={{textAlign:"center",padding:"2rem",borderStyle:"dashed"}}>
                    <p style={{fontSize:14,color:"#9A7088"}}>No seat allocation data found for this program.</p>
                  </div>
                )}
              </div>
            ) : seatProg ? null : (
              <div className="card" style={{textAlign:"center",padding:"2rem",borderStyle:"dashed"}}>
                <p style={{fontSize:14,color:"#9A7088"}}>Select a program above to view its complete board-wise seat breakdown</p>
              </div>
            )}

            <div style={{marginTop:14,padding:"12px 16px",background:"#F5EAE2",borderRadius:10,fontSize:12,color:"#7B4A66",lineHeight:1.85}}>
              <strong style={{color:"#381932"}}>Source:</strong> NED University — Official Distribution of Seats, Admissions 2025.
              Interior Sindh includes Hyderabad, Mirpurkhas, Sukkur, Larkana &amp; Nawabshah boards.
            </div>
          </div>
        )}

        {/* ─── REQUIRED SCORES ─── */}
        {tab === "needed" && (
          <div>
            <div className="card" style={{marginBottom:14,padding:"1.25rem"}}>
              <label style={{fontSize:11,fontWeight:700,color:"#9A7088",textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:8}}>
                Your Intermediate %
              </label>
              <div style={{display:"flex",alignItems:"center",gap:10,maxWidth:260}}>
                <input type="number" min="0" max="100" placeholder="e.g. 83" value={inter}
                  className="inp" style={{fontSize:22,fontWeight:800}}
                  onChange={e=>{if(clampOk(e.target.value))setInter(e.target.value);}}/>
                <span style={{fontSize:20,fontWeight:800,color:"#381932"}}>%</span>
              </div>
              {inter && <p style={{marginTop:8,fontSize:13,color:"#7B4A66"}}>40% contribution: <strong style={{color:"#381932"}}>{(iV*0.4).toFixed(2)}%</strong></p>}
            </div>
            <input placeholder="Search program…" value={search} onChange={e=>setSearch(e.target.value)}
              className="inp" style={{marginBottom:16,fontSize:14,fontWeight:500}}/>
            {CATS.map(cat => {
              const list = results.filter(p=>p.cat===cat&&p.name.toLowerCase().includes(search.toLowerCase()));
              if (!list.length) return null;
              return (
                <div key={cat} style={{marginBottom:"1.5rem"}}>
                  <Divider cat={cat}/>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {list.map(p => {
                      const req = iV > 0 ? p.reqE : null;
                      const imp = req !== null && req > 100;
                      const got = req !== null && eV > 0 && eV >= req;
                      return (
                        <div className="card" key={p.name} style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:600,color:"#1A0B15",marginBottom:2}}>{p.name}</div>
                            <div style={{fontSize:11,color:"#9A7088"}}>Cutoff: <strong style={{color:"#7B4A66"}}>{p.merit}%</strong></div>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            {req===null
                              ? <span style={{fontSize:12,color:"#9A7088"}}>Enter inter %</span>
                              : imp
                              ? <span style={{fontSize:12,fontWeight:700,color:"#A93226",background:"#FBEDEC",padding:"4px 10px",borderRadius:6}}>Not achievable</span>
                              : <>
                                  <span style={{fontSize:18,fontWeight:800,color:got?"#1F6E41":"#381932"}}>{req.toFixed(1)}%</span>
                                  <div style={{fontSize:10,color:"#9A7088"}}>min. entry test</div>
                                </>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <footer style={{marginTop:"2.5rem",padding:"13px 16px",background:"#F5EAE2",borderRadius:12,fontSize:12,color:"#7B4A66",lineHeight:1.9}}>
          <strong style={{color:"#381932"}}>Disclaimer:</strong> Merit cutoffs are based on 2024–25 data. Seat figures from NED University's official 2025 admissions prospectus. Figures may vary annually. Verify at <strong style={{color:"#381932"}}>neduet.edu.pk</strong>.
        </footer>
      </main>
    </div>
  );
}
