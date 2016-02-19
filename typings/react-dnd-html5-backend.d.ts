
// Note: Slightly nasty declaration file just to get tsc to swallow the import statement

declare module 'react-dnd-html5-backend' {
    
    import * as dnd from 'react-dnd';
    const HTML5Backend: dnd.Backend;
    export default HTML5Backend; 
}

declare module 'react-dnd-touch-backend' {
    import * as dnd from 'react-dnd';
    const TouchBackend: dnd.Backend;
    export default TouchBackend;
}