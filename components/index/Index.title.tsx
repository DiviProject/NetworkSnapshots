import styled from 'styled-components';
import { HeaderColor } from '../style/Color.style';
import { Component } from 'react';

import superagent from 'superagent';
import xelement from 'xelement';
import * as moment from 'moment-timezone';

export type IndexTitleProps = { };
export type IndexTitleState = { history: Array<any>; mainnet: any; testnet: any; date: string; };

export const StyledTitle = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 15px 15px 0 15px;

    div.text {
        padding: 15px;
        width: calc(100% - 480px);

        h2 {
            font-weight: 700;
            margin: 0 0 15px 0;
        }
        p {
            font-size: 18px;
            line-height: 1.5;
            margin: 0 0 15px 0;
        }

        @media (max-width: 640px) {
            width: 100%;
        }
    }

    div.download {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 480px;
        margin: 30px 0 0 0;

        a.download-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${HeaderColor};
            color: white;
            width: 180px;
            height: 50px;
            border-radius: 5px;
            margin: 0 7.5px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
        }

        p {
            display: block;
            width: 100%;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            padding: 15px 0;
        }

        @media (max-width: 640px) {
            width: 100%;

            a.download-button {
                margin: 15px 0;
            }
        }
    }
`;

export class IndexTitle extends Component<IndexTitleProps, IndexTitleState> {
    public constructor(props: any) {
        super(props);
        this.state = { history: [], mainnet: {}, testnet: {}, date: '' };
        this.getHistory();
    }

    public async getHistory() {
        const data = await superagent.get('https://divi-snapshots.nyc3.digitaloceanspaces.com/');
        const xml = xelement.Parse(data.text);
        console.log('History', xml);

        const items = [];

        xml.elements.forEach(item => {
            if (item.name === 'Contents') {
                const value = {};
                item.elements.forEach(i => {
                    value[i.name] = i.value;
                });
                items.push(value);
            }
        });

        console.log('Contents', items);

        const mainnet = items.filter(item => item.Key.indexOf('mainnet') !== -1).sort()[0];
        const testnet = items.filter(item => item.Key.indexOf('testnet') !== -1).sort()[0];
        const date = moment(new Date(mainnet.LastModified)).tz('America/New_York').format('MMMM Do YYYY');

        this.setState({ history: items, mainnet, testnet, date });

    }

    public render() {
        return(
            <StyledTitle>
                <div className="text">
                    <h2>Download the Latest Snapshots for Divi</h2>
                    <p>
                        This website hosts the latest snapshots of block data from
                        Divi. The snapshots are updated every 24 hours. We keep track
                        of historical snapshot data as well too.
                    </p>
                    <p>
                        If you're cURLing to a server. Right click the link and click
                        the option "Copy Link Address" and then follow the instructions below.
                    </p>
                </div>
                <div className="download">
                    <a className="download-button" href={`https://divi-snapshots.nyc3.digitaloceanspaces.com/${this.state.mainnet.Key}`}>
                        Mainnet
                    </a>
                    <a className="download-button" href={`https://divi-snapshots.nyc3.digitaloceanspaces.com/${this.state.testnet.Key}`}>
                        Testnet
                    </a>
                    <p>Last Pull {this.state.date}</p>
                </div>
            </StyledTitle>
        );
    }
}
