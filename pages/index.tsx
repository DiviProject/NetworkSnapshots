// Dependencies (Hi Chris - just triggering a now build - please delete)
import { Component } from 'react';
import { App, Container, ContainerWrap } from '../components/style/App.style';

import { Header } from '../components/shared/Header';
import { Metadata } from '../components/shared/Metadata';

import { IndexTitle } from '../components/index/Index.title';
import { IndexCopy } from '../components/index/Index.copy';
import { IndexHistory } from '../components/index/Index.history';

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
                    <ContainerWrap>
                        <IndexTitle/>
                        <IndexCopy/>
                        <IndexHistory/>
                    </ContainerWrap>
                </Container>
            </App>
        );
    }
}

export default IndexPage;
