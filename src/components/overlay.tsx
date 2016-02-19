
import * as React from 'react';

export interface OverlayProps {
    visible: boolean;
    onClickHandler?: () => void;   
    children?: any; 
}


export class Overlay extends React.Component<OverlayProps, {}> {
    
    constructor(props: OverlayProps) {
        super(props);
    }    
    
    render() {
        
        const style = {
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: 'rgba(55,55,55,0.4)',
          zIndex: 5,
          left: 0,
          top: 0,
          display: this.props.visible ? 'block' : 'none'  
        };
        
        return (
            <div style={style} onClick={this.onClickHandler.bind(this)}> 
                {this.props.children}               
            </div>
        );
    }
    
    
    private onClickHandler(ev: React.MouseEvent) {
                
        if (ev.currentTarget === ev.target && this.props.onClickHandler) {
            this.props.onClickHandler();
        }
    }
}