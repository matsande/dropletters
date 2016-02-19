import * as React from 'react';

import {Button} from './button';

export interface MenuProps {
    children?: Button[];
    className?: string;
    visible: boolean;
}


export class Menu extends React.Component<MenuProps, {}> {
    constructor(props: MenuProps) {
        super(props);
    }
    
    
    render() {
        
        const {children, className, visible} = this.props;       
        
        const menuItems = React.Children.map(children, (child, index) => {
            return <li className='menu-item' key={index}>{child}</li>;
        });
        
        return (
            <div className={`menu ${className || ''} ${visible ? '' : 'menu-hidden'}`}>
                <ul className='menu-items'>
                    {menuItems}
                </ul>        
            </div>
        );
    }
}