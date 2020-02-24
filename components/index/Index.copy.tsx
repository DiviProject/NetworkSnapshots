import styled from 'styled-components';
import { Component } from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';

export type IndexCopyProps = { };
export type IndexCopyState = { };

export const StyledCopy = styled.div`
    padding: 15px;
    div.text {
        padding: 15px;
        width: 100%;

        h2 {
            font-weight: 700;
            margin: 0;
        }
        p {
            font-size: 18px;
            line-height: 1.5;
        }
    }

    div.snippet {
        margin: 15px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
    }
`;

export class IndexCopy extends Component<IndexCopyProps, IndexCopyState> {
    public constructor(props: any) {
        super(props);
        this.state = { };
    }

    public render() {
        return(
            <StyledCopy>
                <div className="text">
                    <h2>How To Update Your Chain</h2>
                </div>

                <div className="snippet">
                    <SyntaxHighlighter language="bash" style={atomDark}>
                        {`cd ~/.divi # or wherever your divi data is stored\n` +
                        `curl -k [URL of Snapshot] -o snapshot.zip\n` +
                        `unzip snapshot.zip -d .\n` +
                        `mv blocks blocks_old\n` +
                        `mv chainstate chainstate_old\n` +
                        `unzip blocks-snapshot.zip -d blocks\n` +
                        `unzip chainstate-snapshot.zip -d chainstate`}
                    </SyntaxHighlighter>
                </div>
            </StyledCopy>
        );
    }
}
