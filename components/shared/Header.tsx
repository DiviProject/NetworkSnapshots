import { Component } from 'react';
import { HeaderStyled } from '../style/Header.style';

export type HeaderProps = { };
export type HeaderState = { };

export class Header extends Component<HeaderProps, HeaderState> {
    public constructor(props: any) {
        super(props);
        this.state = { };
    }

    public render() {
        return(
            <HeaderStyled>
                <div className="container-wrap">
                    <a className="brand">
                        <img src={require('../image/logo.png')}/>
                        <h1>Network Snapshots</h1>
                    </a>
                </div>
            </HeaderStyled>
        );
    }
}