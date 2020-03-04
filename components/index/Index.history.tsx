import styled from 'styled-components';
import { HeaderColor } from '../style/Color.style';
import { Component } from 'react';

import superagent from 'superagent';
import xelement from 'xelement';
import * as moment from 'moment-timezone';

export type IndexHistoryProps = { };
export type IndexHistoryState = { history: Array<any> };

export const StyledHistory = styled.div`
    padding: 15px;
    div.text {
        padding: 15px;
        width: 100%;

        h2 {
            font-weight: 700;
            margin: 0 0 15px 0;
        }
        p {
            font-size: 18px;
            line-height: 1.5;
        }
    }

    div.snapshots {
        display: flex;
        div.snapshot-table {
            width: 50%;
            padding: 15px;

            table {
                width: 100%;
                thead td {
                    font-size: 14px;
                    font-weight: bold;
                    padding: 5px;
                    border-bottom: 2px solid black;
                }

                td {
                    font-size: 14px;
                    padding: 5px;

                    a {
                        font-weight: bold;
                        color: blue;
                    }
                }
            }
        }

        @media (max-width: 640px) {
            flex-wrap: wrap;
            width: 100%;
            div.snapshot-table {
                width: 100%;
            }
        }
    }
`;

export class IndexHistory extends Component<IndexHistoryProps, IndexHistoryState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            history: [],
        };
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

        items.reverse();

        console.log('Contents', items);

        this.setState({ history: items });
    }

    public render() {
        return(
            <StyledHistory>
                <div className="text">
                    <h2>Historical Snapshots</h2>
                </div>
                <div className="snapshots">
                    <div className="snapshot-table">
                        <h3>Mainnet</h3>
                        <table>
                            <thead>
                                <td>Date</td>
                                <td>Size</td>
                                <td>~</td>
                            </thead>
                            <tbody>
                                {this.state.history
                                .filter(item => item.Key.indexOf('mainnet') !== -1)
                                .map(item => {
                                    return(
                                        <tr>
                                            <td>{moment(new Date(item.LastModified)).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a')} EST</td>
                                            <td>{(Number(item.Size) / 1000000).toFixed(2)}mb</td>
                                            <td>
                                                <a className="download" href={`https://divi-snapshots.nyc3.digitaloceanspaces.com/${item.Key}`}>
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="snapshot-table">
                        <h3>Testnet</h3>
                        <table>
                            <thead>
                                <td>Date</td>
                                <td>Size</td>
                                <td>~</td>
                            </thead>
                            <tbody>
                                {this.state.history
                                .filter(item => item.Key.indexOf('testnet') !== -1)
                                .map(item => {
                                    return(
                                        <tr>
                                            <td>{moment(new Date(item.LastModified)).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a')} EST</td>
                                            <td>{(Number(item.Size) / 1000000).toFixed(2)}mb</td>
                                            <td>
                                                <a className="download" href={`https://divi-snapshots.nyc3.digitaloceanspaces.com/${item.Key}`}>
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </StyledHistory>
        );
    }
}
