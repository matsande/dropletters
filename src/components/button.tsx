import * as React from 'react';

export interface ButtonProps {
    label?: string;
    icon?: string;
    onClick: () => void;  
    className?: string; 
    enabled?: boolean; 
}

export class Button extends React.Component<ButtonProps, {}> {

    constructor(props: ButtonProps) {
        super(props);
    }


    render() {  
        
        const {icon, label, onClick, className} = this.props;
        const enabled = (this.props.enabled === null || this.props.enabled === undefined) ? true : this.props.enabled;
        const contents = this.createContents(icon, label);         
             
        return (
            <a 
                className={`button ${className || ''} ${enabled ? '' : ' button-disabled'}`} 
                onClick={enabled ? this.onClickHandler.bind(this) : () => {}}>
                {contents}
            </a>
        );
    }
    
    private onClickHandler() {
        this.props.onClick();
    }
    
    private createContents(icon: string, label: string) {
       
       let contents = null;
        
        if (icon && label) {
            contents = (
                <div className='button-icontext'>
                    <div className='button-icontext-icon' style={{backgroundImage: `url(${icon})`}}/>
                    <div className='button-icontext-label'>{label}</div> 
                </div>
            );
            
        } else if (icon) {
            contents = (
                <div className='button-icon' style={{backgroundImage: `url(${icon})`}} />               
            );
            
        } else if (label) {
            contents = (
                <div className='button-label'>
                    {label}
                </div>
            );
        } else {
            throw new Error('Cannot create button without contents');
        } 
        
        return contents;
    }
}