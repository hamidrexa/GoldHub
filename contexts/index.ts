import serverContext from 'server-only-context';

export const [getLang, setLang] = serverContext(null);
