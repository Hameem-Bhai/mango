/**
 * Developer Credit & Console Easter Egg
 * Hameem Bhai | hameembhaierdokan.studio
 */

export function logDeveloperCredit() {
  if (typeof window === 'undefined') return;

  const banner = `
   __  __          __  __                         ____  ____  
  |  \\/  |_ __    |  \\/  | __ _ _ __   __ _  ___ | __ )|  _ \\ 
  | |\\/| | '__|   | |\\/| |/ _\` | '_ \\ / _\` |/ _ \\|  _ \\| | | |
  | |  | | |   _  | |  | | (_| | | | | (_| | (_) | |_) | |_| |
  |_|  |_|_|  (_) |_|  |_|\\__,_|_| |_|\\__, |\\___/|____/|____/ 
                                      |___/                   
`;

  console.log(
    `%c${banner}`,
    'color: #FDA701; font-family: monospace; font-weight: bold;'
  );

  console.log(
    '%c🥭 Mr. Mango BD — Official Platform%c\n' +
    '---------------------------------------------------------\n' +
    '%cCrafted & Engineered with precision by:%c Hameem Bhai\n' +
    '%cStudio:%c https://hameembhaierdokan.studio\n' +
    '%cTech Stack:%c React 18 • TypeScript • Tailwind CSS • Express • Vite\n' +
    '%cNeed high-performance web engineering? Visit:%c hameembhaierdokan.studio\n' +
    '---------------------------------------------------------',
    'background: #1A1A1A; color: #FDA701; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    '',
    'color: #666; font-weight: bold;',
    'color: #FDA701; font-size: 13px; font-weight: bold;',
    'color: #666; font-weight: bold;',
    'color: #076136; font-weight: bold; text-decoration: underline;',
    'color: #666; font-weight: bold;',
    'color: #444; font-weight: 500;',
    'color: #666; font-weight: bold;',
    'color: #FDA701; font-weight: bold;'
  );
}
