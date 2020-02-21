import { Component } from 'react';
import { App, Container } from '../components/style/App.style';

import { Header } from '../components/shared/Header';
import { Metadata } from '../components/shared/Metadata';

export type IndexProps = { };
export type IndexState = { };

export class IndexPage extends Component<IndexProps, IndexState> {
    public constructor(props: any) {
        super(props);
        this.state = { };
    }

    public render() {
        return(
            <App>
                <Header/>
                <Metadata/>
                <Container>

                </Container>
            </App>
        );
    }
}

export default IndexPage;